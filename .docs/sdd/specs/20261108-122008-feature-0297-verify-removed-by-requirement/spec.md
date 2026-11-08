---
id: 20261108-122008-feature-0297-verify-removed-by-requirement
feature: 0297
title: El eje Spec busca un REMOVED por lo que dice su requisito vigente
mode: full
profile: delegate
status: approved
created: 2026-11-08
author: agente con el dev-lead
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — El eje Spec busca un REMOVED por lo que dice su requisito vigente

🦆 Hoy, cuando una feature retira un comportamiento, el revisor final solo ve el título de la regla retirada y su motivo, así que busca palabras como «correo» y da la retirada por buena aunque el aviso siga saliendo con otro nombre. Con este cambio, el revisor lee antes la regla viva de la capacidad, por ejemplo «al anular Norte el lunes, la lista `salida` lleva el aviso para el responsable», y busca eso en el código. Si la regla ya no está en la capacidad, la recupera de su historia; si la regla no dice nada más que su título, deja la retirada como «no verificada» en vez de aprobarla. Se mide con tres casos de prueba nuevos de la revisión, uno por regla, antes y después del cambio. Además, el registro de fuentes sube OpenSpec e impeccable a su última versión, y la vigilancia de fuentes deja de dar esos dos rojos.

Validación: agente — validación en campo (`validation.mode: field` en `sdd-kit.json`): lo que cambia es el encargo que recibe un revisor, y lo miden la batería de `sdd-verify` y las comprobaciones del repo; el uso real llega por los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `verification` — «El eje Spec contrasta el diff con el delta de capacidades» pide el vigente en su GIVEN, y tres requisitos nuevos: el eje Spec busca un `REMOVED` por lo que dice su vigente, lo recupera del historial si ya no está, y lo da por no verificado si no tiene uno utilizable.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (tras la review), área no leída entera (los moldes de la batería de sdd-verify) · tamaño: ~250 líneas en 12 ficheros (la viñeta, upstream.json, avisos generados, battery.md, subject.mjs y seis fixtures)
- Dominio (sonnet): si los tres ADDED de `verification` contradicen «El eje Spec contrasta el diff con el delta de capacidades» o «Una comprobación no verificada no cuenta como limpia», y si las tres reglas de OpenSpec v1.16.1 llegan enteras a la viñeta (señal: requisito nuevo junto a dos vigentes de la misma capacidad)
- Técnica (sonnet): si los moldes rm1-rm3 aíslan cada regla (mismo código, cambia solo la capacidad o su historia) y si la entrada `from` de OpenSpec deja verdes kit:copies, kit:upstream y los avisos (señal: upstream.json y su comprobación)
- Mínimo razonable: un revisor con los siete puntos — deja con una sola lectura el diseño de los moldes, que es donde un RED limpio por accidente costaría una tanda
```

1. **Enfoque: se sustituye entera la viñeta del `REMOVED` de `spec-reviewer-prompt.md`, con las tres reglas como frases dentro de ella y en el orden en que el revisor las hace** (leer el vigente, recuperarlo del historial, buscar su comportamiento; sin vigente utilizable, «no verificado»). Descartadas: sub-viñetas bajo el `REMOVED`, como hace OpenSpec, porque son frases nuevas al lado de la que falla y la regla 3 de la ADR 0022 y el Art. IX piden mejorar la frase que falla; y una referencia aparte, porque el revisor no abre lo que el paso solo nombra (`architecture.md`, anatomía, punto 6). Las tres reglas no caben en una frase: la viñeta, que hoy ya son cuatro frases, es la unidad que se sustituye. Borrador medido:

   ```text
   - Each `REMOVED` requirement asks for the behavior to be gone, so invert the check, but its block carries only the title and the reason. First read the current requirement in `.docs/sdd/capabilities/<capability>.md`, matched by its exact title: a similar title is not a match. If it is no longer there, recover it with `git log -p -- .docs/sdd/capabilities/<capability>.md`; empty output means a wrong path, not a missing requirement. Then search the diff and the code it touches for what its body and scenarios describe, never for its title; matches in `.docs/` don't count. If it still runs, it is Critical, `contradicts`. A current requirement with nothing beyond its title, no body and no scenarios, is no evidence, like a missing one: write «no verificado: sin requisito vigente utilizable» for that entry and don't search. Never report a `REMOVED` requirement as missing.
   ```

2. **La entrada `copy` de OpenSpec deja de existir como entrada propia y pasa a `from` de la copia de `spec-reviewer-prompt.md`, con `version: v1.16.1`.** La decisión del dev-lead dice «sube de v1.14.1 a v1.16.1 y pierde su pending»; tal cual no funciona: una copia sin `pending` va fichero a fichero contra su original, el `kit` de esta entrada es la carpeta `references/` (`tests/copies/check.ts` la leería como fichero) y el original de `spec-reviewer-prompt.md` es `code-reviewer.md` de superpowers, no `verify-change.ts`. La copia de `spec-reviewer-prompt.md` ya tiene su entrada (`upstream.json:236-246`, superpowers `v7.0.2`), y `from` con su `version` es la forma que ya usan cuatro entradas para un segundo origen (Wondel en los encargos de los ejes Código y Arquitectura). Como `from`, `kit:upstream` la sigue vigilando y el `NOTICE` la sigue citando (`watchedRefs`, `renderNotice`). Medido sobre el borrador: `moon run kit:upstream` ya no da la línea de OpenSpec ni la de impeccable (quedan las de 0313 y 0314); `moon run kit:notices` cambia solo `THIRD_PARTY_NOTICES.md` (las filas de OpenSpec y de impeccable) y la línea de OpenSpec del `NOTICE` de `sdd-verify`, con `v1.16.1`. Sin medir hasta la Task 2: `cli:test` (`notices.test.ts` y el test de `dist/`). Las líneas de OpenSpec están adaptadas, no son literales, así que van en bloques del kit sin `de:` (un `de:` exige el texto literal del original); la `note` de la entrada lo dice: «Las comprobaciones del delta de `openspec-verify-change`, adaptadas en bloques del kit: no son literales y no llevan `de:`.»
3. **Marcas**: la viñeta nueva va en un bloque `<!-- kit: 0297 -->`, y lo que sigue del bloque de la 0312 se reabre con `<!-- kit: 0312 -->`, como hizo la 0307 en `sdd-verify/SKILL.md:274`. Medido sobre el borrador: `node tests/copies/check.ts` da `Copias al día: 31 ficheros.` (hoy, `skills/sdd-verify/references/: sin anotar → 0297`).
4. **Las reglas 2 (historial de git) y 3 (vigente sin cuerpo) entran si su RED lo exhibe** (Art. I: si el baseline no exhibe el fallo, no se escribe). RED limpio es 0 de 2 sujetos que fallan su fila de la rúbrica; con 1 o 2 de 2, la regla entra. Con un RED limpio en `rm2` o `rm3`, su frase sale del borrador, el escenario queda como regresión y lo registro con un ruling; su requisito del delta se queda, porque la capacidad dice la conducta observable y esa conducta la acaban de mostrar los sujetos sin la frase. La regla 1 es el centro de la feature: con `rm1` limpio paro como desvío, porque la fila entera quedaría sin fallo que arreglar. **Cuándo falta el vigente en uso real (regla 2)**: los ejes revisan un sha commiteado, y el delta se fusiona en `capabilities/` como borrador sin commitear mientras trabajan (`verification`, «El revisor final sale en segundo plano…»), así que en el flujo normal el vigente está en el sha revisado. Falta cuando la rama trajo `develop` después de que otra feature quitara o renombrara ese requisito. El worktree de la revisión es un `git worktree add` del mismo repo, con el historial entero.
   **Dos cláusulas de la viñeta sin escenario propio**: «a similar title is not a match» y «empty output means a wrong path». Son parte de las reglas 1 y 2 que decidiste traer; quito «trimmed and case-sensitive», detalle de la normalización de OpenSpec que el kit no necesita (sus títulos no llevan `#` al final). `matches in .docs/ don't count` y `Never report … as missing` ya están hoy.
