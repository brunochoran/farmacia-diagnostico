import { createReadStream } from 'fs';
import { createInterface } from 'readline';

const CSV_PATH = '/Users/brunochoran/Downloads/responses-S3uj5SkW-01KN5AXCQ6V6E44CG0ZZZCESP8-755FMO96F9BDLC2ULRM28HNB.csv';
const API_URL = 'https://ps.agenciac2g.com.br/api/kommo';

// Column indexes
const COL = {
  NAME: 1,
  ROLE: 2,
  PHONE: 4,
  INSTAGRAM: 5,
  PAGES: 6,
  FATURAMENTO: 7,
  CONCORRENTES: 8,
  CLIENTE_IDEAL: 9,
  EQUIPE_MKT: 10,
  PRODUTO: 53,
  DIFERENCIAL: 54,
  ORCAMENTO_TRAFEGO: 82,
  GESTOR_ANUNCIOS: 83,
  METAS: 110,
  FATORES_OBJETIVOS: 111,
};

function formatPhone(raw) {
  if (!raw) return '';
  let s = String(raw).replace(/\D/g, '');
  if (s.startsWith('55') && s.length > 11) s = s.slice(2);
  if (s.length === 11) return `(${s.slice(0, 2)}) ${s.slice(2, 7)}-${s.slice(7)}`;
  if (s.length === 10) return `(${s.slice(0, 2)}) ${s.slice(2, 6)}-${s.slice(6)}`;
  return s;
}

function clean(val) {
  if (!val) return '';
  return String(val).trim().replace(/^'+/, '').replace(/^'@/, '@');
}

function truncate(val, max = 200) {
  const s = clean(val);
  return s.length > max ? s.slice(0, max) + '...' : s;
}

// CSV parsing
function splitCSVRow(row) {
  const fields = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === '"') {
      if (inQuotes && row[i + 1] === '"') { field += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      fields.push(field);
      field = '';
    } else {
      field += ch;
    }
  }
  fields.push(field);
  return fields;
}

function parseCSVLines(lines) {
  const rows = [];
  let current = '';
  for (const line of lines) {
    current = current ? current + '\n' + line : line;
    const quoteCount = (current.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      rows.push(splitCSVRow(current));
      current = '';
    }
  }
  if (current) rows.push(splitCSVRow(current));
  return rows;
}

function buildNota(cols) {
  const parts = [];
  const role = clean(cols[COL.ROLE]);
  const ig = clean(cols[COL.INSTAGRAM]);
  const pages = clean(cols[COL.PAGES]);
  const fat = clean(cols[COL.FATURAMENTO]);
  const produto = clean(cols[COL.PRODUTO]);
  const diferencial = clean(cols[COL.DIFERENCIAL]);
  const equipe = clean(cols[COL.EQUIPE_MKT]);
  const orcamento = clean(cols[COL.ORCAMENTO_TRAFEGO]);
  const gestor = clean(cols[COL.GESTOR_ANUNCIOS]);
  const clienteIdeal = truncate(cols[COL.CLIENTE_IDEAL], 300);
  const concorrentes = truncate(cols[COL.CONCORRENTES], 200);
  const metas = clean(cols[COL.METAS]);
  const fatores = truncate(cols[COL.FATORES_OBJETIVOS], 200);

  parts.push('📋 RESUMO DO DIAGNÓSTICO — Evento Hotmart');
  parts.push('');
  if (role) parts.push(`👤 Papel: ${role}`);
  if (ig) parts.push(`📸 Instagram: ${ig}`);
  if (fat) parts.push(`💰 Faturamento: ${fat}`);
  if (orcamento) parts.push(`📊 Orçamento tráfego: ${orcamento}`);
  if (gestor) parts.push(`🎯 Gestão de anúncios: ${gestor}`);
  if (produto) parts.push(`📦 Produto principal: ${produto}`);
  if (diferencial) parts.push(`⭐ Diferencial: ${diferencial}`);
  if (equipe) parts.push(`👥 Equipe: ${truncate(equipe, 150)}`);
  if (concorrentes) parts.push(`🏁 Concorrentes: ${concorrentes}`);
  if (clienteIdeal) {
    parts.push('');
    parts.push(`🎯 Cliente ideal: ${clienteIdeal}`);
  }
  if (pages) {
    parts.push('');
    parts.push(`🔗 Páginas: ${truncate(pages, 300)}`);
  }
  if (metas === '1' || metas === 'Sim') parts.push(`📈 Possui metas mensais definidas`);
  else if (metas === '0' || metas === 'Não') parts.push(`📈 Não possui metas mensais definidas`);
  if (fatores) parts.push(`🔑 Fatores para atingir objetivos: ${fatores}`);

  return parts.join('\n');
}

function extractSite(cols) {
  const pages = clean(cols[COL.PAGES]);
  if (!pages) return '';
  // Try to find the first URL
  const match = pages.match(/https?:\/\/[^\s,]+/);
  return match ? match[0] : pages.split('\n')[0].trim();
}

// Read CSV
const lines = [];
const rl = createInterface({ input: createReadStream(CSV_PATH, 'utf8'), crlfDelay: Infinity });
for await (const line of rl) lines.push(line);

const rows = parseCSVLines(lines);
const dataRows = rows.slice(1); // skip header

console.log(`Found ${dataRows.length} contact(s)\n`);

let ok = 0, err = 0, skipped = 0;

for (const cols of dataRows) {
  const nome = clean(cols[COL.NAME]);
  const telefone = formatPhone(cols[COL.PHONE]);

  if (!nome || !telefone) {
    console.log(`⏭  Skipping (missing name/phone): ${nome || '(no name)'}`);
    skipped++;
    continue;
  }

  const ig = clean(cols[COL.INSTAGRAM]);
  const site = extractSite(cols);
  const fat = clean(cols[COL.FATURAMENTO]);
  const nota = buildNota(cols);

  // Use Instagram handle as "empresa" if no explicit company
  const empresa = ig ? ig.replace(/^@/, '') : '';

  const payload = {
    nome,
    telefone,
    email: '',
    empresa,
    site,
    faturamentoMensal: fat,
    profileName: 'Evento Hotmart',
    totalScore: '',
    pharmaId: telefone,
    utmSource: 'hotmart',
    nota,
  };

  process.stdout.write(`→ ${nome} (${telefone}) ... `);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    let body = '';
    try { body = await res.text(); } catch (_) {}
    let parsed = null;
    try { parsed = JSON.parse(body); } catch (_) {}

    const action = parsed?.action ?? (res.ok ? 'ok' : 'error');
    console.log(`${res.status} — ${action}`);
    if (!res.ok) {
      console.log('  Response:', body.slice(0, 300));
      err++;
    } else {
      ok++;
    }
  } catch (e) {
    console.log(`FETCH ERROR: ${e.message}`);
    err++;
  }
}

console.log(`\nDone. ✅ ${ok} ok, ⏭ ${skipped} skipped, ❌ ${err} errors.`);
