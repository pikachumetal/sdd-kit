# SDD ledger — plan: .docs/sdd/changes/20261020-110000-feature-0038-note-slug-rule/plan.md

## Pre-flight scan
| Fila | Qué comprobé | Hallazgo |
| --- | --- | --- |
| Task 1 (única) | Step 1 contra Scope de la spec; Ficheros contra Interfaces | Coinciden: mismo texto y mismo fichero. El brief afirma que `h0` «falla sin la regla»; `red/h0.txt` dice 2/2 limpios. |

Base check Task 1: merge-base..develop sin cambios (ni ROADMAP.md ni ficheros de la task).
Task 1: Ruling: RED limpio (h0 2/2, la base no exhibe el fallo) y el ítem del Scope no está marcado «si el RED lo exhibe» — implemento el Scope aprobado tal cual; dejarlo fuera sería una desviación — si me equivoco, la regla es preventiva y `h0` no la discrimina: el GREEN no probará nada.
Task 1: Ruling: Step 2 (humo h0 con la skill editada) no ejecutable en esta sesión: `claude` anidado bloqueado («claude anidado bloqueado en un sujeto») — task sin commit ni línea complete hasta correr h0 — si me equivoco, la task queda abierta sin necesidad.
