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

## Recorrido y cierre (Task 2)

Guía:

- `sdd-start-patch`: en el paso 1, la variante de la intención en una frase, sin `systematic-debugging` y con salida a feature. En los pasos 3 y 4, §2 con la intención y la captura por pantalla en un navegador real, fuera de git y con su ruta en §4. Un red flag nuevo.
- `sdd-end-patch`: el paso 0 enseña la ruta de cada captura, y el paso 3 usa `Changed` en un ajuste visual.
- `patch-template.md`: §2 «Causa raíz (o intención, en un ajuste visual)» y una fila de captura en §4.

El kit de esta tanda se copió antes de corregir en `sdd-start-patch` la cita de la evidencia del RED («1 de 2 sujetos commiteó las capturas…»). Es solo el recuento de la cita, sin cambio de conducta, así que no lleva sujeto de control.

| Sujeto | Turnos | $ | Resultado | Veredicto (RED) |
| --- | --- | --- | --- | --- |
| `f1-1` | 17 | 0,30 | §2 con la intención; sin `systematic-debugging`; dos capturas en `%TEMP%\tmp.…\`, con su ruta en §4 y «fuera de git»; «te pedirá la validación, con las capturas a la vista» | ✅ (✅ intención · ✅ captura) |
| `f1-2` | 14 | 0,28 | §2 «Intención»; sin `systematic-debugging`; capturas en `%TEMP%\patch-0012\`, «enseñada en la validación»; 0 PNG en git | ✅ (✅ · ❌ captura en git) |
| `f2-1` | 8 | 0,19 | changelog `### Changed`; merge a `develop` | ✅ (❌ `Fixed`) |
| `f2-2` | 7 | 0,19 | changelog `### Changed`; merge a `develop` | ✅ (❌ `Fixed`) |
| `k1-1` | 17 | 0,29 | `superpowers:systematic-debugging`; §2 con la causa raíz (redondeo antes del IVA); sin captura; no llega al cierre | ✅ control |
| `k1-2` | 22 | 0,37 | `superpowers:systematic-debugging`; reproduce en Chromium, §2 con la causa raíz; sin captura; no llega al cierre | ✅ control |

Total del recorrido: 6 sujetos, 1,63 $. **Campaña completa: 28 sujetos y 6,74 $**, frente a la previsión de 26 y ~16 $ y el techo de 32 y 22 $. Ningún sujeto llegó al tope de turnos ni de reloj.

### Lo que dice el GREEN

1. **La captura tiene sitio** (2/2): fuera de git, con su ruta en §4, y ningún PNG en la rama.
2. **El cierre la registra como `Changed`** (2/2).
3. **El bug determinista sigue su camino** (k1 2/2): causa raíz con `systematic-debugging` y sin captura. La variante visual no se come el paso 1 normal. El `Fixed` de k1 no se observa, porque ninguno de los dos llegó al cierre: el texto del paso 3 lo conserva como categoría por defecto.
4. **La subida a feature a mitad de patch** (el AND del segundo requisito) no tiene escenario: queda para la revisión final de rama.
