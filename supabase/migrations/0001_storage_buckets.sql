-- Set up Storage for resume-photos
insert into storage.buckets (id, name, public)
values ('resume-photos', 'resume-photos', true)
on conflict (id) do nothing;

create policy "resume-photos are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'resume-photos' );

create policy "Users can upload their own resume photos."
  on storage.objects for insert
  with check ( bucket_id = 'resume-photos' and auth.uid() = owner );

create policy "Users can update their own resume photos."
  on storage.objects for update
  using ( bucket_id = 'resume-photos' and auth.uid() = owner );

create policy "Users can delete their own resume photos."
  on storage.objects for delete
  using ( bucket_id = 'resume-photos' and auth.uid() = owner );
