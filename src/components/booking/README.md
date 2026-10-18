# Booking feature components

- `BookingRequestForm` — public Mevero request form
- `BookingWidget` — reusable meridian / external / hybrid surface for client templates and `/book/[businessSlug]`

Embed example for Mevero client sites:

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

No Fresha / Treatwell / Google Calendar sync — modes only control Mevero requests vs an external link.
