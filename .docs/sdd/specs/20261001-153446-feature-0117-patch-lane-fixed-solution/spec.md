---
id: 20261001-153446-feature-0117-patch-lane-fixed-solution
feature: 0117
title: Carril patch — lo decide quién fijó la solución
mode: full
status: approved
created: 2026-10-01
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-01
---

# Spec — Carril patch: lo decide quién fijó la solución

## Capacidades

- Modificadas: `routing` — la entrada por el carril patch pasa a decidirla quién fijó la solución; el patch visual admite una retirada; un patch que no es un fallo no se rige por la causa raíz
- Modificadas: `feature-flow` — una migración solo de datos no descarta el modo lite

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` / `REMOVED` (cuatro y uno de `routing`) · tamaño: ~150 líneas de texto en 8 ficheros
- Mínimo razonable: ninguna — deja sin una segunda lectura que los THEN nuevos de `routing` no contradigan los de la 0098 que siguen vivos; lo cubren el repaso de coherencia (que ya cambió el `MODIFIED` de «lógica o textos» por un `REMOVED` y un `ADDED`, y añadió el `MODIFIED` del changelog del patch visual) y los controles c1, c2 y k1 del GREEN

1. **Tres clases de patch, por quién fija la solución.** Fallo → la fija la causa raíz (flujo de hoy). Ajuste visual o retirada → la fija la petición. Petición cerrada (cambia comportamiento) → la fija el ticket o el dev-lead. Si la tiene que fijar el agente, es feature — criterio de la fila 0117, decidido en la [propuesta 0119](../20260929-230441-proposal-0119-lighter-kit/proposal.md).
2. **Qué es «fijada», observable**: la petición dice qué cambia en lo que el usuario ve o puede hacer, y al agente solo le queda decidir lo que no se ve. Elegir entre propuestas ya escritas (en el ticket o en la fila) con preguntas cerradas al dev-lead sigue siendo patch, como en el patch 0125; proponer una opción que nadie escribió, no. Contraejemplo escrito en la skill (Art. II): «avisa cuando el total pase de 1.000 €» deja al agente el texto, el sitio y el umbral, y es feature aunque «sea pequeño».
3. **La guarda de la puerta trasera es la lista `Decisiones`** de `patch.md` §3, con autor en cada línea (`ticket`, `dev-lead` o `sin el dev-lead`). Una decisión de lo que el usuario ve o puede hacer con autor `sin el dev-lead` saca el patch del carril: para y pasa a feature. Es también la nueva cláusula de escalada de `sdd-end-patch`, que hoy cuenta módulos.
4. **Freno de tamaño, solo para extremos**: más de 10 ficheros de código o más de 300 líneas cambiadas (`git diff --numstat`, sin tests ni docs) → para y pregunta al dev-lead si sigue como patch o pasa a feature. No pasa solo. Valores míos: el 6336 (6 ficheros, ~60 líneas) y el 6300 caben con holgura.
5. **⚠ Revierte una regla de la 0098** (`REMOVED` de «Un cambio con lógica o textos no entra por el patch»): un texto visible o un `@if` cuya forma literal da la petición («Cambia "Guardar" por "Guardar y cerrar"») pasa a ser patch (petición cerrada), no feature; «Oculta Borrar si está facturado» sigue siendo feature, porque de dónde sale «facturado» lo decidiría el agente. Es la consecuencia directa del criterio de la fila. El predicado visual de hoy queda como el patch que se verifica con captura y sin test. Si prefieres conservar «texto visible → feature», es una excepción al criterio y la escribo como tal.
6. **Flujo de la petición cerrada**: §2 lleva «Solución fijada» con la frase literal y su autor, no causa raíz y sin `systematic-debugging`. En lugar de reproducir un fallo, el paso 1 comprueba que lo que la petición da por existente existe (el destino, el elemento, la ruta); si no, STOP como hoy con el fallo no reproducido. Hay test RED→GREEN del comportamiento pedido si el proyecto tiene tests. Changelog `Added` o `Changed`, nunca `Fixed`. Tipo de commit: `fix` solo para un fallo; el resto, el que la convención del proyecto da a un cambio.
7. **Retirada en el patch visual**: quita elementos visibles y lo que queda muerto por quitarlos (manejadores, estado, textos y claves de i18n que nadie más usa, también una migración solo de datos que los da de baja), sin añadir nada. `patch.md` lista lo retirado y, si se pierde algo que el usuario podía hacer, lo dice en una línea y lleva el delta de la capacidad. Changelog `Removed`. Se verifica con las capturas de hoy y con una búsqueda de cada símbolo retirado sin otros usos.
8. **Lite**: la condición «no toca schema de datos ni exige migración» pasa a «no cambia el schema de datos»; una migración solo de datos, idempotente y reversible, no lo descarta, y la spec la nombra.
9. **`using-sdd` y el paso 2 de `sdd-start-feature`** se alinean con el árbol: la fila del patch dice «un fallo, un ajuste o retirada de presentación, o un cambio cuya solución ya fijan el ticket o el dev-lead»; la de feature, «hay que decidir cómo es».
10. **Sin capacidad nueva**: los requisitos van a `routing`, donde ya viven el patch visual y el fallo no reproducido, y a `feature-flow` el de lite.
11. **Fuera de la skill, la guía de uso** (`.docs/workflow/usage-guide.md` §3) se reescribe con el criterio nuevo: es doc del repo, sin RED.
12. **RED previo hecho** (tabla en «Evidencia del RED»): la puerta trasera no se abre hoy (b1 y b2, 4 de 4 a feature) y queda como control de no regresión del GREEN; la retirada (r1, 2 de 2) y el cambio con la solución fijada, por el hook y con `/sdd-start-patch` (p1 4 de 4, p2 2 de 2), van a feature, que es el fallo que corrige el criterio. Lo estructural va con fichero y línea.
13. **Previsión de la campaña** (la misma de antes del RED, aprobada por ti): techo 15 $ y ~3 h para RED + GREEN, 40 sujetos como máximo. El RED gastó 2,77 $ en 14 sujetos. GREEN previsto: ~22 sujetos Sonnet, ~6 $ — los escenarios del RED, la petición cerrada con `/sdd-start-patch` recorrida hasta el commit, lite con migración de datos, la retirada recorrida, un cierre con decisiones y deuda parcial, y como control los c1, c2 y k1 de la 0098 (c2 cambia de veredicto por la decisión 5).
14. **El molde `ventas` de la 0098 se copia a esta spec** (`red/mold.sh`) con la versión al día (2.2.0) para que el aviso de migración pendiente no se cruce, y un `index.html` en los escenarios p (sin él, los dos primeros p2 pararon por el 404: molde inválido, no cuentan).

### Decisiones tomadas con el dev-lead

- Feature full, enunciado de la fila 0117 — «Fila 0117, full (Recomendada)», 2026-10-01.
- Se parte: la estimación previa del patch pasa a la 0130, con fila propia — «Partir estimación (Recomendada)», 2026-10-01.
- Perfil `delegate` con parada en la spec — «Delegate, paro en la spec (Recomendada)», 2026-10-01.
- Campaña con techo de 15 $ para RED + GREEN — «Lanza con techo 15 $ (Recomendada)», 2026-10-01.
- Topes de palabras: retirar el predicado duplicado y subir los topes a lo medido — «Retirar duplicado y subir topes (Recomendada)», 2026-10-01.
- Techo de sujetos de 40 a 50, mismo techo de 15 $, para el REFACTOR de los rojos de la Task 1 — «Subir a 50 sujetos (Recomendada)», 2026-10-01.
- `using-sdd` conserva el predicado compacto junto al criterio nuevo y su tope sube de 530 a lo medido — «Devolver el predicado y subir tope (Recomendada)», 2026-10-01.
- La description de `sdd-start-patch` excluye mostrar u ocultar según un dato, avisos y reglas nuevas; techo a 55 sujetos; si no basta, se acepta el rebote — «Probar la description (Recomendada)», 2026-10-01.

## Intent

Hoy el carril patch lo decide el tamaño y la palabra «bug»: un cambio pequeño con la solución dictada (el 6300, el 0037) cae a feature por la letra o entra por patch improvisando la causa raíz, el `Fixed` y el `fix`; quitar un botón (la 6336) arrastra una feature full de casi 3 h; y un patch grande con las decisiones cerradas del dev-lead (el 0082) no tiene dónde decirlo. Se quiere que el carril lo decida quién fijó la solución, que el patch registre quién decidió qué, y que la puerta trasera —una feature pequeña que el agente diseña y mete como patch— siga cerrada.

## Scope

- Entra: `skills/sdd-start-patch/SKILL.md` (descripción, árbol, predicado con la retirada, pasos 1, 3, 4 y 5, red flags y racionalizaciones) · `skills/sdd-templates/templates/patch-template.md` (`solution:` en el frontmatter, §2 con sus tres formas, §3 con `Decisiones` y `Retirado`) · `skills/sdd-end-patch/SKILL.md` (cláusula de escalada, paso 3 del changelog, paso 4 con el formato `parcial`, paso 8.1 que lee `Decisiones`) · `skills/using-sdd/SKILL.md` (filas de feature, patch y edición directa) · `skills/sdd-start-feature/SKILL.md` (descripción y paso 2, la salida al patch) · `skills/sdd-start-feature/references/modo-lite.md` (condición de migración) · `.docs/workflow/usage-guide.md` §3 · `.docs/sdd/capabilities/routing.md` y `feature-flow.md` al cerrar · tests RED/GREEN en `tests/`.
- No entra: la estimación previa del patch y `Build-EstimationLog.ps1` (0130) · el revisor final proporcional (0108) · el número de paradas en `pair` de la 6336 §3 · la receta de acceso de la verificación visual (6336 §4) · el aviso de merge sin gate (0037 §2) · migraciones de proyecto: los cambios son de skills y plantilla, que viven en el kit.

## Approach

El árbol «¿Es de verdad un patch?» pregunta primero quién fija la solución y después la clase: fallo, ajuste visual o retirada, o petición cerrada. Cada clase tiene su forma de §2 en `patch.md` (causa raíz, intención o solución fijada) y su tipo de changelog. La lista `Decisiones` con autor es la guarda: lo que el usuario ve, decidido sin el dev-lead, saca el patch del carril, y `sdd-end-patch` la lee para su mensaje final y su escalada. Un freno de tamaño amplio para en los extremos y pregunta. `using-sdd`, el paso 2 de `sdd-start-feature` y la guía de uso dicen lo mismo con las mismas palabras. La guía de la retirada y la de la petición cerrada nombran su contraejemplo (Art. II): «avisa cuando…» es feature.

## Delta de comportamiento

### Capacidad: `routing`

**MODIFIED — Un bug pequeño y determinista entra por el carril patch**

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-patch`
- AND `patch.md` lleva `solution: causa raíz`, la causa con su evidencia en §2, la entrada del changelog en `Fixed` y el commit del fix con el tipo `fix`

