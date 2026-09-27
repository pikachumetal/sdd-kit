# RED — índice de capacidades (task 0073)

Baseline: el kit de la rama en la apertura (`d3e2b5b`, antes del cambio), servido desde una copia limpia con `--plugin-dir`. Sujetos headless `claude -p --model sonnet`, dos por escenario, cada uno sobre una copia fresca del molde. Seis sujetos, 2,13 $. Previsión común con el GREEN: 12 sujetos, ~6 $; techo `SUBJECT_CAP=14`, `COST_CAP=8`.

Molde, lanzador y lo que produjo cada sujeto: [`red/`](../.docs/sdd/specs/20260925-115547-task-0073-capabilities-index/red/). Proyecto ficticio: «salas», reservas de salas de reuniones, con 9 capacidades en el formato de la 2.0.0 sin propósito (`bookings`, `rooms`, `access`, `house-rules`, `billing`, `quotas`, `notifications`, `calendar-sync`, `usage-reports`). Lo que piden los tres escenarios vive en `house-rules` («normas de uso»), cuyo nombre no lo delata: por nombre, un invitado apunta a `access` y un cobro a `billing`.

## Escenarios

| Id | Skill | Petición | Qué mide |
| --- | --- | --- | --- |
| s | `sdd-start-task` | Arrancar la 0021 «los invitados solo pueden reservar 1 h seguida» hasta la spec, con la spec aprobada por delegación | Qué capacidad declara el bloque «Capacidades» y cuántas abre para elegirla |
| r | `sdd-roadmap` | Notas de una reunión: «una reserva a la que nadie se presenta se cobra al departamento al 50 %»; con la 0021 en marcha | Si la entrada nombra la capacidad donde ya vive «no presentarse» (`house-rules`: sin check-in a los 15 min, 7 días sin reservar) |
| q | `sdd-consult` | «¿Dónde tocaría para que los invitados reserven también los sábados?» | Si la respuesta se ancla en `house-rules` y cuántas capacidades abre |

## Resultados

| Fallo buscado | E | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| Elige mal la capacidad | s | `house-rules` | `house-rules` | **No falla** |
| Abre las capacidades a ciegas para elegir | s | las 9, en un bucle `cat` | 4 (`bookings`, `quotas`, `access`, `house-rules`) | **Falla 2/2** en coste: 9 y 4 de 9 |
| **No encuentra la capacidad donde ya vive la regla** | r | abre `billing` y `bookings`, no `house-rules`; la propuesta toca `billing` y «`bookings` — registrar si la reserva se presentó o no», que ya define `house-rules` | abre `billing` y `bookings`, después `house-rules` y `quotas`; la propuesta cita «7 días sin reservar, `house-rules`» | **Falla 1/2** |
| Ancla la respuesta fuera de `house-rules` | q | `house-rules` (búsqueda semántica con semble, luego `bookings` y grep) | `house-rules` (grep, luego `house-rules` y `bookings`) | **No falla** |

El fallo de `r-1` es el caro: una propuesta que reparte el trabajo en `bookings` duplicaría un requisito que ya vive en otra capacidad (regla 5 de `capability-template.md`), y la feature que salga de ella lo heredaría. Los sujetos que aciertan lo hacen buscando por contenido (grep, semble) o abriendo casi todo: con 9 capacidades cuesta poco; con 40, no.

## Filas de control (lo que el RED ya cumple en los pasos que la guía toca)

| Conducta | E | Sujeto 1 | Sujeto 2 |
| --- | --- | --- | --- |
| El bloque «Capacidades» usa el nombre exacto del fichero | s | `house-rules` | `house-rules` |
| No crea una capacidad casi duplicada | s | ninguna nueva | ninguna nueva |
| La task en marcha (0021) no se toca: lo nuevo va a una fila nueva | r | fila 0024 nueva | fila 0024 nueva |
| Distingue lo que dice el doc de lo que infiere | q | «Aquí es inferencia mía» | «Lo que veo en el código (esto es inferencia mía)» |

## Qué guía se escribe

Un paso, no una prohibición (Art. II, fallo de forma): en el paso de contexto de `sdd-start-task`, `sdd-roadmap` y `sdd-consult`, ejecutar `Get-CapabilityIndex.ps1` antes de abrir ninguna capacidad y abrir solo las que el propósito señala; en la ayuda del bloque «Capacidades» de `spec-template.md`, escribirlo con los nombres del índice. Sin tabla de racionalizaciones: ningún sujeto justificó no buscar; `r-1` simplemente no tuvo nada que le enseñara que `house-rules` existía para eso.
