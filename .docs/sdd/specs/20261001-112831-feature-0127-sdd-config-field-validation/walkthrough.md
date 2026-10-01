---
id: 20261001-112831-feature-0127-sdd-config-field-validation
feature: 0127
title: Walkthrough — sdd-config pregunta la validación en campo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-01
---

# Walkthrough — `sdd-config` pregunta la validación en campo

## 1. Cambios realizados

- **RED** (`0a5efe13`): `red/subject.sh` con el molde `salas` y los escenarios `c1`, `m1`, `g1` (y los de control del GREEN); 6 sujetos con el kit de `develop`: ninguno pregunta quién valida. `tests/sdd-config-field-validation-red.md`.
- **Guía** (`bb13a5ea`):
  - `sdd-config`: pregunta 7 del catálogo, quién valida el trabajo al cerrar, con `manual` recomendado y `field` solo sin pantalla ni uso que el dev-lead pueda probar al cerrar (mirado en `mission.md` y `tech-stack.md`, o en las respuestas de la init). La de `startEnvironment` pasa a la 8, y las init y las migraciones hacen de la 1 a la 7.
  - `sdd-init-greenfield` (fila 19) y `sdd-init-brownfield` (fila 1): «y quién valida el trabajo al cerrar (`validation.mode`)». `generacion.md` escribe `validation.mode` solo con lo respondido.
  - `migrations/v2.3.0.md`: título y entradilla nombran la pregunta; paso 2 «Quién valida» (se salta si ya hay clave; sin dev-lead, pendiente y nunca `field`; no frena el marcador; con `field`, el commit cita la respuesta); `**Escribe**:` con `validation.mode`; una línea más de verificación.
  - Tests: `SddConfig.Tests.ps1` (ocho preguntas, la 7 en `sdd-kit.json` con `manual` recomendado, «de la 1 a la 7», `v2.3.0.md` invoca `sdd-config`), `MigrationInitParity.Tests.ps1` (tres pasos de v2.3.0) y `NativeDefault.Tests.ps1` (frase de `generacion.md`).
  - GREEN: 9 sujetos, `tests/sdd-config-field-validation-green.md`.
- **Capacidades**: `configuration` (ADDED «`sdd-config` pregunta quién valida el trabajo», MODIFIED «… escribe solo lo respondido…»), `onboarding` (MODIFIED «La entrevista fija las claves de control») y `migration` (ADDED «La migración a v2.3.0 pregunta quién valida», MODIFIED su último AND de «… lleva el roadmap a la forma de la plantilla»).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,5h — reloj del hilo aproximado con las marcas de los commits: 13:32 (apertura) a ~14:00 (cierre), hora local del 2026-10-01; spec y plan, ~0,4h aparte
- Desviación: -1h (-67 %)
- Causa de la desviación: las tres tandas de sujetos (RED, GREEN y controles del fix) corrieron en paralelo, en 3-5 min cada una, y la guía fue una fila de catálogo y un paso de migración; la estimación partía de la 0118, con cinco skills y RED por task
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 26.221.888 — claude-opus-5-5 26.221.888
- Tokens de subagentes: 1.580.315 en 1 despacho — Revisor final 0127 claude-opus-5-5 1.580.315 / 3 min
- Coste de la sesión: 10,61 $ (hilo 9,31 $ + subagentes 1,30 $)
- Coste de sujetos: 3,49 $ en 17 sujetos sonnet — RED 1,35 $; GREEN 1,77 $; controles del fix 0,36 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Los dos tests que el plan daba por intactos fijaban literales que la guía cambia: se ajustaron en la Task 2 (ver abajo).
- Pasada de fix de la revisión final (juntada en el cierre): la frase que autoriza `field` va al commit que lleve la clave, en `sdd-config` y en `v2.3.0.md`, también al reanudar la migración.

### Decisiones tomadas sin el dev-lead

- El escenario `g1` se lanzó con las respuestas de la 1 a la 21 (salvo la 19) y «Estaré fuera», no con las de la 1 a la 18 y el usuario presente como decían la spec y el plan: un sujeto headless con el usuario presente pregunta la 1 y se para, sin llegar a la 19. Así mide si la pregunta 7 queda como pendiente — coste si está mal: el camino de la fila 19 con el usuario presente queda sin sujeto (lo cubre `c1`, la misma fila del catálogo).
- `tests/MigrationInitParity.Tests.ps1` fijaba la lista exacta de pasos de `v2.3.0.md` y el plan decía que no se tocaba: el test lista ahora los tres pasos y se renombra — es la consecuencia directa del paso que pide la spec — coste si está mal: un test que nombra mal el orden.
- `tests/NativeDefault.Tests.ps1:109` fijaba la frase de `generacion.md` que la task amplía: el regex sigue la frase nueva y mide lo mismo (`execution` solo con lo respondido) — coste si está mal: ninguno.

