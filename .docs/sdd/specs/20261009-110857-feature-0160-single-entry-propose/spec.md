---
id: 20261009-110857-feature-0160-single-entry-propose
feature: 0160
parent: 0146
proposal: 0131
title: Entrada única — sdd-propose con cinco carriles y ceremonia asimétrica
mode: full
profile: delegate
status: approved
created: 2026-10-09
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-09
---

# Spec — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica

🦆 Cuando pidas un cambio, entrará siempre por la misma puerta, que mira un poco el proyecto antes de decidir qué tipo de trabajo es. Si es una feature, como «que el responsable de sala pueda anular reservas de otros», te dirá qué carril y qué perfil usa y seguirá directo con la entrevista, sin preguntarte nada. Si es algo más ligero (un arreglo, una feature pequeña o un cambio de configuración como subir una dependencia), te preguntará antes, con una explicación como esta y, si es un arreglo, las horas que calcula. El cambio de configuración pasará las pruebas del proyecto antes de guardarse, y el plan copiará el comando de las pruebas del documento de operaciones en vez de inventarlo. Una investigación con tabla de medidas ya se reconocerá como spike, y su forma completa llega en la feature siguiente.

## Capacidades

- Modificadas: `routing` — toda petición de cambio entra por `sdd-propose`, que la clasifica en uno de cinco carriles (config, patch, lite, feature, spike); la edición sin comportamiento pasa a ser el carril config.
- Modificadas: `control-profiles` — la primera pregunta deja de ser fija: full y spike anuncian y siguen; patch, lite y config preguntan; partir una feature grande sigue siendo pregunta.
- Modificadas: `feature-flow` — el gate de cierre del plan sale de `operations.md`, literal; la carpeta, el lite, el diseño con `sdd-grilling`, el aviso de fase y la review de spec pasan a nombrar `sdd-propose`.
- Modificadas: `capabilities` — el índice lo ejecuta `sdd-propose` en su paso de contexto.
- Modificadas: `estimation` — la estimación de un patch se escribe antes del fix, con la hora de inicio.
- Modificadas: `explaining` — la pregunta de un carril que pregunta abre con su 🦆.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec: dos revisores, dominio en Opus y técnica en Sonnet (elegida por el dev-lead) — señales: contrato público (las `description` de tres skills de entrada y el formato de `patch.md` §5, que lee `sdd estimation log`), MODIFIED (24 requisitos), tres o más capacidades (seis), área no explorada (el parser de estimación y el flujo de `sdd-start-patch`) · tamaño: ~600 líneas en ~45 ficheros
- Dominio (Opus): si la ceremonia asimétrica y el carril config encajan con «El perfil de control decide dónde para el agente», y si «Reglas que se mueven» deja alguna regla sin destino
- Técnica (Sonnet): si `Estimación:` e `Inicio:` rompen el parser de `sdd estimation log`, si los tests Pester que citan los pasos 1-5 están en el Scope y si la previsión de coste cubre cada paso nuevo
- Mínimo razonable: un revisor de siete puntos en Opus — deja más superficial el parser y los tests que citan lo movido
```

1. **La skill nueva se llama `sdd-propose` y se escribe en inglés** (Art. III: una skill nueva va en inglés y habla al usuario en su idioma). Es la única puerta de un cambio: el 🦆, el ✋, «Dónde se prueba», el gate con opciones fijas, el revisor de dominio y las tasks con `Tras` de la 0146 pasan a ella traducidos.
2. **`sdd-propose` se queda con lo que va antes de implementar; el resto no se mueve todavía.** Se lleva de `sdd-start-feature` el Gate 1 y los pasos 1 a 5 (contexto, enrutado, rama, spec y plan), y de `sdd-start-patch` el árbol «¿Es de verdad un patch?» con sus predicados, porque clasificar es de la entrada. `sdd-start-feature` conserva los pasos 6, 7 y 8 con su numeración (otros textos citan «el paso 6» y «el paso 7»: renumerar los rompe para nada, y la 0147 reescribe implement), y `sdd-start-patch` conserva su flujo del paso 1 al 6. Ninguna de las dos es ya una puerta: su `description` dice que la invoca `sdd-propose`, o que se usan al retomar trabajo empezado. Absorber también el flujo del patch y los pasos 6 a 8 metería en `sdd-propose` lo que la 0147 y la 0149 van a reescribir, y se movería dos veces.
3. **Las referencias no se mueven.** `modo-lite.md`, `nombrado.md`, `review-spec.md`, `control-profiles.md` y `frontend-verification.md` siguen en `sdd-start-feature/references/`, y `sdd-propose` las enlaza con ruta relativa, como ya hace `sdd-start-patch`. `review-spec.md` se queda en castellano hasta que la reescriba quien la mueva.
4. **Ceremonia asimétrica.** Tras leer el contexto e investigar lo justo para clasificar (los docs y el código que toca la petición; sin enunciado, sigue parando como hoy), `sdd-propose` clasifica con los predicados del kit y:
   - **full y spike anuncian y siguen**, en un mensaje que abre el paso siguiente: carril, perfil y de qué nivel sale, avisos de las claves de `sdd-kit.local.json` que ignora, y en `pair` y `delegate` tres frases que el dev-lead puede decir: «apruebo la spec por delegación, nos vemos en la validación»; con la sesión en el modelo más capaz y más de una task prevista, la misma «…y paras antes de la Task 1 para que baje la sesión a gama media»; y «perfil `<otro>` para esta feature». No hay pregunta de confirmación.
   - **patch, lite y config preguntan** con `AskUserQuestion`, con el 🦆 de lo que va a hacer delante, y la opción recomendada primero: el predicado habilita, el usuario activa. La pregunta de lite lleva además, como opciones, las de aprobar la spec por delegación y su variante, y dice el perfil con la opción de cambiarlo, como la primera pregunta de hoy.
   - **Partir una feature grande sigue siendo pregunta** (más de 5 tasks, o 4 o 5 en superficies distintas): es alcance, y el alcance es del dev-lead. Si toca, la pregunta de partir sustituye al anuncio: el mismo mensaje lleva el carril y el perfil, y la llamada lleva las opciones de aprobar la spec por delegación y su variante.
   - Son las paradas del arranque de `pair` y `delegate`, que el requisito «El perfil de control decide dónde para el agente» no nombraba aunque la primera pregunta ya existía: pasa a nombrarlas (hallazgo 1 de dominio).
   - En `unattended` no pregunta: patch y config siguen como hoy, lite pasa a full (la regla vigente de `modo-lite.md`: sin confirmación, full) y spike va como full.
5. **El carril de la petición se respeta si concuerda.** «patch: …», «lite: …» o «config: …» que concuerdan con la investigación no preguntan; si la investigación ve un carril más pesado, pregunta con el pesado recomendado. Una petición que pide un carril más pesado del que ve el agente se queda en el pedido: el agente puede ofrecer el ligero en la misma pregunta, nunca bajarlo solo. **El carril solo sube**: config → patch o feature, patch → feature, lite → full; nunca baja a mitad.
6. **El carril config** (decisión tuya del 2026-10-09: un cambio sin comportamiento —dependencias, CI, variables de entorno, settings, typo, renombrado, formato—). Concreción mía:
   - **Predicado por lo que toca**: config no cambia lo que el usuario del producto ve ni lo que puede hacer. Un typo en el README, en un comentario o en un nombre interno es config; un typo en una etiqueta de pantalla es un texto visible dado literal, y sigue siendo patch, como hoy.
   - Sin spec, plan, carpeta, id, fila, entrada de changelog, línea de estimación ni ticket de `sdd-feedback`: no hay comportamiento que contar.
   - Tras la pregunta, hace el cambio, corre el «Build» de `operations.md` si lo declara y el «Gate de cierre» de `operations.md` §Testing (sin él, el de `tech-stack.md` §Testing; sin ninguno, el de la constitution) y commitea con el comando y su resultado en el cuerpo del commit. Si el gate falla, no commitea y lo dice.
   - Commitea en la rama en la que está, también en la de integración, como hoy la edición directa: un config no lleva la historia de una feature (Art. IV). En la rama estable que fija el git-flow de la constitution (`main` en este repo), no commitea: en `pair` y `delegate` para y pregunta; en `unattended`, lo deja sin commitear y lo cuenta en el informe final.
7. **Spike en la 0160: se clasifica y se anuncia; su forma llega con la 0163.** «¿Aguanta el repintado diez publicaciones seguidas?» con tabla de medidas es spike; «¿se puede?» en el chat sigue en `sdd-consult` (explore llega con la 0161). Hasta la 0163, el spike sigue como feature full, que es lo que hizo la 0162 a mano.
8. **Estimación previa del patch** (la parte de la 0130 que es de propose). Si existe `.docs/sdd/estimation.md`, la pregunta del carril patch lleva la estimación en horas, y `patch.md` §5 la escribe antes del fix, con la hora de inicio en UTC en su propia línea con viñeta: `- Estimación: 0,5h` y `- Inicio: 2026-10-09T11:20Z`, con `- Real:` debajo. Va aparte y con viñeta porque `sdd estimation log` solo lee una línea `- Estimación:` y el número que la sigue (`cli/src/estimation/fields.ts`); un test Vitest con un `patch.md` en la forma nueva lo fija, y `Inicio:` no cuenta como estimación ni como real. `sdd-end-patch` no escribe la estimación, así que no la pisa. Marcar `post hoc` la que llega al cerrar, sacarla de la calibración y el «Real» desde los timestamps son del cierre: quedan en la 0149.
9. **Gates del plan desde `operations.md`** (fila de deuda «El plan inventa los comandos de sus gates»). La línea del gate de cierre de `plan-template.md` §3 copia literal el «Gate de cierre» de `operations.md` §Testing; sin él, el de `tech-stack.md` §Testing; sin ninguno, el de la constitution; y si no hay ninguno, escribe `no declarado` y lo apunta en el ✋ del plan, en vez de inventar un comando. El paso del plan de `sdd-propose` lo dice en una frase (lección de la 0146: una regla que solo vive en la plantilla o en una referencia no se aplica).
10. **El 🦆 de la entrada y el escenario s2 de `sdd-rubber-duck`** (fila de deuda «El escenario s2 mezcla la parada y el pato»). La pregunta de patch, lite y config abre con el 🦆 de `sdd-rubber-duck` en modo corto. En config, que no cambia nada para quien usa el producto, el 🦆 dice qué se toca y qué pruebas pasan antes de guardarlo: «la versión mínima de Node que pide el proyecto pasa a la 22.18; antes de guardarlo pasan todas sus pruebas». El escenario s2 se rehace: la parada la hace `sdd-propose`, y la rúbrica mide solo el párrafo del pato.
11. **La evidencia vive en la batería; la skill cita solo la ruta** (ticket de la feature 0146, §3). Cada regla de `sdd-propose` cita, entre paréntesis, la ruta de su evidencia (`tests/…-red.md`), sin recuentos ni sujetos; los recuentos van a la tabla «Procedencia de las reglas» de su batería. `sdd-start-feature` no se reescribe en sus pasos 6 a 8: los reescribe la 0147.
12. **Topes de palabras, decisión tuya** (Art. I). `sdd-propose` estrena tope: su `SKILL.md` y su total, medidos al terminar y redondeados a la centena de arriba. `sdd-start-feature` baja los suyos (hoy 8.430 y 20.600) a lo que mida tras el reparto, también a la centena de arriba. `sdd-start-patch` y `using-sdd` no suben: su texto adelgaza.
13. **Baterías.** Nace `tests/batteries/sdd-propose/`, completa (Art. I: skill de entrada y de propose), con el molde `reservas` de la 0146 copiado y con `operations.md`. Se lleva de la de `sdd-start-feature` los escenarios s1, g1, r1 y p1 (spec y plan), con la petición «Invoca la skill sdd-kit:sdd-propose…»; en la de `sdd-start-feature` se quedan u1, u2, v1a y v1b. La de `using-sdd` cambia el «Esperado» de sus filas de feature, patch y edición directa a `sdd-kit:sdd-propose`, y se lanza entera, porque cambian la `description` de tres skills de entrada (lección de la 0117).
14. **Tabla de reglas que se mueven** (Art. I: retirar o fusionar es editar). Va abajo, en «Reglas que se mueven». Una regla movida y traducida lleva su escenario de control, o el motivo de no medirla.
15. **Lo que entra y lo que sale** (Art. I): entra `sdd-propose`; salen de `using-sdd` tres filas (feature, patch, edición directa), que pasan a una, y la `description` de `sdd-start-feature` y la de `sdd-start-patch` dejan de enumerar frases de disparo; salen de las reglas movidas sus recuentos de evidencia.
16. **Glosario de `mission.md`**: «Carril feature / carril patch» pasa a «Carriles» (config, patch, lite, feature, spike, con una línea cada uno); «Modo lite» deja de decir «no un carril nuevo» (es un carril de la entrada, sin skills propias ni prefijo de carpeta); «Spike» deja de decir que va a `sdd-consult`; «Carril consult» llama al modo sondear «prueba desechable», sin la palabra spike; nace «Ceremonia asimétrica». El texto sustituye, no se añade: el tope de `mission.md` (1.700) no sube. El `## Propósito` de `routing` deja de decir «las salidas finas las decide el paso 2 de `sdd-start-feature`»: las decide `sdd-propose`.
17. **No muevo `.docs/workflow/`**: la guía de uso y greenfield/brownfield nombran `sdd-start-feature` como entrada, pero su marcador de versión solo obliga a releerlas al subir de versión, y la coherencia de todos los documentos es de la 0152.
18. **Previsión de coste** (Art. I), con Sonnet salvo g1 (Opus):

    | Paso nuevo o cambiado | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | Full anuncia y sigue, sin pregunta de confirmación; avisa de la clave local que ignora | `a1` («que el responsable de sala pueda anular reservas de otros», ~3 tasks, con un `sdd-kit.local.json` que trae una clave de política) | 2 | 2 |
    | Patch pregunta, con 🦆 y estimación | `a2` («si cancelo una reserva que no existe me dice cancelada igual») | 2 | 2 |
    | Carril de la petición que concuerda: sin pregunta | `a3` («patch: …» del mismo fallo) | 2 | 2 |
    | Carril de la petición por debajo: pregunta con el pesado | `a4` («patch: avisa cuando una sala pase de 10 reservas en un día») | 2 | 2 |
    | Config: pregunta, gate de `operations.md` y commit | `k1` («sube `node` a 22.18 en `package.json` engines») | 2 | 2 |
    | Config en la rama estable: no commitea y pregunta | `k3` (el mismo, en `main`) | 2 | 2 |
    | Config con el gate en rojo: no commitea | `k4` (el molde con un test en rojo) | — | 2 |
    | Spike: se clasifica y se anuncia | `k2` («¿aguanta `libres` 1.000 reservas? quiero la tabla de medidas») | 2 | 2 |
    | Plan: gate de cierre desde `operations.md` | `p2` | 2 | 2 |
    | `sdd-rubber-duck`: s2 con la parada en `sdd-propose` | `s2` rehecho | 2 | 2 |
    | Controles de lo movido: spec, gate, review, plan, oferta de lite, partir, Gate 1 sin enunciado | `s1`, `g1`, `r1`, `p1`, `l1`, `x1`, `c1` | — | 14 |
    | Traspaso de `sdd-propose` a `sdd-start-feature` tras el plan | `p1` (rúbrica: invoca `sdd-start-feature` con el plan escrito) | — | (en `p1`) |
    | `using-sdd`: batería entera | 20 escenarios | — | 26 |
    | `patch.md` §5 en la forma nueva lo lee `sdd estimation log` | Vitest en `cli/test/estimation/` | — | — |

    Sin escenario, con su motivo: `unattended` (lite a full, spike como full) aplica la regla vigente de `modo-lite.md`, que no cambia; «el carril solo sube» es la forma que ya tienen las subidas de lite y de patch, con su evidencia; «feature: corrige el typo» (el agente no baja solo) es la regla «nunca al revés» de `modo-lite.md`; el gate del plan sin `operations.md` (el de la constitution) lo mide `p1`, cuyo molde no lo tiene, y `no declarado` necesitaría un molde sin gate ni en la constitution.

    18 sujetos de RED y 60 de GREEN: ~53 $ (Sonnet ~0,8 $ con una spec que escribir y ~0,3 $ en la batería de `using-sdd`; Opus ~2,5 $) y ~5,5 h de campaña. Techo: 64 $, con ~20 % de reserva para lo que destape la revisión final. Si un RED no exhibe el fallo, la regla y su THEN salen y te vuelvo a pedir la aprobación; si la prueba pasa del techo, paro y decides tú.
