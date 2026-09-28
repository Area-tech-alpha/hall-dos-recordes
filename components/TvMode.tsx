"use client";

import { useEffect } from "react";

/** ?tv na URL esconde o cursor (para a TV). O layout de TV é automático por tamanho de tela. */
export function TvMode() {
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("tv")) return;
    document.documentElement.classList.add("tv");
    return () => document.documentElement.classList.remove("tv");
  }, []);

  return null;
}