5. **El recuento de retiradas del informe no tiene equivalente en el kit**: el encargo no da un N de requisitos; una entrada no verificada ya va a `### Not verified`, que existe («Each check you could not make, with «no verificado: <motivo>»»), y el hilo la cuenta en `Revisión final: …, N sin verificar` por el requisito vigente «Una comprobación no verificada no cuenta como limpia». No se toca.
6. **Literal del no verificado**: «no verificado: sin requisito vigente utilizable», un caso del aviso `no verificado: <motivo>` que la capacidad ya tiene. **Reglas de la capacidad**: no cambia ninguna (datos, idioma, límites y avisos ya cubren el caso; ante conflicto, la viñeta solo va al historial cuando el sha revisado no tiene el vigente, así que nunca hay dos versiones vivas que elegir).
7. **Un `MODIFIED` y tres requisitos nuevos, uno por regla**: juntos daban 1.169 caracteres, y `sdd capability check` aconseja 500 y un comportamiento por requisito. «El eje Spec contrasta el diff con el delta de capacidades» pasa a `MODIFIED`: con la viñeta nueva su Critical solo sale si el vigente tiene cuerpo, y su GIVEN no lo decía (hallazgo de la review). Delta probado en una copia: `sdd capability merge` da «verification.md: sustituido» para el vigente y «añadido» para los tres, y sale con 0; `sdd capability check` no avisa de los tres nuevos, y del `MODIFIED` da el aviso de largo que ya daba (1.033 caracteres, «si ya existe, no lo partas ni lo recortes»).
8. **Moldes nuevos de la batería**, sobre `reservas` y la feature de juguete 0025 «Quitar el aviso por correo al anular», con el mismo código en los tres (la rama quita `formatMail()` y deja `outbox.push` en `voidBooking()`; el comando `salida` lista la cola): `rm1` con el vigente «Avisar por correo» con escenario en `capabilities/bookings.md`; `rm2` con el vigente sin cuerpo ni escenarios («- Se avisa por correo.»); `rm3` sin el vigente en el fichero de `HEAD` y con él en un commit anterior del historial. Así cada escenario aísla una regla: ningún nombre del código dice «correo» ni «mail» tras el cambio. Filas de la rúbrica: `RM1` falla si no marca Critical `contradicts` el `outbox.push` de `voidBooking()` o da la retirada por buena; `RM2` falla si la entrada no sale en `### Not verified` con «no verificado: sin requisito vigente utilizable», o la marca `missing` o `contradicts`, o la cuenta como superada; `RM3` falla si no marca ese Critical, y su fila de máquina `` `tools: /git[^\n]*log[^\n]*capabilities\/bookings\.md/` presente `` sobre `tools.txt` (las llamadas a herramientas que guarda el lanzador de cada sujeto) comprueba que leyó el historial.
9. **Una pieza entra, otra sale: no sale nada.** Es la actualización de una frase copiada de su fuente (Art. IX), en una referencia que solo lee el eje Spec al despacharse; `sdd-verify` sigue lejos de su tope (tabla de topes).
10. **`impeccable` sube a `skill-v4.8.1` sin traer nada**: su diff son dos líneas sobre qué ficheros de `.impeccable/` se commitean, y el kit no usa `.impeccable/` (sesión `develop`, 2026-11-08).