**ADDED — Un cambio con la solución fijada entra por el carril patch**

- GIVEN el proyecto `ventas`, con `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `app.js` e `index.html`
- WHEN el usuario escribe, por el hook o con `/sdd-start-patch`, «Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas.»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, no `sdd-start-feature`
- AND `patch.md` lleva `solution: ticket` y en §2 la frase del ticket literal, sin causa raíz ni `superpowers:systematic-debugging`
- AND el changelog lleva la entrada en `Changed` o `Added`, nunca en `Fixed`, y el commit no es de tipo `fix`
- AND si `index.html` no existe, para sin abrir rama, carpeta ni id, y lo dice

**ADDED — Un cambio cuya solución tendría que fijar el agente no entra por el patch**

- GIVEN el mismo proyecto
- WHEN el usuario escribe «/sdd-start-patch Es pequeño: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €» o «Métele un patch rápido: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €»
- THEN el trabajo entra por `sdd-kit:sdd-start-feature`, no por `sdd-start-patch`, aunque la petición diga patch
- AND el agente nombra lo que tendría que decidir él: el texto del aviso, dónde sale y si 1.000 € entra en el umbral
- AND con «Oculta Borrar si el pedido está facturado y pásalo a la derecha» también es feature: de dónde sale «facturado» lo tendría que decidir el agente
- AND si dentro de un patch hace falta decidir algo que el usuario ve y que nadie fijó, el agente para y lo pasa a feature

**ADDED — El patch registra quién fijó la solución y quién decidió cada cosa**

- GIVEN un patch abierto con `sdd-start-patch`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` para el patch y lo pasa a `sdd-start-feature`, dicho al usuario
- AND el mensaje final de `sdd-end-patch` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

