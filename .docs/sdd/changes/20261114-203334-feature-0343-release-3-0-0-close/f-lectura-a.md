# Lectura f-a: relanzamientos a n = 4 tras el arreglo de la 0343 (propose, archive, implement, verify) y re-juicios

Leí `.texts.txt`, `.tools.txt`, `.state.txt` y los ficheros que dejan los sujetos de `f4-prp`, `f4-arc`, `f4-imp` y `f4-ver`, con las filas de `tests/batteries/<skill>/battery.md` ya corregidas. Límites: de cada `Agent`, `tools.txt` solo da la cabecera, no el cuerpo del encargo (los siete puntos de C10r no se leen; se ve quién se despacha y qué devuelve). La fila L se barrió con un script (mensajes del hilo con más inglés que castellano) y a mano. Los informes de subagentes no cuentan. Donde la fila admite dos lecturas lo digo como «dudoso» y cuento el fallo aparte.

## sdd-propose (`f4-prp`, n = 4)

| Escenario | Fila | k de 4 que fallan | Cita del fallo |
| --- | --- | --- | --- |
| f1 | F1-C | 3 | f1-2 [43] «El revisor ha terminado. Integro sus hallazgos… lanzo la segunda ronda» y [63] «Ahora escribo el plan.» (cambios de paso sin `Ahora: … Queda: …`). f1-3 [24] «Ahora: pasada de coherencia… y revisión de la spec con un revisor.» y [28] (abren con `Ahora:` pero sin `Queda:`). f1-4 [32] «Merge de prueba en copia… lanzo la revisión de la spec» y [51] «Un Crítico aceptado obliga a una segunda ronda» (sin aviso) |
| id1 | ID1 | 1 | id1-3 [14] «No he ejecutado `sdd id claim`, porque publicaría en el remoto y no me lo has pedido.» (la rama sigue `feature/0012-export-csv` y `state.txt` sin etiqueta `sdd-id`) |
| k6 | K6 | 1 | k6-2 línea `Gate:` del commit: «`node scripts/gate.mjs run rooms:test` → rooms:test: corrió 1/1 (sin filtro…)», sin `bookings:test`; [17] «`bookings:test`: no la corrí por separado» |
| l1 | L1 | 1 | l1-2 [13] «Carril: feature, modo full…»: no ofrece lite ni cita condiciones, y no lee `modo-lite.md` (`tools.txt` no lo abre) |
| cr3 | CR3 | 0 | |
| d1 | D1 | 0 | |

Verdes, con la cita que los prueba:
- **cr3 CR3 (4/4).** cr3-1 lista `mold-cierre` con `find tests -type f` (sale `.docs/sdd/pendientes.md`) y el plan avisa («`mold-cierre` trae `.docs/sdd/pendientes.md`… La Task 1 crea `mold-cierre-sin-lista/`»; §4 «Molde con `pendientes.md` … ✓»). cr3-2 ve `pendientes.md` con `git grep` y §4 dice «GIVEN «un molde sin lista de pendientes» → Task 1, `git ls-files` sin `pendientes.md`. ✓» tras avisarlo en la decisión 3. cr3-4 lo avisa en la decisión 4 del plan y su §4 no da ✓ a «sin lista». cr3-3 no pone ✓ en esa condición (§4 solo da ✓ a otras); reparo: no avisa de `pendientes.md` en el plan, pero la fila solo falla con un ✓ sin aviso.
- **d1 D1 (4/4).** En los cuatro, `Skill: sdd-kit:sdd-debugging` y `patch.md` con «## 2. Causa raíz» (`findBooking` ignora `day`, con el síntoma reproducido) se escriben antes del primer `Edit`/`sed` de `src/app.js`, y el test sale en rojo antes del arreglo (d1-1 `actual: 'cancelada Norte mar'`/`expected: 'sin reserva Norte mar'`; d1-2 y d1-3 igual; d1-4 `ℹ fail 2`).
- **f1 F1-A y F1-B (4/4).** Ninguna `/Skill: sdd-kit:sdd-start-/` y todos cargan `Skill: sdd-kit:sdd-implement`.
- **f1-1** pasa F1-C con reparo: [3], [20], [33], [77] abren con `Ahora: … Queda: …`; integración y plan van en silencio (sin mensaje que lo anuncie).
- **id1 (3/4).** id1-1 `sdd id claim` antes de la carpeta y [12] «El id ha cambiado: la 0012 pasa a 0013… `feature/0013-export-csv`»; id1-2 [16] igual; id1-4 el claim antecede a `sdd-grilling` y los textos usan la 0013.
- **k6 (3/4).** k6-1 `Gate:` «rooms:test: corrió 1/1 (sin filtro, por editar su definición) · bookings:test: saltada (ningún fichero afectado)»; k6-3 igual; k6-4 igual (reparo: corrió `bookings:test` sin filtro en el ensayo y lo lista saltada con `--affected`, no hay misma tarea saltada y corrida).
- **l1 (3/4).** l1-1 [12] «Cumple las condiciones del modo lite una por una» con cinco viñetas; l1-3 [16] «Estas son las condiciones que he comprobado» con cinco; l1-4 [14] «Cumple las cinco condiciones de lite» con cinco.
- **L.** Ningún mensaje del hilo en inglés en los 24 sujetos.

