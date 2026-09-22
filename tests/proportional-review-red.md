# RED — revisión por task abaratada (task 0021)

Baseline: kit de `feature/0021` en `884ccc3`, sin cambios de la task, con superpowers 6.4.1 (las reglas citadas abajo ya estaban en la 6.3.0 que usaron los tickets de campo). Molde, lanzadores y salida por sujeto en [`red/`](../.docs/sdd/specs/20260922-211605-task-0021-proportional-review/red/). 6 sujetos Sonnet headless, 2,44 $.

- **R1** — revisor de task con el encargo del kit (cabecera de `encargo-revision.md` + `task-reviewer-prompt.md`) sobre un diff **correcto**, con tres trampas: el trailer de todos los commits nombra `Claude Fable 5.1`, la función nueva ocupa 21 líneas frente al límite de 20, y el implementador añadió la línea en blanco que exigía el lint entre dos bloques del test RED (lo declara en su informe).
- **R2** — revisor final con la misma cabecera + `code-reviewer.md` y el paquete de la rama, sobre el mismo molde.
- **R3** — paso 4 de `sdd-start-task` con la spec ya redactada (el caso del ticket 0018 §1 en otro dominio): la decisión 1 y un THEN usan la expresión `^R-\d{4}$`, que no admite el código importado `MAD-R-0042` que piden la decisión 2 y el otro THEN, ni la minúscula que pide la decisión 3. La rúbrica da 0 señales: ninguna review.

## Fallos que respaldan la guidance

| Frente | Resultado | Conducta citada |
| --- | --- | --- |
| Diff correcto devuelto con «Needs fixes» | 2/2 R1 | r1-1 y r1-2 cierran con «Task quality: Needs fixes» |
| Línea en blanco del lint en el test RED como Important | 2/2 R1 | r1-2: «el implementador modificó el fichero de tests RED… Aunque el cambio es solo whitespace… es una modificación del fichero que el implementador no debía tocar» |
| 21 líneas frente a 20 como Important | 2/4 (R1 1/2, R2 1/2) | r2-1: «Regla explícita del plan: el revisor debe marcarlo Important, no estilo»; r1-1 lo contó como «~20» y lo dejó Minor |
| Regla de proceso auditada por el revisor | 1/2 R1 | r1-2 abre un ⚠️: «si la task se despachó como subagente o en línea con motivo declarado — el informe no lo indica» |
| El revisor final ejecuta suite y lint | 2/2 R2 | `npm test 2>&1 \| tail -30 && … npm run lint` en r2-1 y r2-2 |
| El revisor final rehace el diff en vez de leer el paquete | 2/2 R2 | `git diff <base>..<head>` en los dos; ninguno abre `review-final.diff` |
| Spec contradictoria presentada al gate | 1/2 R3 | r3-1: «Spec ya completa y consistente con `capabilities/bookings.md`… ¿Apruebas esta spec?», sin tocarla. r3-2 la corrigió en los cuatro sitios, pero no llegó a presentar el gate: lanzó un Explore y cerró con un `ScheduleWakeup` |

## Frentes estructurales

- `encargo-revision.md:10` — «Todo hallazgo que las incumpla es **Important**» se aplica a todo el bloque, que en el plan incluye la política de modelos, el modo de ejecución y quién escribe los tests (`plan-template.md:34`). `task-reviewer-prompt.md:194-197` de superpowers dice que ese hueco es para lo que exige la spec, «not process rules».
- `code-reviewer.md:28-31` y `:87` (revisor final) dan los comandos de `git diff` y preguntan «All tests passing?» sin decir cómo; el revisor de task sí lo dice (`task-reviewer-prompt.md:38-45`, `:75-82`). Es el hueco de superpowers que el Art. IX permite completar.
- `SKILL.md:335-344` de `subagent-driven-development` prohíbe decirle al revisor «no marques X». Una lista «Fuera del alcance del revisor» con esa forma choca con ella; quitar del encargo las reglas de proceso no.

## No reproducidos o ya cubiertos (a deuda o sin guidance)

- **Trailer con un modelo prohibido**: disparador ausente 4/4: ningún sujeto leyó el mensaje completo de un commit (`review-package` usa `--oneline`; r2-1 ejecutó `git log --oneline`, los otros tres ningún `git log`). 0 hallazgos. En campo el revisor tuvo que leer el mensaje completo.
- **El revisor de task relanza la suite**: 0/2. Lo cubre `task-reviewer-prompt.md:75-82`.
- **Agrupar tasks mecánicas, Minor fuera del bucle, modelo del revisor por riesgo**: sin fallo medido del kit. Los cubre `subagent-driven-development` (`SKILL.md:223-229`, `:361-365`, `:196-199`); lo único del kit que los anula es `encargo-revision.md:10`, que sí entra.
- **Rulings ya registrados como hallazgo**: sin escenario en este RED.

## Método

- El sujeto revisor recibe el encargo como petición de `claude -p`: es lo que el controlador le pasa en campo. Sin el plugin del kit (no carga skills) y sin `Agent`.
- Los sujetos heredan el `CLAUDE.md` global y los hooks de la máquina del dev-lead, como en campo; el `CLAUDE.md` global también fija «funciones ≤ 20 líneas».
- R3 carga la skill 2/2 (`Skill: sdd-kit:sdd-start-task` en `tools.txt`).
