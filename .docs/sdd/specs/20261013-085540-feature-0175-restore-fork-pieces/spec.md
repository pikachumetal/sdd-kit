---
id: 20261013-085540-feature-0175-restore-fork-pieces
feature: 0175
title: Forks previos a la ADR 0013 — sdd-implement y sdd-rubber-duck vuelven al texto de su fuente
mode: lite
profile: delegate
status: approved
created: 2026-10-13
author: Àngel Delgado (con Claude)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-13
---

# Spec — Forks previos a la ADR 0013: `sdd-implement` y `sdd-rubber-duck` vuelven al texto de su fuente

🦆 Cuando el agente implementa un plan, volverá a tener delante las reglas de superpowers enteras, con sus porqués y sus ejemplos: la de no pasar a la siguiente tarea con un fallo grave de la revisión abierto, o la frase «en sesiones reales, quien perdió el hilo rehizo tareas ya terminadas», que hoy faltan porque al copiarlas se resumieron. Y cuando le digas «no te he entendido», te lo volverá a contar con un poco de contexto, frases cortas y las palabras del glosario, en lugar de repetirlo igual. El texto de la fuente vuelve sección a sección, y solo cambian los nombres de los comandos y los pasos donde el kit trabaja distinto; cada diferencia que queda tiene su fila y su motivo en la tabla del anexo. La comprobación antes de dar una tarea por terminada vuelve a apoyarse en la skill de superpowers que la gobierna, porque el kit aún no la ha copiado. Lo prueban dos ensayos de implementación y tres de explicación, por unos 3–7 $.

## Capacidades

- Modificadas: `explaining` — gana la segunda explicación cuando el último mensaje no llegó (el re-pitch de `wait-what`).

## ✋ Decisiones que he tomado yo — valida estas

