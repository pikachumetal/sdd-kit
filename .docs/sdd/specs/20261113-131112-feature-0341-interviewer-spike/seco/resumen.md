# Pasada en seco — núcleo `control`

Un sujeto por escenario con `.temp/i/kit-control` (la `sdd-grilling` de la rama), para comprobar la carga del núcleo, el transcript y el precio de `pe` antes de los seis brazos. Fases `seco` y `seco2` (`pe` repetido sin la herramienta `Agent`).

| Sujeto | Fase | Cargó `sdd-grilling` | Coste | Nota |
| --- | --- | --- | --- | --- |
| `g1-1` | seco | sí | 0,17 $ | dos turnos, el segundo con el porqué |
| `g9-1` | seco | sí | 0,17 $ | `E4w` falla: ninguna llamada a `WebSearch` ni `WebFetch` (el fallo conocido del control) |
| `rq-1` | seco | sí | 0,17 $ | |
| `fp-1` | seco | sí | 0,29 $ | dos turnos, el segundo «mantengo lo que dije» |
| `pe-1` | seco | sí | 1,22 $ | 2 respuestas de la persona; tras ellas, la spec y dos rondas de revisores de la spec |
| `pe-1` | seco2 | no | 0,61 $ | sin `Agent`; 4 respuestas de la persona y el corte en «déjame pensarlo»; entrevistó desde `sdd-propose` sin cargar el núcleo |

Total de las dos fases: 6 sujetos, 2,63 $.

Lo que decide para la Task 3:

- **Carga desde explore**: `g1`, `g9` y `rq` cargan el núcleo; ningún escenario sale ya de la campaña.
- **Transcript**: la primera versión partía los turnos por `result` y en `pe` daba 6 turnos para 3 reales, porque los avisos de los revisores en segundo plano reabren la sesión; ahora parte por el `system:init` que sigue a un `result`, marca el aviso aparte y quita las lecturas internas de los subagentes (ledger, ruling de la Task 2).
- **`pe`**: va sin `Agent` y cuesta 0,61 $; queda en n = 5 (la parada era 1,5 $). Previsión revisada de la campaña: ~66 $, dentro de los 75 $.
- **Carga en `pe`**: el sujeto sin `Agent` no cargó el núcleo; la regla de relanzar una vez de la decisión 10 lo cubre, y la tabla dará la tasa de carga de `pe` por brazo.
