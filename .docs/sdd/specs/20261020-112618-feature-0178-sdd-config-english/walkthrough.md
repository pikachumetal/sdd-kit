---
id: 20261020-112618-feature-0178-sdd-config-english
feature: 0178
title: Walkthrough — sdd-config en inglés, con la tabla pricing y la clave review.minors
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-20
---

# Walkthrough — sdd-config en inglés, con la tabla pricing y la clave review.minors

## 1. Cambios realizados

- **`sdd-config` en inglés con dos preguntas de proyecto** (`900f5af1`): `skills/sdd-config/SKILL.md` reescrita sobre su estructura, con la 9 (`review.minors`: `fix` | `defer`, `defer` recomendada) y la 10 (la tabla `pricing`, que el agente propone leyendo `https://platform.claude.com/docs/en/about-claude/pricing` antes de preguntar, con `source` y `updated`; sin poder leerla, no recomienda ni escribe). La init las hace con las de proyecto (`skills/sdd-init/SKILL.md`), una migración no. El contrato «Claves de sdd-kit.json» de `control-profiles.md` gana sus dos filas. Los Pester que leían el catálogo en castellano (`SddConfig`, `NativeAdapt`, `NativeDefault`, `ControlProfiles`) pasan a sus frases en inglés.
- **`review.minors: fix` en el cierre de la revisión** (`cda11f85` y la pasada de fix del cierre): `sdd-verify` condiciona a la clave la viñeta del Minor de «Closing the review», «Act on feedback» y el párrafo Native; `sdd-implement` lo dice en su fila de excusas y en su ejemplo de flujo, porque el cierre se hace a menudo desde allí. Escenario nuevo `c1f` en la batería de `sdd-verify`.
- **Este repo con `review.minors: fix`** (`d2ca1622`): `.docs/sdd/sdd-kit.json`, con la frase del dev-lead en el commit; la fila de `sdd-config` del README nombra precios y Minor.
- **Capacidades**: `configuration` (dos requisitos nuevos y uno sustituido), `verification` (la revisión se cierra una vez, con la clave) y `onboarding` (la entrevista de la init, por enmienda).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 1,49 h — reloj de la sesión 2,29 h desde 2026-10-20T11:21Z, sin 48 min de espera al dev-lead (3 esperas)
- Desviación: −1,01 h (−40 %)
- Causa de la desviación: la estimación contaba el reloj de los sujetos en serie (~41 previstos); corrieron en segundo plano y en tandas paralelas mientras el hilo editaba la task siguiente, también la batería de `using-sdd` (34 sujetos) y la revisión final.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la sesión)
- Tokens del hilo: 61.654.243 — claude-opus-5-5 61.654.243
- Tokens de subagentes: 7.352.038 en 3 despachos — Final review — Code axis claude-sonnet-5-5 1.743.551 / 2 min; Re-review of final review fixes claude-opus-5-5 1.581.278 / 3 min; Final review — Spec axis claude-opus-5-5 4.027.209 / 6 min
- Coste de la sesión: 22,93 $ (hilo 18,67 $ + subagentes 4,26 $)
- Coste de sujetos: 16,22 $ en 55 sujetos sonnet — humos de `sdd-config` y `sdd-init` 1,18 $; `c1f` y `c1` de `sdd-verify` 9,58 $; batería de `using-sdd` 5,45 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La regla de `review.minors` llegó también a `sdd-implement` (fila de excusas y ejemplo), fuera de los ficheros del plan: el GREEN de `c1f` salió 1/2 porque el sujeto cerró la revisión desde `sdd-implement` sin cargar `sdd-verify`.
- Dos Pester más (`NativeAdapt`, `NativeDefault`) y `ControlProfiles` leían el catálogo en castellano; el plan solo nombraba `SddConfig`.
- La rúbrica `C1f` se desempató antes de recalificar (un Minor que abre la re-revisión no cuenta).
- Enmiendas aprobadas: techo de sujetos 50 → 55, y delta `MODIFIED` de `onboarding` (eje Spec de la revisión final).

### Decisiones tomadas sin el dev-lead

- Pre-flight: la fila «I'll fix the minors too» de `sdd-implement` se quedaba — revocado en la Task 2 por el GREEN 1/2 — coste: ninguno.
- Task 1: topes del catálogo — la traducción no ahorró palabras; ajusté la redacción sin quitar reglas hasta 1.449 de 1.450 — coste: una frase más seca.
- Task 1: `NativeAdapt` y `NativeDefault` pasan a inglés — el Scope ya decía «Pester» — coste: ninguno.
- Setup: la línea base corrió con la reescritura a medias (2 rojos causados por ella); `cli:test-slow` y `cli:test-min` quedaron para el gate final, que salió verde — coste: ninguno, visto.
- Task 1: ronda de forma de `cf1` (la fila 10 lee la página antes de preguntar) — coste: ninguno, es la letra de la spec.
- Task 2: la regla también en `sdd-implement`, con el mismo número de palabras de su tope — coste: un fichero fuera del Scope, sin cambiar ningún THEN.
- Task 2: rúbrica `C1f` acotada al Minor del eje Spec — coste: un fallo de la re-revisión que la rúbrica ya no mira.
- Revisión final, Código m1: los literales en castellano de `sdd-config` («falta», «sin precio», la pregunta de a quién aplica) se quedan; la ADR 0004 los admite — coste: un usuario en otro idioma ve tres literales en castellano.
- Revisión final, Código m4: la condición vive en tres sitios, anclados por Pester — coste: tres frases que actualizar juntas.
- Revisión final, Spec (declinado): con `fix`, los Minor que abre la re-revisión salen como `minor (deferred)` y no como `Ruling:`; conducta previa → fila de deuda — coste: un ledger que lista como diferido lo que debía ser ruling.
- Re-revisión con el paquete de la receta, sin las salidas de sujetos (187 KB con `sdd review package`) — coste: el revisor no ve las salidas de control.
- Re-revisión, Minor 1 y 2: el plan y la fila de `sdd-implement`, arreglados tras la re-revisión; Minor 3 («with its prices») y 4 (título y test duplicado en `SddConfig`) se quedan — coste: una frase sin segunda lectura y un test redundante.

