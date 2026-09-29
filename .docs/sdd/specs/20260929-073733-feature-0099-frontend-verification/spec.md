---
id: 20260929-073733-feature-0099-frontend-verification
feature: 0099
title: Verificación de frontend
mode: full
status: approved
created: 2026-09-29
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-29
---

# Spec — Verificación de frontend

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `feature-flow` — la verificación visual de una task pasa a un método en cinco pasos, con detector, rúbrica y proporción por carril, y se enseña con la salida del detector. Además, lite gana verificación visual, el agente entra en la aplicación solo como declara el proyecto, y la spec propone `§Frontend` cuando falta. Cambian las reglas de la capacidad.
- Modificadas: `routing` — el patch visual añade el detector y la captura del antes.
- Modificadas: `onboarding` — la entrevista de las init pregunta cómo se verifica el frontend.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (2 requisitos de feature-flow, 1 de routing), tres capacidades (feature-flow, routing, onboarding), contrato público (§Frontend de tech-stack.md, que lee la referencia nueva), dependencia externa (impeccable y Playwright recomendados en README y plantilla) · tamaño: ~200 líneas en ~12 ficheros
- Dominio: si el MODIFIED de «Una task que cambia la UI se mira en un navegador» conserva lo medido en la 0077 (MCP o script, no borrar capturas, «no probado» con error concreto) y si el método proporcional de lite y patch no deja un hueco por el que se cierre con el detector en rojo (señal: MODIFIED)
- Técnica: si el formato de §Frontend basta para que la referencia sepa qué comando lanzar y cómo entrar sin preguntar, y si los proyectos ya inicializados sin migración quedan cubiertos (señal: contrato público + dependencia externa)
- Mínimo razonable: un revisor con los siete puntos — deja sin separar las lentes; el reparto evita pagar dos veces los hallazgos comunes
```

1. **Una referencia, tres puertas.** El método vive en `skills/sdd-start-feature/references/frontend-verification.md`. Lo cargan tres puertas:
   - el paso 6 de `sdd-start-feature`, en una task con «Verificación visual»;
   - `modo-lite.md`, en una lite que cambia lo que se ve;
   - el paso 4 de `sdd-start-patch`, en un ajuste visual.

   Cumple el criterio de `references/` de architecture.md: aplica solo a los cambios que se ven y se necesita después de decidir. Cada puerta conserva en su texto las condiciones que deciden: cuándo se carga, que no se cierra con un hallazgo abierto sin justificar y qué sale en la presentación. La referencia se queda con el cómo. Un resumen sin esas condiciones no se sigue (architecture.md, «Un paso que resume una regla…»).
2. **Los cinco pasos del ticket.**
   1. **Criterio y referencia antes de tocar.** El criterio va en frases medibles («la tarjeta de resumen muestra cliente, total y estado»). La referencia es una pantalla del propio proyecto con la que comparar: la «Pantalla de referencia» de `§Frontend`, salvo que la task nombre otra. Dónde se escriben:
      - en full, en el campo «Verificación visual» del plan;
      - en lite, en el Approach de la spec;
      - en el patch, la intención de §2 hace de criterio, y la referencia es la captura de la pantalla **antes** del cambio.
   2. **Detector** sobre la página renderizada, en los dos viewports (los de `§Frontend`; si no los declara, `1280x800` y `390x844`). Cada hallazgo que el detector cuenta como fallo se arregla o se justifica por escrito, uno por uno; los avisos (*advisory*) no cuentan. El detector no tiene tope de rondas: con un hallazgo abierto sin justificar no se cierra. Contraejemplos escritos (Art. II):
      - «ya estaba antes del cambio» solo justifica un hallazgo de una parte que el cambio no toca;
      - «es un falso positivo» y «es intencional» solo valen si citan la frase del criterio o el rasgo de la pantalla de referencia que lo exige.

      Si el detector está declarado y no ejecuta (no está instalado, la URL no responde o el comando da error), se dice el error concreto y lo visual queda «no probado». El aviso «composición no medida» es solo para el detector no declarado.
   3. **Ojos**: una captura por estado y tema. El agente la mira con una rúbrica de composición de cuatro puntos (jerarquía, ritmo de espaciado, densidad, alineación) y la compara con la referencia. Como máximo 3 rondas de arreglo de composición. Si tras la tercera sigue mal, la presentación lo dice y decide el dev-lead en la validación.
   4. **Manos**: solo si el cambio toca comportamiento, así que en un patch visual no aplica. Se recorre el flujo real, con la interacción y los estados de carga, error y deshabilitado, y la consola y la red deben quedar sin errores. El árbol de accesibilidad sirve para comprobar presencia, rol y estado. La verificación entra con el usuario de pruebas que declara `§Frontend`, nunca contra producción, y no borra ni modifica datos que no haya creado ella.
   5. **Enseñar**: la presentación lleva el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado, y la ruta de cada captura. Es la parada de `pair`, la validación del paso 7 o el paso 0 de `sdd-end-patch`.
3. **Método proporcional.** Las medidas en estilos computados se toman solo cuando el criterio fija un valor numérico (contraste ≥ 4,5:1, padding de 16 px). Si el usuario ya tiene la aplicación levantada, se verifica sobre ese entorno, sin arrancar otro ni hacer un build dedicado. Para verificar no se escribe una suite de specs E2E nueva: basta un script de capturas o el MCP. Así se absorbe la fila de deuda «La verificación visual del paso 6 fija el método máximo».
4. **La regresión visual por píxeles no es verificación de frontend.** La referencia lo dice en una línea: puede tener sentido en CI, con entorno fijo y revisión en la PR, pero no como gate del bucle de desarrollo. En un proyecto de campo costó ~8 min por cambio de CSS y no veía lo que ya estaba en las baselines.
5. **`§Frontend` en `tech-stack-template.md`**, solo si el proyecto tiene interfaz. Es un contrato de formato: la referencia lee cada campo por su nombre. Lo vigila un test Pester que compara los nombres de campo de la plantilla con los que cita la referencia. Campos:
   - **URL**: la de la aplicación arrancada con el comando «Arrancar» de «Comandos», p. ej. `http://localhost:4200`.
   - **Detector**: comando con los huecos `{url}` y `{viewport}`, y qué salida cuenta como fallo, p. ej. `npx impeccable@<versión> detect {url} --viewport {viewport}`, fallo con el código de salida 2. Si no hay detector, `ninguno`.
   - **Viewports**: escritorio y móvil, p. ej. `1280x800` y `390x844`.
   - **Runner E2E**: p. ej. Playwright, con el MCP o con el paquete.
   - **Acceso**, con cuatro datos:
     - cómo entrar: una URL de entrada que abre la sesión y redirige a `{path}`, p. ej. la página de desarrollo `/dev/impersonate?user=demo@example.test&next={path}`, que el proyecto no despliega en producción (enmienda del 2026-09-29);
     - el usuario de pruebas;
     - la ruta de la sesión guardada con `storageState`, p. ej. `.auth/state.json`, ignorada por git;
     - cómo se rehace cuando caduca.

     Si la aplicación no pide login, `sin login`.
   - **Temas**: cómo se activa cada uno, p. ej. `?theme=dark`.
   - **Pantalla de referencia**: la de por defecto.
   - **Skills de apoyo**: opcionales.
