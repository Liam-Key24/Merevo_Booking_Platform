import { ClientSiteTheme } from "@/components/client-site/client-site-theme";
import { BookingWidget } from "@/components/booking/booking-widget";
import { hasTemplateSection } from "@/lib/templates/catalog";
import {
  resolveSiteSectionCopy,
  splitCopyParagraphs,
} from "@/lib/templates/section-copy";
import type { ClientSiteLayoutProps } from "@/lib/templates/layouts";

export type AppointmentsLayoutVariant = "classic" | "minimal" | "studio";

type AppointmentsLayoutProps = ClientSiteLayoutProps & {
  variant?: AppointmentsLayoutVariant;
};

function PreviewBanner({ preview }: { preview: boolean }) {
  if (!preview) return null;
  return (
    <div className="border-b border-merevo-border bg-merevo-surface px-[var(--merevo-space-page)] py-2 text-center text-xs text-merevo-text-muted">
      Template preview — not published
    </div>
  );
}

export function AppointmentsClassicLayout({
  payload,
  preview = false,
  variant = "classic",
}: AppointmentsLayoutProps) {
  const { business, branding, booking, template } = payload;
  const sections = template.allowed_sections;
  const showHero = hasTemplateSection(sections, "hero");
  const showServices = hasTemplateSection(sections, "services");
  const showStaff = hasTemplateSection(sections, "staff");
  const showBooking = hasTemplateSection(sections, "booking_widget");
  const showContact = hasTemplateSection(sections, "contact");
  const copy = resolveSiteSectionCopy(branding.copy, {
    hero_heading: business.name,
    hero_body:
      template.description ??
      `Book with ${business.name}. Pick a service and a time that suits you.`,
    hero_primary_cta: "Book now",
    about_heading: "Our services",
    contact_tagline: "We look forward to seeing you.",
  });
  const aboutParagraphs = splitCopyParagraphs(copy.about_body);
  const isMinimal = variant === "minimal";
  const isStudio = variant === "studio";
  const heroImage = branding.hero_image_url;

  return (
    <ClientSiteTheme branding={branding} templateSlug={template.slug}>
      <div
        id="top"
        className="min-h-full bg-[var(--client-background)] text-[var(--client-text)] [font-family:var(--client-font-body)] [&_h1]:[font-family:var(--client-font-heading)] [&_h2]:[font-family:var(--client-font-heading)]"
      >
        <PreviewBanner preview={preview} />

        <header className="border-b border-[color-mix(in_srgb,var(--client-text)_8%,transparent)]">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-[var(--merevo-space-page)] py-5">
            <a href="#top" className="flex items-center gap-3">
              {branding.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={branding.logo_url}
                  alt=""
                  className="h-8 w-auto object-contain"
                />
              ) : null}
              <span
                className={
                  isStudio
                    ? "font-serif text-xl tracking-tight"
                    : "text-lg font-semibold tracking-tight"
                }
              >
                {business.name}
              </span>
            </a>
            <nav aria-label="Primary">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[color-mix(in_srgb,var(--client-text)_72%,transparent)]">
                {showServices ? (
                  <li>
                    <a href="#services" className="hover:text-[var(--client-text)]">
                      Services
                    </a>
                  </li>
                ) : null}
                {showStaff ? (
                  <li>
                    <a href="#team" className="hover:text-[var(--client-text)]">
                      Team
                    </a>
                  </li>
                ) : null}
                {showBooking ? (
                  <li>
                    <a href="#book" className="hover:text-[var(--client-text)]">
                      Book
                    </a>
                  </li>
                ) : null}
                {showContact ? (
                  <li>
                    <a href="#contact" className="hover:text-[var(--client-text)]">
                      Contact
                    </a>
                  </li>
                ) : null}
              </ul>
            </nav>
          </div>
        </header>

        <main>
          {showHero ? (
            <section
              className={
                isMinimal
                  ? "mx-auto max-w-3xl px-[var(--merevo-space-page)] py-16 text-center"
                  : "mx-auto grid max-w-5xl gap-10 px-[var(--merevo-space-page)] py-16 lg:grid-cols-2 lg:items-center"
              }
            >
              <div className={isMinimal ? "space-y-6" : "space-y-6"}>
                <h1
                  className={
                    isStudio
                      ? "font-serif text-4xl leading-tight tracking-tight sm:text-5xl whitespace-pre-line"
                      : "text-4xl font-semibold leading-tight tracking-tight sm:text-5xl whitespace-pre-line"
                  }
                >
                  {copy.hero_heading}
                </h1>
                <p className="text-base leading-relaxed text-[color-mix(in_srgb,var(--client-text)_72%,transparent)] whitespace-pre-line">
                  {copy.hero_body}
                </p>
                {showBooking && copy.hero_primary_cta ? (
                  <div className={isMinimal ? "flex justify-center" : undefined}>
                    <a
                      href="#book"
                      className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-[var(--client-background)]"
                      style={{ backgroundColor: "var(--client-accent)" }}
                    >
                      {copy.hero_primary_cta}
                    </a>
                  </div>
                ) : null}
              </div>
              {!isMinimal ? (
                <div className="overflow-hidden rounded-3xl bg-[color-mix(in_srgb,var(--client-primary)_10%,var(--client-background))]">
                  {heroImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroImage}
                      alt=""
                      className="aspect-[4/5] w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[4/5] items-center justify-center p-8 text-center text-sm text-[color-mix(in_srgb,var(--client-text)_55%,transparent)]">
                      Upload a hero image in Admin → Settings → Content
                    </div>
                  )}
                </div>
              ) : null}
            </section>
          ) : null}

          {showServices ? (
            <section
              id="services"
              className="mx-auto max-w-5xl scroll-mt-8 px-[var(--merevo-space-page)] py-14"
            >
              <div className="mb-8 space-y-3">
                <h2
                  className={
                    isStudio
                      ? "font-serif text-3xl tracking-tight"
                      : "text-3xl font-semibold tracking-tight"
                  }
                >
                  {copy.about_heading}
                </h2>
                {aboutParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="max-w-2xl text-sm leading-relaxed text-[color-mix(in_srgb,var(--client-text)_70%,transparent)] whitespace-pre-line"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {booking.services.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {booking.services.map((service) => (
                    <li
                      key={service.id}
                      className="rounded-2xl border border-[color-mix(in_srgb,var(--client-text)_10%,transparent)] bg-[color-mix(in_srgb,var(--client-primary)_4%,var(--client-background))] p-5"
                    >
                      <p className="font-medium text-[var(--client-text)]">
                        {service.name}
                      </p>
                      {service.description ? (
                        <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--client-text)_68%,transparent)]">
                          {service.description}
                        </p>
                      ) : null}
                      <p className="mt-3 text-xs font-semibold tracking-wide text-[var(--client-accent)] uppercase">
                        {service.duration_minutes} min
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[color-mix(in_srgb,var(--client-text)_60%,transparent)]">
                  Services will appear here once Liam adds them in admin.
                </p>
              )}
            </section>
          ) : null}

          {showStaff ? (
            <section
              id="team"
              className="mx-auto max-w-5xl scroll-mt-8 px-[var(--merevo-space-page)] py-14"
            >
              <h2
                className={
                  isStudio
                    ? "mb-4 font-serif text-3xl tracking-tight"
                    : "mb-4 text-3xl font-semibold tracking-tight"
                }
              >
                The team
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[color-mix(in_srgb,var(--client-text)_70%,transparent)]">
                Your specialists are ready when you are. Book a time below and
                we will match you with the right person.
              </p>
            </section>
          ) : null}

          {showBooking ? (
            <section
              id="book"
              className="mx-auto max-w-3xl scroll-mt-8 px-[var(--merevo-space-page)] py-16"
            >
              <div className="mb-8 space-y-3 text-center">
                <h2
                  className={
                    isStudio
                      ? "font-serif text-3xl tracking-tight sm:text-4xl"
                      : "text-3xl font-semibold tracking-tight sm:text-4xl"
                  }
                >
                  Book an appointment
                </h2>
                <p className="text-sm text-[color-mix(in_srgb,var(--client-text)_60%,transparent)]">
                  Choose a service and a time that works for you.
                </p>
              </div>
              <div className="rounded-3xl border border-[color-mix(in_srgb,var(--client-text)_8%,transparent)] bg-[var(--client-background)] p-6 shadow-[0_20px_60px_color-mix(in_srgb,var(--client-text)_8%,transparent)] sm:p-8">
                <BookingWidget
                  businessName={business.name}
                  businessSlug={business.slug}
                  bookingMode={booking.settings.booking_mode}
                  externalBookingUrl={booking.settings.external_booking_url}
                  services={booking.services}
                  turnstileSiteKey={
                    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? null
                  }
                  dashboardMode={booking.dashboardMode}
                  maxPartySize={booking.settings.max_party_size}
                  embed
                  submitLabel="Request appointment"
                  className="[&_button]:rounded-full [&_button]:bg-[var(--client-accent)] [&_button]:text-[var(--client-background)]"
                />
              </div>
            </section>
          ) : null}
        </main>

        {showContact ? (
          <footer
            id="contact"
            className="scroll-mt-8 border-t border-[color-mix(in_srgb,var(--client-text)_10%,transparent)]"
          >
            <div className="mx-auto flex max-w-5xl flex-col gap-4 px-[var(--merevo-space-page)] py-10 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="font-medium">{business.name}</p>
                <p className="text-sm text-[color-mix(in_srgb,var(--client-text)_65%,transparent)] whitespace-pre-line">
                  {copy.contact_tagline}
                </p>
              </div>
              <div className="space-y-1 text-sm text-[color-mix(in_srgb,var(--client-text)_70%,transparent)]">
                {booking.settings.notification_email ? (
                  <a
                    href={`mailto:${booking.settings.notification_email}`}
                    className="block hover:text-[var(--client-text)]"
                  >
                    {booking.settings.notification_email}
                  </a>
                ) : null}
                {booking.settings.contact_phone ? (
                  <a
                    href={`tel:${booking.settings.contact_phone.replace(/\s+/g, "")}`}
                    className="block hover:text-[var(--client-text)]"
                  >
                    {booking.settings.contact_phone}
                  </a>
                ) : null}
              </div>
            </div>
            <div className="border-t border-[color-mix(in_srgb,var(--client-text)_8%,transparent)]">
              <p className="mx-auto max-w-5xl px-[var(--merevo-space-page)] py-4 text-xs text-[color-mix(in_srgb,var(--client-text)_50%,transparent)]">
                © {new Date().getFullYear()} {business.name}. Powered by Merevo.
              </p>
            </div>
          </footer>
        ) : null}
      </div>
    </ClientSiteTheme>
  );
}

export function AppointmentsMinimalLayout(props: ClientSiteLayoutProps) {
  return <AppointmentsClassicLayout {...props} variant="minimal" />;
}

export function AppointmentsStudioLayout(props: ClientSiteLayoutProps) {
  return <AppointmentsClassicLayout {...props} variant="studio" />;
}
