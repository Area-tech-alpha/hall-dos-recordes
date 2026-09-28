import Image from "next/image";

/** Logo da Alpha + Growth Academy. Aparece em /, no celular e na /tv. */
export function Header() {
  return (
    <header className="border-b border-white/6 bg-bg/90 tv:shrink-0">
      <div className="wrap flex min-h-18 items-center">
        <div className="flex items-center gap-4">
          <Image src="/logo-alpha.png" alt="Alpha" width={720} height={205} priority className="h-8 w-auto sm:h-9" />
          <span aria-hidden="true" className="h-9 w-px bg-white/12" />
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