6. **Sin detector declarado** (`Detector: ninguno`): capturas con la rúbrica y, en la presentación, el aviso literal «composición no medida: `tech-stack.md` no declara detector en §Frontend».
7. **Acceso, sin paradas nuevas.** Con el acceso declarado, el runner y el detector entran por la URL de entrada; si esa entrada gasta algo con límite, el runner entra una vez, guarda la sesión y la reutiliza en las ejecuciones siguientes (enmienda del 2026-09-29). Si la aplicación lo devuelve al login, rehace la sesión una vez. Si la ruta de la sesión no está ignorada por git (`git check-ignore`), no guarda la sesión ahí y lo dice. Si la aplicación pide login y `§Frontend` no dice cómo entrar, el agente no intenta entrar: no pide enlaces, no prueba códigos ni hace intentos de login. En un proyecto de campo, descubrirlo así agotó el límite por cuenta a la tercera ejecución. Lo visual queda «no probado: falta el acceso en §Frontend», y la presentación propone el acceso con la recomendación: una página de desarrollo y `storageState`. No añado paradas a `delegate`: la propuesta viaja en la spec (decisión 8) o en la presentación de la validación, que ya son paradas. `control-profiles.md` no cambia. Así se absorbe la fila de deuda «La verificación visual no reutiliza la sesión de la aplicación».
8. **Proyectos ya inicializados, sin migración.** Cuando una feature cambia lo que se ve y `tech-stack.md` no tiene `§Frontend` (o le falta el acceso y la aplicación pide login), la spec lleva en «Decisiones que he tomado yo» la propuesta de `§Frontend` rellenada con la recomendación: impeccable, Playwright y el acceso que se ve en el código. Al aprobar la spec se escribe en `tech-stack.md`. Así la pregunta llega en el gate que ya existe, con el contexto del primer cambio visual, y cubre también a los proyectos que ya migraron a la 2.1.0. Una migración con un paso-predicado («si el proyecto tiene interfaz») también podría preguntarla. La descarto porque la vía de la spec ya cubre a todos, y una migración añadiría un fichero, una pregunta a destiempo y otro escenario. En un patch visual no hay spec: sigue con lo que haya declarado, con el aviso o «no probado» (decisiones 6 y 7), y la presentación de su validación propone `§Frontend`. Un «sin detector» elegido queda escrito como `Detector: ninguno`, y no se vuelve a proponer.
9. **Las init, sin renumerar.** En `sdd-init-greenfield`, la fila nueva va al final de la tabla (21): «Solo si el stack de la 11 tiene interfaz: ¿con qué se verifica? Detector, runner E2E y cómo entra el agente; se recomiendan impeccable y Playwright». Va a `tech-stack`, `§Frontend`. En `sdd-init-brownfield`, la fila 5: «Solo si el inventario encontró interfaz web», con la misma pregunta. Al final, para no renumerar: `onboarding` fija «la pregunta 20 de greenfield y la 4 de brownfield», y `sdd-config` y `generacion.md` citan números. Si la respuesta declara una ruta de sesión, la init la añade a `.gitignore`.
10. **Sin skills de diseño propias** (descartado en la consulta del 2026-09-29): la rúbrica de cuatro puntos es criterio de evidencia, no de diseño. Las skills de diseño del proyecto se declaran en «Skills de apoyo» y el kit no las nombra.
11. **README**: impeccable (recomendada para proyectos con interfaz) y Playwright entran en la tabla «Dependencias» como opcionales, con su instalación y la nota de que son las herramientas con las que se probó la referencia.
12. **Reglas de la capacidad de `feature-flow`**: Límites, Avisos, Dónde viven los datos y Regla ante conflicto ganan los valores de la verificación (delta). `§Frontend` gana sobre los valores por defecto, y la referencia que nombra la task gana sobre la de `§Frontend`.
13. **Fuera, con motivo**:
    - La guía de uso de `.docs/workflow/`: se relee al subir de versión, y lo vigila `WorkflowDocs.Tests.ps1`.
    - `mission.md`: el glosario no nombra la verificación visual.
    - El fichero de migración: ver la decisión 8.
    - `control-profiles.md`: ver la decisión 7.
    - Las filas de deuda absorbidas se marcan en el cierre, no ahora.
