# La deuda guarda solo lo vivo (patch 0324)

Evidencia en `.docs/sdd/specs/20261109-134853-patch-0324-debt-keeps-only-live/` (`red/out/`, `green/out/`). Sonnet, n = 1 por frente. RED con el kit de `ce4a45f7`; GREEN con el `dist/` del fix.

| Frente | Skill | RED | GREEN |
| --- | --- | --- | --- |
| `m3` (batería `sdd-roadmap`, fila M3) | triaje | ❌ propone la fila de las 8 h «**Descartada**, con Motivo `caducada`» | ✅ «Propongo **descartarla** con motivo `caducada`, y que salga de `debt.md`» |
| `v1` (batería `sdd-upgrade`, fila V3) | migración v3.0.0 | ❌ `debt.md` lleva «Descartadas» con «Validar el formato de la franja en la API · duplica la 0018» | ✅ la tabla dice «Validar formato de franja · Sale · Estaba `Descartada`», y `debt.md` no la lleva; el resto de V3 en su sitio |
| `b` (humo, molde del frente `b` de la 0177 con `debt.md` sin «Descartadas»; `red/subject.mjs`) | corte, paso 5 | ❌ crea «Descartadas» y mueve allí las dos caducadas con la fecha del corte | ✅ las dos caducadas salen de `debt.md`, la del 2026-08-15 se queda, y el resumen y el cuerpo del commit las nombran |

`sdd-end-release` no tiene batería: la edición lleva humo (Art. I, «humo en todas»), sobre el molde que ya medía la caducidad en la 0177.

Hallazgo del GREEN `m3`: el molde `salas-3` traía «Descartadas» vacía y el check nuevo la da por forma heredada. Los moldes de deuda de las baterías (`sdd-roadmap`, `sdd-debugging`, `sdd-archive` y `sdd-retro`) pierden la sección vacía, y el de `sdd-retro`, la columna del «Repaso por causa».

Coste: 6 sujetos, 1,77 $ (RED 0,92 $; GREEN 0,85 $), frente a una previsión de 10 y 3,13 $. Sin REFACTOR: los tres frentes salieron verdes a la primera.
