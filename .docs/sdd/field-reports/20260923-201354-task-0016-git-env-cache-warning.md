---
kit_version: 1.1.0 (working tree de la rama feature/0016, release 2.0.0 en curso)
superpowers_version: 6.4.1
lane: task
id: 20260923-201354-task-0016-git-env-cache-warning
task: 0016
mode: full
date: 2026-09-23
---

# Ticket para el kit — task 0016: helper de entorno de git en los tests y aviso de skills cargadas fuera de la rama

## Contexto

- Carril y modo: task full, perfil `delegate`
- Skills del kit usadas: `sdd-start-task`, `sdd-templates`, `add-to-changelog`, `sdd-end-task`, `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans` y `subagent-driven-development`
- Proyecto: el propio kit (markdown + scripts PowerShell con Pester), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet (implementadores, revisores de task, re-revisiones y fix final); Opus (revisor final)
- Coste en reloj: ~0,7h de implementación y cierre; spec y plan ~1h, repartida con una sesión anterior
- Coste en tokens: subagentes 815k en 8 despachos; hilo no medido
- Incidencia del harness, ajena al kit: el clasificador del modo auto devolvió «no verdict» en todas las llamadas a `Edit`, y la sesión se reanudó en bypass.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un Important de revisión sobre comportamiento en tiempo de ejecución se arregla sin reproducirlo antes

- **Qué pasó**: el revisor de la Task 2 marcó como Important que `GetFullPath` sin `try/catch` «lanza y rompe el exit 0». Lo dedujo leyendo el diff, sin ejecutar nada (así lo pide el kit). El hilo abrió la ronda de fix con un dato de test que no podía fallar (un carácter nulo, que Windows trunca en una variable de entorno). Hicieron falta tres reanudaciones del implementador para descubrir que la premisa era falsa: una excepción de un método .NET termina la sentencia, pero el script sigue y sale con 0 igual. El guard se quedó por la traza de stderr, y el test acabó siendo de contrato, sin RED posible.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6 (desvío y ruling, bucle de fix) y `skills/sdd-start-task/references/encargo-revision.md`. Ninguno dice qué hacer con un hallazgo cuya premisa es de ejecución.
- **Por qué el kit no lo evitó**: el revisor tiene prohibido ejecutar (bien, por coste), y el encargo del fix no pide reproducir la premisa antes de arreglarla. El hilo tradujo el hallazgo directamente a un fix con un test.
- **Coste**: ~17 min del implementador y ~280k tokens de Sonnet en tres reanudaciones, más una re-revisión, para un cambio de 6 líneas que no cambia el código de salida.
- **Propuesta**: cuando un hallazgo Critical o Important afirma un comportamiento en tiempo de ejecución (una excepción, un código de salida, un valor en un entorno concreto), el primer paso del fix es reproducirlo con un test que falle. Si no se reproduce en un intento, el hilo decide antes de seguir, según la «Regla de rulings» de `subagent-driven-development`.
- **Criterio de aceptación**: GIVEN un revisor marca como Important «X lanza y el script no sale con 0», WHEN el hilo despacha la ronda de fix, THEN el encargo pide primero un test en RED que lo reproduzca, y si no sale RED el implementador vuelve con NEEDS_CONTEXT en su primera respuesta, no en la tercera. RED de hoy: el encargo de fix de esta sesión no lo pedía, y el implementador tardó 3 respuestas en llegar a esa conclusión.

### 2. La estimación no distingue una task de transcripción

- **Qué pasó**: el plan estimó 2,5h y la implementación costó ~0,7h (ratio 0,28). El plan traía el código casi entero y los tests RED del hilo, así que las dos tasks fueron transcripción más verificación.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, bloque «Estimación y esfuerzo», campo «Base de la estimación».
- **Por qué el kit no lo evitó**: la base de la estimación es prosa libre y no pregunta si el código ya está en el plan, que es justo lo que decide el coste real.
- **Coste**: bajo en esta task, pero la fila entra en el estimation-log e infla el histórico de `infra/tooling`.
- **Propuesta**: añadir a «Base de la estimación» una línea obligatoria: «¿el plan trae el código? sí / parcial / no». Con «sí», el estimado se calibra con el ratio de las tasks anteriores que también lo traían.
- **Criterio de aceptación**: GIVEN un plan cuyas tasks traen el código completo, WHEN se rellena la estimación, THEN el bloque declara «código en el plan: sí» y el estimation-log puede filtrar por ese campo.

## Lo que hice por iniciativa propia

- **Retomar un borrador de spec de una sesión anterior.** La rama `feature/0016` tenía un `spec.md` en `in-review`, preparado en el índice por otra sesión. La primera pregunta de `sdd-start-task` ofreció partir de ese borrador o descartarlo, y a partir de ahí hice solo el repaso de coherencia, que corrigió tres literales. El paso 2 no contempla que la spec ya exista sin aprobar. Funcionó: evitó rehacer ~1h.
- **Cambios del dev-lead sin commitear en un fichero que el plan toca.** Antes de despachar la task que reescribía el lanzador, vi que el dev-lead tenía allí un cambio suyo sin commitear. Le pregunté qué hacer con él: revertirlo, conservarlo sin commitear o commitearlo. Eligió commitearlo, y lo registré como enmienda. Ninguna skill manda mirar el `git status` contra los ficheros del plan antes de despachar. Candidato a regla del paso 6: si un fichero de «Modificar» tiene cambios ajenos sin commitear, parar y preguntar.
- **Verificación lenta en paralelo con la task siguiente.** La lancé en segundo plano mientras corría la Task 2, que no compartía ficheros con ella. El paso 6 ya lo permite; funcionó.

## Funcionó, no tocar

- La primera pregunta, sola, que propone la fila de `feature/<id>` como enunciado y confirma carril, modo y perfil: una respuesta y listo.
- Los tests RED aparcados en `red-tests/` de la carpeta de la spec y movidos con `git mv` por el implementador: el pre-commit nunca se bloqueó.
- La cabecera de `encargo-revision.md` en cada encargo, con `header-codigo.md` escrito una vez a fichero y reutilizado: ningún revisor auditó reglas de proceso.
- El revisor final (Opus) encontró el hueco que los de task no veían: la convención no exigía llamar a `Clear-GitEnv`.
- `Invoke-SddMerge.ps1` fusionó a la primera, sin cerrojo ocupado.
- El Art. I proporcional: sin campaña de sujetos para piezas que no editan skills, y con el test Pester como evidencia.

## Errores míos, no huecos del kit

- Di al implementador un dato de test (el carácter nulo) sin comprobar que sobrevivía a una variable de entorno de Windows.
- En el test del helper usé `$script:GitEnvNames`, el mismo nombre que la variable del helper, lo que podía tapar un fallo suyo. Lo cazó la revisión final.
- En la nota de cierre del roadmap escribí que lo recortado estaba en «Versión siguiente» sin mirar esa tabla. Lo corregí antes del commit.
