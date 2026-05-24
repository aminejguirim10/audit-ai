"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

type IconProps = {
  className?: string;
};

type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type CorrectiveAction = {
  title: string;
  description: string;
  temps_estime: string;
  priority: Priority;
};

type ChatResponse = {
  totalQuestions?: number;
  generatedAt?: string;
  actions?: CorrectiveAction[];
  error?: string;
};

const priorityStyle: Record<Priority, string> = {
  CRITICAL: "border border-red-400/25 bg-red-500/15 !text-red-50",
  HIGH: "border border-orange-400/25 bg-orange-500/15 !text-orange-50",
  MEDIUM: "border border-amber-400/25 bg-amber-500/15 !text-amber-50",
  LOW: "border border-emerald-400/25 bg-emerald-500/15 !text-emerald-50",
};

const auditQuestionBank = [
  "Le registre des incidents de securite est-il a jour ?",
  "Les extincteurs sont-ils controles selon le planning ?",
  "Le plan d'evacuation est-il affiche a chaque etage ?",
  "Les issues de secours sont-elles libres de tout obstacle ?",
  "Les employes portent-ils les EPI obligatoires ?",
  "Les produits dangereux sont-ils etiquetes correctement ?",
  "Les fiches de donnees de securite sont-elles accessibles ?",
  "Les zones de stockage sont-elles ventilees et conformes ?",
  "Les alarmes incendie sont-elles testees periodiquement ?",
  "Les trousses de premiers secours sont-elles completes ?",
  "Les formations securite sont-elles realisees et tracees ?",
  "Les acces aux locaux sensibles sont-ils controles ?",
  "Le materiel electrique est-il inspecte regulierement ?",
  "Les dechets speciaux sont-ils elimines selon la procedure ?",
  "Les non-conformites sont-elles documentees et suivies ?",
  "Les audits precedents ont-ils des actions cloturees ?",
  "Les contrats de maintenance sont-ils valides ?",
  "Les capteurs critiques sont-ils calibres dans les delais ?",
  "Les protocoles d'urgence sont-ils connus par les equipes ?",
  "Le tableau de bord HSE est-il mis a jour mensuellement ?",
];

const heroStats = [
  {
    icon: ClipboardIcon,
    value: "20",
    label: "questions prêtes",
  },
  {
    icon: SparkIcon,
    value: "1",
    label: "route de génération",
  },
  {
    icon: ClockIcon,
    value: "Rapide",
    label: "retour attendu",
  },
] as const;

const workflowSteps = [
  {
    title: "Charger le banc",
    description:
      "Copiez les 20 questions ou collez votre propre liste de questions mal répondues.",
  },
  {
    title: "Ajuster le contenu",
    description:
      "Ajoutez les questions réellement échouées pour refléter le contexte de votre audit.",
  },
  {
    title: "Générer les actions",
    description:
      "Lancez la route /api/chat pour récupérer un plan d'action classé par priorité.",
  },
] as const;

function ClipboardIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M9 4h6a2 2 0 0 1 2 2v12H7V6a2 2 0 0 1 2-2Z" />
      <path d="M9 4a3 3 0 0 1 6 0" />
      <path d="M9 10h6" />
      <path d="M9 14h6" />
    </svg>
  );
}

function SparkIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2Z" />
      <path d="M19 14.5 20 18l3.5 1-3.5 1L19 23l-1-3.5-3.5-1 3.5-1 1-3Z" />
    </svg>
  );
}

function ClockIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

function ArrowIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