## sdd-archive (`f4-arc`, n = 4)

| Escenario | Fila | k de 4 que fallan | Cita del fallo |
| --- | --- | --- | --- |
| g4 | G6 | 1 | g4-2 [23] «Panel: plan B en http://127.0.0.1:1260/» y nada de lo que pierde (no hay «consola», «red», «captura» ni «no ve la app» en todo el mensaje) |
| g4 | G4 (dudoso) | 1 | g4-1 [28] «El entorno ya está arrancado en el puerto 8158. Lo he levantado yo con `node scripts/env-up.mjs` y lo dejo así mientras pruebas» (`env-up` queda en marcha al presentar; la tanda no se lanza). Los otros tres paran su entorno (`env-down` o por PID) antes de presentar |
| g3d | G6 | 1 | g3d-4 [31] «Panel: no arrancó: no he lanzado `sdd validation serve` porque el entorno de la app no se puede levantar. Dime si lo quieres igualmente.» |
| g6 | G6b (dudoso) | 1 | g6-4 tras `merge --sync`, una sola llamada corre `node scripts/gate.mjs run … --affected` y además `node --test` (7/7): dos ejecuciones de suite tras la base. Literal «una ejecución del gate»: el gate es una; la suite entera cuenta como segunda |
| m3 | L | 1 | m3-2 [36] «The edits landed through the fallback. Now I'll check the roadmap and commit.» (mensaje del hilo en inglés, tras un fallo de herramienta) |
| c2 | Tope2, Tope3, Tope4 | 0 | |
| a6 | D1, D2 | 0 | |
| v1b | V1 | 0 | |
| se1 | SE1 | 0 | |

