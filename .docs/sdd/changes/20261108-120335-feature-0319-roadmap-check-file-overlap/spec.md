---
id: 20261108-120335-feature-0319-roadmap-check-file-overlap
feature: 0319
title: sdd roadmap check avisa de dos filas abiertas que tocan los mismos ficheros sin «tras» entre ellas
mode: full
profile: delegate
status: approved
created: 2026-11-08
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — sdd roadmap check avisa de dos filas abiertas que tocan los mismos ficheros sin «tras» entre ellas

🦆 Hoy dos filas pendientes del roadmap pueden tocar el mismo fichero sin que ninguna diga «tras» la otra; se lanzan a la vez en dos worktrees y chocan al fusionar, como pasó al repartir la 0301. Con esta feature, `sdd roadmap check` lo avisa con una línea por par, p. ej. `roadmap.md: aviso: línea 157: la 0297 y la 0311 (línea 156) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md` sin «tras» entre ellas`, y sigue terminando en `Roadmap válido`: es un aviso, no un fallo, porque el dev-lead puede lanzarlas en paralelo a sabiendas. Calla si las dos ya están ordenadas por una cadena de «tras» (o «antes de», en la 2.x). Sobre el roadmap de hoy salen 6 avisos.

Validación: agente — `validation.mode: field` en `.docs/sdd/sdd-kit.json` (regla 3 de `CLAUDE.md`): cierro con la verificación propia (Vitest, el gate de cierre y `sdd roadmap check` sobre el roadmap de `develop`) registrada como «Validación en campo», y el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `roadmap` — un requisito nuevo, el aviso de solape entre filas abiertas, y la regla **Avisos** lo nombra.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (las líneas de `sdd roadmap check` las leen `sdd-roadmap`, `sdd-archive` y `sdd-end-release`) · tamaño: ~180 líneas en 5 ficheros (`overlap.ts` nuevo, `check.ts`, tests de `cli/test/roadmap/`)
- Dominio (sonnet): si la orden del par (decisiones 4 y 5) y las filas que cuentan (decisión 2: solo ⏳ y 🔄) callan los pares que no se pueden lanzar a la vez y nada más, y si el THEN del requisito nuevo contradice «Un id repetido se avisa sin fallar» o la regla **Avisos** (señal: contrato público)
- Técnica (sonnet): si la lectura de rutas (decisión 3) y la regla de carpeta (decisión 6) aguantan las filas reales de `roadmap.md` y de los moldes de `tests/batteries/`, y si el orden de las líneas de salida (decisión 8) rompe a quien las lee (señal: contrato público)
- Mínimo razonable: un revisor de siete puntos (sonnet) — deja sin la segunda lectura las filas reales que el patrón de «tras» no reconoce, que es donde el aviso daría ruido
```

