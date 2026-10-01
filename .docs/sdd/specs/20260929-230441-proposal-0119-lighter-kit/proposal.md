---
id: 20260929-230441-proposal-0119-lighter-kit
proposal: 0119
title: Un kit más ligero sin perder el RED/GREEN
source: interview
created: 2026-09-29
---

# Propuesta — Un kit más ligero sin perder el RED/GREEN

## Por qué

El kit nació como «superpowers con la documentación que queremos» y ha crecido fricción a fricción: 52.314 palabras en `skills/`, `sdd-start-feature/SKILL.md` con 8.169 palabras y 52 citas de evidencia, `using-sdd` en el tope de palabras del hook, y cada ticket de campo que acaba en «Actuar» se convierte en más texto. El Art. I se mantiene, porque es lo que dice por qué entra un cambio (RED) y que lo arregla (GREEN), pero hoy cada edición diseña una campaña a medida: la 0040 gastó 15,29 $ y ~3,5 h en ~30 min de texto. Se quiere adelgazar las skills sin regresiones, con pruebas reutilizables, alineando con superpowers todo lo que no sea la documentación, y con un freno que impida volver a crecer. Sale de la consulta del 2026-09-29 con el dev-lead (grilling, abogado del diablo), tras el repaso del roadmap posterior a la 2.2.0.

## Reglas de negocio

- **La unidad de prueba de una skill es su batería por paso**: cada skill tiene escenarios fijos agrupados por paso, con molde generado desde la versión de `plugin.json` (no copiado de otra carpeta). Una edición lanza el tramo del paso que toca más un escenario del fallo concreto; la batería entera, solo en las pasadas de adelgazamiento y al cortar release. Ejemplo: una frase nueva en el paso 7 de `sdd-start-feature` → se lanzan los escenarios del paso 7 (p. ej. 6) y uno nuevo del fallo, no los ~40 de la skill.
- **Umbral y modelo por escenario**: cada escenario declara su n, su umbral y su modelo. Sonnet por defecto; Opus cuando el fallo de origen vino de una sesión en Opus. Un rojo no se relanza para sacar verde: se lee por qué falló. Ejemplo: escenario crítico «no fusiona sin la parada de validación», n=3, umbral 3 de 3, Sonnet; escenario del Review Focus, n=2, 2 de 2, Opus (en la 0113, Sonnet dio 0 de 6 y Opus reprodujo).
- **La procedencia vive en la batería, no en la skill**: cada regla de la skill con su RED o ticket de origen se lista en la batería de esa skill, que quien edita lee antes de tocarla. La skill no cita evidencia. Ejemplo: «(`tests/plan-review-focus-red.md`)» sale de `plan-template.md` y queda en la batería de `sdd-templates` como «Review Focus en la plantilla ← plan-review-focus-red, 1 de 2 sin ella».
- **Topes de palabras**: uno por `SKILL.md` y otro por skill completa (con `references/`), con test, para que el texto no se mude sin recortarse. Los valores iniciales los fija la pasada, a partir de los tamaños actuales. Ejemplo: si `sdd-start-feature` queda en 3.000 palabras de `SKILL.md` y 9.000 en total, una frase nueva en el paso 6 exige quitar otra.
- **Una pieza entra, otra sale o adelgaza**: la spec de toda feature del kit dice qué retira o adelgaza; «nada» se justifica y se aprueba en el gate. Además, un presupuesto de palabras del kit entero, con test, que solo sube por decisión del dev-lead. Ejemplo: la 0122 (`sdd-upgrade`) añade una skill y retira de `sdd-init-brownfield` el carril de migración; el total del kit no sube.
- **Solo sobreviven las racionalizaciones con un RED detrás**: una fila de una tabla de racionalizaciones sin RED que la respalde es la primera candidata a salir, y sale si su escenario sigue verde sin ella. La columna «Realidad» queda en una frase, sin cifras de sujetos. Ejemplo: una fila que cita «2 de 2 sujetos lo hicieron sin la regla» se queda (tiene RED) y pierde la cifra; una fila escrita por estilo sale si la batería sigue verde.
- **Primero superpowers, después lo nuestro**: el kit es superpowers más lo que añade (constitution, arquitectura, estimación, capacidades, walkthrough, carriles de patch y release). Todo lo demás se contrasta con la versión vigente de superpowers: si ya lo hace, el kit dice «usa X de superpowers»; si hace falta un override, se queda en una línea; solo si superpowers no lo cubre, el kit lo escribe. Se quita con la batería, no a ojo: los overrides existen porque algo falló. Ejemplo: el Review Focus lo pide `writing-plans` 6.4.2; el kit solo da el sitio en su plantilla y la copia literal al revisor, sin reexplicar qué es.
- **Vigilancia activa**: al abrir cada release, el repaso de «Referencias de vigilancia» (superpowers, OpenSpec, Spec Kit, `claude plugin eval`) responde, pieza a pieza del kit, si otra herramienta ya lo hace y si se asume, se modifica o se mantiene la nuestra; OpenSpec en particular, porque las capacidades salieron de ahí. Ejemplo: si una versión de superpowers trae un ledger con coste por task, el repaso propone retirar la línea de coste del kit que lo duplica.
- **Sub-skill o referencia**: una pieza es sub-skill si el usuario la puede pedir sola, si la invocan dos o más skills o si es una rama condicional con entidad propia; si no, es una referencia que se lee solo cuando se cumple su condición. Criterio de «Anatomía de una skill» en `architecture.md`. Ejemplo: la actualización del proyecto a una versión nueva del kit se pide sola y la ofrece el hook → sub-skill (`sdd-upgrade`); la receta de un conflicto de registros solo existe dentro del cierre → referencia.
- **Adelgazar se hace skill a skill, con piloto**: primero `using-sdd` (pequeña, con batería desde la 0074), después `sdd-start-feature` paso a paso, cada una en su feature, revertible con `git revert` si un ticket de campo trae una regresión. Ejemplo: si el piloto deja pasar una regresión de enrutado, se corrige el método antes de tocar `sdd-start-feature`.
- **El hook ofrece actualizar, no actualiza**: con migraciones pendientes, el hook `SessionStart` inyecta una orden corta («antes de otra cosa, ofrece actualizar con `sdd-upgrade`; si acepta, invócala»), no el texto de la skill. Ejemplo: proyecto en 2.2.0 con el kit 2.3.0 cargado → el agente pregunta primero «¿actualizo el proyecto a la 2.3.0?»; si el dev dice que está con un hotfix, sigue con el hotfix.
- **El cómo del Art. I vive en `tech-stack.md`**: baterías, umbrales y procedencia se escriben en «cómo se testean las skills»; el principio del Art. I («ninguna edición sin RED→GREEN») no cambia. La enmienda de la constitution, si hace falta, cuando el piloto lo confirme. La regla «una entra, otra sale» sí va a la constitution.

