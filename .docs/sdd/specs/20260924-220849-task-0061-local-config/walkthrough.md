---
id: 20260924-220849-task-0061-local-config
task: 0061
title: Walkthrough — Configuración personal y skill de configuración
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Configuración personal y skill de configuración

## 1. Cambios realizados

- **Fichero local y precedencia** (`a36f5d2`):
  - `control-profiles.md` gana el nivel de la persona en la precedencia y la sección `sdd-kit.local.json`: tres claves admitidas, los dos avisos literales y el nombre de quien trabaja, que sale de `git config user.name`. La tabla de claves gana `validation.startEnvironment`.
  - En `sdd-start-task`, el paso 2 dice de qué nivel sale el perfil y avisa de lo que ignora; el paso 5 nombra el fichero que fija el método.
  - La línea `.docs/sdd/sdd-kit.local.json` entra en `.gitignore`: en las dos init, en la v1.2.0 y en este repo, que estrena `.gitignore`.
- **Skill `sdd-config`** (`4e39bac`): leer y enseñar, preguntar una clave por turno con la recomendada primero, escribir en su fichero y devolver pendientes sin usuario.
  - Su catálogo de siete preguntas reúne las de `control-profiles.md` (literales), la de `ids.mode` de las init y la de `validation.startEnvironment`.
  - Las init y la v1.2.0 la invocan: greenfield pasa de 22 a 18 preguntas y brownfield de 8 a 4.
  - `MigrationInitParity.Tests.ps1` cambia y no se retira. `SddConfig.Tests.ps1` vigila la fuente única.
- **Campaña del Art. I**: el RED está en `30dc969` y el GREEN en `0b1a46b`. Evidencia en `tests/sdd-config-red.md` y `tests/sdd-config-green.md`.
- **Revisión final de rama** (`c6272bd`), con cuatro fixes:
  - el paso 5 explica la cabecera cuando el método viene del fichero local;
  - los cierres también leen el fichero local;
  - `sdd-config`, invocada por una init o una migración, devuelve las respuestas en lugar de escribirlas;
  - `generacion.md` cita las preguntas con la numeración nueva.

  La enmienda de la spec está en `ba2d464`.
- **Capacidades**: nace `configuration` y se fusionan los deltas de `control-profiles`, `onboarding` y `migration` (este cierre).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 1,1 h — reloj del hilo aproximado por las marcas de los commits:
  - apertura a las 00:16;
  - RED a las 00:21;
  - fichero local a las 00:28;
  - `sdd-config` a las 00:35;
  - GREEN a las 00:38;
  - fixes de la revisión final y enmienda a las 00:51;
  - cierre, ~0,25 h.

  La spec y el plan, ~0,6 h antes, quedan fuera de este número.
- Desviación: −1,4 h (−56 %)
- Causa de la desviación: los sujetos y los dos revisores corrieron en segundo plano mientras se escribían los tests y la guía. El contrato que se movió a `sdd-config` ya estaba escrito y se copió literal. Es el sesgo de sobreestimar la guía condicionada al RED que ya advierte `estimation.md`.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 278926 en 2 despachos — revisor de spec Sonnet (effort medium) 111k / 3 min; revisor final Opus (effort high) 168k / 4 min
- Coste de sujetos: 4,01 $ en 15 sujetos Sonnet — RED 2,13 $ (7); GREEN 1,69 $ (7); control tras la revisión final 0,19 $ (1)
- Review de spec: 1 revisor (técnica) · hallazgos 6, aceptados 5

## 3. Desviaciones del plan

- La fila de deuda del roadmap se añade en el cierre, no en la task 4 (ruling de abajo).
- La revisión final abrió una pasada de fixes y una enmienda de la spec, aprobada por el dev-lead: «Apruebo la enmienda (Recomendada)».

### Decisiones tomadas sin el dev-lead