## 4. Verificación

### 4.1 Builds

- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` sobre `bb13a5ea` con los borradores → 1.162 pasados, 0 fallos, 10 saltados · 448 s; sobre la pasada de fix → 1.162 pasados, 0 fallos, 10 saltados · 475 s
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact spec.md` → `Capacidades válidas: 14`; `Test-Roadmap.ps1 -Path .docs/sdd` → `Roadmap válido`

### 4.2 Smoke / tests

- Validación en campo: 2026-10-01 · suite 1.162/1.162 en 475 s sobre la pasada de fix · smoke 8/11 THEN con ejecución real (2 de ellos en parte) (17 sujetos headless sonnet: RED 0/6 → GREEN 6/6, controles 9/9 y 2/2), 2 por suite y 1 no probado · revisión final opus «With fixes» sobre bb13a5ea, 1 Important arreglado RED→GREEN en la pasada de fix

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `sdd-config`: la tabla enseña `validation.mode` como «falta · rige `manual`» | ejecución real (`c1` 2/2, `k1`, `c2`, `m1` 2/2) | ✅ |
| `sdd-config`: la pregunta va sola, con `manual` primero y su motivo (la pantalla de `salas`) | ejecución real (`c1` 2/2) | ✅ |
| Con `field` escribe `validation.mode` en `sdd-kit.json`; con «no sé», nada y rige `manual` | `field`: ejecución real (`c3`, `m3`); «no sé» y `manual`: no probado (texto de la fila 7) | ✅ / no probado |
| Kit de skills sin aplicación: recomienda `field` | ejecución real (`k1`) | ✅ |
| `validation.mode` es de política: va a `sdd-kit.json`, nunca al fichero local | ejecución real (`c2`: no escribe `sdd-kit.local.json` y ofrece cambiarla para el equipo) | ✅ |
| Resto de «`sdd-config` escribe solo lo respondido…», sin cambios | suite (`SddConfig.Tests.ps1`, `LocalConfig.Tests.ps1`) | ✅ |
| Init: `sdd-config` pregunta quién valida, con `manual` (`field` solo sin pantalla ni uso) | ejecución real (`g1` 2/2, sin usuario: pendiente, «rige `manual`», recomienda `manual`); con el usuario presente: no probado (decisión de `g1`) | ✅ / no probado |
| Migración, dev-lead presente: invoca `sdd-config`, pregunta quién valida y escribe solo lo respondido | ejecución real (`m1` 2/2 preguntan y paran; `m3` escribe `field` con la frase en el commit) | ✅ |
| Migración con la clave ya escrita: el paso se salta | no probado (texto del paso 2) | no probado |
| Migración sin dev-lead: no escribe la clave, nunca `field`, pendiente con cómo reanudarla y marcador a 2.3.0 | ejecución real (`m2`, commit `cb0ac72` del molde) | ✅ |
| `v2.3.0.md` declara `validation.mode` en `**Escribe**:` y `MigrationInitParity.Tests.ps1` sigue en verde | suite | ✅ |

### 4.3 Residuales / deuda generada

- Tres Minor diferidos de la revisión final: el paso 2 de `v2.3.0.md` no dice «solo su pregunta 7» (una migración podría volver a preguntar claves que faltan a propósito, como un «no» al merge); el escenario `g1` ejecutado no es el de la spec (ver «Decisiones tomadas sin el dev-lead»); la fila 7 no dice dónde mirar en una init brownfield (en el inventario).
- Durante la suite completa desaparecieron dos worktrees de la sesión: el de revisión (`review-0127-bb13a5ea`, junto a los de las features) y el del kit del RED (en el scratchpad). La revisión terminó con `git show`. Causa no investigada: algo, quizá un test de la suite o un proceso externo, borra worktrees vivos del repo.

## 5. Aprendizajes

- Un test estático que fija una frase literal o una lista exacta de pasos (`MigrationInitParity`, `NativeDefault`) obliga a tocarlo cuando otra feature amplía esa frase, aunque el plan lo dé por intacto: al planificar una edición de una skill, buscar en `tests/*.Tests.ps1` las frases y listas que se van a cambiar y ponerlos en «Modificar» → `tech-stack.md` (campañas headless y tests estáticos).
- `git worktree add` de este repo en el scratchpad falla con `Filename too long` sin `core.longpaths` → ya estaba en `tech-stack.md` (feature 0096); se repitió por no leerlo antes de crear el kit del RED.
- Skills revisadas al cerrar: `sdd-config`, `sdd-init-greenfield`, `sdd-init-brownfield` (las que cambia esta feature); ninguna otra pide cambio por lo aprendido.

## 6. Adendas
