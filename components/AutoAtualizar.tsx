"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVALO_MS = 30 * 1000;

/**
 * Busca os recordes de novo a cada 30s, sem recarregar a página (/ e /tv).
 * Com a aba em segundo plano, pausa; ao voltar, atualiza na hora e retoma o intervalo.
 * O router.refresh() só reconcilia o que veio do servidor: a rolagem e o estado dos client
 * components (posição e timer do TvCarousel) ficam como estão, então se os dados não mudaram nada muda.
 */
export function AutoAtualizar() {
  const router = useRouter();
  useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined;
    const iniciar = () => {
      clearInterval(id);
      id = setInterval(() => router.refresh(), INTERVALO_MS);
    };
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        iniciar();
      } else {
        clearInterval(id);
      }
    };
    if (document.visibilityState === "visible") iniciar();
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, [router]);
  return null;
}