**ADDED — Un patch muy grande para y pregunta**

- GIVEN un patch con la solución fijada por el dev-lead cuyo diff, sin tests ni docs, pasa de 10 ficheros o de 300 líneas (`git diff --numstat`)
- WHEN el agente va a hacer el commit del fix
- THEN para y pregunta al dev-lead si sigue como patch o pasa a feature, con los dos recuentos
- AND con 6 ficheros y 60 líneas no para

**MODIFIED — Un ajuste solo de presentación entra por el carril patch**

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo, con las páginas `pedido-detalle.html` y `albaran-detalle.html` y sus estilos
- WHEN el usuario escribe «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación», por el hook o con `/sdd-start-feature`
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, citando el predicado: solo plantillas o estilos; en las plantillas, sin añadir bindings, directivas de control, eventos, textos ni claves de i18n; sin TypeScript ni otro código, API, datos ni capacidades, salvo lo que retira una retirada
- AND no se crea `spec.md`

**ADDED — Una retirada de presentación entra por el carril patch**

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Quita Borrar de las dos fichas y pon Guardar y Cancelar en una columna a la derecha»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, no `sdd-start-feature`
- AND §3 de `patch.md` lista lo retirado (el botón Borrar de las dos fichas y lo que solo él usaba) y una línea con lo que el usuario deja de poder hacer: borrar la ficha desde ella
- AND el delta de `order-sheets` cambia «La ficha ofrece guardar, cancelar y borrar», y el changelog lleva la entrada en `Removed`
- AND con «Quita Borrar y añade Archivar en su sitio» es feature: una retirada no añade nada

