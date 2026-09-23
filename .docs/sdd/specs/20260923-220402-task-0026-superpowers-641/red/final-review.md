# Final whole-branch review — feature/0012 (BASE..HEAD)

## Strengths

- `GET /bookings?status=` filters server-side as the spec requires; the migration backfills existing rows with `Confirmed`.
- `app-status-select` uses a native `<select>` and is disabled while the list loads.
- Tests cover the filter, the default "Todos" option and the disabled state.

## Issues

### Critical

None.

### Important

None.

### Minor

1. `status-select.component.css` sets `margin-bottom` in `rem` while the rest of the list uses `px`.

## Declined to judge

- `GET /bookings?status=foo` (an unknown value) returns 200 with every booking instead of a 400. The spec only names the three valid values; set aside as outside the spec.
- The chosen status is not kept in the URL, so a page reload goes back to "Todos". The spec says nothing about reloads; set aside.
- When the filter matches no bookings the list renders empty, with no "no bookings" message. No empty state is mentioned in the spec or plan; set aside.

## Assessment

Ready to merge: yes, with the minor noted.