19. **Repaso de coherencia**: la línea `Estimación: 0,5h · inicio …` habría cambiado lo que lee `sdd estimation log`; la hora va en su propia línea (decisión 8 y su THEN). Los MODIFIED de `control-profiles` tocan dos referencias que nombran «la primera pregunta», y 39 tests Pester nombran `sdd-start-feature` o `sdd-start-patch`: entran en el Scope.
20. **El traspaso**: `sdd-propose` termina en el plan escrito (full), en la spec aprobada (lite) o en la confirmación del patch, e invoca la skill siguiente: `sdd-start-feature` desde su paso 6, o `sdd-start-patch` desde su paso 1. `sdd-start-feature` retoma leyendo `mode` y `profile` del frontmatter de `spec.md`, la línea `Ejecución` del plan y la rama; `sdd-start-patch`, la clase del patch y la estimación que le pasa la pregunta. Sin `spec.md` aprobada, `sdd-start-feature` manda a `sdd-propose`.
21. **El gate de merge no cambia de fuente aquí**: `merge-recipe.md` sigue leyendo el «Gate de merge» de `tech-stack.md` §Testing, y pasarlo a `operations.md` es del cierre (0149), que reescribe el merge. Mientras, el plan lee `operations.md` y el merge `tech-stack.md`: en este repo `tech-stack.md` aún tiene §Testing, y ningún proyecto tiene `operations.md` hasta la migración de la 0157.
22. **El typo, el renombrado y el formato pasan el gate igual** (hallazgo 4 de dominio, rechazado): es tu decisión del 2026-10-09, y un renombrado sí rompe la build si queda una referencia. El coste es el del gate de cierre en un cambio de una palabra (en este repo, ~4 min). Si prefieres que un config que solo toca documentación no pase el gate, dilo en el gate y entra como regla con su escenario.

