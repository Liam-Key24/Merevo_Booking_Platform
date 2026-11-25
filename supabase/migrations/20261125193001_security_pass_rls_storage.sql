-- Security pass: tighten storage, force RLS on tenant tables.
-- Does not rename DB identifiers (is_meridian_admin / meridian_admin stay).

-- ---------------------------------------------------------------------------
-- Storage: drop SVG (XSS surface) from the public business-assets bucket.
-- App uploads already reject SVG; keep the bucket in sync.
-- ---------------------------------------------------------------------------

update storage.buckets
set
  file_size_limit = 15728640,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/x-icon',
    'image/vnd.microsoft.icon',
    'application/pdf',
    'font/woff2',
    'font/woff',
    'font/ttf',
    'font/otf',
    'font/sfnt',
    'application/font-woff',
    'application/font-woff2',
    'application/x-font-ttf',
    'application/x-font-otf'
  ]
where id = 'business-assets';

-- Public read stays intentional for published logos/heroes/menus.
-- Writes remain Merevo-admin only. Object paths are {business_id}/...

-- ---------------------------------------------------------------------------
-- Force RLS so even table owners cannot accidentally bypass policies.
-- service_role still bypasses RLS by design (used only in server code).
-- ---------------------------------------------------------------------------

alter table public.businesses force row level security;
alter table public.profiles force row level security;
alter table public.business_memberships force row level security;
alter table public.booking_settings force row level security;
alter table public.services force row level security;
alter table public.bookings force row level security;
alter table public.booking_events force row level security;
alter table public.audit_logs force row level security;
alter table public.email_delivery_logs force row level security;
alter table public.site_templates force row level security;
alter table public.business_template_assignments force row level security;
alter table public.business_capabilities force row level security;
alter table public.business_staff force row level security;
alter table public.restaurant_tables force row level security;
alter table public.business_subscriptions force row level security;
alter table public.client_site_settings force row level security;

comment on table public.bookings is
  'Tenant-scoped bookings. RLS: active members of the same business only (plus Merevo admin). Anon has no privileges; public booking inserts use the server service-role path.';
