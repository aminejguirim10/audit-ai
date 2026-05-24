import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

type IconProps = {
  className?: string;
};

type IconComponent = ComponentType<IconProps>;

function ShieldIcon({ className }: IconProps) {
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
      <path d="M12 3 19 6v5c0 4.9-3.1 8.9-7 10-3.9-1.1-7-5.1-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
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

function MonitorIcon({ className }: IconProps) {
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
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

function ServerIcon({ className }: IconProps) {
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
      <rect x="4" y="4" width="16" height="6" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" />
      <path d="M8 7h.01" />
      <path d="M8 17h.01" />
      <path d="M12 7h4" />
      <path d="M12 17h4" />
    </svg>
  );
}

function ChatIcon({ className }: IconProps) {
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
      <path d="M4 5h16v10H8l-4 4V5Z" />
      <path d="M8 9h8" />
      <path d="M8 12h5" />
    </svg>
  );
}

function LockIcon({ className }: IconProps) {
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
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" />
      <path d="M12 14v3" />
    </svg>
  );
}

function GridIcon({ className }: IconProps) {
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
      <rect x="4" y="4" width="6" height="6" rx="1.5" />
      <rect x="14" y="4" width="6" height="6" rx="1.5" />
      <rect x="4" y="14" width="6" height="6" rx="1.5" />
      <rect x="14" y="14" width="6" height="6" rx="1.5" />
    </svg>
  );
}

function DeviceIcon({ className }: IconProps) {
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
      <rect x="3" y="5" width="18" height="11" rx="2" />
      <path d="M8 19h8" />
      <path d="M12 16v3" />
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

function GitHubIcon({ className }: IconProps) {
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
      <path d="M12 2.5c-5.2 0-9.5 4.3-9.5 9.5 0 4.2 2.7 7.7 6.4 8.9.5.1.8-.2.8-.5v-1.8c-2.6.6-3.1-1-3.1-1-.4-1-1-1.3-1-1.3-.8-.6.1-.6.1-.6.9.1 1.5 1 1.5 1 .8 1.4 2.1 1 2.6.8.1-.6.3-1 .6-1.2-2.1-.2-4.3-1.1-4.3-4.6 0-1 .3-1.8 1-2.4-.1-.2-.4-1 .1-2.1 0 0 .8-.3 2.5 1a8.6 8.6 0 0 1 4.5 0c1.8-1.3 2.5-1 2.5-1 .5 1.1.2 1.9.1 2.1.6.6 1 1.4 1 2.4 0 3.5-2.2 4.3-4.4 4.6.3.3.6.8.6 1.6v2.5c0 .3.3.6.8.5 3.7-1.2 6.4-4.7 6.4-8.9 0-5.2-4.3-9.5-9.5-9.5Z" />
    </svg>
  );
}

function FlowIcon({ className }: IconProps) {
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
      <path d="M5 7h6" />
      <path d="M13 17h6" />
      <path d="M13 7h6" />
      <path d="M5 17h6" />
      <path d="M11 7 9 9" />
      <path d="M11 17 9 15" />
      <path d="M13 7 15 9" />
      <path d="M13 17 15 15" />
    </svg>
  );
}

function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(9,20,37,0.92),rgba(6,14,28,0.98))] shadow-[0_30px_100px_rgba(2,10,22,0.42)] backdrop-blur-xl ${className}`}
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

function Badge({
  icon: Icon,
  children,
  className = "",
}: {
  icon: IconComponent;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-sky-200/15 bg-white/5 px-3 py-1 text-xs font-medium text-sky-50/90 shadow-[0_10px_24px_rgba(1,5,15,0.22)] ${className}`}
    >
      <Icon className="h-3.5 w-3.5 text-sky-300" />
      {children}
    </span>
  );
}

function SectionHeading({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: IconComponent;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.34em] text-sky-100/70">
          <Icon className="h-3.5 w-3.5 text-sky-300" />
          {eyebrow}
        </div>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-4xl">
          {title}
        </h2>
      </div>
      <p className="max-w-xl text-sm leading-6 text-slate-300">{description}</p>
    </div>
  );
}

interface RepoCardData {
  icon: IconComponent;
  label: string;
  title: string;
  description: string;
  href: string;
  tags: readonly string[];
}

interface RouteCardData {
  icon: IconComponent;
  label: string;
  title: string;
  description: string;
  note: string;
  cta: string;
  href?: string;
}

