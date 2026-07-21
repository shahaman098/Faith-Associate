
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS website text;

CREATE INDEX IF NOT EXISTS idx_contacts_website ON public.contacts(website);
CREATE INDEX IF NOT EXISTS idx_forms_website ON public.forms(website);

-- Seed 13 default forms (one per website). Skip if slug already exists.
INSERT INTO public.forms (slug, name, website, headline, description, success_message, is_active)
VALUES
  ('mosqueexpo',      'Mosque Expo Enquiry',         'mosqueexpo.com',      'Get in touch with Mosque Expo',         'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('cricketforpeace', 'Cricket for Peace Enquiry',   'cricketforpeace.com', 'Get involved with Cricket for Peace',   'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('profabusin',      'ProFabUsIn Enquiry',          'profabusin.org',      'Contact ProFabUsIn',                    'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('imamsonline',     'Imams Online Enquiry',        'imamsonline.com',     'Contact Imams Online',                  'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('faithassociates', 'Faith Associates Enquiry',    'faithassociates.co.uk','Contact Faith Associates',             'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('mosquemba',       'Mosque MBA Enquiry',          'mosque.mba',          'Enquire about Mosque MBA',              'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('soarproject',     'SOAR Project Enquiry',        'soarproject.eu',      'Contact the SOAR Project',              'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('mosquesecurity',  'Mosque Security Enquiry',     'mosquesecurity.com',  'Contact Mosque Security',               'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('ecomosque',       'EcoMosque Enquiry',           'ecomosque.com',       'Contact EcoMosque',                     'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('meetprogramme',   'MEET Programme Enquiry',      'meetprogramme.eu',    'Contact the MEET Programme',            'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('madrassah',       'Madrassah Enquiry',           'madrassah.co.uk',     'Contact Madrassah',                     'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('efiorg',          'EFI Org Enquiry',             'efiorg.eu',           'Contact EFI',                           'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true),
  ('beaconmosque',    'Beacon Mosque Enquiry',       'beaconmosque.com',    'Contact Beacon Mosque',                 'Tell us a bit about you and we will be in touch.', 'Thank you! We''ll be in touch soon.', true)
ON CONFLICT (slug) DO UPDATE SET website = EXCLUDED.website;

-- Backfill website on existing contacts from the form they came through (when traceable)
UPDATE public.contacts c
SET website = f.website
FROM public.applications a
JOIN public.forms f ON f.id = a.form_id
WHERE a.contact_id = c.id
  AND c.website IS NULL
  AND f.website IS NOT NULL;
