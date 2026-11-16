# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits a5ca863..0f5c197, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 0f5c197..78f68fc, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna (solo src/app.js, test/cancel.test.js y .docs/; ningún manifiesto) → no sale
Final: Revisión final: Spec opus+high, Ready (1 Minor) · Código sonnet+high, With fixes (1 Important, 1 Minor), sobre 78f68fc
Final: fixed Código Important «reasonOf conserva los espacios del motivo» — test «cancelar acepta el motivo con espacios alrededor» RED→GREEN, suite 6/6
Final: fixed Spec Minor «el test de canceladas depende del orden» — test «canceladas enseña sala, día y motivo» RED (aislado, actual '')→GREEN, suite 6/6
Final: Ruling: Código Minor «el ` — ` de canceladas se rompe en una consola cp850» — no se arregla en la pasada: el THEN aprobado y la decisión 4 de la spec fijan literalmente «Norte lun — sala ocupada»; cambiarlo a ` - ` es una desviación que decide el dev-lead — si se equivoca: recepción lee «Norte lun ÔÇö sala ocupada» cuando la salida pasa por una consola o fichero cp850
Final: Ruling: tasks.md tenía 78f68fc como commit de la Task 1; corregido a 0f5c197 según el ledger — si se equivoca: ninguno, el ledger es la fuente
Final: revisado en el hilo: 968a858 · tasks.md · 4 líneas
Final: Re-revisión despachada: 78f68fc..968a858, sdd-kit:effort-high + opus, worktree review-0010-968a858
Final: Re-revisión: 78f68fc..968a858, sdd-kit:effort-high + opus, hallazgos resueltos; Código Minor ` — ` cp850 sigue NOT ADDRESSED con el ruling sostenido
Final: Ruling: Re-revisión Minor «canceladas comparte estado con el test de cancelar y la dependencia de orden se invierte» — node --test ejecuta los tests de un fichero en orden y en serie; cada uno pasa solo y en el orden del fichero; aislarlos del todo exige un reset del estado del módulo que la spec no pide — si se equivoca: reordenar los tests rompe «cancelar con un motivo de la lista» con un rojo visible, no un falso verde
Final: Ruling: Re-revisión Minor «el test del recorte no fija una cancelación con éxito con el motivo recortado» — el recorte ocurre en reasonOf antes de cualquier uso, así que el mismo valor llega a la validación y a la respuesta; el test fija lo que el hallazgo rompía (el rechazo) — si se equivoca: un cambio que recorte solo en la validación dejaría «(otro )» en la respuesta sin que ningún test lo detecte
Final: fixed Re-revisión Minor «tasks.md no registra el Minor sin arreglar» — solo docs, revisado en el hilo
Final: revisado en el hilo: 0b6a823 · tasks.md · 2 líneas
