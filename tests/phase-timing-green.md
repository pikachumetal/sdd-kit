# GREEN — el cierre guarda `timing.json` (feature 0192)

- **Escenario**: `tf1` de la batería de `sdd-archive`, molde `reservas-timing`, con `sdd-archive` paso 2 ya editado. Sonnet, n = 1, 0,18 $.
- **Falla si**: `timing.json` no queda en la carpeta del artefacto (`file: timing.json /"version": 1/`).

**Resultado: pasa, 1/1.** `green/out/tf1-1/timing.json` lleva `version: 1`, `measured: true`, `withinMargin: true` y `clockSeconds: 18031`, con 12000 s de espera: las dos esperas del transcript sembrado (140 y 60 min). `gateCommand` es `null` porque el `tech-stack.md` del molde no declara gate. El §2 del walkthrough sigue pegando la línea `Esfuerzo real` de la CLI, sin las dos frases que salieron de la skill.

`tc1` no se relanza: su frente salió con el RED limpio (`tests/phase-timing-red.md`).

Saldo de palabras, antes → después: `sdd-archive` `SKILL.md` 4846 → 4833, entera 9915 → 9902; `sdd-templates` 16796 → 16771; kit 102448 → 102410.
