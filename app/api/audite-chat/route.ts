import { groq } from "@ai-sdk/groq";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

import { buildCorsHeaders, buildCorsOptionsResponse } from "@/lib/cors";

const assistantRoleSchema = z.enum(["AUDITE", "CONSEILLER"]);
const auditCriterionSchema = z.enum([
  "SECURITE",
  "ENSEIGNEMENT",
  "FINANCIER",
  "CONFORMITE_REGLEMENTAIRE",
  "RESSOURCES_HUMAINES",
  "INFRASTRUCTURE",
  "GOUVERNANCE",
  "VIE_ETUDIANTE",
]);

type AuditCriterion = z.infer<typeof auditCriterionSchema>;

const criterionGuides: Record<
  AuditCriterion,
  {
    label: string;
    objectives: string;
    evidence: string;
    risks: string;
  }
> = {
  SECURITE: {
    label: "Securite",
    objectives:
      "Prevenir les incidents, garantir la protection des personnes et assurer la preparedness aux urgences.",
    evidence:
      "Plans d evacuation, registres d incidents, exercices, controles des equipements, fiches de maintenance.",
    risks:
      "Accidents, non-conformites critiques, interruption des activites et exposition legale.",
  },
  ENSEIGNEMENT: {
    label: "Enseignement",
    objectives:
      "Assurer la qualite pedagogique, la coherence des programmes et le suivi des acquis des etudiants.",
    evidence:
      "Plans de cours, grilles d evaluation, preuves de suivi, rapports de progression et revues pedagogiques.",
    risks:
      "Baisse des performances, ecarts de niveau, non-satisfaction et perte de credibilite academique.",
  },
  FINANCIER: {
    label: "Financier",
    objectives:
      "Maitriser les couts, garantir la tracabilite des depenses et renforcer la fiabilite des processus budgetaires.",
    evidence:
      "Budgets approuves, justificatifs, rapprochements, controles internes et tableaux de bord financiers.",
    risks:
      "Derive budgetaire, irregularites, pertes financieres et non-conformite de gouvernance.",
  },
  CONFORMITE_REGLEMENTAIRE: {
    label: "Conformite reglementaire",
    objectives:
      "Respecter les exigences legales, normatives et institutionnelles applicables a l etablissement.",
    evidence:
      "Registres de conformite, procedures signees, preuves d audit interne, plans d actions et validations.",
    risks:
      "Sanctions, blocages administratifs, litiges et image institutionnelle degradee.",
  },
  RESSOURCES_HUMAINES: {
    label: "Ressources humaines",
    objectives:
      "Structurer les responsabilites, developper les competences et maintenir un cadre de travail performant.",
    evidence:
      "Fiches de poste, plans de formation, evaluations, comptes rendus d entretiens et indicateurs RH.",
    risks:
      "Turnover, desalignement des equipes, conflits internes et baisse de performance globale.",
  },
  INFRASTRUCTURE: {
    label: "Infrastructure",
    objectives:
      "Maintenir des locaux, equipements et services techniques conformes, fiables et disponibles.",
    evidence:
      "Journal de maintenance, controles periodiques, taux de disponibilite et plans de continuite.",
    risks:
      "Pannes recurrentes, indisponibilite des services et impact direct sur l activite pedagogique.",
  },
  GOUVERNANCE: {
    label: "Gouvernance",
    objectives:
      "Clarifier la prise de decision, piloter par indicateurs et assurer l alignement strategique des actions.",
    evidence:
      "Comptes rendus de comites, tableaux de bord de pilotage, feuilles de route et arbitrages documentes.",
    risks:
      "Actions incoherentes, retards de decision, inefficacite organisationnelle et manque de responsabilisation.",
  },
  VIE_ETUDIANTE: {
    label: "Vie etudiante",
    objectives:
      "Ameliorer l experience etudiante, la qualite des services d accompagnement et l environnement de reussite.",
    evidence:
      "Enquetes de satisfaction, plans d accompagnement, registre des reclamations et actions de suivi.",
    risks:
      "Insatisfaction, desengagement, hausse des reclamations et deterioration de l attractivite.",
  },
};

const requestSchema = z.object({
  messages: z.array(z.any()).min(1).max(60),
  assistantRole: assistantRoleSchema.optional().default("AUDITE"),
  schoolContext: z.string().trim().max(1200).optional(),
  auditScope: z.string().trim().max(600).optional(),
  auditCriterion: auditCriterionSchema.optional().default("SECURITE"),
  criterionContext: z.string().trim().max(900).optional(),
});

function countImageParts(messages: unknown[]): number {
  let total = 0;

  for (const message of messages) {
    if (!message || typeof message !== "object") {
      continue;
    }

    const maybeParts = (message as { parts?: unknown }).parts;
    if (!Array.isArray(maybeParts)) {
      continue;
    }

    for (const part of maybeParts) {
      if (!part || typeof part !== "object") {
        continue;
      }

      const maybeFilePart = part as { type?: unknown; mediaType?: unknown };
      const isImagePart =
        maybeFilePart.type === "file" &&
        typeof maybeFilePart.mediaType === "string" &&
        maybeFilePart.mediaType.startsWith("image/");

      if (isImagePart) {
        total += 1;
      }
    }
  }

  return total;
}