1. **`verification-before-completion` se invoca, no se sustituye.** Vuelve la línea de la fuente al contrato de cierre de Native: `**REQUIRED SUB-SKILL:** superpowers:verification-before-completion governs the claim.` Motivo: el Art. IX dice que lo que el kit no ha copiado se invoca, y una regla del kit en su lugar sería quitar texto, que exige un A/B. El README pasa de «El kit invoca 3 skills de superpowers» a 4, y `tests/Skills.Tests.ps1` lo comprueba.
2. **Los grafos de «The Process» vuelven adaptados**: uno al principio de § Native loop y otro al principio de § SDD loop, con los pasos del kit (`sdd task start`, la base, los RED del hilo, `sdd-tdd` y `sdd-debugging`, `sdd task done`, la revisión final y el paso 7 de `sdd-start-feature` en lugar de `finishing-a-development-branch`). El grafo «When to Use» de SDD no vuelve: el método lo decide la línea `Ejecución` del plan.
3. **Los dos «Example Workflow» vuelven adaptados**, en una sección final «Example workflows»: con los comandos `sdd` del kit, la línea `Workspace del plan`, los RED escritos por el hilo, el revisor final del kit y el cierre por el paso 7 de `sdd-start-feature`; el plan de ejemplo vive en `.docs/sdd/specs/<carpeta>/plan.md`.
4. **La racionalización «Reviews slow the loop down»** vuelve a la tabla de § SDD loop, con su texto.
5. **Lo demás que dio el diff vuelve en su sección**, con la redacción de superpowers 7.0.0: las reglas enteras que faltaban y el texto que la 0147 resumió (porqués, evidencia de sesiones reales, las 21 filas de racionalizaciones enteras), las cuatro líneas de `implementer-prompt.md` y las líneas «Purpose» y «returns» de los dos prompts de revisión, que el resto llevan fieles. El texto propio del kit se queda donde está (paradas del perfil, frenos de alcance, acción update, vigía, base, RED del hilo, recuperación). Detalle por fila en el anexo.
6. **Lo que no vuelve, con su motivo de la ADR (el kit trabaja distinto)**: los scripts, por la CLI `sdd`; las esperas en tramos de 5-10 minutos, por el vigía de silencio; el pre-flight corto de `executing-plans`, por el de SDD en los dos métodos; el ledger en la ruta plana vieja; «commit as the plan's commit steps say» con varios commits por task, por un commit por task (Art. IV); «mecánica → modelo barato», por la política de modelos del Art. IV; «tell your human partner so when they choose inline», por la oferta de bajar a gama media de `sdd-propose`; `finishing-a-development-branch`, por el paso 7 de `sdd-start-feature`; el bloque de Global Constraints, por el bloque «De código». Ninguno pide A/B.
7. **`sdd-rubber-duck`**: el re-pitch vuelve como sección propia, «Re-pitch: when your last message didn't land», con el texto de `wait-what`; el lenguaje del proyecto es la «Terminology» de `PRODUCT.md` (en la fuente, `CONTEXT.md`). Vuelve también a § Words «frases cortas en voz activa, una idea cada una» (ASD-STE100), que la pasada de fix de la 0145 recortó por «sin fallo del RED». De `teach` no vuelve nada más: el espacio de aprendizaje, las lecciones, los learning records, la misión, la zona de desarrollo próximo, los quizzes y las comunidades son para enseñar un tema en varias sesiones, y la skill explica el proyecto en una respuesta. Los otros tres recortes de la 0145 («ids», «si no cambia nada, dilo en una frase», «de 3 a 9 pasos») no son texto de la fuente: siguen fuera.
8. **La `description` de `sdd-rubber-duck` gana el disparo del re-pitch**: «…, or when the user says your last message didn't land («no te he entendido», «wait, what?»)». En la fuente es una skill que solo invoca el usuario (`/wait-what`); en el kit la skill entra sola, y sin el disparo la regla no se cargaría. Riesgo: solaparse con «no lo pillo» de `sdd-explore`, que mide el control `c1`.
9. **Topes de `tests/WordBudget.Tests.ps1`**: suben a lo que mida el texto al terminar, redondeado hacia arriba a la decena. Previsión: `sdd-implement` ~8.000 en `SKILL.md` y ~11.700 en total; `sdd-rubber-duck` ~600. Medido al terminar: 10.240 y 13.950; 600.
10. **Prueba (Art. I)**: humo en las dos skills, sin RED, porque la evidencia de la fuente vale para el Principio 1 (ADR 0013). En la batería de `sdd-implement`, `h1` (Native) y `h2` (SDD), n = 1. En la de `sdd-rubber-duck`, `s1` (n = 1), el escenario nuevo `w1` (n = 1) y el control `c1` (n = 1). Previsión de coste: 5 sujetos sonnet, 3–7 $, ~25 min. Sin A/B: ninguna pieza sale.
11. **Escenario `w1`**: molde `exportes`, paso `re-pitch`, esperado `sdd-kit:sdd-rubber-duck`, sin el prefijo que `subject.sh` antepone en `s1` y `s2` (mide también el enrutado). Petición literal: «Antes me has dicho esto: "El fallo está en el formateador: escribe la hora con `toISOString()`, que serializa en UTC, y el test `exporta en la hora del usuario` espera la local; hay que pasarle la zona del usuario". No te he entendido.» Rúbrica: R1, R2 y una fila nueva, R10 «Re-pitch»: falla si no empieza con un poco de contexto (qué estábamos haciendo), si tiene una frase de más de 25 palabras o si repite un identificador del mensaje original.
12. **`feature-flow` no se toca**: el texto que vuelve a `sdd-implement` es de la fuente y no cambia lo que el dev ve del flujo (ninguna parada ni artefacto nuevo).
13. **Una pieza entra, otra sale (Art. I)**: entra texto de la fuente y no sale nada. Justificación: la ADR 0013 manda devolverlo; adelgazar es lo que esta feature corrige.
14. **Review de spec**: ninguna (lite).

### Decisiones tomadas con el dev-lead