- Política de modelos: revisores de la spec, dos en `sonnet` con `sdd-kit:effort-medium` (dominio y técnica), confirmados por el dev-lead («1») · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (sin módulo, dependencia ni contrato nuevos) · sujetos de la batería en `opus` (la fila de los ejes Spec la fija), por tandas de hasta 3 a la vez · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide tu `CLAUDE.md`; lo que no nombra se confirma aparte

### Hallazgos de la review

Dos revisores en `sonnet` (`sdd-kit:effort-medium`): dominio (D) y técnica (T). Sin Crítico aceptado ni decisión central reescrita: sin segunda ronda.

- **Aceptado** — D1: con la viñeta nueva, el Critical de «El eje Spec contrasta el diff…» depende de que el vigente tenga cuerpo; es un `MODIFIED` no declarado → `MODIFIED` en el delta con el vigente en el GIVEN; decisión 7.
- **Aceptado en parte** — D2 y T4: la viñeta fija cláusulas sin escenario → quito «trimmed and case-sensitive»; «a similar title is not a match» y «empty output means a wrong path» se quedan sin escenario propio porque son parte de las reglas que decidiste traer, y lo digo en la decisión 4. Rechazo añadir escenarios para ellas: dos sujetos más por cláusula para un detalle que la fuente ya trae medido (Art. IX).
- **Aceptado** — D3 y T7: en el flujo normal el vigente está en el sha revisado → la decisión 4 dice cuándo falta en uso real y que el worktree de la revisión tiene el historial; la regla 2 sigue condicionada a su RED.
- **Rechazado** — D4 y T5 (delta condicional): la capacidad dice la conducta observable; si el RED sale limpio, los sujetos ya la muestran sin la frase y el escenario queda como regresión. **Aceptado** el criterio de RED limpio: 0 de 2 (decisión 4).
- **Aceptado** — D5 y T9: el ADDED 3 dice que no marca `missing` ni `contradicts` y no la cuenta como superada; el recuento en `Revisión final:` lo cubre el requisito vigente «Una comprobación no verificada no cuenta como limpia» (decisión 5).
- **Aceptado en parte** — D6: las cinco reglas → decisión 6: no cambia ninguna, y por qué no hay conflicto. Rechazo acotar la lectura del historial: `git log -p` de un solo fichero de capacidad es corto, y la fuente no lo acota.
- **Aceptado** — D7, T1 y T2: los GIVEN de los ADDED 2 y 3 eran remisiones → ahora nombran el `REMOVED` y el diff.
- **Aceptado** — D8: el éxito del Intent nombra la regla 2.
- **Aceptado** — D9 y T3: el THEN del ADDED 1 metía el mecanismo del molde → THEN observable (el Critical con su línea) y el criterio general.
- **Aceptado** — T6: el contrato de `upstream.json` sin medir → decisión 2 con lo medido en el borrador (`kit:upstream`, `kit:notices`) y lo que queda sin medir (`cli:test`).
- **Aceptado** — T8: la fila de máquina de `rm3` → definida en la decisión 8.

