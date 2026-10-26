alter table reviews add column if not exists scores jsonb not null default '{}';
alter table tools add column if not exists image_url text;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tool-images', 'tool-images', true, 2097152, array['image/png','image/jpeg','image/webp']) on conflict (id) do nothing;
create policy "tool images public read" on storage.objects for select using (bucket_id = 'tool-images');
create policy "tool images upload own" on storage.objects for insert to authenticated
  with check (bucket_id = 'tool-images' and (storage.foldername(name))[1] = auth.uid()::text);