### Hallazgos de la review

Dominio (Opus):

1. **Aceptado** — Las preguntas del arranque crean paradas que «El perfil de control decide dónde para el agente» no nombra, y config en la rama estable choca con `unattended` → MODIFIED de ese requisito con el arranque; en `unattended`, config en la rama estable no commitea y lo cuenta (decisiones 4 y 6).
2. **Aceptado** — Se perdían la opción de cambiar el perfil y la variante de parar antes de la Task 1 → las dos van en el anuncio de full y spike y como opciones en la pregunta de lite (decisión 4 y su MODIFIED).
3. **Aceptado** — config y patch se solapaban en el typo → el predicado de config es «no cambia lo que el usuario del producto ve ni puede hacer»; el typo de una etiqueta de pantalla es patch, con su contraejemplo en el THEN.
4. **Rechazado** — El fallo citado no cubre typo, renombrado y formato → es la decisión del dev-lead, y un renombrado sí rompe la build; el coste queda en la decisión 22 para que lo valides.
5. **Aceptado** — Faltaban «Reglas de la capacidad» → en `routing` (nombres de los carriles, regla ante conflicto), `control-profiles` (Avisos), `feature-flow` (Regla ante conflicto) y `estimation` (Dónde viven los datos).
6. **Rechazado** — Dos fuentes para el gate (plan y merge) → el merge es del cierre (0149); la decisión 21 lo deja escrito.
7. **Aceptado** — `main` literal y config en la rama de integración → la rama estable sale del git-flow de la constitution, y en la de integración commitea como hoy la edición directa (decisión 6).
8. **Aceptado** — El 🦆 de config no tiene qué contar al usuario del producto → dice qué se toca y qué pruebas pasan (decisión 10 y el ADDED de `explaining`).
9. **Aceptado en parte** — `sdd-end-patch` pisaría la estimación → no la escribe (comprobado: la skill no la nombra), rechazado; `modo-lite.md` y lo que config no hace (changelog, estimación, `sdd-feedback`) entran en el Scope y en la decisión 6.
10. **Aceptado** — Quedaban vivos «sondear (spike…)», «Modo lite… no un carril nuevo» y el Propósito de `routing` → entran en la decisión 16 y en el Scope.

Técnica (Sonnet):

1. **Aceptado** — `sdd estimation log` solo lee líneas con viñeta → `- Estimación:` y `- Inicio:` (decisión 8 y su THEN).
2. **Aceptado** — El THEN de la CLI no tenía prueba → test Vitest en `cli/test/estimation/` en el Scope.
3. **Aceptado** — La lista de tests Pester era aproximada y faltaba `argument-hint` → los 39 ficheros en el Scope, y `Skills.Tests.ps1` lo pide a `sdd-propose`.
4. **Aceptado** — Pasos nuevos sin escenario ni motivo → `k3`, `k4` y la clave local en `a1`; los demás, con su motivo, en la decisión 18.
5. **Aceptado** — No quedaba claro qué se queda en `sdd-start-feature` → fila final en «Reglas que se mueven», y el aviso de fase se copia con su motivo.
6. **Aceptado** — Faltaba el traspaso entre `sdd-propose` y lo que se queda → decisión 20 y un ADDED en `feature-flow`, medido en `p1`.
7. **Aceptado** — El anuncio de full y la pregunta de partir chocaban → la pregunta de partir sustituye al anuncio; `a1` prevé ~3 tasks.
8. **Aceptado** — El Build no estaba en el THEN de config → el THEN lo corre si `operations.md` lo declara.
9. **Aceptado** — El anuncio de spike y `unattended` sin decir → spike anuncia como full y en `unattended` va como full.
10. **Aceptado** — Frase rota en «El patch registra quién fijó…» → reescrita.

### Decisiones tomadas con el dev-lead