- Carril lite, perfil `delegate`, merge con push — «Arranca la 0175 con sdd-propose, carril lite… Perfil delegate. Al fusionar, `sdd merge --push`» (2026-10-13)
- Fuentes — «superpowers 7.0.0 (…) y mattpocock/skills 1.2.3 (wait-what), las versiones que citan los avisos»
- Las piezas — «los dos «Example Workflow» de executing-plans y subagent-driven-development, los grafos de «The Process», el «REQUIRED SUB-SKILL verification-before-completion» del contrato de cierre y la racionalización «Reviews slow the loop down»» y «el re-pitch de wait-what («no te he entendido»)»
- Cómo vuelven — «Cada pieza vuelve con el texto de la fuente, adaptado solo donde el kit trabaja distinto (sus pasos, sus nombres de skill). Si una no debe volver, sale con un A/B de no-regresión con el escenario donde actúa, no por «no nombra un fallo»»
- `verification-before-completion`, a mi juicio — «decide si la línea invoca la skill de superpowers (Art. IX: mientras no se copie, se invoca) o la sustituye una regla del kit con su motivo»
- Tabla y diff previo — «La spec lleva la tabla «Regla de la fuente → dónde vive ahora» de las cinco piezas. Antes de escribirla, haz un diff de cada skill contra su fuente para confirmar que no falta nada más.»
- Topes — «Los topes de palabras de las dos skills suben a lo que mida el texto (ADR 0013).»
- `sdd-grilling` fuera — «sdd-grilling queda fuera: pasó el repaso (las rondas salieron por decisión del dev-lead).»
- Alcance tras el diff — a la pregunta de alcance, «Todo el diff (Recomendada)» (2026-10-13)

## Intent

Hoy `sdd-implement` (feature 0147) no es el texto de `executing-plans` y `subagent-driven-development` de superpowers 7.0.0, sino un resumen. Le faltan cinco piezas descartadas con un motivo que la ADR 0013 ya no admite, varias reglas enteras y los porqués con la evidencia que la fuente da a cada regla. `sdd-rubber-duck` (feature 0145) dejó fuera el re-pitch de `wait-what` y su ASD-STE100. Importa porque esas tablas y esos porqués existen para la presión («No adelgacemos porque sí», ADR 0013), y la revisión de un fork marca como Important cada pieza quitada sin motivo. Éxito: el `diff` de cada skill contra su fuente solo deja diferencias con su fila en el anexo y uno de los tres motivos de la ADR, y los humos siguen limpios.

## Scope

- Entra: `skills/sdd-implement/SKILL.md` (todo el diff); `skills/sdd-implement/references/` (las cuatro líneas de `implementer-prompt.md` y las líneas «Purpose» y «returns» de los dos prompts de revisión); `skills/sdd-rubber-duck/SKILL.md` (re-pitch, ASD-STE100 y `description`); `tests/WordBudget.Tests.ps1`; `README.md` (skills de superpowers invocadas, de 3 a 4, y la fila de `sdd-rubber-duck`); `tests/batteries/sdd-rubber-duck/battery.md` (`w1`, R10 y procedencia) y la procedencia de `tests/batteries/sdd-implement/battery.md`; el delta de `explaining`; la fila 0175 del roadmap.
- No entra: `sdd-grilling`; el texto propio del kit en `sdd-implement`; reescribir la revisión final (es de la 0148); forkear `verification-before-completion`; los recortes de la 0145 que no son texto de la fuente; `NOTICE` y `THIRD_PARTY_NOTICES.md` (las fuentes y versiones no cambian).

## Approach

Sección a sección de `sdd-implement`, el texto de la fuente vuelve donde la 0147 lo resumió o lo quitó, con la redacción de superpowers 7.0.0. Solo cambian los nombres de comandos y skills del kit y los pasos donde el kit trabaja distinto (anexo). Lo que el kit añadió se queda en su sitio. Donde una frase del kit resume una de la fuente, la sustituye la de la fuente. El re-pitch de `wait-what` entra en `sdd-rubber-duck` como sección propia y en su `description`, y el ASD-STE100 vuelve a § Words.

## Dónde se prueba

- Bucle Native con el texto devuelto: humo `h1` de la batería de `sdd-implement`, como sus escenarios actuales.
- Bucle SDD: humo `h2`, ídem.
- El 🦆 corto no cambia: `s1` de la batería de `sdd-rubber-duck`.
- El re-pitch: `w1` nuevo, molde `exportes`, rúbrica R1, R2 y R10.
- «No lo pillo» sigue entrando por `sdd-explore`: control `c1`.
- Topes y README: `tests/WordBudget.Tests.ps1` y `tests/Skills.Tests.ps1`, en el pre-commit.
- Fidelidad: `diff` de cada skill contra su fuente en la revisión final (Confirmación de la ADR 0013).

## Términos y ADR

- Términos resueltos: re-pitch — volver a contar el último mensaje cuando no llegó, con contexto, frases cortas y el lenguaje del proyecto.
- ADR candidatas: ninguna (aplica la 0013).

## Delta de comportamiento

