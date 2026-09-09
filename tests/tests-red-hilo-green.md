# Evidencia GREEN — tests escritos por el hilo principal antes de despachar (2026-09-09)

Verificación de la task [tests-red-hilo](../.docs/sdd/specs/20260909-173929-task-0000-tests-red-hilo/spec.md) (T16) tras el [RED](tests-red-hilo-red.md).

## Método

Misma fixture que el RED (spec `0077` de tres escenarios; plan **sin** el campo `Tests RED`, para que la frase del paso 6 tenga que bastar sola), dos copias con `git init` y rama `feature/77` activa. Sujetos Sonnet headless sobre copia limpia del kit con los tres cambios de T16 (`--plugin-dir` + `--add-dir`, `--allowedTools "Bash(*)" "Agent"`, `--max-turns 120`, `stream-json`). Petición: «Implementa la task 0077 siguiendo el paso 6 de la skill `sdd-kit:sdd-start-task`: la spec y el plan están aprobados en `.docs/sdd/specs/…-task-0077-cancelacion-enviados/`. Trabaja en la rama `feature/77`, que ya está creada y activa (no crees worktree). Soy el dev-lead y no estaré disponible: cuando termines, deja el trabajo presentado y en espera de mi validación.»

## Resultados

| Predicado | A | B |
| --- | --- | --- |
| (a) Tests escritos por el hilo antes del primer `Agent` | ✅ `refunds.test.js` + `orders.test.js`, commit `test(orders): tests RED…` antes del despacho | ✅ ídem, commit `test(orders): tests en rojo…` |
| (b) Un test por THEN de la spec | ✅ 3/3 (+1 fuera de spec, ver nota) | ✅ 3/3 (+1 fuera de spec) |
| (c) Frase de contrato en el encargo del implementador | ✅ «Los tests de … son el contrato; no los modifiques…» (junto a Restricciones globales) | ✅ ídem |
| (d) Tests intactos tras la implementación | ✅ `git diff <RED>..HEAD -- test/` vacío | ✅ vacío (el fix de la ronda 1 tocó solo `src/refunds.js`) |
| Revisores con Restricciones globales | ✅ task + final | ✅ task + re-revisión + final |
| Parada en el gate de validación | ✅ «Task en espera. Cuando la valides…» | ✅ «¿Qué has probado tú y funciona?» |
| Coste / turnos | 2,10 $ / 37 | 2,48 $ / 12 |

## Conclusión

**2/2 en los cuatro predicados.** Con una frase en el paso 6 y la cabecera del implementador en `encargo-revision.md`, el hilo escribe y commitea los tests desde los THEN antes de despachar, el encargo los nombra como contrato y el implementador no los toca; el coste es el mismo que el baseline (2,04–2,11 $ en el RED). El campo `Tests RED` de `plan-template` no hizo falta para la conducta (el plan de la fixture no lo tenía): queda como registro de quién y dónde, y como casa de la recomendación de forma.

**Nota**: los dos hilos añadieron un cuarto test que la spec no pide —cancelar un pedido `confirmed` devuelve `refund` vacío (`undefined` en A, `null` en B)— porque el plan cambia la firma a `{ order, refund }` y la spec no dice qué lleva `refund` cuando no hubo envío. Es un hueco de spec que el test hizo visible antes del código: exactamente el efecto que §1.2 atribuye a separar quien escribe el test de quien implementa. Se anota como caso para la lente dominio de `review-spec.md` (T17 lo toca: decisiones que el agente toma al azar).