**REMOVED — Un cambio con lógica o textos no entra por el patch aunque sea pequeño**
- motivo: el carril lo decide quién fijó la solución, no si hay lógica o texto. Sus dos casos pasan a «Un cambio cuya solución tendría que fijar el agente no entra por el patch» («Oculta Borrar si está facturado», feature) y a «Un texto fijado literal entra por el patch» («Cambia "Guardar"…», patch)

**ADDED — Un texto fijado literal entra por el patch**

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha, en las dos fichas»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, como petición cerrada: `patch.md` lleva `solution: dev-lead` y la entrada del changelog va en `Changed`

**MODIFIED — Un patch visual se verifica con una captura y se registra como `Changed`** (antes: «la entrada del changelog va en `Changed`», sin la retirada)

- GIVEN un patch abierto para un ajuste solo de presentación o una retirada
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-end-patch`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `superpowers:systematic-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación del paso 0 de `sdd-end-patch` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `tech-stack.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`; en una retirada, en `Removed`
- AND en una retirada, §4 lleva además la búsqueda de cada símbolo retirado, sin otros usos
- AND un bug determinista sigue con la causa raíz de `systematic-debugging` y cierra en `Fixed`

**MODIFIED — Un patch cuyo fallo no se reproduce no se abre**

- GIVEN una petición de patch (una fila de deuda, un ticket) cuyo fallo la investigación del paso 1 no reproduce sobre la base actual, o una petición cerrada que da por existente algo que no existe
- WHEN el agente termina la investigación
- THEN para: no crea rama ni carpeta, no escribe `patch.md` ni fix, y no reserva id
- AND si viene de una fila del roadmap, la deja re-medida según «Una re-medición que contradice una fila la reescribe» de [`roadmap`](roadmap.md), y lo dice al usuario

### Capacidad: `feature-flow`

**ADDED — Una migración solo de datos no descarta el modo lite**

