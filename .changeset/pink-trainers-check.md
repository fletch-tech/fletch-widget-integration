---
"@fletch-tech/widget": minor
---

convert implementation to class-based approach

why:

- lets the user initialize the widget instead of auto-initializing
  upon documentReady state
- this also lets them wait for the prefill params and then initialize
  the app with that prefilled data (passed using queryParams in the options)

other changes:

- setup and use typescript for the implementation