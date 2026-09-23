---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260923-213208-patch-0052-tag-before-merge
task: 0052
mode:
date: 2026-09-23
---

# Ticket para el kit — patch 0052: patch abandonado porque el RED no se reproduce

## Contexto

- Carril y modo: patch (abandonado en el paso 1, sin carpeta ni fix)
- Skills del kit usadas: `sdd-start-patch`, `sdd-feedback`
- Proyecto: el propio kit (skills en markdown, tests Pester, una persona)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~10 min
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `sdd-start-patch` no tiene salida para «el fallo no se reproduce»

- **Qué pasó**: el dev-lead pidió un patch a partir de una fila de deuda del roadmap que decía «RED ya disponible». Al investigar la causa, resultó que la re-medición más reciente, sobre el texto actual de la skill, daba 0/4, así que el fallo no se reproduce. Editar la skill sin un RED vigente incumple el Art. I. El hilo paró, dio tres opciones y el dev-lead eligió no hacer el patch. La fila quedó anotada como aplazada.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 1. Solo prevé dos salidas: «exige interpretar requisitos» y «el fix crece», y las dos llevan a `sdd-start-task`.
- **Por qué el kit no lo evitó**: el paso 1 da por hecho que la investigación confirma un fallo. Tampoco dice qué pasa con la carpeta, el `patch.md` y el id si el patch se abandona. Aquí se decidió sin guía: sin carpeta ni `patch.md`, con la anotación en la fila de deuda y el id 0052 consumido solo por este ticket.
- **Coste**: bajo, una parada y una decisión del dev-lead. El riesgo es otro: que un agente edite la skill igualmente, empujado por el encargo.
- **Propuesta**: una tercera salida en el paso 1: «si no se reproduce, STOP. Sin carpeta ni fix: se anota en la fila de deuda (o en el ticket) con la fecha y la evidencia, y el patch no se abre».
- **Criterio de aceptación**: GIVEN una fila de deuda cuyo RED más reciente da 0/N sobre el texto actual de la skill, WHEN se invoca `sdd-start-patch` sobre ella, THEN el agente no edita la skill ni crea la carpeta del patch, y deja la fila anotada con la fecha y el motivo.

### 2. La fila de deuda decía «RED ya disponible» y a la vez «0/4»

- **Qué pasó**: el cierre del patch 0028 re-midió la fila, anotó «0/4, posible falso negativo» al principio y dejó intacta la columna de propuesta («RED ya disponible en `tests/release-flow-red.md`»). La invocación del patch se apoyó en esa última frase.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md`, en el paso que actualiza el roadmap. No localizo una regla que obligue a revisar la fila entera cuando una re-medición la contradice.
- **Por qué el kit no lo evitó**: el cierre añade la re-medición, pero no revisa lo que la fila ya decía.
- **Coste**: una invocación de patch que no debía empezar.
- **Propuesta**: si un cierre re-mide una fila de deuda y el resultado contradice su propuesta o su evidencia, esas columnas se reescriben, no solo se amplían.
- **Criterio de aceptación**: GIVEN una fila con «RED disponible» y una re-medición 0/N, WHEN se cierra el patch que la re-midió, THEN la fila ya no afirma que haya un RED vigente.

## Lo que hice por iniciativa propia

- Contrasté el «0/4» del encargo con los dos ficheros RED antes de tocar nada, y vi que venía de la re-medición del 0028, no del RED de la 0004. Sirvió: esa comprobación es lo que detuvo el patch.

## Funcionó, no tocar

- La red flag «estás implementando la hipótesis de quien reporta sin haberla confirmado» de `sdd-start-patch`, junto con `systematic-debugging` en el paso 1: pararon la edición de la skill.

## Errores míos, no huecos del kit

- Tras la decisión, dije que la fila ya recogía lo necesario, y hubo que pedirme que anotara el motivo del aplazamiento.
