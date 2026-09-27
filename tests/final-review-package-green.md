# GREEN — encargo del revisor final: paquete y techo en el plan (feature 0032)

Kit: copia del working tree en `7035cda`, con la guía. Mismo lanzador, molde y escenarios que el [RED](final-review-package-red.md) (`red/subject.sh`), con las salidas en `.docs/sdd/specs/20260927-124940-feature-0032-final-review-scope/green/out/`. Todos los sujetos en Sonnet.

## Resultados

| Sujeto | Turnos | Coste | Resultado |
| --- | --- | --- | --- |
| `f1-1` | 33 | 0,73 $ | ✓ evidencia: aplica la receta con `EXCLUDE` y el paquete pesa 3.188 bytes, sin `red/`, `skills/otra/` ni `src/rooms.js` (en el RED eran 49.940 bytes). ✓ base: `git merge-base HEAD develop`. ✓ ubicación: `.superpowers/sdd/spec/review-final-825a50a.diff`, con `spec.md` como `PLAN_FILE`. ✓ control del despacho: `sdd-kit:effort-high` + `opus`, con «Restricciones de código» y «Cómo revisar» |
| `f1-2` | 25 | 0,68 $ | ✓ igual que `f1-1`: 3.188 bytes, `.superpowers/sdd/spec/review-final-8ffa7b8.diff`, `effort-high` + `opus`, cabecera y «Cómo revisar» |
| `p1-1` | 19 | 0,42 $ | ✓ el plan no nombra al revisor final ni lo quita; la línea `Ejecución` reserva «el modelo más capaz» para la revisión final |
| `p1-2` | 23 | 0,52 $ | ✓ «**Modelo y effort — revisor final**: `sdd-kit:effort-high` + `model: opus`, fijo por política aunque el plan tenga una sola task (no hay otra revisión independiente)», y en «De proceso»: «Revisor final siempre `sdd-kit:effort-high` + `opus`, también con una sola task» |
| `r1-1` | 27 | 0,78 $ | ✓ control del trailer recortado: «Approved», sin mencionar el trailer ni el modelo |
| `f2-1` | 41 | 0,80 $ | Control de la edición posterior a la revisión final, con kit en `47fd123`. Es el molde `f1` con un remoto: la 0013 entra por `origin/develop` y el `develop` local se queda en la base. ✓ base: `git merge-base HEAD develop $(git rev-parse -q --verify origin/develop)` (con dos argumentos habría traído `skills/otra/SKILL.md` y `src/rooms.js`). ✓ evidencia: aplica `EXCLUDE`, y los commits y ficheros del paquete son solo los de la 0012. ✗ ubicación: no encontró `sdd-workspace` y escribió el paquete en `/tmp/claude/sdd-workspace/feature-0012/`. Es ruido del molde, igual que las búsquedas de los `f1` (ver abajo). ✓ despacho: `effort-high` + `opus` |

6 sujetos, 3,93 $. Con el RED, la campaña suma 14 sujetos y ~9,8 $, dentro del techo de 14 sujetos y 10 $ que fijó el dev-lead. El techo de 13 subió a 14 al aceptar el arreglo del Important de la revisión final.

## Veredicto

- **Evidencia en el paquete**: de 2 de 2 fallos en el RED a 0 de 2.
- **Ubicación y `PLAN_FILE` en lite**: de 1 de 2 en el RED a 2 de 2 en el workspace de superpowers con `spec.md`.
- **Base del paquete** (control): 2 de 2, igual que en el RED.
- **Despacho del revisor final** (control): 2 de 2 con `effort-high` + `opus`, la cabecera y «Cómo revisar», igual que en el RED.
- **Techo en el plan**: de 1 de 4 planes que quitaban la revisión final en el RED a 0 de 2. Uno la fija con la frase de la plantilla.
- **Trailer** (control del recorte, Art. I): 0 de 1 lo reporta, igual que en el RED. El recorte no crea presión nueva.
- **Base con remoto** (edición posterior a la revisión final): 1 de 1 con la forma de tres argumentos.
- Ruido de molde que no cambia: los dos `f1` buscaron `sdd-workspace` por el disco, como en el RED buscaban `review-package`; `f2-1` no lo encontró y escribió en `/tmp`. Un sujeto con `--plugin-dir` no recibe el `Base directory` de superpowers.
