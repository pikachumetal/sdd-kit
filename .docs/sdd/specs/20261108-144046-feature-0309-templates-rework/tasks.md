# Tasks — feature 0309

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El Approach con sus enfoques y la previsión con la salida del comando | hecha (enmienda del 2026-11-09) | 42b90ad0 |
| 2 — Una forma por regla en `sdd-templates` (P10, P11, P12, P16, P19, P20) | hecha; afectada por enmienda 2026-11-09 → Task 3 | f67ff379 |
| 3 — enmienda 2026-11-09: la regla de reparto, P16 y P12 con una forma en plan, architecture y proposal | hecha | 27c20ff2 |
| 4 — segunda enmienda 2026-11-09: la regla de reparto en operations y la línea `- REMOVED` del patch | hecha | (este commit) |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre f67ff379
Pasada de fix: e8069923, 6 hallazgos (sin test que los reproduzca: fila de batería, plantillas y molde; suites 963/963 y 448/448); enmienda 27c20ff2 (Task 3)
Re-revisión: f67ff379..5270de73, sdd-kit:effort-high + opus, Spec I4 a medias y 3 Minor nuevos
Tras la re-revisión: 20ef3c4b, revisado por la revisión Opus de la enmienda que pidió el dev-lead («haz una revisión opus de la enmienda»), sin defectos; sin revisar: 97c8039e — aplica literales los arreglos de esa revisión (operations-template.md:3, la línea REMOVED del patch, CO4-T tolerante)

## Rulings