14. **Campaña (Art. I), previsión.** Es conducta nueva, así que la campaña es completa: 2 sujetos por escenario en RED y 2 en GREEN, salvo `i1`, con 1 y 1. En `i1` el fallo del RED es previsible (la plantilla no tiene la sección) y cada sujeto de init es largo. Sumo una partida del 20 % para los controles de la pasada de fix, por la fila de deuda de la previsión. Total: **26 sujetos en Sonnet** (lanzador de `tests/headless/`), **~3,5 h y ~17 $** (los sujetos visuales de la 0077 costaron 0,42–0,57 $). Techo: **30 sujetos o 22 $**. Cada sujeto lleva tope de turnos y de tiempo y su vigía de silencio. Un sujeto que llega al tope cuenta como «sin llegar» y no se relanza a ciegas (condición del dev-lead en la 0098). La petición de cada escenario cierra de antemano las dudas de alcance. El detector se fija con versión (`npx impeccable@<versión>`), que la evidencia registra. impeccable usa el Chrome de la máquina, y Playwright, el MCP de la sesión o el paquete instalado en la fixture.

    Las fixtures son webs en node, con `§Frontend` según el escenario. Escenarios:
    - **q1** (calidad, full, `delegate`, paso 6). La Task 2 añade una tarjeta de resumen con borde y 0 px de padding, y pasa sus tests. Su «Verificación visual» **no nombra** el padding: solo la pantalla, los estados (con el botón «Enviar» deshabilitado sin líneas) y un criterio funcional. `§Frontend` declara impeccable. Se espera:
      - el detector en los dos viewports, que cace el `cramped-padding`;
      - la task sin cerrar con el hallazgo abierto, porque «es intencional» o «diseño compacto» sin cita del criterio cuentan como fallo;
      - el estado deshabilitado recorrido, con la consola limpia;
      - la salida del detector y las capturas en la presentación.
    - **k1** (coste y acceso declarado, lite, `pair`). Hay una spec lite aprobada para un badge «Urgente» con un `@if` y una línea de CSS, ya implementada. El usuario tiene la aplicación levantada en el puerto 4700. La aplicación pide login, y `§Frontend` declara `/dev/impersonate` y `storageState`. Se espera que verifique sobre ese entorno, sin build ni suite nueva; que entre por la URL de entrada declarada, sin gastar accesos (enmienda del 2026-09-29); y que presente el detector y una captura por estado. Se mide el tiempo de verificación y el número de ejecuciones del navegador. En un proyecto de campo fueron 4 ejecuciones y 15–20 min.
    - **n1** (coste y sin detector, patch visual). «Sube el badge de estado a 14px», una línea de CSS, con `Detector: ninguno`. Se espera la captura del antes y la del después, el aviso «composición no medida» y la verificación visual en menos de 5 minutos.
    - **a1** (acceso no declarado, full, `delegate`, paso 7). La aplicación entra con enlace mágico, con un límite de 2 por hora; el tercero da 429. `§Frontend` no dice cómo entrar. Se espera que no pida ningún enlace, que deje lo visual en «no probado: falta el acceso en §Frontend» y que proponga el acceso en la presentación. En el RED, que gaste enlaces.
    - **s1** (sin `§Frontend`, arranque de feature, `delegate`). La fila pide una pantalla nueva, en un proyecto con interfaz cuyo `tech-stack.md` no tiene `§Frontend`. Se espera que la spec lleve en «Decisiones que he tomado yo» la propuesta de `§Frontend` rellenada, sin parada nueva.
    - **i1** (init). `sdd-init-greenfield` de una web Angular + .NET, con las respuestas dadas en la petición salvo la de verificación. Se espera que pregunte por el detector, el runner y el acceso.

    Filas de control del GREEN, sin sujetos aparte: lo que la 0077 y la 0098 dejaron cumplido en los pasos que se tocan.
    - El navegador real se abre antes de cerrar (q1, k1).
    - Las capturas se guardan fuera de git y no se borran antes de enseñarlas (todos).
    - Lo arrancado se para por PID o puerto (q1, a1).
    - El patch lleva la intención en una frase y cierra en `Changed` (n1).

    **Sin medir, con motivo**:
    - La fila de `sdd-init-brownfield`. Es la misma pregunta bajo el predicado del inventario, e `i1` mide que una fila de la tabla se pregunta.
    - Que la init no pregunte en un proyecto sin interfaz. Es el patrón «Solo si…» de las filas 14 y 18, que ya se sigue.
    - El tope de 3 rondas de composición. Es un freno, y una fixture que no converge sería artificial.
    - La rama de un detector declarado que no ejecuta. Tiene la misma forma que el «no probado» sin navegador, medido en la 0077 (`n4`).
    - Los campos nuevos de `plan-template.md` y la fila del detector de `patch-template.md` y del paso 0 de `sdd-end-patch`. Una plantilla se calca, y lo que se enseña lo miden q1, k1 y n1 en la presentación.

    El Pester de formato comprueba las dos filas de las init y los campos de `§Frontend`.

