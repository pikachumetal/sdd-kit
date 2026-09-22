---
id: 20260922-153902-task-0018-roadmap-closing
task: 0018
title: Walkthrough — Cómo se cierra una fila del roadmap
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Cómo se cierra una fila del roadmap

## 1. Cambios realizados

- **Formato de cierre** (`skills/sdd-templates/templates/roadmap-template.md`, `f688ecc` y `207f9fd`): el bloque de ayuda de «Deuda técnica» fija el prefijo `**[<Task|Patch> <id>, <fecha>: saldada — <enlace>]**` y su variante `parcial — <enlace>; queda: <…>`, con el texto original de la fila detrás sin reescribir, el enlace como enlace Markdown y la regex que cuenta las filas saldadas. Vale para «Deuda técnica» y para «Backlog».
- **Citas desde los dos cierres** (`f688ecc`): paso 8 de `sdd-end-task` y paso 4 de `sdd-end-patch`. Citan la plantilla, no copian el formato (Art. VIII), y el test lo vigila.
- **Roadmap de este repo normalizado** (`4bb291b`, `baa09c6`): 19 filas cerradas de «Backlog» y «Deuda técnica» pasan al prefijo —15 saldadas y 4 parciales—, la nota «sigue abierta» del patch 0028 sale del prefijo y queda como prosa con su disparador, y la fila «Documentos de flujo desactualizados», cerrada fuera del flujo, se queda sin prefijo porque no hay task ni patch que enlazar.
- **Fila de deuda nueva** (`4bb291b`): el paso 8 con una task que solo existe en el gestor, como posible falso negativo, con el RED enlazado.
- **Regla del disparador observable** (`.docs/sdd/tech-stack.md`, `dc923d0`): una fila de deuda de conducta nombra el comando, la frase o el estado que precede al fallo, y la re-medición informa «disparador ausente N/M» aparte de «no se reproduce».
- **Test** `tests/RoadmapClosing.Tests.ps1` (`4bb291b`, `baa09c6`, `207f9fd`): 8 casos sobre la plantilla, las citas, la no-copia y el roadmap de este repo.
- **Evidencia**: `tests/roadmap-closing-red.md` (`e89d610`) y `tests/roadmap-closing-green.md` (`292543e`).

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,7h (implementación, GREEN, revisión y cierre; la spec y el RED previo suman 0,9h aparte)
- Desviación: −0,8h (−53%)
- Causa de la desviación: lo que se escribió son seis ediciones de Markdown y un test; las dos campañas de sujetos corrieron en segundo plano y no suman reloj, que es justo el sesgo que avisa `estimation.md` (T10). La estimación contó la campaña como espera.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **La capacidad `roadmap` no se creó en la Task 1**, como decía el plan, sino en este cierre: crear el fichero de `capabilities/` es la fusión del delta, y la fusión no ocurre sin validación.
- **La plantilla ganó una frase que el plan no preveía**: `<enlace>` es un enlace Markdown. Lo pidió el GREEN, no el plan (ver §4.2).
- **Enmienda aprobada durante el cierre**: la regex de conteo pierde el ancla `^`. Anclada no listaba las filas cerradas del Backlog, cuya celda «Ítem» es la segunda columna. Se implementó primero la regex literal de la spec y la enmienda se aplicó al aprobarla el dev-lead («Apruebo, quítalo»).

### Decisiones tomadas sin el dev-lead