function SurfaceCard({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <article
      id={id}
      className={`relative overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,20,37,0.92),rgba(6,14,28,0.98))] p-6 shadow-[0_30px_100px_rgba(2,10,22,0.42)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,145,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(42,201,255,0.08),transparent_30%)]" />
      <div className="relative">{children}</div>
    </article>
  );
}

function IconFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const hasHeight = /\bh-\d+/.test(className) || className.includes("h-fit") || className.includes("h-full");
  const hasWidth = /\bw-\d+/.test(className) || className.includes("w-fit") || className.includes("w-full");
  const hasRounded = /\brounded-/.test(className);

  return (
    <div
      className={`flex shrink-0 items-center justify-center border border-sky-300/15 bg-[linear-gradient(180deg,rgba(86,167,255,0.22),rgba(10,27,50,0.7))] bg-clip-padding text-sky-100 shadow-[0_16px_34px_rgba(19,62,123,0.36)] ${
        hasHeight ? "" : "h-12"
      } ${hasWidth ? "" : "w-12"} ${hasRounded ? "" : "rounded-2xl"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function ChatPage() {
  const [rawQuestions, setRawQuestions] = useState("");
  const [draftQuestion, setDraftQuestion] = useState("");
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "done" | "error">(
    "idle",
  );
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const failedQuestions = rawQuestions
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const questionBankCount = auditQuestionBank.length;

  function onAddQuestion() {
    const cleanQuestion = draftQuestion.trim();
    if (!cleanQuestion) {
      return;
    }

    setRawQuestions((previous) => {
      if (!previous.trim()) {
        return cleanQuestion;
      }
      return `${previous.trimEnd()}\n${cleanQuestion}`;
    });
    setDraftQuestion("");
  }

  function onUseQuestionBank() {
    setRawQuestions(auditQuestionBank.join("\n"));
    setError(null);
  }

  async function onCopyQuestionBank() {
    try {
      await navigator.clipboard.writeText(auditQuestionBank.join("\n"));
      setCopyStatus("done");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1800);
  }

  async function onGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (failedQuestions.length === 0) {
      setError("Ajoutez au moins une question mal repondue.");
      setActions([]);
      setGeneratedAt(null);
      setTotalQuestions(0);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ failedQuestions }),
      });

      const payload = (await response.json()) as ChatResponse;

      if (!response.ok) {
        const message =
          typeof payload?.error === "string"
            ? payload.error
            : "Erreur API pendant la generation.";
        throw new Error(message);
      }

      const nextActions = Array.isArray(payload?.actions)
        ? (payload.actions as CorrectiveAction[])
        : [];

      setActions(nextActions);
      setGeneratedAt(payload?.generatedAt ?? null);
      setTotalQuestions(payload?.totalQuestions ?? failedQuestions.length);
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Erreur inattendue.";
      setError(message);
      setActions([]);
      setGeneratedAt(null);
      setTotalQuestions(0);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(89,161,255,0.18),transparent_26%),radial-gradient(circle_at_top_left,rgba(25,118,255,0.14),transparent_22%),radial-gradient(circle_at_bottom_center,rgba(4,19,42,0.98),transparent_38%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-24 h-64 w-64 rounded-full bg-sky-500/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] top-56 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:100%_96px] opacity-20" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 pb-16 pt-5">
        <header className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <IconFrame>
              <SparkIcon className="h-5 w-5" />
            </IconFrame>
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-sky-100/60">
                Route /chat
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-0.05em] sm:text-3xl">
                Génération d&apos;actions correctives à partir des questions mal
                répondues.
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-300">
                Collez un banc de questions, ajustez les réponses manquantes,
                puis lancez la génération pour obtenir un plan d&apos;action
                priorisé.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
          >
            <ArrowIcon className="h-4 w-4" />
            Retour à l&apos;accueil
          </Link>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <SurfaceCard className="p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <IconFrame>
                <ClipboardIcon className="h-5 w-5" />
              </IconFrame>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-sky-100/60">
                  Banc de test
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  {questionBankCount} questions d&apos;audit prêtes à copier.
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Utilisez ce bloc pour simuler un audit, puis envoyez-le à la
                  route{" "}
                  <span className="font-semibold text-white">/api/chat</span>.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {heroStats.map((stat) => {
                const StatIcon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-white">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {stat.label}
                        </p>
                      </div>
                      <IconFrame className="h-10 w-10 rounded-xl shadow-none">
                        <StatIcon className="h-4 w-4" />
                      </IconFrame>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyQuestionBank}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                <ClipboardIcon className="h-4 w-4" />
                Copier les 20 questions
              </button>
              <button
                type="button"
                onClick={onUseQuestionBank}
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7fd0ff_0%,#5ba1ff_48%,#3b82f6_100%)] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_38px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5"
              >
                <SparkIcon className="h-4 w-4 text-slate-950" />
                Insérer dans le champ
              </button>
              <Link
                href="#results"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Voir les résultats
              </Link>
            </div>

            <textarea
              readOnly
              value={auditQuestionBank.join("\n")}
              rows={12}
              className="mt-5 w-full rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
            />

            {copyStatus === "done" ? (
              <p className="mt-3 text-xs font-medium text-emerald-300">
                Questions copiées dans le presse-papiers.
              </p>
            ) : null}
            {copyStatus === "error" ? (
              <p className="mt-3 text-xs font-medium text-red-300">
                Copie impossible. Utilisez Ctrl+C après sélection manuelle.
              </p>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="p-6 lg:p-7">
            <div className="flex items-start gap-4">
              <IconFrame>
                <ClockIcon className="h-5 w-5" />
              </IconFrame>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-sky-100/60">
                  Mode de test
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                  Une réponse courte et un résultat clair.
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start gap-3">
                    <IconFrame className="h-8 w-8 rounded-full text-xs font-semibold shadow-none">
                      {index + 1}
                    </IconFrame>
                    <div>
                      <h3 className="text-base font-semibold tracking-[-0.03em]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm leading-7 text-slate-300">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[24px] border border-sky-300/15 bg-sky-500/6 p-4">
              <div className="flex gap-3">
                <IconFrame className="h-10 w-10 rounded-2xl shadow-none">
                  <SparkIcon className="h-4 w-4" />
                </IconFrame>
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    Route consommée par /api/chat
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    La route transforme les questions mal répondues en actions
                    correctives priorisées.
                  </p>
                </div>
              </div>
            </div>
          </SurfaceCard>
        </section>

        <section
          id="generator"
          className="grid gap-5 lg:grid-cols-[0.96fr_1.04fr]"
        >
          <div className="space-y-5">
            <SurfaceCard className="p-6 lg:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-100/60">
                Banc de test
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                {questionBankCount} questions d&apos;audit prêtes à copier.
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Utilisez ce bloc pour simuler un audit, puis envoyez-le à la
                route{" "}
                <span className="font-semibold text-white">/api/chat</span>.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onCopyQuestionBank}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:bg-white/10"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  Copier les 20 questions
                </button>
                <button
                  type="button"
                  onClick={onUseQuestionBank}
                  className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7fd0ff_0%,#5ba1ff_48%,#3b82f6_100%)] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_38px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5"
                >
                  <SparkIcon className="h-4 w-4 text-slate-950" />
                  Insérer dans le champ
                </button>
              </div>

              <textarea
                readOnly
                value={auditQuestionBank.join("\n")}
                rows={12}
                className="mt-5 w-full rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
              />

              {copyStatus === "done" ? (
                <p className="mt-3 text-xs font-medium text-emerald-300">
                  Questions copiées dans le presse-papiers.
                </p>
              ) : null}
              {copyStatus === "error" ? (
                <p className="mt-3 text-xs font-medium text-red-300">
                  Copie impossible. Utilisez Ctrl+C après sélection manuelle.
                </p>
              ) : null}
            </SurfaceCard>

            <SurfaceCard className="p-6 lg:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-sky-100/60">
                Mode de test
              </p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                <p>
                  La route consomme une liste de questions mal répondues et
                  renvoie des actions correctives structurées par priorité.
                </p>
                <p>
                  Elle est idéale pour valider la qualité du prompt, le format
                  JSON et les contraintes de priorisation du moteur IA.
                </p>
              </div>
            </SurfaceCard>
          </div>

          <div className="space-y-5">
            <SurfaceCard className="p-6 lg:p-7">
              <form onSubmit={onGenerate} className="space-y-5">
                <div>
                  <label
                    htmlFor="draft-question"
                    className="block text-sm font-medium"
                  >
                    Ajouter une question mal repondue
                  </label>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="draft-question"
                      type="text"
                      value={draftQuestion}
                      onChange={(event) =>
                        setDraftQuestion(event.currentTarget.value)
                      }
                      placeholder="Ex: Le controle d'acces n'est pas applique la nuit"
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/20"
                    />
                    <button
                      type="button"
                      onClick={onAddQuestion}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="failed-questions"
                    className="block text-sm font-medium"
                  >
                    Liste finale des questions mal repondues
                  </label>
                  <textarea
                    id="failed-questions"
                    value={rawQuestions}
                    onChange={(event) =>
                      setRawQuestions(event.currentTarget.value)
                    }
                    rows={9}
                    className="mt-3 w-full resize-y rounded-[24px] border border-white/10 bg-slate-950/45 px-4 py-3 text-sm leading-7 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/20"
                    placeholder="Ex: Le plan d'evacuation est-il affiche dans tous les etages ?"
                  />
                </div>

                <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1 text-sm text-slate-300">
                    <p>Total detecte: {failedQuestions.length} question(s)</p>
                    {generatedAt ? (
                      <p>
                        Derniere generation:{" "}
                        {new Date(generatedAt).toLocaleString("fr-FR")}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7fd0ff_0%,#5ba1ff_48%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_38px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <SparkIcon className="h-4 w-4 text-slate-950" />
                    {isLoading
                      ? "Generation en cours..."
                      : "Generer les actions"}
                  </button>
                </div>

                {error ? (
                  <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </p>
                ) : null}
              </form>
            </SurfaceCard>

            <SurfaceCard id="results" className="p-6 lg:p-7">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-sky-100/60">
                    Resultats
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    Actions correctives generees
                  </h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-sky-100/80">
                  {totalQuestions || failedQuestions.length || 0} question(s)
                </span>
              </div>

              <div className="mt-5 space-y-4">
                {actions.map((action, index) => (
                  <article
                    key={`${action.title}-${index}`}
                    className="rounded-[24px] border border-white/10 bg-white/5 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold tracking-[-0.03em]">
                        {action.title}
                      </h3>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle[action.priority]}`}
                      >
                        {action.priority}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-300">
                      {action.description}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-sky-100/60">
                      Temps estime: {action.temps_estime}
                    </p>
                  </article>
                ))}

                {!isLoading && actions.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-white/10 bg-white/5 p-6 text-sm leading-7 text-slate-300">
                    Les actions generees apparaitront ici apres l&apos;envoi du
                    banc de questions.
                  </div>
                ) : null}
              </div>
            </SurfaceCard>
          </div>
        </section>
      </div>
    </main>
  );
}