## Capacidades que toca

- `migration` — el procedimiento sale de `sdd-init-brownfield` a `sdd-upgrade`, y el aviso del hook la ofrece.
- `onboarding` — `sdd-init-brownfield` deja de llevar la actualización.
- `routing` — el hook ofrece `sdd-upgrade` con migraciones pendientes; `using-sdd` adelgazada por el piloto.
- `feature-flow` — `sdd-start-feature` adelgazada paso a paso (sin cambiar lo que un dev puede esperar).

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0120 | Baterías de regresión por skill, topes de palabras y «una entra, otra sale» | — |
| 2 | 0121 | Adelgazar las skills: spike de lenguaje y alineación con superpowers, piloto en `using-sdd`, después `sdd-start-feature` | 0120 |
| 3 | 0122 | `sdd-upgrade`: la actualización del proyecto fuera de `sdd-init-brownfield` | 0115 |
| 4 | 0128 | `sdd-grilling`: el método de preguntas del kit, adaptado de `grilling` de Matt Pocock | 0120 |

## Acta

No aplica: entrevista (consulta con grilling del 2026-09-29).

## Enmiendas

- 2026-10-01 — reparto: nueva feature 0128, `sdd-grilling`, tras la 0120 y antes de la 0121, que se lleva el punto (4) de la 0121 («cómo pregunta el kit»). Ejemplo: hoy `sdd-roadmap`, las init y `sdd-config` dicen cada una «una pregunta por turno», y `sdd-consult` invoca `grilling` de un plugin que el kit no declara; con la 0128, las cinco invocan `sdd-grilling` y la regla repetida sale de ellas. Es sub-skill por la regla de esta propuesta: la invocan varias skills en un paso fijo, como `add-to-changelog`; una referencia compartida se descartó porque se salta más (en el GREEN de la 0026, 1 de 2 sujetos no abrió `overrides-superpowers.md`). — pedido por el dev-lead — re-parte: 0121 (sin el punto 4).
