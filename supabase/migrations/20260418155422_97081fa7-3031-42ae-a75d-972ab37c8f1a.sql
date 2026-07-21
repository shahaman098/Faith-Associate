-- =====================================================
-- Mosque MBA Admissions CRM - Initial Schema
-- =====================================================

-- ENUMS
CREATE TYPE public.app_role AS ENUM ('admin', 'reviewer', 'staff');
CREATE TYPE public.pipeline_stage AS ENUM (
  'new_enquiry','contacted','awaiting_qualification','qualification_submitted',
  'awaiting_interview_booking','interview_booked','interview_completed',
  'awaiting_payment','enrolled','dormant'
);
CREATE TYPE public.decision_status AS ENUM ('pending','approved','on_hold','rejected','need_more_info');
CREATE TYPE public.payment_status AS ENUM ('not_sent','sent','paid','overdue');
CREATE TYPE public.activity_type AS ENUM (
  'note','repeat_enquiry','email_sent','reminder_sent','stage_changed',
  'decision_set','payment_marked','automation_run','task_created','task_completed',
  'meeting_scheduled','enquiry_received','qualification_submitted','booking_confirmed'
);

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- =====================================================
-- PROFILES
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- USER ROLES (separate table — no recursion)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff_member(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id);
$$;

-- Auto-create profile + first user becomes admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'staff');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profile policies
CREATE POLICY "Profiles viewable by staff" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Role policies
CREATE POLICY "Roles viewable by staff" ON public.user_roles
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- COURSES
-- =====================================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_courses_updated BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Courses viewable by all authenticated" ON public.courses
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Courses viewable publicly for intake" ON public.courses
  FOR SELECT TO anon USING (is_active = true);
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- CONTACTS
-- =====================================================
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT,
  source TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE TRIGGER trg_contacts_updated BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Contacts viewable by staff" ON public.contacts
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff create contacts" ON public.contacts
  FOR INSERT TO authenticated WITH CHECK (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff update contacts" ON public.contacts
  FOR UPDATE TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins delete contacts" ON public.contacts
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- APPLICATIONS
-- =====================================================
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  pipeline_stage public.pipeline_stage NOT NULL DEFAULT 'new_enquiry',
  decision_status public.decision_status NOT NULL DEFAULT 'pending',
  payment_status public.payment_status NOT NULL DEFAULT 'not_sent',
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT,
  qualification_token TEXT UNIQUE,
  qualification_token_expires_at TIMESTAMPTZ,
  qualification_submitted_at TIMESTAMPTZ,
  qualification_data JSONB,
  booking_url TEXT,
  booking_url_sent_at TIMESTAMPTZ,
  booking_confirmed_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  decision_reason TEXT,
  payment_amount NUMERIC(10,2),
  payment_sent_at TIMESTAMPTZ,
  payment_paid_at TIMESTAMPTZ,
  reminder_count INT NOT NULL DEFAULT 0,
  last_reminder_sent_at TIMESTAMPTZ,
  is_possible_duplicate BOOLEAN NOT NULL DEFAULT false,
  enrolled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_applications_contact ON public.applications(contact_id);
CREATE INDEX idx_applications_stage ON public.applications(pipeline_stage);
CREATE INDEX idx_applications_token ON public.applications(qualification_token);
CREATE TRIGGER trg_applications_updated BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Applications viewable by staff" ON public.applications
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff create applications" ON public.applications
  FOR INSERT TO authenticated WITH CHECK (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff update applications" ON public.applications
  FOR UPDATE TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins delete applications" ON public.applications
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- ACTIVITIES (timeline + notes)
-- =====================================================
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  type public.activity_type NOT NULL,
  body TEXT,
  metadata JSONB,
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_activities_application ON public.activities(application_id);
CREATE INDEX idx_activities_contact ON public.activities(contact_id);
CREATE INDEX idx_activities_created ON public.activities(created_at DESC);

CREATE POLICY "Activities viewable by staff" ON public.activities
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff create activities" ON public.activities
  FOR INSERT TO authenticated WITH CHECK (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins delete activities" ON public.activities
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- TASKS
-- =====================================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Tasks viewable by staff" ON public.tasks
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff manage tasks" ON public.tasks
  FOR ALL TO authenticated USING (public.is_staff_member(auth.uid()))
  WITH CHECK (public.is_staff_member(auth.uid()));

-- =====================================================
-- EMAIL TEMPLATES
-- =====================================================
CREATE TABLE public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_email_templates_updated BEFORE UPDATE ON public.email_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Templates viewable by staff" ON public.email_templates
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins manage templates" ON public.email_templates
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- EMAILS LOG
-- =====================================================
CREATE TABLE public.emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE SET NULL,
  contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
  template_key TEXT,
  recipient TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  sent_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Emails viewable by staff" ON public.emails
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Staff create email logs" ON public.emails
  FOR INSERT TO authenticated WITH CHECK (public.is_staff_member(auth.uid()));

-- =====================================================
-- AUTOMATION RUNS
-- =====================================================
CREATE TABLE public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_key TEXT NOT NULL,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  outcome TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Automation runs viewable by staff" ON public.automation_runs
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));

-- =====================================================
-- NOTIFICATIONS
-- =====================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read_at);

CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- =====================================================
-- AUDIT LOGS (admin-only, immutable)
-- =====================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  before JSONB,
  after JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Audit logs admin-only" ON public.audit_logs
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- =====================================================
-- SEED COURSES
-- =====================================================
INSERT INTO public.courses (name, code, description) VALUES
  ('Mosque MBA Foundation', 'MBA-FND', 'Foundation programme for new mosque leaders'),
  ('Mosque MBA Advanced', 'MBA-ADV', 'Advanced leadership and operations programme'),
  ('Mosque MBA Executive', 'MBA-EXEC', 'Executive programme for senior leaders');

-- =====================================================
-- SEED EMAIL TEMPLATES
-- =====================================================
INSERT INTO public.email_templates (key, name, subject, body) VALUES
  ('acknowledgement', 'Enquiry acknowledgement + brochure', 'Thank you for your interest in Mosque MBA',
    'Assalamu Alaikum {{name}},\n\nThank you for your enquiry about {{course}}. Please complete your qualification form here: {{qualify_link}}\n\nWe look forward to speaking with you.\n\nMosque MBA Team'),
  ('qualification_reminder', 'Qualification reminder', 'Reminder: complete your Mosque MBA qualification',
    'Assalamu Alaikum {{name}},\n\nA quick reminder to complete your qualification form: {{qualify_link}}\n\nMosque MBA Team'),
  ('booking_link', 'Interview booking link', 'Book your Mosque MBA interview',
    'Assalamu Alaikum {{name}},\n\nPlease book your interview here: {{booking_url}}\n\nMosque MBA Team'),
  ('booking_reminder', 'Booking reminder', 'Reminder: book your interview',
    'Assalamu Alaikum {{name}},\n\nA reminder to book your interview: {{booking_url}}\n\nMosque MBA Team'),
  ('payment_instructions', 'Payment instructions', 'Mosque MBA enrolment payment',
    'Assalamu Alaikum {{name}},\n\nCongratulations on your approval. Please complete your payment to enrol.\n\nMosque MBA Team'),
  ('payment_reminder', 'Payment reminder', 'Reminder: enrolment payment',
    'Assalamu Alaikum {{name}},\n\nA reminder to complete your enrolment payment.\n\nMosque MBA Team'),
  ('welcome', 'Enrolment welcome', 'Welcome to Mosque MBA',
    'Assalamu Alaikum {{name}},\n\nWelcome to Mosque MBA. Your enrolment is confirmed.\n\nMosque MBA Team'),
  ('rejection', 'Application not successful', 'Update on your Mosque MBA application',
    'Assalamu Alaikum {{name}},\n\nThank you for applying. Unfortunately we are unable to offer you a place at this time.\n\nMosque MBA Team'),
  ('on_hold', 'Application on hold', 'Your Mosque MBA application',
    'Assalamu Alaikum {{name}},\n\nYour application is on hold. We will be in touch shortly.\n\nMosque MBA Team'),
  ('need_more_info', 'More information needed', 'More information needed for your application',
    'Assalamu Alaikum {{name}},\n\nWe need a bit more information about your application. We will reach out shortly.\n\nMosque MBA Team');