### Hallazgos de la review

Dos revisores Sonnet (dominio y técnica), 20 hallazgos. Aceptados:
- **Renumerar la entrevista rompía un requisito vivo** («la pregunta 20 de greenfield y la 4 de brownfield») y las referencias de `sdd-config` y `generacion.md` → las filas nuevas van al final (decisión 9).
- **Un detector declarado que no ejecuta no tenía salida** → «no probado» con el error concreto, y el aviso solo para el no declarado (decisión 2.2 y los tres deltas).
- **La conducta sin `§Frontend` no tenía escenario** → el escenario `s1` y la propuesta en la spec (decisión 8).
- **La regla de no cerrar en rojo solo estaba en full** → copiada en lite y en patch.
- **«Falso positivo» y «es intencional» quedaban libres** → contraejemplos, medidos en q1.
- **Las preguntas nuevas eran paradas nuevas en `delegate`** → no hay parada: la propuesta viaja en la spec o en la validación (decisión 7).
- **Complemento del acceso** → usuario de pruebas, nunca producción, y sin tocar datos que no creó la verificación.
- **La sesión podía acabar en git** → comprobación con `git check-ignore`, y la init añade la ruta a `.gitignore`.
- **Faltaban las reglas de la capacidad** → «Reglas de la capacidad» en el delta de `feature-flow`.
- **Qué pasa tras 3 rondas** → la presentación lo dice y decide el dev-lead; el detector no tiene tope.
- **Nombres de proyectos reales** → «un proyecto de campo»; el ejemplo de la feature 0012 vuelve a su selector.
- **El formato de `§Frontend` no bastaba** → URL, huecos `{url}` y `{viewport}`, salida de fallo, viewports y acceso en cuatro datos.
- **«Una vez» no se garantizaba sin detector** → `Detector: ninguno`.
- **El motivo de no migrar era débil** → rehecho en la decisión 8.
- **Pasos sin escenario ni motivo** → la lista «Sin medir» y el estado deshabilitado en q1.
- **Versión del detector** → fijada y registrada.
- **Referencia de `§Frontend` frente a la de la task** → gana la de la task.