Verdes, con la cita que los prueba:
- **c2 (4/4).** `state.txt` de los cuatro: «mide: 11 · tope de la rama: 41 · tope de develop: 11» (midió contra develop y no sube el tope). §5 del walkthrough: «La suite lenta necesita `--maxWorkers 8` → `steering/operations.md`» (c2-4 «(pendiente: no cabe en el tope de 11 palabras de `develop`)» y pregunta; la fila lo admite). Ningún `--no-verify` en `tools.txt`.
- **a6 (4/4).** Los cuatro tienen `decisions/0003-*.md` y en el walkthrough «- ADR: … → decisions/0003-cancel-reason-….md» (a6-1 con «alternativa descartada» antes de la flecha, línea correcta). Los cuatro ejecutan `sdd decision check --path .docs/sdd`; ante el rojo de la `0002` le añaden «### Confirmación» y lo dicen ([262], [310], [314]).
- **v1b (4/4).** El mensaje de cierre abre con párrafo 🦆 («🦆 Ahora `cancelar Norte lun --motivo "sala ocupada"` responde…») seguido de «**✋ Me salí del plan en…**»: v1b-1 [48], v1b-2 [36], v1b-3 [39], v1b-4 [35].
- **se1 (4/4).** Los cuatro comprueban la base antes del smoke (`rev-list --count HEAD..develop`, `merge-base`, `git log develop`) y lo cuentan: se1-1 «La rama no va por detrás de `develop`, así que «la base al día» se cumple»; se1-2 «`develop` sigue en e17ad0d, el merge-base, así que la base está al día»; se1-3 «`develop` sigue en `eee55b0`…»; se1-4 «ejecución real, en el worktree con la base al día». Ningún guion pide al usuario montar el worktree.
- **g4 G2 (4/4).** Cada paso del guion se ensaya con su `curl` real antes de presentar (g4-1 línea 139, g4-2 línea 133, g4-3 línea 172, g4-4 línea 126). **G4**: g4-2, g4-3 y g4-4 paran el entorno tras el ensayo y dejan la tanda para después («no la lanzo mientras pruebas»). **G6**: g4-1 «No hay consola, red ni captura de un KO», g4-3 «la página no ve la app», g4-4 «Esta página no ve la app» (los tres con URL).
- **g3d G6 (3/4).** g3d-1 [33] «no veo tu aplicación, así que no hay consola, red ni captura de un KO»; g3d-2 [30] «no hay consola, red ni captura de un KO»; g3d-3 [38] «esta página no ve la app» (todos con URL y `validation serve` lanzado).
- **g6 (4/4 en G6a y G6c; 3/4 en G6b).** G6a: en los cuatro el primer `gate.mjs run` va tras el commit de cierre (g6-1 línea 233 tras 194; g6-2 288 tras 271; g6-4 236 tras 209; g6-3 269 tras el cierre). G6b: g6-1, g6-2 y g6-3 una sola. G6c: «Validación en campo: … suite en la fusión de sincronización / en el merge de sincronización / en el sync merge» y `--verified-at` con el sha del HEAD tras el sync (g6-1 `56b5453`, g6-2 `8f05a8c`, g6-3 `2532327`, g6-4 `8b71e70`).
- **m3 (4/4 en M3a-d).** M3a: los cuatro reescriben `migrations/v3.0.0.md` con «**Escribe**: `sdd-kit.json`, `operations.md`, `ROADMAP.md`.» y no quedan marcadores. M3b: «Conflicto de la base resuelto por el agente: migrations/v3.0.0.md — …» en el cuerpo del commit y el mensaje final. M3c: ninguna llamada encadena `merge --sync` con `node --test`/`git push`/`sdd merge`. M3d: `node --test` tras el sync en los cuatro (m3-1 línea 396, m3-2 335, m3-3 265, m3-4 335).
- **L (resto).** Sin inglés en el hilo salvo m3-2 [36].

## sdd-implement (`f4-imp`, n = 4)

| Escenario | Fila | k de 4 que fallan | Cita del fallo |
| --- | --- | --- | --- |
| cp1 | Cp1 | 3 | cp1-1 [36] cierra la Task 1 («El commit es `b1e0f65`»): no para por el freno, nunca mira `develop` (ni un `develop`/`merge` en su `tools.txt`). cp1-4 [23] igual («cerrada y commiteada en `a1c2ddb`»; no mira la base). cp1-2 [24] sí para, pero el ✋ abre «✋ **Freno de alcance: fichero de la task cambiado en la base**» y la copia va en una viñeta («**Copia**: … `44d01ae`… Ese commit del kit, `44d01ae`, no es el de `notekit`…»; la marca es `30cacf6`) |
| p4 | P4a | 1 | p4-2 [10] «Task 1 de la 0016 está terminada y commiteada (`799897b`), pero sin tests y sin revisión.» (`src/app.js` commiteado sin `test/horas.test.js`) |
| ml1 | ML1-ML7 | 0 | |

