---
id: 20261126-161357-feature-0371-spike-close-writes-rows
feature: 0371
title: El cierre de un spike escribe las filas que su research.md §5 propone, y su fila las nombra
mode: lite
profile: delegate
status: approved
created: 2026-11-26
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-26
---

# Spec — El cierre de un spike escribe las filas que su research.md §5 propone, y su fila las nombra

🦆 Hoy, cuando una investigación del kit termina y propone dos arreglos, se cierra con su tarea marcada como hecha y nadie apunta esos arreglos en el plan de trabajo. Así, la tarea del gestor de tickets parece arreglada aunque solo se haya medido. Con este cambio, el propio cierre de la investigación apunta cada arreglo como tarea nueva pendiente, con su número, y la tarea de la investigación queda «hecha → 0031, 0032». El ticket del gestor pasa de la investigación a esas tareas nuevas, así que nadie lo da por resuelto antes de tiempo. Para no alargar las instrucciones del kit, la regla sale de la plantilla de la investigación y entra en el paso de cierre, y otra frase repetida se acorta.

Validación: agente — el cambio solo toca texto de skills y la batería; lo observable es la conducta de los sujetos, que mide el agente, y el uso real llega por los tickets de campo (`validation.mode: field`).

## Capacidades

- Modificadas: `spike` — añade «El cierre de un spike abre las filas que propone su `research.md`»

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: ADDED (un requisito de `spike`) · tamaño: ~60 líneas en 5 ficheros (una viñeta de referencia, media frase de SKILL.md, una línea de plantilla, un escenario con su molde)
- Técnica (sonnet): si las filas SP1-SP4 fallan sin la conducta y pasan con ella, si el molde reproduce el caso de la 0809 (§5 con dos «→ fila», tarea del tracker en «Externo») y si el saldo de 25.794 palabras se mide como `word-budget.test.ts`
- Mínimo razonable: ninguno — deja sin mirar si el molde narra la conducta, que es donde un RED limpio engaña
```

1. **Enfoque**: la regla en `records.md` §Roadmap, frente a entera en `SKILL.md` y frente a dejar «Externo» en la fila del spike (ver Approach); lo eligió el dev-lead (Decisiones tomadas con el dev-lead).
2. El cierre escribe las filas él mismo, sin invocar `sdd-roadmap` — por qué: `sdd-roadmap` publica con su propio commit en la rama de integración (paso 6), fuera de la rama; escritas en el commit de cierre llegan con el merge, y cargar `sdd-roadmap` (~3.600 palabras) para dos filas cuesta más que la regla. Los ids salen como los da el paso 4 de `sdd-roadmap` («per step 4 of `sdd-roadmap`»): en `sequence`, una sola reserva `sdd id next --reserve --count N`; en `tracker`, el id del gestor — por qué: remitir al paso que ya fija los ids cubre los dos modos sin repetir la regla en otra skill (`kit:own`). `sp1` solo mide `sequence` (el molde lo es, `subject.mjs:36`); `tracker` queda sin medir.
3. Forma de la fila nueva: en Now, `⏳`, título del arreglo de §5, brief completo con su origen (`research.md` de la `<id>` §5) y `**Toca:**` con lo que §5 nombra, «Tras» `—`, tamaño a juicio del cierre; la valida `roadmap check` — por qué: «with its brief» es el brief de toda fila de Now, que la capacidad `roadmap` exige con `**Toca:**`; no se añade forma nueva. Va a Now, no a Next ni Later, en todos los perfiles y sin preguntar: lo fija el prompt de la 0371 («gana su fila en Now»), y es lo que ya hace `records.md` con «a change without a row gains one in Now»; reordenar después es de `sdd-roadmap`. Contraejemplo: en Next, la tarea del tracker quedaría fuera de la release que la anunció.
4. El «Estado» de la fila del spike acaba en `→ <ids>`: `✅ → 0031, 0032`, o `🧪 validación diferida a <disparador> → 0031, 0032` si su validación se difiere — por qué: el punto «Abierto» del prompt proponía comprobarlo; `cli/src/roadmap/tables.ts:5` compara por prefijo (`startsWith`), y `roadmap check` sobre una copia del roadmap con la 0371 en `✅ → 0827, 0828` dio «Roadmap válido» (2026-11-26). Los demás lectores del estado también van por prefijo o por juicio: `cli/src/roadmap/warnings.ts:45` (`startsWith`) y `sdd-end-release` («the ✅ and 🧪 rows of Now»), que saca la fila en el corte como cualquier `✅`; sus hijas `⏳` se quedan en Now, como toda fila abierta. La forma `🧪 … → ids` no se mide: en este repo la validación es en campo (`✅`), y el sufijo es el mismo; SP2 acepta las dos formas.
5. «Externo» se mueve a **todas** las filas nuevas, y la del spike queda con `—` — por qué: el criterio del hallazgo 2 del ticket de la 0809 («las dos filas nuevas llevan la tarea en «Externo»»); la tarea del tracker queda resuelta cuando lo están todas sus filas, y la del spike ya no la cuelga de un `✅`. Contraejemplo: llevarla solo a la primera dejaría la segunda sin traza en el tracker.
6. Un §5 «nada» no abre filas y la fila del spike queda `✅` sola — por qué: es la otra salida de la plantilla (`| nada`) y la conducta de hoy; sin escenario propio, y fuera del delta para no dejar en él una cláusula sin medir.
7. `SKILL.md:39` de `sdd-archive` pasa de «the change's own row only changes its «Estado» cell, with no prefix» a «the change's own row only changes its «Estado» cell (a spike's, also «Externo»), with no prefix» (+4 palabras) — por qué: con el «only» literal, la regla de `records.md` choca con la skill que la carga.
8. La línea de ayuda de §5 de `research-template.md` («Un arreglo que la medida deja a la vista va aquí, con su fila: el spike no deja código de producción.», 22 palabras con el `>`) sale entera; el hueco `- <cambio> → <fila del roadmap por abrir> | nada` se queda — por qué: el hueco ya pide el formato que lee el cierre; la regla «con su fila» pasa al cierre, y «sin código de producción» ya lo dicen la spec del spike y la capacidad.
9. Saldo de palabras: la suma de `dist/skills/sdd-archive/` y `dist/skills/sdd-templates/`, contada como `word-budget.test.ts` (`split(/\s+/)`), queda en 25.794 o menos (hoy 8.059 + 17.735). Medido sobre el texto propuesto: la viñeta nueva, 39 palabras («`mode: spike`: each `→` of `research.md` §5 gains a `⏳` row in Now, with its brief and the spike's «Externo», ids per step 4 of `sdd-roadmap`, in the closing commit; the spike's row ends in `→ <ids>`, «Externo» `—`.»); `SKILL.md:39`, +4; la ayuda de §5, −22; la primera viñeta de `records.md` §Roadmap pasa de 55 a 30 palabras («What's done stays in Now until the release cut moves it to the changelog; a change without a row gains one there, with its brief, or the cut misses it.»), porque «stays in Now with `✅` (or `🧪 …`) in «Estado»» ya lo dice `SKILL.md:39`: −25. Saldo previsto: −4. Si una pasada de fix lo sube, se recorta más dentro de las mismas dos skills; un recorte que quite una instrucción lleva su escenario — por qué: regla 6 de `CLAUDE.md`.
10. Escenario `sp1` en la batería de `sdd-archive`, molde `reservas-spike-rows`: el `reservas-spike` que ya existe (spike 0030 en `feature/0030-libres-load`, el de `vf9`) con su fila en Now con «Externo» `#412`, un §5 que dice `índice por sala en libres → fila por abrir` y `caché de libres por día → fila por abrir` en vez de «nada», y la validación en campo registrada con la revisión final limpia; petición «Invoca la skill sdd-kit:sdd-archive y sigue. El spike 0030 está acabado y su revisión final está limpia. Ciérralo.», `n = 2`, umbral 2/2, `sonnet` — por qué: reutiliza el spike que la batería ya monta (y que `vf9` no ve cambiar: es un molde aparte); es la forma literal del caso de la 0809.
11. Rúbrica de `sp1`: **SP1 Filas nuevas** falla si `ROADMAP.md` de `develop` no tiene en Now dos filas `⏳` nuevas con los dos arreglos de §5 y su brief con `**Toca:**`, o si `sdd roadmap check` sobre `develop` no da «Roadmap válido»; **SP2 Fila del spike** falla si el «Estado» de la fila 0030 no acaba en `→ <id>, <id>` (tras `✅` o `🧪 …`) con los ids de esas dos filas, o si esos ids no son los que imprimió el `id next --reserve` de `tools.txt`; **SP3 Externo** falla si la 0030 sigue con `#412` o alguna fila nueva no lo lleva; **SP4 Reserva** falla si `tools.txt` no tiene `id next` con `--reserve` antes del commit de cierre, o si las filas llegan en un commit distinto del de cierre (el último commit de la rama del spike antes del merge de sincronización, si lo hay: `git log -p` de `ROADMAP.md` en la rama), o si `develop` gana un commit propio que toque `ROADMAP.md` fuera del merge — por qué: SP1 y SP2 son el criterio de hecho; SP3 es el hallazgo 2; SP4, que los ids no se numeren a ojo y que no haya un segundo camino al roadmap (decisión 2).
12. RED con el kit de `develop`, `sp1` con `n = 2`, antes de escribir la regla; si sale limpio 2/2, es un desvío y para — por qué: Art. I, la guía nueva lleva un test que falla antes.
13. Controles: `a9` (`N1` y `N2`: la fila en Now y la deuda saldada, que tocan la viñeta que se recorta) y `a1` (`A2`, `A6`: la fila `✅` y sin prefijo), `n = 1` cada uno — por qué: el recorte de la decisión 9 y la media frase de `SKILL.md:39` tocan lo que miden.
14. Saldar en el cierre la fila de «Lista» de `debt.md` con «Destino» `0371` — por qué: lo pide el prompt; es lo que `records.md` §Roadmap ya hace con toda fila cuyo destino es el id cerrado.
15. `research.md` no gana adenda con los ids: los nombra la fila del spike — por qué: el «Estado» `→ <ids>` es la traza que lee quien mira el roadmap, y §5 sigue diciendo lo que se propuso.
- Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → `spike.md: añadido «El cierre de un spike abre las filas que propone su `research.md`»`. `git grep` de «va aquí, con su fila» y de «only changes its «Estado»» fuera de la evidencia: solo `research-template.md:44` y `sdd-archive/SKILL.md:39` (y sus copias de `dist/`). `git grep 0371`: la fila del roadmap y la de `debt.md`. `reservas-spike` ya existía (`subject.mjs:863`, lo usa `vf9` de `sdd-validate`): el molde de `sp1` deriva de él (decisión 10, corregida en este repaso; antes, la 0010 de `reservas`).
- Política de modelos (solo en `delegate`): revisor de la spec `sonnet` con `sdd-kit:effort-medium` · revisión final: Spec opus+high, Código sonnet+high · sujetos de la batería `sonnet`, por tandas · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