- **Las tres tasks fueron en línea** — son ediciones de Markdown y un test de 76 líneas, y el dev-lead estaba ausente; su `CLAUDE.md` pide confirmar modelos antes de despachar subagentes y no había quien confirmara. Coste si está mal: sin revisiones por task, todo el peso recae en la revisión final, que se hizo igual.
- **La fila «Documentos de flujo desactualizados» se queda fuera del formato** — se cerró en el commit `5d85485`, sin task ni patch. Primero le puse un id `0000` inventado; el revisor lo marcó como Important y lo quité. Coste si está mal: el `grep` la cuenta como abierta, y es la única fila así.
- **La nota de cierre antigua de cada fila normalizada va entre el prefijo y el título** — es el texto que ya tenía la fila y se conserva. El GREEN muestra el prefijo pegado al título, así que este repo se aparta de esa forma para no perder información. Minor del revisor, aceptado a conciencia. Coste si está mal: el roadmap del kit no sirve de ejemplo literal del formato.
- **La negrita del título no se defiende con guía** — 3 de 4 sujetos de task la quitan al anteponer el prefijo. Las palabras no cambian y el `grep` no depende de ella, así que no se escribe prosa para un fallo cosmético.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` tras integrar `develop`: **310 pasan, 0 fallan, 6 skipped**.
- El hook de pre-commit ejecutó la suite entera en los siete commits de la rama.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «smoke delegado» · disparador: la primera task o patch real que cierre una fila de deuda con el kit 1.2.0, con el dev-lead como dueño. El smoke lo ejecutó el agente; el dev-lead no ha probado nada todavía.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED, cerrar una fila de deuda (4 sujetos) | 3 formas distintas, 1/4 sin enlace, 4/4 reescriben el texto original ([RED](../../../../tests/roadmap-closing-red.md)) |
| 2 | RED, task sin fila en modo `tracker` (2 sujetos) | No se reproduce: 2/2 sin fila inventada, ticket en el changelog |
| 3 | GREEN, prefijo y estado (6 sujetos, 2 rondas) | 6/6 con el prefijo, estado `parcial` correcto y texto original conservado ([GREEN](../../../../tests/roadmap-closing-green.md)) |
| 4 | GREEN, enlace | Ronda 1: 2/4 con ruta suelta → la plantilla precisa que es Markdown → ronda 2: 2/2 |
| 5 | GREEN, control de `tracker` | 2/2 sin regresión |
| 6 | `grep` de conteo sobre este roadmap | 15 filas saldadas; las 4 `parcial` y las abiertas quedan fuera |
| 7 | Test de Pester no vacío | El revisor reintrodujo en copia aislada la fila sin enlace y el caso del prefijo falla |
| 8 | Revisión final (Sonnet) + re-revisión | 2 Important y 1 Minor; los dos Important resueltos en `baa09c6` y confirmados; sin hallazgos nuevos |

- Coste de sujetos: 2,72 $ (RED) + 5,15 $ (GREEN) = 7,87 $. Revisor: ~350k tokens en dos pasadas.

### 4.3 Residuales / deuda generada

- **El paso 8 con una task que solo vive en el gestor**: fila nueva en la tabla de deuda, como posible falso negativo, con el RED como evidencia. Era el enunciado original de la 0018.
- **La fila «Documentos de flujo desactualizados»** queda como única excepción al formato: cerrada, pero sin prefijo y sin contar.
- **Los roadmaps de los proyectos no se migran**: sus filas ya cerradas se quedan como estén y el formato rige desde la 1.2.0.

## 5. Aprendizajes

- Una fila de deuda de conducta sin disparador observable no se puede re-medir: un 0/4 no distingue «arreglado» de «disparador ausente» → `tech-stack.md`, «Fixtures y baselines».
- Un formato para agentes necesita decir que el enlace es un enlace: con `<enlace>` a secas, 2 de 4 sujetos escribieron la ruta suelta → `roadmap-template.md` y la evidencia GREEN.
- Un frente de campo señalado por lectura puede no reproducirse en conducta: el hueco del paso 8 en modo `tracker` salió 2/2 correcto y se recortó de la spec → confirma la regla de `tech-stack.md` de reproducir antes de presentar la spec.
- Normalizar un formato en el propio repo destapa los casos que la regla no cubre (una fila cerrada sin task ni patch) mejor que revisarla sobre el papel → este walkthrough y la fila-excepción del roadmap.

## 6. Adendas
