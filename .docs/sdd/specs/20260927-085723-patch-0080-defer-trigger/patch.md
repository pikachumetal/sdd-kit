---
id: 20260927-085723-patch-0080-defer-trigger
task: 0080
title: Patch — la opción «Diferir» de la validación trae su disparador
type: patch
status: done
created: 2026-09-27
branch: patch/0080-defer-trigger
commit: <hash>
---

# Patch 0080 — la opción «Diferir» de la validación trae su disparador

## Capacidades

- Modificadas: `control-profiles` — «La validación puede diferirse con condiciones»: la opción de diferir trae el disparador y elegirla es la frase

## 1. Síntoma

Reportado ([ticket del patch 0078](../../field-reports/20260925-181620-patch-0078-split-threshold.md) §1): en el paso 0 de `sdd-end-patch`, la pregunta de validación con `AskUserQuestion` ofreció «Diferir la validación» sin frase ni disparador. El dev-lead la eligió sin texto, hizo falta otro turno para pedírselos y el cierre quedó parado.

Medido (`tests/defer-trigger-red.md`, sin `AskUserQuestion`): el turno de más **no** se reproduce. Tras «Diferir» sin texto, 2 de 2 sujetos dejan la línea `Validación diferida:` completa, porque la regla del disparador vago (patch 0037) ya la concreta. Lo que sí se reproduce es la causa: 0 de 2 nombran un disparador en la opción de diferir, y uno le pide al usuario «motivo y disparador». Con `AskUserQuestion`, esa petición es el turno de más del 0078. El patch sigue con este fallo medido, por decisión del dev-lead (2026-09-27): «contando que podria tener que ver con AskUserQuestion y que el arreglo realmente es poner mas texto a la respuesta entiendo que mejor arreglarlo».

## 2. Causa raíz

El paso 0 de `skills/sdd-end-patch/SKILL.md` manda una pregunta cerrada con tres salidas, pero no dice qué etiqueta lleva cada opción. La salida «Diferido» exige frase y disparador (`control-profiles.md` § Validación diferida), y nada dice que la opción los traiga. Tampoco dice que elegirla cuente como la frase, como sí hace el paso 2 de `sdd-start-feature` con «apruebo la spec por delegación» («Elegirla es la frase literal»). El paso 7 de `sdd-start-feature` tiene el mismo hueco.

## 3. Fix

- **Fichero(s)**: `skills/sdd-end-patch/SKILL.md` (paso 0), `skills/sdd-start-feature/references/control-profiles.md` (§ Validación diferida), `skills/sdd-start-feature/SKILL.md` (paso 7), `tests/ControlProfiles.Tests.ps1` (literales), `tests/defer-trigger-red.md` y `tests/defer-trigger-green.md`.
- **Cambio**: la opción de diferir trae un disparador concreto con dueño, que elige el agente sin pedir nada al usuario («Diferir: lo pruebo en <uso más próximo>, a cargo de <quien valida>»). Elegirla sin texto es la frase literal y el disparador, y no se vuelve a preguntar; otro disparador va por «Other». El paso 0 de `sdd-end-patch` lleva además las tres etiquetas literales, también para la pregunta en texto. Sin migración: solo cambia la conducta de las skills.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED, kit de `develop`: (a) la opción de diferir nombra un disparador con dueño | ❌ 0/2 (uno no ofrece diferir; otro pide «motivo y disparador») |
| 2 | RED: (b) tras «Diferir» sin texto, línea completa en §4 sin otro turno | ✅ 2/2 (no reproduce el síntoma reportado) |
| 3 | GREEN rondas 1-3, texto intermedio | (a) 1/2, 0/2, 1/2 · (b) 2/2 en todas |
| 4 | GREEN ronda 4, texto final: (a) | ⚠️ 1/2: d-2 ofrece «Diferir: lo pruebo en el próximo uso de `cancelar`, a cargo del dev-lead»; d-1 copia `<uso más próximo>` sin rellenarlo |
| 5 | GREEN ronda 4: (b) | ✅ 2/2 |
| 6 | Suite Pester completa, con los literales nuevos de `tests/ControlProfiles.Tests.ps1` | ✅ 915/0 |

GREEN parcial: el dev-lead decidió cerrar tras la ronda 4 con lo que hubiera. Sujetos Sonnet headless con `tests/headless/run.sh`: 10 sujetos, 10,00 $. Límite: sin `AskUserQuestion`, que headless no puede contestar.

## 5. Tiempo (ligero)

- Real: 1,2 h

## 6. Delta de capacidad

### Capacidad: `control-profiles`

**MODIFIED — La validación puede diferirse con condiciones**
- GIVEN una feature o un patch verificados por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una feature o un patch en `unattended`
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <feature, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅; en un patch, la línea va en `patch.md` §4, debajo de la tabla, y la fila de la tabla de patches empieza por `🧪 validación diferida a <disparador> — `
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) no hay diferido: la feature o el patch siguen esperando la validación
- AND con la frase y sin disparador, o con uno vago («diferida», «se prueba en uso»), el agente no vuelve a preguntar: concreta el uso más próximo, con quien difiere como dueño (`disparador: la primera exportación del informe mensual, a cargo del dev-lead`), y lo dice en el mensaje de cierre para que lo corrija
- AND la pregunta de validación ofrece diferir con un disparador concreto con dueño que elige el agente («Diferir: lo pruebo en <uso más próximo>, a cargo de <quien valida>»); elegir esa opción, aunque sea sin texto, es la frase literal y el disparador, y el agente no vuelve a preguntar
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** (en un patch, en `patch.md` §4) y pasa la fila a ✅ (en un patch, quita el prefijo 🧪)