- Spec aprobada, con los topes de palabras medidos al terminar (decisión 12) y el techo de 64 $ (decisión 18) — opción «Apruebo (Recomendada)» (2026-10-09).
- Review de spec con dos revisores, dominio en Opus y técnica en Sonnet — opción «Dos: dominio Opus, técnica Sonnet (Recomendada)» (2026-10-09).
- Feature full con perfil `delegate`, parando en la spec — opciones «Full + delegate (Recomendada)» y «Paro en la spec (Recomendada)» de la primera pregunta (2026-10-09).
- Partir la 0160 en dos: esta (entrada única, carriles, patch con estimación previa y gates desde `operations.md`) y la 0163 (carril spike: spec corta, tasks con «Evidencia» y research con la tabla de objetivos), tras esta — opción «Partir en dos (Recomendada)» (2026-10-09).
- El carril config es un cambio sin comportamiento —dependencias, CI, variables de entorno, settings, typo, renombrado, formato—; `sdd-propose` lo clasifica y pregunta, sin spec ni plan, corre los gates de `operations.md` y commitea; sustituye a la «edición sin comportamiento, directa y sin skill» de `using-sdd`; sale de la ruta B «No spec needed» de cc-sdd; fallo que evita: un bump de dependencia o un cambio de CI que rompe la build sin que nadie pase los tests — «El carril «config» no se definió en el lienzo; sale de la ruta B…» (2026-10-09). Registrado como enmienda en la propuesta 0131.
- Decisiones del lienzo 0131 que esta feature aplica tal cual: una sola entrada (propose) para config, patch, lite, feature y spike; full y spike anuncian y siguen, patch, lite y config preguntan; el carril solo sube; se respeta el carril de la petición si al investigar concuerda; `delegate` es un perfil, no un carril; spike con spec corta, tasks con «Evidencia» y `research.md` con evidencia (forma en la 0163); salda la parte de la 0130 (estimación previa del patch) y las filas de deuda del research de spike (a la 0163) y de los gates del plan; al repartir `sdd-start-feature`, se vuelve a medir el tope y la evidencia vive en la batería — petición de arranque de la feature (2026-10-09).

## Intent

Hoy un cambio entra por tres puertas (`sdd-start-feature`, `sdd-start-patch` y la edición directa) y es el router quien adivina cuál, antes de mirar nada. Cada feature empieza con una pregunta de confirmación aunque no haya nada que confirmar, un cambio de dependencias o de CI se hace «directo» sin que nadie pase los tests, la estimación de un patch se escribe al cerrar, con el tiempo real delante, y el plan se inventa el comando de su gate. Esta feature deja una sola entrada, `sdd-propose`, que investiga lo justo, clasifica en cinco carriles y solo pregunta cuando el carril abarata la ceremonia.

## Scope

- Entra: `skills/sdd-propose/SKILL.md`, nueva, en inglés: Gate 1, contexto, clasificación en cinco carriles, ceremonia asimétrica, carril de la petición, carril config, rama, spec y plan (los pasos 1-5 de `sdd-start-feature`, traducidos) y el árbol del patch de `sdd-start-patch`.
- Entra: `sdd-start-feature/SKILL.md` (sale el Gate 1 y los pasos 1-5; queda un puntero a `sdd-propose`; `description` de no-puerta), `sdd-start-patch/SKILL.md` (sale el árbol; `description` de no-puerta; estimación en el paso 3), `using-sdd/SKILL.md` (las filas de feature, patch y edición directa pasan a una, `sdd-propose`), `sdd-consult/SKILL.md` (el handoff nombra `sdd-propose`).
- Entra: `sdd-rubber-duck`: solo su batería (s2 rehecho); la skill no cambia.
- Entra: plantillas: `plan-template.md` (§3: el gate de cierre sale de `operations.md`), `patch-template.md` (§5: estimación con hora de inicio, antes del fix).
- Entra: baterías: nueva `tests/batteries/sdd-propose/`; la de `sdd-start-feature` sin s1, g1, r1 y p1; la de `using-sdd` con el «Esperado» nuevo; la de `sdd-rubber-duck` con s2 rehecho.
- Entra: los tests Pester que nombran `sdd-start-feature` o `sdd-start-patch` (39: `AgentDefinitions`, `AnchorTemplates`, `Battery`, `CapabilityRules`, `ClosingOffCriticalPath`, `ClosingVerification`, `CommitMilestones`, `ControlProfiles`, `DispatchBrief`, `FeatureRename`, `FewerStops`, `FieldValidation`, `FileOverlap`, `FinalReviewPackage`, `FrontendVerification`, `LocalConfig`, `MigrationInitParity`, `NativeAdapt`, `NativeDefault`, `PatchLane`, `PlanEntry`, `PlanReviewFocus`, `PostFinalReview`, `ProportionalReview`, `ReleaseFlow`, `ScopeBrake`, `SddConfig`, `SessionModel`, `SilenceWatch`, `Skills`, `SuperpowersCompat`, `SyncMerge`, `TaskIds`, `TaskVerification`, `TestableTasks`, `UsingSdd`, `VisualCheck`, `VisualPatch`, `WordBudget`): los que fijan una frase de lo movido pasan a leer `sdd-propose` con la frase traducida; los demás no cambian. `Skills.Tests.ps1` pide `argument-hint` también a `sdd-propose`, y `WordBudget.Tests.ps1` le da tope. Y las referencias que nombran «la primera pregunta» (`control-profiles.md`, `review-spec.md`) y `modo-lite.md` (la confirmación es la respuesta a la pregunta de lite).
- Entra: un test Vitest en `cli/test/estimation/` con un `patch.md` cuyo §5 lleva `- Estimación:`, `- Inicio:` y `- Real:`; el código de la CLI no cambia si el test pasa.
- Entra: `README.md` (catálogo: 17 skills), `CLAUDE.md` del repo (16 → 17 skills), `architecture.md` (estructura), `mission.md` (glosario: decisión 16), el `## Propósito` de `routing` y las capacidades del delta.
- Entra: la fila 0163 del roadmap y dos enmiendas de la propuesta 0131 (el reparto y el carril config).
- No entra: la forma del spike —spec corta, tasks con «Evidencia», research con la tabla de objetivos, tabla de aguante— (0163); explore y el prompt de arranque (0161); los pasos 6-8 de `sdd-start-feature` y el flujo del patch desde el paso 1 (0147, 0149); el `post hoc` de la estimación, su exclusión de la calibración y el «Real» del patch (0149); `.docs/workflow/` (0152); la fuente del gate de merge (0149, decisión 21); `sdd-config`, que sigue siendo la skill de las preferencias del kit.

## Approach

`sdd-propose` es la puerta y el router solo la nombra. Clasifica con los predicados que ya existen (patch, lite, la regla de partir) más dos nuevos (config y spike), y la ceremonia sigue al carril: pregunta solo donde el carril ligero lo tiene que activar el usuario. Lo que hoy hace `sdd-start-feature` hasta el plan se traduce y se mueve sin cambiar las reglas, con su escenario de control en la batería nueva; lo nuevo entra solo después de su RED.

## Dónde se prueba

- Clasificación y ceremonia (anuncio, pregunta, carril de la petición, config, spike): el `tools.txt` y el `texts.txt` del sujeto en la batería de `sdd-propose` (`a1`-`a4`, `k1`, `k2`); en `k1`, además, el `git log` y la salida del gate en el cuerpo del commit.
- Estimación previa del patch: el `patch.md` que deja el sujeto de `a2`/`a3` y su pregunta.
- Gate de cierre del plan: el `plan.md` del sujeto de `p2`, contra el `operations.md` del molde.
- Reglas movidas: los escenarios de control de la batería de `sdd-propose`, con la rúbrica de la 0146.
- Puerta: la batería de `using-sdd`, entera.
- 🦆 de la pregunta: el escenario s2 de `sdd-rubber-duck`.
- Topes y anatomía: la suite Pester (`WordBudget.Tests.ps1`, `Skills.Tests.ps1`).

