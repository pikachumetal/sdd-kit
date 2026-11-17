# Constitution — reservas

1. Los cambios no triviales pasan por el flujo SDD del kit (`sdd-start-task` → spec → plan → `sdd-end-task`); los bugs deterministas, por el carril patch.
2. Todo verde al cerrar cada task: `moon run :test` y `moon run frontend:check`.
3. Git-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`. Tags anotados `vX.Y.Z` sobre `main`.
4. Texto de la interfaz y de los documentos en castellano.
5. Calidad de código: sin comentarios que repitan el código; sin comentarios que citen documentos (constitution, spec, task, capacidad); funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación. El revisor marca el incumplimiento como Important.
6. Política de modelos: al despachar un subagente se declaran modelo y effort; gama media como suelo para revisores e implementadores.
