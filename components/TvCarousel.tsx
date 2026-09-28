"use client";

import { useEffect, useRef, useState } from "react";
import { RecordCard } from "@/components/RecordCard";
import type { Recorde, Recordista } from "@/data/records";

const VISIVEIS = 3;
const PASSO_MS = 5000;
const ANIMACAO_MS = 700; // igual ao duration-700 da trilha

/**
 * Carrossel automático da /tv: 3 cards visíveis, avança 1 card a cada 5s.
 * Loop sem pulo: os 3 primeiros cards são repetidos no fim da trilha; ao chegar
 * neles, a posição volta para 0 sem transição (visualmente é o mesmo quadro).
 */
export function TvCarousel({ recordes, recordistas }: { recordes: Recorde[]; recordistas: Recordista[] }) {
  const n = recordes.length;
  const anda = n > VISIVEIS;
  const trilha = anda ? [...recordes, ...recordes.slice(0, VISIVEIS)] : recordes;

  const [pos, setPos] = useState(0);
  const [semAnimacao, setSemAnimacao] = useState(false);
  const [reduzido, setReduzido] = useState(false);
  const posRef = useRef(0);
  posRef.current = pos;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduzido(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!anda) return;
    const id = setInterval(() => {
      const atual = posRef.current;
      // Sem animação (reduced motion) ou ainda nos clones do fim: troca direto.
      if (reduzido || atual >= n) {
        setSemAnimacao(true);
        setPos(atual >= n ? 0 : (atual + 1) % n);
      } else {
        setSemAnimacao(false);
        setPos(atual + 1);
      }
    }, PASSO_MS);
    return () => clearInterval(id);
  }, [anda, n, reduzido]);

  // Chegou nos clones do fim: quando a animação termina, volta para 0 sem transição.
  useEffect(() => {
    if (pos < n) return;
    const id = setTimeout(() => {
      setSemAnimacao(true);
      setPos(0);
    }, ANIMACAO_MS);
    return () => clearTimeout(id);
  }, [pos, n]);

  const ativo = n ? pos % n : 0;

  return (
    <section aria-label="Recordes" className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <div
          style={{ transform: `translateX(calc(${-pos} * (100% + var(--gap)) / ${VISIVEIS}))` }}
          className={`flex h-full gap-(--gap) [--gap:1.75rem] ${
            semAnimacao ? "" : "transition-transform duration-700 ease-in-out"
          }`}
        >
          {trilha.map((r, i) => (
            <div
              key={`${r.id}-${i}`}
              aria-hidden={i >= n || undefined}
              className="h-full shrink-0 basis-[calc((100%-2*var(--gap))/3)]"
            >
              <RecordCard recorde={r} recordistas={recordistas} tv />
            </div>
          ))}
        </div>
      </div>

      {anda && (
        <div aria-hidden="true" className="mt-5 flex shrink-0 justify-center gap-2">
          {recordes.map((r, i) => (
            <span
              key={r.id}
              className={`h-2 rounded-full transition-all duration-500 ${i === ativo ? "w-7 bg-gold" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
