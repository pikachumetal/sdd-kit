# Constitution — billing-api

## Principios

1. Todo importe se guarda en céntimos enteros: los decimales de coma flotante ya rompieron un cierre de mes.
2. Tests con `node --test` para todo caso de uso.

## Convenciones

- **Idioma**: interfaz y docs en castellano; código y nombres de fichero en inglés.
- **Ramas**: `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: Conventional Commits, cuerpo en castellano.
- **Proyecto de referencia**: `../orders-api`. billing-api replica sus patrones.

## Reglas de producto

- **Dónde viven los datos**: en memoria hasta que se decida la base de datos.
- **Idioma de los nombres**: API y claves en inglés; mensajes al usuario en castellano.
- **Límites**: pendiente.
- **Avisos**: pendiente.
- **Regla ante conflicto**: pendiente.
