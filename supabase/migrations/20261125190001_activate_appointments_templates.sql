-- Activate appointment templates now that layouts are registered.

update public.site_templates
set status = 'active'
where slug in (
  'appointments-classic',
  'appointments-minimal',
  'appointments-studio'
);
