# Hall dos Recordes

LP pública do Hall dos Recordes da Alpha: **https://recordes.assessorialpha.com**

- **`/`**: computador e celular.
- **`/tv`**: versão para a TV 55" (https://recordes.assessorialpha.com/tv).

Next.js 16 (App Router) + TypeScript + Tailwind v4 + `next/image`, na Vercel.

## De onde vêm os recordes

Os recordes e recordistas são geridos no **ERP**, em **Growth Academy → Gestão dos recordes**. Esta LP não tem
login nem edição: ela só consome a API pública do ERP.

- `getHallData()` em `lib/hall.ts` busca `GET ${ERP_API_URL}/public/hall-of-fame` (sem autenticação) e converte
  a resposta para o formato interno em `lib/hall-erp.ts`. Basta `ERP_API_URL` definida para usar o ERP.
- **Só aparecem recordes publicados e membros ativos**: rascunhos e membros inativos são filtrados pelo próprio ERP.
- **Edições no ERP aparecem em até ~60s** (cache de 60s, tag `hall`), ou na hora se o ERP chamar o
  `/api/revalidate` (abaixo). A `/tv` busca de novo a cada 5 minutos, sem recarregar a página.
- A resposta é validada com Zod, incluindo o envelope (`success: true`). Se a API cair, responder
  `success: false` ou vier fora do formato, o erro vai para o log da Vercel e a página continua no ar com o
  último retorno válido do ERP ou, na falta dele, com os recordes locais.
- **Recordes locais** (`data/records-local.ts` + fotos em `public/images/`): os 19 recordes da Fase 1. Usados
  sem `ERP_API_URL` e como reserva se o ERP falhar.
- A contagem **×N** dos recordistas é calculada aqui, a partir dos participantes de cada recorde.

### Contrato

```jsonc
// GET ${ERP_API_URL}/public/hall-of-fame   (Cache-Control: max-age=60)
{
  "success": true,
  "data": {
    "members": [   // membros ativos, já ordenados
      { "id": "m1", "name": "Italo Silva", "track": "SDR", "recordCount": 4,
        "photoUrl": "/public/hall-of-fame/members/m1/photo?v=3" }   // ou null
    ],
    "records": [   // só publicados, na ordem do ERP
      { "id": "r1", "value": "09,01%", "title": "Menor no-show do mês", "description": "…",   // description pode ser null
        "coverUrl": "/public/hall-of-fame/records/r1/cover?v=2",   // capa opcional (ou null)
        "members": [ { "id": "m1", "name": "Italo Silva", "track": "SDR", "photoUrl": "…" } ] }
    ]
  }
}
```

Como vira o card:

- O **primeiro membro** do recorde é o recordista principal; os demais viram as outras tags do card.
- A **área (SDR/CLOSER) de cada tag é o `track` que vem dentro do recorde** (o cargo na época do recorde), não o
  cargo atual do membro. O cargo mostrado na faixa de recordistas é o `track` atual do membro.
- **Foto:** `photoUrl` é relativo à base da API e responde 302 para uma URL assinada do S3; o `next/image` segue o
  redirecionamento. Membro sem foto aparece com `/images/sem-foto.svg`.
- **Capa:** `coverUrl` (relativo à base da API, como a foto). Sem capa, o card usa as fotos dos participantes; com
  mais de 4 participantes, só os 4 primeiros entram na capa, e as tags mostram todos.
- **Textos fora do padrão** são cortados com "…" e o corte vai para o log: valor 14, título 60, descrição 110 e
  nome 22 caracteres. No card, título e descrição param em 2 linhas e o valor fica numa linha só.
- Recorde sem membros é descartado (com aviso no log).

### Atualização na hora (opcional)

A rota fica pronta caso o ERP passe a chamar depois de salvar um recorde:

```bash
curl -X POST https://recordes.assessorialpha.com/api/revalidate   -H "x-revalidate-secret: $HALL_REVALIDATE_SECRET"
# 200 {"ok":true} · sem o secret certo: 401
```

## Variáveis (Vercel > Settings > Environment Variables)

| Variável | Para quê |
| --- | --- |
| `ERP_API_URL` | Base da API do ERP, sem barra no final (ex.: `https://api.erp.assessorialpha.com`). Sem ela, a LP usa os recordes locais. |
| `ERP_IMAGES_HOST` | Host do S3 para onde as fotos redirecionam (ex.: `nome-do-bucket.s3.amazonaws.com` ou `*.s3.amazonaws.com`). |
| `HALL_REVALIDATE_SECRET` | Opcional. Secret que o ERP mandaria em `POST /api/revalidate`. Gere com `openssl rand -base64 32`. |

As duas primeiras são lidas também no build (liberam as imagens em `next.config.mjs`): depois de mudar, faça um
novo deploy. Localmente, copie `.env.example` para `.env`.

## Rodar

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build de produção (o mesmo que a Vercel roda)
```

Sem `ERP_API_URL`, ou com o ERP fora do ar, a LP sobe mesmo assim, com os recordes locais.

Teste da conversão do contrato: `node scripts/test-hall-erp.mjs`.

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