### Capacidad: `explaining`

**ADDED — Si el último mensaje no llegó, se vuelve a contar con contexto y frases cortas**
- GIVEN el molde `exportes` y un mensaje anterior del agente al dev-lead: «El fallo está en el formateador: escribe la hora con `toISOString()`, que serializa en UTC, y el test `exporta en la hora del usuario` espera la local; hay que pasarle la zona del usuario»
- WHEN el dev-lead contesta «No te he entendido»
- THEN el agente invoca `sdd-rubber-duck` y lo vuelve a contar empezando por un poco de contexto: qué estábamos haciendo y dónde estamos
- AND con frases de 25 palabras como mucho, una idea cada una
- AND con las palabras del glosario («franja», «reserva»), sin `toISOString()`, sin el nombre del test y sin «UTC» si no lo explica en la misma frase por su efecto

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,7 h
- Estimación de implementación: 2,5–4 h (texto 1,5–2 h; humo y evidencia 0,5–1 h; cierre 0,5–1 h)
- Base de la estimación: la 0173 (docs, 2,5 h estimadas, 1,6 reales) y la adenda de la 0165, que devolvió el texto de la fuente a dos forks; factor de calibración 0,58
- Confianza: media — mucho texto que colocar, y la revisión final lo compara contra la fuente

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-13 | aprobada: «Apruebo (Recomendada)» |

## Anexo — Regla de la fuente → dónde vive ahora

> EP: `executing-plans`; SDD: `subagent-driven-development` (superpowers 7.0.0); VBC: `verification-before-completion`; WW: `wait-what`; T: `teach` (mattpocock/skills 1.2.3). «§» es la sección de la skill del kit. Motivo: **vuelve** (estaba fuera o resumido y vuelve con el texto de la fuente), **se conserva** (ya estaba entero) o **kit distinto** (uno de los tres motivos de la ADR 0013).

### Las piezas de la fila

| Regla de la fuente | Dónde vive ahora | Motivo |
| --- | --- | --- |
| EP · Example Workflow | `sdd-implement` § Example workflows, Native | vuelve, con los comandos y pasos del kit |
| SDD · Example Workflow | `sdd-implement` § Example workflows, SDD | vuelve, ídem |
| EP · The Process (grafo) | § Native loop, al principio | vuelve, con los pasos del kit |
| SDD · The Process (grafo) | § SDD loop, al principio | vuelve, ídem |
| EP · Task loop 3: REQUIRED SUB-SKILL VBC | § Native loop, contrato de cierre | vuelve: se invoca (Art. IX) |
| SDD · Racionalización «Reviews slow the loop down» | § SDD loop, tabla | vuelve |
| WW · el re-pitch (toda la skill) | `sdd-rubber-duck` § Re-pitch y `description` | vuelve; el disparo pasa a la `description` (kit distinto: la skill entra sola) |

### Lo demás de `sdd-implement`

