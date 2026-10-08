---
id: 20261008-164456-feature-0145-sdd-rubber-duck
feature: 0145
proposal: 0131
title: sdd-rubber-duck, explicar en llano en modo corto y modo largo
mode: full
profile: delegate
status: approved
created: 2026-10-08
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-08
---

# Spec — `sdd-rubber-duck`: explicar en llano, modo corto y modo largo

## Capacidades

- Nuevas: `explaining` — cómo explica el kit al usuario: el párrafo 🦆 de una parada (modo corto) y la explicación por pasos que pide el dev-lead (modo largo).
- Modificadas: `routing` — un requisito nuevo: la petición de explicar en llano entra por `sdd-rubber-duck`.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: capacidad nueva (`explaining`), contrato público (la entrada y la salida del modo corto, que invocarán las paradas desde la 0146) · tamaño: ~60 líneas de skill más la batería y su molde, en ~10 ficheros
- Técnica: si el contrato del modo corto (qué recibe, qué devuelve, que no pregunta) basta para que la 0146 lo invoque desde cada parada sin reabrirlo (señal: contrato público)
- Mínimo razonable: ninguna — deja sin mirar el contrato del modo corto, que en cualquier caso reabre la 0146 al conectarlo, con su propia spec
```

1. **Capacidad nueva `explaining`**, en inglés kebab-case y en paralelo con `interviewing`: una cubre cómo pregunta el kit y la otra cómo explica.
2. **La skill se escribe en inglés** (Art. III) y le dice al agente que hable con el usuario en su idioma, como `sdd-grilling`.
3. **Qué toma de cada fuente.** De `wait-what` toma el contexto primero, frases cortas de ASD-STE100 y el lenguaje del proyecto. De `teach` toma tres cosas: no explicar de memoria sino desde la fuente (aquí, el código), ceñirse al glosario y ser breve porque la memoria de trabajo del lector es pequeña. El resto de `teach` (espacio de aprendizaje, lecciones HTML, learning records) no aplica: el lector no está aprendiendo un tema, quiere entender su proyecto. La fuente es mattpocock/skills **1.2.3**, la versión instalada en la máquina, y la cito con esa versión en un `NOTICE` dentro de la skill y en `THIRD_PARTY_NOTICES.md`, igual que `sdd-grilling`.
4. **El glosario es la sección `Terminology` de `PRODUCT.md`**, si existe. Sin glosario se aplican las demás reglas, sin una rama propia que haya que medir.
5. **El re-pitch de `wait-what` («no te he entendido») no es un tercer modo.** En los tickets de campo, la segunda explicación ya se entendió a la primera («la explicación en palabras de producto se entendió a la primera», feature 0038 de document-manager). Lo que falló fue siempre la primera. Sin fallo en el baseline no se escribe guía (Art. I).
6. **Entrada del modo largo por la `description`** de la skill, sin tocar `using-sdd`: el primer salto lo decide la `description` (`tech-stack.md`, feature 0117). Además, la 0146 rehace la entrada y una fila nueva en `using-sdd` duraría una feature. El GREEN mide el enrutado (escenario `l1`) y que `sdd-consult` no pierde sus preguntas (`c1`). **Enmienda pre-aprobada**: si `l1` no entra por la skill tras una tanda de REFACTOR de la `description`, quito el requisito de `routing`, la entrada por frase pasa a la 0146 como deuda con su evidencia, y el modo largo se invoca por nombre.
7. **Pruebas (Art. I).** La skill nace con su batería en `tests/batteries/sdd-rubber-duck/`, porque aún no existen las skills de propose, verify y archive. El molde nuevo, `exportes`, es una app de reservas con una exportación al calendario repartida en cinco ficheros, un `PRODUCT.md` con glosario (Reserva, Franja, Sala y Exportación, cada una con su _Evitar_ en el idioma del código: `booking`, `slot`, `room`, `export`), un test que falla y una spec a medio escribir. El molde `salas` no sirve porque es un solo fichero y no da para un recorrido «de punta a punta». La rúbrica (abajo) se fija antes del RED y no cambia en el GREEN. **Si el RED no exhibe el fallo de una regla, la regla y su THEN salen, y te vuelvo a pedir la aprobación** (`tech-stack.md`, «un baseline que no falla»).
8. **Previsión de coste** (Art. I): RED con 6 sujetos (s1, s2 y l1, dos de cada); GREEN con 8 (los mismos y dos controles de enrutado); reserva de 4 para un REFACTOR. Son 18 sujetos de Sonnet, ~5 $ a ~0,3 $ cada uno (la campaña de `sdd-grilling` salió a 0,2 $ por sujeto) y ~45 min de campaña. Techo: 10 $. Cada paso nuevo de lo que sigue el agente, con su escenario:

   | Paso de `SKILL.md` | Escenario |
   | --- | --- |
   | `description`: entrada por frase y por invocación de otra skill | l1 (C1), c1 (C2) |
   | Palabras: glosario, sin rutas ni identificadores ni jerga del kit, frases cortas | s1, s2, l1 (R1, R2) |
   | Modo corto: un párrafo con 🦆, como mucho cinco frases, primero qué y después cómo; no pregunta | s1, s2 (R3) |
   | Modo largo: leer el camino real antes de escribir, un ejemplo que recorre los pasos, de 3 a 9 pasos numerados, rutas solo en «Dónde mirar», invitar a preguntar | l1 (R4, R5, R6) |

9. **Una pieza entra, otra sale: esta feature no retira nada**, y lo justifico. Las piezas que el 🦆 sustituye están en las skills de las paradas: el «explicando antes los términos que das por sabidos» de `control-profiles.md` y las explicaciones sueltas de cada parada. Esas salen en la 0146, al conectarlas, y su spec lo dirá. Quitarlas ahora dejaría las paradas sin regla hasta entonces.
10. **Tope de palabras nuevo**: `'sdd-rubber-duck' = @{ SkillMd = 500; Total = 500 }` en `tests/WordBudget.Tests.ps1`; `sdd-grilling` tiene 650. El tope del kit entero sigue suspendido hasta la 0157, que lo restaura con valores medidos de nuevo.
11. **Listas que nombran las skills**: entra una fila en el catálogo del `README.md`, una línea en el árbol de `architecture.md`, y en el `CLAUDE.md` del repo las «15 skills» pasan a 16.
12. **Repaso de coherencia**: R4 decía «más de 9» y el THEN del modo largo, «de 3 a 9». R4 pasa a «menos de 3 o más de 9».

### Decisiones tomadas con el dev-lead

- Dos modos con una sola forma de explicar: el corto escribe el 🦆 de cada parada y lo invocarán las paradas desde la 0146; el largo, a petición, explica por pasos en llano con el glosario de `PRODUCT.md` — «Decisiones ya tomadas en el lienzo 0131: una sola forma de explicar para todo el kit» (2026-10-08).
- Base: `teach` y `wait-what` de Matt, citados con su versión en `THIRD_PARTY_NOTICES.md` — «Base: teach y wait-what de Matt; cita la fuente con su versión en THIRD_PARTY_NOTICES.md» (2026-10-08).
- No conecta el 🦆 en las paradas de las otras skills — «Esta feature no conecta todavía el 🦆 en las paradas de las otras skills: eso es de la 0146» (2026-10-08).
- Feature full con perfil `delegate`, sin aprobar la spec por delegación — opción «Full + delegate (Recomendada)» de la primera pregunta (2026-10-08).

## Intent

El agente explica con jerga a quien no la usa, y el dev-lead tiene que pedir que se lo repitan. Hay cinco tickets de campo con el mismo patrón: una campaña aprobada con «RED previo» y «sujetos headless» (task 0012), un diagnóstico que no se entendió (task 0010), un rojo ajeno explicado con «antialiasing» (feature 6298 de un proyecto) y un merge bloqueado explicado con «caché de transformación» y «grafo de imports» (feature 0038 de document-manager). La 3.0.0 abre cada parada con un párrafo 🦆 llano, y la propuesta 0131 pide una sola forma de escribirlo para todo el kit. Esta feature crea esa forma; la 0146 la conecta en las paradas.

## Scope

- Entra: `skills/sdd-rubber-duck/SKILL.md` y su `NOTICE`; la línea en `THIRD_PARTY_NOTICES.md`; la batería (`battery.md`, `subject.sh`, molde `exportes`); la evidencia `tests/sdd-rubber-duck-red.md` y `-green.md`; el tope en `tests/WordBudget.Tests.ps1`; la fila del catálogo en `README.md`, la línea del árbol en `architecture.md` y la cuenta de skills en `CLAUDE.md`.
- No entra: invocar el 🦆 desde las paradas de otras skills, que es de la 0146; tocar `using-sdd`, `sdd-consult` o `sdd-grilling`; el re-pitch como modo propio (decisión 5); escribir o completar el glosario de `PRODUCT.md`, que es de la 0156; la migración, porque la 3.0.0 corta su release aparte.

## Approach

Una skill de forma, no de disciplina (Art. II): una receta de cómo es la salida, sin red flags. Una sección común de palabras (glosario, sin rutas ni identificadores, términos técnicos explicados por su efecto en la misma frase, frases cortas) y dos contratos: el corto, que recibe la parada y su material y devuelve un párrafo con 🦆 sin preguntar, y el largo, que lee el camino en el código antes de escribir y lo cuenta por pasos siguiendo un ejemplo. Cada regla entra solo si su fila de la rúbrica falla en el RED.

**Rúbrica** (se puntúa el último mensaje de cada turno de `texts.txt`; «falla» lleva la cita literal):

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| R1 Sin jerga | s1, s2, l1 | el texto para el dev-lead contiene una ruta de fichero, un identificador de código (función, variable, comando con opciones) o un término técnico que no está en el glosario ni es de uso cotidiano y no se explica en la misma frase; en l1 se exceptúa una lista final de ubicaciones |
| R2 Glosario | s1, s2, l1 | usa una palabra de _Evitar_ del `PRODUCT.md` del molde |
| R3 Qué y cómo | s1, s2 | no es un solo párrafo de cinco frases como máximo que diga primero qué cambia o qué pasa para quien usa el producto y después cómo |
| R4 Pasos reales | l1 | no son pasos numerados, son menos de 3 o más de 9, o algún paso no tiene respaldo en el código del molde |
| R5 Un ejemplo que viaja | l1 | no sigue una exportación concreta con datos (un mes, una sala) a lo largo de los pasos |
| R6 Invita a preguntar | l1 | no termina ofreciendo resolver dudas |
| R7 Idioma | todos | algún mensaje al usuario en inglés |
| C1 Entrada del modo largo | l1 (GREEN) | la primera skill invocada no es `sdd-kit:sdd-rubber-duck` |
| C2 Consult conserva sus preguntas | c1 (GREEN) | la primera skill invocada no es `sdd-kit:sdd-consult` |

## Delta de comportamiento

### Capacidad: `explaining`

**ADDED — El 🦆 de una spec es un párrafo llano de qué y cómo**
- GIVEN el molde `exportes`, cuyo `PRODUCT.md` dice «**Franja**: … _Evitar_: slot, hueco», y la spec de la feature 0013 (exportar solo las reservas de una sala), cuyo Approach nombra `src/export/filter.js` y `bookingsBySlot`
- WHEN una skill invoca `sdd-rubber-duck` en modo corto para el 🦆 de esa spec
- THEN devuelve un solo párrafo que empieza por 🦆, de cinco frases como máximo, que dice primero qué cambia para quien exporta, con un ejemplo con datos («exportar marzo de la sala Norte trae solo sus reservas»), y después cómo
- AND el párrafo no contiene `src/export/filter.js`, `bookingsBySlot` ni «slot»
- AND devuelve el párrafo sin hacer preguntas

**ADDED — El 🦆 de un bloqueo lo cuenta en palabras del producto**
- GIVEN el molde `exportes` con el test `exporta en la hora del usuario` en rojo, porque el formateador escribe la hora en UTC, y la feature 0012 sin poder cerrarse por ese test
- WHEN una skill invoca `sdd-rubber-duck` en modo corto para explicar al dev-lead por qué para
- THEN el párrafo, con 🦆, dice qué le pasa a quien exporta («una reserva de 10:00 sale en su calendario a las 08:00») antes que la causa técnica
- AND un término técnico que necesita, como UTC, se explica en la misma frase por su efecto

**ADDED — Una explicación larga sigue el camino real, paso a paso**
- GIVEN el molde `exportes`
- WHEN el dev-lead pide «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la respuesta son de 3 a 9 pasos numerados, cada uno respaldado por un fichero del molde, que siguen una exportación concreta (marzo, sala Norte) desde la orden hasta el fichero `.ics`
- AND usa las palabras del glosario («franja», «reserva»), no las del código (`slot`, `booking`)
- AND las rutas de fichero van solo en una lista final «Dónde mirar»
- AND termina ofreciendo resolver dudas

### Capacidad: `routing`

**ADDED — Una petición de explicar en llano entra por `sdd-rubber-duck`**
- GIVEN un proyecto con `.docs/sdd/` y el kit instalado
- WHEN el dev-lead escribe «Explícame cómo viaja una exportación de punta a punta, desde que la pido hasta que tengo el fichero»
- THEN la primera skill que se invoca es `sdd-kit:sdd-rubber-duck`
- AND «Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo.» sigue entrando por `sdd-kit:sdd-consult`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-08 | aprobada: «Apruebo (Recomendada)» |
