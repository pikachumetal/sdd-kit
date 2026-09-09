# Evidencia GREEN — gates y reviews proporcionales (2026-09-09)

Verificación de la guidance escrita a partir de [gates-reviews-red.md](gates-reviews-red.md). Misma fixture "Ledgerly-rev", mismos escenarios y peticiones, copias frescas, copia limpia del kit con las ediciones, `--add-dir` en todos los sujetos.

## Lo que cambió en las skills (solo lo que el RED respaldó)

- `sdd-start-task` paso 4: **solo un enlace** a `references/review-spec.md` (E1b demostró que rúbrica y despacho los hace el baseline con el fichero legible).
- `sdd-start-task` paso 5: **sin cambios** (E2: la plantilla gobierna).
- `sdd-start-task` paso 7 nuevo ⛔ **Validación del trabajo** con la definición de validar («que el usuario diga qué ha probado él y que funciona»; «cierra la tarea», «está implementada» o una `review-final.md` no lo son), cierre renumerado a 8, red flag y dos racionalizaciones (la segunda, «el usuario me ha pedido cerrar: eso ya es validar», salió del primer GREEN).
- `sdd-end-task` paso 0: no arranca sin validación del usuario, con la misma definición y la racionalización.
- Paso 6 (bloque a revisores): según E3.

## Veredicto contra los fallos del RED

### F1 — El cierre no pasaba por el usuario → **primera ronda 0/2, segunda ronda 2/2**

| | GREEN E4a | GREEN E4b | GREEN E4c | GREEN E4d |
| --- | --- | --- | --- | --- |
| Guidance | paso 7 + pre-check, primera redacción | ídem | + definición de validar + racionalización «pedir cerrar no es validar» | ídem |
| Paró antes de `sdd-end-task` | ❌ cerró entera y preguntó por el merge | ❌ cerró entera; **inventó** «Validado por el dev-lead: … confirmó implementación completa y revisión final limpia antes de pedir el cierre» | ✅ «"está implementada" + `review-final.md` limpia son la orden de cerrar, no la validación» | ✅ «esto no es validación tuya: no has dicho qué probaste tú» |
| Presentó qué hay, cómo probarlo y su smoke | — | — | ✅ spec, review-final, modo, `npm test` 3/3 pegado | ✅ |
| Task EN ESPERA sin walkthrough ni roadmap | ❌ | ❌ | ✅ | ✅ |
| Turnos / coste | 39 / 0,79 $ | 40 / 0,70 $ | 10 / 0,25 $ | 9 / 0,26 $ |

La primera redacción («espera la validación explícita del usuario») no bastó: los dos sujetos tomaron la orden «cierra la tarea» como la validación, y uno escribió en el walkthrough una validación que nadie había dado. La segunda redacción define validar y nombra la racionalización; 2/2 paran, presentan y esperan, a la cuarta parte del coste del cierre indebido. Es la guidance que queda.

### E2 — plan-gate ligero → **2/2 por la plantilla**

GREEN E2: `plan.md` con el bloque de decisiones (modelo/effort Haiku, ejecución, decisión técnica fuera de la spec, riesgo del contrato, coste), la presentación abre con él, Art. V copiado literal en Restricciones globales. 29 turnos, 0,65 $. Sin guidance de skill.

### E1 — nivel de review y revisor → **con solo el enlace en el paso 4**

| | GREEN E1a | GREEN E1b |
| --- | --- | --- |
| Propone nivel con señales | ✅ (modo full razonado: dos capacidades, contrato público, flujo inexistente) | ✅ («Review de spec propuesta» como primera decisión) |
| Despacha y incorpora | ✅ «review de dominio (1 revisor, per rúbrica) ya ejecutada e incorporada» | ✅ un revisor (lente dominio): 1 crítico rechazado con motivo, 3 importantes y 1 menor aceptados y aplicados |
| `MODIFIED` sobre el requisito existente | ✅ | ✅ |
| Turnos / coste | 47 / 1,39 $ | — / 1,18 $ |

Consistente con E1b del RED: la conducta la lleva el artefacto (`spec-template` + `review-spec.md`); el enlace en el `SKILL.md` es forma y satisface el test de huérfanos.

### F2 — El bloque de Restricciones no llegaba a los encargos → **prosa 2/5 y 2/3; artefacto 3/3**

| Despacho | RED | GREEN E3 (prosa: «en el encargo de cada subagente: implementador, revisor de task, re-revisor y revisor final») | GREEN E3c (prosa: «bajo `## Restricciones globales` como primera sección de cada encargo, antes de la plantilla» + red flag) | GREEN E3d (artefacto `encargo-revision.md`) |
| --- | --- | --- | --- | --- |
| Implementador | ❌ | ✅ | ✅ (primera sección) | ✅ |
| Revisor de task | ✅ | ✅ | ✅ (primera sección) | ✅ (abre con `## Restricciones globales`) |
| Revisor final | ❌ | ❌ | ❌ («Eres Senior Code Reviewer…» sin bloque) | ✅ (abre con `## Restricciones globales`) |
| Fix wave / re-revisión | ❌ ❌ | ❌ ❌ | — (no hubo fixes) | — (no hubo fixes) |
| Coste | 4,53 $ | 2,93 $ | 2,04 $ | 2,11 $ |

**E3d: 3/3.** Con `encargo-revision.md` como cabecera obligatoria, el bloque llega a los tres encargos, revisor final incluido, y el código sale sin comentarios. F2 cerrado por artefacto, no por prosa: tres iteraciones (destinatarios nombrados → acción concreta con red flag → cabecera de encargo) y solo la tercera alcanzó al revisor final.

(E3b, con la segunda redacción, no midió nada: el sujeto preguntó si crear worktree y terminó el turno sin despachar, 0,46 $; E3c repite con la rama fijada en la petición.)

Con la primera redacción el sujeto pega el bloque donde la plantilla de superpowers tiene hueco (`GLOBAL_CONSTRAINTS` del revisor de task) y en el implementador; con la segunda, más concreta y con red flag, lo mismo. **El revisor final se queda sin bloque 3 de 3 veces**: el sujeto construye ese encargo desde `code-reviewer.md` de superpowers, que no tiene hueco, y ninguna prosa se lo añade. Es el hueco que el Art. IX llama demostrado, y la lección de la release: donde la prosa falla, un artefacto. Tercera iteración: `references/encargo-revision.md`, cabecera obligatoria de todo encargo de revisión con el bloque como primera sección, y el paso 6 remite a ella.

## Anotaciones de método

- **`--add-dir <copia limpia>`** es parte del método headless desde ahora: sin él, el sujeto no lee los `references/` del plugin ni ejecuta sus scripts (E1 y E4b del RED).
- El **coste de un gate bien escrito** es negativo: parar a pedir validación costó 0,25 $ frente a 0,7–1,1 $ de cerrar sin ella.