### Decisiones tomadas con el dev-lead

- Dos revisores de la spec en paralelo, en `sonnet` — «1»
- Lo que entra son las tres reglas de #2083 y #2114, y la capacidad del kit es `.docs/sdd/capabilities/<capacidad>.md` — «Lo que trae el diff v1.14.1..v1.16.1, solo en #2083 y #2114, en tres reglas»
- Se sustituye la frase del `REMOVED`, sin añadir otra al lado — «Se sustituye la frase del REMOVED, sin añadir otra al lado, porque así lo pide la regla 3 de la ADR 0022»
- RED antes de cambiar, con un sujeto de la batería de `sdd-verify` con «REMOVED — Avisar por correo» y el vigente en `capabilities/` — «Con RED antes de cambiar (Art. I)»
- La previsión cita `battery.mjs plan`, con n = 2 de REFACTOR por regla nueva — «No pongas un precio por sujeto escrito a mano»
- impeccable sube sin traer nada — «sube de skill-v4.8.0 a skill-v4.8.1 sin traer nada»
- Perfil `delegate` y cierre con `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

Hoy el eje Spec de la revisión final recibe un `REMOVED` con solo su título y su motivo, y busca «the removed behavior» en el código: con un título como «Avisar por correo» y un código que avisa con otras palabras (una cola `outbox` y un comando `salida`), no encuentra nada y da la retirada por buena. OpenSpec arregló lo mismo en `openspec-verify-change` (#2083, #2114, v1.14.2 y v1.15.0). El éxito: con el requisito vigente en `capabilities/`, el eje Spec busca lo que dice su cuerpo y marca Critical la cola que sigue viva; si el vigente ya no está en el sha revisado, lo recupera del historial de git y hace lo mismo; sin requisito utilizable, lo deja «no verificado», nunca aprobado. Fracasaría si el eje siguiera aprobando retiradas que no buscó, o si la frase nueva quedara al lado de la vieja.

## Scope

- Entra: `upstream.json` (OpenSpec a `from` de la copia de `spec-reviewer-prompt.md` en `v1.16.1`, sin la entrada `pending: "0297"`; impeccable a `skill-v4.8.1`); `THIRD_PARTY_NOTICES.md` y `skills/sdd-verify/NOTICE`, regenerados con `moon run kit:notices`; `dist/`, con `moon run kit:build`; los escenarios `rm1`, `rm2` y `rm3` de `tests/batteries/sdd-verify/` (`battery.md`, `subject.mjs`, `fixtures/`); la evidencia en `tests/sdd-verify-0297-removed.md`.
- Entra, si el RED lo exhibe: la regla 3 (un vigente sin cuerpo ni escenarios es «no verificado» y no se busca) con `rm2b`, un vigente sin cuerpo y un diff que no delata el aviso; con ella, la viñeta del `REMOVED` de `skills/sdd-verify/references/spec-reviewer-prompt.md` se sustituye entera con esa frase y su GREEN (`rm2b`, `rm2`, `f3`). Las reglas 1 y 2 salieron limpias en el RED (RM1 2/2, RM3 2/2): no se escriben, y `rm1` y `rm3` quedan como regresión (enmienda del 2026-11-08).
- Entra: RM2 falla solo si da la retirada por buena (un Critical por el diff o «no verificado» valen).
- No entra: traducir `## Restricciones de código` y `## Cómo revisar` (0311); las frases de `sdd-verify` que `kit:own` da repetidas (0311); los demás rojos de `kit:upstream`: superpowers `cli/src/tasks/` (0313), `brainstorming` y `grilling` (0314); el rojo previo de `kit:skill-size` en `sdd-roadmap` (21.680 bytes, no lo toca esta feature); `RENAMED`, que el kit no tiene.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La frase «search the diff and the code it touches for the removed behavior» | `skills/sdd-verify/references/spec-reviewer-prompt.md:108`; `roadmap.md:157` (fila 0297) | Scope (la viñeta se sustituye); la fila la cierra `sdd-archive` |
| La entrada `copy` de OpenSpec con `kit: skills/sdd-verify/references/` y `pending: "0297"` | `upstream.json:491-503`; `THIRD_PARTY_NOTICES.md:46` (generada) | decisión 2: pasa a `from` de la copia de `spec-reviewer-prompt.md`; la fila de `THIRD_PARTY_NOTICES.md` la regenera `kit:notices` |
| OpenSpec `v1.14.1` en el aviso de `sdd-verify` | `skills/sdd-verify/NOTICE:51` | Scope: `kit:notices` lo escribe con `v1.16.1` |
| impeccable `skill-v4.8.0` | `upstream.json:608`; `THIRD_PARTY_NOTICES.md:55` | Scope: `skill-v4.8.1`, regenerado |
| `pending: '0297'` en un registro de juguete | `cli/test/kit/notices.test.ts:86` | se queda: es un dato de test, no la entrada real |
| «OpenSpec 1.14.1» como origen de la regla del eje Spec | `tests/batteries/sdd-verify/battery.md`, «Procedencia de las reglas» | se queda (es el origen de esa regla); la regla nueva tiene su fila con la v1.16.1 |