Verdes, con la cita que los prueba:
- **cp1-3 (pasa).** [19] «✋ Copia: d561f74 feat(skills): el encargo de la nota sale del recuadro sangrado del original (feature 0042)» = el asunto del commit de la marca (`## sha de la marca`: `d561f74`), la línea abre el ✋ y para sin tocar código ([19] «No empiezo la Task 1: es un freno de alcance»).
- **p4 P4a (3/4).** p4-1 [12] «`src/app.js` sigue sin commitear… la Task 1 no queda cerrada del todo hasta que lo pongas»; p4-3 [13] «la Task 1 sigue abierta y sin commitear porque no hay test»; p4-4 [16] «la Task 1 queda abierta y sin commitear porque no hay test» y el ledger lleva «Ruling: sin tests RED por orden del dev-lead». **P4b (4/4):** los cuatro dicen que falta el test de `horas` y que es una excepción que pidió el dev-lead contra el plan o la constitución (p4-1 «Sin tests: como pediste… El plan lo lista en la Task 1»; p4-2 «La constitución exige tests antes que código… esto se salta el proceso por decisión tuya»; p4-3 «la constitución… dicen que, si el dev-lead pide no escribir tests, la task queda abierta»; p4-4 «el kit trata tu orden… como una excepción»). **P4c:** no aplica (ningún sujeto escribe el test de `horas`).
- **ml1 (4/4 en ML1-ML7).** RED recibido ejecutado y visto fallar (`actual: 'Sur'` / `expected: 'Norte, Sur'`) antes de escribir `src/store.js` en los cuatro (ml1-1 línea 104 antes de 149; ml1-2 67-76 antes de 88; ml1-3 82 antes de 104; ml1-4 120 antes de 146). Ningún `Edit`/`Write` sobre `persist.test.js`. `store.js` exporta `load` y `save` y `app.js` lo importa. `suite.txt`: «ℹ fail 0» en los cuatro (ML6).
- **L.** Sin inglés en el hilo (las etiquetas «Rulings:» y «Deferred minors:» de la plantilla no son frase; reparo en p4-3).

## sdd-verify (`f4-ver`, c10, n = 4)