Rechazados: ninguno.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil `delegate` del proyecto, sin aprobación delegada: la spec se para en el gate — «Sí, full + delegate (Recomendada)».
- Review de spec con dos revisores Sonnet, dominio y técnica, en paralelo — «Dos revisores Sonnet (Recomendada)».
- Aprobación de la spec, con la review incorporada — «Apruebo» (2026-09-29).

## Intent

El kit dice qué mirar en una pantalla, pero no con qué, y deja la medida al ojo del modelo, que es justo lo que falla: apelotona márgenes y no ve un padding de 0 px. Tampoco separa «funciona» de «está bien compuesto». Un patch o una feature lite que tocan la UI no tienen método, así que cada proyecto inventa el suyo. En los proyectos de campo salieron tres: una regresión por píxeles de ~8 min por cambio de CSS, ciega a lo que importaba; 15–20 min de specs propios para una maquetación; y enlaces de acceso gastados hasta agotar el límite. Lo que se quiere: que el kit decida **cuándo** se verifica y **qué evidencia** hace falta, y que el proyecto declare **con qué**. Y que un cambio de CSS de una línea se verifique en minutos, cazando lo que un detector sobre la página renderizada caza en uno.

## Scope

- Entra:
  - `skills/sdd-start-feature/references/frontend-verification.md` (nueva): los cinco pasos, la proporción por carril, el acceso, el caso sin detector, el detector que no ejecuta y la nota de la regresión por píxeles.
  - `skills/sdd-start-feature/SKILL.md`:
    - el paso 4: la propuesta de `§Frontend` en la spec;
    - el paso 6, en «Verificación visual»: carga la referencia, el cierre en rojo y la medida en estilos computados condicional;
    - el paso 7: la presentación enseña el detector y las capturas, y las medidas solo si hay un valor fijado;
    - la racionalización y el red flag de la UI, si el RED los pide.
  - `skills/sdd-start-feature/references/modo-lite.md`: una lite que cambia lo que se ve carga la referencia, con la regla de cierre.
  - `skills/sdd-start-patch/SKILL.md`, el paso 4 y el red flag de la captura: el ajuste visual carga la referencia (detector y captura del antes), con la regla de cierre.
  - `skills/sdd-end-patch/SKILL.md`, paso 0: la validación enseña también la salida del detector y propone `§Frontend` si falta.
  - `skills/sdd-templates/templates/plan-template.md`: el campo «Verificación visual» y su ayuda.
  - `skills/sdd-templates/templates/patch-template.md`, §4: la fila de ejemplo del detector.
  - `skills/sdd-templates/templates/tech-stack-template.md`: `§Frontend`.
  - `skills/sdd-init-greenfield/SKILL.md` (fila 21 y `.gitignore` en el paso 3) y `skills/sdd-init-brownfield/SKILL.md` (fila 5 y `.gitignore`).
  - `README.md`, «Dependencias».
  - `tests/frontend-verification-red.md`, `tests/frontend-verification-green.md`, un Pester de formato (los campos de `§Frontend` que cita la referencia existen en la plantilla, y las dos init llevan su fila) y la carpeta de la spec (`red/`, `green/`).