Un revisor `sonnet` (effort medium) con los siete puntos:

- **Rechazado** (Crítico) — `MODIFIED` no declarado de `roadmap` y `archive` → `roadmap` «Con `ROADMAP.md`, lo hecho queda en Now…» dice «se queda en Now con `✅` (o `🧪 …`)», y `✅ → ids` sigue empezando por `✅` y en Now: lo especializa, no lo cambia; en `archive` no hay requisito que diga que el cierre solo cambia «Estado» (`grep` de «Estado» en `archive.md`: ninguno de roadmap). El requisito va en `spike`, la capacidad del carril, como «Un spike cierra sin código de producción».
- **Aceptado** (Crítico) — el saldo previsto daba +5 → medido sobre el texto real (decisión 9): −4, con la primera viñeta de `records.md` recortada a 30 palabras.
- **Aceptado** — el modo `tracker` no estaba dicho → la viñeta remite al paso 4 de `sdd-roadmap`, que da los ids en los dos modos; `tracker` queda sin medir (decisión 2 y «No entra»).
- **Rechazado** — la rama §5 «nada», la línea con fila ya existente y la reentrada sin escenario → «nada» es la conducta de hoy (no abre fila); la plantilla pide «fila por abrir», y la reentrada no tiene caso; van a «No entra».
- **Aceptado** — la validación diferida no estaba prevista → decisión 4 y el AND del delta: el «Estado» acaba en `→ <ids>`, también tras `🧪 …`; `warnings.ts:45` y `sdd-end-release` leen por prefijo o por juicio.
- **Aceptado** — a qué filas va «Externo» no estaba decidido → a todas (decisión 5, con su contraejemplo); SP3 ya lo comprueba así.
- **Aceptado** — SP1 y SP2 pasaban sin la conducta completa → SP1 exige brief y `roadmap check` en verde; SP2, los ids que imprimió la reserva.
- **Aceptado** (Menor) — el «Entra» no listaba el molde, los controles y el saldo de la deuda → listados; el roadmap 2.x, a «No entra».
- **Rechazado** (Menor) — las cinco reglas de la capacidad → el delta no trae datos, nombres, topes, avisos ni conflictos nuevos: la fila nueva es una fila de Now con la forma que ya fija `roadmap`.
- **Rechazado** (Menor) — el nombre del proyecto real y «Validación: agente» frente a `field` → el nombre ya está en el fichero del ticket, en la fila 0371 y en `debt.md`, que la spec cita; `Validación: agente` con `validation.mode: field` es la forma de las specs del kit (la 0370).

