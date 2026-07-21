-- One-click mass email campaigns and per-recipient delivery tracking

CREATE TABLE public.email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  text TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  total_recipients INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_email_campaigns_updated BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Campaigns viewable by staff" ON public.email_campaigns
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins manage campaigns" ON public.email_campaigns
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.email_campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, recipient)
);

ALTER TABLE public.email_campaign_recipients ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_campaign_recipients_campaign ON public.email_campaign_recipients(campaign_id);
CREATE INDEX idx_campaign_recipients_status ON public.email_campaign_recipients(status);

CREATE POLICY "Campaign recipients viewable by staff" ON public.email_campaign_recipients
  FOR SELECT TO authenticated USING (public.is_staff_member(auth.uid()));
CREATE POLICY "Admins manage campaign recipients" ON public.email_campaign_recipients
  FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));
