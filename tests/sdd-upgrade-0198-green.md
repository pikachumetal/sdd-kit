# GREEN — la migración v3.0.0 sin los huecos de este repo (feature 0198)

Escenarios `v5` (molde `v2x-release`) y `v1` (molde `v2x`) de la [batería de `sdd-upgrade`](batteries/sdd-upgrade/battery.md), n = 2, sonnet, con el `dist/` de la rama: la migración con los arreglos (a) a (g) de la spec. Salidas en [`green/out/`](../.docs/sdd/specs/20261110-181442-feature-0198-migrate-repo-v3/green/out/).

| Sujeto | V15 Enlaces | V16 Lo publicado | V17 Release por prefijo | V18 Ids del Backlog | V19 Nombres en capabilities |
| --- | --- | --- | --- | --- | --- |
| `v5-1` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `v5-2` | ✅ | ✅ | ✅ | ✅ | ✅ |

Now: 0030, 0031, 0032, 0033 (una vez) y 0023; Next: 0021, 0022, 0024; Later: la 0040 con su id y la B3 con uno de la reserva. Los dos preguntan qué estado lleva en Later el hito en `🔄`.

`v1`, sin regresión en lo que se comprueba sobre `state.txt`: ningún documento 2.x queda en `.docs/sdd/`, `sdd-kit.json` en `3.0.0`, los commits `chore(sdd): migrar al kit v3.0.0` y `chore(sdd): reglas del proyecto que ya cubre el kit`, `Roadmap válido`, la 0021 y la 0022 en Now con el 0023, la deuda en `debt.md` y ningún `sdd-end-feature` ni `/sdd-consult`.

`battery.mjs run`: `v5 · 2/2` y `v1 · 2/2`, puerta verde. Total: 4 sujetos, 2,23 $; campaña, 6 sujetos y 3,42 $.

## Ruling

- `V18` pedía además que el hito quedara en `⏸️ aparcada`: la persona contesta «Lo que propones» a un estado raro, una línea anterior a la que añadí, y los dos sujetos lo dejaron en `⏳`, que Later admite. La spec solo exige la pregunta (ADDED «conserva los ids del Backlog»); la fila se ajusta a ella y la línea añadida de la persona sale.
