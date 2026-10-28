---
id: 20261028-164955-feature-0238-subject-lib-to-node
title: Tasks — La biblioteca del sujeto y los moldes pasan a Node
spec: ./spec.md
plan: ./plan.md
created: 2026-10-28
---

# Tasks — La biblioteca del sujeto y los moldes pasan a Node (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0238-subject-lib-to-node`

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Núcleo de `lib.mjs`: guardas, rutas, molde y guardado | done | 0f1da16 | |
| 2 | Lanzar `claude`: argumentos, segundo turno, persona, tope y puertos | done | 817b741 | |
| 3 | `using-sdd` en Node, el e2e y fuera los tests lentos | done | 1c018d5 | |
| 4 | Los otros 13 moldes en Node y el test de moldes en seco | done | f561e64 | |
| 5 | El repo sin bash y los documentos | done | 4464d27 | |
| 6 | Enmienda 2026-10-28: la suite en el CI de Linux, los rápidos en `cli:test`, el tope por omisión y la longitud de `RUNS_DIR` | done | 3990b93 | |
| 7 | Enmienda 2026-10-28 (2.ª): tope de `RUNS_DIR` de 100 caracteres y textos nuevos en la spec | done | | aprobada: «apruebo» (dev-lead) |

Revisión final: Spec opus+high, With fixes (4 Important, 8 Minor) · Código sonnet+high, With fixes (4 Important, 10 Minor) · Arquitectura no (plan), sobre 3990b93
Pasada de fix: 527d1ce, 26 hallazgos (8 RED→GREEN, el resto con suite 221/221 y comparación sh↔mjs) · 5 rulings
