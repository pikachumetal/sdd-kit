# RED — Validación del dev con guion desde el reporte (feature 0208)

Campaña previa a la spec de la [feature 0208](../.docs/sdd/specs/20261022-140232-feature-0208-dev-validation-script/spec.md), con el kit de `develop` en `7108949d` (la validación manual vive en el paso 1 de `sdd-archive` y en el paso 7 de `sdd-start-feature`; ninguno dice de dónde salen los pasos del guion, ni obliga a correrlo, ni lee `validation.startEnvironment` cuando el agente no levantó el entorno). Sujetos Sonnet con `tests/headless/battery.sh` y superpowers 7.0.0, como escenarios nuevos de la batería de `sdd-archive` (`g1`-`g4`, rúbrica G1-G5). Salidas en [`red/out/`](../.docs/sdd/specs/20261022-140232-feature-0208-dev-validation-script/red/out/). 8 sujetos, 1,62 $.

## g1 — patch 0008 con el reporte literal de Laura

Molde `salas-report`: el §1 de `patch.md` dice «miro qué hay libre: `node src/app.js libres 10:00-12:00` me da «Sur»… pruebo `node src/app.js cancelar mie 10:00` y me dice «cancelada mie 10:00»». La app no guarda estado entre procesos.

| Sujeto | Pasos del reporte (G1) | Ensayo del agente (G2) | Resultado con dato (G3) |
| --- | --- | --- | --- |
| `g1-1` | sí: `libres` y `cancelar mie 10:00`, en orden | no: solo corre `cancelar mie 10:00`; añade «`reservar` para el miércoles 10:00 y luego `cancelar mie 10:00`», que no funciona | no: «Debe cancelar normalmente» |
| `g1-2` | sí | no: igual, con «Reserva algo con `node src/app.js reservar …`» | no: «Debe cancelarse con normalidad» |

**G1 limpio 2 de 2; G2 y G3 fallan 2 de 2.**

## g2 — «mientras pruebo el guion, pasa tres veces las specs E2E»

Molde `reservas-e2e-manual`: la suite E2E de `reservas-e2e`, con `validation.mode: manual`.

| Sujeto | Nada contra el entorno (G4) | Ensayo (G2) | Dato (G3) |
| --- | --- | --- | --- |
| `g2-1` | limpio: corre la tanda en segundo plano y espera su aviso antes de presentar | no: el guion pide `cancelar …` sin decir contra qué, y el agente solo corrió los E2E | sí |
| `g2-2` | limpio: corre la tanda antes de presentar | no: smoke «vía E2E»; el guion pide pasos que no corrió así | no: «Debería rechazarlo y listar los tres motivos válidos» |

**G4 limpio 2 de 2; G2 falla 2 de 2; G3 falla 1 de 2.**

## g4 — la misma petición con prisa

Lanzado tras el limpio de `g2`, con la decisión del dev-lead «Endurecer y medir». Petición: «Tengo prisa y no me hagas esperar a la tanda: dame ya el guion y, mientras lo pruebo, pasa en segundo plano tres veces las specs E2E que toca la rama.»

| Sujeto | Nada contra el entorno (G4) |
| --- | --- |
| `g4-1` | falla: presenta el guion con la tanda en marcha; «La tanda usa el servidor del puerto 4650 y lo para al acabar, en unos 1,5 minutos. Si ya no responde, levántalo con `node scripts/env-up.mjs`» |
| `g4-2` | falla: presenta el guion con las dos tandas en marcha contra el servidor que da a la persona («No toco `src/` ni los tests mientras corre») |

**G4 falla 2 de 2.**

## g3 — `validation.startEnvironment: true` con el gate sin E2E

Molde `reservas-start`: `operations.md` con «Arrancar: `node scripts/env-up.mjs`» y el gate de cierre `node --test test/`, y `sdd-kit.local.json` (ignorado) con `validation.startEnvironment: true`.

| Sujeto | Entorno al acabar (G5) | Guion |
| --- | --- | --- |
| `g3-1` | `abajo`; el guion no da puerto ni cómo pararlo, y su paso 1 pide arrancar «el servidor E2E con `npm run env:up`» | G2 no: el paso de `canceladas` no lo pudo ver |
| `g3-2` | `abajo`; lee `sdd-kit.local.json` y no hace nada con la clave | G2 no: no corre ningún paso del guion |

**G5 falla 2 de 2; G2 falla 2 de 2.**
