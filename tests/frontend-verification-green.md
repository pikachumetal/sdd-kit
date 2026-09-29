# GREEN — verificación de frontend (feature 0099)

Mismos escenarios, molde y lanzador que el [RED](frontend-verification-red.md), con el kit del working tree de cada task (copia de `skills/`, `.claude-plugin/` y `hooks/`). Salidas en [`green/`](../.docs/sdd/specs/20260929-073733-feature-0099-frontend-verification/green/).

**Cambio de molde entre RED y GREEN**: `/dev/impersonate` acepta `next=<ruta>` y el `§Frontend` del molde declara la URL de entrada `/dev/impersonate?user=demo@example.test&next={path}`. Sale del RED de `k1`: el detector no lleva sesión. En el RED, `§Frontend` no declaraba esa URL, así que ningún sujeto podía usarla. Solo afecta a `k1`.

## Task 1 — la referencia, `§Frontend` y la task full (`q1`, `a1`)

| Sujeto | Coste | Duración | Conducta | Veredicto (RED) |
| --- | --- | --- | --- | --- |
| `q1-1` | 0,73 $ | 233 s | Pasa `impeccable@4.1.0` en `1280x800` y `390x844` y ve `cramped-padding` en `.card`. Lo arregla en un commit propio (`padding: 16px`), que revisa un subagente. Deja abierto un `low-contrast` del botón «Enviar» como «ya estaba antes y la task no toca `button`», un uso válido del contraejemplo. Capturas fuera de git; el servidor, parado por PID y con el puerto libre | ✅ (❌ 0/2 detector, 1/2 cerraba en rojo) |
| `q1-2` | 0,94 $ | 342 s | Detector en los dos viewports, ve `cramped-padding`, lo arregla en un commit propio con revisión y junta el rango de la task. 8 capturas fuera de git, sin borrar; el servidor, parado y con el puerto libre | ✅ |
| `a1-1` | 0,37 $ | 79 s | **No pide ningún enlace** (`login-requests.log` vacío): «La regla del kit es no intentar entrar, para no gastar ese cupo». Lo visual queda «no probado» y propone el Acceso (`/dev/impersonate` y `storageState`). Levanta una copia temporal con el login desactivado solo para leer el HTML, y no la cuenta como verificación | ✅ (❌ 2/2 gastaban enlaces) |
| `a1-2` | 0,31 $ | 58 s | No pide enlaces; «no probado: falta el acceso en §Frontend» literal, y la propuesta en la presentación | ✅ |

Controles: el navegador real se abre antes de cerrar (`q1` 2/2), las capturas quedan fuera de git y sin borrar (`q1` 2/2), y lo arrancado se para por PID o puerto, con el puerto libre después (`q1` 2/2, `a1-1`). Coste: `q1` pasa de 95–233 s a 233–342 s, porque ahora arregla el hallazgo y lo revisa. Es el trabajo que en el RED se quedaba sin hacer.

Subtotal: 4 sujetos, 2,35 $. Campaña: 15 sujetos, 6,81 $.

## Task 2 — lite y patch visual cargan la referencia (`k1`, `n1`)

| Sujeto | Coste | Duración | Conducta | Veredicto (RED) |
| --- | --- | --- | --- | --- |
| `k1-1` | 0,37 $ | 87 s | Verifica sobre la aplicación del usuario (4621), sin arrancar otra ni build. Pasa el detector por la URL de entrada `/dev/impersonate?…&next=/pedidos` en los dos viewports: código 0, sin hallazgos. Cuatro capturas por viewport y tema, sin borrar. No mide estilos computados («el criterio no fija ningún valor numérico»). No guarda la sesión en `.auth/state.json` porque `git check-ignore` dice que no está ignorada (el `.gitignore` del molde no la lleva): la regla del Acceso, cumplida | ✅ (RED: el detector escaneaba `/login`, «no probado») |
| `k1-2` | 0,75 $ | 134 s | Igual: detector por la URL de entrada en los dos viewports, sobre el entorno del usuario, sin build ni suite nueva | ✅ |
| `n1-1` | 0,40 $ | 98 s | Capturas del antes y del después de la ficha y del listado en los dos viewports. §4 con la fila del detector: «composición no medida: `tech-stack.md` no declara detector en §Frontend». Dice que no pudo abrir las capturas | ✅ (❌ 0/2 antes y aviso) |
| `n1-2` | 0,43 $ | 100 s | Antes y después en los dos viewports y los dos temas, el aviso literal y la medida del `font-size` (el criterio fija 14px) | ✅ |

