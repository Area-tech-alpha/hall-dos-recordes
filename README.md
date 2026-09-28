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

## Layouts: celular, computador e TV

- **Celular** (até 640px): um card por linha, rolando com o dedo.
- **Computador**: grade de 2 a 4 colunas, rolando (4 colunas a partir de 1920px). Acima de 1600px tudo escala com a tela.
- **TV 55"**: quadro 16:9 fixo, sem rolagem. Recordistas no topo e todos os recordes em 3 linhas; as colunas
  se ajustam sozinhas à quantidade de recordes (19 → 7 colunas). Sem cursor.

O modo TV **não** depende do tamanho da tela (senão um monitor Full HD cairia nele). Ele liga:
- sozinho, em navegador de smart TV (Samsung/Tizen, LG/webOS, Android TV, Fire TV, Roku…);
- ou com `?tv` na URL (ex.: `https://…vercel.app/?tv`). Use isso quando a TV estiver ligada num
  computador, TV box ou Chromecast. `?tv=0` desliga.

## Fase 2

A página lê tudo por `getHallData()` em `lib/hall.ts`. Para ligar a API, troque só o corpo dessa função por um
`fetch` que devolva o mesmo formato (`{ recordes, recordistas }`); página e componentes não mudam.
