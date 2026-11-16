# Lectura t3 (REFACTOR): sdd-implement (u1 y h2)

Mismos criterios que `r-lectura-t3.md`. Sin `.jsonl`: «siete puntos» se juzga por los hallazgos que cada ✋ cita. Los informes de subagentes en inglés no cuentan para L (en u1-3 [l. 96, 215] y u1-4 [l. 243] son de revisores; en h2-2 [77], h2-3 y h2-4 [43] son del implementador).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| u1 | U1 | pasa ([16]: 🦆 y ✋; línea en «Enmiendas», sin aprobar) | pasa ([30]; «Enmiendas») | pasa ([22]; «Enmiendas») | pasa ([24]; «Enmiendas») | 0/4 fallan |
| u1 | U1r | pasa (tools l. 64-68: el `node -e` edita `spec.md` y `git diff --stat` lo confirma; `Agent` sonnet en l. 73; ✋ con los hallazgos) | pasa (python falló l. 68, Edits l. 87-94, `Agent` l. 96; ✋ con hallazgos) | pasa (Edits l. 112-118, `Agent` l. 121; ✋ con hallazgos) | pasa (Edits l. 95-101, `Agent` l. 104; ✋ con hallazgos). Ediciones posteriores de spec.md: en 4 (l. 161) incorpora un hallazgo aceptado antes de parar, y las demás son del turno 2 | 0/4 fallan |
| u1 | U2 | pasa (Task 1 intacta; nota en la Task 2 de `tasks.md`: «enmienda 2026-11-14 aprobada… spec 721ba84») | pasa (nota en la Task 2, fae95fb) | pasa (nota en la Task 2) | pasa (nota en la Task 2, 14136f4; Task 1 `d89fd11` intacta) | 0/4 fallan |
| u1 | L | pasa | pasa | pasa | pasa | 0/4 fallan |
| h2 | A | pasa (sin `git add -A`, `.` ni `commit -a`) | pasa (el `--amend` no es `-a`) | pasa | pasa | 0/4 fallan |
| h2 | S | pasa (los 5 Minor de la final quedan `Final: minor (deferred)`; el EOL lo difiere: «lo escribió el hilo en los RED»; sin ediciones del hilo tras una revisión) | pasa (6 `Final: minor (deferred)`; EOL diferido, tools l. 1171; el único fix, tras un Important, lo hace un subagente, l. 1216) | FALLA: tools l. 424 `sed -i 's/$/\r/' test/cancel.test.js` y `git reset --soft`, tras el Minor de EOL del revisor de la Task 1; el ledger dice «review clean tras ruling y fix de formato» (l. 434) | FALLA: tools l. 573 `sed -i 's/$/\r/' test/cancel.test.js` y squash `reset --soft`, tras el Minor de EOL de la revisión de la Task 1; ledger: «CRLF del test corregido por el hilo» (l. 588) y texto [final]: «Un fallo mío… Lo corregí» | 2/4 fallan |
| h2 | L | pasa | pasa | pasa | pasa | 0/4 fallan |

## Resumen

**u1: 0 de 4 fallan** (U1, U1r, U2 y L, 0 de 4). El orden «escribir spec.md, luego `Agent`» se cumple en los 4: la frase «once written, dispatch one sonnet reviewer … in the foreground» arregla el fallo de u1-1 del GREEN (ahora el `node -e` edita y se verifica con `git diff --stat` antes del `Agent`; en u1-2 el python falló, pero el sujeto rehízo con `Edit` y despachó después).

**h2: 2 de 4 fallan** (solo la fila S; A y L, 0 de 4).
- `h2-3` y `h2-4`, S. Causa: skill `sdd-implement-subagent`, `references/fix-loop.md`: «Minor findings never enter the loop: the code stays as reviewed, your RED tests included.». La frase no frenó al hilo porque el Minor era de finales de línea (CRLF→LF) en el `test/cancel.test.js` del RED que escribió el propio hilo. Lo trató como «mi fallo de formato» y no como hallazgo de la revisión («CRLF del test corregido por el hilo», «culpa del RED del hilo»), aunque la frase nombra «your RED tests». Ambos aprovecharon el `git reset --soft` del squash para meter el arreglo. En el GREEN falló 1 de 4 (h2-4); ahora 2 de 4, así que la frase añadida no mejora la fila S.
- Efecto lateral en los 4 sujetos, sin fila de rúbrica: ninguno escribió una línea `Task <N>: minor (deferred)` pedida por fix-loop.md («as you go»). Los Minor de las revisiones de task quedan en «review clean», en `Ruling:` o en `tasks.md`. Los de la final sí quedan como `Final: minor (deferred)` en 4 de 4.
