-- Evlenne Pet Identity persistence blueprint
-- Apply when Supabase is connected. This is intentionally not required for the current prototype.

create table pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  name text not null,
  years text,
  status text not null default 'draft' check (status in ('draft','portrait_ready','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pet_assets (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id) on delete cascade,
  kind text not null check (kind in ('source_photo','portrait_master','portrait_engraving','paw','fur')),
  storage_path text not null,
  approved boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table product_templates (
  id text primary key,
  family text not null check (family in ('wear','carry','keep','live')),
  name text not null,
  version integer not null default 1,
  production_spec jsonb not null default '{}'::jsonb,
  active boolean not null default true
);

create table personalized_products (
  id uuid primary key default gen_random_uuid(),
  pet_id uuid not null references pets(id),
  product_template_id text not null references product_templates(id),
  template_version integer not null,
  personalization jsonb not null default '{}'::jsonb,
  production_asset_path text,
  created_at timestamptz not null default now()
);

create index pet_assets_pet_id_idx on pet_assets(pet_id);
create index personalized_products_pet_id_idx on personalized_products(pet_id);

-- Important: enable RLS before production and restrict every pet/asset row to auth.uid() = user_id
-- through the owning pets row. Never expose source photos or production assets as public buckets.
