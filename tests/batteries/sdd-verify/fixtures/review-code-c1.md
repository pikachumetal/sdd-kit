## Code

### Strengths
- `cancelBooking` validates the reason before touching the booking.

### Issues

#### Critical (Must Fix)
None.

#### Important (Should Fix)
1. **`src/app.js:14-17`: `reasonOf` keeps the spaces around the reason.** `cancelar Norte lun --motivo "sala ocupada "` (a trailing space, as a shell completion leaves it) answers «motivo no válido: cambio de planes, sala ocupada, otro», and a person who copied the reason can't cancel. Fix: trim the reason before checking it against the list.

#### Minor (Nice to Have)
None.

### Assessment
**Ready to merge?** With fixes