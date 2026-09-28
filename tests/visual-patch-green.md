# GREEN — el carril patch acepta ajustes visuales (feature 0098)

Mismos escenarios, molde y lanzador que el [RED](visual-patch-red.md), con el kit del working tree tras la guía de cada task. Salidas en [`green/out/`](../.docs/sdd/specs/20260928-210002-feature-0098-visual-patch-lane/green/out/).

## Puertas (Task 1)

Guía:

- `using-sdd`: la fila del patch admite «un ajuste solo de presentación», con el predicado. La fila de edición directa añade «Mover lo que se ve es patch; cambiar un texto visible, feature». La tabla de racionalizaciones gana «Solo toco la plantilla: edición directa».
- `sdd-start-feature` paso 2: la salida al patch, con el predicado entero, el contraejemplo del `@if` y «es maquetación con criterio de diseño no lo hace feature».
- `sdd-start-patch`: la `description`, el Overview, el diamante «¿Solo presentación (predicado)?» en el árbol y el párrafo del predicado.

| Sujeto | Turnos | $ | Puerta | Cita | Veredicto (RED) |
| --- | --- | --- | --- | --- | --- |
| `v1-1` | 20 | 0,33 | `sdd-start-patch` | patch 0012, mide en Chromium («x 821,6 px»), «Falta cerrarlo con `sdd-end-patch`, que pide tu validación» | ✅ (❌ edición directa) |
| `v1-2` | 21 | 0,34 | `sdd-start-patch` → `sdd-end-patch` | captura y coordenadas; se para en el paso 0 con las tres opciones de validación | ✅ (❌) |
| `v2-1` | 18 | 0,46 | `sdd-start-patch` | capturas antes y después en `shots/`, fuera de git | ✅ (❌ feature lite) |
| `v2-2` | 19 | 0,49 | `sdd-start-patch` | «medí las dos fichas en Chromium con Playwright… Las capturas están en… fuera de git» | ✅ (❌) |
| `c1-1` | 8 | 0,19 | `sdd-start-feature` | «depende del estado. Eso es lógica, y la capacidad `order-sheets` … cambia» | ✅ control (✅) |
| `c1-2` | 6 | 0,17 | `sdd-start-feature` | «Mover el botón a la derecha sí es solo presentación, pero va en la misma feature» | ✅ control (✅) |
| `c2-1` | 6 | 0,20 | `sdd-start-feature` | feature lite; el delta toca `order-sheets` | ✅ (❌ edición directa) |
| `c2-2` | 6 | 0,18 | `sdd-start-feature` | «tu petición deja abierto qué hace «Guardar y cerrar»» | ✅ (❌) |

Total de las puertas: 8 sujetos, 2,36 $; la campaña va en 16 sujetos y 3,80 $. Ningún sujeto llegó al tope de turnos ni de reloj.

### Lo que dice el GREEN

1. **El ajuste visual entra por el patch por las dos puertas** (4/4). Por el hook, la fila nueva gana a la de edición directa. Por `/sdd-start-feature`, el paso 2 lo manda al patch.
2. **La puerta trasera se cierra** (c2 de 0/2 a 2/2): el texto visible va a feature y el `@if` sigue yendo (c1 2/2, control). Ninguno de los cuatro contra-escenarios entró por el patch.
3. **Con solo la guía de las puertas, los sujetos ya miran el navegador** (4/4 con Playwright y medidas; 2/4 dejan la captura en el run, fuera de git. `v1-2` dice haberla generado, pero no está ni en el molde ni en el run, y `v1-1` solo mide). Ninguno invoca `systematic-debugging`, y el §2 de `patch.md` ya dice «No es un fallo: es un ajuste de presentación» bajo el título «Causa raíz». Lo que la Task 2 tiene que medir es el resto del recorrido: qué ponen en §2 de `patch.md`, si invocan `systematic-debugging` y cómo cierra el changelog.
4. **Ruido del molde, no del kit**: 3 de 4 sujetos de patch recibieron de `Get-NextSddId.ps1` el 0011, que el molde tiene en la tabla de patches sin su carpeta en `specs/`. El script solo lee las filas de la tabla de features y las carpetas. En un proyecto real, el patch 0011 tendría su carpeta. Se anota para el walkthrough.
