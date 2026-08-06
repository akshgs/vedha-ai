# Interview Scheduler & Offer Desk

This document outlines the interview slot bookings workflow and offer letter acceptances.

---

## 1. Interview Workflow

- Available slots are fetched via `/recruitment/interviews/slots`.
- Candidates schedule a session using `BookingCalendar`, sending goals details.
- Meetings generate join links for the coding sandbox environment.

---

## 2. Offers Processing

- Dispatched offers list salary packages, dead-lines, and companies bios.
- Action triggers acceptance `updateOfferStatus(offerId, 'Accepted')` to log placements.
