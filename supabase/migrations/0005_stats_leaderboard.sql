create table if not exists stats (key text primary key, value bigint not null default 0);
alter table stats enable row level security;
create or replace function bump_stat(k text) returns void language sql security definer set search_path = public as $$
  insert into stats(key, value) values (k, 1) on conflict (key) do update set value = stats.value + 1 $$;
create or replace function bump_tool_view(p_slug text) returns void language sql security definer set search_path = public as $$
  update tools set view_count = coalesce(view_count, 0) + 1 where slug = p_slug and status = 'approved' $$;
create or replace function site_counts() returns json language sql stable security definer set search_path = public as $$
  select json_build_object('visitors', coalesce((select value from stats where key = 'visitors'), 0),
    'tool_views', coalesce((select sum(view_count) from tools), 0),
    'tools', (select count(*) from tools where status = 'approved'),
    'reviews', (select count(*) from reviews where status = 'published')) $$;
create or replace function tool_save_counts() returns table(tool_id uuid, n bigint) language sql stable security definer set search_path = public as $$
  select tool_id, count(*) from saved_tools group by tool_id $$;
grant execute on function bump_stat(text), bump_tool_view(text), site_counts(), tool_save_counts() to anon, authenticated;
alter table profiles add column if not exists avatar_url text;
create or replace view public_profiles as select id, display_name, avatar_url from profiles;
