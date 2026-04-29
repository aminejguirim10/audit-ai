"use client";

import { useState } from "react";

type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

type CorrectiveAction = {
  title: string;
  description: string;
  temps_estime: string;
  priority: Priority;
};

const priorityStyle: Record<Priority, string> = {
  CRITICAL: "bg-red-100 text-red-800 border border-red-200",
  HIGH: "bg-orange-100 text-orange-800 border border-orange-200",
  MEDIUM: "bg-amber-100 text-amber-800 border border-amber-200",
  LOW: "bg-emerald-100 text-emerald-800 border border-emerald-200",
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
].join("\n");

export default function Page() {
  const [rawQuestions, setRawQuestions] = useState("");
  const [draftQuestion, setDraftQuestion] = useState("");
  const [actions, setActions] = useState<CorrectiveAction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "done" | "error">(
    "idle",
  );

  const failedQuestions = rawQuestions
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  const questionBankCount = auditQuestionBank.split("\n").length;

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
    setRawQuestions(auditQuestionBank);
    setError(null);
  }

  async function onCopyQuestionBank() {
    try {
      await navigator.clipboard.writeText(auditQuestionBank);
      setCopyStatus("done");
    } catch {
      setCopyStatus("error");
    }

    window.setTimeout(() => {
      setCopyStatus("idle");
    }, 1800);
  }

  async function onGenerate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (failedQuestions.length === 0) {
      setError("Ajoutez au moins une question mal repondue.");
      setActions([]);
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

      const payload = await response.json();

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
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Erreur inattendue.";
      setError(message);
      setActions([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#ecfeff,_#f8fafc_45%,_#ffffff)] px-4 py-10 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <section className="rounded-3xl border border-cyan-100 bg-white/90 p-6 shadow-sm md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800">
            Audit Intelligence - NEI Carthage
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-4xl">
            Generation d&apos;actions correctives (non stream)
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
            Ajoutez vos questions mal repondues dans le champ ci-dessous.
            Utilisez aussi la box de 20 questions d&apos;audit pour
            copier-coller rapidement et tester le flux.
          </p>
        </section>

        <section className="mt-6 rounded-3xl border border-cyan-200 bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Box test: {questionBankCount} questions d&apos;audit
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Copiez ce bloc ou injectez-le directement dans le champ de
                saisie.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onCopyQuestionBank}
                className="rounded-xl border border-cyan-300 bg-white px-3 py-2 text-sm font-medium text-cyan-800 transition hover:bg-cyan-100"
              >
                Copier les 20 questions
              </button>
              <button
                type="button"
                onClick={onUseQuestionBank}
                className="rounded-xl bg-cyan-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
              >
                Inserer dans le champ
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={auditQuestionBank}
            rows={10}
            className="mt-4 w-full rounded-2xl border border-cyan-200 bg-white/90 px-4 py-3 text-sm leading-6 text-slate-700 outline-none"
          />

          {copyStatus === "done" ? (
            <p className="mt-3 text-xs font-medium text-emerald-700">
              Questions copiees dans le presse-papiers.
            </p>
          ) : null}
          {copyStatus === "error" ? (
            <p className="mt-3 text-xs font-medium text-red-700">
              Copie impossible. Utilisez Ctrl+C apres selection manuelle.
            </p>
          ) : null}
        </section>

        <form
          onSubmit={onGenerate}
          className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label
            htmlFor="draft-question"
            className="block text-sm font-medium text-slate-700"
          >
            Champ texte: ajouter une question mal repondue
          </label>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              id="draft-question"
              type="text"
              value={draftQuestion}
              onChange={(event) => setDraftQuestion(event.currentTarget.value)}
              placeholder="Ex: Le controle d'acces n'est pas applique la nuit"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            />
            <button
              type="button"
              onClick={onAddQuestion}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
            >
              Ajouter
            </button>
          </div>

          <label className="mt-5 block text-sm font-medium text-slate-700">
            Liste finale des questions mal repondues (une ligne = une question)
          </label>
          <textarea
            value={rawQuestions}
            onChange={(event) => setRawQuestions(event.currentTarget.value)}
            rows={8}
            className="mt-3 w-full resize-y rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200"
            placeholder="Ex: Le plan d'evacuation est-il affiche dans tous les etages ?"
          />

          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Total detecte: {failedQuestions.length} question(s)
            </p>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Generation en cours..." : "Generer les actions"}
            </button>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </form>

        <section className="mt-6 space-y-4">
          {actions.map((action, index) => (
            <article
              key={`${action.title}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  {action.title}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyle[action.priority]}`}
                >
                  {action.priority}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
                {action.description}
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-500">
                Temps estime: {action.temps_estime}
              </p>
            </article>
          ))}

          {!isLoading && actions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-500">
              Les actions generees apparaitront ici.
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
