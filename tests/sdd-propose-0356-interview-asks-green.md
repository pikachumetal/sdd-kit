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

Palabras: `dist/skills/sdd-propose/**/*.md` 13.923 de 13.927; el tope no cambia. `kit:copies`, `kit:own`, `kit:skill-size` y `word-budget.test.ts` (77/77) en verde.
