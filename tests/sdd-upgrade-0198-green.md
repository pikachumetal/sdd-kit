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

## Tras la revisión de la enmienda: mediciones fechadas (`green2`)

La review opus de la enmienda vio otro hueco del paso 5: también cambiaría el nombre dentro de una medición fechada. Arreglo en `v3.0.0.md` y fila `V20`; `v5` × 2 con el `dist/` de la rama ([`green2/out/`](../.docs/sdd/specs/20261110-181442-feature-0198-migrate-repo-v3/green2/out/)): `V20` 2/2 (la línea de la task 0012 se queda, tras enseñarla en la tabla), `V15`–`V17` 2/2. 2 sujetos, 1,17 $; campaña, 8 sujetos y 4,59 $, por encima de la Suma (3,80 $) con el «dale caña» del dev-lead.

- **Ruling**: `V19` salió 1/2 porque un sujeto propuso mantener también la línea «se cierra con `sdd-end-patch`» de `cierre.md` y la persona aprobó su tabla. El requisito MODIFIED de nombres solo exige la tabla y que la línea del cambio de nombre se quede si el dev-lead lo mantiene; la fila pedía además reemplazar la otra, y se ajusta. La capacidad `cierre.md` del molde gana «Regla ante conflicto», sin la que `sdd capability check` fallaba por algo ajeno a la migración.

## Tras la revisión final (`green3`)

La revisión final (eje Spec) pidió la mitad «sale» de lo publicado (la 0029, cerrada dentro de `v1.2.0`), el paso 4 con `CHANGELOG.md` y una propuesta del paso 5 que reemplace los nombres viejos que no son un dato. `v5` × 2 con el `dist/` de la rama ([`green3/out/`](../.docs/sdd/specs/20261110-181442-feature-0198-migrate-repo-v3/green3/out/)):

| Sujeto | V15 | V16 | V17 | V18 | V19 | V20 |
| --- | --- | --- | --- | --- | --- | --- |
| `v5-1` | ❌ | ✅ (la 0029 sale) | ✅ | ✅ | ✅ (WHEN → `sdd-archive`, el THEN del cambio de nombre se queda) | ✅ |
| `v5-2` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

`v5-1` falla `V15` porque reescribió el one-liner de la 0030 («Filtro por planta de las salas.») y perdió su enlace, una reescritura que la migración no permite («Apply without rewriting the text»); el enlace del changelog sí está. En las tres tandas, `V15` sale 5/6; queda al ticket (decir que el one-liner es el resto del «Ítem», palabra por palabra) y lo vuelve a medir la batería de release de la 0152. 2 sujetos, 1,13 $; campaña, 10 sujetos y 5,72 $.