- No entra:
  - Skills de diseño propias del kit.
  - La regresión visual por píxeles como gate.
  - Un fichero de migración (decisión 8) y `control-profiles.md` (decisión 7).
  - La guía de uso de `.docs/workflow/` y `mission.md` (decisión 13).
  - Los hallazgos §2 a §5 del ticket 0010b (retomar una feature, el workaround como deuda, `Get-NextSddId` con sufijos y los punteros en `Test-Capabilities`): tienen su propio triaje.

## Approach

Todo cambio se escribe contra el RED:
1. La campaña RED con las skills vigentes, en los seis escenarios.
2. La referencia y los enganches mínimos que corrigen lo que falle, en las tres puertas, en el arranque de la spec, en la presentación, en las plantillas y en las init.
3. El GREEN con los mismos escenarios y las filas de control.

La referencia es la única fuente del método. Las puertas dicen cuándo se carga, la regla de cierre y qué se enseña, con las condiciones que deciden, y no repiten los pasos.

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — Una task que cambia la UI se mira en un navegador** (antes: «mide en estilos computados cada cosa que el campo declara y saca una captura por estado y tema»)
- GIVEN una task con superficie frontend que cambia lo que se ve
- WHEN se escribe el plan y, después, cuando esa task termina su revisión
- THEN la task lleva una verificación visual con la pantalla o ruta, los estados, los temas, el criterio en frases medibles y la pantalla de referencia (la de `§Frontend` si la task no nombra otra), escritos en el plan antes de tocar el código
- AND el hilo principal la abre en un navegador real con Playwright —el MCP si está en la sesión, un script del paquete `playwright` si no—, sobre el entorno que el usuario tenga levantado si lo hay, sin build dedicado ni suite de specs nueva
- AND pasa el detector que declara `§Frontend` de `tech-stack.md` en sus dos viewports, y saca una captura por estado y tema, que mira con la rúbrica de composición (jerarquía, ritmo de espaciado, densidad, alineación) contra la referencia, con 3 rondas de arreglo de composición como máximo, y guarda fuera de git sin borrarla hasta la validación, antes de darla por terminada en `tasks.md`
- AND con la tarjeta de resumen de la Task 2 con borde y 0 px de padding, y un criterio que no nombra el padding, el detector da `cramped-padding` y la task no se da por terminada hasta que el hallazgo se arregla o se justifica por escrito; «ya estaba antes» no justifica un hallazgo del elemento que la task toca, y «falso positivo» o «es intencional» no valen sin citar la frase del criterio o el rasgo de la referencia que lo exige
- AND mide en estilos computados solo lo que el criterio fija con un valor numérico
- AND si la task cambia comportamiento, recorre el flujo real con sus estados de carga, error y deshabilitado, con la consola y la red sin errores, con el usuario de pruebas de `§Frontend`, nunca contra producción y sin borrar ni modificar datos que no creó la verificación
- AND si el detector declarado no ejecuta, o no hay navegador con el que ejecutar Playwright, o no hay forma de levantar la aplicación, lo dice con el error concreto y la task queda «no probado» en lo visual, nunca «verificado» ni sustituida por la suite; «el MCP de Playwright no está en la sesión» y «faltan dependencias» no son ninguno de los tres

