# Verificación de frontend

El kit decide **cuándo** se verifica lo que se ve y **qué evidencia** hace falta; **con qué** lo declara el proyecto en `§Frontend` de `tech-stack.md`. Un test unitario no ve el layout, y el ojo del modelo tampoco basta: no ve un padding de 0 px ni un texto que se sale de su caja, y un detector sobre la página renderizada los caza en segundos.

## Cuándo

- **Task full** con «Verificación visual» en el plan: tras su revisión, antes de marcarla hecha (paso 6 de `sdd-start-feature`).
- **Feature lite** que cambia lo que se ve: antes de presentar la validación ([modo-lite.md](modo-lite.md)).
- **Patch visual** (ajuste solo de presentación): tras el cambio, antes de pedir la validación (paso 4 de `sdd-start-patch`).

## Con qué: `§Frontend`

Los campos, por su nombre, de la sección `## Frontend` de `tech-stack.md`:

- **URL**: dónde responde la aplicación arrancada con el comando «Arrancar».
- **Detector**: el comando, con los huecos `{url}` y `{viewport}`, y qué salida cuenta como fallo (p. ej. `npx impeccable@<versión> detect {url} --viewport {viewport}`, fallo con el código de salida 2); o `ninguno`.
- **Viewports**: escritorio y móvil. Si no los declara, `1280x800` y `390x844`.
- **Runner E2E**: Playwright, con el MCP si está en la sesión o con un script del paquete `playwright` si no.
- **Acceso**: cómo entrar, con una URL de entrada que abre la sesión y redirige a `{path}` (p. ej. `/dev/impersonate?user=demo@example.test&next={path}`); el usuario de pruebas; la ruta de la sesión (`storageState`, ignorada por git) y cómo se rehace cuando caduca; o `sin login`.
- **Temas**: cómo se activa cada uno.
- **Pantalla de referencia**: la de por defecto; la que nombre la task gana sobre esta.
- **Skills de apoyo**: las de diseño del proyecto, si las hay. El kit no las invoca por su nombre.

`§Frontend` gana sobre los valores por defecto de esta página.

## Los cinco pasos

1. **Criterio y referencia, antes de tocar.** El criterio en frases medibles («la tarjeta de resumen muestra cliente, total y estado») y la pantalla del proyecto con la que se compara. En full van en el campo «Verificación visual» del plan; en lite, en el Approach de la spec; en el patch, la intención de §2 es el criterio y la referencia es la captura de la pantalla **antes** del cambio.
2. **Detector** en los dos viewports, sobre cada pantalla y estado que declara el criterio. Cada hallazgo que el detector cuenta como fallo se arregla o se justifica por escrito, uno por uno; los avisos (*advisory*) no cuentan. El detector no tiene tope de rondas: **no se cierra con un hallazgo abierto sin justificar**.
   - «Ya estaba antes» solo justifica un hallazgo de una parte que el cambio no toca, nunca uno del elemento que el cambio toca.
   - «Es un falso positivo» y «es intencional» solo valen si citan la frase del criterio o el rasgo de la pantalla de referencia que lo exige. «Diseño compacto», sin esa cita, no justifica nada.
   - «La spec no lo fija» o «sería un commit fuera de la task ya revisada» no dejan el hallazgo para el dev-lead: el arreglo va en un commit propio, que entra en la revisión.
   - En una pantalla con login, el detector abre un navegador sin sesión: escanea la URL de entrada del Acceso con el `{path}` de la pantalla. Sin URL de entrada, el detector de esa pantalla queda «no probado». Escanear el HTML guardado no lo sustituye: no carga el CSS ni aplica el viewport.
   - Si el detector está declarado y no ejecuta (no está instalado, la URL no responde, el comando da error), di el error concreto: lo visual queda «no probado», nunca «verificado».
   - Con `Detector: ninguno`, sigue con las capturas y la rúbrica, y la presentación lleva, literal: «composición no medida: `tech-stack.md` no declara detector en §Frontend».
