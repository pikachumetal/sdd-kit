# Tasks — 0162 spike panel de validación

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Panel, lectura y espera (O1, O4, O5) | hecha | `73a98975`, `2c377bfa` |
| 2 — Recargas y KO (O2, O3) | hecha | `73a98975` |
| 3 — research.md | hecha | `2b36eeb6`, `2c377bfa` |

Revisión final: sdd-kit:effort-high + opus, con hallazgos (1 Critical, 8 Important, 1 Minor), sobre 2c377bf

## Rulings

- Task 3: añadida una opción D (Playwright con navegador visible que maneja el dev) sobre el papel, marcada «no medida» y fuera de la recomendación; la spec pedía comparar dos alternativas y no excluye una tercera.
- Task 1: O1 medido primero con clics simulados por Claude mientras el dev-lead estaba ausente (enmienda de la spec) y después a mano con el dev-lead; su KO llegó sin comentario, así que el comentario a mano queda sin medir.
- Task 1: el comentario del panel pasó de guardarse en `change` a `input` tras verlo en la medida.
- Pasada de fix: `probe/app/` versionada (HTML estático y middleware 500), para que la lista de Mac se pueda seguir; no es app del proyecto, es desechable como `panel.js`.