const heroBadges = [
  { icon: FlowIcon, label: "Chat correctif" },
  { icon: DeviceIcon, label: "Accès réservé" },
] as const;

const heroStats = [
  { icon: GridIcon, value: "02", label: "dépôts accessibles" },
  { icon: ChatIcon, value: "01", label: "démo publique" },
  { icon: LockIcon, value: "01", label: "usage interne" },
  { icon: DeviceIcon, value: "100%", label: "adaptée aux écrans" },
] as const;

const repoCards: readonly RepoCardData[] = [
  {
    icon: MonitorIcon,
    label: "Front-end",
    title: "audit-management-front",
    description:
      "Interface Angular 20 pour les portails admin, auditeur, audité et étudiant, avec tableaux de bord, chat en temps réel et gestion des profils.",
    href: "https://github.com/aminejguirim10/audit-management-front",
    tags: ["Angular 20", "Tailwind CSS 4", "WebSocket", "Supabase"],
  },
  {
    icon: ServerIcon,
    label: "Back-end",
    title: "audit-management-back",
    description:
      "API Spring Boot 4 qui expose les audits, la sécurité JWT, les notifications, la messagerie temps réel et les conversations IA.",
    href: "https://github.com/aminejguirim10/audit-management-back",
    tags: ["Java 17", "Spring Boot 4", "JPA", "JWT"],
  },
];

const routeCards: readonly RouteCardData[] = [
  {
    icon: ChatIcon,
    label: "Démo publique",
    title: "Chat correctif",
    description:
      "Teste la route /chat pour transformer des questions d'audit mal répondues en actions correctives priorisées.",
    note: "Accessible directement depuis cette landing page.",
    cta: "Ouvrir /chat",
    href: "/chat",
  },
  {
    icon: LockIcon,
    label: "Réservé dans la plateforme",
    title: "Conversation Audité",
    description:
      "La fonctionnalité de conversation streaming reste intégrée au portail principal pour le rôle Audité et n'a pas de page publique dédiée.",
    note: "Aucune route publique n'est exposée ici.",
    cta: "Réservé au portail interne",
  },
];

function RouteCard({
  card,
  large = false,
}: {
  card: RouteCardData;
  large?: boolean;
}) {
  const Icon = card.icon;

  return (
    <div
      className={`group rounded-[28px] border border-white/10 bg-white/5 ${
        large ? "p-6" : "p-5"
      } transition duration-300 hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/10`}
    >
      <div className="flex items-start gap-4">
        <IconFrame className="group-hover:scale-[1.02]">
          <Icon className="h-5 w-5 text-sky-100" />
        </IconFrame>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-sky-100/60">
              {card.label}
            </p>
            {!card.href ? (
              <span className="rounded-full border border-sky-300/15 bg-sky-400/10 px-2.5 py-1 text-[11px] font-medium text-sky-100/80">
                Audité uniquement
              </span>
            ) : null}
          </div>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white">
            {card.title}
          </h3>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">
        {card.description}
      </p>

      <p className="mt-4 text-xs uppercase tracking-[0.26em] text-sky-100/55">
        {card.note}
      </p>

      {card.href ? (
        <Link
          href={card.href}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7fd0ff_0%,#5ba1ff_48%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_38px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5"
        >
          {card.cta}
          <ArrowIcon className="h-4 w-4" />
        </Link>
      ) : (
        <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-sky-50/85">
          <LockIcon className="h-4 w-4 text-sky-200" />
          {card.cta}
        </span>
      )}
    </div>
  );
}

