# RED — una sola puerta de entrada al roadmap y retirada de `sdd-start-release` (task 0062)

Baseline **sin** `sdd-plan`: el kit en la base de la rama (`9b62ba2`, copia con `git archive`), con `sdd-start-release` dentro salvo en p6, que corre sobre una copia sin ella para medir el hueco que deja la retirada. Sujetos Sonnet headless sobre el repo de juguete `salas` (base de la 0044, con un informe de uso y un roadmap por escenario), sin `AskUserQuestion`. Lanzador, molde, sujeto y salidas en [`red/`](../.docs/sdd/specs/20260924-231636-task-0062-plan-entry/red/).

**Previsión y techo comunes al RED y al GREEN** (aprobados por el dev-lead el 2026-09-25, antes del primer sujeto): ~40 sujetos, ~15 $, ~4 h; techo 50 sujetos, 25 $, 5 h. `SUBJECT_CAP=50`, `COST_CAP=25` y fichero `stop` en `red/run.sh`. La campaña se paró con `stop` a mitad del primer lote (el dev-lead se fue a dormir) y siguió al día siguiente.

**Gastado en el RED**: 22 sujetos, 5,92 $, ~40 min de reloj en paralelo.

Además, sin sujetos: `Get-NextSddId.ps1` sobre un repo con solo `specs/20260915-090000-proposal-0020-billing/` y un roadmap sin fila 0020 **propone `0020`**. El patrón `-(?:task|patch)-(\d{4})` no ve el carril `proposal` y devolvería un id ya usado.

## Escenarios

| Id | Petición | Qué se mide |
| --- | --- | --- |
| p1 | «Queremos cobrar a los clientes externos: tarifa por sala, factura mensual, bloqueo por impago… Organízalo para el equipo» | dónde acaban el porqué y las reglas · filas con id reservado · nada de spec ni rama |
| p2 | «Apunta en el roadmap: exportar las reservas a CSV. No la arranques» | una fila, sin propuesta ni spec |
| p3 | `ids.mode: tracker`; «el PM creó en Azure 4512, 4513 (épica de facturación) y 4514 (aforo)» | ids de Azure tal cual · no toca filas existentes sin preguntar · propone partir la épica ahora |
| p4 | Notas de una reunión con el cliente: descartar la 0012, exportar a CSV primero, email al cancelar, franja mínima de 30 min | las notas quedan en algún sitio · una fila descartada no se borra · no abre nada que no se pidió |
| p5 | «Reordena: la 0014 primero, y la 0015 no empieza hasta que esté la 0012» | orden · dependencia escrita en la fila |
| p6 | «Prepara la release 1.3: qué entra de lo que tenemos», con `sdd-start-release` retirada | qué skill la recoge y qué hace |
| p7 | `sdd-start-task` de la 0013, cuya fila dice «tras 0012», con la 0012 ⏳ | la primera pregunta señala la dependencia |
| p8 | Patch sin fila en `feature/0013` sin commits propios (la 0013 es otra fila) | en qué rama sale el commit del fix |
| p8b | El mismo patch en `feature/fix-sala`, sin id (el caso del [ticket del patch 0065](../.docs/sdd/field-reports/20260924-222724-patch-0065-merge-hook-rejection.md) §2) | ídem |
| p9 | `toHours('90 min')` da 90; el dato del reporte ya se corrigió a mano en el CSV ([ticket del patch 0066](../.docs/sdd/field-reports/20260924-224042-patch-0066-estimation-log-minutes.md) §1) | reproduce con una entrada mínima o para por «no se reproduce» |
| p10 | Propuesta 0020 repartida en 0021 ✅, 0022 ⏳ y 0023 ⏳; «el cliente cambia: factura quincenal y +20 % de 8 a 14 h. Actualiza lo que haga falta» | enmienda fechada o reescritura · re-parte solo lo pendiente · no arranca nada |

## Resultados

| Medida | -1 | -2 |
| --- | --- | --- |
| p1 · filas con id reservado (`-Reserve -Count 5`), sin spec ni rama | ✅ | ✅ |
| p1 · el porqué y las reglas en un artefacto propio | ❌ bloque «decisiones ya tomadas» en el roadmap | ❌ bloque «decisiones comunes» en el roadmap |
| p1 · reglas con ejemplos con datos | ❌ | ❌ |
| p2 · una fila, sin propuesta ni spec | ✅ Backlog, sin id | ✅ Backlog, sin id |
| p3 · ids de Azure tal cual | ✅ | ✅ |
| p3 · no toca filas existentes sin preguntar | ❌ sustituye 0013 por 4514 | ❌ sustituye 0013 por 4514 |
| p3 · propone partir la épica ahora | ❌ «trocear al arrancarla» | ❌ al Backlog, «trocear antes de arrancar» |
| p4 · las notas de la reunión quedan escritas | ❌ | ❌ |
| p4 · la fila descartada no se borra | ❌ la borra y deja una nota suelta | ✅ ⏸️ aparcada con motivo |
| p4 · no abre nada que no se pidió | ✅ | ❌ abre «Release 1.3.0» con `sdd-start-release` |
| p5 · orden y dependencia en la fila | ✅ («Depende de 0012…») | ✅ («No empieza hasta terminar la 0012») |
| p6 · lo recoge una skill que planifica | ❌ `sdd-end-release`: «No hay contenido para sellar» | ❌ `sdd-end-release`: «No puedo cerrar la 1.3 todavía» |
| p7 · la primera pregunta señala la dependencia | ✅ | ✅ |
| p8 · el fix sale en una rama con el id reservado | ✅ `feature/0014` nueva (deja `feature/0013`) | ✅ `feature/0014` nueva (deja `feature/0013`) |
| p8b · ídem | ❌ `feature/fix-sala` | ❌ `feature/fix-sala` |
| p9 · reproduce con una entrada mínima y sigue | ✅ `toHours('90 min')` | ✅ `toHours('90 min')` |
| p10 · no toca la feature cerrada; re-parte solo lo pendiente | ✅ fila 0024 nueva, 0022 «tras 0024» | ✅ ídem |
| p10 · enmienda fechada, sin reescribir la propuesta | ❌ reglas reescritas en su sitio | ❌ reglas y ejemplo reescritos |
| p10 · no arranca nada | ❌ rama `feature/0024` y spec | ❌ rama `feature/0024`, spec y commit |

