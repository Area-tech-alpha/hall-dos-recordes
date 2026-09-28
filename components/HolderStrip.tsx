import Image from "next/image";
import type { Recordista } from "@/data/records";

export function HolderStrip({ recordistas }: { recordistas: Recordista[] }) {
  return (
    <ul className="mt-8 flex flex-wrap gap-x-1 gap-y-5 sm:gap-x-1.5 sm:gap-y-6">
      {recordistas.map((p) => (
        <li key={p.id} className="flex w-[5.1rem] flex-col items-center text-center sm:w-[7.5rem]">
          <div className="relative size-[4.3rem] rounded-full bg-bg p-[0.3rem] shadow-[0_0_0_0.16rem_var(--color-gold),0_0_1.4rem_rgb(247_181_43/0.18)] sm:size-[5.6rem]">
            <div className="relative size-full overflow-hidden rounded-full">
              <Image src={p.foto} alt={p.nome} fill sizes="8rem" className="object-cover" />
            </div>
            {p.qtdRecordes > 1 && (
              <span className="absolute -top-0.5 -right-2 grid h-7 min-w-7 place-items-center rounded-full bg-gold px-1.5 text-[0.78rem] font-extrabold text-gold-ink shadow-[0_0_0_0.18rem_var(--color-bg)]">
                ×{p.qtdRecordes}
              </span>
            )}
          </div>
          <span className="mt-3 text-[0.85rem] leading-tight font-semibold sm:text-[0.95rem]">{p.nome}</span>
          <span className="mt-1 text-[0.8rem] text-muted">{p.cargo}</span>
        </li>
      ))}
    </ul>
  );
}
