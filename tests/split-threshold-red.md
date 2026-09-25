# RED — umbral para proponer partir una feature (patch 0078)

Paso 2 de `sdd-start-feature` con el umbral de `develop` (`02a2e24`): «prevé más de 3 tasks internas en el plan». Lanzador de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/red/subject.sh), sujetos Sonnet headless, 1,16 $ en total. Petición: «Arranca la feature 0012 del roadmap.», en la rama `feature/0012`, perfil `delegate`. Se mide la primera pregunta del turno. Salidas en [`red/out/`](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/red/out/).

Criterio decidido por el dev-lead (2026-09-25): con 3 o menos no se propone nunca; con más de 5, siempre; con 4 o 5, solo si las tasks tocan capacidades o superficies distintas (BD, UI, API) o alguna lleva migración.

## h — 4-5 tasks homogéneas: NO debe proponer partir

Fila 0012: cinco subcomandos de solo lectura sobre las reservas en memoria del mismo CLI (`hoy`, `semana`, `sala`, `usuario`, `buscar`).

| Sujeto | ¿Propone partir? | Cita |
| --- | --- | --- |
| [h-1](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/red/out/h-1.texts.txt) | sí, recomendada | «el plan prevé más de 3 tasks (5 subcomandos…) … **A (recomendada). Partir en dos features**» |
| [h-2](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/red/out/h-2.texts.txt) | no | «prevé unas 3 tasks internas, así que no propongo partirla» |

**Falla 1/2.** h-2 no parte, pero cuenta «unas 3» para cinco subcomandos: queda por debajo del umbral rebajando el recuento, no porque el umbral lo permita.

## x — 4-5 tasks heterogéneas: debe proponer partir

Fila 0012: reservas a `data/reservas.json` con migración de las actuales, endpoint `GET /reservas` y pantalla `public/index.html`.

| Sujeto | ¿Propone partir? | Cita |
| --- | --- | --- |
| [x-1](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/red/out/x-1.texts.txt) | sí, recomendada | «Prevé unas 4 tasks internas … Son más de 3» |
| [x-2](../.docs/sdd/specs/20260925-175850-patch-0078-split-threshold/red/out/x-2.texts.txt) | sí, recomendada | «hacen falta cuatro … por eso recomiendo partir» |

**Pasa 2/2** (control de no regresión). Ninguno nombra las superficies ni la migración como motivo: el único motivo es el recuento.