## Lo que dicen los sujetos

- p1-1: «Cada task lleva su spec y plan al arrancarla… no se crean ramas ni carpetas hasta entonces». Parte bien, pero las reglas del cliente viven en un bloque del roadmap, que es el índice que leen todas las skills.
- p3-1: «**4514 sustituye a 0013.** Ambos son "aforo en `salas libres`", así que dejé una sola fila». p3-2: «En vez de duplicarlo, sustituí el 0013 por el 4514».
- p3-1: «Va como una sola fila, marcada "trocear en tasks al arrancarla". No he inventado sub-ids porque los crea el PM».
- p4-1: «0012 descartada. La he quitado de "Próximo" y dejado una nota con el motivo». p4-2 invoca `sdd-start-release` y abre una «Release 1.3.0 — en preparación» que nadie pidió.
- p6-1: «Por ahora no entra nada en la 1.3, y no he tocado nada. No hay contenido para sellar». p6-2: «No puedo cerrar la 1.3 todavía».
- p8b-2: «el id es 0014, reservado con `Get-NextSddId.ps1 -Reserve`». El commit sale en `feature/fix-sala` y ninguno de los dos lo comenta.
- p10-2, tras arrancar la task 0024: «Ejemplo de la propuesta reescrito. El de 170 € no decía a qué hora eran las reservas. Lo sustituyo por…».

## De dónde sacó cada sujeto la conducta limpia

- **p2 y p5**: ningún sujeto cargó una skill (0 llamadas a `Skill`); la conducta sale de la estructura del roadmap (Backlog, tabla de Próximo), que todo proyecto del kit tiene porque la calca `roadmap-template.md`. Fuente no incidental.
- **p7**: el paso 1 de `sdd-start-task` lee siempre el roadmap, y la fila dice «tras 0012». 2 de 2 lo vieron sin guía. Fuente no incidental: la comprobación al arrancar no necesita texto nuevo si la fila lleva la dependencia, que es lo que escribe `sdd-plan`.
- **p8**: la rama `feature/0013` choca a la vista con la fila 0013 del roadmap; con una rama sin id (p8b) la conducta desaparece 2 de 2. Fuente incidental, y por eso se lanzó p8b.
- **p9**: 2 de 2 ejecutaron `toHours('90 min')` antes de tocar nada; p9-2 cargó `systematic-debugging`, p9-1 no. La conducta sale de investigar el código, no del dato del reporte. Fuente no incidental.

## Veredicto

| Frente | RED | Guía |
| --- | --- | --- |
| Algo grande → propuesta con porqué, reglas con datos y reparto | ❌ 2/2 sin artefacto, reglas sin datos | sí |
| Algo concreto → una fila | ✅ 2/2 | no; p2 se repite en el GREEN como control |
| Items del gestor: no tocar filas sin preguntar y proponer partir ahora | ❌ 2/2 y 2/2 | sí |
| Reunión → acta escrita, descartes sin borrar | ❌ 2/2 sin acta; 1/2 borra | sí |
| Reordenar y dependencias en la fila | ✅ 2/2, en prosa | forma: «tras NNNN» en la plantilla del roadmap; p5 como control |
| «Prepara la release» sin `sdd-start-release` | ❌ 2/2 a `sdd-end-release` | sí: `description` de `sdd-plan` y router |
| «tras NNNN» comprobado al arrancar | ✅ 2/2 | **recortada**: sin texto nuevo en `sdd-start-task`; p7 como control |
| Renombrar la rama tras reservar el id | ✅ 2/2 con colisión visible, ❌ 2/2 sin id | sí |
| Reproducir con una entrada mínima | ✅ 2/2 | **recortada**: sin texto nuevo en `sdd-start-patch`; p9 como control |
| Enmienda fechada y nada arrancado al cambiar la definición | ❌ 2/2 y 2/2 | sí |
| Re-partir solo lo pendiente | ✅ 2/2 | no; p10 lo repite en el GREEN |
| `Get-NextSddId.ps1` ve el carril `proposal` | ❌ propone `0020` | sí: patrón y test Pester |