1. **Dónde vive (decisión central).** Un módulo nuevo, `cli/src/roadmap/overlap.ts`, con una función que recibe filas ya leídas (id, línea, estado, rutas, ids de «tras» y de «antes de») y devuelve los avisos, y dos lectores, uno por forma: el de la 2.x lee las filas de `openRows` (`tables.ts`) y el de la 3.0.0 las de Now y Next de `ROADMAP.md`. `check.ts` los llama en `twoPointRoadmapReport` y en la rama de `ROADMAP.md` de `roadmapReport`. Descartadas: meterlo en `roadmapWarnings` de `warnings.ts`, porque la 3.0.0 no pasa por ahí (`roadmapReport` solo le añade `duplicateIdWarnings`) y habría que repetirlo en la otra rama; y dejarlo al texto de `sdd-roadmap`, porque es mecánico (Principio 4) y ese texto es de la 0308.
2. **Qué filas se comparan.** Las abiertas que se pueden lanzar: estado `⏳` o `🔄`, todas contra todas. En la 2.x, las de «Próximo» y las de cada `## Release <N>` con su cabecera de plantilla (las de `openRows`), también una de «Próximo» contra una de una release y dos releases entre sí; en la 3.0.0, las de Now y Next, también Now contra Next. No cuentan `⏸️ aparcada`, `✅`, `🧪` (ya fusionada) ni Later, en ninguna forma. Dos filas con el mismo id no se comparan entre sí, porque ese caso ya lo avisa «Un id repetido se avisa sin fallar»; salvo `0000`, el comodín de «sin ticket», que son filas distintas y se comparan. Con `ROADMAP.md` y `.docs/sdd/roadmap.md` a la vez solo se compara `ROADMAP.md`, el que se lee (regla ante conflicto vigente, sin cambio).
3. **Qué rutas lee.** Solo el texto entre comillas invertidas que es una ruta: sin espacios y con `/` o `.` (`skills/sdd-verify/`, `upstream.json`; no `sdd roadmap check` ni `REMOVED`). Se normaliza `\` a `/` y se quita un `./` inicial; mayúsculas y minúsculas cuentan. Dónde: en «Próximo» (2.x), tras el **último** «Ficheros:» de la celda «Ítem», con esa mayúscula (la 0319 nombra «Ficheros:» en su prosa antes del suyo), y una fila sin «Ficheros:» no tiene rutas aunque cite ficheros en la prosa; en `## Release <N>`, la celda «Ficheros que toca» entera; en la 3.0.0, tras `**Toca:**` hasta `</details>`, y una fila sin `**Toca:**` no tiene rutas. El texto sin comillas («sus tests», «y esas skills») no cuenta: el aviso calla antes que adivinar. Límite conocido: un token con punto que no es ruta (`ids.mode`) cuenta como ruta.
4. **Qué ordena un par (2.x).** `tras` o `antes de`, sin distinguir mayúsculas y como palabra entera (no dentro de «atrás»), con un `la ` o `el ` opcional, seguidos de una lista de ids de cuatro cifras separados por `, `, ` y ` o ` e `: «tras 0302 y 0304», «Fila tras la 0195», «antes de 0284 y 0198». Puede haber varias listas en la fila. Se busca en las celdas entre el id y el estado, salvo «Ficheros que toca» en una release. «antes de NNNN» cuenta: «la 0320 antes de 0311» ordena el par igual que «la 0311 tras 0320». Medido sobre `roadmap.md` en `f75f0115`: con o sin «antes de», los mismos 6 avisos; entra porque sin él una fila que solo dice «antes de» daría un aviso falso. Límite conocido, en los dos sentidos: otra forma («después de 0150», «tras las features de la cola») no ordena y da un aviso de más; y una mención en prosa que casa el patrón pero dice lo contrario («no va tras 0310») ordena el par y el aviso falta.
5. **Qué ordena un par (3.0.0), y con cadena.** En `ROADMAP.md`, solo la columna «Tras» (ids separados por comas, como la lee hoy `afterProblems`); la plantilla no tiene «antes de». En las dos formas, el par calla si una llega a la otra por una cadena de «tras»: si A va tras B y B tras C, A y C no se lanzan a la vez y no avisan. La cadena pasa por las filas de cualquier estado de las tablas que se leen. Medido sobre `roadmap.md` en `f75f0115`: con cadena o solo directa, los mismos 6 avisos; entra porque el Intent llama fracaso a avisar un par ya ordenado.
6. **Cuándo se solapan dos rutas.** Son iguales, o una es carpeta de la otra hasta su `/`: `skills/sdd-verify/` y `skills/sdd-verify` cubren `skills/sdd-verify/references/spec-reviewer-prompt.md`, y `skills/sdd-verify` no cubre `skills/sdd-verify-old/x.md`. Sin profundidad mínima: `skills/` cubre todas las skills, y eso es lo que el aviso tiene que decir. La ruta que sale en el aviso es la de dentro, la más larga del par que se solapa; varias, separadas por `, ` y sin repetir.
7. **El texto del aviso**: `<fichero>: aviso: línea <n>: la <id> y la <id-anterior> (línea <m>) tocan `<ruta>`[, `<ruta>`…] sin «tras» entre ellas`, en la línea de la fila de más abajo, como el del id repetido («ya está en la línea 12»). La línea del aviso es siempre el primer `línea <n>:`; la otra va entre paréntesis.
8. **Dónde sale.** Tras los avisos que ya da cada forma: en la 2.x, tras el prefijo de cierre, «apunta a…» y el id repetido; en la 3.0.0, tras el roadmap que no se lee y el id repetido; y siempre antes de los de `debt.md`. Entre ellos, por la línea del aviso y después por la de la otra fila. No cambia el código de salida: sin fallos, 0 y `Roadmap válido`.
9. **Lo que da hoy, medido** con un borrador de estas reglas en el scratchpad sobre `roadmap.md` de `develop` en `f75f0115` (15 filas abiertas, 10 con rutas), igual con cadena y sin ella:
   - línea 147: la 0310 y la 0308 (línea 145) tocan `skills/sdd-roadmap/`, `skills/sdd-config/`
   - línea 147: la 0310 y la 0309 (línea 146) tocan `skills/sdd-templates/`
   - línea 149: la 0314 y la 0310 (línea 147) tocan `skills/sdd-grilling/`
   - línea 149: la 0314 y la 0313 (línea 148) tocan `upstream.json`
   - línea 157: la 0297 y la 0310 (línea 147) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md`
   - línea 157: la 0297 y la 0311 (línea 156) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md`
   Cuatro salen de la 0310, que declara «sus carpetas de `skills/`»: si la 0310 nombra sus carpetas, quedan 2. Las 6 las ordena el dev-lead con `sdd-roadmap` después (fuera de alcance). Las líneas y el recuento cambian si `develop` avanza antes del cierre; el cierre vuelve a correrlo y el walkthrough registra lo que dé.