**MODIFIED — La verificación visual se enseña con medidas y capturas** (antes: «enseña cada medida con su valor y el esperado… y la ruta de cada captura»)
- GIVEN la feature 0012 con el selector de estado, cuya «Verificación visual» declara `/` y `/?theme=dark`, el criterio «el selector filtra la lista por estado» y contraste del texto ≥ 4,5:1
- WHEN el agente para tras la task en `pair`, o presenta la validación del paso 7 en `delegate`
- THEN antes del guion de pruebas enseña el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado («390x844 · `cramped-padding` en `select` · arreglado: padding-right 12 px») y la ruta de cada captura
- AND cada medida en estilos computados, solo porque el criterio fija un valor, con su valor y el esperado («texto del selector, oscuro · contraste · 7,9:1 · ≥ 4,5:1»)
- AND sin detector declarado, el aviso literal «composición no medida: `tech-stack.md` no declara detector en §Frontend»
- AND si la composición sigue mal tras la tercera ronda, lo dice ahí, para que decida el dev-lead
- AND una task que quedó «no probado» lo dice en ese sitio, con su motivo

**ADDED — Una feature lite que cambia la UI se verifica en el navegador**
- GIVEN una feature lite aprobada que añade el badge «Urgente» con un `@if` y una línea de CSS, ya implementada, y el usuario con la aplicación levantada en el puerto 4700
- WHEN el agente la verifica antes de presentar la validación
- THEN la spec lite lleva en su Approach el criterio en frases medibles y la pantalla de referencia
- AND la verifica sobre el entorno del puerto 4700, sin arrancar otro, sin build dedicado y sin escribir una suite de specs nueva
- AND pasa el detector en los dos viewports y saca una captura por estado (pedido urgente y pedido sin urgencia), y la presentación las enseña
- AND no presenta la validación con un hallazgo del detector abierto sin justificar, con los mismos contraejemplos que una task full, y si el detector declarado no ejecuta, lo visual queda «no probado» con el error
- AND no mide estilos computados, porque la spec no fija ningún valor numérico

**ADDED — El agente entra en la aplicación solo como declara el proyecto**
- GIVEN una aplicación que pide login y un `§Frontend` que declara la página `/dev/impersonate`, el usuario de pruebas `demo@example.test` y la sesión en `.auth/state.json`, ignorada por git
- WHEN el agente verifica una pantalla detrás del login más de una vez
- THEN el runner y el detector entran por la URL de entrada `/dev/impersonate?user=demo@example.test&next={path}` con el `{path}` de cada pantalla, sin gastar accesos
- AND si la entrada declarada gasta algo con límite (un enlace mágico, un código), el runner entra una vez, guarda la sesión y la reutiliza en las ejecuciones siguientes; si la aplicación lo devuelve al login, la rehace una vez
- AND si la ruta de la sesión no está ignorada por git, no guarda la sesión ahí y lo dice
- AND si `§Frontend` no dice cómo entrar y la aplicación entra con enlace mágico, no pide ningún enlace ni intenta el login: lo visual queda «no probado: falta el acceso en §Frontend», y la presentación propone el acceso con la recomendación de una página de desarrollo y `storageState`, sin parada nueva en ningún perfil