- La línea `complete` de la task 2 se escribió con el commit bloqueado por el pre-commit: tres aserciones de `NativeDefault.Tests.ps1` fijaban la frase vieja. Se actualizaron a la frase nueva, que es el cambio intencionado. Coste si está mal: una frase de test.
- `a36f5d2` incluyó `testResults.xml`, generado por el `-CI` de `task-done` y arrastrado por `git add -A`. Se retira en `4e39bac`, y los commits siguientes añaden por nombre. Coste si está mal: ninguno, es un artefacto.
- Las filas de las init enlazan `sdd-config` con un enlace Markdown y dicen «cómo se numera el trabajo»: el test de paridad sigue enlaces, y `TaskIds.Tests.ps1` exige la frase. Coste si está mal: ninguno de conducta.
- La fila de deuda de `validation.startEnvironment` pasa de la task 4 al cierre. `develop` cambió `roadmap.md` (patch 0065), y tocarlo antes habría disparado el freno de «fichero cambiado en la base». Coste si está mal: olvidar la fila; queda en `tasks.md`.
- La aserción de `NativeDefault.Tests.ps1` sobre la frase del gate de `pair` sigue al fix del paso 5. Coste si está mal: una frase de test.
- No se lanza el sujeto extra de cabecera y cierre que recomendó el revisor final; basta un control c3. Medir la cabecera y el cierre exige un molde con plan y `sdd-end-task` headless. Coste si está mal: con `execution` en local, un agente podría escribir la cabecera con el fichero equivocado.
- Minors diferidos de la revisión final:
  - el paso 1 de `sdd-config` dice «la línea literal» en singular, pero hay dos avisos;
  - ningún test ni sujeto ejerce el aviso de valor no admitido;
  - las init no le dicen a `sdd-config` si el usuario está;
  - `LocalConfig.Tests.ps1` usa un `Escape` doble, deliberado pero poco legible;
  - c2 no aísla la frase «léelo aunque no aparezca al listar»;
  - la v1.2.0 invoca `sdd-config` en dos pasos.
- Disparador de la validación diferida, concretado por el agente: «el primer uso de `sdd-config` o de `sdd-kit.local.json` en un proyecto real, a cargo del dev-lead».

## 4. Verificación

### 4.1 Builds

- Sin build. `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"`: 641 pasan, 0 fallan, 7 saltados (tras los fixes de la revisión final). El pre-commit ejecuta el conjunto rápido en cada commit, en verde.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «ya sabes diferido al uso, end, feedback, commit y merge» · disparador: el primer uso de `sdd-config` o de `sdd-kit.local.json` en un proyecto real, a cargo del dev-lead

Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | c1: una persona pide `pair` y el entorno arrancado solo para ella | GREEN 2/2: fichero local con las dos claves, `.gitignore` con la línea, `sdd-kit.json` intacto, sin nombre (RED 0/2: `CLAUDE.local.md`) |
| 2 | c2: fichero local con `pair`, `merge.noFf` e `ids.mode` | GREEN 2/2: perfil `pair` con su nivel y dos avisos literales (RED 0/2 avisos) |
| 3 | c3: poner al día un `sdd-kit.json` sin `execution` ni `merge.push` | GREEN 3/3, con el control tras los fixes: tabla antes de preguntar, una pregunta con la recomendada primero y nada escrito |
| 4 | c4: migración desde v1.1.0 (control) | 1/1: pregunta del catálogo con su recomendación y línea del fichero local en `.gitignore` |
| 5 | Suite Pester completa | 641/0 |

### 4.3 Residuales / deuda generada

- `validation.startEnvironment` sin lector: el paso 7 de `sdd-start-task` es de la 0060. En el GREEN, los sujetos de c1 le prometen a la persona «te arranco el entorno». Pasa a una fila de deuda del roadmap, junto con alinear `plan-template.md` con `fijado en sdd-kit.local.json`.
- Los seis minors diferidos de la sección 3, que no cambian conducta.

## 5. Aprendizajes

- Un fichero de configuración nuevo se nombra en la skill que lo lee. En el RED, la precedencia salió limpia solo porque los sujetos listaron la carpeta y vieron el fichero; ninguna skill lo nombraba → `architecture.md` (predicados).
- `Invoke-Pester -CI` escribe `testResults.xml` en la raíz, y un `git add -A` lo commitea → `.gitignore` de este repo y `tech-stack.md` («CI» local).
- En Native, `task-done` puede registrar una task como completa aunque el commit de la task lo haya bloqueado el pre-commit, si van en la misma orden y la verificación de la task es más estrecha que el conjunto rápido → ticket de campo de esta task: es conducta de una skill, y cambiarla pide RED (Art. I).
- Al fusionar una entrada de «Reglas de la capacidad», una spec que la escribe como diferencia («se añade…») borra lo vigente. En el delta, la entrada va completa → ticket de campo (toca `spec-template.md`, que es de la 0060).
- Revisión de skills: este repo no tiene `.claude/skills/`, porque sus skills son las del kit. Esta task crea `sdd-config`, con su RED y su GREEN.

## 6. Adendas