Controles: el coste de un cambio de CSS de una línea sigue en minutos. Los sujetos enteros tardan 87–134 s (`k1`) y 98–100 s (`n1`), frente a 70–95 s en el RED, con el detector y la captura del antes añadidos. No hay build ni suite nueva (4/4), y las capturas quedan fuera de git y sin borrar (4/4). `n1` usa la intención en una frase (2/2), y el cierre en `Changed` no se llega a medir porque el sujeto para en la validación.

Subtotal: 4 sujetos, 1,95 $. Campaña: 19 sujetos, 8,76 $.

## Task 3 — la spec propone `§Frontend`, las init la preguntan (`s1`, `i1`)

| Sujeto | Coste | Duración | Conducta | Veredicto (RED) |
| --- | --- | --- | --- | --- |
| `s1-1` | 0,44 $ | 94 s | La decisión 9 de la spec es la «Propuesta de `§Frontend`», con detector impeccable, Playwright y el Acceso leído del código (`/dev/impersonate?next={path}`, `config.login = impersonate`), para escribirla al aprobar. Sin parada nueva: para en el gate | ✅ (❌ 0/2) |
| `s1-2` | 0,49 $ | 103 s | Igual, en la decisión 11, y añade la ruta de la sesión a `.gitignore` en el Scope | ✅ |
| `i1-1` | 0,36 $ | 79 s | Pregunta la 21, «verificación de lo que se ve», con detector, runner y entrada recomendados. `tech-stack.md` sale con `## Frontend` pendiente de la respuesta | ✅ (❌ 0/1) |

Subtotal: 3 sujetos, 1,29 $.

## Resumen de la campaña

22 sujetos (11 RED y 11 GREEN) y 10,05 $, dentro de la previsión de 26 sujetos y ~17 $, y del techo de 30 o 22 $. Ninguno llegó al tope de turnos ni de reloj. La partida de controles de la pasada de fix (4 sujetos) sigue libre.

## Pasada de fix de la revisión final

La revisión final (Opus, effort high) dejó 4 Important. Los dos primeros son contradicciones del paso 6 con la referencia: «no probado» limitado a dos causas, y el contraejemplo de «es intencional» sin «el rasgo de la pantalla de referencia». Se arreglan con RED→GREEN en el Pester, bloque `Arreglos de la revisión final`: 3 fallos → 23/23 en verde. El cuarto es que el molde no ignoraba `.auth/`, y va al `.gitignore` del molde. El tercero, la URL de entrada del detector frente al THEN «entra una vez y reutiliza», es un desvío de la spec y lo decide el dev-lead.

| Sujeto | Coste | Duración | Conducta |
| --- | --- | --- | --- |
| `q1-3` (control del paso 6) | 0,56 $ | 316 s | Detector en los dos viewports, `cramped-padding` cazado y arreglado ✅ |
| `k1-3` | 0,80 $ | 177 s | Detector por la URL de entrada, sobre el entorno del usuario. **No guarda la sesión**: abre un contexto nuevo por ejecución y entra por `/dev/impersonate` cada vez |
| `k1-4` | 0,31 $ | 77 s | Igual: entra por la URL de entrada en cada ejecución, sin `storageState` |

Con `.auth/` ya ignorada, 0 de 2 sujetos reutilizaron la sesión: con una página de desarrollo, entrar cada vez no gasta nada. El THEN «reutiliza la sesión guardada» sigue sin evidencia positiva y entra en la enmienda que decide el dev-lead.

Campaña total: 25 sujetos y 11,71 $, con techo de 30 o 22 $.
