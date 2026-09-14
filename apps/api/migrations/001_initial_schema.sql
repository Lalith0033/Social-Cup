CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL CHECK (status IN ('REGISTERED', 'ACTIVE', 'SUSPENDED', 'DELETED')),
  role text NOT NULL CHECK (role IN ('MEMBER', 'ADMIN')),
  display_name text,
  email text,
  profile_photo_url text,
  home_neighbourhood text,
  preferences jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS users_active_email_unique
  ON users (lower(email))
  WHERE email IS NOT NULL AND status <> 'DELETED';

CREATE TABLE IF NOT EXISTS user_identities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  provider text NOT NULL CHECK (provider IN ('PASSWORD', 'GOOGLE', 'APPLE')),
  provider_subject text NOT NULL,
  password_hash text,
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_subject)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  token_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS neighbourhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS cafes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  latitude numeric(9, 6) NOT NULL,
  longitude numeric(9, 6) NOT NULL,
  neighbourhood_id uuid NOT NULL REFERENCES neighbourhoods(id),
  opening_hours jsonb NOT NULL DEFAULT '{}'::jsonb,
  vibe_tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  payout_rate_cents integer NOT NULL CHECK (payout_rate_cents >= 0),
  pin_hash text NOT NULL,
  pin_version integer NOT NULL DEFAULT 1 CHECK (pin_version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS drinks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  name text NOT NULL,
  description text NOT NULL,
  retail_price_cents integer NOT NULL CHECK (retail_price_cents >= 0),
  credit_cost integer NOT NULL CHECK (credit_cost > 0),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  status text NOT NULL CHECK (status IN ('NONE', 'ACTIVE', 'PAST_DUE', 'CANCELING', 'UNPAID', 'CANCELED')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_customer_unique
  ON subscriptions (stripe_customer_id)
  WHERE stripe_customer_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_stripe_subscription_unique
  ON subscriptions (stripe_subscription_id)
  WHERE stripe_subscription_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS billing_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  stripe_invoice_id text NOT NULL UNIQUE,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  credits_granted integer NOT NULL CHECK (credits_granted = 30),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_credit_balances (
  user_id uuid PRIMARY KEY REFERENCES users(id),
  current_balance integer NOT NULL CHECK (current_balance >= 0),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS credit_ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  billing_period_id uuid REFERENCES billing_periods(id),
  amount integer NOT NULL,
  entry_type text NOT NULL CHECK (entry_type IN ('GRANT_BILLING', 'DEDUCT_REDEMPTION', 'RESTORE_VOID')),
  reference_id uuid,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text NOT NULL UNIQUE,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barista_device_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  pin_version integer NOT NULL,
  session_token_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS barista_pin_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  ip_address inet NOT NULL,
  succeeded boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS redemption_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  drink_id uuid NOT NULL REFERENCES drinks(id),
  token_hash char(64) NOT NULL UNIQUE,
  backup_code_hash char(64) NOT NULL UNIQUE,
  credit_cost_snapshot integer NOT NULL CHECK (credit_cost_snapshot > 0),
  status text NOT NULL CHECK (status IN ('PENDING', 'REDEEMED', 'EXPIRED', 'SUPERSEDED')),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  redeemed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS redemption_tokens_one_pending_per_user
  ON redemption_tokens (user_id)
  WHERE status = 'PENDING';

CREATE TABLE IF NOT EXISTS redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token_id uuid NOT NULL UNIQUE REFERENCES redemption_tokens(id),
  user_id uuid NOT NULL REFERENCES users(id),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  drink_id uuid NOT NULL REFERENCES drinks(id),
  billing_period_id uuid REFERENCES billing_periods(id),
  cafe_name_snapshot text NOT NULL,
  drink_name_snapshot text NOT NULL,
  retail_price_snapshot_cents integer NOT NULL,
  credit_cost_snapshot integer NOT NULL,
  payout_rate_snapshot_cents integer NOT NULL,
  cafe_payout_amount_cents integer NOT NULL,
  platform_margin_amount_cents integer NOT NULL,
  status text NOT NULL CHECK (status IN ('COMPLETED', 'VOIDED')),
  idempotency_key uuid NOT NULL UNIQUE,
  redeemed_at timestamptz NOT NULL DEFAULT now(),
  voided_at timestamptz,
  void_reason text,
  voided_by_user_id uuid REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  drink_id uuid NOT NULL REFERENCES drinks(id),
  redemption_id uuid REFERENCES redemptions(id),
  stars integer NOT NULL CHECK (stars BETWEEN 1 AND 5),
  note text CHECK (note IS NULL OR char_length(note) <= 140),
  verified_redemption boolean NOT NULL DEFAULT false,
  hidden boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, drink_id)
);

CREATE TABLE IF NOT EXISTS payout_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('DRAFT', 'APPROVED', 'PAID')),
  wire_reference text,
  payment_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  paid_at timestamptz,
  approved_by_user_id uuid REFERENCES users(id),
  paid_by_user_id uuid REFERENCES users(id),
  CHECK (status <> 'PAID' OR (wire_reference IS NOT NULL AND payment_date IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS payout_batch_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES payout_batches(id),
  redemption_id uuid NOT NULL UNIQUE REFERENCES redemptions(id),
  amount_cents integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cafe_payout_adjustments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id uuid NOT NULL REFERENCES cafes(id),
  source_redemption_id uuid NOT NULL REFERENCES redemptions(id),
  target_batch_id uuid REFERENCES payout_batches(id),
  amount_cents integer NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by_user_id uuid NOT NULL REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES users(id),
  actor_type text NOT NULL CHECK (actor_type IN ('MEMBER', 'BARISTA', 'ADMIN', 'SYSTEM')),
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
