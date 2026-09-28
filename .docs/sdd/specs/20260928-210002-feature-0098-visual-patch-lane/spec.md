---
id: 20260928-210002-feature-0098-visual-patch-lane
feature: 0098
title: El carril patch acepta ajustes visuales
mode: full
status: approved
created: 2026-09-28
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-28
---

# Spec — El carril patch acepta ajustes visuales

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `routing` — tres requisitos nuevos: el ajuste solo de presentación entra por el patch, un cambio pequeño con lógica o textos no entra por él, y el patch visual se verifica con una captura y se registra como `Changed`.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna (el delta solo añade requisitos a routing; no toca contratos ni datos, y he leído entero lo que se cambia) · tamaño: ~60 líneas en 7 ficheros, todo texto
- Mínimo razonable: ninguna — lo que una review de spec miraría (que el predicado no deje pasar lógica) lo mide la campaña con c1 y c2, que es donde se ve de verdad
```

1. **El predicado, sobre el diff y no sobre la petición.** Un ajuste es de presentación si el cambio cumple las tres condiciones:
   - Solo toca ficheros de plantilla (`.html`, `.component.html`, `.razor`, `.cshtml`…) o de estilos (CSS, SCSS, LESS).
   - En las plantillas solo mueve, envuelve o cambia la clase de elementos. No añade, quita ni cambia bindings, directivas de control (`@if`, `*ngIf`, `v-if`, `@for`), manejadores de eventos, texto visible ni claves de i18n.
   - No toca TypeScript ni otro código, API, datos ni capacidades.

   Si falla una, es feature. El contraejemplo va escrito (Art. II): «solo toco la plantilla» no vale si la plantilla gana un `@if`, porque eso es lógica aunque no haya TypeScript.
2. **La intención cabe en una frase sacada de la petición.** Ejemplo: «Los botones Guardar y Cancelar pasan de la cabecera a una columna derecha en `pedido-detalle` y `albaran-detalle`». Si para escribirla hace falta decidir qué se mueve o adónde, eso es interpretar requisitos y va como feature. Se mantiene el criterio de menos de 30 minutos.
3. **La verificación es la captura.** Se hace una captura en un navegador real por cada pantalla tocada, con Playwright (el MCP o un script con el paquete `playwright`). Se guarda fuera de git, su ruta va en §4 de `patch.md` y se enseña al usuario en la validación del paso 0 de `sdd-end-patch`. No se piden tests: un test unitario no ve el layout. Sí se mantiene que el build pase. La verificación visual no desaparece, solo cambia de tamaño (decisión del 2026-09-28 en la fila de deuda).
4. **Si durante el cambio cae una condición del predicado** (hace falta un `@if`, un texto o una línea de TypeScript), paras y pasa a feature, igual que un patch que crece. Nunca al revés.
5. **Amplío el Scope más allá de la fila: `sdd-start-feature` paso 2.** El ticket 6298 entró por `/sdd-start-feature`, y el paso 2 solo manda al patch el «bug pequeño y determinista». Si no lo toco, el caso del ticket vuelve a caer en feature lite por esa puerta. Esto rompe la frase del roadmap según la cual el patch de la verificación visual (orden 5) «no comparte ficheros con la 0098»: los dos tocan `skills/sdd-start-feature/SKILL.md`, esta el paso 2 y aquel el paso 6. Van en serie, así que no chocan, pero corrijo esa frase en el roadmap.
6. **El predicado va entero en cada puerta que lo aplica**: la fila de `using-sdd`, el paso 2 de `sdd-start-feature` y el árbol y el paso 1 de `sdd-start-patch`. Un resumen sin las condiciones que deciden no se sigue (architecture.md, «Un paso que resume una regla…»). No es duplicar plantilla (Art. VIII).
7. **Fuera, con motivo**:
   - El handoff de `sdd-consult` (paso 5) y `overrides-superpowers.md` L19: los dos entregan a `sdd-start-feature` o `sdd-start-patch`, que ya deciden con el predicado nuevo.
   - `add-to-changelog`: `sdd-end-patch` le dice la categoría explícitamente.
   - La guía de uso de `.docs/workflow/`: se relee al subir de versión, y eso lo vigila `WorkflowDocs.Tests.ps1`.
8. **`patch-template.md`**: la sección 2 pasa a «Causa raíz (o intención, en un ajuste visual)», con su ayuda, y §4 lleva una fila de captura de ejemplo. No cambia la numeración: `Build-EstimationLog.ps1` lee `## 5. Tiempo`.
9. **`mission.md`**: el glosario dice que el carril patch es para «bugs deterministas». Pasa a «bugs deterministas y ajustes solo de presentación», para que la visión no contradiga la conducta.
10. **Campaña (Art. I), previsión.** Es conducta nueva, así que la campaña es completa: 2 sujetos por escenario en RED y 2 en GREEN, más 2 de control en el GREEN. Total **26 sujetos en Sonnet** (lanzador de `tests/headless/`), **~2,5 h y ~16 $** (la 0095 gastó 13,93 $ con 22 sujetos). Techo: **32 sujetos o 22 $**. Si se supera, paro y decides tú.

    La fixture es un proyecto de páginas estáticas (HTML, CSS y un `app.js`) con `.docs/sdd/`, para que la captura se pueda sacar sin build. Escenarios:
    - **v1**: el caso del ticket, con el hook de `using-sdd` y la petición en natural («pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación»). Se espera la puerta patch; en el RED, feature.
    - **v2**: la misma petición con `/sdd-start-feature`, como en el ticket. Se espera que el paso 2 la mande al patch.
    - **c1** (riesgo contrario, lógica): «oculta Borrar si el pedido está facturado y pásalo a la derecha». Es un `@if` en la plantilla. Se espera feature.
    - **c2** (riesgo contrario, textos): «cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha». Se espera feature.
    - **f1**: `/sdd-start-patch` con la petición de v1. Se espera la intención en una frase, sin causa raíz inventada ni `systematic-debugging`, la captura en un navegador real y su ruta en §4.
    - **f2**: `/sdd-end-patch` de un patch visual hecho, con «validado, lo he visto en la captura». Se espera la entrada `Changed` en el changelog, no `Fixed`.
    - **k1** (control, solo GREEN): un bug determinista de verdad con `/sdd-start-patch`. Se espera que siga pasando por `systematic-debugging` con causa raíz y que cierre como `Fixed`.

    c1 y c2 cuentan también como filas de control en el GREEN, porque la guía nueva bordea justo esa conducta.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate` del proyecto, sin aprobación delegada: la spec se para en el gate — «Full · delegate (Recomendada)».
- Techo de la campaña de 32 a 36 sujetos, para el RED/GREEN de los arreglos de la revisión final (b1 bug de CSS, h1 botones con handler, t1 errata, control c2) — «Subir el techo a 36 (Recomendada)» (2026-09-28).
- Sin carril nuevo: el patch se amplía — fila 0098 del roadmap (dev-lead, 2026-09-28).
- Aprobación de la spec, con la condición de que los sujetos de la campaña no se encallen y acaben rápido: la petición de cada escenario cierra de antemano las dudas de alcance (trampa de fixture de T11/T12), cada sujeto lleva tope de turnos y de tiempo en el lanzador y su vigía de silencio, y un sujeto que llega al tope cuenta como «sin llegar», no se relanza a ciegas — «Apruebo, pero vamos a ser muy cuidadosos con los sujetos, que no se encallen, que acaben rapido» (2026-09-28).

## Intent

Un cambio solo de presentación, como mover dos botones a una columna en dos plantillas, no tiene hoy carril proporcional. El patch es para bugs y la edición directa solo cubre un typo, un renombrado o un formato, así que el cambio cae en feature lite, con gate de spec, tests RED, revisión final Opus y walkthrough. En la feature 6298, eso fueron ~2,5 h frente a ≤ 30 min. Lo que se quiere: que un ajuste que cumple un predicado observable entre por el patch, se verifique con una captura que ve el usuario y quede como `Changed`. Y que una feature pequeña con lógica o textos no se cuele por esa puerta.

## Scope

- Entra:
  - `skills/using-sdd/SKILL.md`: la fila de puertas del patch admite el ajuste solo de presentación, con el predicado.
  - `skills/sdd-start-feature/SKILL.md`, paso 2: la salida al patch incluye el ajuste solo de presentación, con el predicado.
  - `skills/sdd-start-patch/SKILL.md`: `description`, Overview, el árbol «¿Es de verdad un patch?», el paso 1 con la variante de intención, los pasos 3 y 4 con la captura como verificación, y los red flags y racionalizaciones que salgan del RED.
  - `skills/sdd-end-patch/SKILL.md`: el paso 0 enseña la ruta de cada captura y el paso 3 usa `Changed` en un ajuste visual.
  - `skills/sdd-templates/templates/patch-template.md`: §2 y §4.
  - `.docs/sdd/mission.md`: la entrada «Carril feature / carril patch» del glosario.
  - `.docs/sdd/roadmap.md`: la frase del orden 5 sobre ficheros compartidos.
  - `tests/visual-patch-red.md`, `tests/visual-patch-green.md` y la carpeta de la spec (`red/`, `green/`).
- No entra:
  - Un carril o prefijo de carpeta nuevo: la carpeta sigue siendo `patch-`.
  - El handoff de `sdd-consult`, `overrides-superpowers.md` y `add-to-changelog` (decisión 7).
  - La guía de uso de `.docs/workflow/`.
  - La verificación visual del paso 6 de `sdd-start-feature` (es el patch del orden 5).

## Approach

Todo cambio se escribe contra el RED. Primero la campaña RED con las skills vigentes, en los seis escenarios. Después, la guía mínima que corrige lo que falle, en las cuatro puertas y en el cierre. Por último, el GREEN con los mismos escenarios más el control k1. El predicado se escribe una vez con las mismas palabras en cada puerta. La variante del paso 1 de `sdd-start-patch` es una rama del paso, no un flujo aparte: el resto del patch (carpeta, `patch.md`, commit, cierre) no cambia.

## Delta de comportamiento

### Capacidad: `routing`

**ADDED — Un ajuste solo de presentación entra por el carril patch**
- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo, con las páginas `pedido-detalle.html` y `albaran-detalle.html` y sus estilos
- WHEN el usuario escribe «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación», por el hook o con `/sdd-start-feature`
- THEN la skill que abre el trabajo es `sdd-kit:sdd-start-patch`, citando el predicado: solo plantillas o estilos; en las plantillas, sin bindings, directivas de control, eventos, textos ni claves de i18n; sin TypeScript ni otro código, API, datos ni capacidades
- AND no se crea `spec.md`

**ADDED — Un cambio con lógica o textos no entra por el patch aunque sea pequeño**
- GIVEN el mismo proyecto
- WHEN el usuario escribe «Oculta Borrar si el pedido está facturado y pásalo a la derecha», o «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha»
- THEN el trabajo entra por `sdd-kit:sdd-start-feature`, no por `sdd-start-patch`
- AND el agente nombra la condición del predicado que falla: el `@if` en la plantilla o el texto visible
- AND si la condición cae ya dentro de un patch visual, el agente para y lo pasa a feature

**ADDED — Un patch visual se verifica con una captura y se registra como `Changed`**
- GIVEN un patch abierto para un ajuste solo de presentación
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-end-patch`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `superpowers:systematic-debugging`
- AND §4 lleva la ruta de una captura en navegador real por cada pantalla tocada, guardada fuera de git, y la validación del paso 0 de `sdd-end-patch` enseña esas rutas al usuario
- AND la entrada del changelog va en `Changed`, no en `Fixed`
- AND un bug determinista sigue con la causa raíz de `systematic-debugging` y cierra en `Fixed`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-28 | aprobada: «Apruebo, pero vamos a ser muy cuidadosos con los sujetos, que no se encallen, que acaben rapido» |
