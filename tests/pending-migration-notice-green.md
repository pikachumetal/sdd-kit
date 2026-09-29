# GREEN — aviso de migraciones pendientes (feature 0109)

Spec: [`spec.md`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/spec.md). RED: [`pending-migration-notice-red.md`](pending-migration-notice-red.md).

## m1 — «ponme el proyecto al día» con `v2.1.0.md`

- **Molde y petición**: los del RED, con el mismo [`red/subject.sh`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/red/subject.sh) y `PHASE=green`. Kit: la copia del RED más `migrations/v2.1.0.md`.
- **Sujeto**: Sonnet, salidas en [`green/out/`](../.docs/sdd/specs/20260929-160116-feature-0109-pending-migration-notice/green/out/). 0,14 $.
- **Resultado**: ✅ frente al ❌ del RED.
  - `sdd-kit.json` pasa a `"version": "2.1.0"` y `"updated": "2026-09-29"`; `channel`, `ids`, `control`, `merge` y `execution` intactos.
  - `git diff --stat` del molde: solo `.docs/sdd/sdd-kit.json`, 1 línea.
  - Commit `chore(sdd): migrar al kit v2.1.0`; sin gates pendientes.
  - Control del paso vecino (Art. I, el GREEN mide también lo que el RED ya cumplía): no hace onboarding ni reescribe documentos de anclaje, igual que en el RED.

## Coste acumulado de la campaña

2 sujetos, 0,37 $.
