// Teste da conversão do contrato do ERP (GET /public/hall-of-fame) para o formato da LP.
// Rodar: node scripts/test-hall-erp.mjs   (Node 22.18+ / 24: importa o .ts direto)
import assert from "node:assert/strict";
import { converterHallErp, SEM_FOTO } from "../lib/hall-erp.ts";

const BASE = "https://api.erp.assessorialpha.com";
const foto = (id) => `/public/hall-of-fame/members/${id}/photo?v=1`;

export const exemplo = {
  success: true,
  data: {
    members: [
      { id: "m-micael", name: "Micael Growth", track: "SDR", recordCount: 3, photoUrl: foto("m-micael") },
      // cargo ATUAL Closer, mas no recorde "r-4" ele atuou como SDR
      { id: "m-gabriel", name: "Gabriel Silva", track: "CLOSER", recordCount: 2, photoUrl: foto("m-gabriel") },
      { id: "m-italo", name: "Italo Silva", track: "SDR", recordCount: 2, photoUrl: foto("m-italo") },
      { id: "m-joao", name: "João Paulo", track: "CLOSER", recordCount: 1, photoUrl: null }, // sem foto
    ],
    records: [
      {
        id: "r-1",
        value: "09,01%",
        title: "Menor no-show do mês",
        description: "Recorde de no-show mais baixo de um SDR em um mês.",
        members: [{ id: "m-italo", name: "Italo Silva", track: "SDR", photoUrl: foto("m-italo") }],
      },
      {
        id: "r-2",
        value: "7 unidades",
        title: "Vendidas na mesma reunião",
        description: null, // sem descrição
        members: [
          { id: "m-micael", name: "Micael Growth", track: "SDR", photoUrl: foto("m-micael") },
          { id: "m-gabriel", name: "Gabriel Silva", track: "CLOSER", photoUrl: foto("m-gabriel") },
        ],
      },
      {
        id: "r-3",
        value: "R$ 215 mil",
        title: "Vendidos em 1 dia",
        description: "R$ 215 mil vendidos em um único dia.",
        members: [
          { id: "m-micael", name: "Micael Growth", track: "SDR", photoUrl: foto("m-micael") },
          { id: "m-joao", name: "João Paulo", track: "CLOSER", photoUrl: null },
          { id: "m-italo", name: "Italo Silva", track: "SDR", photoUrl: foto("m-italo") },
          { id: "m-gabriel", name: "Gabriel Silva", track: "SDR", photoUrl: foto("m-gabriel") }, // SDR na época
        ],
      },
      { id: "r-vazio", value: "1", title: "Sem participantes", description: null, members: [] },
    ],
  },
};

const r = converterHallErp(exemplo, `${BASE}/`); // barra final é ignorada
assert.equal(r.ok, true, r.ok ? "" : r.erro);

// Recorde sem membros é descartado, com aviso
assert.deepEqual(r.recordes.map((x) => x.id), ["r-1", "r-2", "r-3"]);
assert.match(r.avisos[0], /r-vazio.*sem participantes/);

// 1, 2 e 4 participantes
const [r1, r2, r3] = r.recordes;
assert.deepEqual(
  { recordistaId: r1.recordistaId, area: r1.area, coRecordistas: r1.coRecordistas },
  { recordistaId: "m-italo", area: "SDR", coRecordistas: undefined },
);
assert.deepEqual(r2.coRecordistas, [{ recordistaId: "m-gabriel", area: "CLOSER" }]);
assert.equal(r3.coRecordistas.length, 3);

// Área de cada participante = track DENTRO do recorde (Gabriel era SDR no r-3, é CLOSER hoje)
assert.deepEqual(r3.coRecordistas.at(-1), { recordistaId: "m-gabriel", area: "SDR" });
assert.equal(r.recordistas.find((p) => p.id === "m-gabriel").cargo, "Closer");

// Campos: description null → "", sem capa
assert.equal(r2.descricao, "");
assert.equal(r1.valor, "09,01%");
assert.equal(r1.titulo, "Menor no-show do mês");
assert.equal(r1.imagem, undefined);

// Fotos: relativa à base da API; sem foto → sem-foto.svg
assert.equal(r.recordistas.find((p) => p.id === "m-italo").foto, `${BASE}/public/hall-of-fame/members/m-italo/photo?v=1`);
assert.equal(r.recordistas.find((p) => p.id === "m-joao").foto, SEM_FOTO);

// Membros na ordem do ERP; cargo SDR→"SDR", CLOSER→"Closer"
assert.deepEqual(r.recordistas.map((p) => `${p.id}:${p.cargo}`), [
  "m-micael:SDR",
  "m-gabriel:Closer",
  "m-italo:SDR",
  "m-joao:Closer",
]);

// Envelope: success false e formato inválido são falha (a LP usa a reserva)
const falso = converterHallErp({ success: false, error: "manutenção" }, BASE);
assert.deepEqual(falso, { ok: false, erro: "ERP respondeu success: false" });
const invalido = structuredClone(exemplo);
invalido.data.records[0].members[0].track = "GERENTE";
const inv = converterHallErp(invalido, BASE);
assert.equal(inv.ok, false);
assert.match(inv.erro, /fora do formato/);
assert.equal(converterHallErp(null, BASE).ok, false);

console.log("OK: conversão do contrato do ERP (1, 2 e 4 participantes, área por recorde, sem foto, descartes, envelope)");
