-- Execute este script no Supabase SQL Editor
-- Acesse: supabase.com → seu projeto → SQL Editor → New Query

CREATE TABLE pedidos (
  id                   BIGSERIAL PRIMARY KEY,
  cliente_nome         TEXT NOT NULL,
  cliente_telefone     TEXT,
  endereco_rua         TEXT,
  endereco_numero      TEXT,
  endereco_complemento TEXT,
  endereco_bairro      TEXT,
  endereco_cidade      TEXT,
  endereco_cep         TEXT,
  itens                TEXT NOT NULL,
  total                NUMERIC(10,2) NOT NULL,
  pagamento            TEXT,
  status               TEXT DEFAULT 'novo',
  origem               TEXT DEFAULT 'site',
  criado_em            TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para ordenar por data
CREATE INDEX idx_pedidos_criado_em ON pedidos(criado_em DESC);