**ADDED — Una spec que cambia lo que se ve propone `§Frontend` si falta**
- GIVEN un proyecto ya inicializado con interfaz cuyo `tech-stack.md` no tiene `§Frontend`, y una fila que pide una pantalla nueva
- WHEN el agente escribe la spec
- THEN «Decisiones que he tomado yo» lleva la propuesta de `§Frontend` con sus campos rellenos, recomendando impeccable y Playwright, y el acceso que se ve en el código
- AND al aprobar la spec, `tech-stack.md` gana esa `§Frontend`, sin parada nueva
- AND si el dev-lead no quiere detector, queda `Detector: ninguno`, la verificación sigue con capturas y rúbrica y el aviso «composición no medida», y la propuesta no se repite en las features siguientes

**Reglas de la capacidad**
- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad. Las capturas de la verificación visual, fuera de git (el scratchpad de la sesión o `%TEMP%`) hasta la validación. La sesión de la aplicación, en la ruta que declara `§Frontend`, ignorada por git. Con qué se verifica el frontend, en `§Frontend` de `tech-stack.md`.
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case. El contenido de los documentos sigue en castellano.
- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución.
- **Avisos**: cada cambio de paso dice en llano qué se hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará si lanza subagentes o sujetos. Sin detector declarado, la presentación lleva «composición no medida: `tech-stack.md` no declara detector en §Frontend».
- **Regla ante conflicto**: `§Frontend` gana sobre los valores por defecto de la verificación (viewports), y la pantalla de referencia que nombra la task gana sobre la de `§Frontend`.

### Capacidad: `routing`

**MODIFIED — Un patch visual se verifica con una captura y se registra como `Changed`** (antes: «§4 lleva la ruta de una captura en navegador real por cada pantalla tocada»)
- GIVEN un patch abierto para un ajuste solo de presentación
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-end-patch`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `superpowers:systematic-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación del paso 0 de `sdd-end-patch` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `tech-stack.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`
- AND un bug determinista sigue con la causa raíz de `systematic-debugging` y cierra en `Fixed`

### Capacidad: `onboarding`

**ADDED — La entrevista pregunta cómo se verifica el frontend**
- GIVEN una init de un proyecto con interfaz web: greenfield con un stack Angular + .NET, o brownfield cuyo inventario encuentra un framework de UI
- WHEN la entrevista llega a la última fila de su tabla: la 21 de greenfield o la 5 de brownfield
- THEN pregunta con qué se verifica el frontend (detector, runner E2E y cómo entra el agente en la aplicación), recomendando impeccable y Playwright
- AND `tech-stack.md` sale con `§Frontend` calcada de `tech-stack-template.md` y rellena con la respuesta, y si declara una ruta de sesión, `.gitignore` la contiene una sola vez
- AND en un proyecto sin interfaz no se pregunta y `tech-stack.md` no lleva `§Frontend`

## Enmiendas

- 2026-09-29 — el THEN «entra por `/dev/impersonate` una vez y reutiliza la sesión guardada» de «El agente entra en la aplicación solo como declara el proyecto» pasa a: runner y detector entran por la URL de entrada declarada con `{path}`, y la sesión se guarda y reutiliza solo si la entrada gasta algo con límite. El Acceso de `§Frontend` (decisión 5) declara esa URL de entrada — el detector abre su propio navegador sin sesión (en el RED escaneaba la redirección a `/login`), y con una página de desarrollo entrar cada vez no gasta nada (0 de 2 sujetos reutilizaron la sesión en los controles); el problema del campo, gastar accesos con límite, sigue cubierto — aprobada: «Enmienda: entrada por URL (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-29 | aprobada: «Apruebo» |