Segunda ronda (un revisor `sonnet`, effort medium, por el Crítico aceptado del saldo):

- **Aceptado** — la fila nueva sin `**Toca:**` → decisión 3: brief completo con `**Toca:**`; SP1 lo comprueba.
- **Aceptado** — Now frente a Next o Later no estaba decidido → decisión 3, con su porqué (lo fija el prompt) y su contraejemplo; vale en todos los perfiles, porque es un registro, no una parada.
- **Aceptado** — nadie dice quién cierra la tarea del tracker con varias filas → «No entra»: ninguna skill sincroniza «Externo» con el gestor.
- **Aceptado** — la forma `🧪 … → ids` sin medir → decisión 4: «no medido» con su motivo; SP2 acepta las dos formas.
- **Aceptado** — el id en `tracker` no quedaba fijado en el THEN → el GIVEN del delta acota el requisito a `ids.mode: sequence`; `tracker`, en «No entra».
- **Aceptado** (Menor) — el AND de §5 «nada» sin medir → sale del delta; queda en la decisión 6.
- **Aceptado** (Menor) — §5 sigue diciendo «por abrir» tras el cierre → decisión 15: sin adenda; la traza es la fila.
- **Aceptado** (Menor) — el corte con hijas `⏳` en Now → decisión 4: la fila `✅` sale y las hijas se quedan, como toda fila abierta.
- **Aceptado** (Menor) — SP4 no decía qué commit cuenta → decisión 11: el último de la rama antes del merge de sincronización, por `git log -p` de `ROADMAP.md`.
- **Rechazado** (Menor) — el nombre del proyecto real en el Intent → mismo motivo que en la primera ronda.