- GIVEN una feature que quita un botón de una pantalla y cuya única migración da de baja sus dos textos con un procedimiento idempotente y reversible
- WHEN `sdd-start-feature` cita el predicado de lite en la primera pregunta
- THEN lo ofrece como lite y nombra la migración
- AND con una migración que añade una columna no lo ofrece: cambia el schema

## Evidencia del RED

Kit de la rama en `cf239794`, sujetos Sonnet con `SUPERPOWERS_DIR` (superpowers 6.4.2), molde `ventas` en `red/`.

| Frente | Escenario | Resultado | Lectura |
| --- | --- | --- | --- |
| Cambio con la solución fijada, por el hook | p1 | 4 de 4 a `sdd-start-feature` lite («añade un evento: no es un patch») | reproduce la letra que el 6300 se saltó |
| El mismo con `/sdd-start-patch` | p2 | 2 de 2 válidos a feature: «que el ticket fije la solución no cambia el carril». Los dos primeros, sin `index.html`, pararon por el 404 y no cuentan | el criterio nuevo es justo lo contrario; la conducta de campo del 0037 (seguir como patch sin avisar) no se reproduce: posible falso negativo, y lo estructural de abajo basta para el flujo |
| Puerta trasera, con `/sdd-start-patch` | b1 | 2 de 2 a `sdd-start-feature` | hoy cerrada: control del GREEN |
| Puerta trasera, «métele un patch» | b2 | 2 de 2 a `sdd-start-feature` | hoy cerrada: control del GREEN |
| Retirada | r1 | 2 de 2 a feature («el carril de patch no permite quitar elementos ni texto») | reproduce la 6336 |
| Decisiones sin sitio | estructural | `patch-template.md:41-44` solo tiene «Fichero(s)» y «Cambio»; `sdd-end-patch/SKILL.md:40`: «`patch.md` no tiene sección propia» | reproduce 6300 §4 y 0076 §1 |
| El flujo supone un fallo | estructural | `sdd-start-patch/SKILL.md:42-44` (causa raíz obligatoria, STOP si no se reproduce) y `sdd-end-patch/SKILL.md:30` (`Fixed`, o `Changed` solo en un ajuste visual) | reproduce 0037 §1 |
| Lite y migración | estructural | `modo-lite.md:7`: «No toca schema de datos ni exige migración» | reproduce 6336 §2 |
| `using-sdd` contra el árbol | estructural | `using-sdd/SKILL.md:19` manda «un cambio con comportamiento, aunque sea pequeño» a feature | reproduce 0037 §1 |
| Formato `parcial` | estructural | `sdd-end-patch/SKILL.md:31` solo cita «prefijo al principio y texto original intacto»; `roadmap-template.md` ya tiene `parcial — …; queda: …` | reproduce 0036 §5 |

## Retira o adelgaza

> Art. I desde la 0120, integrada en esta rama tras aprobar la spec.

- Sale el predicado visual copiado en el paso 2 de `sdd-start-feature`: dice el criterio en una frase y remite a `sdd-start-patch`, su sitio, sin crecer. En `using-sdd` se quedó: sin él, el router mandó primero a `sdd-start-patch` lo que era feature (c1w 0 de 1 y 0 de 1, bt1 0 de 2 y 1 de 2; la skill los rebotaba bien), y su tope sube a lo medido.
- Sale la regla «un cambio con lógica o textos no entra por el patch» (el `REMOVED` del delta).
- Topes de `tests/WordBudget.Tests.ps1` que suben, a lo medido tras el GREEN: `sdd-start-patch`, `sdd-end-patch`, `sdd-templates` y el kit entero (~+600 palabras previstas). El adelgazamiento de fondo de esas skills es de la 0121.

## Enmiendas

- 2026-10-01 — Sección «Retira o adelgaza» y subida de topes de palabras — la 0120 entró en `develop` durante la feature con la regla «una pieza entra, otra sale» y márgenes de 11 a 85 palabras en las skills que toca — aprobada: «Retirar duplicado y subir topes (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-01 | aprobada: «Apruebo» |
