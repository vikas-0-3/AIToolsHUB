alter table profiles add column if not exists suspended boolean not null default false;

-- Replace email-derived names (privacy) with neutral ones; users can rename in Account.
update profiles p set display_name = 'Member ' || substr(md5(p.id::text), 1, 4)
from auth.users u where u.id = p.id and p.display_name = split_part(u.email, '@', 1);
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles(id, display_name) values (new.id, 'Member ' || substr(md5(new.id::text), 1, 4)); return new; end $$;

-- Only names are public, never roles or emails.
create view public_profiles as select id, display_name from profiles;
grant select on public_profiles to anon, authenticated;

create or replace function protect_role() returns trigger language plpgsql as $$
begin
  if auth.uid() is not null and (new.role is distinct from old.role or new.suspended is distinct from old.suspended) and not is_admin() then
    raise exception 'not allowed'; end if;
  return new; end $$;
create trigger profiles_protect before update on profiles for each row execute function protect_role();
create policy "profiles update own" on profiles for update using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin update" on profiles for update using (is_admin()) with check (is_admin());

create or replace function is_suspended() returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select suspended from profiles where id = auth.uid()), false) $$;
drop policy "tools insert pending" on tools;
create policy "tools insert pending" on tools for insert with check (auth.uid() = submitted_by and status = 'pending' and is_seed = false and not is_suspended());
drop policy "reviews insert own" on reviews;
create policy "reviews insert own" on reviews for insert with check (auth.uid() = user_id and status = 'published' and not is_suspended());