## Términos y ADR

- Términos resueltos: **carril config** — cambio sin comportamiento (dependencias, CI, variables de entorno, settings, typo, renombrado, formato), sin spec ni plan, con los gates de `operations.md` antes del commit; no es `sdd-config`. **Ceremonia asimétrica** — full y spike anuncian y siguen; patch, lite y config preguntan.
- ADR candidatas: **una sola entrada que clasifica en cinco carriles** — alternativa descartada: una skill de arranque por carril, con el router eligiendo antes de investigar. Es difícil de deshacer (todos los proyectos y baterías nombran la puerta), sorprende sin contexto (por qué `sdd-start-feature` ya no es entrada) y hubo alternativa real. La escribe el cierre (0149).

## Reglas que se mueven

Una fila por paso, red flag y racionalización de las skills que pierden texto. «Control» es el escenario de la batería de `sdd-propose` que vuelve a medir la regla traducida.

| Regla (origen) | Dónde vive ahora | Control o por qué se descarta |
| --- | --- | --- |
| Gate 1: sin enunciado, leer el contexto y parar; con rama `feature/<id>` y fila pendiente, la fila es el enunciado (`sdd-start-feature`) | `sdd-propose`, Gate 1 | `c1` |
| Gate 1: con enunciado, seguir sin preguntar qué hacer (`sdd-start-feature`) | `sdd-propose`, Gate 1 | `a1` |
| Gate 1: no explorar el código antes del enunciado, y sus dos racionalizaciones (`sdd-start-feature`) | `sdd-propose`, Gate 1, cambiada: con enunciado se investiga lo justo para clasificar | `a1`, `a2` |
| Aviso de fase (`sdd-start-feature`) | se copia a `sdd-propose`, traducido, y se queda en `sdd-start-feature` para los pasos 6-8: cada skill cubre sus pasos, y la 0147 lo quita al reescribir implement | `s1` (el aviso al pasar a la spec) |
| Paso 1: contexto y `sdd capability index` antes de abrir capacidades (`sdd-start-feature`) | `sdd-propose`, paso 1 | `s1` |
| Paso 2: salida a `sdd-roadmap` para planificar sin hacer (`sdd-start-feature`) | `sdd-propose`, clasificación | batería de `using-sdd` (`r1`-`r5`) |
| Paso 2: «¿se puede…?» sin artefactos va a `sdd-consult` (`sdd-start-feature`) | `sdd-propose`, clasificación, junto al spike | `k2` |
| Paso 2: patch por solución fijada; «maquetación con criterio» y «añade un evento» con solución en el ticket siguen siendo patch (`sdd-start-feature`) | `sdd-propose`, clasificación | `a2`, batería de `using-sdd` (`v1`, `pc1`, `c2`) |
| Paso 2: «si el texto, el sitio o la regla los fijas tú, es feature» (`sdd-start-feature`) | `sdd-propose`, clasificación | `a4`, batería de `using-sdd` (`bt1`, `c1w`) |
| Paso 2: lite por predicado, ofrecido citando las condiciones (`sdd-start-feature`) | `sdd-propose`, carril lite | `l1` |
| Paso 2: la primera pregunta, sola, confirma carril, modo y perfil, lee `sdd-kit.local.json` y avisa de las claves que ignora (`sdd-start-feature`) | `sdd-propose`, ceremonia asimétrica, cambiada: full anuncia; patch, lite y config preguntan; el perfil y los avisos van en el anuncio o en la pregunta | `a1`, `a2` |
| Paso 2: la fila pendiente de la rama `feature/<id>` como enunciado (`sdd-start-feature`) | `sdd-propose`, Gate 1 | `c1` |
| Paso 2: contar tasks y proponer partir (umbrales 3, 4-5, >5) (`sdd-start-feature`) | `sdd-propose`, clasificación | `x1` |
| Paso 2: opción «apruebo la spec por delegación» y su variante de bajar de modelo (`sdd-start-feature`) | `sdd-propose`: frase en el anuncio de full; opciones en la pregunta de partir | `a1`, `x1` |
| Paso 3: rama, y en `sequence` sin fila, la rama antes de la carpeta (`sdd-start-feature`) | `sdd-propose`, paso 3 | no medido: sin cambio de regla, y la batería de `sdd-start-patch` no existe; lo vigila la CLI (`sdd id next --reserve`) |
| Paso 4: `brainstorming` y `sdd-grilling` con `Skill`; carpeta; `spec-template.md`; capacidad nueva en kebab-case (`sdd-start-feature`) | `sdd-propose`, paso 4 | `s1` |
| Paso 4: propuesta de `§Frontend` si la feature cambia lo que se ve (`sdd-start-feature`) | `sdd-propose`, paso 4 | no medido: el molde `reservas` es una CLI; regla sin cambio, con su evidencia en `tests/frontend-verification-red.md` |
| Paso 4: `Se valida en:` para un THEN que depende de la base (`sdd-start-feature`) | `sdd-propose`, paso 4 | no medido: regla sin cambio; evidencia en `tests/closing-verification-green.md` |
| Paso 4: nivel de review con `review-spec.md` (`sdd-start-feature`) | `sdd-propose`, paso 4 | `r1` |
| Paso 4: repaso de coherencia (`sdd-start-feature`) | `sdd-propose`, paso 4 | `s1` |
| Paso 4: gate con 🦆, ✋ y `AskUserQuestion`; opción de bajar de modelo en `delegate` (`sdd-start-feature`) | `sdd-propose`, paso 4 | `g1` |
| Paso 4: spec aprobada por delegación sin parar (`sdd-start-feature`) | `sdd-propose`, paso 4 | `x1` (con la opción elegida en el turno 2) |
| Paso 5: plan con `writing-plans`, línea `Ejecución`, frase de Native, gate en `pair`, opciones de método (`sdd-start-feature`) | `sdd-propose`, paso 5 | `p1` |
| Paso 5: commit de apertura antes de los RED (`sdd-start-feature`) | `sdd-propose`, paso 5 | `p1` |
| Red flag: spec sin `brainstorming` (`sdd-start-feature`) | `sdd-propose` | `s1` |
| Red flag: tratar la tarea como pequeña sin el predicado (`sdd-start-feature`) | `sdd-propose` | `l1` |
| Red flags: plan sin spec aprobada; código sin plan aprobado; «documentar la decisión» en vez de esperar; implementar por haber elegido un alcance (`sdd-start-feature`) | `sdd-propose` | `g1` |
| Red flag: carpeta `feature-` con `patch.md`, o el id es un módulo (`sdd-start-feature`) | `sdd-propose` | `a2` |
| Red flag: en `sequence`, carpeta antes que rama (`sdd-start-feature`) | `sdd-propose` | no medido: como el paso 3 |
| Red flag: preguntar «¿qué tarea?» con la rama y la fila ya puestas (`sdd-start-feature`) | `sdd-propose` | `c1` |
| Red flag: ampliar el alcance de una feature de un tema grande en vez de partir (`sdd-start-feature`) | `sdd-propose` | `x1` |
| Racionalizaciones: «mejor pregunto qué tarea es», «es pequeña y de baja ambigüedad», «es un solo tema», «el paso 4 describe una actividad», «la rúbrica dice ninguna review», «el usuario no va a responder», «en `delegate` ya no repite el gate», «es sencillo / el cliente lo espera», «pruébalo rápido es acción» (`sdd-start-feature`) | `sdd-propose`, tabla de racionalizaciones, traducidas | `c1`, `l1`, `x1`, `s1`, `r1`, `g1`, `k2` |
| Racionalización: «sin ticket el id es 0000; le añado un slug» (`sdd-start-feature`) | `sdd-propose` | no medido: como el paso 3 |
| Árbol «¿Es de verdad un patch?»: walkthrough abierto → apéndice; fallo determinista; ajuste de presentación o retirada (predicado); petición cerrada; solución fijada; «quien reporta cree saber la causa» (`sdd-start-patch`) | `sdd-propose`, carril patch | `a2`, `a4`, batería de `using-sdd` (`p1`, `v1`, `c1w`, `pc1`, `bt1`, `c2`) |
| Filas de `using-sdd`: feature, patch y edición directa (`using-sdd`) | una fila: `sdd-propose` | batería de `using-sdd`, entera |
| Pasos 6, 7 y 8 de `sdd-start-feature`, sus red flags y sus racionalizaciones; pasos 1 a 6 de `sdd-start-patch`, sus red flags y su tabla | se quedan donde están, sin cambio | sus escenarios de siempre (u1, u2, v1a, v1b en la batería de `sdd-start-feature`) |