10. **Los moldes de las baterías**, medidos con el mismo borrador: `tests/batteries/sdd-roadmap/mold-salas-3-family/ROADMAP.md` da 14 avisos y `mold-salas-3-nofamily/ROADMAP.md` 9 (filas de Now y de Next con `**Toca:** `src/app.js`` sin «Tras» entre ellas); `mold-salas-3` y los ocho `roadmap.md` 2.x de `tests/batteries/`, 0. Un sujeto de la batería de `sdd-roadmap` que corra `roadmap check` sobre esos dos moldes verá avisos que hoy no ve. No es una edición de skill y no se mide con sujetos (`sin medir`); el walkthrough lista lo que dé el check real, para que la 0308, que reescribe el texto de solapes de `sdd-roadmap`, lo tenga delante.
11. **Sin tope de avisos.** Cada aviso es un par que ordenar, y un tope escondería pares; la regla **Límites** de `roadmap` no cambia.
12. **Una pieza entra, otra sale: nada.** Es código nuevo de la CLI, sin ninguna skill que crezca; la comprobación a mano de solapes de `sdd-roadmap`, que solo corre en `## Release`, la recorta la 0308 (fuera de alcance).
13. **Repaso de coherencia**: `sdd capability merge` sobre una copia de `capabilities/` en el scratchpad da `roadmap.md: añadido «Dos filas abiertas que tocan lo mismo sin «tras» entre ellas se avisan»` y `roadmap.md: regla «Avisos» sustituida`. La regla reescrita nombra también el aviso «apunta a…, ya ✅», que existía y la regla no listaba (Scope). Los recuentos de las decisiones 4, 5, 9 y 10 salen del borrador; los THEN del delta, con sus líneas, los fija la Task 1 en los tests.
- Política de modelos: revisores de la spec dominio sonnet + técnica sonnet, effort medium (ninguna regla de negocio ni de roles: herramienta del kit) · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura según el plan · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Dos revisores en Sonnet, 2026-11-08: 19 hallazgos, ningún Crítico; sin segunda ronda (ningún Crítico aceptado, y la decisión central, dónde vive el aviso, no cambia).

