# Tasks — feature 0152 (estado para retomar)

Worktree `D:\code\.worktrees\sdd-kit\feature-0152-coherence-smoke-release`, rama `feature/0152-coherence-smoke-release`, perfil `unattended` (dev-lead: «sí, dale, unattended, con reviews algo mas exhaustivos»). Spec y enmiendas en `spec.md` (decisiones 1-8; enmienda del 2026-11-10, puntos 1-7). Evidencia de baterías en `tests/release-3.0.0.md`. Gasto en sujetos: ~37 $ de ~440 $.

| Task | Estado | Commits |
| --- | --- | --- |
| 1 — Coherencia de documentos | hecha | a3cf177a, 94806cb4 |
| 2 — Deuda de la fila | en parte: líneas 9 (ADR 0027-0034) y 58 (oferta de migración con `sdd-kit.local.json`) hechas; 10, 60, 62, 63 y las 27 «En espera» pendientes | 13468e88, a3cf177a |
| 3 — Mediciones y rojos de develop | en curso | 47a91cc6, 86d510ee, d5dc6963 |
| 4 — Batería de release | pendiente | — |
| 5 — Cierre (`sdd-archive`, revisión final Spec opus, Código sonnet, Arquitectura opus) | pendiente | — |
| 6 — Corte (`sdd-end-release` pasos 1-6; paso 7 pendiente del dev-lead) | pendiente | — |

## Hecho (resumen)

- Las skills nombran solo la forma 3.0.0 (`PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md`, `steering/`, cambios en `changes/`); sin soporte 2.x (dev-lead: «no podemos dar soporte sin migrar»); ADR 0034; el hook exige migrar a un 2.x con kit que trae v3.0.0.
- Moldes de todas las baterías en 3.0.0; `using-sdd/mold-salas-2x` para los escenarios 2.x; `molds.test.ts` vigila que un molde 3.0.0 no tenga documentos 2.x. `sdd-roadmap` retira c2, wn2, ts2; m6 mide la puerta 2.x.
- RED del renombrado (kit de develop, moldes 3.0.0, fila D3): `sdd-propose:c1` 1/2, `sdd-implement:w2` 1/2, `sdd-archive:a1` 2/2. GREEN: en la batería de release.
- Rojos de develop (n = 3): cerrados `sdd-verify:c1` (2/3 tras la 1.ª ronda), `sdd-roadmap:m5`, `sdd-debugging:d1` (molde), `sdd-implement:pt1` (fila PT-B), `sdd-upgrade:h1` (petición y H1); `m2` a n = 3 umbral 2/3; prompt (`m4`) sin regresión de la 0194. 2.ª ronda de arreglos (86d510ee) para `u1`, `h1`/`h2` W y A, `c1`: fila W pasa a mirar la línea que imprime `sdd workspace`.
- Enmienda del 2026-11-11 (fila W, revisión opus aceptada): `sdd workspace` imprime `· retomo en la Task <id>`; `sdd-implement` pierde las dos líneas del workspace; fila W sobre la llamada; delta `MODIFIED` de «El workspace del plan se anuncia». Sin commit: entra con las salidas de la tanda. En el cierre: walkthrough con lo que queda (salida plegada) y la fila de `debt.md` cerrada con su motivo.
- `sdd-propose:f1` F1-C (aviso de fase) 0/3 sin arreglar: `sdd-propose/SKILL.md` a 39 bytes del tope; si se repite en la batería de release, parar y preguntar al dev-lead.
- Migración v3.0.0: tipos de entorno, Tests → Suites, cinco etiquetas del brief, línea de estimación, one-liner palabra por palabra (ticket 0198 §2).

## En curso

- Tanda `meas-0152.sh` (scratchpad de la sesión), kit d5dc6963: GREEN 2 de `sdd-implement:u1 h1 h2` y `sdd-verify:c1` (n = 3), mediciones nuevas `sdd-implement:p4 p4o cs1 ml1`, `sdd-debugging:dp1`, `sdd-archive:rn1`, `sdd-propose:d1` (n = 4), `sdd-upgrade:v5` (n = 2). Fases `g2-*` y `m-*` en la carpeta de la spec. Al acabar: un lector sonnet juzga la prosa y añade sección a `tests/release-3.0.0.md`; commit de las salidas.

## Siguiente

0. Hecho (5d7ad733): el `find /` de `c1-1` de `g2-ver` retuvo la salida de la tanda ~4 h 45 min; la campaña apunta los descendientes de cada sujeto y los para al acabar. Hecho (c95a2691): enmienda del workspace.
0b. Rojos de la tanda `g2-*`/`m-*` (lector, `tests/release-3.0.0.md` §«GREEN 2 y mediciones de la fila»): verdes `h1`, `h2`, `c1`, `p4o`, `cs1`, `dp1`, `rn1`; rojos `u1` (U1, U1r 2/3), `p4` (los sonnet obedecen «no escribas tests»: `sdd-tdd` permite la excepción con permiso del usuario; decisión del dev-lead), `ml1` (ML7 2/3), `d1` (1/4: tres paran en «¿Abro el patch?»), `v5` (1/2). Filas a revisar según el lector: P4b, DP6, C1, L (inglés de errores de herramientas), D1.
1. Arreglar lo que la tanda deje rojo (Art. I, sin alargar skills); si no tiene arreglo, parar.
2. Deuda pendiente de la Task 2.
3. Batería de release (decisión 6): completa con su n en `using-sdd` (con `f2`/`f3` y `SUPERPOWERS_DIR`), `sdd-propose`, `sdd-verify`, `sdd-archive`; `N=1` en las otras once; una `PHASE` por batería (`r3-…`); kit de `git archive HEAD:dist`; lector sonnet por batería; rojo → confirmar con su n y umbral.
4. Revisión final, gate, CI, `sdd merge --push`, ticket; corte sobre `develop` hasta el paso 6 de `sdd-end-release`.
