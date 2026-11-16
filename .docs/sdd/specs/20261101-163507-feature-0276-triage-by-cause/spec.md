---
id: 20261101-163507-feature-0276-triage-by-cause
feature: 0276
parent: 0151
proposal: 0131
title: Triaje de la deuda por causa
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — Triaje de la deuda por causa

🦆 Hoy, dos tickets que cuentan el mismo problema con palabras distintas se quedan en filas sueltas, cada una esperando su segundo caso. Con este cambio, al triar se anota la causa de cada fila, con una lista cerrada, y el segundo caso se busca por lo que lo resolvería. Por ejemplo, «las salidas de `DRY_RUN=1` no aparecen» y «copiar el molde da `ENOENT`» son los dos un `RUNS_DIR` demasiado largo: se juntan en una sola fila de «Lista», con el remedio a mano («lanza desde `D:\r`») y el tipo de arreglo. Un `/tmp` borrado también viene del entorno de la máquina, pero se arregla de otra forma y no cuenta como segundo caso. `sdd roadmap check` rechaza una causa fuera de la lista.

Validación: agente — son plantilla, CLI y texto de skill, sin pantalla; el uso real llega por los tickets (`validation.mode: field`).

## Capacidades

- Modificadas: `roadmap` — la forma de `debt.md` y lo que valida el check.
- Modificadas: `planning` — el triaje por causa, en las dos formas.
- Modificadas: `migration` — de dónde salen las celdas nuevas de la deuda.
- Modificadas: `feature-flow` — quien depura busca el fallo en la deuda.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: Opus con los siete puntos y Sonnet con la lente técnica (dev-lead: «1y2») — señales: contrato público (la forma de `debt.md`, que leen el check y `sdd-archive`), `MODIFIED`, datos o migración (paso 3 de `v3.0.0.md`) · tamaño: ~200 líneas en 17 ficheros

1. **⚠ Dos valores más de los que fijó el dev-lead, y es lo único de esta lista que cambia una decisión tuya.** Añado las causas `defecto del producto` y `sin determinar`, y `—` como «Arreglo» solo para `defecto del producto`. Tus siete causas y tus cuatro tipos se quedan intactos. Sin esto, el check obliga a inventar: `debt-template.md` rige en los proyectos, y «`--planta 2` lista salas de la planta 1» no encaja en ninguna de las siete, ni un CSV sin reproducir tiene causa conocida. `sin determinar` solo vale en «En espera» y «Descartadas»: una fila no llega a «Lista» sin causa.
2. **La fila de problema es una fila de «Lista», sin sección nueva.** Una quinta sección obligaría a cambiar el cierre, el `**Salda:**` y la equivalencia con `**Actuar**`, sin dar nada que la columna no dé.
3. **Cada enlace distinto de «Origen» es un caso.** Dos hallazgos de un mismo ticket se enlazan con anclas distintas, y el mismo enlace repetido cuenta una vez. Un caso con ticket y walkthrough lleva uno solo en «Origen»; el otro va en «Evidencia». Dos o más casos hacen la fila de problema.
4. **La categoría orienta la búsqueda; el caso lo decide el mecanismo.** Dos hallazgos son casos de la misma causa si los resolvería el mismo cambio concreto o el mismo remedio concreto. No cuentan como criterio `ninguno` ni un remedio de reintento (`relanza`, `reinicia`), porque juntarían todos los fallos intermitentes. Si el mecanismo es el mismo y la categoría difiere, la fila se reclasifica y cuenta. Es un matiz a la frase de la fila 0276 («el segundo caso se busca por la causa»): con solo la categoría, `RUNS_DIR` y `/tmp` serían un problema, y con categorías que se solapan, el caso de la fila podría no juntarse.
5. **Definición y desempate de las causas**, en la ayuda de `debt-template.md`, una línea por causa. Desempate: la causa es la raíz que desaparece con el remedio.
6. **Cabeceras** (los literales de la plantilla):
   - «Por triar» no cambia: lo recién llegado está sin decidir.
   - «En espera»: `| Ítem | Causa | Origen | Impacto | Falta | Fecha |`
   - «Lista»: `| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |`
   - «Descartadas»: `| Ítem | Causa | Origen | Motivo | Fecha |`. Lleva causa porque un descartado también se busca como caso anterior.
