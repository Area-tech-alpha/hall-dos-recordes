"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INTERVALO_MS = 30 * 1000; // sem SSE
const INTERVALO_COM_SSE_MS = 2 * 60 * 1000; // com SSE conectado, o intervalo é só reserva
const DEBOUNCE_MS = 1000; // várias mudanças seguidas no ERP viram um refresh só
const REABRIR_MS = 30 * 1000; // o EventSource desiste sozinho em 4xx/5xx (ex.: deploy do ERP): reabre depois disso
const EVENTOS_URL = process.env.NEXT_PUBLIC_ERP_EVENTS_URL?.trim();

/**
 * Mantém / e /tv atualizadas sem recarregar a página:
 * - SSE do ERP (NEXT_PUBLIC_ERP_EVENTS_URL): a cada "hall-updated", router.refresh() com debounce de 1s.
 * - Intervalo de reserva: 2 min com o SSE conectado, 30s sem ele (ou sem a env).
 * - Aba em segundo plano: fecha o SSE e para o intervalo; ao voltar, atualiza na hora e reabre tudo.
 * O router.refresh() só reconcilia o que veio do servidor: a rolagem e o estado dos client
 * components (posição e timer do TvCarousel) ficam como estão, então se os dados não mudaram nada muda.
 */
export function AutoAtualizar() {
  const router = useRouter();
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | undefined;
    let debounce: ReturnType<typeof setTimeout> | undefined;
    let reabrir: ReturnType<typeof setTimeout> | undefined;
    let fonte: EventSource | null = null;
    let conectado = false;
    let caiu = false;

    const agendar = () => {
      clearInterval(intervalo);
      intervalo = setInterval(() => router.refresh(), conectado ? INTERVALO_COM_SSE_MS : INTERVALO_MS);
    };
    const mudarConexao = (agora: boolean) => {
      if (agora === conectado) return;
      conectado = agora;
      agendar();
    };
    const atualizarLogo = () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => router.refresh(), DEBOUNCE_MS);
    };

    const fechar = () => {
      clearTimeout(reabrir);
      clearTimeout(debounce);
      fonte?.close();
      fonte = null;
      conectado = false;
    };
    const abrir = () => {
      if (!EVENTOS_URL || fonte) return;
      const es = new EventSource(EVENTOS_URL);
      fonte = es;
      es.onopen = () => {
        // Reconectou depois de cair: pode ter perdido algum aviso nesse meio-tempo
        if (caiu) atualizarLogo();
        caiu = false;
        mudarConexao(true);
      };
      es.onerror = () => {
        caiu = true;
        mudarConexao(false);
        if (es.readyState === EventSource.CLOSED) {
          fechar();
          reabrir = setTimeout(abrir, REABRIR_MS);
        }
      };
      es.addEventListener("hall-updated", atualizarLogo);
    };

    const iniciar = () => {
      abrir();
      agendar();
    };
    const parar = () => {
      clearInterval(intervalo);
      fechar();
    };
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
        iniciar();
      } else {
        parar();
      }
    };

    if (document.visibilityState === "visible") iniciar();
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    return () => {
      parar();
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, [router]);
  return null;
}
