# Constitution — exportes

1. Los cambios no triviales pasan por el flujo SDD del kit (`sdd-start-feature` → spec → plan → `sdd-end-feature`); los bugs deterministas, por el carril patch.
2. Tests antes que código: `node --test` en verde antes de cada commit y antes de cerrar una feature.
3. Git-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`. Tags anotados `vX.Y.Z` sobre `main`.
4. Texto de la interfaz y de los documentos en castellano.