- **Aceptado** — D1 · la orden directa avisaba un par ordenado por cadena, que el Intent llama fracaso → decisión 5 con cadena (medido: los mismos 6 hoy), 🦆 y AND del delta.
- **Aceptado** — D2 · en la 3.0.0 ningún THEN fijaba que `✅`, `🧪` y `⏸️` de Now o Next no avisan → decisión 2 y AND.
- **Aceptado** — D3 · mismo id y `0000` sin fijar → decisión 2 (`0000` se compara) y AND.
- **Aceptado** — D4 · no decía contra qué se compara cada fila → decisión 2 (todas contra todas, también Próximo contra release y Now contra Next) y AND.
- **Aceptado** — D5 · «aviso de más, nunca de menos» era falso con una negación en prosa → decisión 4 lo dice como límite conocido.
- **Aceptado** — D6 · con los dos ficheros no se decía qué se compara → decisión 2 y AND.
- **Aceptado** — D7 · la regla **Avisos** decía «los mismos ficheros» → «la misma ruta, o una dentro de la carpeta de la otra».
- **Rechazado** — D8 · tope de avisos en «Límites» → decisión 11: un tope esconde pares; «Límites» no cambia.
- **Aceptado** — D9 · la corrección de la regla **Avisos** («apunta a…») no estaba en el Scope → Scope.
- **Aceptado** — D10 y T3 · líneas `<n>`/`<m>` en el THEN de la 3.0.0 y ramas sin escenario → líneas concretas y un AND por rama (sin `**Toca:**`, mismo id, Próximo contra release, «Tras» con varios ids).
- **Aceptado** — T1 · el molde `nofamily` da 9 avisos, no 3 → decisión 10 con los tres moldes medidos.
- **Aceptado** — T2 · el orden de salida no tenía escenario → AND con tres filas y el sitio frente al id repetido y `debt.md`.
- **Aceptado** — T4 · «Fila tras la 0195» no ordenaba → decisión 4 con `la `/`el ` opcional y palabra entera, y AND.
- **Aceptado** — T5 · cualquier texto entre comillas contaba como ruta → decisión 3 (sin espacios, con `/` o `.`, normalizada) y AND.
- **Aceptado** — T6 · sin profundidad mínima no estaba declarado → decisión 6.
- **Aceptado** — T7 · «Ficheros:» con mayúscula, el último, y una fila sin él con rutas en la prosa → decisión 3 y AND.
- **Aceptado** — T8 · dos números de línea en un aviso → decisión 7 y la tabla de lo que cambia de forma.
- **Aceptado** — T9 · en una release, «tras» se buscaba también en «Ficheros que toca» → decisión 4 la excluye.

### Decisiones tomadas con el dev-lead

- Es un aviso y no un fallo — «si» (revisión del roadmap, 2026-11-05)
- Una ruta dentro de la carpeta de la otra cuenta como solape; el aviso calla si una de las dos nombra a la otra en su «tras»; mira las filas abiertas de Próximo (2.x) y de Now y Next (3.0.0); «antes de» se decide en la spec — encargo de la sesión, 2026-11-08
- Dos revisores de la spec en paralelo, Sonnet — «1» (2026-11-08)

## Intent

Dos filas abiertas del roadmap que tocan los mismos ficheros sin un «tras» entre ellas se lanzan en paralelo y chocan al fusionar: al escribir el reparto de la 0301, la 0296 quedó tocando los mismos cinco `SKILL.md` que la 0305 a la 0308, y la 0297 un fichero que reescribe la 0307. La comprobación de solapes de `sdd-roadmap` es texto, y solo corre en una sección `## Release`; este repo planifica la 3.0.0 en «Próximo». Éxito: `sdd roadmap check` nombra cada par así, con los dos ids y la ruta, sin cambiar su código de salida, y no avisa de un par que ya está ordenado. Fracaso aunque funcione: un aviso por cada par ordenado con «tras» o «antes de» (ruido que se acaba ignorando), o que el check deje de acabar en `Roadmap válido` por un solape.