- Task 1: Ruling: la fila Suma de la previsión («16 sujetos, ~50 min en tandas de hasta 3») no casa con la regex de campaign.mjs — paso SUBJECT_CAP=16, el total de la spec, en cada tanda, sin enmendar la spec — si estuviera mal, el techo sería el mismo número que la spec aprobó
- Task 1: Ruling: `npx vitest` de la «Verificación» falla en Git Bash (MODULE_NOT_FOUND vitest.mjs); corro `pnpm exec vitest` desde cli/, el mismo binario — si estuviera mal, saldría el mismo recuento que moon cli:test
- Task 1: Ruling: kit:own sale con 1, igual que en la base: mismas 26 líneas (diff vacío contra own-base) — el criterio es «sin rojos nuevos» — si una línea nueva se colara, el diff la habría mostrado
- Task 1: Ruling: «tal cual, la línea `suma:`» en la ayuda de la previsión de spec-template.md (opción 1 del dev-lead: «1») — aplica literal el AND de la spec («cada fila cita la línea `suma: …`»), sin tanda propia: lo mide la medición final co4 pb N=1 — si no basta, la medición sale roja y se para
- Task 1: Ruling: el node replace de la enmienda en battery.md tomó «$`» como patrón y metió el fichero dentro de la fila CO4; el REFACTOR y los controles corrieron con esa batería (los sujetos no la leen; el veredicto omitió L) — arreglado con split/join, L leída a mano en los 6 sujetos (0 mensajes en inglés), kit:test-headless 448/448 — si quedara algo, battery.test.ts lo habría visto
- Task 1: Ruling: molds.test.ts id1 «unable to migrate temporary objects» en la primera pasada de kit:test-headless, no en la segunda — fallo pasajero de git, no del cambio — si fuera real, volvería en el gate de cierre
- Task 1: Ruling: el pre-commit (notices.test.ts) pide regenerar THIRD_PARTY_NOTICES.md tras cambiar upstream.json; el plan no lo nombraba — moon run kit:notices, una fila que añade spec-template.md al concepto brainstorming — si estuviera mal, notices.test.ts seguiría rojo
- Task 1: Ruling: kit:copies rojo («skills/sdd-verify/references/: sin anotar → 0297»), también en la base 74988a8b (worktree aparte) — heredado, la rama no toca sdd-verify ni su entrada de upstream.json; task done con kit:build kit:test-headless, porque kit:own y kit:copies salen con 1 ya en la base (kit:own: mismas 26 líneas que la base, comparado aparte) — si el rojo fuera nuevo, la base no lo daría
- Task 2: Ruling: base — origin/develop no toca ningún fichero de la Task 2 ni la fila 0309 (la 0311 cambia en su texto, no esta) — sin freno
- Task 2: humo a2 t3 N=1: 2/2 (0,66 $; campaña 11,86 de 14 $); a2 no ejercita P10 ni P19 del patch (molde en campo, sin estimation.md). Ruling: t3 relanzado solo, el techo COST_CAP=12.5 reservaba 0,78 $ por sujeto en curso — sin coste extra
- Task 2: Ruling: la primera pasada de task done dio 3 timeouts de 5 s en *.slow.test.ts (hooks, manifests, upstream-watch), que pasaron antes y en la segunda — carga de la máquina — si fueran reales, el gate de cierre los vuelve a correr
- Final: Ruling: Spec I2 (CO4 nunca 2/2) — se mide con la medición final co4 pb N=1 que eligió el dev-lead («1»); el walkthrough lo dice con su frase y el recuento 1/2 + 1/2 + medición — si sale rojo, se para
- Final: Ruling: Spec I3 (el humo no observó P10, P11, P19, P20 del patch ni el Validado del walkthrough) — no probado en la 4.2 del walkthrough: a2 valida en campo sin estimation.md y t3 con agente; otro molde costaría una tanda fuera de la previsión — si una forma está mal, la verá el primer cierre en campo y su ticket
- Final: Ruling: Spec M5 y Código M6 (la decisión central «en el mensaje o en el ✋») — sigue cierto: en delegate el ✋ nombra el elegido, y en unattended, por delegación o tras «empieza ya» el elegido es lo que se habría preguntado, que va al ✋ (spec-writing.md:36) — si un revisor de spec no lo encuentra, lo busca en el Approach
- Final: Ruling: Spec M8 (la variante del panel no está en la plantilla) — la forma del panel vive en sdd-archive (archive.md:160) y cabe en «<frase literal>» — sin coste: no cambia lo que escribe el cierre
- Final: Ruling: Spec M9 (las celdas solo enseñan la rama con comando) — la rama sin comando es la excepción que dice la ayuda; dos juegos de celdas serían la regla en dos formas — si confunde, una spec sin comando reescribe las celdas
- Final: Ruling: Spec M10 (P12 depende de abrir otro fichero) — es la tabla aprobada de la decisión 3; spec-writing.md:22 conserva el slug — si falla, lo medirá la 0311
- Final: Ruling: Código M1 (<n> y <x> pasan a huecos de TEMPLATE_GAPS) — merge.ts quita los code spans antes de mirar, y un <n> suelto en una capacidad viva es un hueco sin rellenar — si un delta legítimo lo lleva, el merge lo rechaza con un mensaje claro
- Final: Ruling: Código M2 (la regla del Approach en spec-writing.md :16, :30 y la plantilla) — :16 resume la sección y apunta a «Approaches»; la copia entre skills es de la 0311 — si diverge, kit:own de la 0311 lo verá
- Final: Ruling: Código M3 (el criterio de agente igual en patch y spec) — es P11 de la decisión 3: las mismas palabras, a propósito — sin coste
- Final: Ruling: Código M8 (sdd-propose/SKILL.md a 39 bytes del límite) — informativo; kit:skill-size lo para en el próximo cambio — sin coste ahora
- Final: Ruling: Spec «declined» (cr2 y cr3 sin correr con el molde cambiado) — solo cambió el comando nuevo y la línea de tech-stack; cr1 de control 1/1 — si rompe, su próxima campaña lo verá
- Final: Ruling: L rojo en co4-1 de la medición final — el diff no toca el idioma de ningún texto y L pasó en los 13 sujetos anteriores; va al ticket, sin tanda (la previsión no da para otra) — si fuera del cambio, la siguiente campaña de sdd-propose lo repetiría
- Final: Ruling: Spec M6 deshecho — la frase de los subagentes vuelve a los dos huecos de Esfuerzo real, iguales: en el Método de estimation-template.md no la lee sdd-archive ni la reciben los proyectos ya creados, y era la medida GREEN de la task 0010 (re-revisión, Minor) — si molesta repetida, la 0311 la lleva a includes/
- Final: Ruling: PRODUCT-template.md:19 («el comportamiento detallado vive en capabilities/: aquí va el alcance») se queda — marca la frontera del alcance de PRODUCT.md, no repite la regla de reparto (revisión Opus de la enmienda: dudoso, a criterio del dev-lead, que eligió «1») — si un agente pone un valor en «Es:», la 0311 lo iguala