| Regla de la fuente | Dónde vive ahora | Motivo |
| --- | --- | --- |
| EP · Why inline (brief = spec, ledger = memoria, TDD = gate, revisor final = segundos ojos) | § Method, Native | vuelve |
| SDD · Why subagents; core principle de SDD | § Method, SDD | vuelve |
| SDD · vs. Executing Plans (cuatro líneas) | § Method | vuelve entero |
| EP · Core principle; narración | § Overview | se conserva |
| EP/SDD · Continuous execution: «progress summaries waste their time…» | § Overview | vuelve, con las paradas del kit |
| EP/SDD · Rulings, not stalls: «a wrong ruling costs rework… a session parked on a question costs their whole day», «a decision made in secret» | § Deviations and rulings | vuelve |
| SDD · «a cap you would have asked to exceed — decide them»; «a running plan does not wait on a human», sin acotar | § Deviations and rulings: «for what a ruling settles», y los frenos y desvíos «are not rulings, and they stop» | kit distinto: el tercer arreglo descubierto y una salida observable son frenos de alcance que paran (humo `h1`: decidió como ruling qué responde `cancelar` sin motivo) |
| EP/SDD · «Four things stop you, and only these» | § Overview | se conserva, con las paradas del kit (amplía) |
| EP · Sin herramienta de subagentes: «never fabricate a dispatch; run the plan here» | § Method | vuelve |
| EP · «the last tasks get the least of you» | § Method, junto a la regla de compactación | vuelve |
| EP · When to Use: un plan de `writing-plans` y el método elegido en el handoff; «tasks are mostly independent» | § Method | kit distinto: la línea `Ejecución` del plan y sus cuatro factores, la dependencia entre tasks entre ellos |
| EP · «Tell your human partner so when they choose inline» | — | kit distinto: la oferta de bajar a gama media de `sdd-propose` |
| SDD · When to Use (grafo) | — | kit distinto: la línea `Ejecución` del plan |
| EP/SDD · Setup: «conversation memory does not survive compaction», «the single most expensive failure observed», «harness todos are a live view; the ledger is the record», «their commits exist in git…» | § Setup, 3 | vuelve |
| EP/SDD · Setup: worktree aislado, nunca en main sin permiso | § Setup, 1 (`sdd-worktrees`) | se conserva |
| SDD · Ledger en la ruta plana vieja | — | kit distinto: no hay ruta vieja |
| SDD · Pre-flight: tasks que se contradicen o contradicen las Global Constraints; «if the scan is clean, proceed without comment»; «the review loop remains the net…» | § Setup, 6 | vuelve |
| EP · Pre-flight corto por interfaces | — | kit distinto: el de SDD en los dos métodos (0147) |
| EP · REQUIRED SUB-SKILL test-driven-development | § Setup, 5 (`sdd-tdd`) | se conserva |
| EP · Task loop: «everything you print… stays resident»; «every tool call is a turn that re-reads your whole context» | § Native loop | vuelve |
| EP · Todo `in_progress` al tomar la task y `complete` al cerrarla | § Native loop 1 y 4; § SDD loop 5 | vuelve |
| EP · Tres salidas de un `Expected:`; «the ruling is carried, not remembered» | § Native loop, 2 | vuelve la frase que faltaba |
| EP · «Commit as the plan's commit steps say»; varios commits por task | § Native loop, 4 | kit distinto: un commit por task (Art. IV) |
| EP · Contrato de cierre (cuatro condiciones) | § Native loop, 3 | se conserva |
| EP · Racionalización «I'll write the ledger lines after a few tasks»: «in the same message as the commit»; Task loop: «a ledger append in the same call as the commit» | § Native loop, tabla y paso 1: la línea de cierre la escribe `sdd task done`, en su propia llamada tras comprobar el commit | kit distinto: el paso 4 separa el commit y `sdd task done` (`tests/closing-verification-red.md`); revisión final de la 0175 |
| EP/SDD · Example Workflow: primer mensaje «I'm using <skill> to…» | § Example workflows: el aviso de fase con la línea `Workspace del plan` | kit distinto: el primer mensaje tras cargar la skill lleva esa línea (Overview); revisión final de la 0175 |
| EP · Racionalizaciones (12 filas) | § Native loop, tabla | vuelve el texto entero de cada «Reality» |
| SDD · Model Selection: el modelo menos potente por rol, señales de complejidad, revisores según tamaño y riesgo, re-revisión de un fix pequeño en gama barata-media, «always specify… silently defeats», «turn count beats token price… 2-3× the turns» | § SDD loop, Models | vuelve, con el suelo de gama media del Art. IV donde choca |
| SDD · «Mechanical tasks: fast, cheap model; most tasks are mechanical» | — | kit distinto: el tier más barato solo transcribe código del plan (Art. IV) |
| SDD · Batch: «reserve one-dispatch-per-task for work that needs its own judgment…» | § SDD loop | vuelve |
| SDD · Artefactos como ficheros: «and everything a subagent prints back… re-read on every later turn» | § SDD loop | vuelve |
| SDD · Esperas: «never poll with short timeouts; while you have local work, keep working» | § SDD loop | vuelve |
| SDD · Esperas en tramos de 5-10 min y reconciliar | — | kit distinto: el vigía de silencio |
| SDD · 1. Despacho: el brief «read this first — it is your requirements…», «exact values appear only in the brief», el informe corto, «42k chars… 99% pasted history», «every reviewer a worker spawned duplicated the task review» | § SDD loop, 1 | vuelve |
| SDD · 2. «If the implementer said it's stuck, something needs to change»; responder las preguntas del implementador sin meterle prisa | § SDD loop, 2 | vuelve |
| SDD · 3. «Per-task reviews are task-scoped gates», nunca saltarse la revisión de task, los dos veredictos, la autorrevisión no la sustituye; sin órdenes abiertas; «usually to spare yourself a review loop»; ⚠️ «do not block the rest… you hold the plan» | § SDD loop, 3 | vuelve |
| SDD · 3. Bloque de Global Constraints copiado del plan o la spec | § SDD loop, 3 | kit distinto: el bloque «De código», literal (0147) |
| SDD · 4. «A roll-up nobody reads is a silent discard»; no descartar ni contradecir el plan sin ruling; «its context is intact»; «the report file is the persistent memory»; «a loop that survives three resumes…»; nombrar los tests que cubren el fix; ADDRESSED o NOT ADDRESSED; «never extend the loop»; «your context stays clean»; breaker: «the final review sees both sides», «parking a structural failure silently…», «pre-judging with a different name» | § SDD loop, 4 | vuelve |
| SDD · 5. «Never move to the next task while the review has open Critical/Important issues…» | § SDD loop, 5 | vuelve |
| SDD · Racionalizaciones (9 filas) | § SDD loop, tabla | vuelve el texto entero; la fila que faltaba, arriba |
| EP · Final Review: «a judgment task», Review Focus «the input classes and failure modes the plan's tests do not exercise», «specify the model explicitly», «the one fresh context… do not skip it, and do not replace it with your own read of the diff», la autorrevisión «weaker than a fresh reviewer» | § Final review | vuelve |
| EP · Final Review: «the spec is a vision document», los Minor a «Deferred minors» y «a ruling is a decision about a conflict…», «a fix without a test that failed first is not verified…», por qué no hay re-revisión, «there is no second fix pass» | § Final review | vuelve |
| SDD · Final Review: «per-finding fixers… cost more than all its tasks combined», «only the four classes above stop you here», los residuales llegan al dev-lead | § Final review | vuelve; los residuales llegan en la presentación del paso 7 (kit distinto) |
| EP/SDD · Paquete de `review-package` para la revisión final | § Final review | kit distinto: la receta del revisor final de `encargo-revision.md` (0147) |
| EP/SDD · Finish: «in the order you made them, each with what it costs if wrong», «both lists are exhaustive… the only place…», «a ruling that dies with the workspace…», «the git history is the record now» | § Finish | vuelve |
| EP/SDD · «Use superpowers:finishing-a-development-branch» | § Finish: paso 7 de `sdd-start-feature` | kit distinto (0147) |
| EP/SDD · Scripts `sdd-workspace`, `task-start`, `task-done`, `task-brief`, `review-package` | la CLI `sdd` | kit distinto (0143) |
| SDD · `implementer-prompt.md`: «Did I follow TDD…? Are tests comprehensive?», «Use BLOCKED if…», «Use NEEDS_CONTEXT if…» | `references/implementer-prompt.md` | vuelve; «if required» sale porque en el kit TDD va siempre (`sdd-tdd`) |
| SDD · `task-reviewer-prompt.md` y `re-review-prompt.md`: «Purpose» y «returns» | `references/` | vuelve; el resto se conserva |

### `sdd-rubber-duck`

| Regla de la fuente | Dónde vive ahora | Motivo |
| --- | --- | --- |
| WW · «talk in ASD-STE100 Simplified Technical English» | § Words y § Re-pitch | vuelve (recortada en la 0145 sin motivo) |
| WW · «use the ubiquitous language from `CONTEXT.md`» | § Words: «Terminology» de `PRODUCT.md` | se conserva; kit distinto: el glosario vive en `PRODUCT.md` |
| WW · «give me a little bit of context» | § Re-pitch | vuelve |
| T · No explicar de memoria, sino desde la fuente | § Long mode, 1 | se conserva |
| T · La memoria de trabajo es pequeña: breve | § Short mode, cinco frases | se conserva |
| T · El glosario se respeta siempre | § Words | se conserva |
| T · Recordar al lector que pregunte | § Long mode, 5 | se conserva |
| T · Espacio de aprendizaje, `MISSION.md`, `RESOURCES.md`, lecciones HTML, assets, learning records, zona de desarrollo próximo, fluidez y almacenamiento, quizzes, comunidades, `NOTES.md` | — | kit distinto: la skill explica el proyecto en una respuesta, no enseña un tema en varias sesiones (0145, decisión 3) |
