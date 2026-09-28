# RED — el carril patch acepta ajustes visuales (feature 0098)

Baseline con el kit de la rama en `2e6bc37` (apertura de la 0098, sin guía nueva), sujetos Sonnet con `SUPERPOWERS_DIR` (superpowers 6.4.2, sin el `CLAUDE.md` del dev-lead) sobre el molde `ventas`: dos fichas estáticas (`pages/pedido-detalle.html`, `pages/albaran-detalle.html`) con Guardar, Cancelar y Borrar en la cabecera, `styles/ficha.css`, `app.js` y `.docs/sdd/` en `delegate`. Molde, lanzador y salidas en [`red/`](../.docs/sdd/specs/20260928-210002-feature-0098-visual-patch-lane/red/). Tope por sujeto: 25 turnos y 12 min en las puertas, 40 en los recorridos. Ninguno llegó al tope.

## Puertas (Task 1)

| Sujeto | Petición | Turnos | $ | Puerta | Cita | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| `v1-1` | «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas…; es solo maquetación.» (hook) | 5 | 0,16 | ninguna: edición directa | «Lo he hecho directamente, sin abrir un patch del kit SDD, porque es solo maquetación y no cambia el comportamiento» · «No he abierto las páginas en el navegador» | ❌ sin carril y sin verificación visual |
| `v1-2` | ídem | 5 | 0,10 | ninguna: edición directa | «No he abierto las páginas en un navegador, así que no he visto el resultado» | ❌ ídem |
| `v2-1` | `/sdd-start-feature` + la de v1 | 7 | 0,28 | feature lite | «Carril: feature, no patch. No es un bug, y lo que pides es un cambio de maquetación con criterio de diseño» | ❌ el fallo del ticket 6298 |
| `v2-2` | ídem | 5 | 0,19 | feature lite | «es una feature, no un patch. No es un bug… Que sea solo maquetación no la saca de SDD» | ❌ ídem |
| `c1-1` | «Oculta Borrar si el pedido está facturado y pásalo a la derecha, en las dos fichas.» (hook) | 7 | 0,26 | `sdd-start-feature` | «Cambia el comportamiento de una capacidad existente… hay que interpretar requisitos» | ✅ control |
| `c1-2` | ídem | 8 | 0,21 | `sdd-start-feature` | «en el código no existe ningún estado «facturado»» | ✅ control |
| `c2-1` | «Cambia «Guardar» por «Guardar y cerrar» y ponlo a la derecha, en las dos fichas.» (hook) | 9 | 0,13 | ninguna: edición directa | cambia el texto en las dos fichas **y edita `capabilities/order-sheets.md`** sin skill; «No he abierto las páginas en el navegador» | ❌ un texto y una capacidad por la edición directa |
| `c2-2` | ídem | 10 | 0,13 | `sdd-start-patch`, que propone edición directa | «Lo trato como edición directa, sin patch ni feature, porque no cambia ningún comportamiento» | ❌ ídem, pendiente de respuesta |

Total de las puertas: 8 sujetos, 1,44 $.

### Lo que dice el baseline

1. **El ajuste visual no tiene puerta, y la que encuentra depende de por dónde entra.** Por el hook, la fila «Una edición sin comportamiento… → directa, sin skill» de `using-sdd` lo absorbe (2/2). Por `/sdd-start-feature`, el paso 2 solo manda al patch «bug pequeño y determinista», y el cambio acaba en feature lite (2/2). El patch no aparece en ninguno de los cuatro.
2. **La edición directa no mira el navegador** (4/4 en v1 y c2-1): lo que el ticket 6298 pedía conservar, la captura enseñada, se pierde al abaratar.
3. **La puerta trasera ya existe, y es la edición directa, no el patch.** Un cambio de texto visible pasa como «sin comportamiento» (2/2), y uno de los dos reescribe de paso una capacidad. La lógica en la plantilla (c1) sí la ve (2/2): «facturado» obliga a interpretar.

La guía de la Task 1 tiene que hacer tres cosas:

- Dar al ajuste visual su puerta en `using-sdd` y en el paso 2, con el predicado.
- Sacarlo de la edición directa: mover o reestilar no es un formato.
- Decir que cambiar un texto visible, que no es corregir su ortografía, no es una edición sin comportamiento.

