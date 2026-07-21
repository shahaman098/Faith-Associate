-- ============================================================
-- Mosque Expo domain tables
-- Run this migration in your Supabase SQL editor or via CLI
-- ============================================================

-- expo_events
create table if not exists public.expo_events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  event_date_start timestamptz,
  event_date_end timestamptz,
  venue_name text,
  venue_address text,
  early_bird_deadline timestamptz,
  status text not null default 'Draft' check (status in ('Draft','Published','Completed','Cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- expo_packages
create table if not exists public.expo_packages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.expo_events(id) on delete cascade,
  name text not null,
  type text not null default 'Standard Stand',
  description text,
  standard_price numeric(10,2),
  early_bird_price numeric(10,2),
  early_bird_deadline_override timestamptz,
  capacity integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- companies table (shared core)
create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- expo_exhibitors
create table if not exists public.expo_exhibitors (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.expo_events(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete restrict,
  company_id uuid references public.companies(id) on delete set null,
  owner_id uuid references auth.users(id) on delete set null,
  pipeline_stage text not null default 'New Lead' check (pipeline_stage in (
    'New Lead','Contacted','Qualified','Package Sent','Early Bird Offered',
    'Meeting Booked','Meeting Completed','Negotiation','Reserved',
    'Invoice Sent','Paid','Onboarding In Progress','Ready for Expo',
    'Dormant','Closed Lost'
  )),
  deal_status text not null default 'Open' check (deal_status in ('Open','Won','Lost','Dormant')),
  payment_status text not null default 'Not Sent' check (payment_status in ('Not Sent','Sent','Partially Paid','Paid','Overdue')),
  onboarding_status text not null default 'Not Started' check (onboarding_status in ('Not Started','Awaiting Assets','Awaiting Requirements','Awaiting Confirmation','Complete')),
  package_interest_id uuid references public.expo_packages(id) on delete set null,
  stand_size text,
  sponsorship_interest boolean not null default false,
  lead_source text,
  early_bird_eligible boolean not null default false,
  early_bird_expires_at timestamptz,
  quoted_price numeric(10,2),
  negotiated_price numeric(10,2),
  invoice_due_date date,
  decision_notes text,
  is_possible_duplicate boolean not null default false,
  reminder_count integer not null default 0,
  last_reminder_sent_at timestamptz,
  booked_meeting_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- expo_meetings
create table if not exists public.expo_meetings (
  id uuid primary key default gen_random_uuid(),
  exhibitor_id uuid not null references public.expo_exhibitors(id) on delete cascade,
  scheduled_for timestamptz not null,
  meeting_type text not null default 'Video Call',
  meeting_link text,
  status text not null default 'Pending' check (status in ('Pending','Booked','Completed','Cancelled','No Show')),
  outcome text check (outcome in ('Interested','Needs Internal Approval','Price Concern','Follow Up Later','Not a Fit','Won','Lost')),
  notes text,
  follow_up_due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- expo_invoices
create table if not exists public.expo_invoices (
  id uuid primary key default gen_random_uuid(),
  exhibitor_id uuid not null references public.expo_exhibitors(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text not null default 'GBP',
  status text not null default 'Draft' check (status in ('Draft','Sent','Partially Paid','Paid','Overdue','Cancelled')),
  invoice_reference text,
  sent_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  reminder_count integer not null default 0,
  last_reminder_sent_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- expo_onboarding_checklists
create table if not exists public.expo_onboarding_checklists (
  id uuid primary key default gen_random_uuid(),
  exhibitor_id uuid not null unique references public.expo_exhibitors(id) on delete cascade,
  logo_received boolean not null default false,
  banner_received boolean not null default false,
  exhibitor_description_received boolean not null default false,
  power_requirements_received boolean not null default false,
  stand_requirements_received boolean not null default false,
  team_passes_confirmed boolean not null default false,
  final_confirmation_sent boolean not null default false,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- expo_attendees
create table if not exists public.expo_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.expo_events(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete restrict,
  owner_id uuid references auth.users(id) on delete set null,
  source text,
  registration_type text,
  ticket_type text not null default 'General Admission',
  status text not null default 'Registered' check (status in (
    'Interested','Registered','Confirmed','Reminder Sent',
    'Checked In','No Show','Cancelled','Post-Event Follow-Up'
  )),
  checked_in_at timestamptz,
  reminder_count integer not null default 0,
  last_reminder_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists expo_exhibitors_event_id_idx on public.expo_exhibitors(event_id);
create index if not exists expo_exhibitors_contact_id_idx on public.expo_exhibitors(contact_id);
create index if not exists expo_exhibitors_pipeline_stage_idx on public.expo_exhibitors(pipeline_stage);
create index if not exists expo_exhibitors_payment_status_idx on public.expo_exhibitors(payment_status);
create index if not exists expo_exhibitors_early_bird_expires_at_idx on public.expo_exhibitors(early_bird_expires_at);
create index if not exists expo_meetings_exhibitor_id_idx on public.expo_meetings(exhibitor_id);
create index if not exists expo_meetings_scheduled_for_idx on public.expo_meetings(scheduled_for);
create index if not exists expo_invoices_exhibitor_id_idx on public.expo_invoices(exhibitor_id);
create index if not exists expo_invoices_status_idx on public.expo_invoices(status);
create index if not exists expo_attendees_event_id_idx on public.expo_attendees(event_id);
create index if not exists expo_attendees_contact_id_idx on public.expo_attendees(contact_id);
create index if not exists expo_attendees_status_idx on public.expo_attendees(status);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.expo_events enable row level security;
alter table public.expo_packages enable row level security;
alter table public.expo_exhibitors enable row level security;
alter table public.expo_meetings enable row level security;
alter table public.expo_invoices enable row level security;
alter table public.expo_onboarding_checklists enable row level security;
alter table public.expo_attendees enable row level security;

-- Authenticated users can read/write all expo tables (role-based guards enforced in app)
drop policy if exists "authenticated_all_expo_events" on public.expo_events;
create policy "authenticated_all_expo_events" on public.expo_events for all to authenticated using (true) with check (true);
drop policy if exists "authenticated_all_expo_packages" on public.expo_packages;
create policy "authenticated_all_expo_packages" on public.expo_packages for all to authenticated using (true) with check (true);
drop policy if exists "authenticated_all_expo_exhibitors" on public.expo_exhibitors;
create policy "authenticated_all_expo_exhibitors" on public.expo_exhibitors for all to authenticated using (true) with check (true);
drop policy if exists "authenticated_all_expo_meetings" on public.expo_meetings;
create policy "authenticated_all_expo_meetings" on public.expo_meetings for all to authenticated using (true) with check (true);
drop policy if exists "authenticated_all_expo_invoices" on public.expo_invoices;
create policy "authenticated_all_expo_invoices" on public.expo_invoices for all to authenticated using (true) with check (true);
drop policy if exists "authenticated_all_expo_onboarding" on public.expo_onboarding_checklists;
create policy "authenticated_all_expo_onboarding" on public.expo_onboarding_checklists for all to authenticated using (true) with check (true);
drop policy if exists "authenticated_all_expo_attendees" on public.expo_attendees;
create policy "authenticated_all_expo_attendees" on public.expo_attendees for all to authenticated using (true) with check (true);

-- ============================================================
-- updated_at triggers
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger expo_events_updated_at before update on public.expo_events for each row execute function public.set_updated_at();
create or replace trigger expo_packages_updated_at before update on public.expo_packages for each row execute function public.set_updated_at();
create or replace trigger expo_exhibitors_updated_at before update on public.expo_exhibitors for each row execute function public.set_updated_at();
create or replace trigger expo_meetings_updated_at before update on public.expo_meetings for each row execute function public.set_updated_at();
create or replace trigger expo_invoices_updated_at before update on public.expo_invoices for each row execute function public.set_updated_at();
create or replace trigger expo_onboarding_checklists_updated_at before update on public.expo_onboarding_checklists for each row execute function public.set_updated_at();
create or replace trigger expo_attendees_updated_at before update on public.expo_attendees for each row execute function public.set_updated_at();
