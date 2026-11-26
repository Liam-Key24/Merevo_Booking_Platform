-- Remove image/svg+xml from business-assets bucket to prevent XSS attacks.
-- SVG files can contain embedded scripts and are an attack vector.

update storage.buckets
set
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