- Filas que implementa: 0297 → `roadmap.md:157`, la cierra `sdd-archive`; la fila de deuda «OpenSpec 1.14.2: el eje Spec busca un `REMOVED` solo por su título» (`roadmap.md:252`, «Actuar → 0152») → la salda esta feature, y la cierra `sdd-archive`. Las menciones de 0297 en las filas 0312 (✅), 0319, 0311, 0198 y 0152 son «tras 0297» o ejemplos, y no cambian: comprobado con `git grep -n "0297" -- . ':!.docs/sdd/specs/' ':!.docs/sdd/field-reports/' ':!tests/*.md' ':!dist/'`.

## Approach

La viñeta del `REMOVED` se sustituye entera por el borrador de la decisión 1, sin las frases de las reglas 2 y 3 si su RED sale limpio (decisión 4). OpenSpec pasa a `from` de la copia de `spec-reviewer-prompt.md` (decisión 2), y `kit:notices` y `kit:build` regeneran los avisos y `dist/`. El RED corre con el kit de `HEAD` antes de tocar la viñeta.

## Dónde se prueba

- El eje Spec busca el `REMOVED` por el cuerpo del vigente: batería de `sdd-verify`, `rm1` (como `f3`: el sujeto es el eje Spec con su encargo compuesto por `compose-axis.mjs`).
- El vigente sin cuerpo ni escenarios da «no verificado»: `rm2b` (y `rm2`, que no da la retirada por buena).
- El vigente que ya no está en el fichero se recupera del historial: `rm3`, con la fila de máquina de la decisión 8.
- El `REMOVED` con vigente que nombra lo retirado sigue dando Critical (el `MODIFIED`): control `f3`, cuyo `capabilities/bookings.md` dice que al anular se manda el correo.
- Las copias, las fuentes y los avisos: `node tests/copies/check.ts`, `moon run kit:upstream`, `moon run kit:notices` sin cambios tras regenerar, `moon run kit:build kit:own kit:skill-size` sin rojos nuevos, y el gate de cierre.

