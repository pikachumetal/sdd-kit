# GREEN — migración v3.0.0: aviso de un gate que `sdd merge --verify` no admite (feature 0235)

Kit de la rama, sin commitear (`skills`, `.claude-plugin`, `cli` sin `node_modules`, `hooks`), con el paso 9 de `v3.0.0.md`. El mismo escenario que el [RED](v3-gate-warning-red.md): `g1` sobre `v2x-gate`, Sonnet, `SUPERPOWERS_DIR` en la 7.0.0. Salidas en `green/out/` y `refactor1/out/` de la [carpeta de la spec](../.docs/sdd/specs/20261028-205941-feature-0235-verify-runs-intersection/). 2026-10-28. Campaña entera, RED incluido: 3 sujetos, 1,31 $ (previsión: 2 sujetos y ~0,9 $, ~1,8 $ con una tanda de REFACTOR).

## GREEN (1 sujeto, 0,44 $)

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `g1-1` | `sdd-upgrade` | Migra entera y no toca la línea del gate. Avisa con sus palabras: «el «Gate de merge» `pnpm lint && pnpm test` encadena comandos y `sdd merge --verify` ya no lo admite. No lo toco: conviene hacerlo una tarea o un script de `package.json`», sin el literal `Gate que encadena comandos: «…»` ni «de moon» | G1 ❌ (forma) |

**Lectura**: fallo de forma (Art. II): cumple, pero parafrasea el aviso que el paso daba en prosa. La forma que toca es un contrato del output: el paso pasa a un bloque `text` con las dos líneas que lleva el informe tal cual.

## REFACTOR 1 (1 sujeto, 0,43 $)

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `g1-1` | `sdd-upgrade` | Migra entera, la línea del gate queda igual en `operations.md`, y el informe dice «Gate que encadena comandos: «pnpm lint && pnpm test» — sdd merge --verify ya no lo admite; hazlo una tarea de moon o un script de package.json». No lo toqué | G1 ✅ |

**Lectura**: con el contrato, el aviso sale literal. Las variables (`Gate con variables`) y el caso sin «Gate de merge» no tienen sujeto propio: los fija el mismo bloque, y quedan como previsión de la spec.
