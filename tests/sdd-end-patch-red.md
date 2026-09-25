# RED — el cierre de un patch y sus capacidades (task 0067)

Baseline: el kit de `develop` (`fc0536e`), servido desde una copia limpia con `--plugin-dir`. Sujetos headless `claude -p --model sonnet`, dos por escenario, cada uno sobre una copia fresca del molde con `git init`. Cuatro sujetos, 1,22 $ en total.

Molde, lanzador y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20260924-225643-task-0067-patch-capabilities/red/). Proyecto ficticio: `salas`, el CLI de reservas de la task 0044, con `capabilities/bookings.md`.

## Por qué este molde y no el de la task 0003

El E3 de la task 0003 midió el cierre de un patch y los dos sujetos fusionaron. Su petición, sin embargo, decía que el fix cambiaba un requisito de `bookings` por decisión del usuario. En campo nadie lo dice: 0 de 14 patches del kit desde el 2026-09-20 tocaron una capacidad, y ocho cambiaron comportamiento. Aquí la petición es la de campo, «cierra el patch», sin mencionar capacidades, y el cambio de comportamiento solo se ve comparando el fix con la capacidad.

## Escenarios

| Id | Petición | Qué mide |
| --- | --- | --- |
| p1 | «Invoca `sdd-end-patch` y cierra el patch 0014» | El fix hace que `salas libres 10-12` deje aparte las salas en mantenimiento (`Oeste (en mantenimiento)`); `bookings.md` dice que lista `Sur` y `Oeste`. ¿Fusiona el cambio? |
| p2 | «Invoca `sdd-end-patch` y cierra el patch 0013» | El fix rechaza `salas reservar Norte 10-13` con `Máximo 2 h por reserva`, como ya decía la capacidad. Control de la salida corta: ¿toca la capacidad o escribe ceremonia? |

## Resultados

| Fallo buscado | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| No fusiona un cambio de comportamiento en la capacidad | p1 | fusiona (`MODIFIED Consultar salas libres` + historial) | no abre `bookings.md` | **Falla 1/2** |
| Toca la capacidad o escribe un delta sin cambio de comportamiento | p2 | no la toca | no la toca | **No falla** (control) |

## De dónde sacó cada sujeto la conducta

- **p1-1** fusionó por fuentes incidentales. Volcó de golpe `.docs/sdd/` (`Get-Content specs/*/patch.md; … Get-Content capabilities/bookings.md`), y para el roadmap buscó plantillas con el patrón `roadmap-template|capabil`, que le trajo `capability-template.md`. Lo dice él mismo en su mensaje final: «Actualicé `capabilities/bookings.md` a `MODIFIED Consultar salas libres`, porque el requisito decía que `libres` lista `Oeste` a secas. **La skill no lo pide.**»
- **p1-2** vio `capabilities/` en el listado del proyecto y no lo abrió. Hizo los pasos 1 a 6 de `sdd-end-patch` al pie de la letra: hash, commit de cierre, changelog, roadmap, merge pendiente.
- **p2-1 y p2-2** no tocaron la capacidad. La salida corta no necesita guía; el GREEN la repite como control de no regresión (Art. I: el recorte quita la guía, no la medición).

Con el acierto de p1-1 saliendo de una fuente que otro sujeto no abrió, el fallo está reproducido: no hace falta otra tanda antes de escribir la guía (Art. I).

## Guía escrita

- `sdd-end-patch` paso 1: párrafo **Capacidades** *(si existe `.docs/sdd/capabilities/`)*: abrir la capacidad de la pieza tocada; si el patch solo devuelve el comportamiento a lo que la capacidad ya decía, no hay delta y no se escribe nada; si no, delta en `patch.md` y fusión como en `sdd-end-task`, con su línea de historial; un patch no crea capacidades. El paso 2 mete las capacidades en el commit de cierre.
- `patch-template.md`: sección opcional «6. Delta de capacidad», con la salida corta en su ayuda.
- `capability-template.md`: las reglas 2 y 3 y el «Historial» nombran también `sdd-end-patch`; la línea de historial lleva la carpeta, como ya hacían las capacidades del kit.
- Anclas en `tests/CapabilityRules.Tests.ps1`: 4 en rojo antes del cambio, en verde después.
