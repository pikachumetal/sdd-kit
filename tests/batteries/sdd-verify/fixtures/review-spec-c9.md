## Spec

### Strengths
- Both THEN of the 0010 have their test in `test/cancel.test.js`.

### Issues

#### Critical (Must Fix)
None.

#### Important (Should Fix)
None.

#### Minor (Nice to Have)
1. Minor · partial · `src/app.js:35-37` · `cancelledList` has no limit: with a long history, `canceladas` prints every cancellation ever made. Fix: cap it, for instance at the last 10 · THEN «El listado de canceladas enseña el motivo».

### Not verified
ninguna

### Assessment
**Ready to merge?** Yes
