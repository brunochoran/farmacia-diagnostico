-- ============================================================
-- DIAGNÓSTICO DIGITAL — Tabelas Supabase
-- Execute no SQL Editor do seu projeto Supabase
-- ============================================================

-- Tabela 1: Diagnósticos
-- Salvo automaticamente ao exibir o resultado
CREATE TABLE IF NOT EXISTS diagnosticos (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  pharma_id       text,                        -- número do WhatsApp vindo da URL ?pharma_id=
  total_score     int,
  profile_name    text,
  ticket_average  int,
  answers         jsonb,                       -- respostas completas { b0q0: 2, ... }
  revenue         jsonb,                       -- estimativa de faturamento
  created_at      timestamptz DEFAULT now()
);

-- Tabela 2: Leads
-- Salvo quando o usuário preenche o form e clica em falar com a C2G
CREATE TABLE IF NOT EXISTS leads (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  diagnostico_id      uuid REFERENCES diagnosticos(id) ON DELETE SET NULL,
  pharma_id           text,
  nome                text NOT NULL,
  telefone            text NOT NULL,
  email               text,
  empresa             text,
  site                text,
  faturamento_mensal  int,
  created_at          timestamptz DEFAULT now()
);

-- Índices úteis para filtrar por pharma_id
CREATE INDEX IF NOT EXISTS idx_diagnosticos_pharma_id ON diagnosticos(pharma_id);
CREATE INDEX IF NOT EXISTS idx_leads_pharma_id ON leads(pharma_id);
CREATE INDEX IF NOT EXISTS idx_leads_diagnostico_id ON leads(diagnostico_id);

-- ============================================================
-- Row Level Security (RLS)
-- Permite INSERT público (anon key) mas bloqueia leitura externa
-- ============================================================

ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode inserir (o app usa a anon key)
CREATE POLICY "insert_diagnosticos" ON diagnosticos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "insert_leads"        ON leads        FOR INSERT TO anon WITH CHECK (true);

-- Somente autenticados (você, via dashboard) podem ler
CREATE POLICY "select_diagnosticos" ON diagnosticos FOR SELECT TO authenticated USING (true);
CREATE POLICY "select_leads"        ON leads        FOR SELECT TO authenticated USING (true);