## Delta de comportamiento

### Capacidad: `routing`

**MODIFIED — Una petición de trabajo entra por el kit, no por brainstorming** (antes: entraba por `sdd-start-feature`)

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`
- AND `superpowers:brainstorming` se invoca después, desde el paso de la spec de `sdd-propose`, nunca antes

**MODIFIED — Un bug pequeño y determinista entra por el carril patch** (antes: entraba por `sdd-start-patch`)

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como patch y, con la confirmación, sigue con `sdd-start-patch`
- AND `patch.md` lleva `solution: causa raíz`, la causa con su evidencia en §2, la entrada del changelog en `Fixed` y el commit del fix con el tipo `fix`

**REMOVED — Una edición trivial no lleva ceremonia**
- motivo: la edición sin comportamiento pasa a ser el carril config (decisión del dev-lead, 2026-10-09), con su pregunta y sus gates: ver «Un cambio sin comportamiento entra por el carril config».

**ADDED — Un cambio sin comportamiento entra por el carril config**

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`»
- WHEN el usuario escribe «sube `node` a 22.18 en los `engines` de `package.json`», o «corrige el typo "recervas" del README»
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`, que lo clasifica como config y pregunta con `AskUserQuestion` antes de tocar nada
- AND con la confirmación hace el cambio, corre el «Build» si `operations.md` lo declara y `node --test`, y commitea en la rama en la que está con el comando y su resultado en el cuerpo del commit, sin spec, plan, carpeta, id, fila, changelog ni estimación
- AND si el gate falla, no commitea y lo dice
- AND en la rama estable del git-flow de la constitution (`main`) no commitea: en `pair` y `delegate` para y pregunta; en `unattended` lo deja sin commitear y lo cuenta en el informe final
- AND «corrige "Cancelacion" en el mensaje de `cancelar`» no es config: un texto que ve el usuario del producto, dado literal, es patch

**ADDED — Full y spike anuncian y siguen; patch, lite y config preguntan**

- GIVEN el molde `reservas` en `delegate`
- WHEN el usuario pide «que el responsable de sala pueda anular reservas de otros», que es feature full
- THEN `sdd-propose` anuncia el carril, el perfil y de qué nivel sale, y la frase para aprobar la spec por delegación, y sigue con la entrevista en el mismo mensaje, sin pregunta de confirmación
- AND con «si cancelo una reserva que no existe me dice "cancelada" igual», que es patch, pregunta con `AskUserQuestion` antes de abrir rama, carpeta o id, con el 🦆 de lo que hará y, si existe `estimation.md`, la estimación en horas
- AND con un cambio que cumple el predicado de lite, la pregunta ofrece lite citando sus condiciones una por una
- AND si la feature prevé más de 5 tasks, la pregunta de partir sustituye al anuncio y lleva la opción de aprobar la spec por delegación
- AND en `unattended` no pregunta: patch y config siguen, lite va en full y spike va como full

**ADDED — El carril que trae la petición se respeta si concuerda**

- GIVEN el molde `reservas`
- WHEN el usuario escribe «patch: si cancelo una reserva que no existe me dice "cancelada" igual» y la investigación confirma un fallo determinista
- THEN `sdd-propose` no pregunta el carril y sigue con el patch
- AND con «patch: avisa cuando una sala pase de 10 reservas en un día», que deja sin fijar el texto y el sitio del aviso, pregunta, con feature como opción recomendada y lo que tendría que decidir él
- AND con «feature: corrige el typo del README», sigue como feature, y puede ofrecer config en una pregunta, nunca bajarlo solo

**ADDED — El carril solo sube**

- GIVEN un cambio que va por config, patch o lite
- WHEN al hacerlo aparece algo que su predicado excluye (un cambio de comportamiento en config, una decisión sobre lo que el usuario ve en un patch, una condición de lite que cae)
- THEN para, lo dice y sube: config a patch o feature, patch a feature, lite a full
- AND nunca baja de carril a mitad de un cambio

**ADDED — Una investigación con evidencia entra por el carril spike**

- GIVEN el molde `reservas`
- WHEN el usuario escribe «¿aguanta `libres` con 1.000 reservas? quiero la tabla de medidas»
- THEN `sdd-propose` lo clasifica como spike y lo anuncia como un full, sin pregunta de confirmación, y sigue como feature full hasta que la 0163 le dé su forma
- AND «¿se puede filtrar `libres` por planta?», sin pedir evidencia, entra por `sdd-consult`

**MODIFIED — El router solo existe donde hay SDD** (antes: nombraba `sdd-start-feature` y `sdd-start-patch`)

- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-propose`, `sdd-consult`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-init-greenfield` y `sdd-init-brownfield`

**MODIFIED — Una petición vaga se pregunta antes de elegir puerta** (antes: nombraba `sdd-start-feature` y `sdd-start-patch`)

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Hay que mejorar las reservas, que se quejan los usuarios.»
- THEN el agente no invoca `sdd-propose` ni `sdd-roadmap` antes de preguntar
- AND hace una sola pregunta sobre qué es y cuánto abarca, con su recomendación primero
- AND no crea rama ni carpeta

**MODIFIED — Una petición de planificar entra por `sdd-roadmap`** (antes: el contraejemplo era `sdd-start-feature`)

- GIVEN un proyecto con `.docs/sdd/` y el hook de sesión activo
- WHEN el usuario trae algo para el roadmap sin nombrar ninguna skill: «organízalo para el equipo», «apunta en el roadmap», items del gestor, notas de una reunión, «reordena», «prepara la release 1.3»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`
- AND con «prepara la release 1.3», no `sdd-end-release`; con «organízalo para el equipo», no `sdd-propose`

**MODIFIED — Los items asignados del gestor entran por `sdd-roadmap`** (antes: el contraejemplo era `sdd-start-feature`)

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Me han asignado en Azure el 412 (exportar reservas a .ics) y el 415 (máximo 2 reservas por persona).»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`, no `sdd-kit:sdd-propose`

**MODIFIED — Un ajuste solo de presentación entra por el carril patch** (antes: lo abría `sdd-start-patch`)

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo, con las páginas `pedido-detalle.html` y `albaran-detalle.html` y sus estilos
- WHEN el usuario escribe «Pon Guardar y Cancelar de la cabecera en una columna a la derecha, en las dos fichas; es solo maquetación», por el hook o con `/sdd-propose`
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch citando el predicado: solo plantillas o estilos; en las plantillas, sin añadir bindings, directivas de control, eventos, textos ni claves de i18n; sin TypeScript ni otro código, API, datos ni capacidades, salvo lo que retira una retirada
- AND no se crea `spec.md`

**MODIFIED — Un cambio con la solución fijada entra por el carril patch** (antes: lo abría `sdd-start-patch`)

- GIVEN el proyecto `ventas`, con `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `app.js` e `index.html`
- WHEN el usuario escribe, por el hook o con `/sdd-propose`, «Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas.»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch, no como feature
- AND `patch.md` lleva `solution: ticket` y en §2 la frase del ticket literal, sin causa raíz ni `superpowers:systematic-debugging`
- AND el changelog lleva la entrada en `Changed` o `Added`, nunca en `Fixed`, y el commit no es de tipo `fix`
- AND si `index.html` no existe, para sin abrir rama, carpeta ni id, y lo dice

