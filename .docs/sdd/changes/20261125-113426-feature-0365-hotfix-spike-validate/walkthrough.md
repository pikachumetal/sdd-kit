---
id: 20261125-113426-feature-0365-hotfix-spike-validate
title: Walkthrough — El hotfix y el spike también validan en sdd-validate
spec: ./spec.md
plan: ./plan.md
---

# Walkthrough — El hotfix y el spike también validan en sdd-validate

## 1. Cambios realizados

- `skills/sdd-validate/SKILL.md`, «Order»: el hotfix recorre los pasos del patch (1, 2, 4, 5); el spike corre el gate solo si toca algo commiteado fuera de su carpeta, contrasta cada fila de `research.md` con su evidencia en lugar del guion y lleva solo el eje Spec. «A failure goes back»: la vuelta del spike lleva «Evidencia», y falla solo una fila que no se sostiene; `no cumple` y `no medido con una persona` son resultados.
- `skills/sdd-validate/references/validation-modes.md:3`, `skills/sdd-archive/SKILL.md` paso 1, `skills/sdd-archive/references/closing-suite.md:7` y `skills/sdd-implement/references/patch-flow.md` paso 7: fuera la rama que validaba el hotfix y el spike en el cierre.
- `cli/test/kit/word-budget.test.ts`: topes de `sdd-validate` a 765 / 1847 (medido: 744 / 1810).
- Batería de `sdd-validate`: `vf8` (hotfix, molde `salas-hotfix-open`) y `vf9` (spike, molde `reservas-spike`); el molde `salas-hotfix` de `a4` de `sdd-archive` llega ya validado.
- ADR: los cinco carriles que implementan validan en `sdd-validate` → `decisions/0044-every-lane-validates-in-validate.md` (sustituye a la 0043)
- Capacidades: `validation` (dos requisitos modificados, dos añadidos, «Límites») y `archive` (el requisito del cierre y «Avisos»).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 1,62 h — reloj de la sesión 2,72 h desde 2026-11-25T11:22Z, sin 66 min de espera al dev-lead (5 esperas)
- Desviación: +0,62 h (+62 %)
- Causa de la desviación: el molde del spike se rehízo tres veces (esqueleto, carpeta `specs/`, modelo en vez de `freeRooms`) y la re-revisión abrió la Task 4; las tandas de sujetos corrieron en serie
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 43.434.229 — claude-opus-5-5 43.434.229
- Tokens de subagentes: 7.569.307 en 6 despachos — Re-review fix pass 0365 claude-opus-5-5 2.113.917 / 3 min; Revisión spec 0365 técnica claude-sonnet-5-5 202.019 / 1 min; Revisión spec 0365 dominio claude-opus-5-5 298.035 / 1 min; Final review — Code axis 0365 claude-sonnet-5-5 1.146.470 / 2 min; Final review — Spec axis 0365 claude-opus-5-5 3.309.976 / 5 min; Revisión del diff de la Task 4 claude-sonnet-5-5 498.890 / 1 min
- Coste de la sesión: 19,51 $ (hilo 14,31 $ + subagentes 5,20 $)
- Coste de sujetos: 14,41 $ en 16 sujetos sonnet — RED 3,82 $ (con el relanzado de vf9); GREEN y controles 5,68 $; pasada de fix 3,21 $; Task 4 1,70 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 18

## 3. Desviaciones del plan

### Decisiones tomadas sin el dev-lead

- El molde de `vf8` se llama `salas-hotfix-open`: `salas-hotfix` ya existía (escenario `a4` de `sdd-archive`) y gana la validación registrada, porque si no `sdd-archive` lo devolvería.
- `vf8` salió limpio en el RED (2/2): los sujetos ya pasaban por `sdd-validate` porque el paso 7 de `patch-flow.md` lo nombra primero; queda como control, y el arreglo del texto lo prueba el `git grep` del criterio de hecho.
- El primer RED de `vf9` se descartó: el script de medida del molde era un esqueleto y los sujetos reabrieron O1 por eso. El molde se rehízo con una cuenta de comparaciones determinista.
- La re-revisión dejó `vf9` en 1/2 frente al 2/2 del Intent: parada con el dev-lead, que eligió una vuelta más («1»); la Task 4 (enmienda 2026-11-25) dijo dónde registra el spike y arregló el molde, y `vf9` dio 2/2.
- El resto de rulings de la ejecución y de la revisión, uno por línea con su coste, en `## Rulings` de `tasks.md`.
- `kit:own` rechazó la forma «only … instead of» de las dos frases nuevas; se reescribieron sin cambiar su contenido, y `vf9` volvió a correr como control con el texto final.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 798/798 · cli:typecheck: corrió · cli:test: corrió 2591/2591 (sobre 32060ca)
- Gate de la vuelta: `moon run kit:test-headless cli:typecheck cli:test --affected --base 32060ca55` → kit:test-headless: corrió 798/798 · cli:typecheck: corrió · cli:test: corrió 2591/2591 (sobre d39944a)

