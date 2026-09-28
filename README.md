# Hall dos Recordes

LP pública do Hall dos Recordes da Alpha: **https://recordes.assessorialpha.com**

- **`/`**: computador e celular.
- **`/tv`**: versão para a TV 55" (https://recordes.assessorialpha.com/tv).

Next.js 16 (App Router) + TypeScript + Tailwind v4 + `next/image`, na Vercel.

## De onde vêm os recordes

Os recordes e recordistas são geridos no **ERP**, em **Growth Academy → Gestão dos recordes**. Esta LP não tem
login nem edição: ela só consome a API do ERP.

- `getHallData()` em `lib/hall.ts` busca `GET ${ERP_API_URL}/public/growth-academy/hall` com o header
  `x-api-key: HALL_API_KEY`. A chave fica só no servidor e nunca vai para o navegador.
- A resposta é validada com Zod. Se a API cair ou responder fora do formato, o erro vai para o log da Vercel e
  a página continua no ar com o último retorno válido do ERP ou, na falta dele, com os recordes locais.
- **Recordes locais** (`data/records-local.ts` + fotos em `public/images/`): são os 19 recordes da Fase 1. A LP
  usa esses dados enquanto `ERP_API_URL`/`HALL_API_KEY` não estiverem configuradas e como reserva se o ERP falhar.
  Quando o ERP estiver no ar, os dados dele têm prioridade. "Recordes indisponíveis no momento" só aparece se
  não houver recorde em nenhuma das fontes.
- Cache de 60s (tag `hall`): uma alteração no ERP aparece em até 1 minuto, ou na hora se o ERP chamar o
  `/api/revalidate` (abaixo).
- A `/tv` busca os dados de novo a cada 5 minutos, sem recarregar a página.
- A contagem **×N** dos recordistas é calculada aqui, a partir dos participantes de cada recorde.

### Formato da resposta

```jsonc
{
  "recordes": [
    {
      "id": "no-show",
      "valor": "09,01%",
      "titulo": "Menor no-show do mês",
      "descricao": "Recorde de no-show mais baixo de um SDR em um mês.",
      "area": "SDR",                // "SDR" | "CLOSER": área do recordista principal
      "recordistaId": "italo",      // recordista principal
      "imagem": null,               // capa opcional; sem capa, o card usa as fotos dos participantes
      "coRecordistas": [{ "recordistaId": "gabriel", "area": "CLOSER" }] // opcional
    }
  ],
  "recordistas": [
    { "id": "italo", "nome": "Italo Silva", "cargo": "SDR", "foto": "https://storage.../italo.jpg" } // "SDR" | "Closer"
  ]
}
```

Os recordes aparecem na ordem da lista. As fotos precisam estar no host de `ERP_IMAGES_HOST`.

### Atualização na hora (webhook do ERP)

Depois de salvar um recorde, o ERP pode chamar:

```bash
curl -X POST https://recordes.assessorialpha.com/api/revalidate \
  -H "x-revalidate-secret: $HALL_REVALIDATE_SECRET"
# 200 {"ok":true} · sem o secret certo: 401
```

A próxima visita a `/` ou `/tv` já busca os dados novos. A TV aberta pega a mudança na próxima atualização
(até 5 min).

## Variáveis (Vercel > Settings > Environment Variables)

| Variável | Para quê |
| --- | --- |
| `ERP_API_URL` | URL base da API do ERP, sem barra no final. |
| `HALL_API_KEY` | Chave enviada em `x-api-key`. Só servidor: **não** use o prefixo `NEXT_PUBLIC_`. |
| `HALL_REVALIDATE_SECRET` | Secret que o ERP manda em `POST /api/revalidate`. Gere com `openssl rand -base64 32`. |
| `ERP_IMAGES_HOST` | Host do storage das fotos (ex.: `storage.seu-erp.com` ou `*.supabase.co`). Liberado em `next.config.mjs`. |

Mudou `ERP_IMAGES_HOST`? Faça um novo deploy: ele é lido no build. Localmente, copie `.env.example` para `.env`.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (o mesmo que a Vercel roda)
```

Sem a API configurada ou acessível, a LP sobe mesmo assim, com os recordes locais.

## Telas

São duas rotas. O layout de TV **não** depende do tamanho da tela, porque computador e TV costumam ter a mesma
resolução (1920×1080).

- **`/`: computador e celular.**
  - Computador: grade com rolagem, 2 a 4 colunas (4 a partir de 1920px), com cabeçalho e descrição nos cards.
    Acima de 1600px tudo escala com a tela.
  - Celular (até 640px): 1 card por linha, e a rolagem encaixa card a card. Os recordistas ficam numa faixa
    que arrasta para o lado.
- **`/tv`: TV 55"**. Quadro 16:9 fixo, sem rolagem e sem cursor, em 1080p e 4K, com a mesma estrutura do
  computador: no topo, o logo, o título e os recordistas numa linha. Embaixo, um carrossel com 3 cards (iguais aos
  do computador) que avança 1 card a cada 5s, em loop e sem pulo, com bolinhas indicando a posição. Funciona com
  qualquer quantidade de recordes; com 3 ou menos, os cards ficam parados. Com "reduzir movimento" ativado no
  sistema, a troca acontece sem animação.

## Logo

`public/logo-alpha.png` (720×205, fundo transparente). Aparece no header de `/`, do celular e da `/tv`.
