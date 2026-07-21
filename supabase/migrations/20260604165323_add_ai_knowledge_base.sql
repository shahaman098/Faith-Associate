create extension if not exists vector with schema extensions;

create table public.ai_knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  source_type text not null,
  source_key text not null,
  title text not null,
  summary text,
  canonical_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_type, source_key)
);

alter table public.ai_knowledge_documents enable row level security;

create trigger trg_ai_knowledge_documents_updated
before update on public.ai_knowledge_documents
for each row execute function public.update_updated_at_column();

create index idx_ai_knowledge_documents_source_type
  on public.ai_knowledge_documents(source_type);

create table public.ai_knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.ai_knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  token_count integer,
  metadata jsonb not null default '{}'::jsonb,
  embedding extensions.vector(1536),
  fts tsvector generated always as (
    to_tsvector('english', coalesce(content, ''))
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (document_id, chunk_index)
);

alter table public.ai_knowledge_chunks enable row level security;

create trigger trg_ai_knowledge_chunks_updated
before update on public.ai_knowledge_chunks
for each row execute function public.update_updated_at_column();

create index idx_ai_knowledge_chunks_document_id
  on public.ai_knowledge_chunks(document_id);

create index idx_ai_knowledge_chunks_fts
  on public.ai_knowledge_chunks using gin(fts);

create index idx_ai_knowledge_chunks_embedding_ivfflat
  on public.ai_knowledge_chunks
  using ivfflat (embedding extensions.vector_cosine_ops)
  with (lists = 100);

notify pgrst, 'reload schema';

create policy "AI knowledge docs viewable by staff"
  on public.ai_knowledge_documents
  for select to authenticated
  using (public.is_staff_member(auth.uid()));

create policy "AI knowledge docs insertable by staff"
  on public.ai_knowledge_documents
  for insert to authenticated
  with check (public.is_staff_member(auth.uid()));

create policy "AI knowledge docs updatable by staff"
  on public.ai_knowledge_documents
  for update to authenticated
  using (public.is_staff_member(auth.uid()));

create policy "AI knowledge docs deletable by admin"
  on public.ai_knowledge_documents
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "AI knowledge chunks viewable by staff"
  on public.ai_knowledge_chunks
  for select to authenticated
  using (public.is_staff_member(auth.uid()));

create policy "AI knowledge chunks insertable by staff"
  on public.ai_knowledge_chunks
  for insert to authenticated
  with check (public.is_staff_member(auth.uid()));

create policy "AI knowledge chunks updatable by staff"
  on public.ai_knowledge_chunks
  for update to authenticated
  using (public.is_staff_member(auth.uid()));

create policy "AI knowledge chunks deletable by admin"
  on public.ai_knowledge_chunks
  for delete to authenticated
  using (public.has_role(auth.uid(), 'admin'));

grant select, insert, update, delete on public.ai_knowledge_documents to authenticated;
grant select, insert, update, delete on public.ai_knowledge_chunks to authenticated;
