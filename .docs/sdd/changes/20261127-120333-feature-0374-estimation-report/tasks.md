# Tasks — feature 0374 sdd estimation report

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Tablas del informe y el verbo, sin git | hecha | cef48c5 |
| 2 — Persona y versión desde git, y `--release` | hecha | 03d1153 |
| 3 — La retro pega el informe | hecha | b0c7880 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura opus+high, con arreglos, sobre b0c7880
Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN (5 tests que fallaban y 3 que fijan lo correcto), el resto con la suite
Re-revisión: b0c7880..juntada en el cierre, sdd-kit:effort-high + opus, limpia (2 Minor nuevos con ruling)

## Rulings

Task 1: Ruling: la nota «* n < 5» va tras una línea en blanco y tableOf del test la incluye — en GFM una línea pegada a la tabla es otra fila; las aserciones no cambian — si fuera mal, solo cambia el render
Task 2: Ruling: «accepts a leading v in --release» y «missing marker in a commit is sin marcador» pasan en el RED porque aún no hay filtro ni atribución; se quedan como guardas del comportamiento nuevo — si fuera mal, dos tests que no discriminan
Task 3: Ruling: RED r7 primero descartado por molde roto (walkthrough de la 0040 sin «Exportar salas a CSV»: el sujeto paró por evidencia incoherente, no por la estimación); molde corregido y RED relanzado — si fuera mal, 0,16 $ perdidos
Final: Ruling: el paquete de la revisión excluye dist/** — es copia del build que vigila dist.test.ts; duplicaría el diff — si fuera mal, un defecto solo de dist/ sin revisar
Final: Ruling: resolveDocsPath no se mueve a layout.ts (Arq. m3) — lleva el DomainError y el mensaje del log; moverla añade import en layout — coste: un import de report hacia log
Final: Ruling: la fila de sdd estimation report en la tabla CLI de sdd-templates (Arq. m5) — decisión 21 de la spec — coste: el verbo solo en --help y en sdd-retro
Final: Ruling: la selección por release llama a git dentro de report (Arq. m6) — diseño previo de releases.ts, probado en .slow — coste: dos fronteras con git
Final: Ruling: con --release el historial se recorre dos veces (releaseIndex y attributeRows) — ~1 s en este repo con 335 cierres — coste: tiempo en repos enormes
Final: Ruling: Review Focus 2 a medias (Spec m4) — Row no lleva el fichero de origen; walkthrough sin bloque de tiempo + patch.md es raro y releaseLabel tiene el mismo límite — coste: persona equivocada en ese caso
Final: Ruling: comentario de authors.ts marcado por review comments — falso positivo, «specs/» es una carpeta — coste: ninguno
Final: Ruling: nombres de autor con «|» rompen la tabla — raro en nombres — coste: una tabla mal renderizada
Final: Ruling: squash-merge atribuye a quien fusiona — es el autor del commit que añadió el fichero, regla aprobada — coste: cierres atribuidos al que fusiona en equipos con squash
Final: Ruling: cierre sin commitear sale sin atribuir sin aviso — en el corte todo está commiteado — coste: ninguno en el uso previsto
Final: Ruling: orden de git log por fecha en ramas rebasadas — mismo límite que la tabla de releases — coste: autor de un rebase en vez del original, raro
Final: Ruling: sdd-kit.json con BOM — el kit no lo escribe — coste: sin marcador en ese caso
Final: Ruling: \r\n en cat-file sin test — git emite LF; el regex tolera \s — coste: ninguno
Final: Ruling: no verificado «Se prueba en la aplicación» — corrido en el guion: estimation report --root . sobre este repo, 335 cierres atribuidos, --release v3.0.4, 9.9.9 exit 1 — verificado
Final: Ruling: R11 en r7-1 y r7-2 pasa — «1,5 h frente a 2 h» es la fila de la 0040, que está en el informe — coste: un agregado a mano no detectado
Final: Ruling: describe «pasada de la revisión final» nombra el proceso (re-revisión, Minor nuevo) — un commit tras la re-revisión quedaría sin revisar — coste: solo la organización del test
Final: Ruling: --release "" da «La versión  no está…» con doble espacio (re-revisión, Minor nuevo) — sale con 1 como pide la spec — coste: mensaje pobre
