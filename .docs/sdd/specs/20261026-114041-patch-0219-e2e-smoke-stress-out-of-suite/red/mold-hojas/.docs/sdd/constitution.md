# Constitution — hojas

1. Los cambios no triviales pasan por el flujo SDD del kit (spec → plan → implementación → cierre); los bugs deterministas, por el carril patch.
2. Tests antes que código. Gate de cierre: `npm test && npm run e2e` en verde.
3. Git-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
4. Texto de la interfaz y de los documentos en castellano.