## Scope

- Entra: `cli/src/roadmap/overlap.ts` (nuevo) y su llamada desde `cli/src/roadmap/check.ts`, en las dos formas; los tests en `cli/test/roadmap/` (uno nuevo, `overlap.test.ts`, y los que cambien porque sus fixtures ya tenían filas solapadas sin «tras»); `dist/cli/` regenerado por `moon run kit:build`; la regla **Avisos** de `roadmap`, que además nombra el aviso «apunta a…, ya ✅» que ya existía.
- No entra: el texto de `sdd-roadmap` sobre solapes (0308); ordenar los 6 pares que el aviso encuentra hoy (el dev-lead, con `sdd-roadmap`); los moldes de `tests/batteries/` que avisan (decisión 10); el «Ficheros que toca» de las filas que no lo declaran entre comillas invertidas; `sdd merge`, que reutiliza `duplicateIdWarnings` y no este aviso.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La salida de `sdd roadmap check` gana una línea de aviso por par solapado, con dos números de línea | `skills/sdd-end-release/SKILL.md:30` aplica solo los avisos `caduca` y `sale en el corte`, por su literal; `skills/sdd-archive/references/records.md:24` y `skills/sdd-roadmap/SKILL.md:54` actúan sobre fallos por su línea, no sobre avisos; `skills/sdd-templates/SKILL.md:54` describe fallos y `Roadmap válido`, sin listar avisos | decisiones 7 y 8: ninguno cambia; el código de salida es el mismo, y la línea del aviso es el primer `línea <n>:` |
| La regla **Avisos** de `roadmap` | `.docs/sdd/capabilities/roadmap.md:232` | delta, «Reglas de la capacidad» |

- Filas que implementa: 0319 → `.docs/sdd/roadmap.md:154` (su fila) y `:156` (la 0311 la lleva en su «tras»); las marca el cierre. Comprobado con `git grep -n "0319" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!tests/*.md'`.

## Approach

Decisión 1: un módulo `overlap.ts` con una función pura sobre filas leídas y un lector por forma, llamado desde `check.ts` en las dos ramas. Lo de cada lector (qué filas, qué rutas, qué ordena) está en las decisiones 2 a 6.

## Dónde se prueba

- El aviso en la 2.x («Próximo» y `## Release <N>`), la regla de carpeta, «tras», «antes de» y la cadena, y las filas que no cuentan: Vitest sobre la función y sobre las líneas de un roadmap, como `cli/test/roadmap/duplicates.test.ts` y `check.test.ts`.
- El aviso en la 3.0.0: por `checkProject` de `cli/test/roadmap/project.ts`, como los tests de `now-next-later.test.ts`.
- El roadmap de `develop`: `node dist/cli/bin/sdd.js roadmap check --path .docs/sdd`, con la salida literal en el walkthrough frente a los 6 avisos de la decisión 9.
- Los moldes: el mismo comando sobre cada `ROADMAP.md` y `roadmap.md` de `tests/batteries/`, al walkthrough frente a la decisión 10.

## Términos y ADR

- Términos resueltos: **fila abierta** — una fila `⏳` o `🔄` de «Próximo» o `## Release <N>` (2.x), o de Now o Next (3.0.0); **solape** — dos rutas iguales, o una dentro de la carpeta de la otra.
- ADR candidatas: ninguna (un aviso nuevo del validador, sin alternativa difícil de deshacer).

## Delta de comportamiento

### Capacidad: `roadmap`

#### ADDED — Dos filas abiertas que tocan lo mismo sin «tras» entre ellas se avisan

