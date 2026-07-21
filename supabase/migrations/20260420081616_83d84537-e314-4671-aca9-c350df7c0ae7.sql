-- Forms table
CREATE TABLE public.forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  headline TEXT,
  description TEXT,
  course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
  success_message TEXT NOT NULL DEFAULT 'Thank you! We''ll be in touch soon.',
  redirect_url TEXT,
  show_phone BOOLEAN NOT NULL DEFAULT true,
  show_country BOOLEAN NOT NULL DEFAULT true,
  show_message BOOLEAN NOT NULL DEFAULT true,
  require_phone BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  submission_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_forms_slug ON public.forms(slug);

ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forms viewable by staff"
  ON public.forms FOR SELECT TO authenticated
  USING (public.is_staff_member(auth.uid()));

CREATE POLICY "Active forms viewable publicly"
  ON public.forms FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "Staff create forms"
  ON public.forms FOR INSERT TO authenticated
  WITH CHECK (public.is_staff_member(auth.uid()));

CREATE POLICY "Staff update forms"
  ON public.forms FOR UPDATE TO authenticated
  USING (public.is_staff_member(auth.uid()));

CREATE POLICY "Staff delete forms"
  ON public.forms FOR DELETE TO authenticated
  USING (public.is_staff_member(auth.uid()));

CREATE TRIGGER forms_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Link applications to source form
ALTER TABLE public.applications
  ADD COLUMN form_id UUID REFERENCES public.forms(id) ON DELETE SET NULL;

CREATE INDEX idx_applications_form_id ON public.applications(form_id);