### Decisiones tomadas con el dev-lead

- La regla vive en `records.md` §Roadmap, y en `SKILL.md:39` solo se ajusta el «only»; si el RED muestra que el sujeto no lee `records.md`, sube a `SKILL.md` — «1» (2026-11-26, a la pregunta de dónde vive la regla)
- Una tanda más de `sp1` (n = 2, ~0,8 $) por encima de la previsión, tras perder `#412` la redacción de la pasada de fix — «1» (2026-11-26, a la parada por coste: seguir, cerrar con lo medido u otra cosa)
- El cierre del propio spike abre las filas, no «se lanzará roadmap después» — «entiendo que la tendria que lanzar la propia spike al acabr no decir que se ha d elanzra roadmap lanzarlo ella no?» (2026-11-26)

## Intent

Hoy un spike cierra con su fila en `✅` y nadie abre las filas que su `research.md` §5 propone: la plantilla lo pide y ningún paso del cierre lo hace. Pasó en la feature 0163 (§5 del ticket) y en la 0809 de document-manager, donde la tarea de prioridad máxima del tracker quedó colgada de un `✅` y se anunció como arreglada. El éxito: un sujeto que cierra un spike cuyo §5 propone dos filas deja el roadmap con esas dos filas y la del spike nombrándolas, y el saldo de palabras de las skills tocadas no sube. Fracasaría si las filas llegan por un commit aparte en la rama de integración o con ids a ojo.

## Scope

- Entra: la viñeta de `mode: spike` y el recorte de la primera viñeta en `skills/sdd-archive/references/records.md` §Roadmap; el ajuste del «only» de `skills/sdd-archive/SKILL.md:39`; la línea de ayuda de §5 de `skills/sdd-templates/templates/research-template.md`; el escenario `sp1`, su molde `reservas-spike-rows` en `subject.mjs` y su rúbrica en `tests/batteries/sdd-archive/`; los controles `a9` y `a1`; el delta de `spike`; en el cierre, la fila 0371 y la de «Lista» de `debt.md` (decisión 14).
- No entra: que `sdd-spec-writing` rechace una decisión que aplaza un paso del cierre (un solo caso, se queda en el ticket); que `roadmap publish` empuje (se queda en el ticket); que `roadmap check` exija hijas a un `✅` de spike; medir el modo `tracker` (decisión 2); el roadmap 2.x, cuyo «Próximo» ya no se escribe desde la 3.0.0; un §5 «nada» con escenario propio (hoy ya no abre fila: es la conducta de partida) y la reentrada de un cierre (sin caso); quién cierra la tarea del tracker que queda en varias filas (ninguna skill sincroniza «Externo» con el gestor: `sdd-roadmap` solo lo escribe al triar).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea de ayuda de §5 «Un arreglo que la medida deja a la vista va aquí, con su fila…» | `skills/sdd-templates/templates/research-template.md:44` | sale (decisión 8) |
| «the change's own row only changes its «Estado» cell» | `skills/sdd-archive/SKILL.md:39` | se ajusta (decisión 7) |
| Primera viñeta de §Roadmap, de 55 a 30 palabras: sale «stays in Now with `✅` (or `🧪 …`) in «Estado»» | `skills/sdd-archive/references/records.md:17` | se reescribe: eso lo dice `SKILL.md:39` (decisión 9) |
| Estado de la fila de un spike cerrado: `✅` → `✅ → <ids>` | `records.md` §Roadmap; capacidad `spike` | delta, `ADDED` |

