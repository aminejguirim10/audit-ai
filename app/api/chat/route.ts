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
    if (normalized.includes(keyword)) return priority;
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
  if (!value) return timelineFromPriority(priority);
  const raw = value.trim();
  const normalized = normalize(raw);
  if (forbiddenTimeUnitsRegex.test(normalized))
    return timelineFromPriority(priority);
  if (normalized.includes("immediat") || normalized.includes("jour"))
    return realisticTimelines.immediate;
  if (normalized.includes("court") || normalized.includes("semaine"))
    return realisticTimelines.shortTerm;
  if (normalized.includes("moyen") || normalized.includes("mois"))
    return realisticTimelines.mediumTerm;
  if (normalized.includes("long") || normalized.includes("trimestre"))
    return realisticTimelines.longTerm;
  if (normalized.includes("structurel") || normalized.includes("annee"))
    return realisticTimelines.structural;
  return timelineFromPriority(priority);
}

function buildDetailedDescription(question: string): string {
  return [
    `- Cause racine probable: non-conformite sur "${question}" liee a une procedure insuffisamment formalisee ou a un controle interne non regulier.`,
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
  if (!text) return buildDetailedDescription(question);
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
  if (!formatted) return buildDetailedDescription(question);
  const hasAllSections = descriptionSectionLabels.every((s) =>
    formatted.includes(s),
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

function parseActionFromText(
  text: string,
  question: string,
): CorrectiveAction | null {
  const candidates: string[] = [text.trim()];
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fencedMatch?.[1]) candidates.unshift(fencedMatch[1].trim());

  for (const candidate of candidates) {
    // Tente d'abord un objet JSON unique
    const objStart = candidate.indexOf("{");
    const objEnd = candidate.lastIndexOf("}");
    if (objStart >= 0 && objEnd > objStart) {
      try {
        const parsed = JSON.parse(candidate.slice(objStart, objEnd + 1));
        const validated = correctiveActionSchema.safeParse(parsed);
        if (validated.success) return validated.data;
      } catch {
        /* continue */
      }
    }

    // Tente un tableau JSON (compatibilité)
    const arrStart = candidate.indexOf("[");
    const arrEnd = candidate.lastIndexOf("]");
    if (arrStart >= 0 && arrEnd > arrStart) {
      try {
        const parsed = JSON.parse(candidate.slice(arrStart, arrEnd + 1));
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validated = correctiveActionSchema.safeParse(parsed[0]);
          if (validated.success) return validated.data;
        }
      } catch {
        /* continue */
      }
    }
  }

  return null;
}

async function generateActionForQuestion(
  question: string,
): Promise<CorrectiveAction> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      temperature: 0.35,
      system:
        "Tu es un consultant senior en audit qualite pour un etablissement scolaire (ENICarthage). " +
        "Reponds uniquement en francais professionnel. " +
        "Ton objectif est de produire une action corrective claire, operationnelle et realiste " +
        "specifiquement adaptee a la question posee, en tenant compte de son domaine precis " +
        "(pedagogique, administratif, securite, hygiene, RH, infrastructure, numerique, communication, conformite).",

      prompt: [
        "Retourne strictement un objet JSON valide (pas un tableau, un seul objet).",
        "L'objet doit avoir exactement ces champs: title, description, temps_estime, priority.",
        "",
        `Question mal repondue: "${question}"`,
        "",
        "Regles strictes:",
        `- title: exactement ce texte: "${question}"`,
        "- description: analyse approfondie et specifique a CETTE question. Inclure obligatoirement ces 7 sections dans cet ordre:",
        "  * Cause racine probable: (specifique au domaine de la question)",
        "  * Actions correctives detaillees: (etapes concretes et adaptees)",
        "  * Alternatives possibles: (3 scenarios: faible cout, standard, renforce)",
        "  * Responsables: (roles pertinents pour ce type de probleme)",
        "  * Preuves attendues: (documents/traces specifiques au contexte)",
        "  * Risques si non traite: (consequences reelles liees a CE probleme)",
        "  * Indicateurs de verification: (KPIs mesurables pour CE domaine)",
        "- Chaque section commence par un tiret et son contenu est sur la meme ligne.",
        "- temps_estime: exactement l'une de ces valeurs: IMMEDIAT (0 a 7 jours) | COURT TERME (2 a 4 semaines) | MOYEN TERME (1 a 3 mois) | LONG TERME (1 trimestre scolaire) | STRUCTUREL (1 annee scolaire)",
        "- priority: exactement l'une de ces valeurs: CRITICAL | HIGH | MEDIUM | LOW",
        "- Aucun texte avant ou apres le JSON.",
      ].join("\n"),
    });

    const action = parseActionFromText(text, question);
    if (!action) return buildFallbackAction(question);

    const priority = action.priority ?? priorityFromQuestion(question);
    return {
      title: question,
      description: ensureDetailedDescription(action.description, question),
      temps_estime: normalizeTimeline(action.temps_estime, priority),
      priority,
    };
  } catch {
    return buildFallbackAction(question);
  }
}

export const maxDuration = 60;

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
    const actions = await Promise.all(
      failedQuestions.map((question) => generateActionForQuestion(question)),
    );

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
      { error: "Generation impossible pour le moment.", details: message },
      { status: 500, headers: corsHeaders },
    );
  }
}
