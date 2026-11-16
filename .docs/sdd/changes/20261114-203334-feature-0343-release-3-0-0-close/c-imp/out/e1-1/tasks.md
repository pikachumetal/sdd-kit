# Tasks — Motivo al cancelar (0010)

| Task | Título | Estado | Commit |
| --- | --- | --- | --- |
| 1 | Cancelar con motivo | hecha | 4956ccf |
| 2 | Listado de canceladas | hecha | 50bf4a0 |

Revisión final: Spec self-review (sin herramienta de subagentes), limpia · Código self-review, 1 minor diferido · Arquitectura no (sin señales), sobre 50bf4a0

## Rulings

- Ruling: trabajo en el checkout de la rama feature/0010-cancel-reason, sin worktree nuevo — la Task 1 ya estaba escrita sin commitear en este árbol y una verificación lenta del usuario corría sobre él — coste si mal: solo aislamiento menor.
- Task 1: Ruling: el test recibido no cubría el AND «sin --motivo» — añado ese test desde la spec — coste si mal: ninguno, es literal de la spec.
- Task 1: Ruling: el test recibido borraba «cancelar sin reserva lo dice» — lo restauro con --motivo otro — coste si mal: un test de regresión de más.
- Task 1: Ruling: código escrito antes de que se viera el RED — RED probado contra el src/app.js de la base en un worktree desacoplado (3 ✖ por la razón esperada) — coste si mal: el código no salió de un RED visto.
- Task 1: Ruling: la «verificación lenta» en segundo plano no está en el plan ni la ve esta sesión — no la espero y cierro con la Verificación del plan — coste si mal: si falla, abre una ronda de arreglo de la Task 1.
- Task 2: Ruling: con varias canceladas, una por línea; sin canceladas, salida vacía — la spec solo fija el caso de una — coste si mal: una línea.
- Final: Ruling: Eje Arquitectura no — el plan no trae la línea y el diff no cruza ninguna señal — coste si mal: una revisión de arquitectura que faltó.
- Final: Ruling: la validación del motivo va antes de buscar la reserva — la spec fija ambos textos y no su orden — coste si mal: invertir dos líneas.

## Minors diferidos

- test/cancel.test.js pasó de CRLF a LF en 4956ccf y el diff reescribe el fichero entero.