## Términos y ADR

- Términos resueltos: requisito vigente — el bloque `### <título>` de `capabilities/<capacidad>.md` que el `REMOVED` retira, el *baseline* de OpenSpec
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `verification`

#### MODIFIED — El eje Spec contrasta el diff con el delta de capacidades (antes: "GIVEN una spec cuyo delta trae `REMOVED — Las anulaciones se avisan por correo` en `bookings`, y un diff…")

- GIVEN una spec cuyo delta trae `REMOVED — Las anulaciones se avisan por correo` en `bookings`, su requisito vigente en `capabilities/bookings.md`, que al anular manda el correo al responsable de sala, y un diff que deja `sendCancellationMail()` llamado desde `annul()` en `src/annul.js`
- WHEN revisa el eje Spec
- THEN marca Critical «REMOVED sigue implementado: Las anulaciones se avisan por correo», con `src/annul.js:<línea>` y el tipo de hueco `contradicts`
- AND un `ADDED` o `MODIFIED` sin implementación es `missing` o `partial`, con el THEN del que sale
- AND un THEN cuya verificación nombrada en «Dónde se prueba» (un test, un escenario de batería, una captura) no está en el diff es un hallazgo; si el paquete no deja verlo, es «no verificado»
- AND con el mismo diff cambiando además la respuesta de `facturar` en `src/invoices.js`, de la capacidad `invoicing` que lista `sdd capability index`, y un delta sin subsección `invoicing`, marca Important `unrequested` «invoicing cambia sin delta: la respuesta de facturar»

#### ADDED — El eje Spec busca un REMOVED por lo que dice su requisito vigente

