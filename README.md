# Hall dos Recordes · Fase 1 (LP estática)

Next.js 16 (App Router) + TypeScript + Tailwind v4 + `next/image`. Sem banco, sem login. Pronto para a Vercel
(importe o repositório; não precisa de nenhuma configuração ou variável de ambiente).

## Rodar

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # build de produção (o mesmo que a Vercel roda)

## Editar recordes: `data/records.ts`

**Recordistas** (`baseRecordistas`): `id`, `nome`, `cargo` (`"SDR"` ou `"Closer"`) e `foto`.
O `id` é o apelido usado nos recordes (ex.: `"italo"`).

**Recordes** (`recordes`): cada item vira um card, na ordem do array.

```ts
{
  id: "no-show",               // único, sem espaços
  valor: "09,01%",             // número grande em amarelo
  titulo: "Menor no-show do mês",
  descricao: "Recorde de no-show mais baixo de um SDR em um mês.",
  area: "SDR",                 // "SDR" ou "CLOSER", tag do recordista principal
  recordistaId: "italo",
  imagem: "/images/capa-no-show.jpg",   // opcional
  coRecordistas: [{ recordistaId: "gabriel", area: "CLOSER" }], // opcional, recordes em dupla/equipe
}
```

- A contagem **×N** dos avatares (`qtdRecordes`) é calculada sozinha; não digite.
- Sem `imagem`, a capa usa as fotos dos participantes (1 foto, 2 lado a lado, 3 ou 4 em grade), como nos prints.
- Se um `recordistaId` não existir, o `npm run build` falha e diz qual recorde está errado.

## Imagens: `public/images/`

Substitua o arquivo **mantendo o mesmo nome** (ex.: `public/images/italo-silva.jpg`) e pronto.
Para um arquivo novo, coloque em `public/images/` e aponte o caminho `/images/nome.jpg` em `foto` ou `imagem`.
Prefira fotos quadradas ou 16:11 de ~1000px; o `next/image` gera versões otimizadas.

## TV 55"

- Em telas a partir de 1600×800 (TV 55" em 1080p/4K ou monitor em tela cheia) a página vira um quadro 16:9 fixo,
  sem rolagem: 19 recordes em grade 7×3 e recordistas no topo. Tudo escala com a tela.
- **Na TV, abra sempre com `?tv`** (ex.: `https://…vercel.app/?tv`). Isso força o quadro de TV e esconde o cursor.
  Navegadores de smart TV costumam informar uma tela de 1280×720 ou 960×540 mesmo em TVs 4K, e sem o `?tv`
  a página cairia no layout de notebook, com rolagem.
- A grade tem sempre 3 linhas; as colunas se ajustam sozinhas à quantidade de recordes (19 → 7 colunas).

## Fase 2

A página lê tudo por `getHallData()` em `lib/hall.ts`. Para ligar a API, troque só o corpo dessa função por um
`fetch` que devolva o mesmo formato (`{ recordes, recordistas }`); página e componentes não mudam.
