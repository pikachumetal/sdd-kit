# Evidencia A/B — `sdd-init-brownfield` (2026-09-08)

Campaña de no-regresión del Art. I. Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). Control 629 palabras → tratamiento **568 (−10 %)**.

## Corte probado y aceptado

| Corte | Contenido movido | (a) subconjunto | (b) después de decidir |
| --- | --- | --- | --- |
| `references/generacion.md` | Detalle de los pasos 3, 4 y 5: orden de generación de los documentos, reglas de oro brownfield, contenido de la estructura | Sí: solo al generar | Sí: la conducta gobernada —gate de revisión, PENDIENTES DE REVISIÓN si no hay usuario, sin carpeta `templates/`— se queda enunciada arriba |

Quedan en el `SKILL.md` los Principios (estado real no ideal, constitution como propuesta, exploración barata), el flujo completo, las red flags y las racionalizaciones.

## Escenario

El del [RED](sdd-init-red.md), baseline brownfield. Fixture "Ledgerly" construida el 2026-09-08 (la `fixture-n` original no sobrevivió): aplicación .NET de facturación con `CLAUDE.md` monolítico y **cuatro derivas plantadas**, verificadas antes de correr:

1. `web/` documentada como frontend React — no existe.
2. "Tests con xUnit" — no hay ningún fichero de test.
3. `src/Ordering/Migrations/` documentada — no existe.
4. `CLAUDE.md` dice .NET 8; el `.csproj` real declara `net9.0`.

Petición: «Queremos empezar a trabajar con SDD en este proyecto. Déjalo preparado.»

## Resultado — verificado en disco

| Comprobación | Control (`c-bf`) | Tratamiento (`t-bf`) |
| --- | --- | --- |
| Documentos de anclaje generados | 7 + `specs/` | 7 + `specs/` (idénticos) |
| Carpeta `templates/` creada | ✅ no (Art. VIII) | ✅ no |
| `changelog.md` creado sin preguntar | ✅ no | ✅ no |
| `CLAUDE.md` reescrito como punteros | ✅ 35 líneas | ✅ 36 líneas |
| Documentos marcados PENDIENTES DE REVISIÓN | ✅ 5 | ✅ 6 |
| Derivas del `CLAUDE.md` heredado citadas | ✅ 15 menciones | ✅ 15 menciones |

**Sin degradación.** Ambos brazos corrigen los tres fallos del RED: generan la estructura por capas en vez del monolito (fallo 1), inventarían la deuda en tabla de roadmap (fallo 2) y entregan los documentos sin darlos por aprobados (fallo 3). Y ambos conservan el positivo que el RED ya exhibía: separar lo verificado en el código de lo heredado sin confirmar.

El control detectó además un bloqueo no plantado: `OrderService.cs` referencia tipos (`Order`, `OrderRepository`, `Line`) que no existen en el repo, así que el proyecto no compila tal cual. Hallazgo de la fixture, no diferencia entre brazos.

## Cortes descartados

Ninguno.

---

## Segunda campaña — T4, cosecha del entorno en `environments.md` (2026-09-08)

Control = `SKILL.md` en `f0360eb`, tratamiento = `ed79c68` (guidance del entorno por worktree, T4). Run `wf_a54014d6-ce6`, fixture y escenarios de la campaña anterior. Detalle en [`entorno-worktree-green.md`](entorno-worktree-green.md) §No-regresión.

| | Control (`c-bf`) | Tratamiento (`t-bf`) |
| --- | --- | --- |
| Documentos generados | 8 | 8 |
| `templates/` creada | no | no |
| Marcados PENDIENTES DE REVISIÓN | 5 | 5 |
| Derivas del `CLAUDE.md` citadas | 12 | 16 — varianza de redacción, no señal: las cuatro derivas plantadas aparecen en ambos; cambia cuántas veces se repiten, igual que el 5/6 de PENDIENTES en la primera campaña |
| `environments.md` | no | no |

**Sin degradación, 1/1, y el predicado no dispara en falso**: la fixture Ledgerly-derivas no tiene scripts de entorno, así que ninguno de los dos brazos crea `environments.md`. Que sí lo crea cuando los scripts existen lo mide `g4` en el GREEN de T4.

---

## Tercera campaña — T5, "`funcional/` NO se crea ni se vuelca" (2026-09-08)

Control = `SKILL.md` en `f88c3d6`, tratamiento = `74da912` (rename `funcional.md` → `funcional/`, spec ligera, T5). Run `wf_1d195d44-140`, mismos escenarios y fixtures que las campañas anteriores. Detalle en [`spec-ligera-green.md`](spec-ligera-green.md).

| | Control (`c-bf`) | Tratamiento (`t-bf`) |
| --- | --- | --- |
| Docs generados / `templates/` / PENDIENTES | 8 / no / 5 | 8 / no / 6 |
| `funcional/` o `funcional.md` | no | no |

**Sin degradación, 1/1.** Ninguno de los dos brazos crea ni vuelca `funcional/`; el 5/6 en PENDIENTES es la varianza de muestra ya documentada.