- GIVEN `REMOVED — Avisar por correo` en `bookings`, su vigente en `capabilities/bookings.md` con «AND `salida` lista «anulada Norte lun» para el responsable», y un diff que quita `formatMail()` y deja `outbox.push` en `voidBooking()`, sin «correo» ni «mail» en el código
- WHEN revisa el eje Spec
- THEN marca Critical `contradicts` «REMOVED sigue implementado: Avisar por correo» con la línea del `outbox.push`, porque busca lo que dicen el cuerpo y los escenarios del vigente, no su título

#### ADDED — El eje Spec recupera del historial un requisito vigente que ya no está

- GIVEN `REMOVED — Avisar por correo` en `bookings`, un diff que deja `outbox.push` en `voidBooking()`, y «Avisar por correo» fuera de `capabilities/bookings.md` en el sha revisado y con su escenario en un commit anterior
- WHEN revisa el eje Spec
- THEN lee el vigente con `git log -p -- .docs/sdd/capabilities/bookings.md` y marca Critical `contradicts` «REMOVED sigue implementado: Avisar por correo» con la línea del `outbox.push` en `src/app.js`

#### ADDED — Un REMOVED sin requisito vigente utilizable queda no verificado

- GIVEN `REMOVED — Avisar por correo` en `bookings`, un diff que deja `outbox.push` en `voidBooking()`, y un vigente que solo dice «- Se avisa por correo.», sin escenarios
- WHEN revisa el eje Spec
- THEN escribe en `### Not verified` «no verificado: sin requisito vigente utilizable» para esa entrada
- AND no la marca `missing` ni `contradicts`, ni la cuenta como superada

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-verify`, total (`dist/skills/sdd-verify/**/*.md`) | 9.577 / 11.400 (9.120 × 1,25) | 1.823 | sin cambio: lo previsto son ~95 palabras |
| Kit entero (`kitBudget`) | 103.156 / 111.660 (89.328 × 1,25) | 8.504 | sin cambio |

## Previsión de coste

Salida de `node tests/headless/battery.mjs plan` sobre una copia de `battery.md` con las tres filas nuevas (`opus`, n = 2): `SCENARIOS="rm1 rm2 rm3"` da «suma: 6 sujetos · coste previsto: 4.55 $ · sin precio medido: rm1, rm2, rm3 (a 0.76 $, la media de los escenarios medidos)», y `SCENARIOS=f3` da «suma: 2 sujetos · coste previsto: 1.52 $ · sin precio medido: f3 (a 0.76 $, …)». Unos 10 min por tanda, ~40 min de campaña.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `rm1`, `rm2`, `rm3`, n = 2: 6 | 4,55 |
| GREEN | `rm1`, `rm2`, `rm3`, n = 2: 6 | 4,55 |
| Una tanda de REFACTOR | n = 2 por regla nueva, tres reglas: 6 | 4,55 |
| Controles | `f3`, n = 2: 2 | 1,52 |
| Medición tras la revisión final | 0: solo si la pasada de fix toca la viñeta, y entonces `rm1` con `N=1` (0,76 $) | 0 |
| Suma | 20 | 15,17 |

## Enmiendas

- 2026-11-08 — RED de la Task 1 (`tests/sdd-verify-0297-removed.md`): reglas 1 y 2 limpias (RM1 2/2, RM3 2/2), regla 3 con RM2 0/2 pero con los sujetos encontrando el Critical real por el diff. Propuesta: la viñeta del `REMOVED` no cambia por las reglas 1 y 2; la 3 se mide antes con `rm2b` (vigente sin cuerpo y un diff que no delata el aviso, 2 sujetos, ~1,5 $) y entra con su GREEN solo si `rm2b` da la retirada por buena; RM2 pasa a fallar solo si da la retirada por buena; OpenSpec a `from` en `v1.16.1` e impeccable a `skill-v4.8.1` siguen; del delta se quedan los ADDED 1 y 2, y el ADDED 3 y el `MODIFIED` siguen a la regla 3 — Task 2 (solo `upstream.json` y avisos) y Task 3 (`rm2b`, RM2 y, si entra, la regla 3 con su GREEN) — aprobada: «1»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada (opción «Apruebo») |