3. **Ojos.** Una captura por estado y tema, que miras con la rúbrica de composición —jerarquía, ritmo de espaciado, densidad, alineación— contra la referencia. Como máximo 3 rondas de arreglo de composición; si tras la tercera sigue mal, lo dices en la presentación y decide el dev-lead. Las capturas se guardan fuera de git (el scratchpad de la sesión, `%TEMP%`) y no se borran hasta la validación.
4. **Manos**, solo si el cambio toca comportamiento (en un patch visual no aplica). Recorre el flujo real —la interacción y los estados de carga, error y deshabilitado— con la consola y la red sin errores; el árbol de accesibilidad comprueba presencia, rol y estado. Con el usuario de pruebas de `§Frontend`, nunca contra producción, y sin borrar ni modificar datos que no haya creado la verificación.
5. **Enseñar.** La presentación (la parada de `pair`, la validación del paso 7, el paso 0 de `sdd-end-patch`) lleva el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado («390x844 · `cramped-padding` en `.card` · arreglado: padding 16 px»), la ruta de cada captura y, solo si el criterio fija un valor, cada medida con su valor y el esperado. O el aviso, o «no probado» con su motivo.

## Proporción por carril

| | Full | Lite | Patch visual |
| --- | --- | --- | --- |
| Criterio y referencia | en el plan | en el Approach de la spec | la intención; la captura del antes |
| Detector, dos viewports | sí | sí | sí |
| Capturas | por estado y tema | por estado | antes y después de cada pantalla tocada |
| Manos | si cambia comportamiento | si cambia comportamiento | no |

- Las medidas en estilos computados se toman **solo** cuando el criterio fija un valor numérico (contraste ≥ 4,5:1, padding de 16 px). Sin valor fijado, el detector y la rúbrica miden la composición.
- Si el usuario tiene la aplicación levantada, verifica sobre ese entorno: no arranques otro ni hagas un build dedicado.
- Para verificar no escribes una suite de specs E2E nueva: basta un script de capturas o el MCP. Una verificación visual de un cambio de CSS de una línea se cuenta en minutos.

## Acceso

- Con el **Acceso** declarado, el runner entra una vez por la URL de entrada, guarda la sesión en su ruta y la reutiliza en las ejecuciones siguientes; el detector pasa cada vez por la URL de entrada, porque no lleva sesión; si la aplicación te devuelve al login, rehazla una vez. Si la ruta no está ignorada por git (`git check-ignore <ruta>`), no guardes la sesión ahí y dilo.
- Si la aplicación pide login y `§Frontend` no dice cómo entrar, **no intentes entrar**: ni pidas enlaces, ni pruebes códigos, ni fuerces el login. Un enlace mágico o un código tienen límite por cuenta, y descubrir el acceso gastándolos lo agota; tampoco borres el registro de ese límite. Lo visual queda «no probado: falta el acceso en §Frontend», y la presentación propone el Acceso: una página de desarrollo que simula la entrada y la sesión guardada con `storageState`. No es una parada nueva: va en la presentación que ya haces.

## Sin `§Frontend`

- Una feature que cambia lo que se ve y cuyo `tech-stack.md` no tiene `§Frontend` (o no tiene el Acceso y la aplicación pide login) lleva en «Decisiones que he tomado yo» de su spec la propuesta de `§Frontend` con los campos rellenos: impeccable como detector, Playwright y el acceso que se ve en el código. Al aprobar la spec, la escribes en `tech-stack.md`.
- En un patch visual no hay spec: verifica con lo que haya (el aviso o «no probado»), y la presentación de su validación propone `§Frontend`.
- Si el dev-lead no quiere detector, queda `Detector: ninguno` y no se vuelve a proponer.

## La regresión por píxeles no es verificación de frontend

Comparar capturas contra baselines no ve lo que ya estaba mal en la baseline y cuesta minutos por cada cambio de CSS. Puede tener sentido en CI, con entorno fijo y revisión en la PR, pero no es gate del bucle de desarrollo.