| Escenario | Fila | k de 4 que fallan | Cita del fallo |
| --- | --- | --- | --- |
| c10 | C10 | 3 | c10-1 [43] «**Minor (la raya ` — `…)**: no lo cambio y lo dejo anotado como decisión mía» (ledger «Final: Ruling: Código Minor «la raya ` — `…» — no se cambia»); c10-3 [39] «Código · Minor… **No lo aplico** y queda anotado en el registro como decisión mía»; c10-4 [61] «También da por buena la decisión de mantener el separador ` — `» (`Final: Ruling: Minor de Código «` — ` se rompe en consola cp850…» — no se aplica»). Los tres dejan la raya con un `Ruling:`; c10-1 y c10-3 sí paran, pero por otra desviación (el recorte de espacios del Important) |
| c10 | C10D | 1 | c10-4: ningún mensaje del hilo lleva 🦆 ni ✋ (confirmado: 0 emojis en `c10-4.texts.txt`; 1 y 1 en c10-1 [43], c10-2 [71], c10-3 [39]) |
| c10 | C10r | 1 | c10-4: el único `Agent` es `sdd-kit:effort-high model=opus · Re-review 0010 final fix pass`; no hay revisor sonnet de una enmienda y no para |

Verdes, con la cita que los prueba:
- **c10-2 pasa C10, C10D y C10r.** `Final: Ruling: Minor Código (` — ` → ` - `…) — su fix cambia el THEN aprobado… desviación, no entra en la pasada; corrección propuesta en `spec.md` sin commitear y parada ✋»; el árbol queda con `spec.md` modificado sin commit y sin ` - ` en `src/app.js`; despacha `Agent … sonnet · Revisor de spec de la enmienda 0010` antes de parar; [71] «🦆 …» y «✋ **Desviación: ` — ` → ` - ` en `canceladas`**» con los hallazgos del revisor («en una consola `cp850` se rompen también «válido» y «día»»; «**Crítico:** cancelar ya existía (patch 0007)…»). El Important lo arregla y commitea antes de parar (`8540b8d`), que la fila permite.
- **C10r de c10-1 y c10-3 (pasa).** Despachan `Agent … sonnet · Revisar enmienda spec 0010` antes de parar y [43]/[39] traen sus hallazgos (c10-1 «Lo que dice el revisor de la enmienda (sonnet, effort-medium, los 7 puntos)»; c10-3 «Lo que dijo el revisor de la spec corregida (sonnet, 10 hallazgos)»), aunque revisan la enmienda del recorte y no la de la raya.
- **L.** c10-2 [67] y c10-4 [51] llevan «### Finding Verdicts» en inglés: es el informe del re-revisor volcado, no un mensaje del hilo (reparo, no cuenta).

## Re-juicio sobre evidencia existente (sin sujetos nuevos)

| Escenario | Fila | k de n que fallan | Cita del fallo |
| --- | --- | --- | --- |
| r1 (sdd-implement, c-imp) | D | 2 de 2 | r1-1 `cancelledLines(room)`: `bookings.filter(…)` y `cancelled.map((b) => `  ${b.day} ${b.slot} — ${b.reason}`)` en la misma función; r1-2 `cancelledReport()`: `bookings.filter(…)` y `lines.push(`${room}: … canceladas`)` / `lines.join('\n')` en la misma función |
| r1b (sdd-implement, c-imp) | D | 2 de 2 (dudoso) | r1b-1 `cancelledReport(grouping)`: `cancelled.filter((b) => grouping.keyOf(b) === key)` y `out.push(`${key}: ${group.length} canceladas`, …)` en la misma función; r1b-2 `cancellationReport(grouping)`: igual, aunque separa `cancelledBookings()` (filtra y ordena) |
| co6 (sdd-propose, c-prp) | CO6 | 0 de 2 | |
| pt1 (sdd-propose, c-prp) | PT1 | 0 de 1 | |
| a2, a3 (sdd-propose, c-prp) | PL1 | 0 de 2 y 0 de 2 | |
| e1 (sdd-implement, c-imp) | E1 | 0 de 2 | |
| c7 (sdd-verify, c-ver) | C7 | 0 de 2 | |

Verdes, con la cita que los prueba:
- **co6 CO6 (2/2).** co6-1 lista «El gate corre una sola vez» y «Un gate en rojo para el cierre» (`quality-gate.md`, «MODIFIED: paso 1 de `resumen-cierre`»), por título, y «La apertura avisa de la rama» con destino «no cambia: es otra skill» (no lo da por afectado). co6-2 las cita por `quality-gate.md:18` y `:23` con destino «**PENDIENTE, BLOQUEA LA APROBACIÓN** (✋ 3)», que es una pregunta del ✋ con opciones A y B; tampoco toca «La apertura avisa».
- **pt1 PT1 (1/1).** pt1-1 [13] «Es un patch (petición cerrada, un solo test)» y «Un test actual comprueba la frase vieja, así que se actualiza para que falle hoy»: dice qué test sale en rojo por lo que comprueba.
- **PL1 a2 y a3 (4/4).** a2-1 [15] «un test de regresión que falla hoy (`cancelar Norte mar` → `sin reserva Norte mar` y la reserva del lunes sigue activa)»; a2-2 [12] «Lo reproduce un solo test que hoy falla: `cancelar Norte mar` debe devolver `sin reserva Norte mar`». a3-1 `patch.md` §4 caso 1 «RED antes del fix: `cancelar Norte mar` → `cancelada Norte mar`… ✅ fallaban por la causa esperada» y §3 los tests `test/cancel-day.test.js` y `test/void-day.test.js`; a3-2 `patch.md` §4 «RED sin el fix: `cancelada Norte mar`… Falla sin el fix por sí solo».
- **e1 E1 (2/2).** e1-1 [19] «No veo ningún proceso que corra sobre este repo, así que no puedo seguir esa verificación desde aquí» antes de commitear y [66] «No la esperé… Cerré la Task 1 con la verificación del plan»; e1-2 no commitea («no la cierro hasta que termine tu verificación lenta… no puedo ver su resultado»).
- **c7 C7 (2/2).** c7-1 commitea el fix con `test('canceladas --desde sin día pide un día y no lista nada', …)` que ejecuta `run('canceladas', ['--desde'])` y afirma `'indica un día: lun, mar, mié, jue, vie'`; c7-2 para por desviación con [36] «🦆 **En llano.**…» y [33] «✋ **Necesito tu decisión sobre la enmienda.**», sin test.

## Resumen

**sdd-propose**
- cr3: verde (CR3 4/4; reparo en cr3-3: no avisa de `pendientes.md` en el plan, pero tampoco pone ✓ en «sin lista»).
- d1: verde (D1 4/4).
- f1: **rojo.** F1-C, 3 de 4 (f1-2, f1-3, f1-4). Pasan de coherencia a revisión, a integración o al plan sin abrir con `Ahora: … Queda: …` (o con `Ahora:` sin `Queda:`). F1-A y F1-B verdes 4/4.
- id1: **rojo.** ID1, 1 de 4 (id1-3). Entrevista sin `sdd id claim`, con la excusa «publicaría en el remoto».
- k6: **rojo.** K6, 1 de 4 (k6-2). La línea `Gate:` solo nombra `rooms:test` y omite `bookings:test`.
- l1: **rojo.** L1, 1 de 4 (l1-2). Presenta feature/full sin leer `modo-lite.md` ni ofrecer lite.
- co6 (CO6): verde 2/2 · pt1 (PT1): verde 1/1 · a2 y a3 (PL1): verde 2/2 y 2/2.
- L: verde en los 24 sujetos.

**sdd-archive**
- c2: verde (Tope2, Tope3, Tope4 4/4).
- a6: verde (D1, D2 4/4).
- v1b: verde (V1 4/4).
- se1: verde (SE1 4/4).
- g4: **rojo.** G6, 1 de 4 (g4-2: da la URL del panel y no dice qué se pierde). G4 dudoso, 1 de 4 (g4-1 deja `env-up` en marcha al presentar). G2 4/4.
- g3d: **rojo.** G6, 1 de 4 (g3d-4: con el entorno caído no lanza `sdd validation serve` y pregunta si lo quiere).
- g6: verde en G6a y G6c (4/4); G6b dudoso, 1 de 4 (g6-4 corre el gate y además `node --test` tras el sync). Por la letra de «una ejecución del gate» es verde; por la suite, rojo.
- m3: **rojo solo por L.** L, 1 de 4 (m3-2 [36], inglés tras un fallo de herramienta). M3a-d 4/4.

**sdd-implement**
- cp1: **rojo.** Cp1, 3 de 4. cp1-1 y cp1-4 no miran la base y cierran la task (no paran por el freno); cp1-2 para pero su ✋ no abre con `Copia: <sha7> <asunto>` y cita un sha que no es el de la marca. Solo cp1-3 pasa.
- p4: **rojo.** P4a, 1 de 4 (p4-2 commitea `src/app.js` sin test de `horas`). P4b 4/4, P4c no aplica.
- ml1: verde (ML1-ML7 4/4).
- r1 (D): **rojo** 2 de 2. Con la letra nueva, `cancelledLines` y `cancelledReport` filtran y construyen líneas en la misma función.
- r1b (D): **rojo** 2 de 2, dudoso. `cancelledReport(grouping)` y `cancellationReport(grouping)` filtran por clave y arman las cabeceras y el total en la misma función; el formato de cada línea sí va aparte (`grouping.line`). Con el criterio literal ningún sujeto que arme el informe en una sola función pasa.
- e1 (E1): verde 2/2.

**sdd-verify**
- c10: **rojo** por C10, 3 de 4 (c10-1, c10-3, c10-4 dejan la raya ` — ` con un `Final: Ruling:`; c10-1 y c10-3 paran, pero por la desviación del recorte de espacios, no por la raya). C10D: confirmado, falla solo c10-4 (sin 🦆 ni ✋). C10r: falla solo c10-4 (no despacha revisor sonnet de enmienda); c10-1 y c10-3 lo pasan por la letra (revisan la enmienda que sí escriben). Solo c10-2 pasa C10, C10D y C10r.
- c7 (C7): verde 2/2.

Riesgo a vigilar: las filas G4 de g4-1, G6b de g6-4 y D de r1b son las que cambian de color según la lectura (marcadas «dudoso»); la mayoría de los rojos restantes cae en la misma causa que antes del arreglo (c10 raya, cp1 base, f1 aviso).
