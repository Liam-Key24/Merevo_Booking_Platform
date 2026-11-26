import { TEMPLATE_CATALOG } from "@/lib/templates/catalog";
import type { ClientSitePagePayload } from "@/lib/templates/payload";
import { DEFAULT_SITE_COPY } from "@/lib/templates/section-copy";

const DEMO_HERO_RESTAURANT =
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80";
const DEMO_HERO_APPOINTMENTS =
  "https://images.unsplash.com/photo-1560066984-138d7434cd09?auto=format&fit=crop&w=1200&q=80";
const DEMO_GALLERY = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0d?auto=format&fit=crop&w=800&q=80",
];

function baseSettings(notificationEmail: string) {
  return {
    timezone: "Europe/London",
    booking_mode: "meridian" as const,
    external_booking_url: null,
    notification_email: notificationEmail,
    contact_phone: "+44 20 0000 0000",
    max_party_size: 8,
    opening_hours: {},
    holidays: [],
    booking_slot_minutes: 30,
  };
}

export function getDemoRestaurantPayload(): ClientSitePagePayload {
  const brandingPreset = TEMPLATE_CATALOG["hospitality-classic"].branding;
  return {
    business: {
      id: "demo-restaurant",
      name: "Harbour & Hearth",
      slug: "demo-restaurant",
      dashboard_mode: "hospitality",
    },
    template: {
      id: "demo-hospitality-classic",
      name: "Hospitality Classic",
      slug: "hospitality-classic",
      status: "active",
      dashboard_mode: "hospitality",
      allowed_sections: ["hero", "gallery", "booking_widget", "contact"],
      description: "Seasonal dining by the water.",
    },
    branding: {
      primary_color: brandingPreset.primary,
      accent_color: brandingPreset.accent,
      background_color: brandingPreset.background,
      text_color: brandingPreset.text,
      logo_url: null,
      favicon_url: null,
      hero_image_url: DEMO_HERO_RESTAURANT,
      heading_font_url: null,
      body_font_url: null,
      gallery_urls: DEMO_GALLERY,
      menu: { sections: [] },
      menu_pdfs: [],
      copy: {
        ...DEFAULT_SITE_COPY,
        hero_heading: "Harbour & Hearth",
        hero_body:
          "Seasonal plates, a calm dining room, and a short walk from the water. This is a Merevo demo restaurant — try the booking form; nothing is saved.",
        contact_tagline: "Demo restaurant for Merevo prospects.",
        contact_visit: "12 Quay Lane · Demo City",
      },
      config_version: 1,
    },
    booking: {
      business: {
        id: "demo-restaurant",
        name: "Harbour & Hearth",
        slug: "demo-restaurant",
        status: "active",
        dashboard_mode: "hospitality",
      },
      settings: baseSettings("demo@harbour-hearth.example"),
      services: [],
      dashboardMode: "hospitality",
    },
  };
}

export function getDemoAppointmentsPayload(): ClientSitePagePayload {
  const brandingPreset = TEMPLATE_CATALOG["appointments-classic"].branding;
  return {
    business: {
      id: "demo-appointments",
      name: "Northlight Studio",
      slug: "demo-appointments",
      dashboard_mode: "appointments",
    },
    template: {
      id: "demo-appointments-classic",
      name: "Appointments Classic",
      slug: "appointments-classic",
      status: "active",
      dashboard_mode: "appointments",
      allowed_sections: ["hero", "services", "booking_widget", "contact"],
      description: "Calm appointments for hair and care.",
    },
    branding: {
      primary_color: brandingPreset.primary,
      accent_color: brandingPreset.accent,
      background_color: brandingPreset.background,
      text_color: brandingPreset.text,
      logo_url: null,
      favicon_url: null,
      hero_image_url: DEMO_HERO_APPOINTMENTS,
      heading_font_url: null,
      body_font_url: null,
      gallery_urls: [],
      menu: { sections: [] },
      menu_pdfs: [],
      copy: {
        ...DEFAULT_SITE_COPY,
        hero_heading: "Northlight Studio",
        hero_body:
          "Cuts, colour, and calm appointments. This is a Merevo demo — try booking; nothing is saved to a real CRM.",
        about_heading: "Services",
        about_body:
          "A short list of sample services so you can see how an appointments site feels.",
        hero_primary_cta: "Book now",
        contact_tagline: "Demo appointments site for Merevo prospects.",
        contact_visit: "By appointment only · Demo City",
      },
      config_version: 1,
    },
    booking: {
      business: {
        id: "demo-appointments",
        name: "Northlight Studio",
        slug: "demo-appointments",
        status: "active",
        dashboard_mode: "appointments",
      },
      settings: baseSettings("demo@northlight.example"),
      services: [
        {
          id: "demo-svc-cut",
          name: "Cut & finish",
          description: "Consultation, cut, and finish.",
          duration_minutes: 45,
        },
        {
          id: "demo-svc-colour",
          name: "Colour refresh",
          description: "Toner or gloss with blow-dry.",
          duration_minutes: 75,
        },
        {
          id: "demo-svc-treat",
          name: "Treatment",
          description: "Restorative treatment and style.",
          duration_minutes: 30,
        },
      ],
      dashboardMode: "appointments",
    },
  };
}