**MODIFIED — Un cambio cuya solución tendría que fijar el agente no entra por el patch** (antes: entraba por `sdd-start-feature`)

- GIVEN el mismo proyecto
- WHEN el usuario escribe «/sdd-propose patch: es pequeño: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €» o «Métele un patch rápido: en las dos fichas, avisa al usuario cuando el total del pedido pase de 1.000 €»
- THEN `sdd-propose` lo clasifica como feature, no como patch, aunque la petición diga patch, y lo pregunta con feature recomendada
- AND el agente nombra lo que tendría que decidir él: el texto del aviso, dónde sale y si 1.000 € entra en el umbral
- AND con «Oculta Borrar si el pedido está facturado y pásalo a la derecha» también es feature: de dónde sale «facturado» lo tendría que decidir el agente
- AND si dentro de un patch hace falta decidir algo que el usuario ve y que nadie fijó, el agente para y lo sube a feature

**MODIFIED — El patch registra quién fijó la solución y quién decidió cada cosa** (antes: el patch se pasaba a `sdd-start-feature`)

- GIVEN un patch abierto con `sdd-start-patch`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` hace que el agente pare el patch y lo suba a feature por el paso de la spec de `sdd-propose`, y se lo diga al usuario
- AND el mensaje final de `sdd-end-patch` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

**MODIFIED — Una retirada de presentación entra por el carril patch** (antes: la abría `sdd-start-patch`)

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Quita Borrar de las dos fichas y pon Guardar y Cancelar en una columna a la derecha»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch, no como feature
- AND §3 de `patch.md` lista lo retirado (el botón Borrar de las dos fichas y lo que solo él usaba) y una línea con lo que el usuario deja de poder hacer: borrar la ficha desde ella
- AND el delta de `order-sheets` cambia «La ficha ofrece guardar, cancelar y borrar», y el changelog lleva la entrada en `Removed`
- AND con «Quita Borrar y añade Archivar en su sitio» es feature: una retirada no añade nada

**MODIFIED — Un texto fijado literal entra por el patch** (antes: lo abría `sdd-start-patch`)

- GIVEN el mismo proyecto
- WHEN el usuario escribe «Cambia "Guardar" por "Guardar y cerrar" y ponlo a la derecha, en las dos fichas»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch de petición cerrada: `patch.md` lleva `solution: dev-lead` y la entrada del changelog va en `Changed`

**Reglas de la capacidad**
- **Dónde viven los datos**: no aplica.
- **Idioma de los nombres**: los carriles se llaman `config`, `patch`, `lite`, `feature` y `spike`, en inglés, igual en castellano.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Regla ante conflicto**: entre el carril que trae la petición y el que ve la investigación, manda el pedido si concuerda o si es más pesado; si el investigado es más pesado, se pregunta con él recomendado. El carril solo sube.

### Capacidad: `control-profiles`

**MODIFIED — El perfil de control decide dónde para el agente** (antes: no nombraba las preguntas del arranque)

- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una feature
- THEN para en estos puntos y en ningún otro: `pair` en el arranque, la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en el arranque, la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND el arranque para solo con la pregunta del carril de patch, lite y config, o con la de partir una feature grande; en full y spike sin partir, `sdd-propose` anuncia y sigue
- AND en `pair` se confirman siempre las acciones hacia fuera (push, PR, publicar); en `delegate` y `unattended` también, salvo el push de la rama de integración tras el merge del cierre cuando `merge.push` es `true`; en los tres, el merge a `main` y el tag los decide una persona

**MODIFIED — La primera pregunta confirma carril, modo y perfil** (antes: toda feature empezaba con una pregunta de confirmación)

- GIVEN un cambio que arranca con usuario presente
- WHEN `sdd-propose` termina de clasificar
- THEN en full y spike no pregunta: anuncia carril, perfil vigente y de qué nivel sale, avisa de cada clave de `sdd-kit.local.json` que ignora, y sigue
- AND en patch, lite y config pregunta, sola, el carril con su 🦆, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta feature
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, el anuncio o la pregunta toman esa fila como enunciado
- AND en `pair` y `delegate`, el anuncio de full y spike dice las frases con las que el dev-lead aprueba la spec por delegación («apruebo la spec por delegación, nos vemos en la validación»), con la sesión en el modelo más capaz y más de una task prevista su variante «…y paras antes de la Task 1 para que baje la sesión a gama media», y cambia el perfil para esta feature («perfil pair para esta feature»); la pregunta de lite las lleva como opciones
- AND si el dev-lead dice o elige la variante, el agente escribe el plan, junta la apertura en su commit y para antes de la Task 1, sea cual sea el método

**MODIFIED — La primera pregunta propone partir una feature grande** (antes: iba en la primera pregunta de toda feature)

- GIVEN una feature cuyo enunciado, leído con el código que toca, prevé más de 5 tasks internas en el plan, o 4 o 5 que tocan capacidades o superficies distintas (BD, UI, API) o alguna con migración
- WHEN `sdd-propose` termina de clasificar
- THEN pregunta si partirla en features con fila propia en el roadmap, con la partición y el motivo, como opción recomendada junto a seguir entera, aunque el carril sea full
- AND en `pair` y `delegate`, la misma llamada ofrece aprobar la spec por delegación y, con la sesión en el modelo más capaz, su variante de parar antes de la Task 1 para bajar la sesión a gama media
- AND con 3 tasks o menos no lo propone; con 4 o 5 de la misma superficie y sin migración, tampoco, y dice el recuento
- AND el usuario decide; si sigue entera, no se vuelve a proponer en esa feature

**MODIFIED — La spec aprobada por delegación en la primera pregunta no para** (antes: solo la opción de la primera pregunta)

- GIVEN el usuario eligió la opción que aprueba la spec por delegación en la pregunta de `sdd-propose`, o escribió la frase «apruebo la spec por delegación»
- WHEN la spec está escrita y repasada
- THEN el agente la aprueba sin parar, registra la frase literal y la fecha en «Decisiones tomadas con el dev-lead» y en «Aprobaciones», decide él la review de spec y la registra, y sigue
- AND el resto de paradas del perfil vigente sigue igual: la validación final no se quita nunca

**MODIFIED — El perfil se hereda de la feature, de la persona, de la release o del proyecto** (antes: lo nombraba la primera pregunta de `sdd-start-feature`)

- GIVEN un perfil en el `profile:` de la spec, `control.profile` en `.docs/sdd/sdd-kit.local.json`, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap o `control.profile` en `sdd-kit.json`
- WHEN el agente determina el perfil vigente
- THEN manda la feature sobre la persona, la persona sobre la release y la release sobre el proyecto; una spec sin `profile:` hereda
- AND el anuncio o la pregunta del carril de `sdd-propose` nombran el perfil vigente y de qué nivel sale
- AND el agente solo escribe un `profile`, un `control.*`, un `merge` o un `validation.mode` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`; en `sdd-kit.local.json`, que no se commitea, basta la respuesta del usuario a `sdd-config`)

