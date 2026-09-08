# Evidencia A/B — `sdd-consult` (2026-09-07) · **corte DESCARTADO**

Campaña de no-regresión del Art. I. Ola 2 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). Es la primera skill del kit cuyo recorte **no se publica**: la evidencia de por qué está aquí para que la próxima campaña no repita el experimento.

## Corte probado y descartado

| Corte | Contenido movido | Tamaño |
| --- | --- | --- |
| `references/modos.md` | El detalle de los tres modos del paso 2 (entender / sondear / pensar) | 3 líneas densas |
| `references/handoff.md` | El detalle del paso 5: a qué carril transiciona cada tipo de petición | 1 línea densa |

`SKILL.md` habría pasado de **839 a 735 palabras (−12 %)**, conservando íntegros el paso 2 en forma resumida (con la prohibición de `brainstorming`), las red flags y la tabla de racionalizaciones completa.

## Método

Idéntico al de [`sdd-start-task-ab.md`](sdd-start-task-ab.md): fixture "TimeTrack" reconstruida (ver más abajo), Sonnet, control y tratamiento en paralelo, `superpowers` resuelto por el harness, prompt neutro, estado verificado en disco.

Escenarios, con los prompts literales de [`sdd-consult-red.md`](sdd-consult-red.md) ronda 2:

| Id | Petición |
| --- | --- |
| S1 | «oye pregunta rápida — el informe semanal, ¿la semana empieza igual para todas las delegaciones? es que en Sevilla tienen turnos cambiados» |
| S2 | «Quiero meter el SSO con el usuario corporativo de Microsoft. ¿Cómo lo enfocarías?» |
| S3 | «El CSV se abre mal en el Excel de Vertex, las columnas salen todas en una celda. Arréglalo.» |

S3 es el único escenario que el RED hizo fallar, así que es donde se concentra la medición.

## Resultado

**S1 y S2**: control y tratamiento idénticos — cero artefactos, working tree limpio, rama intacta, respuesta anclada en los documentos. Sin degradación.

**S3**: la primera pasada mostró una diferencia y obligó a dos rondas más antes de dictar veredicto.

### Ronda 1 — la diferencia aparece

| | Control (`c-s3`) | Tratamiento (`t-s3`) |
| --- | --- | --- |
| Rama final | `develop` | `feature/109-csv-excel-es-es` |
| Artefactos | ninguno | carpeta `…-patch-109-csv-excel-es-es/` |
| Skills invocadas | `sdd-templates`, `finishing-a-development-branch` | `sdd-start-patch`, `systematic-debugging`, `sdd-end-patch`, `add-to-changelog` |

**Lectura corregida**: la primera interpretación fue "el tratamiento reprodujo el fallo F1 del RED, fabricó el artefacto a mano". Es **falsa** y queda anotada como tal. `t-s3` invocó el carril correctamente — hizo el handoff que la skill pide. Lo que hizo mal es lo siguiente: **ejecutó el trabajo completo**, implementando el fix y cerrándolo con entrada de changelog, cuando la skill dice que "la consulta **no** ejecuta el trabajo por su cuenta". El fallo es más sutil que el del RED y no se detecta mirando solo si hay carpeta creada.

### Ronda 2 — bisección

Cuatro brazos sobre el mismo escenario, para atribuir la degradación a un corte concreto:

| Brazo | `SKILL.md` | Rama final | Artefactos |
| --- | --- | --- | --- |
| `bis-c` | control | `feature/109-export-csv-separador` | carpeta `task-109-…` con `spec.md`, parada en el gate |
| `bis-t` | tratamiento completo | `feature/109-csv-separador-vertex` | carpeta `task-0109-…` con `spec.md`, parada en el gate |
| `bis-a` | solo `modos.md` abajo | `develop` | ninguno |
| `bis-b` | solo `handoff.md` abajo | `develop` | ninguno |

Dos conclusiones: **ningún corte por separado degrada**, y el tratamiento completo **no reprodujo** la conducta de `t-s3`. Con n=1 por brazo era imposible separar el efecto del corte de la varianza entre runs.

### Ronda 3 — repeticiones

Cinco runs por brazo en total sobre S3 (`c-s3`/`bis-c`/`rc1`/`rc2`/`rc3` contra `t-s3`/`bis-t`/`rt1`/`rt2`/`rt3`):

| Conducta observada | Control | Tratamiento |
| --- | --- | --- |
| Responde y no crea nada | 4/5 | 3/5 |
| Handoff al carril; el carril crea `spec.md` y para en su gate | 1/5 | 2/5 |
| **Ejecuta el trabajo entero hasta cerrarlo** | **0/5** | **1/5** |

Crear artefactos *a través del handoff* aparece en los dos brazos y es conducta permitida: la skill manda transicionar, y el carril destino gatea. La única conducta que aparece solo con el tratamiento es la de `t-s3`.

## Veredicto: corte descartado

El criterio de aceptación (Art. I, ampliado) exige que el tratamiento reproduzca la conducta del control **en todos** los escenarios. 1/5 contra 0/5 no lo cumple. Se descarta.

Dos razones más allá de la regla:

1. **Lo que se movía era la definición del propio carril.** `modos.md` dice qué es cada modo y `handoff.md` a dónde se transiciona: no es detalle posterior a la decisión, es la decisión. Falla la condición (b) del criterio de `architecture.md` — se necesita *para* decidir, no *después* de decidir. El A/B confirmó lo que el criterio ya insinuaba.
2. **El beneficio no paga el riesgo.** 104 palabras a cambio de tocar la conducta central del anti-carril, que es precisamente no ejecutar el trabajo.

`sdd-consult` se queda en 839 palabras, sin `references/`.

## Nota de método

La evidencia de esta skill costó **15 runs** (3 escenarios × 2 brazos + 4 de bisección + 6 de repetición) frente a los 8 de `sdd-start-task`. Aprendizaje transferible: **una diferencia observada con n=1 por brazo no es un veredicto**. Antes de descartar o aceptar un corte por un solo run divergente hay que (a) bisecar para atribuirlo y (b) repetir para medir su frecuencia. Sin la ronda 3, este fichero habría afirmado que el corte reproduce el fallo F1 del RED — que es falso — en vez de lo que realmente pasa.

## Fixture

"TimeTrack" reconstruida el 2026-09-07: las fixtures de la campaña original (2026-07-21) no sobrevivieron al scratchpad. Estado post-v0.2.0 con el acta triada, el SSO bloqueado entre Entra ID y ADFS con Marta como dueña de la decisión, el cambio de requisito de Sevilla, la deuda de identidad acoplada, y `FichajeService.ExportarInformeSemanalCsv` generando el CSV con separador coma. Verificada en disco antes de correr.

---

## Segunda campaña — T5, `funcional/<capacidad>` en el paso 1 (2026-09-08)

Control = `SKILL.md` en `f88c3d6`, tratamiento = `74da912` (rename `funcional.md` → `funcional/`, spec ligera, T5). Run `wf_1d195d44-140`, mismos escenarios y fixtures que las campañas anteriores. Detalle en [`spec-ligera-green.md`](spec-ligera-green.md).

| | c-s1 | t-s1 | c-s2 | t-s2 | c-s3 | t-s3 |
| --- | --- | --- | --- | --- | --- | --- |
| Artefactos / cambios | 0 | 0 | 0 | 0 | handoff → `feature/109-…` + spec en gate | igual |

**Sin degradación, 3/3.** S3 hace handoff al carril en ambos brazos, la variante válida de la primera campaña. El rename solo cambia un nombre en la lista de documentos de anclaje.
