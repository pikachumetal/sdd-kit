# Capacidad — agent-writing

## Propósito

cómo escribe y prueba el kit lo que lee un agente.

## Requisitos

### Pedir una skill entra por sdd-agent-writing

- GIVEN un proyecto con `.docs/sdd/` y migraciones SQL en `db/migrations/`
- WHEN el usuario pide «quiero una skill para las migraciones SQL» sin nombrar ninguna skill
- THEN la primera skill invocada es `sdd-agent-writing`
- AND la `description` que escribe dice solo cuándo usarla, sin resumir su proceso
- AND no da la skill por hecha sin un escenario lanzado o dejado escrito que la pruebe

### Un traspaso a otra skill es lo primero del paso

- GIVEN la skill `exportes` y la petición de pasar el trabajo a `avisos` al terminar
- WHEN el agente la edita con `sdd-agent-writing`
- THEN el paso nombra `avisos`, dice que invocarla es lo primero del paso y prohíbe seguir desde él

### La previsión de una campaña lleva sus partidas

- GIVEN tres escenarios, RED con n = 1 y GREEN con n = 2, a 0,5 $ por sujeto
- WHEN el agente escribe la previsión con `sdd-agent-writing`
- THEN además de RED (3 sujetos) y GREEN (6) lleva una tanda de REFACTOR y una partida de controles, pasada de fix y cambio de modelo
- AND el total no sale en 4,50 $
