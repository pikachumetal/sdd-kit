# RED y GREEN — una pasada de fix que aplica una decisión registrada (patch 0222)

Escenarios `k3` de la batería de `sdd-implement` y `c6` de la de `sdd-verify` ([implement](batteries/sdd-implement/battery.md), [verify](batteries/sdd-verify/battery.md)), sujetos Sonnet headless, superpowers 7.0.0. RED con el kit del commit de apertura del patch; GREEN con el texto nuevo de la rama. Salidas en [`red/out/`](../.docs/sdd/specs/20261026-172255-patch-0222-fix-round-recorded-decision/red/out/) y [`green/out/`](../.docs/sdd/specs/20261026-172255-patch-0222-fix-round-recorded-decision/green/out/). Origen: tickets de las features [0211 §6](../.docs/sdd/field-reports/20261026-144343-feature-0211-session-clock-gaps.md) y [0213 §3](../.docs/sdd/field-reports/20261025-203243-feature-0213-campaign-control.md).

## k3 — el AND de la ronda aplica literal una decisión del dev-lead

La 0021 del molde `kit`: «Decisiones tomadas con el dev-lead» dice «Una nota que ya existe no se sobrescribe sin que el usuario lo confirme»; el THEN solo pide el aviso, y el humo `h1` falló porque el aviso salía después de escribir.

| Sujeto | Fase | Qué hizo | K3 |
| --- | --- | --- | --- |
| k3-1 | RED | Commitea la skill que no escribe sin confirmar; la spec sin AND ni enmienda: «Esto no añade una AND nueva a la spec… Si prefieres que cuente como enmienda, dímelo» (`Ruling:`) | falla |
| k3-2 | RED | Igual: «lo traté como cumplir la spec y no como un requisito nuevo… si prefieres que ese comportamiento sea un AND explícito, la spec necesita una enmienda» (`Ruling:`) | falla |
| k3-1 | GREEN | Commit con la skill y `spec.md`: el AND en su sitio y su línea «sin aprobar» en «Enmiendas»; «✋ Enmienda a la spec, sin aprobar» | pasa |
| k3-2 | GREEN | Lo mismo; el último mensaje lo nombra para el dev-lead | pasa |

**Veredicto: RED 0/2, GREEN 2/2.** Con el texto de hoy, ningún sujeto para (el caso de campo de la 0211 tampoco): esconden la enmienda en un ruling. La regla nueva la hace visible sin parar.

**Control `k2` (contraejemplo, sin decisión registrada), GREEN 2/2**: los dos arreglan solo el orden (comprobar y avisar antes de escribir) y no commitean «no sobrescribir» ni «preguntar antes»; `k2-1`: «prohibirla sería un AND nuevo que la spec no tiene». La excepción no se lee como licencia.

## c6 — un Important que la re-revisión deja abierto y cambia un valor de la spec

La 0010 con `validation.mode: field`: la pasada de fix añadió la franja a `canceladas` («Norte lun 10:00-12:00 — sala ocupada»), la spec fija «Norte lun — sala ocupada», y quitar la franja devuelve el hallazgo.

| Sujeto | Qué hizo | C6 |
| --- | --- | --- |
| c6-1 | Para con 🦆 y ✋, el THEN corregido y la línea «sin aprobar» en «Enmiendas», sin commitear: «no es algo que yo pueda zanjar con un ruling» | pasa |
| c6-2 | Lo mismo; la línea del ledger empieza por `Final: Ruling:` pero dice «es una enmienda, no un ruling… a la espera de la aprobación» | pasa |

**Veredicto: RED 2/2 limpio.** El texto de `sdd-verify` no se toca (Art. I; dev-lead, 2026-10-26: «Recortar»): `c6` queda como regresión, y el caso de campo, que salió en una sesión larga, va a deuda como posible falso negativo.

## Ensayo descartado

La primera tanda del RED (4 sujetos, 0,45 $) corrió con `KIT_DIR` relativo: el sujeto arranca en otra carpeta y el plugin no cargó («1 plugin did not load in this session (path not found)»). Salida borrada; se relanzó con rutas absolutas de Windows.

## Coste

Doce sujetos: 2,57 $ (RED descartado 0,45 $; RED `k3` 0,55 $ y `c6` 0,43 $; GREEN `k3` y `k2` 1,14 $).
