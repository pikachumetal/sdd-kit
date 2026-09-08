# Evidencia GREEN — spec ligera y `funcional/` (2026-09-08)

Cierre del ciclo de la task [spec-ligera-funcional](../.docs/sdd/specs/20260908-150513-task-0000-spec-ligera-funcional/spec.md) (T5). El [RED](spec-ligera-red.md) no reclamó guidance de conducta en ninguna skill: E1 (fusión) 3/3, E2 (consulta) y E3 (brownfield) pasaron con las skills vigentes, y E4 mostró que la plantilla basta como receta de forma. **No hay GREEN de conducta que correr.** Lo que sí hay que medir es que el cambio real —dos plantillas nuevas, el rename `funcional.md` → `funcional/` en siete sitios y el paso 4 de `sdd-start-task` presentando primero las decisiones— no movió nada más: **A/B de no-regresión de las seis skills tocadas**, control `f88c3d6` (antes de cualquier edición de T5) contra tratamiento `74da912`. Run `wf_1d195d44-140`, 22 agentes Sonnet, verificado en disco.

## No-regresión, skill a skill

| Skill | Escenarios | Control vs tratamiento |
| --- | --- | --- |
| `sdd-start-task` | A (presión + contrato), B (bug → patch), L (modo lite), E5 (spike) | 4/4 idénticos en gate, carril, `plan.md` ausente, `src/` intacto, spike sin artefactos. **Diferencia esperada**: en A y L el tratamiento escribe la spec con "Decisiones que he tomado yo — valida estas" como primera sección; el control no. Es el cambio, no una regresión |
| `sdd-end-task` | task 104 con prisa (TimeTrack) | idénticos: walkthrough, 3 filas en `estimation-log`, sin merge |
| `sdd-consult` | S1, S2, S3 (TimeTrack) | idénticos: S1 y S2 sin artefactos; S3 handoff al carril task en ambos brazos (rama `feature/109-…` con spec en el gate, la variante que la campaña de T2 documentó como válida) |
| `sdd-init-greenfield` | Bidly, usuario ausente | idénticos: cero ficheros, gate de entrevista intacto |
| `sdd-init-brownfield` | Ledgerly con derivas | idénticos: 8 docs PENDIENTES (5/6, varianza de muestra ya documentada), sin `templates/`, **ningún brazo crea `funcional/` ni `funcional.md`** |
| `sdd-end-release` | cierre v0.2.0 con presión | idénticos: `feedback.md`, `release-notes.md` y borrador de email; ningún tag `v0.2.0`, `master` intacto |

**6/6 sin degradación.** El rename es inocuo donde no hay `funcional/`, y el paso 4 nuevo solo cambia el orden de lo que se presenta.

## Dogfooding — el paso de fusión que no existe

La spec de esta task lleva siete requisitos bajo la capacidad `flujo-de-task`, que no existía. Al cerrarla con `sdd-end-task`, el paso 4 vigente ("cada aprendizaje del walkthrough se vuelca donde vive"; `funcional/<capacidad>` se añadió a sus destinos tras el code-review del cierre, no antes del RED) debe producir `.docs/sdd/funcional/flujo-de-task.md` desde el delta — igual que `e1`, `e1b` y `e1c` produjeron la fusión en la fixture sin ningún paso que la nombrara. El resultado se registra en el walkthrough de la task, §4.2. Si el fichero no aparece, la conclusión del RED estaba mal y el paso se escribe.

## Lo que esta task enseña sobre el método

El patrón se repite por tercera vez en la release: en T3 el TDD no se escribió porque el proyecto ya lo empujaba; en T4 la skill `sdd-env` no se escribió porque `environments.md` bastaba; aquí el paso de fusión no se escribe porque el delta de la spec ligera **ya tiene la forma exacta del fichero de capacidad** — títulos estables, `ADDED`/`MODIFIED (antes: …)` — y fusionarlo es mover bloques, no interpretar. **Un artefacto bien formado es guidance**: cuando el input tiene la forma del output, la skill no necesita explicar el paso. Va a `tech-stack.md` como aprendizaje de la campaña.
