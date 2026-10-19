# RED — migración v3.0.0 (feature 0197)

Baseline con el kit de la base de la rama (`git archive e71ce503 skills .claude-plugin cli hooks`), que no trae `v3.0.0.md`. Batería [`tests/batteries/sdd-upgrade/`](batteries/sdd-upgrade/battery.md), escenario `v1` sobre el molde `mold-v2x` (un proyecto 2.x completo en 2.3.4), con Sonnet y `SUPERPOWERS_DIR` en la 7.0.0. Salidas en [`.docs/sdd/specs/20261019-083116-feature-0197-v3-migration/red/out/`](../.docs/sdd/specs/20261019-083116-feature-0197-v3-migration/red/out/). 2026-10-19. Molde pasado antes por `DRY_RUN=1`. 2 sujetos (la batería corre la n del escenario, no 1 como decía la previsión), 0,24 $.

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `v1-1` | `sdd-upgrade` | `sdd upgrade --root` → «El proyecto ya está al día con el kit 2.3.4. No había migraciones pendientes y no he tocado nada.» Los nueve documentos 2.x siguen en `.docs/sdd/`; no hay `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` ni `steering/` | V1 ❌, V2 ❌, V3 ❌ |
| `v1-2` | `sdd-upgrade` | igual | V1 ❌, V2 ❌, V3 ❌ |

**Lectura**: sin migración a la 3.0.0, un proyecto 2.x no tiene cómo llegar a la estructura nueva: el kit lo da por al día. Es el hueco que llena `v3.0.0.md`.
