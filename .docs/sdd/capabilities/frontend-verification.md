# Capacidad — frontend-verification

## Propósito

Cómo se verifica lo que se ve: la task que cambia la UI se mira en un navegador, con detector, capturas y medidas, y el agente entra en la aplicación como declara el proyecto.

## Requisitos

### Una task que cambia la UI se mira en un navegador

- GIVEN una task con superficie frontend que cambia lo que se ve
- WHEN se escribe el plan y, después, cuando esa task termina su revisión
- THEN la task lleva una verificación visual con la pantalla o ruta, los estados, los temas, el criterio en frases medibles y la pantalla de referencia (la de `§Frontend` si la task no nombra otra), escritos en el plan antes de tocar el código
- AND el hilo principal la abre en un navegador real con Playwright —el MCP si está en la sesión, un script del paquete `playwright` si no—, sobre el entorno que el usuario tenga levantado si lo hay, sin build dedicado ni suite de specs nueva
- AND pasa el detector que declara `§Frontend` de `steering/operations.md` en sus dos viewports, y saca una captura por estado y tema, que mira con la rúbrica de composición (jerarquía, ritmo de espaciado, densidad, alineación) contra la referencia, con 3 rondas de arreglo de composición como máximo, y guarda fuera de git sin borrarla hasta la validación, antes de darla por terminada en `tasks.md`
- AND con la tarjeta de resumen de la Task 2 con borde y 0 px de padding, y un criterio que no nombra el padding, el detector da `cramped-padding` y la task no se da por terminada hasta que el hallazgo se arregla o se justifica por escrito; «ya estaba antes» no justifica un hallazgo del elemento que la task toca, y «falso positivo» o «es intencional» no valen sin citar la frase del criterio o el rasgo de la referencia que lo exige
- AND mide en estilos computados solo lo que el criterio fija con un valor numérico
- AND si la task cambia comportamiento, recorre el flujo real con sus estados de carga, error y deshabilitado, con la consola y la red sin errores, con el usuario de pruebas de `§Frontend`, nunca contra producción y sin borrar ni modificar datos que no creó la verificación
- AND si el detector declarado no ejecuta, o no hay navegador con el que ejecutar Playwright, o no hay forma de levantar la aplicación, lo dice con el error concreto y la task queda «no probado» en lo visual, nunca «verificado» ni sustituida por la suite; «el MCP de Playwright no está en la sesión» y «faltan dependencias» no son ninguno de los tres

### La verificación visual se enseña con medidas y capturas

- GIVEN la feature 0012 con el selector de estado, cuya «Verificación visual» declara `/` y `/?theme=dark`, el criterio «el selector filtra la lista por estado» y contraste del texto ≥ 4,5:1
- WHEN el agente para tras la task en `pair`, o presenta la validación de `sdd-validate` en `delegate`
- THEN antes del guion de pruebas enseña el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado («390x844 · `cramped-padding` en `select` · arreglado: padding-right 12 px») y la ruta de cada captura
- AND cada medida en estilos computados, solo porque el criterio fija un valor, con su valor y el esperado («texto del selector, oscuro · contraste · 7,9:1 · ≥ 4,5:1»)
- AND sin detector declarado, el aviso literal «composición no medida: `operations.md` no declara detector en §Frontend»
- AND si la composición sigue mal tras la tercera ronda, lo dice ahí, para que decida el dev-lead
- AND una task que quedó «no probado» lo dice en ese sitio, con su motivo

### Una feature lite que cambia la UI se verifica en el navegador

- GIVEN una feature lite aprobada que añade el badge «Urgente» con un `@if` y una línea de CSS, ya implementada, y el usuario con la aplicación levantada en el puerto 4700
- WHEN el agente la verifica antes de presentar la validación
- THEN la spec lite lleva en su Approach el criterio en frases medibles y la pantalla de referencia
- AND la verifica sobre el entorno del puerto 4700, sin arrancar otro, sin build dedicado y sin escribir una suite de specs nueva
- AND pasa el detector en los dos viewports y saca una captura por estado (pedido urgente y pedido sin urgencia), y la presentación las enseña
- AND no presenta la validación con un hallazgo del detector abierto sin justificar, con los mismos contraejemplos que una task full, y si el detector declarado no ejecuta, lo visual queda «no probado» con el error
- AND no mide estilos computados, porque la spec no fija ningún valor numérico

### El agente entra en la aplicación solo como declara el proyecto

- GIVEN una aplicación que pide login y un `§Frontend` que declara la página `/dev/impersonate`, el usuario de pruebas `demo@example.test` y la sesión en `.auth/state.json`, ignorada por git
- WHEN el agente verifica una pantalla detrás del login más de una vez
- THEN el runner y el detector entran por la URL de entrada `/dev/impersonate?user=demo@example.test&next={path}` con el `{path}` de cada pantalla, sin gastar accesos
- AND si la entrada declarada gasta algo con límite (un enlace mágico, un código), el runner entra una vez, guarda la sesión y la reutiliza en las ejecuciones siguientes; si la aplicación lo devuelve al login, la rehace una vez
- AND si la ruta de la sesión no está ignorada por git, no guarda la sesión ahí y lo dice
- AND si `§Frontend` no dice cómo entrar y la aplicación entra con enlace mágico, no pide ningún enlace ni intenta el login: lo visual queda «no probado: falta el acceso en §Frontend», y la presentación propone el acceso con la recomendación de una página de desarrollo y `storageState`, sin parada nueva en ningún perfil

### Una spec que cambia lo que se ve propone `§Frontend` si falta

- GIVEN un proyecto ya inicializado con interfaz cuyo `steering/operations.md` no tiene `§Frontend`, y una fila que pide una pantalla nueva
- WHEN el agente escribe la spec
- THEN «Decisiones que he tomado yo» lleva la propuesta de `§Frontend` con sus campos rellenos, recomendando impeccable y Playwright, y el acceso que se ve en el código
- AND al aprobar la spec, `steering/operations.md` gana esa `§Frontend`, sin parada nueva
- AND si el dev-lead no quiere detector, queda `Detector: ninguno`, la verificación sigue con capturas y rúbrica y el aviso «composición no medida», y la propuesta no se repite en las features siguientes