## Recorrido y cierre (Task 2)

Kit en `d6b4255`, con la guía de las puertas (Task 1) y sin la del recorrido.

| Sujeto | Petición | Turnos | $ | Resultado | Veredicto |
| --- | --- | --- | --- | --- | --- |
| `f1-1` | `/sdd-start-patch` + la de v1 | 14 | 0,28 | sin `systematic-debugging`; §2 «Ajuste solo de presentación, sin causa raíz que investigar»; capturas en `%TEMP%\shots\`, y §4 dice «Falta la mirada de quien lo pidió» | ✅ intención · ✅ captura fuera de git con su ruta en §4 |
| `f1-2` | ídem | 20 | 0,35 | sin `systematic-debugging`; §2 «No es un fallo, es un cambio de layout»; **4 PNG commiteados** en `.docs/sdd/specs/<patch>/capturas/` | ✅ intención · ❌ captura en git |
| `f2-1-molde`, `f2-2-molde` | `/sdd-end-patch cierra el patch`, con la validación ya escrita en §4 | 6 y 4 | 0,16 y 0,15 | los dos paran en el paso 0: la frase escrita no es la del usuario | molde inválido: no llegan al changelog |
| `f2-1` | `/sdd-end-patch Validado: lo he probado y funciona. He abierto las dos fichas en Chromium…` | 10 | 0,20 | changelog `### Fixed`, merge a `develop` | ❌ `Fixed` |
| `f2-2` | ídem | 6 | 0,17 | changelog `### Fixed`, merge a `develop` | ❌ `Fixed` |

Total del recorrido: 6 sujetos, 1,31 $, con los dos del molde inválido. La campaña va en 22 sujetos y 5,11 $.

### Lo que dice el baseline

1. **La intención ya sale sola** con la guía de las puertas (2/2): el Overview y el árbol dicen «se verifica con una captura en lugar de con la causa raíz», y ningún sujeto invoca `systematic-debugging`. El §2 sigue titulado «Causa raíz», pero el contenido es la intención.
2. **La captura no tiene sitio fijo** (1/2 bien): uno la deja en `%TEMP%` con su ruta en §4; el otro la commitea en la carpeta del patch.
3. **El cierre escribe `Fixed` a una maquetación** (2/2).

La guía de la Task 2 queda en tres piezas. En el paso 4, dónde va la captura (fuera de git, su ruta en §4) y quién la enseña (`sdd-end-patch`, paso 0). En el paso 3 del cierre, `Changed`. En el paso 1, la variante escrita con su salida a feature, para que la conducta de (1) no dependa del Overview.

## Arreglos de la revisión final

Kit en `96173bf`, con las dos tasks. Son tres escenarios nuevos, con un sujeto cada uno, para los Important de la revisión final de rama (techo subido a 36 sujetos por el dev-lead).

| Sujeto | Petición | Turnos | $ | Resultado | Veredicto |
| --- | --- | --- | --- | --- | --- |
| `b1-1` | `/sdd-start-patch En las dos fichas el botón Guardar no se lee: sale el texto blanco sobre fondo blanco.` (bug de CSS) | 15 | 0,29 | «Es solo CSS y el fix es determinista, así que sigo con el patch»; causa raíz con `git show`, **sin `systematic-debugging`** | ❌ pierde la skill en un bug de CSS (I1, por la rama de determinismo, no por la visual) |
| `h1-1` | la de v1, con `onclick="guardar()"` en los botones (hook) | 19 | 0,33 | `sdd-start-patch`, §2 con la intención, capturas fuera de git | ✅ la puerta compacta no manda a feature mover un botón con handler (I2 no se reproduce) |
| `t1-1` | «Corrige la errata «Guadar» del botón de las dos fichas.» (hook) | 4 | 0,07 | edición directa: «Es una errata sin cambio de comportamiento» | ✅ la fila «texto visible, feature» no se come la errata (I4 no se reproduce) |

Con el Art. I en la mano:

- **I1 lleva guía.** La frase del bug de CSS nombra `systematic-debugging`.
- **I4 no la lleva.** El baseline sale limpio y la conducta viene de la fila «un typo», que no es una fuente incidental.
- **I2 queda por la letra de la spec** (decisiones 1 y 6: el predicado entero, «sin añadir, quitar ni cambiar»), no por el RED.
