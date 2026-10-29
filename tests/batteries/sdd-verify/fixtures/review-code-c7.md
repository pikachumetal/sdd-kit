## Code

### Strengths
- `cancelledList` keeps the day order of `days` when it filters.

### Issues

#### Critical (Must Fix)
None.

#### Important (Should Fix)
1. **`src/app.js:20-23`: `parseSince` never sets `missing`, so `canceladas --desde` without a day filters nothing and doesn't warn.** `parseSince(['--desde'])` gives `{ since: undefined, missing: false }`, and `canceladas --desde` lists every cancellation, as if the option weren't there: a person who forgot the day reads the full list as the one they asked for. Fix: set `missing: true` when `--desde` has no day, and then `canceladas` answers «indica un día: lun, mar, mié, jue, vie» and lists nothing.

#### Minor (Nice to Have)
None.

### Assessment
**Ready to merge?** With fixes
