# Research — ¿sustituye `claude plugin eval` a `tests/headless/battery.sh`?

Pregunta de la decisión 19 de la spec. Spike de la task 14, 2026-10-08, Claude Code con `claude plugin eval` (sin versión en la ayuda) y superpowers 6.4.2.

## Qué se midió

Tres escenarios de la batería de `using-sdd` (`tests/batteries/using-sdd/battery.md`), con el molde `salas`, n = 1 y Sonnet en los dos arneses, sobre la misma copia del kit (`HEAD` de la rama tras la task 11):

| Id | Petición | Esperado |
| --- | --- | --- |
| f1 | Mete un filtro por sala en el comando libres. | `sdd-kit:sdd-start-feature` |
| p1 | Si cancelo una reserva que no existe me dice «cancelada» igual. | `sdd-kit:sdd-start-patch` |
| c1 | Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo. | `sdd-kit:sdd-consult` |

- **`plugin eval`**: un caso por escenario en `evals/<id>/` (`prompt.md` con `runs: 1`, `model: sonnet`, `max_turns: 8`, `plugins: ["../..", "../../sp"]`; `case.yaml` con `scaffold_script` que copia el molde y escribe el marcador; grader `tool_used` con `tool: Skill` e `input_match` del nombre de la skill). Orden: `claude plugin eval . --ablation none --scaffold --trust-plugin --runs 1 --model sonnet --max-cost-usd 4 --no-publish --json`.
- **`battery.sh`**: `tests/headless/run.sh` con el `subject.sh` de la batería, `SCENARIOS="f1 p1 c1"`, `SUPERPOWERS_DIR` y `MAX_TURNS=8`. La salida de los sujetos está en `spike/out/`.

## Resultado

| Arnés | f1 | p1 | c1 | Coste | Reloj |
| --- | --- | --- | --- | --- | --- |
| `plugin eval` | pasa | pasa | pasa | 0,45 $ (suite, a precio de lista, sin desglose por run) | 286 s, en serie (`-j 1` por defecto) |
| `battery.sh` | `sdd-start-feature` | `sdd-start-patch` | `sdd-consult` | 0,80 $ (0,28 + 0,33 + 0,19) | 57 s, en paralelo |

Los dos arneses aciertan las tres rutas. El veredicto coincide.

## Lo que `plugin eval` no cubre hoy

1. **No mide la primera skill invocada.** El grader `tool_used` pasa si la skill aparece al menos una vez (`min`/`max` cuentan llamadas); `tool_order` compara la primera llamada de cada herramienta, no la primera `Skill`. La batería de `using-sdd` mide justo eso: qué skill entra **primero** (un sujeto que abre `brainstorming` y después `sdd-start-feature` falla el escenario f2). Con `plugin eval`, ese fallo pasaría.
2. **Un plugin dependiente solo entra por ruta relativa.** `plugins` admite rutas relativas al caso; para cargar superpowers hubo que copiarlo dentro del kit (`sp/`). En Windows, la caché de plugins (`C:`) y el repo (`D:`) no admiten ruta relativa.
3. **El scaffold no recibe la ruta del caso.** `scaffold_script` corre en el workspace vacío con `PATH`, `HOME`, `TMPDIR` y `TERM`; el molde se copió con una ruta absoluta escrita en el script.
4. **El coste solo sale agregado.** `costUsd` es de toda la suite; la previsión por sujeto del Art. I necesita el coste por run.

## Lo que aporta

- Un brazo sin plugin (`--ablation with-without`) que mide el efecto del kit frente a no tenerlo, que la batería no hace.
- Tope de coste nativo (`--max-cost-usd`), informe HTML y salida JSON sin bash: corre igual en Windows y fuera de él.
- Graders deterministas gratis (`tool_used`, `regex`, `file_exists`) y de juez (`llm`) para mirar el texto, que hoy la batería lee a mano en `texts.txt`.

## Recomendación

No sustituir `battery.sh` en las baterías de enrutado: sin «primera skill» deja de detectar el fallo que esas baterías vigilan. Usar `plugin eval` para el **humo** de todas las skills (Art. I: 1-2 escenarios, n = 1), donde basta con que la skill se dispare y haga su paso: es más barato, no depende de Git Bash y da el brazo sin plugin. La 0152, que monta el humo de todas las skills, es quien lo adopta; vuelve a mirar el grader si una versión nueva de Claude Code añade «primera llamada» o cobertura por orden de `Skill`, y entonces la batería de enrutado puede pasar también.

Coste del spike: 0,45 $ + 0,80 $ = 1,25 $ (previsión de la spec, ~4 $).
