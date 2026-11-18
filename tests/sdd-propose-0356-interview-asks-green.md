# GREEN — feature 0356: en delegate, la entrevista pregunta lo que falta y es del dev-lead

Kit: `dist/` construido con la guía de la Task 2 (`spec-writing.md`, tres montones; `control-profiles.md`, línea de `delegate`). Batería de `sdd-propose`, molde `reservas`, sujetos `sonnet`. Salidas en `.docs/sdd/changes/20261118-214723-feature-0356-delegate-interview-asks/green/out/` y `green-ctl/out/`. 12 sujetos; campaña entera, 22 sujetos y 9,96 $.

| Escenario | RED | GREEN | Lectura |
| --- | --- | --- | --- |
| `iq1` (control) | 3/3 | 3/3 | pregunta el porqué y deja abierto «muy ocupada» |
| `iq2` (control) | 2/2 | 2/2 | escribe la spec sin preguntas de diseño; la única pregunta es la del gate |
| `iq3` | **1/2** | **2/2** | `iq3-2`: «Propones `;`. No lo doy por decidido, porque depende de cómo abre el CSV la hoja del responsable»; `iq3-1`: «Tu mensaje la deja en "Abierto" con la propuesta `;`, y esa propuesta no cuenta como decisión». El nombre del test, «menor y lo decido yo», en los dos |
| `iq4` | **0/1** | **1/1** | ✋ de la spec: «1. **Umbral: pendiente.** … El 4 lo he puesto yo; nadie lo dijo» |
| `iq5` (control) | 2/2 | 2/2 | `iq5-2` pregunta el umbral; `iq5-1` pregunta antes dónde sale el aviso y dice «Quedan dos puntos que aún no te he preguntado: el valor del umbral…» |
| `a5` (control, n = 1) | — | 1/1 | no pregunta el nombre de la opción ni qué pasa sin ella; pregunta «¿En qué planta está cada sala?», porque el molde no tiene plantas: es un dato que solo da el dev-lead |
| `pb` (control, n = 1) | — | 1/1 | el enfoque va al ✋ («Enfoque: … (A), frente a … (B) y … (C) (ver Approach)») |

## Tras la revisión final (pasada de fix)

Kit de la pasada de fix. `PHASE=fix`, `fix-iq4` y `fix-interviewer`; 27 sujetos, 11,09 $. Campaña entera: 49 sujetos, 20,86 $.

| Escenario | Resultado | Lectura |
| --- | --- | --- |
| `iq1` | 3/3 | los tres preguntan el porqué; ninguno fija el umbral |
| `iq2` | 2/2 | escribe la spec sin preguntas de diseño |
| `iq3` | 2/2 | `iq3-1` pregunta el separador («¿Tu hoja de cálculo parte las columnas por `;`…?»); `iq3-2` pregunta antes qué reservas entran y deja el separador para ti («Del prompt, dejo para ti el separador (tu propuesta es `;`)»). El test, «menor: lo decido yo con el proyecto», en los dos |
| `iq4` (n = 2) | 2/2 | «Umbral … — pendiente: nadie lo dijo» en los dos |
| `iq5` | 2/2 | preguntan antes dónde sale el aviso; el umbral queda como «N» |
| `interviewer` `p1 p2 p3 pe` | 2/2, 2/2, 2/2, 5/5 | la puerta y las filas de máquina, en verde |
| `interviewer` `fp` | **4/5**, `K` falla en `fp-1` | `fp-1` para en la clasificación con una pregunta sobre la premisa falsa («`libres` ya existe») y no llega al paso de la spec: no lee `spec-writing.md`, que es lo único que cambia esta feature, ni carga `sdd-grilling`, que es lo que mira `K`. No es atribuible al cambio; con n = 5 y un solo rojo, una fila no separa dos textos (feature 0342) |

Palabras: `dist/skills/sdd-propose/**/*.md` 13.923 de 13.927 en el GREEN; tras la pasada de fix y el arreglo N1 de la re-revisión, 13.937, y el tope pasa a 14.162, el aprobado en la spec. N1 devuelve la frase literal «as territory, not a script» y no se volvió a medir. `kit:copies`, `kit:own`, `kit:skill-size` y `word-budget.test.ts` (77/77) en verde.
