/** Só a logo. Navegação e badge ADM ficam para a área admin (Fase 2). */
export function Header() {
  return (
    <header className="border-b border-white/6 bg-bg/90">
      <div className="wrap flex min-h-18 items-center">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex h-11 items-center gap-1 rounded-lg border border-line bg-linear-135 from-[#2a1f0c] to-[#120d06] px-2.5 text-gold"
          >
            <span className="text-[0.8rem] font-bold tracking-tight text-ink">alpha</span>
            <svg viewBox="0 0 40 40" className="size-7">
              <path d="M9 6l24 14L9 34z" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" />
              <path d="M15 14l10 6-10 6z" fill="currentColor" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <strong className="text-xl font-bold">
              Growth <span className="text-gold">Academy</span>
            </strong>
            <small className="mt-0.5 text-[0.7rem] tracking-[0.12em] text-muted uppercase">
              Assessoria Alpha · Evolução do time
            </small>
          </span>
        </div>
      </div>
    </header>
  );
}
