/** Estado vazio (API do ERP fora do ar ou resposta inválida), no mesmo visual dos cards. */
export function SemRecordes() {
  return (
    <section
      aria-live="polite"
      className="mb-16 grid place-items-center rounded-[1.15rem] border border-line bg-card px-6 py-16 text-center tv:mb-0 tv:min-h-0 tv:flex-1"
    >
      <div className="max-w-md">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold/12 text-gold">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current">
            <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
          </svg>
        </span>
        <h2 className="mt-5 text-2xl font-bold">Recordes indisponíveis no momento</h2>
        <p className="mt-2 text-muted">Estamos atualizando o Hall dos Recordes. Volte em alguns minutos.</p>
      </div>
    </section>
  );
}