7. **Valores de «Arreglo»**: `comprobación automática`, `conectar comprobación`, `mover regla`, `línea nueva`, en ese orden de preferencia. Los cuatro tipos son de la fila; las etiquetas cortas son mías.
8. **Causas literales**: las siete de la fila, en minúsculas (`entorno de la máquina`, `carga o paralelismo`, `herramienta del kit`, `regla lejos de su paso`, `decisión que no era del agente`, `fusión de registros`, `prueba o molde`), más las dos de la decisión 1.
9. **«Remedio temporal»**: `—` solo vale con un caso. Con dos o más, lleva el remedio, o `ninguno` si se buscó y no lo hay; «no lo he buscado» no vale, y `c1` lo mide donde el ticket da el remedio.
10. **Una fila de «Lista» con prefijo `**[… saldada …]**` no exige causa ni arreglo.** Solo llegan así las filas migradas, y ya están resueltas; inventarles un arreglo no da nada.
11. **Mensajes nuevos del check**: los literales están en el delta de `roadmap`.
12. **La forma 2.x no se valida; va en «Destino», tras la marca viva**: `**Actuar** → 0012 · causa: herramienta del kit · arreglo: mover regla · remedio: <texto>`, `**Esperar 2.º ticket** · causa: <causa> — falta <qué>` y `**Descartada** · causa: <causa>: <motivo>`. El check no lo comprueba porque las filas 2.x anteriores no lo llevan, y este repo tiene cientos. Una fila sin causa la gana cuando se toca, leyendo sus tickets.
13. **Migración**: «Causa», «Arreglo» y «Remedio temporal» salen de la marca 2.x, y «Falta» y «Motivo» se extraen sin esas marcas. Sin marca, la tabla propone causa y arreglo leyendo el «Ítem», marcados como propuesta, y el dev-lead los aprueba en el gate: no se deducen en silencio. Si rechaza la causa, la fila va a «Por triar». «Remedio temporal» es `—`, y con dos o más casos la tabla lo pregunta.
14. **No hace falta migrar ningún `debt.md` existente**: la 3.0.0 no está publicada (`plugin.json` en 2.3.4), así que ningún proyecto tiene la forma anterior.
15. **Palabras de `sdd-roadmap`**: el tope no sube. Lo nuevo se paga quitando repeticiones de reglas que siguen en la skill (Scope); no quita ninguna instrucción, y `m3` y `m5` quedan como control.
16. **La 0276 no reescribe la deuda de este repo.** Sus filas ganan causa al migrar a la 3.0.0 o al triarse.
17. **`sdd-debugging` busca el primer error en la deuda antes de investigar.** Hoy no lee la deuda: solo `sdd-worktrees` y `sdd-archive` la buscan, y solo por un error de la suite. Sin esto, el remedio temporal se escribe y casi nadie lo lee. El remedio no sustituye a la causa raíz: si lo resuelve, se dice y la fila sigue abierta. La regla entra con su RED (`d2`).
- Política de modelos: revisores ya corridos (Opus con siete puntos, Sonnet con la lente técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura sonnet+high · sujetos de la batería en Sonnet, uno tras otro (`MAX_PARALLEL=1`) · sin otros despachos en paralelo

### Hallazgos de la review

- **Aceptado** — El vocabulario no cubre un defecto de producto ni una causa desconocida → decisión 1, que elevo en el gate.
- **Aceptado** — Las categorías se solapan → decisiones 4 y 5.
- **Aceptado** — «Mismo arreglo o remedio» no distingue, y un remedio genérico junta todo → decisión 4, con un negativo `relanza` en `c1`.
- **Aceptado** — `MODIFIED` no declarado del triaje; búsqueda sin la tanda actual; camino de un descartado → delta `planning`.
- **Aceptado** — Sin escenario 2.x de 2.º caso → `c2`.
- **Aceptado** — Conteo de enlaces sin definir; `ninguno` sin contraejemplo → decisiones 3 y 9, y delta `roadmap`.
- **Aceptado** — La forma 2.x propuesta no era la viva, y «Falta» y «Motivo» arrastrarían las marcas → decisiones 12 y 13, y `MODIFIED` del aviso.
- **Aceptado** — Fila saldada sin arreglo real → decisión 10.
- **Aceptado** — `debt.md` ya existentes → decisión 14.
- **Aceptado** — GIVEN de la migración y «Arreglo» esperado sin fijar; THEN que no era exhaustivo → delta.
- **Aceptado** — Índices de columna y avisos de caducidad sin ancla → «Dónde se prueba».
- **Aceptado** — `keyed.ts` y `claim.ts`; `-cause` sin nombrar → «Lo que se retira».
- **Rechazado** — Renombrar «sin inventar celdas» → lo propuesto va marcado y pasa por el gate, así que no se inventa; el título es la clave de fusión.
- **Aceptado** — Meter `sdd-debugging` o quitar el `/tmp` del Intent → decisión 17, tras preguntártelo.

### Decisiones tomadas con el dev-lead

- La lista de causas y los cuatro tipos de arreglo son los de la fila 0276 — «La lista de causas y los cuatro tipos de arreglo son los de la fila, porque los fijó el dev-lead al revisar el triaje.» La decisión 1 propone ampliarla y necesita tu aprobación.
- Review de la spec — «1y2», interpretado como Opus con los siete puntos y Sonnet con la lente técnica.
- La spec se aprueba con la lista de causas ampliada y `sdd-debugging` dentro — «1», a la opción «Apruebo, y mete la línea de `sdd-debugging`» (2026-11-01).

## Intent

Hoy el triaje compara palabras: «bash de Windows con la máquina cargada» salió en unos 10 hallazgos de 6 tickets (0216, 0228, 0230, 0231, 0233, 0237), repartidos en filas sueltas, y el `/tmp` roto lo investigaron tres sesiones por separado. En el RED de esta spec (`red/out/`), con dos tickets sobre un `RUNS_DIR` largo contados con palabras distintas, un sujeto de dos no los relacionó, y el otro los juntó sin causa escrita y sin dejar el remedio en la fila.

El éxito: esos dos tickets acaban en una sola fila de «Lista» con su causa, su remedio y su arreglo, y `sdd roadmap check` rechaza una causa o un arreglo fuera de la lista. Fracasaría, aunque el check pasara, si la categoría sola juntase problemas distintos, o si el check obligase a inventar una causa. También fracasaría si el remedio quedase escrito y quien depura no lo encontrase: por eso `sdd-debugging` busca en la deuda (decisión 17).

## Scope

- Entra:
  - `skills/sdd-templates/templates/debt-template.md`: las cabeceras, los dos vocabularios y la definición de cada causa.
  - `cli/src/roadmap/debt.ts` y sus tests (`cli/test/roadmap/debt.test.ts`, `project.ts`, `check.test.ts`).
  - `skills/sdd-roadmap/SKILL.md`: la causa, el segundo caso, el remedio y el orden de arreglo, en la forma 3.0.0 y en la 2.x. Salen, para pagarlo, la red flag «You're about to propose in «Lista» an item you didn't reproduce…» y las racionalizaciones «The size is not clear», «The 0012 is discarded» y «The notes are already reflected», que repiten una línea que se queda.
  - `skills/sdd-debugging/SKILL.md`, Fase 1: la búsqueda en la deuda, con su escenario `d2` en `tests/batteries/sdd-debugging/`.
  - `skills/sdd-upgrade/references/migrations/v3.0.0.md`, paso 3: de dónde salen las celdas nuevas.
  - Los moldes con la forma vieja: `tests/batteries/sdd-roadmap/mold-salas-3*`, `tests/batteries/sdd-archive/subject.mjs`, y las rúbricas de `sdd-roadmap` y `sdd-upgrade`; el molde nuevo `salas-cause-2x`.
- No entra:
  - El repaso por causa de cada release (0277).
  - Una sección nueva en `debt.md`.
  - Validar la forma 2.x.
  - Reescribir la deuda de este repo (decisión 16).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Cabecera de «En espera» | `debt-template.md`; `cli/src/roadmap/debt.ts:10`; `cli/test/roadmap/project.ts:51`; `capabilities/roadmap.md:153`; moldes `mold-salas-3`, `-plain`, `-wt` y `-cause`; `tests/batteries/sdd-archive/subject.mjs:357` | Scope; delta `roadmap`, `MODIFIED` |
| Cabecera de «Lista» | Los mismos, en sus líneas; `cli/test/roadmap/debt.test.ts:44,74`; `cli/test/roadmap/check.test.ts:436` | Scope; delta `roadmap`, `MODIFIED` |
| Cabecera de «Descartadas» | Los mismos | Scope; delta `roadmap`, `MODIFIED` |
| Filas de fixture con la forma vieja | `cli/test/roadmap/debt.test.ts:4-6`; `project.ts`; `check.test.ts:433-466` | Scope |
| «`**Esperar 2.º ticket**`, with what is missing» | `skills/sdd-roadmap/SKILL.md:28-29` | Se queda; la línea de triaje dice qué se añade |
| Las cabeceras en `registries.slow.test.ts` y `claim-fixture.ts` | Filas sueltas, sin validar la forma | Quedan: no pasan por `debt.ts` |
| Columna insertada tras «Ítem» | `cli/src/merge/keyed.ts` (clave en la columna 0); `cli/src/ids/claim.ts:39` (no mira columnas) | Quedan: «Ítem» sigue primera |
| Forma de `**Actuar**` con sufijo `· causa:` | `cli/src/roadmap/warnings.ts`; `capabilities/roadmap.md`, «El roadmap 2.x avisa…» | Delta `roadmap`, `MODIFIED`; un test fija que el aviso la reconoce |
| «Por triar» en `sdd-archive/references/records.md:14`, `sdd-init` | Sin cambio de forma | Quedan: «Por triar» no cambia |

- Filas que implementa: 0276 → su fila, `.docs/sdd/roadmap.md:109`, se marca en el cierre; las demás filas que la nombran (como la 0277, «tras 0276») quedan igual. Comprobado con `grep -n 0276 .docs/sdd/roadmap.md`.

## Approach

Plantilla y `debt.ts` primero, con sus tests; `HEADERS` y los índices de columna cambian, y dos `Set` guardan los vocabularios. Después la skill y su batería (`c1` nació para el RED), y por último la migración con el escenario `v1` de `sdd-upgrade`.

En la skill, la regla va en la sección Triage, en el paso donde se decide, y lleva las causas escritas: una regla que solo vive en una referencia no se lee (feature 0146).

## Dónde se prueba

- Forma nueva de `debt.md`: `cli/test/roadmap/debt.test.ts`, como los tests de forma actuales, por `sdd roadmap check`; cada índice de columna nuevo queda anclado por un test, y los avisos de caducidad también.
- Causa y arreglo fuera de la lista, y fila de problema sin remedio: el mismo fichero.
- La plantilla nombra cada causa y cada arreglo que admite el check: el mismo fichero, junto a «the debt template without its help passes».
- Triaje por causa: `c1` de la batería de `sdd-roadmap`, 2 sujetos.
- 2.º caso en 2.x: `c2`, molde nuevo `salas-cause-2x`, 2 sujetos.
- Triaje 2.x con causa: `m6`, con la rúbrica ampliada.
- Aviso de fila cerrada con el sufijo: `cli/test/roadmap/check.test.ts`.
- Sin regresión de las reglas cuyas repeticiones salen: `m3` y `m5`.
- El remedio se encuentra al depurar: `d2` de la batería de `sdd-debugging`, 2 sujetos.
- Migración: `v1` de la batería de `sdd-upgrade`, con la rúbrica V3 ampliada.
- `sdd-archive` con la forma nueva: `a9`, por el molde que cambia.

## Términos y ADR

- Términos resueltos: **causa** — categoría del vocabulario cerrado; **mecanismo** — el cambio concreto o el remedio concreto que resolvería el hallazgo; **fila de problema** — fila de «Lista» con dos o más casos enlazados en «Origen»; **remedio temporal** — lo que resuelve el fallo mientras no está arreglado (el «error conocido» de ITIL).
- ADR candidatas: ninguna. La fila de problema dentro de «Lista» se deshace barato.

## Delta de comportamiento

### Capacidad: `roadmap`

#### MODIFIED — `debt.md` tiene una sección por estado, y «Lista» exige evidencia

- REMOVED GIVEN un `.docs/sdd/steering/debt.md` con `## Por triar` en la línea 3 y el párrafo «Revisar cada lunes» en la línea 4; `## Lista` en la línea 9, con la fila «`libres --planta 2` lista salas de la planta 1» y «Evidencia» `—` en la línea 12; `## En espera` en la línea 15; y `## Descartadas`, con una fila cuya «Fecha» es `ayer` en la línea 21
- GIVEN un `.docs/sdd/steering/debt.md` con `## Por triar` en la línea 3 y el párrafo «Revisar cada lunes» en la línea 4; `## Lista` en la línea 9, con la fila «`libres --planta 2` lista salas de la planta 1», «Causa» `defecto del producto` y «Evidencia» `—` en la línea 12; `## En espera` en la línea 15; y `## Descartadas`, con una fila con «Causa» `sin determinar` y «Fecha» `ayer` en la línea 21
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: línea 4: prosa en «Por triar»; debt.md solo lleva tablas`, `debt.md: línea 12: fila de «Lista» sin «Evidencia»`, `debt.md: línea 15: «En espera» va antes que «Lista»` y `debt.md: línea 21: «Fecha» «ayer» no es AAAA-MM-DD`, y sale con 1
- AND el orden de las secciones es «Por triar», «En espera», «Lista» y «Descartadas»
- REMOVED AND una cabecera que no es la de su sección da `debt.md: línea <n>: la cabecera de «<sección>» debe ser «<cabecera>»`, con `| Ítem | Origen | Fecha |` en «Por triar», `| Ítem | Origen | Impacto | Falta | Fecha |` en «En espera», `| Ítem | Origen | Impacto | Evidencia | Destino |` en «Lista» y `| Ítem | Origen | Motivo | Fecha |` en «Descartadas»
- AND una cabecera que no es la de su sección da `debt.md: línea <n>: la cabecera de «<sección>» debe ser «<cabecera>»`, con `| Ítem | Origen | Fecha |` en «Por triar», `| Ítem | Causa | Origen | Impacto | Falta | Fecha |` en «En espera», `| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |` en «Lista» y `| Ítem | Causa | Origen | Motivo | Fecha |` en «Descartadas»
- AND una sección que falta da `debt.md: falta la sección «<sección>»`, y una «Evidencia» vacía da el mismo fallo que `—`
- AND una fila de «Lista» con «Destino» vacío o `—` da `debt.md: línea <n>: fila de «Lista» sin «Destino»`
- AND sin `debt.md` no hay ninguna línea `debt.md:`, y `debt-template.md` calcada sin sus bloques de ayuda escribe `Roadmap válido`

#### MODIFIED — El roadmap 2.x avisa de una fila que apunta a una tarea ya cerrada

- GIVEN un roadmap 2.x con la fila `0149` ✅ en «Próximo», la fila `0047` ⏳ en la línea 12 con «**Absorbida por la propuesta 0131 → 0149**», la fila `0048` ⏳ con «**Absorbida por la propuesta 0131 → 0149 y 0150**» y la `0150` ⏳, y en «Deuda técnica» una fila de la línea 30 con «Destino» `**Actuar → 0149**, patch de la CLI` sin prefijo de cierre en su «Ítem»
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 12: apunta a 0149, ya ✅: sáldala` y `roadmap.md: aviso: línea 30: apunta a 0149, ya ✅: sáldala`, y ningún aviso de la fila `0048`, porque la `0150` no está ✅
- AND una fila «Absorbida» o de deuda cuya «Ítem» ya empieza por `**[Feature <id>, <fecha>: saldada — …]**` no avisa, ni una cuyo destino está 🧪
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0
- AND un «Destino» `**Actuar** → 0149 · causa: herramienta del kit · arreglo: mover regla` avisa igual

#### ADDED — Cada fila triada de `debt.md` lleva una causa de la lista, y «Lista» un tipo de arreglo

- GIVEN un `debt.md` con una fila de «En espera» con «Causa» `mala suerte` en la línea 8, una de «Descartadas» con «Causa» `—` en la línea 20, y en «Lista» una con «Causa» `prueba o molde` y «Arreglo» `más cuidado` en la línea 14, otra con «Causa» `sin determinar` en la línea 15 y otra con «Causa» `prueba o molde` y «Arreglo» `—` en la línea 16
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe, entre otras, `debt.md: línea 8: causa «mala suerte» no admitida: entorno de la máquina, carga o paralelismo, herramienta del kit, regla lejos de su paso, decisión que no era del agente, fusión de registros, prueba o molde, defecto del producto, sin determinar`, la misma línea para la 20 con `causa «—»`, `debt.md: línea 14: arreglo «más cuidado» no admitido: comprobación automática, conectar comprobación, mover regla, línea nueva`, `debt.md: línea 15: una fila de «Lista» no admite la causa «sin determinar»` y la misma de arreglo para la 16 con `arreglo «—»`, y sale con 1
- AND una fila de «Lista» con «Causa» `defecto del producto` y «Arreglo» `—` no da fallo de arreglo; una con «Causa» `defecto del producto` y «Arreglo» `más cuidado` da el fallo de arreglo
- AND una celda vacía da el mismo fallo que `—`
- AND una fila de «Lista» cuyo «Ítem» empieza por `**[Feature 0009, 2026-07-20: saldada — …]**` no exige causa ni arreglo
- AND una fila de «Por triar» no lleva causa y no da fallo
- AND `debt-template.md` nombra cada causa y cada arreglo que el check admite

#### ADDED — Una fila de problema lleva su remedio temporal

- GIVEN cuatro filas de «Lista» con «Remedio temporal» `—`: en la línea 14 con «Origen» `[ticket](a.md), [ticket](b.md)`, en la 15 con `[ticket](a.md#1), [ticket](a.md#2)`, en la 16 con `[ticket](a.md), [ticket](a.md)` y en la 17 con `[ticket](a.md)`; y otras dos con `[ticket](a.md), [ticket](b.md)`, una con `lanza desde D:\r` y otra con `ninguno`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: línea 14: fila de problema sin «Remedio temporal»` y la misma línea para la 15, y sale con 1
- AND las líneas 16 y 17 no dan ese fallo: el mismo enlace repetido cuenta una vez
- AND las filas con el remedio o con `ninguno` no dan ese fallo, y una celda vacía da el mismo fallo que `—`

#### Reglas de la capacidad — roadmap

- **Dónde viven los datos**: el roadmap 3.0.0, en `ROADMAP.md` de la raíz, con la forma de `now-next-later-template.md`; la deuda, en `.docs/sdd/steering/debt.md`, con la de `debt-template.md`, cuya ayuda define las causas y los tipos de arreglo que `sdd roadmap check` admite; el roadmap 2.x, en `.docs/sdd/roadmap.md`, con la de `roadmap-template.md`, cuyo bloque de ayuda de «Deuda técnica» guarda el formato de cierre que citan los cierres y el de «Release N», la cabecera de su tabla. Qué va en cada sección, en los bloques de ayuda de cada plantilla; lo comprueba `sdd roadmap check`.

### Capacidad: `planning`

#### ADDED — El segundo caso se busca por causa

- GIVEN el molde `salas-3-cause`: en «En espera», «Las salidas de `DRY_RUN=1` no aparecen en `out/`», con «Falta» `2.º caso`, cuyo ticket mide una ruta de 152 caracteres descartada en silencio por `out_path` y se resuelve con un `RUNS_DIR` en `D:\r`; en «Por triar», «Copiar el molde de una campaña falla con `ENOENT` en una carpeta que existe», cuyo ticket mide una ruta de más de 260 y se resuelve igual; «`/tmp` no existe en la sesión de Git Bash…», que se resuelve con `mkdir -p /tmp`; y dos filas que se resuelven con `relanza`: un `pnpm install` con la red caída y un test que agota su tiempo con la máquina cargada
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- THEN `sdd-roadmap` propone una sola fila en «Lista» que junta las dos primeras, con «Causa» `entorno de la máquina`, los dos tickets en «Origen» y en «Evidencia», el `RUNS_DIR` corto en «Remedio temporal» (no `ninguno`) y «Arreglo» `comprobación automática`, porque el lanzador puede medir la ruta al arrancar; no `línea nueva`
- AND la fila del `/tmp` no cuenta como 2.º caso, aunque comparte la causa: otro cambio y otro remedio son otro problema; se propone aparte, en «En espera» o en «Descartadas», con «Causa» `entorno de la máquina`
- AND las dos filas de `relanza` no se juntan: un remedio de reintento no es criterio
- AND el 2.º caso se busca en toda la deuda, también entre las filas de la tanda que se tría, y un hallazgo con el mismo mecanismo y otra categoría se reclasifica y cuenta

#### ADDED — En 2.x, el segundo caso también pasa la fila a `**Actuar**`

- GIVEN el molde `salas-cause-2x`, con `.docs/sdd/roadmap.md` 2.x, los dos tickets del `RUNS_DIR` de «El segundo caso se busca por causa» y, en «Deuda técnica», la fila de las salidas con «Destino» `**Esperar 2.º ticket** — falta 2.º caso`, sin causa
- WHEN el usuario pide «Tria el ticket docs/tickets/2026-10-20-copia-molde.md. Decide tú.»
- THEN esa fila queda con «Destino» `**Actuar** → sin fila · causa: entorno de la máquina · arreglo: comprobación automática · remedio: <RUNS_DIR corto>`, o con un id en lugar de `sin fila`, y enlaza los dos tickets
- AND no queda otra fila de «Deuda técnica» para el segundo ticket
- AND no crea `ROADMAP.md` ni `debt.md`

#### MODIFIED — El triaje propone el estado de cada ítem de la deuda

- GIVEN el molde `salas-3`, con `ROADMAP.md`; un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05` y `## [1.4.0] - 2026-09-01`; en «Por triar» de `debt.md`, dos filas del informe de QA `docs/qa/2026-10-12-informe.md`: «La exportación a CSV pierde las tildes desde la 1.4.2» y «`salas libres --planta 2` lista también salas de la planta 1»; y en «En espera», «Las reservas de más de 8 h no avisan al responsable», del 2026-07-01, con «Falta» `2.º caso`, con `## [1.3.0] - 2026-07-20` también en el changelog. En el molde, la exportación conserva las tildes y `node src/app.js libres --planta 2` devuelve `Norte (planta 1)`
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- REMOVED THEN `sdd-roadmap` no propone la fila del CSV en «Lista»: como no se reproduce, la propone en «En espera» con «Falta» `reproducirlo`
- THEN `sdd-roadmap` no propone la fila del CSV en «Lista»: como no se reproduce, la propone en «En espera» con «Falta» `reproducirlo` y «Causa» `sin determinar`
- REMOVED AND propone la fila de la planta en «Lista», con «Evidencia» `node src/app.js libres --planta 2` → `Norte (planta 1)` y un «Destino» no vacío: el id de una fila de Now o Next, nueva o existente, o `sin fila`
- AND propone la fila de la planta en «Lista», con «Causa» `defecto del producto`, «Evidencia» `node src/app.js libres --planta 2` → `Norte (planta 1)` y un «Destino» no vacío: el id de una fila de Now o Next, nueva o existente, o `sin fila`
- AND propone la fila de las 8 h, que `roadmap check` avisa que caduca, en «Descartadas» con el «Motivo» `caducada`; toda fila descartada lleva su motivo
- AND en `pair` y `delegate` no escribe en `debt.md` ni en `ROADMAP.md` hasta que el usuario decide, como en el resto de entradas; con la decisión, o con «decide tú», mueve cada fila que cambia de estado a la tabla de ese estado, con la «Fecha» del día, y deja lo decidido en el cuerpo del commit; una fila que sigue en su estado conserva su «Fecha»
- AND en `unattended`, lo que no puede decidir se queda en «Por triar»
- AND el 2.º caso de una fila descartada entra en «Por triar» como fila nueva, con los dos orígenes; y el `**Salda:**` de un brief solo nombra filas de «Lista»
- AND con `ROADMAP.md` y sin `debt.md`, el triaje crea `debt.md` calcando `debt-template.md`

#### MODIFIED — Sin `ROADMAP.md`, `sdd-roadmap` escribe la forma 2.x

- GIVEN el molde `salas`, con `.docs/sdd/roadmap.md` 2.x, sin `ROADMAP.md`, con un changelog cuya última versión es la 1.4.1 y el informe de QA de «El triaje propone el estado de cada ítem de la deuda»
- WHEN el usuario pide «Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú.»
- THEN cada ítem es una fila de «Deuda técnica» cuyo «Destino» empieza por `**Actuar**` (lo que iría a «Lista»), `**Esperar 2.º ticket**` (a «En espera», con lo que falta) o `**Descartada**` (con su motivo), y ninguna queda sin «Destino»
- AND la fila del CSV va a `**Esperar 2.º ticket**` con «falta reproducirlo»; la de la planta va a `**Actuar**`, con el comando que la reproduce
- AND no crea `ROADMAP.md` ni `debt.md`
- AND cada «Destino» lleva tras la marca `· causa: <causa>`, y el de `**Actuar**`, además, `· arreglo: <arreglo>`; con dos casos, `· remedio: <remedio>`

#### Reglas de la capacidad — planning

- **Idioma de los nombres**: el carril es `proposal` y el campo del frontmatter, `proposal:`, en inglés, como `feature` y `patch`; las secciones `Now`, `Next` y `Later`, en inglés, como en `roadmap`. El texto va en castellano, y también las etiquetas del brief (`**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**`, `**Toca:**`), los estados de la deuda, las causas, los tipos de arreglo y los literales del triaje (`reproducirlo`, `2.º caso`, `caducada`, `sin fila`, `ninguno`).

### Capacidad: `migration`

#### MODIFIED — La migración a v3.0.0 lleva la deuda a `debt.md` sin inventar celdas

- REMOVED GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente` y una saldada posterior a la última release cerrada
- GIVEN una «Deuda técnica» 2.x con una fila `**Actuar** → 0022` cuyo «Ítem» enlaza su ticket, una `**Actuar** → sin fila` sin evidencia, una `**Esperar 2.º ticket**`, una `**Descartada**: duplica la 0018`, una con destino `versión siguiente`, una saldada posterior a la última release cerrada, una `**Actuar** → 0030 · causa: prueba o molde · arreglo: mover regla`, y una `**Esperar 2.º ticket** · causa: fusión de registros — falta reproducirlo`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla
- THEN `.docs/sdd/steering/debt.md` tiene la primera en «Lista» con destino 0022 y el ticket como evidencia, y la saldada en «Lista» con su prefijo `**[… saldada …]**` intacto
- AND la de `sin fila` y la de `versión siguiente` están en «Por triar», la de `**Esperar**` en «En espera» y la `**Descartada**` en «Descartadas» con «duplica la 0018» como motivo
- AND cada «Fecha» es la del commit que añadió su fila al roadmap, y la tabla dice de dónde salió
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`
- AND la de la 0030 tiene «Causa» `prueba o molde` y «Arreglo» `mover regla`, y la de `fusión de registros` tiene esa «Causa» y «Falta» `reproducirlo`, sin las marcas
- AND las que no traen causa o arreglo los llevan propuestos en la tabla, marcados como propuesta, leyendo su «Ítem»; si el dev-lead rechaza la causa de una, esa fila va a «Por triar»
- AND el «Remedio temporal» sale de `· remedio:`; sin él, es `—` en una fila de un caso, y la tabla lo pregunta en una con dos o más enlaces

### Capacidad: `feature-flow`

#### ADDED — Quien depura busca el fallo en la deuda antes de investigar

- GIVEN el molde `remedy`: `npm run informe` falla con `ENOENT` sobre `.cache/informes/ocupacion.csv`, y en «Lista» de `debt.md` hay una fila de problema «El listado de ocupación no sale tras limpiar el repo», con «Remedio temporal» `recrea la carpeta de la caché`
- WHEN se invoca `sdd-debugging` para ese fallo
- THEN compara el fallo con las filas de la deuda por significado, no solo por las palabras del error, y dice que esa fila lo cubre, con su remedio
- AND aplicar el remedio no se da por causa raíz: la fila sigue abierta y el arreglo sigue pendiente
- AND sin una fila que lo nombre, sigue la Fase 1 sin cambios

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-debugging/SKILL.md` | 1.619 al abrir, 1.663 al cerrar / 1.600 | −19 | 1.700: decisión del dev-lead («1», 2026-11-01) |
| `skills/sdd-roadmap/SKILL.md` | 3.584 / 3.600 | 16 | sin cambio: lo que entra (~140 palabras) lo pagan las repeticiones que salen (~140) |

## Previsión de coste

Precio medido: `c1`, 0,16 $ por sujeto en el RED. `sdd-upgrade` `v1` es más larga: estimación de 2 $ por sujeto, sin medir en esta sesión. `a9` de `sdd-archive`, estimación de 1 $.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `c1` × 2 (`sdd-roadmap`), ya corrido; `d2` × 2 (`sdd-debugging`) | 0,82 |
| GREEN | `c1` × 2, `c2` × 2, `m6` × 2 (`sdd-roadmap`), `d2` × 2 (`sdd-debugging`), `v1` × 1 (`sdd-upgrade`) | 3,8 |
| Una tanda de REFACTOR | `c1` × 2, `m6` × 2 | 1 |
| Controles | `m3` × 2, `m5` × 2 (`sdd-roadmap`), `a9` × 1 (`sdd-archive`) | 2 |
| Medición tras la revisión final | `c1` × 1 | 0,2 |
| Suma | | 7,82 |

## Enmiendas

- 2026-11-01 — El tope de `sdd-debugging` sube a 1.700, y `sdd-roadmap` retira cuatro racionalizaciones más («Prepara la release», «The minutes' triage», «The client said everything», «I carry all the technical debt»), que repetían una línea que se queda — no cabía con lo previsto — aprobada: «1».
- 2026-11-01 — `feature-flow`: la fila del molde cuenta el fallo con otras palabras, y el THEN compara por significado, en lugar de buscar el primer error — con el literal en la fila, 2/2 la encontraban por `grep` y el RED no medía nada; con otras palabras, 1 de 2 no mira la deuda — aprobada: «1».
- 2026-11-01 — `migration`: en el molde, la fila con marcas apunta a la 0022 (`0030` no existe en el molde); el GIVEN se lee con ese id — sin aprobar (dato de molde).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo, y mete la línea de `sdd-debugging`») |
