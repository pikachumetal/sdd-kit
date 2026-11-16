---
kit_version: 3.0.0
lane: feature
id: 20261108-161600-feature-0012-plan-rehecho
task: 0012
mode: no consta
date: 2026-11-08
---

# Ticket para el kit — feature 0012: plan rehecho por una task ambigua y brief sin criterio de adjunto

## Contexto

- Carril y modo: feature, modo no consta (no hay artefactos de la 0012 en el repo)
- Skills del kit usadas: no consta; las notas mencionan spec, plan, implementador por task y merge
- Proyecto: aplicación Node pequeña, sin dependencias externas, git-flow
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta
- Coste en reloj: unos 40 min por encima de lo estimado (dato de las notas, sin respaldo)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El plan se rehízo porque una task no decía qué fichero tocar

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no indicaba el fichero a modificar. Las notas atribuyen a esto la mayor parte de los ~40 min de desvío.
- **Fuente**: `notas-sesion.md` líneas 6 y 9 (resumen del dev-lead, no un artefacto de la feature). No existe spec, plan ni walkthrough de la 0012 en `.docs/sdd/specs/`.
- **Dónde en el kit**: no localizado sin releer `skills/sdd-templates/templates/plan-template.md` y el paso de revisión del plan; candidato probable.
- **Por qué el kit no lo evitó**: sin verificar; posiblemente la plantilla de task no exige ni la ruta de los ficheros ni un chequeo de ello antes de aprobar el plan.
- **Coste**: ~40 min sobre la estimación, causa «sin respaldo» (solo la frase del dev-lead).
- **Propuesta**: que la plantilla de task exija «Ficheros» y que la revisión del plan rechace una task sin ellos.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan con una task sin lista de ficheros WHEN se revisa antes de aprobarlo THEN se rechaza señalando la task.

### 2. La skill no dice cuándo adjuntar el brief al implementador

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto; según las notas, la skill no indica cuándo adjuntar el brief.
- **Fuente**: `notas-sesion.md` línea 7 (sin respaldo en artefactos).
- **Dónde en el kit**: probablemente `skills/sdd-implement/SKILL.md` (despacho del implementador) y el verbo `sdd task brief`; sin confirmar el paso.
- **Por qué el kit no lo evitó**: sin verificar; el criterio de adjuntar el brief no estaría escrito.
- **Coste**: no medido; se repitió dos veces en la sesión, por eso no es menor.
- **Propuesta**: que el despacho adjunte siempre el brief extraído con `sdd task brief` y lo diga en el paso.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task despachada a un implementador WHEN arranca THEN su prompt incluye el brief sin que lo pida.

### 3. Versión del kit inconsistente entre notas, proyecto y plugin cargado

- **Qué pasó**: las notas dicen kit 2.4.0; el proyecto pide 3.0.0 y el plugin cargado en esta sesión es 2.3.4. El ticket usa 3.0.0 en la cabecera porque es lo que lee `sdd-kit.json`; la 2.4.0 no se pudo confirmar en ningún fichero.
- **Fuente**: `.docs/sdd/sdd-kit.json` → `"version": "3.0.0"`; `.claude-plugin/plugin.json` del kit cargado → `"version": "2.3.4"`; `notas-sesion.md:5` → 2.4.0. `claude plugin list` desde Bash → `claude anidado bloqueado en un sujeto: run.mjs no ve su coste` (no dio versiones).
- **Dónde en el kit**: aviso de `hooks/hooks.json` / `sdd hook session-start`, que ya avisó del desfase.
- **Por qué el kit no lo evitó**: el aviso existe pero no frena; la sesión siguió con skills de una versión anterior a la que pide el proyecto.
- **Coste**: no medido.
- **Propuesta**: que el aviso de desfase pida confirmación antes de usar skills que podrían ser de otra versión.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `sdd-kit.json` con versión mayor que la del plugin cargado WHEN arranca la sesión THEN el kit exige actualizar o confirmar antes de cualquier skill de cambio.

## Lo que hice por iniciativa propia

- Nada que reportar por parte de las notas; al redactar contrasté las versiones con ficheros en vez de fiarme de las notas.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge en la rama de integración fue sin conflictos.

## Menores

- Saltó el pre-commit por un fichero sin final de línea, arreglado en un minuto — no localizado
