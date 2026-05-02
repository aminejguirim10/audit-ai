import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { z } from "zod";

import { buildCorsHeaders, buildCorsOptionsResponse } from "@/lib/cors";

const priorityEnum = z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]);

const requestSchema = z.object({
  failedQuestions: z.array(z.string().trim().min(3)).min(1).max(100),
});

const correctiveActionSchema = z.object({
  title: z.string().min(3).describe("Même titre que la question mal répondue."),
  description: z
    .string()
    .min(20)
    .describe(
      "Action corrective detaillee avec sections sur des lignes separees, precedees d'un tiret.",
    ),
  temps_estime: z
    .string()
    .min(3)
    .describe(
      "Echelle realiste audit scolaire: IMMEDIAT, COURT TERME, MOYEN TERME, LONG TERME, STRUCTUREL (jamais en minutes/heures).",
    ),
  priority: priorityEnum.describe(
    "Priorité professionnelle basée sur le risque audit et l'urgence.",
  ),
});

type CorrectiveAction = z.infer<typeof correctiveActionSchema>;

const correctiveActionArraySchema = z.array(correctiveActionSchema);

const fallbackPriorities: Record<string, z.infer<typeof priorityEnum>> = {
  critique: "CRITICAL",
  securite: "CRITICAL",
  incendie: "CRITICAL",
  evacuation: "CRITICAL",
  violence: "CRITICAL",
  harcelement: "CRITICAL",
  urgence: "CRITICAL",
  conformité: "HIGH",
  conformite: "HIGH",
  juridique: "HIGH",
  reglementaire: "HIGH",
  hygiene: "HIGH",
  sanitaire: "HIGH",
  accessibilite: "HIGH",
  protection: "HIGH",
  donnees: "HIGH",
  pedagogique: "MEDIUM",
  apprentissage: "MEDIUM",
  evaluation: "MEDIUM",
  communication: "MEDIUM",
  infrastructure: "MEDIUM",
  maintenance: "LOW",
};

const realisticTimelines = {
  immediate: "IMMEDIAT (0 a 7 jours)",
  shortTerm: "COURT TERME (2 a 4 semaines)",
  mediumTerm: "MOYEN TERME (1 a 3 mois)",
  longTerm: "LONG TERME (1 trimestre scolaire)",
  structural: "STRUCTUREL (1 annee scolaire)",
} as const;

const forbiddenTimeUnitsRegex =
  /(^|\b)(min|mn|minute|minutes|heure|heures)(\b|$)|\d+\s*h(\b|\d)/i;

const descriptionSectionLabels = [
  "Cause racine probable:",
  "Actions correctives detaillees:",
  "Alternatives possibles:",
  "Responsables:",
  "Preuves attendues:",
  "Risques si non traite:",
  "Indicateurs de verification:",
];

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function priorityFromQuestion(question: string): z.infer<typeof priorityEnum> {
  const normalized = normalize(question);

  for (const [keyword, priority] of Object.entries(fallbackPriorities)) {
    if (normalized.includes(keyword)) {
      return priority;
    }
  }

  return "MEDIUM";
}

function timelineFromPriority(
  priority: z.infer<typeof priorityEnum>,
): (typeof realisticTimelines)[keyof typeof realisticTimelines] {
  switch (priority) {
    case "CRITICAL":
      return realisticTimelines.immediate;
    case "HIGH":
      return realisticTimelines.shortTerm;
    case "MEDIUM":
      return realisticTimelines.mediumTerm;
    case "LOW":
      return realisticTimelines.longTerm;
    default:
      return realisticTimelines.mediumTerm;
  }
}

function normalizeTimeline(
  value: string | undefined,
  priority: z.infer<typeof priorityEnum>,
): string {
  if (!value) {
    return timelineFromPriority(priority);
  }

  const raw = value.trim();
  const normalized = normalize(raw);

  if (forbiddenTimeUnitsRegex.test(normalized)) {
    return timelineFromPriority(priority);
  }

  if (normalized.includes("immediat") || normalized.includes("jour")) {
    return realisticTimelines.immediate;
  }

  if (normalized.includes("court") || normalized.includes("semaine")) {
    return realisticTimelines.shortTerm;
  }

  if (normalized.includes("moyen") || normalized.includes("mois")) {
    return realisticTimelines.mediumTerm;
  }

  if (normalized.includes("long") || normalized.includes("trimestre")) {
    return realisticTimelines.longTerm;
  }

  if (normalized.includes("structurel") || normalized.includes("annee")) {
    return realisticTimelines.structural;
  }

  return timelineFromPriority(priority);
}

function buildDetailedDescription(question: string): string {
  return [
    `- Cause racine probable: non-conformite sur \"${question}\" liee a une procedure insuffisamment formalisee ou a un controle interne non regulier.`,
    "- Actions correctives detaillees: verifier les exigences, formaliser une procedure, former les acteurs, mettre en place un controle periodique et reevaluer l'efficacite.",
    "- Alternatives possibles: faible cout (checklists + reorganisation), standard (formation ciblee + supervision), renforce (accompagnement externe + audit blanc).",
    "- Responsables: direction, responsable qualite, referent pedagogique/administratif, pilote du processus concerne.",
    "- Preuves attendues: procedure validee, feuilles de presence, comptes rendus de suivi, enregistrements de controle et preuves de correction.",
    "- Risques si non traite: recurrence des non-conformites, impact sur la securite/qualite pedagogique et risque reglementaire.",
    "- Indicateurs de verification: taux de conformite, delai de cloture des ecarts, taux de personnel forme, baisse des non-conformites repetitives.",
  ].join("\n");
}