## 4. Verificación

### 4.1 Builds

- Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 1078/1078, `cli:typecheck` verde, `kit:test` 1339/1339, `cli:test-min` 1343/1343, `cli:test-slow` 265/265 · 800 s, sobre la pasada de fix de la revisión final. El commit posterior (fila de `sdd-implement` y plan) pasó `SddConfig`, `WordBudget` e `ImplementSkill`: 131/131.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-20 · humos `cf1` 1/1 y `cf2` 1/1 de `sdd-config`, `n4` 1/1 de `sdd-init`; `c1f` 2/2 y `c1` 2/2 de `sdd-verify` con el kit final; batería de `using-sdd` 24/24 · revisión final Spec y Código sobre d2ca1622, re-revisión con todos los hallazgos ADDRESSED · 1 sin revisar: la fila de excusas de `sdd-implement` reescrita tras la re-revisión (Minor 2)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `configuration`: la tabla enseña `pricing` como «falta» y «sin precio» | `cf1` (GREEN, dos rondas) | ejecución real |
| `configuration`: la pregunta de precios va sola, con la tabla leída de la página oficial, ids de API y cinco precios | `cf1` ronda 2 | ejecución real |
| `configuration`: con «sí» escribe `usdPerMillionTokens`, `source` y `updated` | Pester (fila 10) | suite; no probado en ejecución (un turno de `claude -p` no llega al «sí») |
| `configuration`: sin poder leer la página, no inventa y no escribe | Pester (fila 10) | suite; rama no probada en ejecución |
| `configuration`: con «no» o «no sé» no escribe | `cf1` (`pricing` sin escribir sin respuesta) | ejecución real |
| `configuration`: con `pricing` escrita enseña `updated` y modelos, no la pregunta | `cf2` | ejecución real |
| `configuration`: actualizar a petición conserva las filas viejas | — | no probado |
| `configuration`: `review.minors` «falta», rige `defer`, pregunta sola con `defer` recomendada | `cf2` | ejecución real |
| `configuration`: escribe `review.minors` en `sdd-kit.json` | `cf1` («defer» → `"review": {"minors": "defer"}`) | ejecución real |
| `configuration`: `review.minors` y `pricing` son de política, a `sdd-kit.json` | Pester (filas 9 y 10) | suite |
| `verification`: sin la clave o con `defer`, el Minor se difiere | `c1` 2/2 con el kit final | ejecución real |
| `verification`: con `fix`, el Minor entra en la única pasada sin preguntar, con `Final: fixed`, nunca `minor (deferred)` | `c1f` 2/2 con el kit final | ejecución real |
| `verification`: la re-revisión única sale | `c1` y `c1f` 4/4 | ejecución real |
| `onboarding`: la init invoca `sdd-config` con las dos preguntas nuevas | `n4` (arranque de la init) y Pester (`sdd-init`) | ejecución real del arranque; la pregunta 9 y la 10 en una init, no probado |

### 4.3 Residuales / deuda generada

- Con `review.minors: fix`, los Minor que abre la re-revisión salen como `minor (deferred)` en vez de `Final: Ruling:` (`sdd-verify`, «What it leaves open»): fila de deuda nueva.
- El gate de cierre tarda 800 s, más de 10 min: ya lo recoge la deuda de la suite lenta del kit.

## 5. Aprendizajes

- En un lanzador de Git Bash, `export A=… && (sub1) & (sub2); wait` manda el `export` al segundo plano con el primer subshell, y el segundo arranca sin las variables (`run.sh: SPEC_DIR: define SPEC_DIR`): `n4` y dos sujetos de `c1f` no arrancaron por eso. → `tech-stack.md`, «Sujetos headless».
- Una regla del cierre de la revisión escrita solo en `sdd-verify` no llega cuando el agente cierra desde `sdd-implement`: hizo falta en su tabla de excusas y en su ejemplo de flujo (GREEN 1/2 → 2/2). Es la regla de la feature 0146 («una regla que solo vive en una referencia no se lee»), ya en `tech-stack.md`: no se escribe otra; la evidencia está en `tests/sdd-verify-0178-minors.md`.
- Skills revisadas: no aplica más allá de las de esta feature; la conducta del ejemplo de `sdd-implement` ya se cambió en ella.

## 6. Adendas