- Filas que implementa: 0371 → `ROADMAP.md` (su fila) y `.docs/sdd/steering/debt.md` («Lista», Destino `0371`); las salda el cierre (decisión 14). Comprobado con `git grep 0371`.

## Approach

- A — la regla en `records.md` §Roadmap, y en `SKILL.md:39` solo el ajuste del «only» — cuesta una viñeta de referencia y media frase; el riesgo es que el sujeto no lea la referencia, y el RED lo dice.
- B — la regla entera en `SKILL.md:39` — se lee seguro (Art. II, fase obligatoria en su skill), pero alarga el `SKILL.md` (2.657 de 2.729) y sale del alcance literal.
- C — «Externo» se queda en la fila del spike y se copia a las nuevas — no contradice `SKILL.md`, pero deja el hallazgo 2: la tarea del tracker sigue en un `✅`.
- Elegido: A — lo eligió el dev-lead: «1».

La viñeta nueva y el recorte de la primera, literales, en la decisión 9.

## Dónde se prueba

- El cierre abre las filas y la del spike las nombra: `sp1` de la batería de `sdd-archive`, como `a5` (el roadmap de `develop` tras el cierre).
- La fila `✅ → <ids>` pasa `roadmap check`: el propio cierre del sujeto lo corre antes del commit de cierre (paso de `records.md`); ya comprobado a mano (decisión 4).
- Lo recortado no rompe la fila `✅` ni la deuda saldada: `a9` y `a1` como controles.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `spike`

#### ADDED — El cierre de un spike abre las filas que propone su `research.md`

- GIVEN un proyecto con `ids.mode: sequence` y un spike, la 0030, con «Externo» `#412` en su fila y un `research.md` cuyo §5 dice `índice por sala en libres → fila por abrir` y `caché de libres por día → fila por abrir`
- WHEN `sdd-archive` lo cierra
- THEN el commit de cierre lleva en Now dos filas `⏳`, una por arreglo y con su brief (`**Toca:**` incluido), con ids de una sola reserva (`sdd id next --reserve --count 2`), p. ej. 0031 y 0032
- AND la fila 0030 dice `✅ → 0031, 0032` en «Estado» (con la validación diferida, `🧪 validación diferida a <disparador> → 0031, 0032`), y `#412` pasa de su «Externo» al de las dos filas nuevas

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,5h
- Estimación de implementación: 3h
- Base de la estimación: una viñeta y dos ajustes de texto; el grueso es el molde `reservas-spike-rows` (deriva de `reservas-spike`, que ya existe) y dos tandas de sujetos; la fila del roadmap dice S
- Confianza: media

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-archive` (total) | 8.059 / 8.220 | 161 | sin cambio |
| `sdd-archive` (`SKILL.md`) | 2.657 / 2.729 | 72 | sin cambio |
| `sdd-templates` (total) | 17.735 / 18.000 | 265 | sin cambio |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="sp1" N=2` → sin medir: `sp1` aún no existe; como `a5`: `SCENARIOS="a5" N=2` → `suma: 2 sujetos · coste previsto: 0.87 $` | 0,87 |
| GREEN | `SCENARIOS="sp1" N=2` → como `a5` | 0,87 |
| Una tanda de REFACTOR | `SCENARIOS="sp1" N=2` → como `a5` | 0,87 |
| Controles | `SCENARIOS="a9 a1" N=1` → ~0,44 $ por sujeto, como `a5` | 0,87 |
| Medición tras la revisión final | solo si la revisión toca la viñeta: `SCENARIOS="sp1" N=2` | 0,87 |
| Tanda extra tras la pasada de fix (enmienda del 2026-11-26) | `SCENARIOS="sp1" N=2` → como `a5` | 0,87 |
| Suma | 12 sujetos | 5,22 |

## Enmiendas

- 2026-11-26 — previsión de coste: 10 → 12 sujetos, 4,35 → 5,22 $, por una tanda extra de `sp1` tras la pasada de fix — la redacción de la pasada perdió `#412` (SP3 0/2) — aprobada: «1»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-26 | aprobada (opción «Apruebo») |
