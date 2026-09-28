"use client";

import { useEffect } from "react";

/**
 * Abra a página com ?tv para rolagem automática contínua (modo TV).
 * Rola devagar até o fim, pausa, volta ao topo e recomeça.
 */
export function TvMode() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("tv")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("tv");
    const speed = Number(params.get("tv")) || 1; // multiplicador: ?tv=2 rola 2x mais rápido
    const PAUSE_MS = 6000;
    let raf = 0;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let pausedUntil = performance.now() + PAUSE_MS;
    let last = performance.now();
    let pos = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (now >= pausedUntil) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        pos += (window.innerHeight / 22000) * dt * speed; // ~22s por tela
        if (pos >= max) {
          pos = max;
          window.scrollTo(0, pos);
          pausedUntil = Infinity; // parado no fim até o timer voltar ao topo
          resetTimer = setTimeout(() => {
            pos = 0;
            window.scrollTo({ top: 0, behavior: "smooth" });
            pausedUntil = performance.now() + PAUSE_MS;
          }, PAUSE_MS);
        } else {
          window.scrollTo(0, pos);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resetTimer);
      document.documentElement.classList.remove("tv");
    };
  }, []);

  return null;
}
