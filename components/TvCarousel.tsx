"use client";

import { useEffect, useState } from "react";
import { RecordCard } from "@/components/RecordCard";
import type { Recorde, Recordista } from "@/data/records";

const VISIVEIS = 3;
const PASSO_MS = 5000;
const VOLTA_MS = 750; // um pouco mais que a transição (700ms)

/**
 * Carrossel da /tv: 3 cards visíveis, avança 1 a cada 5s, em loop infinito sem pulo.
 * Os 3 primeiros cards são repetidos no fim; ao chegar neles, volta para 0 sem transição
 * (visualmente é o mesmo quadro) e religa a transição dois frames depois.
 */
export function TvCarousel({ recordes, recordistas }: { recordes: Recorde[]; recordistas: Recordista[] }) {
  const total = recordes.length;
  const anda = total > VISIVEIS;
  const slides = anda ? [...recordes, ...recordes.slice(0, VISIVEIS)] : recordes;

  const [i, setI] = useState(0);
  const [animar, setAnimar] = useState(true);
  const [reduzido, setReduzido] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduzido(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!anda) return;
    const t = setInterval(() => {
      // Garante a transição ligada mesmo se o rAF da volta não rodou (aba em segundo plano pausa o rAF)
      setAnimar(true);
      setI((x) => x + 1);
    }, PASSO_MS);
    return () => clearInterval(t);
  }, [anda]);

  // Chegou nas cópias do fim: volta ao início sem transição
  useEffect(() => {
    if (!anda || i < total) return;
    let raf = 0;
    const t = setTimeout(
      () => {
        setAnimar(false);
        setI(0);
        raf = requestAnimationFrame(() => {
          raf = requestAnimationFrame(() => setAnimar(true));
        });
      },
      reduzido ? 0 : VOLTA_MS,
    );
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [i, total, anda, reduzido]);

  const ativo = total ? i % total : 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden">
        <ul
          className="flex h-full gap-6"
          style={{
            transform: `translateX(calc(${-i} * (100% + 1.5rem) / ${VISIVEIS}))`,
            transition: animar && !reduzido ? "transform 700ms ease-in-out" : "none",
          }}
        >
          {slides.map((r, k) => (
            <li
              key={`${r.id}-${k}`}
              aria-hidden={k >= total || undefined}
              className="h-full shrink-0 basis-[calc((100%-3rem)/3)]"
            >
              <RecordCard recorde={r} recordistas={recordistas} tv />
            </li>
          ))}
        </ul>
      </div>

      {anda && (
        <div aria-hidden="true" className="mt-5 flex shrink-0 justify-center gap-2">
          {recordes.map((r, k) => (
            <span
              key={r.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${k === ativo ? "w-8 bg-gold" : "w-1.5 bg-white/20"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
