# Capacidad — closing

## Propósito

Los mensajes de apertura y de cierre de una feature: qué se le dice a quien trabaja.

## Requisitos

### Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `aviso-cierre` dice qué se cierra

### La apertura avisa de la rama

- GIVEN una feature recién abierta
- WHEN corre el paso 2 de `aviso-apertura`
- THEN dice en qué rama se trabaja

### El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 1 cuenta los commits de la rama
- AND el paso 2 lista las filas del roadmap que salda