- GIVEN un roadmap 2.x con, en «Próximo», la fila `0040` ⏳ en la línea 7 con «Ficheros: `skills/sdd-verify/`» y la fila `0041` 🔄 en la línea 8 con «Ficheros: `skills/sdd-verify/references/spec-reviewer-prompt.md`, `cli/src/roadmap/`», sin «tras» ni «antes de» entre ellas
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 8: la 0041 y la 0040 (línea 7) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md` sin «tras» entre ellas`, y sin fallos termina en `Roadmap válido` y sale con 0
- AND con «tras 0040» o «Fila tras la 0040» en la 0041, «tras 0041» o «antes de 0041» en la 0040, o «antes de 0040» en la 0041, no avisa; «tras 0039, 0040 y 0042» cuenta igual; y con la 0041 tras una `0030` que va tras la 0040, tampoco avisa
- AND con una tercera fila `0042` ⏳ en la línea 9 con «Ficheros: `skills/sdd-verify/`» y sin «tras», los avisos salen en este orden: `línea 8: la 0041 y la 0040 (línea 7)`, `línea 9: la 0042 y la 0040 (línea 7) tocan `skills/sdd-verify/``, `línea 9: la 0042 y la 0041 (línea 8) tocan `skills/sdd-verify/references/spec-reviewer-prompt.md``; van tras el aviso de id repetido y antes de los de `debt.md`
- AND `skills/sdd-verify` cubre `skills/sdd-verify/x.md` y no cubre `skills/sdd-verify-old/x.md`; `.\skills\sdd-verify\x.md` cuenta como `skills/sdd-verify/x.md`; dos rutas iguales avisan con esa ruta, y varias rutas solapadas salen en el mismo aviso separadas por `, `
- AND `sdd roadmap check` entre comillas invertidas en las dos filas no avisa: sin `/` ni `.` no es una ruta
- AND una fila `⏸️ aparcada: …`, `✅` o `🧪 validación diferida a…` no avisa, ni una de «Próximo» sin «Ficheros:» aunque cite `skills/sdd-verify/` en su prosa; con dos «Ficheros:» en la celda «Ítem» cuentan las rutas del último
- AND dos filas con el id `0210` no se comparan entre sí; dos con `0000` sí
- AND una fila de «Próximo» y una de `## Release 3.1` avisan igual, con las rutas entre comillas invertidas de la celda «Ficheros que toca» de la release
- AND en `ROADMAP.md` (3.0.0), con la `0013` ⏳ en Now en la línea 10, la `0014` ⏳ en Next en la línea 16 con «Tras» `0012, 0013` y la `0015` ⏳ en Next en la línea 17 con «Tras» `—`, las tres con `**Toca:** `src/avisos.js``, escribe `ROADMAP.md: aviso: línea 17: la 0015 y la 0013 (línea 10) tocan `src/avisos.js` sin «tras» entre ellas` y `ROADMAP.md: aviso: línea 17: la 0015 y la 0014 (línea 16) tocan `src/avisos.js` sin «tras» entre ellas`, y ningún aviso de la 0014; con «Tras» `0014` en la 0015 no avisa ninguna, porque la 0014 ya va tras la 0013
- AND en `ROADMAP.md`, una fila de Now o Next con `✅`, `🧪 validación diferida a…` o `⏸️ aparcada: …`, una sin `**Toca:**` y una de Later no avisan
- AND con `ROADMAP.md` y `.docs/sdd/roadmap.md` a la vez, solo se comparan las filas de `ROADMAP.md`

#### Reglas de la capacidad — roadmap

- **Avisos**: una línea por fallo del validador, con la regla incumplida. Son avisos, sin fallo: el prefijo de cierre fuera de forma (2.x), la fila de «En espera» que caduca, la descartada que sale en el corte, el roadmap que no se lee cuando están los dos, el id repetido en la columna de id de dos filas, la fila 2.x que apunta a una tarea ya ✅ y dos filas abiertas (`⏳` o `🔄`) que tocan la misma ruta, o una dentro de la carpeta de la otra, sin que una llegue a la otra por una cadena de «tras» (o «antes de», en la 2.x). Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada (opción «Apruebo») |
