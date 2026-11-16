---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261020-110233-feature-0204-merge-push-and-slow-tests
task: 0204
mode: full
date: 2026-10-20
---

# Ticket para el kit — feature 0204: sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement` (Native), `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback`. Todas se leyeron del working tree con `Read`, porque la sesión no salió de `Start-KitSession.ps1`.
- Proyecto: el propio kit (CLI TypeScript con Vitest y skills en Markdown), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 en el eje Spec y en la re-revisión; Sonnet 5.5 en el eje Código y en los dos sujetos del humo
- Coste en reloj: 1,79 h de esfuerzo frente a 1,5 h estimadas (+19 %)
- Coste en tokens: 26,1 M en el hilo y 2,7 M en subagentes, 10,95 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La spec sin review no vio que editar una referencia de skill pide su humo

- **Qué pasó**:
  - La spec editaba `skills/sdd-archive/references/merge-recipe.md`: una fila nueva en «Its outputs» que pide citar en el mensaje final los commits ajenos.
  - La rúbrica contó 2 señales, así que no hubo review de spec. El repaso de coherencia no comprobó que esa edición necesitara batería o humo.
  - Lo cazó el eje Spec de la revisión final como Important, por la ADR 0002 y el Art. I. Hizo falta una pregunta al dev-lead, una enmienda de «Dónde se prueba» y un humo RED/GREEN. El RED también pasó: la fila no cambiaba la conducta.
- **Fuente**: `walkthrough.md` de la 0204 §3 y §4.1; `smoke.md` de la 0204; `tasks.md` de la 0204, «Revisión final:».
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 4, «Coherence pass»; y `skills/sdd-templates/templates/spec-template.md`, «Dónde se prueba».
- **Por qué el kit no lo evitó**: el repaso de coherencia busca literales, `MODIFIED` y lo que se retira, pero no pide que cada fichero de `skills/` del Scope tenga su prueba en «Dónde se prueba». La regla vive en la ADR 0002, que la spec no consulta.
- **Coste**: una parada del dev-lead, la enmienda y dos sujetos (0,23 $). Unos 10 min de hilo, sin respaldo en minutos.
- **Propuesta**: en el repaso de coherencia de `sdd-propose`, añadir esto: «cada fichero de `skills/` que el Scope edita tiene en "Dónde se prueba" su batería, su humo o el motivo de no medirlo (ADR 0002)».
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md`, paso 4, que no lo pide.
- **Criterio de aceptación**: GIVEN una spec cuyo Scope edita `skills/<x>/references/<y>.md` y cuyo «Dónde se prueba» no la nombra · WHEN el sujeto hace el repaso de coherencia · THEN añade su humo o su motivo antes del gate.

### 2. El dev-lead quiere cerrar los Minor de la revisión final y el kit los difiere siempre

- **Qué pasó**:
  - `sdd-verify`, «Closing the review», dice: «Minors never enter the fix pass». En esta feature el dev-lead eligió meterlos todos («Sí, todos»), y en la 0202 lo dejó escrito en el punto 2 de la spec.
  - Cada vez cuesta una pregunta y una enmienda. Además, el ledger los deja como `minor (deferred)` aunque acaben arreglados.
- **Fuente**: «Enmiendas» de la spec de la 0204; punto 2 de la spec de la 0202; `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review»; `skills/sdd-config/SKILL.md` (claves del proyecto).
- **Por qué el kit no lo evitó**: la regla es fija y no hay clave que la cambie por proyecto.
- **Coste**: una pregunta al dev-lead por feature (2 de 2 features de esta serie).
- **Propuesta**: una clave `review.minors: fix | defer` en `sdd-kit.json`, con `defer` por defecto. Con `fix`, los Minor entran en la pasada de fix sin preguntar.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `review.minors: fix` · WHEN la revisión final devuelve Minor · THEN entran en la pasada de fix sin preguntar, y el ledger no los deja como `minor (deferred)`.

## Lo que hice por iniciativa propia

- **El diagnóstico de un test que solo falla con carga se hizo midiendo antes de escribir la spec.** La herramienta fue `vitest --reporter json` con la duración de cada test, con la suite entera, con otra suite a la vez y con 8, 16 y 32 workers: 13 pasadas.
  - Salió la causa: el primer test de cada fichero se estira porque todos los ficheros arrancan a la vez.
  - Salió también un síntoma distinto: los fallos transitorios de git, que quedaron fuera.
  - La spec se escribió con las cifras.
  - Es candidato a paso de `sdd-debugging` para los rojos intermitentes. Funcionó, pero alargó el paso 2 de `sdd-propose`, que solo debería leer lo justo para clasificar.

## Funcionó, no tocar

- `sdd session tokens` midió por ventana una rama sin transcripts propios (feature 0202) y dio el esfuerzo real y el coste del walkthrough sin tocar nada.
- La re-revisión única con la lista de hallazgos numerada: dio veredicto uno por uno y cazó 2 Minor de formato nuevos.
- `sdd merge --sync` y `sdd merge --push` cerraron sin intervención.

## Menores

- `sdd ledger rulings` lista como `minor (deferred)` los Minor que la pasada de fix arregló después. Hubo que aclararlo a mano en `tasks.md` — `skills/sdd-implement/SKILL.md`, «Finish».
- La copia RED de la Task 1 no se guardó fuera del repo antes del GREEN. La regla existía y no la apliqué — `skills/sdd-implement/SKILL.md`, «Before each task», punto 2.
- Me salté el gate completo de la línea base, con un ruling: la suite lenta había pasado esa mañana sobre la misma base — `skills/sdd-implement/SKILL.md`, «Setup», paso 1.
