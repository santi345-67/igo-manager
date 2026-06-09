-- RLS policies para IGO Manager

alter table users enable row level security;
alter table initiatives enable row level security;
alter table action_plans enable row level security;

create policy "Users can manage own profile" on users
for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can read and write own initiatives" on initiatives
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can read and write own action plans" on action_plans
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Admin select access for views via service_role key
alter view initiatives_anonimas set security barrier;
