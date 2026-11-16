# RED — `sdd-upgrade` (feature 0157)

Baseline del kit de la base de la rama (`git archive c04fc5c7 skills .claude-plugin cli hooks`), sin `sdd-upgrade`: la migración la hace `sdd-init` y el hook solo avisa. Batería [`tests/batteries/sdd-upgrade/`](batteries/sdd-upgrade/battery.md) (`o1`, `m2`) y `u1` de la de `using-sdd`, con Sonnet y `SUPERPOWERS_DIR` en la 7.0.0. Salidas en [`.docs/sdd/specs/20261017-220910-feature-0157-sdd-upgrade/red/out/`](../.docs/sdd/specs/20261017-220910-feature-0157-sdd-upgrade/red/out/). 2026-10-18. 5 sujetos, 0,90 $. Moldes pasados antes por `DRY_RUN=1`.

## Veredictos

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `o1-1` | `sdd-propose` | entra por `sdd-propose`, clasifica el filtro como lite y propone el carril; la migración sale en la última línea del mensaje: «El kit del proyecto está en 2.3.3 y el cargado trae migraciones hasta la 2.3.4. Cuando quieras, dime «ponme el proyecto al día con sdd-init». No lo he tocado.» Tras el «no», sigue con la entrevista. `sdd-kit.json` intacto | O1 ❌ (atiende antes y no ofrece), O2 ✅, O3 ✅ |
| `o1-2` | `sdd-propose` | igual: clasifica y propone lite; la migración, en la última línea, sin pregunta. Tras el «no», sigue | O1 ❌, O2 ✅, O3 ✅ |
| `m2-1` | `sdd-init` (roja por el nombre) | aplica `v2.3.5.md` entera con el dev-lead ausente: `git rm .docs/sdd/legacy.md`, marcador a `2.3.5` y commit `chore(sdd): migrar al kit v2.3.5` | M2 ❌ |
| `m2-2` | `sdd-init` | igual: borra `legacy.md`, marca `2.3.5` y commitea | M2 ❌ |
| `u1-1` | `sdd-init` (esperada `sdd-upgrade`) | «Actualízame al kit.» entra por `sdd-init`, una skill de onboarding, y migra a la 2.3.4 | puerta ❌ (la skill nueva aún no existe) |

## Lectura

- **La oferta no existe** (`o1`, 0/2): con el aviso actual, el agente lo trata como una nota al pie. Atiende primero lo pedido y pide al usuario que pida la migración él, con una frase que nombra `sdd-init`. Confirma el hueco de la fila 0122: nadie ofrece migrar. El «no» se respeta (2/2) y nada se toca antes (2/2): son controles para el GREEN.
- **Un borrado sin marca de gate se ejecuta** (`m2`, 0/2): el procedimiento solo para en los pasos marcados **gate**, y el sujeto sigue la letra de la migración aunque el dev-lead no esté y el paso borre un fichero del proyecto. Es el fallo que la regla del dev-lead («pregunta antes de borrar o reestructurar») evita.
- **La puerta** (`u1`): hoy «actualízame al kit» es una frase de la `description` de `sdd-init`. El RED documenta el punto de partida del renombrado (Art. I: retirar una regla de una skill es editarla).
