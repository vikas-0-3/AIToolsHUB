create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text, role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now());
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin insert into profiles(id, display_name) values (new.id, split_part(new.email,'@',1)); return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
create or replace function is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

create table categories (id serial primary key, slug text unique not null, name text not null, description text);
create table tools (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null check (char_length(name) between 2 and 80),
  tagline text not null check (char_length(tagline) <= 160), description text not null,
  website_url text not null unique, category_id int references categories(id),
  pricing text not null check (pricing in ('free','freemium','paid')),
  features text[] default '{}', use_cases text[] default '{}', platforms text[] default '{}',
  pros text[] default '{}', cons text[] default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  is_seed boolean not null default false,
  submitted_by uuid references profiles(id), view_count int default 0,
  created_at timestamptz default now());
create index on tools (status, category_id); create index on tools using gin (to_tsvector('english', name||' '||tagline));

create table reviews (
  id uuid primary key default gen_random_uuid(),
  tool_id uuid references tools on delete cascade not null, user_id uuid references profiles not null,
  rating int not null check (rating between 1 and 5), body text not null check (char_length(body) between 20 and 3000),
  status text not null default 'published' check (status in ('published','hidden')),
  created_at timestamptz default now(), unique (tool_id, user_id));
create table review_votes (review_id uuid references reviews on delete cascade, user_id uuid references profiles, primary key (review_id, user_id));
create table reports (id uuid primary key default gen_random_uuid(), review_id uuid references reviews on delete cascade, reporter_id uuid references profiles, reason text not null, created_at timestamptz default now(), unique (review_id, reporter_id));
create table saved_tools (user_id uuid references profiles, tool_id uuid references tools on delete cascade, primary key (user_id, tool_id));

alter table profiles enable row level security; alter table categories enable row level security;
alter table tools enable row level security; alter table reviews enable row level security;
alter table review_votes enable row level security; alter table reports enable row level security; alter table saved_tools enable row level security;

create policy "profiles read own" on profiles for select using (id = auth.uid() or is_admin());
create policy "categories public" on categories for select using (true);
create policy "categories admin" on categories for all using (is_admin()) with check (is_admin());
create policy "tools public approved" on tools for select using (status = 'approved' or submitted_by = auth.uid() or is_admin());
create policy "tools insert pending" on tools for insert with check (auth.uid() = submitted_by and status = 'pending' and is_seed = false);
create policy "tools admin" on tools for update using (is_admin()) with check (is_admin());
create policy "tools admin delete" on tools for delete using (is_admin());
create policy "reviews public" on reviews for select using (status = 'published' or user_id = auth.uid() or is_admin());
create policy "reviews insert own" on reviews for insert with check (auth.uid() = user_id and status = 'published');
create policy "reviews admin" on reviews for update using (is_admin()) with check (is_admin());
create policy "votes read" on review_votes for select using (true);
create policy "votes own" on review_votes for insert with check (auth.uid() = user_id);
create policy "reports insert" on reports for insert with check (auth.uid() = reporter_id);
create policy "reports admin read" on reports for select using (is_admin());
create policy "saved own" on saved_tools for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