**Reglas de la capacidad**
- **Avisos**: la línea de terminado, última del mensaje final de cada cierre (rama, destino, hash, estado del push y ruta del worktree que se puede borrar, o «No terminado» y qué falta); el bloque de un push fallido (comando literal y error); y el aviso de cada clave de `sdd-kit.local.json` que el agente ignora, en el anuncio o en la pregunta del carril de `sdd-propose`.

### Capacidad: `capabilities`

**MODIFIED — El índice de capacidades se genera al vuelo** (antes: lo ejecutaba `sdd-start-feature`)

- GIVEN `.docs/sdd/capabilities/` con `bookings.md`, cuyo propósito es «Reservar, consultar y cancelar salas por franja horaria.», y `rooms.md`, sin `## Propósito`
- WHEN se ejecuta `sdd capability index --path .docs/sdd`
- THEN escribe, en orden de nombre, `` - `bookings` — Reservar, consultar y cancelar salas por franja horaria. `` y `` - `rooms` — (sin propósito) ``, y sale con 0
- AND un propósito escrito en varias líneas sale en una sola, y las líneas de ayuda `>` no salen
- AND un propósito de más de 300 caracteres sale entero: el índice no valida
- AND sin carpeta `capabilities/`, o con la carpeta vacía, escribe `Sin capacidades` y sale con 0
- AND el índice no se guarda en ningún fichero
- AND `sdd-propose`, `sdd-roadmap` y `sdd-consult` lo ejecutan en su paso de contexto, antes de decidir qué capacidades leer o tocar, y abren solo las que eligen con él

### Capacidad: `feature-flow`

**MODIFIED — La carpeta de una feature nueva lleva `-feature-`** (antes: la creaba `sdd-start-feature`)

- GIVEN un proyecto en modo `sequence` con la fila 0081 «Avisos de reserva» pendiente en el roadmap
- WHEN `sdd-propose` crea la carpeta de la spec el 2026-10-01 a las 09:15:00 UTC
- THEN la carpeta es `.docs/sdd/specs/20261001-091500-feature-0081-booking-reminders/`
- AND el frontmatter de `spec.md` lleva `id: 20261001-091500-feature-0081-booking-reminders` y `feature: 0081`

**MODIFIED — Una migración solo de datos no descarta el modo lite** (antes: lo citaba la primera pregunta de `sdd-start-feature`)

- GIVEN una feature que quita un botón de una pantalla y cuya única migración da de baja sus dos textos con un procedimiento idempotente y reversible
- WHEN `sdd-propose` cita el predicado de lite en la pregunta del carril
- THEN lo ofrece como lite y nombra la migración
- AND con una migración que añade una columna no lo ofrece: cambia el schema

**MODIFIED — El diseño de una feature pregunta con `sdd-grilling`** (antes: el paso de spec era de `sdd-start-feature`)

- GIVEN el paso de spec de `sdd-propose`, con `brainstorming` llevando el diseño de una feature que cambia lo que ve el usuario
- WHEN `brainstorming` necesita una decisión del usuario
- THEN la pregunta sigue `sdd-grilling` ([`interviewing`](interviewing.md)): una por turno, en texto con el formato fijo, con escena concreta si es de producto
- AND el flujo (enfoques, diseño por secciones, spec) sigue siendo el de `brainstorming`

**MODIFIED — Cada cambio de paso lleva un aviso en llano** (antes: solo en `sdd-start-feature`)

- GIVEN una feature en curso con `sdd-propose` o `sdd-start-feature`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

**MODIFIED — La spec propone su propio nivel de review por complejidad** (antes: la opción de delegar estaba solo en la primera pregunta)

- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec, la opción mínima con lo que deja sin cubrir y el modelo del revisor de dominio
- AND si el Scope cambia menos de ~50 líneas (texto y código), el nivel baja de dos revisores a uno con los siete puntos, nunca a ninguno: con contrato público + datos y dos líneas en `db/002-site.sql` y `src/api.js`, un revisor
- AND si el nivel sería dos revisores, la spec va aprobada por delegación (la opción o la frase «apruebo la spec por delegación») y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo; con un nivel de «ninguna» no despacha ninguno
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra; en modo lite no se propone

**ADDED — El gate de cierre del plan sale de `operations.md`**

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`» y sin script `test` en `package.json`
- WHEN `sdd-propose` escribe el plan
- THEN la línea del gate de cierre de §3 dice `node --test`, literal
- AND sin `operations.md`, toma el de `tech-stack.md` §Testing; sin ninguno, el de la constitution; y si no hay ninguno, escribe `no declarado` y lo apunta en las decisiones del plan, sin inventar un comando como `npm test`

**ADDED — `sdd-propose` entrega el cambio a la skill que lo sigue**

- GIVEN la feature 0010 en `delegate`, con la spec aprobada y el plan escrito por `sdd-propose`
- WHEN `sdd-propose` termina el plan
- THEN invoca `sdd-start-feature`, que sigue desde la implementación leyendo `mode` y `profile` del frontmatter de `spec.md`, la línea `Ejecución` del plan y la rama
- AND en lite, la invoca con la spec aprobada; en patch, invoca `sdd-start-patch` con la clase del patch y la estimación de la pregunta
- AND si se invoca `sdd-start-feature` sin una `spec.md` aprobada en la rama, manda a `sdd-propose`

**Reglas de la capacidad**
- **Regla ante conflicto**: `§Frontend` gana sobre los valores por defecto de la verificación (viewports), y la pantalla de referencia que nombra la task gana sobre la de `§Frontend`. El gate de cierre del plan se toma de `operations.md` §Testing; sin él, de `tech-stack.md` §Testing; sin ninguno, de la constitution.

### Capacidad: `estimation`

**ADDED — La estimación de un patch se escribe antes del fix**

- GIVEN un proyecto con `.docs/sdd/estimation.md` y un patch clasificado por `sdd-propose`
- WHEN el agente abre el patch
- THEN si pregunta el carril, la pregunta lleva la estimación en horas
- AND, pregunte o no, `patch.md` §5 la escribe antes del fix, y la hora de inicio en UTC en la línea siguiente: `- Estimación: 0,5h` y `- Inicio: 2026-10-09T11:20Z`, con `- Real:` debajo
- AND `sdd estimation log` lee `- Estimación: 0,5h` como hoy, y `- Inicio:` no cuenta como estimación ni como real

**Reglas de la capacidad**
- **Dónde viven los datos**: los bloques de tiempo de `walkthrough.md` (§2) y de `patch.md` (§5) de cada carpeta de artefactos, con la estimación previa del patch y su hora de inicio en §5, escritas antes del fix; el log, generado, en la carpeta de `estimation.md`.

### Capacidad: `explaining`

**ADDED — La pregunta de un carril que pregunta abre con su 🦆**

- GIVEN `sdd-propose` con un cambio clasificado como patch, lite o config
- WHEN pregunta el carril
- THEN antes de la pregunta va un párrafo con 🦆, escrito por `sdd-rubber-duck` en modo corto, que dice qué cambiará para quien usa el producto
- AND en config, que no cambia nada para quien usa el producto, dice qué se toca y qué pruebas pasan antes de guardarlo: «la versión mínima de Node que pide el proyecto pasa a la 22.18; antes de guardarlo pasan todas sus pruebas»
- AND lo que queda por decidir va en la pregunta, no en el párrafo

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-09 | aprobada |
