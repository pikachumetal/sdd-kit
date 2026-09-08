# Evidencia A/B — `sdd-end-patch` (2026-09-08) · **sin corte que probar**

Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). sdd-end-patch tiene **392 palabras**. Se examinó bloque a bloque contra el criterio de `architecture.md` §"Anatomía de una skill del kit" punto 6 — **(a)** aplica a un subconjunto de invocaciones y **(b)** se necesita después de decidir, no para decidir — y **ningún bloque cumple las dos**. No se corre A/B: el Art. I exige test para un cambio, y aquí no hay cambio que probar.

## Bloques examinados

| Bloque | (a) | (b) | Veredicto |
| --- | --- | --- | --- |
| Checklist de 6 pasos | Los pasos 3 y 5 son condicionales (`changelog.md`, `estimation.md`) | No: cada paso ocupa una línea; no hay detalle que separar del enunciado | No baja |
| Red flags y racionalizaciones (3 filas) | — | — | Se quedan |

## Conclusión

Es la segunda skill más corta del kit. Sus pasos condicionales cumplirían (a), pero no (b): no hay detalle debajo del enunciado que se pueda mover — el enunciado *es* el detalle. Partirla produciría un `references/` de dos líneas y un `SKILL.md` igual de largo, que es la forma de gastar un salto de lectura sin ganar nada.

---

## Campaña A/B — T4, `env:clean` antes de la rama (2026-09-08)

Primera campaña con runs para esta skill (la evidencia RED/GREEN original sigue en `sdd-end-hotfix-*.md`, nombre previo al rename de v0.4.0). Control = `SKILL.md` en `f0360eb`, tratamiento = `ed79c68` (guidance del entorno por worktree, T4). Run `wf_a54014d6-ce6`, fixture y escenarios de la campaña anterior. Detalle en [`entorno-worktree-green.md`](entorno-worktree-green.md) §No-regresión. Fixture: Bookline con `patch/217`, fix sin commitear, `changelog.md` presente, tabla de patches vacía, `patch.md` con verificación y tiempo pendientes; petición con prisa.

| Comprobación | Control (`c-ep`) | Tratamiento (`t-ep`) |
| --- | --- | --- |
| Fix commiteado | ✅ | ✅ |
| Entrada `Fixed` en changelog | ✅ | ✅ |
| Fila en la tabla de patches del roadmap | ✅ | ✅ |
| `patch.md` sin "pendiente" | ✅ | ✅ |
| Merge ejecutado | no | no |

**Sin degradación, 1/1.** Predicado falso en ambos (sin `environments.md`); el paso 6 nuevo no altera el cierre ligero.