function formatDescription(description: string, question: string): string {
  let text = description.trim();

  if (!text) {
    text = buildDetailedDescription(question);
  }

  text = text.replace(/\r\n/g, "\n");

  for (const label of descriptionSectionLabels) {
    const labelRegex = new RegExp(`\\s*-?\\s*${escapeRegExp(label)}`, "g");
    text = text.replace(labelRegex, `\n- ${label}`);
  }

  for (const label of descriptionSectionLabels) {
    const inlineRegex = new RegExp(`- ${escapeRegExp(label)}\\s*\n+\\s*`, "g");
    text = text.replace(inlineRegex, `- ${label} `);
  }

  return text.replace(/^\n+/, "").trim();
}

function ensureDetailedDescription(
  description: string,
  question: string,
): string {
  const formatted = formatDescription(description, question);

  if (!formatted) {
    return buildDetailedDescription(question);
  }

  const hasAllSections = descriptionSectionLabels.every((section) =>
    formatted.includes(section),
  );

  return hasAllSections ? formatted : buildDetailedDescription(question);
}

function buildFallbackAction(question: string): CorrectiveAction {
  const priority = priorityFromQuestion(question);

  return {
    title: question,
    description: buildDetailedDescription(question),
    temps_estime: timelineFromPriority(priority),
    priority,
  };
}

function parseActionsFromText(text: string): CorrectiveAction[] {
  const candidates: string[] = [text.trim()];

  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) {
    candidates.unshift(fencedMatch[1].trim());
  }

  for (const candidate of candidates) {
    const start = candidate.indexOf("[");
    const end = candidate.lastIndexOf("]");

    if (start < 0 || end <= start) {
      continue;
    }

    const jsonSlice = candidate.slice(start, end + 1);

    try {
      const parsedJson = JSON.parse(jsonSlice);
      const validated = correctiveActionArraySchema.safeParse(parsedJson);

      if (validated.success) {
        return validated.data;
      }
    } catch {
      // On continue avec un autre candidat si le parse JSON echoue.
    }
  }

  return [];
}

export const maxDuration = 30;

export async function OPTIONS(request: Request) {
  return buildCorsOptionsResponse(request);
}

export async function POST(req: Request) {
  const corsHeaders = buildCorsHeaders(req);
  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error: "Payload invalide. Utilisez { failedQuestions: string[] }.",
        details: parsed.error.flatten(),
      },
      { status: 400, headers: corsHeaders },
    );
  }

  const failedQuestions = parsed.data.failedQuestions;

  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      temperature: 0.2,
      system:
        "Tu es un consultant senior en audit qualite pour un etablissement scolaire (ENICarthage). Reponds uniquement en francais professionnel. Ton objectif est de produire, pour chaque question mal repondue, une action corrective claire, operationnelle et realiste pour un contexte scolaire.",
      prompt: [
        "Retourne strictement un JSON valide.",
        "Le JSON doit etre un tableau d'objets avec les champs exacts: title, description, temps_estime, priority.",
        "Genere exactement une action corrective par question, dans le meme ordre.",
        "Le champ title doit etre exactement le texte de la question.",
        "Le champ description doit etre claire et exploitable, sans etre trop longue.",
        "Le champ description doit inclure explicitement ces sections dans cet ordre: Cause racine probable:, Actions correctives detaillees:, Alternatives possibles:, Responsables:, Preuves attendues:, Risques si non traite:, Indicateurs de verification:.",
        "Chaque section doit commencer sur une nouvelle ligne.",
        "Le texte de chaque section doit etre sur la meme ligne apres le deux-points (pas de retour a la ligne apres le titre).",
        "Ne pas ajouter de section Constat.",
        "Dans Alternatives possibles:, fournir au minimum trois scenarios: faible cout, standard, renforce.",
        "Prendre en compte, selon la question, les dimensions pedagogique, administrative, securite, hygiene, RH, infrastructure, numerique, communication et conformite reglementaire.",
        "Le champ temps_estime ne doit jamais contenir minutes ou heures.",
        "Le champ temps_estime doit etre une des valeurs suivantes: IMMEDIAT (0 a 7 jours), COURT TERME (2 a 4 semaines), MOYEN TERME (1 a 3 mois), LONG TERME (1 trimestre scolaire), STRUCTUREL (1 annee scolaire).",
        "Le choix du temps_estime doit etre realiste pour un audit d'ecole et coherent avec l'ampleur de l'action.",
        "Le champ priority doit etre l'une des valeurs: CRITICAL, HIGH, MEDIUM, LOW.",
        "Attribuer priority selon le risque pour la securite, la conformite legale, la continuite pedagogique et l'impact sur les eleves.",
        "N'ajoute aucune explication avant ou apres le JSON.",
        "Questions mal repondues:",
        ...failedQuestions.map(
          (question, index) => `${index + 1}. ${question}`,
        ),
      ].join("\n"),
    });

    const generatedActions = parseActionsFromText(text);

    // Garantit une action pour chaque question, meme si la sortie du modele est partielle.
    const indexedByTitle = new Map<string, CorrectiveAction>(
      generatedActions.map((item) => [normalize(item.title), item]),
    );

    const actions = failedQuestions.map((question) => {
      const candidate = indexedByTitle.get(normalize(question));
      const priority = candidate?.priority ?? priorityFromQuestion(question);

      if (!candidate) {
        return buildFallbackAction(question);
      }

      return {
        title: question,
        description: ensureDetailedDescription(candidate.description, question),
        temps_estime: normalizeTimeline(candidate.temps_estime, priority),
        priority,
      };
    });

    return Response.json(
      {
        totalQuestions: failedQuestions.length,
        generatedAt: new Date().toISOString(),
        actions,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erreur inconnue durant la generation IA.";

    return Response.json(
      {
        error: "Generation impossible pour le moment.",
        details: message,
      },
      { status: 500, headers: corsHeaders },
    );
  }
}