function RepoCard({ card }: { card: RepoCardData }) {
  const Icon = card.icon;

  return (
    <Panel className="flex h-full flex-col p-6 lg:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <IconFrame>
            <Icon className="h-5 w-5 text-sky-100" />
          </IconFrame>
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-sky-100/60">
              {card.label}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
              {card.title}
            </h3>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-white/5 px-3 py-1 text-xs font-medium text-sky-100/80">
          <GitHubIcon className="h-3.5 w-3.5 text-sky-200" />
          GitHub
        </span>
      </div>

      <p className="mt-5 text-sm leading-7 text-slate-300">
        {card.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-sky-300/15 bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-100/85"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={card.href}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#7fd0ff_0%,#5ba1ff_48%,#3b82f6_100%)] px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_16px_38px_rgba(59,130,246,0.28)] transition hover:-translate-y-0.5"
      >
        <GitHubIcon className="h-4 w-4 text-slate-950" />
        Voir sur GitHub
      </a>
    </Panel>
  );
}

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 text-slate-100 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(89,161,255,0.25),transparent_28%),radial-gradient(circle_at_top_right,rgba(25,118,255,0.18),transparent_24%),radial-gradient(circle_at_bottom_center,rgba(4,19,42,0.98),transparent_38%)]" />
      <div className="pointer-events-none absolute left-[-4rem] top-24 h-64 w-64 rounded-full bg-sky-500/12 blur-3xl" />
      <div className="pointer-events-none absolute right-[-5rem] top-56 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[length:100%_96px] opacity-20" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-10 pb-20 pt-5 lg:gap-12">
        <header className="flex flex-col gap-4 rounded-[30px] border border-white/10 bg-white/5 px-5 py-4 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <IconFrame className="h-11 w-11 rounded-2xl">
              <ShieldIcon className="h-5 w-5 text-sky-100" />
            </IconFrame>
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-sky-100/60">
                Audit AI
              </p>
              <p className="text-sm font-medium text-white/90">
                Chat correctif{" "}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {heroBadges.map((badge) => (
              <Badge key={badge.label} icon={badge.icon}>
                {badge.label}
              </Badge>
            ))}
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-5">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.38em] text-sky-100/60">
                  Audit Management
                </p>
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.08em] text-white sm:text-6xl lg:text-7xl">
                  Accédez au chat correctif et aux ressources du projet.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                  <span className="font-semibold text-white">/chat</span> pour
                  générer des actions correctives, tout en signalant que la
                  conversation Audité reste réservée dans la plateforme
                  principale.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7fd0ff_0%,#5ba1ff_48%,#3b82f6_100%)] px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_42px_rgba(59,130,246,0.3)] transition hover:-translate-y-0.5"
              >
                <ChatIcon className="h-4 w-4 text-slate-950" />
                Tester le chat correctif
              </Link>
              <Link
                href="#reserved"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-sky-50 transition hover:-translate-y-0.5 hover:border-sky-300/25 hover:bg-white/10"
              >
                <LockIcon className="h-4 w-4 text-sky-200" />
                Voir l&apos;accès réservé
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <Panel key={stat.label} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-3xl font-semibold tracking-[-0.05em] text-white">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {stat.label}
                        </p>
                      </div>
                      <IconFrame className="h-10 w-10 rounded-xl">
                        <Icon className="h-4 w-4 text-sky-100" />
                      </IconFrame>
                    </div>
                  </Panel>
                );
              })}
            </div>
          </div>

          <Panel className="p-6 lg:p-7">
            <div className="absolute right-6 top-6 h-36 w-36 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="absolute left-8 top-36 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.34em] text-sky-100/60">
                    Accès rapides
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                    Le chat correctif est public, l&apos;autre usage reste dans
                    la plateforme.
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {routeCards.map((card) => (
                  <RouteCard key={card.title} card={card} />
                ))}
              </div>

              <div className="mt-6 rounded-[24px] border border-sky-300/15 bg-sky-500/6 p-4">
                <div className="flex gap-3">
                  <IconFrame className="h-10 w-10 rounded-xl">
                    <ShieldIcon className="h-4 w-4 text-sky-100" />
                  </IconFrame>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      La route /audite-chat n&apos;est plus exposée
                      publiquement.
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-300">
                      La conversation IA Audité reste accessible depuis la
                      plateforme principale, pas depuis cette page.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </section>

        <section id="repositories" className="space-y-5">
          <SectionHeading
            icon={GridIcon}
            eyebrow="Liens utiles"
            title="Les deux dépôts du projet"
            description="Les liens ci-dessous donnent accès au front Angular et au backend Spring Boot utilisés par la plateforme."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {repoCards.map((card) => (
              <RepoCard key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section id="reserved" className="space-y-5">
          <SectionHeading
            icon={LockIcon}
            eyebrow="Accès réservé"
            title="La fonctionnalité Audité reste dans la plateforme"
            description="Cette landing sert de point d'entrée public. La partie conversationnelle réservée à Audité n'a pas de page autonome pour éviter toute confusion côté test."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {routeCards.map((card) => (
              <RouteCard key={card.title} card={card} large />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
