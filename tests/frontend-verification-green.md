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