function buildSystemPrompt(input: {
  assistantRole: z.infer<typeof assistantRoleSchema>;
  schoolContext?: string;
  auditScope?: string;
  auditCriterion: AuditCriterion;
  criterionContext?: string;
  uploadedImageCount: number;
}): string {
  const criterionGuide = criterionGuides[input.auditCriterion];

  const roleInstruction =
    input.assistantRole === "CONSEILLER"
      ? "L'utilisateur joue surtout le role de conseiller qualite."
      : "L'utilisateur joue surtout le role d'audite (chef de departement).";

  const contextInstruction = input.schoolContext
    ? `Contexte etablissement: ${input.schoolContext}`
    : "Contexte etablissement: non fourni.";

  const scopeInstruction = input.auditScope
    ? `Perimetre d'audit prioritaire: ${input.auditScope}`
    : "Perimetre d'audit prioritaire: a clarifier avec des questions courtes.";

  const criterionInstruction = [
    `Critere principal pour ce message: ${criterionGuide.label}.`,
    `Objectifs du critere: ${criterionGuide.objectives}`,
    `Preuves attendues pour ce critere: ${criterionGuide.evidence}`,
    `Risques majeurs si le critere n'est pas maitrise: ${criterionGuide.risks}`,
  ].join("\n");

  const criterionContextInstruction = input.criterionContext
    ? `Contexte specifique du critere fourni par l'utilisateur: ${input.criterionContext}`
    : "Contexte specifique du critere: non fourni. Pose des questions de precision si necessaire.";

  const imageInstruction =
    input.uploadedImageCount > 0
      ? `L'utilisateur a fourni ${input.uploadedImageCount} image(s) dans la conversation. Analyse aussi ces images et relie tes recommandations au critere principal.`
      : "Aucune image n'est fournie pour ce tour. Base ton analyse sur le texte et demande des preuves visuelles si utile.";

  return [
    "Tu es un conseiller senior en audit qualite scolaire pour un etablissement d'enseignement superieur.",
    "Tu fonctionnes comme un copilote IA de reference pour le monde de l'audit: clair, pragmatique, utile, et adapte au besoin reel de l'utilisateur.",
    "Tu aides l'audite (chef de departement) et le conseiller a prendre des decisions concretes pour ameliorer la qualite de l'ecole et reussir les audits.",
    roleInstruction,
    contextInstruction,
    scopeInstruction,
    criterionInstruction,
    criterionContextInstruction,
    imageInstruction,
    "Reponds uniquement en francais professionnel, clair et actionnable.",
    "Adopte un ton sobre, credible et executif: concis, precis, sans section decorative non demandee.",
    "Adapte le format de reponse a la demande: reponse courte, checklist, plan detaille, comparaison d'options, message pret a envoyer, ou questions de clarification.",
    "N'impose jamais automatiquement une structure fixe en 5 etapes.",
    "Si l'utilisateur demande explicitement un plan, propose un plan concret et priorise avec delais et responsables.",
    `Le critere principal de ce tour est strictement '${criterionGuide.label}'. N'en declare pas un autre comme critere principal.`,
    "Si tu poses une question de clarification, elle doit rester strictement dans le critere principal selectionne.",
    "Relie chaque action proposee au critere selectionne et explique pourquoi cette action est prioritaire pour ce critere.",
    "Quand pertinent, separe explicitement ce que doit faire l'Audite et ce que doit faire le Conseiller.",
    "Quand des images sont fournies, commence par des observations factuelles de ce qui est visible, puis propose des corrections, des verifications de conformite et des conseils pratiques relies au critere.",
    "Si une image est floue ou insuffisante, dis-le clairement et demande au maximum 3 precisions utiles.",
    "N'ajoute pas de section finale 'Formulation de communication terrain'. Propose un script de communication uniquement si l'utilisateur le demande explicitement.",
    "Si une information manque, pose au plus trois questions de clarification precises.",
    "Ne fournis pas de diagnostic medical, legal ou disciplinaire definitif. Signale les limites et recommande une validation interne si necessaire.",
  ].join("\n");
}

export const maxDuration = 30;

export async function OPTIONS(request: Request) {
  return buildCorsOptionsResponse(request);
}

export async function POST(request: Request) {
  const corsHeaders = buildCorsHeaders(request);
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      {
        error:
          "Payload invalide. Utilisez { messages, assistantRole?, schoolContext?, auditScope?, auditCriterion?, criterionContext? }.",
        details: parsed.error.flatten(),
      },
      { status: 400, headers: corsHeaders },
    );
  }

  try {
    const uploadedImageCount = countImageParts(parsed.data.messages);

    const modelMessages = await convertToModelMessages(
      parsed.data.messages as UIMessage[],
    );

    const result = streamText({
      model: groq("meta-llama/llama-4-scout-17b-16e-instruct"),
      temperature: 0.25,
      system: buildSystemPrompt({
        assistantRole: parsed.data.assistantRole,
        schoolContext: parsed.data.schoolContext,
        auditScope: parsed.data.auditScope,
        auditCriterion: parsed.data.auditCriterion,
        criterionContext: parsed.data.criterionContext,
        uploadedImageCount,
      }),
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse({
      headers: corsHeaders,
      onError: () => "Generation impossible pour le moment.",
    });
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
