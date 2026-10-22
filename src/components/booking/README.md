# Booking feature components

- `BookingRequestForm` — public Merevo request form
- `BookingWidget` — reusable meridian / external / hybrid surface for client templates and `/book/[businessSlug]`

Embed example for Merevo client sites:

```tsx
import { BookingWidget } from "@/components/booking/booking-widget";

<BookingWidget
  businessName="Aura Salon"
  businessSlug="aura-salon"
  bookingMode="hybrid"
  externalBookingUrl="https://example.com/book"
  services={services}
/>
```

No Fresha / Treatwell / Google Calendar sync — modes only control Merevo requests vs an external link.
