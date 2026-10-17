---
id: 20261017-143533-feature-0156-sdd-init
title: Tasks — sdd-init
---

# Tasks — sdd-init (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd init`: registro de la init en curso y `--finish` | done | 642d2052 | Vitest de `cli/test/init/`, README con el bloque marcado |
| 2 | Skill `sdd-init` con su batería, migraciones y hook | done | 2d738fbd | RED n1–n3 (n1 y n2 exhiben B4 y B6), GREEN n1–n5 8/8, REFACTOR n1 2/2 |
| 3 | Retirada de las dos init y de tres plantillas, y enrutado | done | bcd4db7b | tramo `sdd-init` de `using-sdd`: i1 e i2 1/1 |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura opus+high, With fixes, sobre bcd4db7b

Pasada de fix: juntada en el cierre, 4 hallazgos RED→GREEN — `--config` antes de la primera aprobación va a `init.config`, BOM, `sdd-kit.json` que no es objeto, duplicación de `isRecord`, test del hook con init en curso

Re-revisión: bcd4db7b..cierre (juntada en el cierre), sdd-kit:effort-high + opus, limpia (5 hallazgos resueltos; 3 Minor nuevos: el tipo de `mergeSettings`, un cast sobrante en `verbs.ts` y sin test de un `settings.json` cuya raíz no es objeto)

Sujetos: 15 en Sonnet, 2,31 $ (RED 3, GREEN 8, REFACTOR 2, enrutado 2), dentro del techo de 17 y 14 $.

## Rulings

- Línea base: Ruling: kit:test 1326 verdes y 1 rojo de tiempo («Conjunto rápido del pre-commit tarda menos del umbral», 88 s) con la suite de la CLI y sujetos corriendo a la vez — carga de la máquina, no código: se repite sola en el gate de cierre — coste si es erróneo: un test lento sin marcar Slow que vería el pre-commit
- Task 1: Ruling: copia RED de verbs.test.ts cambia solo el import de fs (namespace → default) para poder espiar writeFileSync — sin cambio de asserts — coste si es erróneo: ninguno
- Task 1: Ruling: cli:test-slow con carga dio 2 rojos ajenos (merge/hotfix timeout 120 s, roadmap/publish cerrojo); aislados con init.slow, 29/29 verdes — coste si es erróneo: un lento inestable que verá el gate de cierre
- Task 2: Ruling: RED n3-1 no llega a §Testing (pregunta antes ids.mode): ni lo exhibe ni lo refuta; la guidance de §Testing se escribe por la evidencia de campo de la 0097 (cuatro tickets de document-manager) y la mide el GREEN — coste si es erróneo: una fila de la tabla de la entrevista sin RED propio
- Task 2: Ruling: el molde code-progress lleva en init.config todas las claves de sdd-config, para que el GREEN de n2/n3 llegue a operations.md sin las siete preguntas — coste si es erróneo: no se mide la recuperación de una config a medias (la cubre marker.test.ts)
- Task 2: Ruling: REFACTOR de forma en el bullet de CLAUDE.md («A previous CLAUDE.md follows step 2 even when resuming…») — n1 relanzado n=2: 2/2 a discrepancias, CLAUDE.md sin tocar — 13 sujetos, 2,05 $ — coste si es erróneo: ninguno
- Task 2: Ruling: el traslado de migrations/ obliga a cambiar ya su ruta en 10 Pester, sdd-archive, sdd-end-release, la batería de sdd-archive y lib.sh (con la ruta vieja de reserva para kits de RED); los textos de las viejas siguen hasta la Task 3 — coste si es erróneo: ninguno
- Task 3: Ruling: WordBudget tenía las filas viejas con otra sangría; el borrado por regex no las quitó en la Task 2 y la fila de sdd-init quedó con dos espacios: corregido aquí — coste si es erróneo: ninguno
- Task 3: Ruling: cli:test pasa de 968 a 965 por los tests que recorren las plantillas una a una (tres plantillas menos) — coste si es erróneo: ninguno
- Final: minor (deferred): mergeNode con 4 parámetros (tope 3, +1); updated en UTC; --ignore acepta un espacio final y saltos de línea; «ya está al día» compara con plugin.json y el hook con la última migración; v2.0.0.md:38 nombra sdd-init-brownfield (migración pasada, no se toca por la decisión 24)
- Final: Ruling: el gate de cierre repite el rojo de tiempo de «Conjunto rápido del pre-commit» (62 s) como en la línea base, antes de cualquier cambio — no es de la feature — coste si es erróneo: un pre-commit lento que nadie mira