### 4.2 Smoke / tests

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Hotfix: `sdd-validate` con gate, guion y `Validación en campo:` antes de `sdd-archive` | ejecución real (`vf8`, GREEN 2/2) | ✓ |
| Hotfix: sin revisión final ni ejes | ejecución real (`vf8`) | ✓ |
| Hotfix: un paso del guion que falla vuelve como task con test | no probado: el molde no falla; regla del patch | — |
| Hotfix: pre-check 5 y fusión a `main` siguen en `sdd-archive` | ejecución real (`a4`, control 1/1) | ✓ |
| Spike: sin gate ni guion, contrasta cada fila | ejecución real (`vf9`, GREEN 2/2, control 1/1, Task 4 2/2) | ✓ |
| Spike: registra en el borrador del walkthrough | ejecución real (`vf9-1` de la Task 4; `vf9-2` para antes de registrar) | ✓ 1/1 donde llega |
| Spike: invoca `sdd-archive` tras registrar | no probado: ningún sujeto lo invoca, lo dejan a la orden del dev-lead | — |
| Spike: O2 vuelve con «Evidencia»; O1 y O3 no | ejecución real (`vf9`) | ✓ |
| Spike: tabla de aguante < 10 o recomendación sin medir también vuelven | no probado: el molde no lo ejerce | — |
| Spike: eje Spec solo | ejecución real (`vf9`) | ✓ |
| Spike: con un fichero fuera de su carpeta corre el gate | no probado (spec) | — |
| Patch y feature siguen igual | ejecución real (`vf5`, `vf1`, control 1/1) | ✓ |
| Cierre: ninguna rama de validación del hotfix o del spike | ejecución real: `git grep -n "Hotfix only:\` and a spike" skills/` → sin salida | ✓ |
| Cierre: un hotfix o un spike sin línea vuelven a `sdd-validate` | no probado en batería (spec) | — |

Validación en campo: 2026-11-25 · smoke de arriba, una fila por THEN, con las tandas de `vf8` (2/2), `vf9` (2/2 en la Task 4) y los controles `vf5`, `vf1`, `a4` (1/1) y el `git grep` del criterio de hecho; gate en verde sobre d39944a; revisión final con arreglos, pasada de fix e08d609, re-revisión de Opus y revisión del diff de la Task 4 (5 Minor: 1 arreglado, 4 adjudicados); no probado: la vuelta de un hotfix por un paso del guion, la tabla de aguante < 10 y la recomendación sin medir del spike, el spike que toca un fichero fuera de su carpeta, `sdd-archive` devolviendo un hotfix o un spike sin línea, y el paso a `sdd-archive` tras registrar el spike

## 5. Aprendizajes

- Un molde de spike tiene que aguantar que el sujeto relea su script y su spec: un script esqueleto, una carpeta fuera de `changes/`, una spec que contradice un objetivo o una medida sobre un modelo hacen que el sujeto reabra filas o pare por el molde y no por la regla. Va a la procedencia de la batería de `sdd-validate`.
- Retro: error que cazaría un chequeo → ticket del kit: el pre-commit corre `cli:test` sobre el árbol de trabajo y no sobre el índice, así que un `dist/` reconstruido y sin stagear pasa; lo vieron los dos ejes de la revisión final
- Retro: documento o skill desmentido → ticket del kit: `vf9` muestra sujetos que paran a preguntar antes de volver a `sdd-implement` y que no invocan `sdd-archive` tras registrar, contra el «without asking» y el paso 5 de `sdd-validate`
