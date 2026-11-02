---
id: 20261102-163922-feature-0194-roadmap-whats-next
feature: 0194
title: sdd-roadmap, entrada «qué sigue»
mode: full
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — `sdd-roadmap`, entrada «qué sigue»

🦆 Hoy, al escribir «qué sigue» con media familia sin acabar, el agente recomienda otra cosa y las piezas se quedan muertas. Con esto, en un roadmap con Exportar a Excel cerrada y Aviso semanal pendiente, «qué sigue» propone primero Aviso semanal, aunque Filtrar por aforo vaya antes en Now, y da su prompt. No ofrece Ranking de salas porque tiene rama abierta, ni Informe trimestral porque espera a Ranking, y dice por qué. Sin familia a medias, sigue el orden de Now. No escribe nada ni arranca nada.

Validación: agente — `validation.mode: field` en `sdd-kit.json`: se cierra con la batería y el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `planning` — requisito nuevo, la entrada «qué sigue»
- Modificadas: `routing` — requisito nuevo, «qué sigue» y «dame la siguiente» entran por `sdd-roadmap`

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna (dos ADDED, sin datos, contrato ni capacidad nueva) · tamaño: ~20 líneas de skill en 2 ficheros, más batería
- Mínimo razonable: ninguna — el repaso de coherencia está hecho, y los sujetos miden la conducta
```

1. **`using-sdd` y la `description` entran en el Scope.** Tu petición lo condicionaba a comprobarlo, y el RED lo da: «qué sigue» entró por `sdd-explore` 5 de 5, sin prompt. «dame la siguiente» sí entra por `sdd-roadmap`, 3 de 3.
2. **El turno de «qué sigue» da ya el prompt de la primera propuesta**, sin esperar a que elijas; nombrar otra da el de esa. Es lo que hace «dame el prompt de la <id>», y otra pregunta sería una parada más para una respuesta casi siempre igual.
3. **Tras Now, Next.** Con Now sin nada que ofrecer, sigue por Next. Tu alcance acababa en Now, y quedarse sin propuesta teniendo Next parecía peor.
4. **Tampoco se ofrecen**, y se dice por qué, una fila madre («partida en …») ni una de Later, que no da prompt. Tu petición nombraba las filas en curso y las bloqueadas.
5. **«Bloqueada» es la fila con «Tras» (2.x: «tras NNNN») aún sin cerrar**, o con 🔒. Una familia con solo piezas bloqueadas no adelanta a Now.
6. **Una fila en curso sin más familia no abre familia**: `parent:` y `proposal:` son lo único que agrupa, como en «What's next in the family» de `sdd-archive`.
7. **Una familia sin piezas empezadas no cuenta**: tener `proposal:` no basta; hace falta una pieza cerrada o en curso.
8. **Nombre de los escenarios y moldes**: `wn1`, `wn2`, `wn3`; `salas-3-family`, `salas-family-2x`, `salas-3-nofamily`, ya medidos en el RED.
9. **`sdd-explore` no se toca de entrada.** Su `description` trae «¿qué hacemos ahora?», que es parecida; solo cambia si el GREEN lo exige (Scope).
10. **Prueba del delta**: `sdd capability merge` sobre una copia: tres requisitos añadidos, sin rechazos.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos Sonnet, en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Lee el estado real con el paso 1, ramas `feature/*` incluidas — «una fila con rama abierta no se ofrece»
- Las dos formas — «Funciona en las dos formas: Now, Next y Later en 3.0.0, y "Próximo" en 2.x»
- Un RED limpio — «se mide con n = 3, sin que la petición del molde traiga la orden. El frente se saca solo si la spec lo marcó condicionado; si no, es un desvío y paras»
- Saldo de palabras — «queda igual o baja: mide contra el tope nominal, 3.600, sin margen, y lista lo que lo paga»

## Intent

El dev-lead le pide a `sdd-roadmap` la siguiente tarea al acabar una pieza, se va a otra cosa y quedan tareas muertas (2026-10-16). `sdd-archive` ya recuerda la familia al cerrar (feature 0149); falta la entrada para cuando se pide después.

Medido antes de esta spec, con 8 sujetos Sonnet y 0,98 $ (`red/out/`):

| Escenario | Molde | Puerta | Conducta |
| --- | --- | --- | --- |
| `wn1` «qué sigue» | familia a medias, 3.0.0 | `sdd-explore` 3/3 | 0/3: ninguno propone la 0013 ni da prompt |
| `wn2` «dame la siguiente» | familia a medias, 2.x | `sdd-roadmap` 3/3 | 0/3: los tres dan la 0020 por orden; descartan bien la 0031 por su rama |
| `wn3` «qué sigue» | sin familia, 3.0.0 | `sdd-explore` 2/2 | 0/2: ninguno da prompt; uno recomienda un arreglo de la deuda |

Éxito: `wn1`, `wn2` y `wn3` llegan a su umbral sin que la petición traiga la orden, y las baterías de `sdd-roadmap` y `using-sdd` no bajan del suyo.

## Scope

- Entra: la entrada «What comes next» de `skills/sdd-roadmap/SKILL.md` y sus frases en la `description`.
- Entra: las dos frases en la fila de planificación de `skills/using-sdd/SKILL.md`.
- Entra: los tres escenarios, su rúbrica y su procedencia en `tests/batteries/sdd-roadmap/`, y un escenario de puerta en `tests/batteries/using-sdd/battery.md`.
- Entra, si el GREEN lo exige: acotar la `description` de `skills/sdd-explore/SKILL.md`, si «qué sigue» sigue entrando por ella con lo anterior.
- No entra: `sdd-archive`; la parte de la fila de deuda que no es de `sdd-roadmap`; arrancar nada ni escribir en el roadmap desde la entrada.

## Lo que se retira o cambia de forma

Lo que paga el saldo, 118 palabras. Cada línea repite una regla que se queda:

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Racionalización «The roadmap of my worktree is the real state» (34) | `skills/sdd-roadmap/SKILL.md:150` | Sale: queda la red flag de la línea 140 y el paso 1. Control: batería entera |
| Racionalización «I put the next free number to get ahead» (34) | `skills/sdd-roadmap/SKILL.md:151` | Sale: queda la red flag de la línea 138 y «Never a number by eye» del paso 4. Control: `id3` |
| Racionalización «The report says it fails and cites the line» (38) | `skills/sdd-roadmap/SKILL.md:152` | Sale: quedan las reglas de las líneas 120 y 121. Control: `m3` y `m3b` |
| «with «dame el prompt de la <id>», it gives only that prompt» (12) | `skills/sdd-roadmap/SKILL.md:14` | Sale: lo dice la entrada 1, «Nothing else». Control: `m1` y `m4` |

- Filas que implementa: 0194 → `roadmap.md` (sus menciones en 0152, 0198 y 0196 son dependencias que no cambian) y la fila de deuda «Al cerrar una pieza de una feature partida…», que `sdd-archive` marca al cerrar. Comprobado con `grep -n 0194 .docs/sdd/roadmap.md`.

## Approach

Una entrada más en «Which entry it is», justo tras «Give a row's prompt», de la que reutiliza la forma del prompt. El estado lo da el paso 1. La familia se reconoce como en «What's next in the family» de `sdd-archive`. Sin CLI nueva: es juicio sobre filas que el agente ya lee.

## Dónde se prueba

- Las tres conductas y las dos formas: `wn1`, `wn2` y `wn3`, sujetos sobre moldes, con puerta por máquina y rúbrica leída a mano.
- Puerta de las dos frases: `wn1`-`wn3`, y el escenario nuevo de `using-sdd`.
- No regresión: baterías enteras de `sdd-roadmap` y `using-sdd` (la `description` de una skill de entrada cambia); filas en prosa leídas a mano.
- Topes: `cli/test/kit/word-budget.test.ts`, en el gate de cierre.

## Términos y ADR

- Términos resueltos: familia a medias — filas con el mismo `parent:` o `proposal:`, con al menos una pieza cerrada o en curso.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `planning`

#### ADDED — «Qué sigue» propone primero las piezas abiertas de una familia a medias

- GIVEN el molde `salas-3-family`, con `ROADMAP.md`: en Now, 0020 y 0021 ⏳ sin familia, y 0012 ✅ de la propuesta 0010; en Next, 0022 ⏳ sin familia, y de la propuesta 0010, 0014 ⏳ con la rama `feature/0014-room-ranking` abierta, 0015 ⏳ tras 0014 y 0013 ⏳ tras 0012
- WHEN el usuario escribe «qué sigue» o «dame la siguiente»
- THEN `sdd-roadmap` propone primero la 0013, por delante de 0020 y 0021, y da su prompt de arranque en la forma de `launch-prompt-template.md`
- AND dice que la 0014 no se ofrece porque tiene rama abierta, y la 0015 porque espera a la 0014
- AND no escribe, no reserva, no publica ni commitea, y no arranca nada
- AND en un roadmap 2.x, con 0030 «partida en 0031, 0032 y 0033» en «Próximo», 0031 con `parent: 0030` y la rama `feature/0031-room-tariff` abierta, 0032 con `parent: 0030`, tras 0031, y 0033 con `parent: 0030`, por detrás de 0020 y 0021, propone primero la 0033, no ofrece 0030, 0031 ni 0032 y dice por qué, y no crea `ROADMAP.md`

#### ADDED — Sin familia a medias, «qué sigue» sigue el orden de Now

- GIVEN el molde `salas-3-nofamily`: en Now, 0019 ⏳ con la rama `feature/0019-favorite-rooms` abierta, 0020 y 0021 ⏳; en Next, 0012 y 0013 ⏳ de la propuesta 0010, sin ninguna pieza empezada
- WHEN el usuario escribe «qué sigue»
- THEN `sdd-roadmap` propone primero la 0020 y da su prompt
- AND dice que la 0019 no se ofrece porque tiene rama abierta
- AND con Now sin nada que ofrecer, sigue por Next; una fila de Later no se ofrece; sin nada que ofrecer, lo dice

### Capacidad: `routing`

#### ADDED — «Qué sigue» y «dame la siguiente» entran por `sdd-roadmap`

- GIVEN un proyecto con `.docs/sdd/` y el hook de sesión activo
- WHEN el usuario escribe «qué sigue» o «dame la siguiente», sin nombrar ninguna skill
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`, no `sdd-kit:sdd-explore`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-roadmap/SKILL.md` | 3.560 / 3.600 nominal | 40 | sin cambio; saldo ≤ 3.560 (entrada y `description` ≤ 118, lo que se retira) |
| `skills/using-sdd/SKILL.md` | 535 / 570 nominal | 35 | sin cambio; ~6 palabras más |
| `skills/sdd-explore/SKILL.md` (si el GREEN lo exige) | 1.037 / 1.100 nominal | 63 | sin cambio |

## Previsión de coste

A ~0,20 $ por sujeto Sonnet (7,61 $ en 39 sujetos, walkthrough de la 0276; el RED de esta salió a 0,12 $).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED, ya hecho | 8 (`wn1`-`wn3`) | 0,98 |
| GREEN | 8 (`wn1`-`wn3`) | 1,60 |
| Una tanda de REFACTOR | 8 | 1,60 |
| Controles | 26 (`sdd-roadmap` sin `wn`) + 46 (`using-sdd`) | 14,40 |
| Medición tras la revisión final | 8 | 1,60 |
| Suma | 104 | 20,18 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
