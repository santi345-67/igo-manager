-- Supabase schema para IGO Manager

create extension if not exists pgcrypto;

create table users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  company_name text not null,
  email text not null unique,
  phone text,
  sector text,
  company_size text,
  age_range text,
  gender text,
  role text default 'user',
  created_at timestamptz default now()
);

create table initiatives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  importancia int check (importancia between 1 and 10),
  gobernabilidad int check (gobernabilidad between 1 and 10),
  cuadrante text,
  status text default 'Pendiente',
  created_at timestamptz default now()
);

create table action_plans (
  id uuid primary key default gen_random_uuid(),
  initiative_id uuid references initiatives(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  deadline date,
  budget numeric,
  allies text,
  status text default 'Pendiente',
  created_at timestamptz default now()
);

create or replace function calculate_igo_quadrant() returns trigger as $$
begin
  if new.importancia is null or new.gobernabilidad is null then
    new.cuadrante := null;
  elsif new.importancia >= 7 and new.gobernabilidad >= 7 then
    new.cuadrante := 'I';
  elsif new.importancia >= 7 then
    new.cuadrante := 'II';
  elsif new.gobernabilidad >= 7 then
    new.cuadrante := 'III';
  else
    new.cuadrante := 'IV';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger initiatives_quadrant_trigger
before insert or update on initiatives
for each row execute function calculate_igo_quadrant();

create view initiatives_anonimas as
select
  initiatives.id,
  initiatives.title,
  initiatives.importancia,
  initiatives.gobernabilidad,
  initiatives.cuadrante,
  initiatives.status,
  users.sector,
  initiatives.created_at
from initiatives
join users on initiatives.user_id = users.id;
