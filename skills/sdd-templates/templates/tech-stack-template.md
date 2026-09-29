# Tech Stack — <proyecto>

> Con qué se construye y cómo se ejecuta. Versiones exactas; lo no decidido va como abierto, con sus opciones, nunca como decidido. Los valores de comportamiento (tiempos, límites, cuotas) viven en `capabilities/`: aquí se dice dónde está la pieza técnica y se enlaza la capacidad. Borra los bloques de ayuda (`>`) al redactar.

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| <lenguaje, framework, base de datos…> | <nombre> | <versión exacta> |

## Comandos

- **Build**: `<comando>`
- **Tests**: `<comando>`
- **Arrancar**: `<comando>`

## Testing

> La política que lee el plan de cada feature: TDD si hay tests automáticos; smoke manual documentado si no los hay.

<política>

## Frontend

> Solo si el proyecto tiene interfaz; si no, borra la sección. Con qué se verifica lo que se ve: la verificación de frontend del kit lee cada campo por su nombre. Recomendados y probados con el kit: impeccable como detector y Playwright como runner.

- **URL**: <dónde responde la aplicación con el comando «Arrancar», p. ej. `http://localhost:4200`>
- **Detector**: <comando con `{url}` y `{viewport}` y qué salida es fallo, p. ej. `npx impeccable@<versión> detect {url} --viewport {viewport}`, fallo con el código de salida 2 · o `ninguno`>
- **Viewports**: <escritorio y móvil, p. ej. `1280x800` y `390x844`>
- **Runner E2E**: <p. ej. Playwright, el MCP o el paquete `playwright`>
- **Acceso**: <URL de entrada que abre la sesión y redirige a `{path}`, p. ej. la página de desarrollo `/dev/impersonate?user=demo@example.test&next={path}`, que no se despliega en producción · usuario de pruebas · ruta de la sesión `storageState`, ignorada por git, p. ej. `.auth/state.json` · cómo se rehace si caduca · o `sin login`>
- **Temas**: <cómo se activa cada uno, p. ej. oscuro con `?theme=dark`>
- **Pantalla de referencia**: <la pantalla bien compuesta con la que se compara por defecto, p. ej. `/pedidos`>
- **Skills de apoyo**: <skills de diseño del proyecto, opcionales · o `ninguna`>

## Decisiones abiertas

- <decisión pendiente> — opciones: <a · b> — quién decide: <rol>
