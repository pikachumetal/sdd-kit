---
id: 20260922-153902-task-0018-roadmap-closing
task: 0018
title: Cómo se cierra una fila del roadmap
mode: full
status: approved
created: 2026-09-22
author: Claude (hilo principal)
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Cómo se cierra una fila del roadmap

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: capacidad nueva (`roadmap`), contrato público (formato de fila que leen las skills de cierre y `sdd-start-release`)
- Mínimo razonable: ninguna — deja sin mirar la redacción del prefijo, que el GREEN pone a prueba con sujetos y el test de Pester vigila en este repo
```

1. **Del RED previo entra un frente y sale otro** ([RED](../../../../tests/roadmap-closing-red.md), 4 sujetos, 2,72 $):
   - **Entra, cerrar una fila de deuda.** 4/4 sujetos tocan la fila, pero con 3 formas distintas. 1/4 no enlaza la task y 4/4 reescriben el texto con que se abrió la fila. Ninguna de esas formas se puede contar con un `grep`.
   - **Sale, la fila original de la 0018** (paso 8 con una task que solo existe en el gestor). 2/2 sujetos en modo `tracker` no inventaron fila y dejaron el id del ticket en el changelog, que es justo lo que proponía la 0004. Según el Art. I no se escribe guía para un fallo que no aparece. Pasa a la tabla de deuda como **posible falso negativo**, con la evidencia enlazada.
2. **Formato único: un prefijo al principio de la celda «Ítem»**, el que ya usan la mayoría de filas cerradas de este repo:
   - `**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**` cuando se salda entera.
   - `**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` cuando se salda en parte.
   - El enlace va al `walkthrough.md` de la task o al `patch.md` del patch. El texto original de la fila se queda detrás, sin tocar.
   - Descarto el estado en la columna «Destino» y una sección aparte de deuda saldada: la primera mezcla el plan con el resultado, y la segunda obliga a leer por secciones en vez de por líneas.
3. **Se cuenta con un grep.** La palabra `parcial` no contiene `saldada`, así que `grep -E '^\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` lista las filas cerradas y ninguna abierta ni parcial. Las abiertas son el resto de filas de la tabla. El id admite el del gestor (`SALAS-142`) igual que el de secuencia.
4. **Vale para «Deuda técnica» y para «Backlog»**, las dos tablas de cosas pendientes que una task o un patch salda. Las filas de task de «Próximo» y de la release siguen con sus estados (✅, 🧪…).
5. **Un cierre posterior sustituye el prefijo** (de `parcial` a `saldada`, por ejemplo). El historial queda en git: dos prefijos en una fila romperían el «empieza por».
6. **El formato vive en `roadmap-template.md`**, en el bloque de ayuda de «Deuda técnica», que es la fuente única de la forma del roadmap (Art. VIII). El paso 8 de `sdd-end-task` y el paso 4 de `sdd-end-patch` lo citan, sin copiarlo.
7. **Capacidad nueva `roadmap`**, con este requisito. No lo meto en `task-flow` porque también lo cumple el carril patch.
8. **El disparador observable es una regla de este repo, no del kit.** La deuda «de conducta» (lo que hace un sujeto medido con RED/GREEN) solo existe aquí: un proyecto consumidor no mide agentes. La regla va a `tech-stack.md`, en «Fixtures y baselines». Dice dos cosas:
   - La fila nombra el comando, la frase o el estado del molde que precede al fallo.
   - Al volver a medir, se informa «disparador ausente N/M» aparte de «no se reproduce».
   
   No toca ninguna skill.
9. **Este roadmap se normaliza** al formato: las filas cerradas de «Deuda técnica» y «Backlog» que hoy usan tachado, cursiva o `Saldada por…` pasan al prefijo. Las notas que no cierran nada (la de «sigue abierta» del patch 0028) salen del prefijo y se quedan como texto normal.
   - Un test de Pester, `RoadmapClosing.Tests.ps1`, lo vigila en este repo y comprueba que las dos skills citan el formato.
   - **Sin migración para los proyectos**: sus filas ya cerradas se quedan como estén y el formato rige desde la 1.2.0.

### Decisiones tomadas con el dev-lead

- Aprobación de la spec por delegación, con avance sin paradas hasta la validación final — «avanza hasta el end, que me voy con la bici, :D»

## Intent

Cerrar una fila de deuda no tiene forma fijada. En este roadmap conviven cinco maneras de hacerlo: el prefijo `**[Task…: saldada]**`, el título tachado con «saldada el…», la cursiva en línea, `Saldada por la task…` y un prefijo que dice «sigue abierta». Los sujetos del RED inventan una tercera y una cuarta. Así, «¿qué deuda sigue abierta?» no se responde con un `grep`, y una fila reescrita pierde la evidencia con que se abrió. Se quiere una sola forma, citada desde los dos cierres, que se pueda contar línea a línea.

## Scope

- Entra: el formato del prefijo en `roadmap-template.md`; la cita desde `sdd-end-task` paso 8 y `sdd-end-patch` paso 4; la capacidad `roadmap`; la normalización de este roadmap; el test de Pester; la regla del disparador observable en `tech-stack.md`; RED y GREEN.
- No entra:
  - Guía para el paso 8 con una task que solo vive en el gestor: el RED no la reprodujo y va a deuda.
  - Volver a medir el síntoma al arrancar un patch desde una fila (es de la 0015).
  - Añadir el disparador a las filas de conducta ya abiertas.
  - Una migración para los roadmaps de los proyectos.

## Approach

Receta de forma (Art. II): el fallo es de forma, no de disciplina. Los agentes ya marcan la fila; falta decirles cómo. El formato se escribe una vez en la plantilla, y los dos pasos de cierre lo citan con una frase que dice cuándo aplica (la task o el patch salda una fila de «Deuda técnica» o de «Backlog»). El GREEN repite los dos escenarios del RED: el frente B tiene que salir con el prefijo en 4/4, y el frente A se vuelve a medir como control de no regresión.

## Delta de comportamiento

### Capacidad: `roadmap`

**ADDED — Cerrar una fila de deuda o de backlog deja un prefijo contable**
- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap que una task o un patch salda entera o en parte
- WHEN se cierra con `sdd-end-task` o con `sdd-end-patch`
- THEN la celda «Ítem» empieza por `**[<Task|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Task|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '^\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`

**Reglas de la capacidad**
- **Dónde viven los datos**: el formato, en el bloque de ayuda de «Deuda técnica» de `roadmap-template.md` de `sdd-templates`; los cierres lo citan.
- **Idioma de los nombres**: estados `saldada` y `parcial`, en castellano, como el resto del roadmap.
- **Regla ante conflicto**: una fila lleva un solo prefijo; un cierre posterior lo sustituye.

## Enmiendas

- 2026-09-22 — La regex del THEN y de la decisión 3 pierde el ancla `^`: `grep -E '\| \*\*\[(Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` — Anclada al principio de línea no lista las filas de «Backlog», cuya celda «Ítem» es la segunda columna, y la decisión 4 dice que el formato vale también ahí. El `| ` delante del prefijo sigue exigiendo que esté al principio de una celda — sin aprobar (dev-lead ausente; se implementa la regex literal y se presenta en la validación)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada por delegación: «avanza hasta el end, que me voy con la bici, :D» |
