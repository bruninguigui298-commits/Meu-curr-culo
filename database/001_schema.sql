-- Esquema do site-currículo do Bruno.
-- Coletamos só o necessário: nada de IP, user-agent ou rastreamento.

CREATE TABLE IF NOT EXISTS contact_messages (
  id              BIGSERIAL PRIMARY KEY,
  name            VARCHAR(120)  NOT NULL,
  email           VARCHAR(254)  NOT NULL,
  company         VARCHAR(120),
  message         VARCHAR(4000) NOT NULL,
  consent_version VARCHAR(20)   NOT NULL,
  consent_at      TIMESTAMPTZ   NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  read_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);

-- Pedidos do titular (LGPD art. 18). O protocolo é o que a pessoa usa para acompanhar.
CREATE TABLE IF NOT EXISTS lgpd_requests (
  id           BIGSERIAL PRIMARY KEY,
  protocol     VARCHAR(32)   NOT NULL UNIQUE,
  name         VARCHAR(120)  NOT NULL,
  email        VARCHAR(254)  NOT NULL,
  request_type VARCHAR(30)   NOT NULL CHECK (request_type IN (
                 'confirmacao', 'acesso', 'correcao', 'anonimizacao_bloqueio_eliminacao',
                 'portabilidade', 'eliminacao', 'informacao_compartilhamento',
                 'revogacao_consentimento', 'outro')),
  details      VARCHAR(4000),
  status       VARCHAR(20)   NOT NULL DEFAULT 'recebido'
                 CHECK (status IN ('recebido', 'em_andamento', 'concluido', 'recusado')),
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lgpd_requests_created_at ON lgpd_requests (created_at DESC);
