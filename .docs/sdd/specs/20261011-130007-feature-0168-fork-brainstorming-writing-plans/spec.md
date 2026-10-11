---
id: 20261011-130007-feature-0168-fork-brainstorming-writing-plans
feature: 0168
proposal: 0131
title: propose sin superpowers — fork de brainstorming y writing-plans en referencias de sdd-propose
mode: full
profile: delegate
status: approved
created: 2026-10-11
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-11
---

# Spec — propose sin superpowers: `spec-writing.md` y `plan-writing.md`

🦆 Cuando pidas una funcionalidad, el kit te entrevistará y escribirá la spec y el plan con sus propias instrucciones, sin pasar por las dos de superpowers que cambiaron sin aviso en su versión 7. En una funcionalidad grande, como unos permisos por rol que salen en cinco partes, antes de escribir la spec te enseñará el diseño por trozos y te preguntará en cada uno si va bien; en una de dos partes irá directo a la spec. Al escribirla, buscará las decisiones de arquitectura ya registradas sobre lo que toca y te avisará si el enfoque va contra alguna. Si hay que decidir cómo se ve una pantalla, te enseñará un boceto aparte cuando la pantalla aún no exista, y la variante sobre la propia aplicación cuando ya exista. Lo demás no cambia: la misma forma de preguntar, la misma spec con sus decisiones a validar y la misma aprobación.

## Capacidades

- Modificadas: `feature-flow` — la spec y el plan se escriben con las referencias del kit; una feature grande devuelve el diseño por secciones; la spec cita las ADR de lo que toca; pedir empezar ya no se lleva la spec.
- Modificadas: `routing` — `superpowers:brainstorming` no se invoca en ningún momento.
- Modificadas: `interviewing` — el boceto dice con qué se hace.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (cuatro requisitos de tres capacidades y un REMOVED), tres o más capacidades (feature-flow, routing, interviewing), área no explorada (sdd-roadmap, sdd-init-greenfield, sdd-config y los Pester que nombran las dos skills) · tamaño: ~500 líneas en ~23 ficheros, la mitad texto movido o traducido
- Dominio (Opus, elegido): si el umbral de 4 tasks del diseño por secciones y la regla de las ADR dejan algún carril sin cubrir (señal: MODIFIED)
- Técnica (Sonnet): contratos y ficheros que el cambio arrastra sin decirlo (señal: área no explorada)
- Mínimo razonable: ninguna — sin revisor, nadie más relee si la tabla de procedencia del anexo deja una pieza de la fuente sin destino
Hecha: dos revisores en paralelo, por decisión del dev-lead sobre la propuesta «ninguna».
```

1. **Dónde vive cada pieza** (decidido contigo): la técnica de preguntar, en `sdd-grilling`; escribir la spec, en `skills/sdd-propose/references/spec-writing.md`; escribir el plan, en `skills/sdd-propose/references/plan-writing.md`. Los pasos 4 y 5 de `sdd-propose` se quedan con lo que decide (gate, carril, perfil, review) y empiezan por «lo primero de este paso: lee `references/…`» (la forma que se siguió 4 de 4 en la 0147). Nombres en inglés kebab-case (Art. III).
2. **Base y aviso**: superpowers 7.0.0. `writing-plans` es idéntica en la 6.4.2 y la 7.0.0 (`diff` sin salida), la que validó el patch 0082. Aviso en `skills/sdd-propose/NOTICE` (MIT, Jesse Vincent) y fila en `THIRD_PARTY_NOTICES.md`; cada referencia abre con una línea «Adapted from superpowers 7.0.0 `<skill>` (MIT, see NOTICE)», como `sdd-grilling`.
3. **La tabla de procedencia vive en el anexo de esta spec**, no en las referencias: la lee quien mantiene el fork al revisar una versión nueva (Art. V), no el agente que escribe una spec, y en la referencia gastaría tokens en cada feature. `THIRD_PARTY_NOTICES.md` enlaza el anexo. Para traer mejoras: `diff` de superpowers contra superpowers, y cada pieza cambiada se busca en la tabla.
4. **El modelo es el de Spec Kit** (decidido contigo): las referencias llevan el proceso; `spec-template.md` y `plan-template.md` conservan la ayuda de sus campos y las reglas medidas allí (transcripción del patch 0082, Review Focus, «Dónde se prueba», 🦆 ✋). Solo cambian sus avisos «Compatible con `superpowers:writing-plans`» y «con `superpowers:writing-plans`», que pasan a nombrar `plan-writing.md`.
5. **Diseño por secciones** (decidido contigo): en una feature full con **4 o más tasks previstas**, al cerrar la entrevista y antes de escribir `spec.md`, el agente presenta el diseño por secciones, cada una del tamaño que pide (unas frases o hasta ~250 palabras), y pregunta «¿va bien?» tras cada una; lo que el usuario corrige entra antes de escribir. El recuento es el de las tasks previstas de la feature que se especifica, hecho al entrar en el paso 4: así vale también para un patch o un lite que suben a full y, tras partir, cuenta la pieza, no el total. No hay secciones con 3 o menos, en lite, en spike (aunque hoy corra como full: lo decidiste así), con la spec aprobada por delegación ni en `unattended`; en estos dos últimos, lo que habría preguntado va a ✋. Las secciones no sustituyen al gate: la spec se aprueba igual. Son turnos de la entrevista, dentro de la parada de la spec, no una parada nueva: valen en `pair` y `delegate` y `control-profiles` no cambia (decidido contigo tras la review). Si el usuario pide empezar ya, tampoco hay secciones.
6. **ADR** (decidido contigo): con el Scope decidido, en full y en lite (los dos escriben `spec.md`, y una ADR pisada cuesta igual), `spec-writing.md` manda ejecutar `sdd decision index --path .docs/sdd --files <ficheros>`, con la ruta de cada fichero que el Scope crea o modifica (el índice casa rutas con globs y no exige que el fichero exista; un directorio se pasa por los ficheros suyos que cambian), leer las ADR que salgan y citarlas en «Approach» o en «Términos y ADR». El índice solo devuelve `accepted` y `proposed`: una `proposed` se cita como pendiente. Si el Approach va contra una ADR `accepted` y lo eligió el agente, va a ✋; si lo eligió el dev-lead, a «Decisiones tomadas con el dev-lead», con el aviso; en los dos casos «ADR candidatas» lleva la que la sustituiría (`sustituye a NNNN`). Sin ADR que salgan, nada que escribir. El comando con su ruta (`node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" decision index …`) va en el paso 4 del `SKILL.md`, porque Claude Code solo sustituye la variable en un `SKILL.md` (`tech-stack.md`, «Distribución»); la referencia nombra el verbo.
7. **Boceto** (decidido contigo): la regla de `sdd-grilling` pasa de «offer a sketch instead of asking» a decir con qué: si la pantalla aún no existe, un Artifact con las opciones; si existe, sobre la app real con lo que declara `§Frontend` (el detector en vivo, o una captura de la pantalla actual junto a la variante); sin `§Frontend`, un Artifact. Si la app no se puede levantar o no hay acceso, o el harness no tiene Artifact (`claude -p`), describe cada opción en texto con su escena y dice por qué no la enseña. No se forkea el visual companion ni su servidor.
8. **Lo que no se adopta de `brainstorming` 7.0.0**: la oferta de saltarse las preguntas, «Size the Work» (lo sustituyen los carriles), el builder check (lo sustituye `review-spec.md`), la primera pregunta abierta sin menú (manda el formato de `sdd-grilling`), «how it gets made» como pieza propia (lo cubren `tech-stack.md`, la pregunta 11 de la init, ✋ y «Decide for me»), anti-goals (sin fallo que lo pida), «think wide privately» (el formato de `sdd-grilling` ya enseña las alternativas), «offer recon» (propose lee sin pedir permiso), la ruta `docs/superpowers/specs/` y el visual companion. Una fila por pieza en el anexo.
9. **Pedir empezar ya**: la frase del paso 4 «Don't offer to skip the questions, even if its first message asks you to» sale, porque el fork no tiene esa oferta; se queda, en `spec-writing.md`, que si el usuario pide empezar ya («empieza ya», «hazlo sin más preguntas») se escribe la spec con lo que hay, los huecos en ✋, y pasa por su gate; elegir un alcance («solo valida X») no es pedir empezar ni aprueba nada. En `unattended` no se pregunta, así que no aplica.
10. **De `writing-plans` entra todo** salvo: la ruta `docs/superpowers/plans/`, la cabecera «For agentic workers: REQUIRED SUB-SKILL…» (la sustituye la línea `Ejecución`, que nombra `sdd-implement`), la línea de contexto de `using-git-worktrees` (es de `sdd-implement`) y lo que `plan-template.md` ya dice campo a campo («What a Step Contains», Interfaces, Review Focus, «Plan Document Header»): la referencia lo enlaza y no lo repite. El handoff entra con el ajuste que hoy está en `overrides-superpowers.md`: se adopta la recomendación con su motivo en la línea `Ejecución`, y solo `pair` para a preguntar; «Frequent commits» entra con el ajuste de `commit-milestones.md`.
11. **`overrides-superpowers.md` pierde cinco filas**: las tres de `brainstorming` (tamaño y oferta, builder check, estilo de preguntas) y las dos de `writing-plans` (handoff, commits frecuentes). Quedan las de ruta y plantillas, `using-git-worktrees` y `finishing-a-development-branch`, que son de la 0166 y la 0149. La sección «Cuándo NO aplicar SDD» no cambia.
12. **Siguen nombrando `brainstorming` dos prohibiciones**, mientras superpowers siga instalado (lo necesitan la 0165, 0166, 0148 y 0149): `using-sdd` («prevalece sobre la regla de superpowers de invocar `brainstorming` primero», porque `using-superpowers` sigue empujando a invocarlo) y `sdd-explore` («NEVER `superpowers:brainstorming`»). Prohibir no es invocar. Lo que cambia en `using-sdd` es el resto de esa frase («`brainstorming` y `writing-plans` se usan dentro de ellas, cuando la skill del kit las invoca»), que pasa a «las skills del kit entrevistan con `sdd-grilling` y no invocan `brainstorming` ni `writing-plans`»: lo pide el `MODIFIED` de `routing`. Es skill de entrada: lleva su tramo de batería (Art. I).
13. **`sdd-roadmap` y `sdd-init-greenfield`** entrevistan con `sdd-grilling` y dejan de nombrar `brainstorming`; `sdd-roadmap` ya describe su técnica sin atribuírsela (patch 0167), así que solo cambia la frase de cabecera. El resto de `sdd-init-greenfield` (por ejemplo «nada de ADRs sueltos») es de la 0156, que la funde con brownfield.
14. **Más textos que nombran `writing-plans`**: el paso 5 y la línea de método de `sdd-propose`, `control-profiles.md` (§execution), la fila 6 de `sdd-config`, el Art. IV de la constitution («el handoff de `writing-plans`» pasa a «el handoff de `plan-writing.md`»), `architecture.md` (lector de `estimation-log.md`), `mission.md` («La entrevista usa `brainstorming`» del flujo por defecto) y el README (de 8 a 6 skills de superpowers invocadas). Los Pester que fijan esos literales cambian con ellos: `SuperpowersCompat`, `PlanEntry`, `PlanReviewFocus` y `NativeDefault` (`UsingSdd` fija «prevalece» y «brainstorming», que se quedan); `cli/test/` no fija ninguno. Barrido hecho con `grep` de los dos nombres en `skills/`, `.docs/sdd/`, `tests/` y `cli/`: fuera de esta lista solo quedan menciones históricas (`tech-stack.md`, specs, tickets, changelog, releases, ADR 0006), que no se reescriben. La guía de `.docs/workflow/` dice «brainstorming con Claude» como actividad, no como skill: no se toca. La feature va en la release 3.0.0 y no cambia nada de los proyectos: sin migración propia (la de la 3.0.0 es de la 0157); su entrada de changelog, al cerrar.
15. **Lo que entra y lo que sale** (Art. I): entran `spec-writing.md`, `plan-writing.md`, `NOTICE`, el diseño por secciones, la lectura de ADR y la regla del boceto. Salen las invocaciones de `superpowers:brainstorming` y `superpowers:writing-plans`, cinco filas de `overrides-superpowers.md`, la frase de la oferta de saltarse las preguntas del paso 4 y el texto de los pasos 4 y 5 que pasa a las referencias.
16. **Esta feature no se aplica el diseño por secciones a sí misma**: la regla aún no está en el kit, y la sesión sigue el texto vigente.
17. **Previsión de coste** (Art. I), con Sonnet y el molde `reservas` de la batería de `sdd-propose` (más una ADR plantada en `adr`). Los sujetos llevan superpowers 7.0.0 cargado (`SUPERPOWERS_DIR`): «no invoca» se puntúa en `tools.txt` contra un kit que podría invocarlo.

    | Paso nuevo o cambiado | Escenario | RED | GREEN | ~$ |
    | --- | --- | --- | --- | --- |
    | Diseño por secciones | `pb`: feature de 5 tasks previstas, entrevista cerrada en la petición; se puntúa que la primera sección sale antes de que exista `spec.md` | 2 | 2 | 3 |
    | Diseño por secciones (control) | `pb-c`: feature de 2 tasks | — | 1 | 0,5 |
    | Lectura de ADR | `adr`: la feature elige de forma natural la alternativa que una ADR `accepted` descartó | 2 | 2 | 2 |
    | Lectura de ADR (control) | `adr-c`: ninguna ADR casa con el Scope; la spec no añade nada | — | 1 | 0,5 |
    | Boceto sobre la app real | `sk`: decisión de cómo se ve una pantalla que ya existe, con `§Frontend` | 2 | 2 | 2 |
    | Boceto sin pantalla (control) | `sk-c`: pantalla nueva; en `claude -p`, sin Artifact, el respaldo en texto | — | 1 | 0,4 |
    | Se leen las referencias y no se invoca superpowers | `h1`: feature full hasta el plan (humo; el RED, con el kit vigente, debe invocar `superpowers:brainstorming`) | 1 | 2 | 3,5 |
    | Pedir empezar ya; no ofrece saltarse las preguntas | `n` e `y` del patch 0167 | — | 1 + 1 | 1 |
    | Paso 5 movido a `plan-writing.md` (control de no regresión) | `p2` de la batería de `sdd-propose` | — | 1 | 0,5 |
    | `using-sdd`: la frase de cabecera | tramo de su batería, un escenario de feature | — | 1 | 0,4 |
    | `sdd-roadmap` y `sdd-init-greenfield` entrevistan con `sdd-grilling` | humo, un sujeto cada una | — | 1 + 1 | 1 |

    Sin medir, con su motivo: las exclusiones del diseño por secciones en lite, spike, spec delegada y `unattended` (son la rama que no hace nada, la misma que mide `pb-c`), la `proposed` del índice (cambia una palabra de la cita) y la corrección del usuario a una sección (en `claude -p` no hay segundo turno: se valida en campo). Total ~15 $ y ~2,5 h de reloj; techo con la reserva del 20 %: 18 $. Si un RED sale limpio, la regla no se escribe y su GREEN no se lanza. `pb`, `adr` y `sk` pasan a la batería de `sdd-propose` (`sk`, a la de `sdd-grilling`). Las formas (ningún `superpowers:brainstorming` ni `superpowers:writing-plans` invocado en `skills/`, la línea de origen y el `NOTICE`, las filas que salen de `overrides-superpowers.md`) llevan además un Pester.
18. **Cabe en los topes**: estimo `spec-writing.md` en ~800 palabras y `plan-writing.md` en ~1.000; los pasos 4 y 5 bajan unas 600 al moverse, así que `sdd-propose` queda en ~4.400 de `SKILL.md` y ~6.200 en total, por debajo del techo de 7.500. Plan B si lo pasa: el handoff de `plan-writing.md` remite a `control-profiles.md` en vez de repetir qué perfil para.
19. **`sdd-implement` no cambia**: la acción update corrige la spec en su sitio con `spec-template.md`, y nada de `spec-writing.md` (secciones, ADR, empezar ya) aplica a una corrección.
20. **Filas de deuda que abro al cerrar**: valorar el modelo de OpenSpec (plantillas en esqueleto, todas las reglas en la instrucción) en la 0152; y separar bien patch y lite: un patch es lo que se reproduce con un test y se arregla al ponerlo en verde (lo dijiste a mitad de entrevista; no entra aquí).

### Hallazgos de la review

Dominio (Opus):

1. **Resuelto con el dev-lead** — Crítico: las secciones añadían una parada en `delegate`, que solo para en arranque, spec, desvíos y validación (`control-profiles`) → son turnos de la entrevista dentro de la parada de la spec; `control-profiles` no cambia (✋5 y delta).
2. **Aceptado** — con la spec aprobada por delegación no hay gate y las secciones serían la única parada → sin secciones; a ✋ (✋5 y delta).
3. **Aceptado** — el recuento no estaba definido en spike-como-full, subidas de carril ni tras partir → recuento al entrar en el paso 4, de la feature que se especifica; spike sin secciones (✋5 y delta).
4. **Aceptado** — ADR solo en full y sin estados → también en lite; `proposed` se cita como pendiente; el índice no devuelve otros estados (✋6 y delta).
5. **Aceptado** — contra una ADR elegido por el dev-lead iba a ✋ → a «Decisiones tomadas con el dev-lead» (✋6 y delta).
6. **Aceptado** — reglas de la capacidad sin tocar → `feature-flow` · Límites e `interviewing` · Dónde viven los datos; Idioma, Avisos y Regla ante conflicto no cambian (delta).
7. **Aceptado** — boceto sin respaldo si no hay app ni Artifact → texto con escena y motivo (✋7 y delta).
8. **Aceptado** — `using-sdd` implementa el requisito de `routing` y quedaba fuera → entra en Scope con su tramo de batería; `UsingSdd` fija literales que se quedan (✋12, ✋14).
9. **Aceptado** — «Show, don't tell» cubría más que pantallas → fila partida (anexo).
10. **Aceptado** — tres piezas sin fila → añadidas (anexo).

Técnica (Sonnet):

1. **Aceptado** — en `claude -p` no hay segundo turno → se puntúa la primera sección antes de `spec.md`; la corrección, en campo (✋17, «Dónde se prueba»). El choque con `delegate` es el crítico de dominio.
2. **Aceptado** — exclusiones y casos sin escenario ni motivo → `adr-c` añadido y motivos de lo que no se mide (✋17).
3. **Aceptado en parte** — «ficheros del Scope» era prosa → ruta de cada fichero que crea o modifica, sin directorios (✋6). **Rechazado** lo de `${CLAUDE_PLUGIN_ROOT}`: el lanzador carga la copia del kit con `--plugin-dir` y la variable apunta a ella, y en la sesión del repo el harness la sustituye por el working tree (visto en esta misma sesión).
4. **Aceptado** — `h1` trivial sin superpowers → sujetos con superpowers 7.0.0 cargado y RED de `h1` con el kit vigente (✋17).
5. **Aceptado** — topes sin estimar → estimación y plan B (✋18).
6. **Aceptado** — barrido de menciones → `mission.md` entra; el resto, histórico; release 3.0.0 sin migración propia (✋14).
7. **Aceptado** — el enlace desde `sdd-implement` no tenía porqué → sale del Scope (✋19).
8. **Aceptado** — `cli/test/` no fija esos literales: comprobado (✋14).
9. **Aceptado** — «empezar ya» sin contraejemplo → positivo y contraejemplo (✋9).
10. **Aceptado** — `p2` sin paso → es el control de no regresión del paso 5 movido a `plan-writing.md` (✋17).

### Decisiones tomadas con el dev-lead

- Del prompt de arranque, 2026-10-11: base de los forks superpowers 7.0.0, la misma que `sdd-implement`, citada en `THIRD_PARTY_NOTICES.md` · se quedan 🦆, ✋, revisor de dominio (Opus o Sonnet) y técnico, los cinco carriles con ceremonia asimétrica, el gate con `AskUserQuestion` y la primera pregunta con opciones y la recomendada primero · qué se queda de la 7.0.0 se decide en la entrevista, contrastado con el patch 0167 · fallo que evita: la 3.0.0 sale dependiendo de una skill que cambia sin aviso · perfil `delegate`; al fusionar, `sdd merge --push` — «Arranca la 0168 con sdd-propose, carril feature…».
- Técnica de preguntar a `sdd-grilling`; escribir la spec y el plan, en dos referencias de `sdd-propose` — «1, ok», 2026-10-11.
- Diseño por secciones antes de la spec, solo en features con 4 o más tasks previstas — «1, ok», 2026-10-11.
- «How it gets made» no es pieza propia — «1, esta creo que con nuestra documentacion de sdd se cubre», 2026-10-11.
- La spec lee las ADR con `sdd decision index --files`; anti-goals fuera — «1, ok», 2026-10-11.
- Sin servidor del visual companion; el boceto dice con qué — «creo que artifacts cubre , 1», 2026-10-11.
- Modelo de Spec Kit para referencia frente a plantilla — «1», 2026-10-11.
- Topes de palabras medidos al terminar, con techo de 7.500 en el total de `sdd-propose` y de 750 en `sdd-grilling`; `SKILL.md` de `sdd-propose` sin subir de 5.000 — «1», 2026-10-11.
- Revisor de dominio en Opus si se revisa — «1», 2026-10-11.
- Revisión adversarial con dos revisores en paralelo, aunque la rúbrica decía «ninguna» — «Dos revisores en paralelo (Recomendada)», 2026-10-11.
- Las secciones son turnos de la entrevista dentro de la parada de la spec, en `pair` y `delegate`; pedir empezar ya también las salta — «1, entiendo que te puedo pedir que no preguntes mas y me presentes una spec no?», 2026-10-11.

## Intent

`sdd-propose`, `sdd-roadmap` y `sdd-init-greenfield` invocan `superpowers:brainstorming`, y el paso 5 de `sdd-propose`, `superpowers:writing-plans`. Superpowers reescribió `brainstorming` en la 7.0.0 sin aviso y obligó al hotfix 2.3.4; las correcciones del kit vivían en una tabla de overrides que ningún sujeto leyó (0 de 6). La 3.0.0 no puede salir dependiendo de dos skills que cambian solas. Esta feature las trae al kit como dos referencias de `sdd-propose`, con lo que la entrevista decidió que se queda de la 7.0.0, y deja una tabla para traer las mejoras de cada versión.

## Scope

- Entra: `skills/sdd-propose/references/spec-writing.md` y `plan-writing.md` (nuevos), `skills/sdd-propose/NOTICE` (nuevo), `skills/sdd-propose/SKILL.md` (pasos 4 y 5, red flags y racionalizaciones que nombran las dos skills), `skills/sdd-grilling/SKILL.md` (boceto), `skills/sdd-roadmap/SKILL.md`, `skills/sdd-init-greenfield/SKILL.md`, `skills/sdd-config/SKILL.md` (fila 6), `skills/sdd-start-feature/references/overrides-superpowers.md` y `control-profiles.md`, `skills/using-sdd/SKILL.md` (el resto de la frase de cabecera), `skills/sdd-templates/templates/spec-template.md` y `plan-template.md` (solo los avisos), `.docs/sdd/constitution.md` (Art. IV), `.docs/sdd/architecture.md`, `.docs/sdd/mission.md`, `README.md`, `THIRD_PARTY_NOTICES.md`, los Pester que fijan sus literales, `tests/WordBudget.Tests.ps1` y las baterías de `sdd-propose` y `sdd-grilling`.
- No entra: forkear `test-driven-development`, `systematic-debugging` (0165), `using-git-worktrees`, `dispatching-parallel-agents` (0166), `requesting-code-review` (0148) ni `finishing-a-development-branch` (0149); quitar superpowers de las dependencias del README; el visual companion; el modelo de plantillas de OpenSpec; la distinción patch / lite; el resto de `sdd-init-greenfield` (0156); `.docs/workflow/`; `sdd-explore`, cuya prohibición de `brainstorming` se queda (✋ 12); `sdd-implement` (✋ 19).

## Approach

Un fork por referencia, no por skill: `spec-writing.md` reúne lo que de `brainstorming` sirve para escribir una spec del kit (cubrir lo que la plantilla pide, diseño por secciones en las features grandes, ADR, empezar ya) y `plan-writing.md` reúne `writing-plans` con los ajustes que hoy están en `overrides-superpowers.md`. La técnica de preguntar ya es de `sdd-grilling`, que solo gana la regla del boceto. Las plantillas no se mueven. Cada pieza de las dos fuentes tiene su fila en el anexo: dónde vive ahora o por qué se descarta.

## Dónde se prueba

- Diseño por secciones, ADR, referencias leídas, sin invocar superpowers: sujetos headless sobre el molde `reservas` de la batería de `sdd-propose`, con superpowers 7.0.0 cargado, como los escenarios de la 0160; la conducta se lee en `texts.txt` y `tools.txt`. De las secciones, en `claude -p` solo se observa la primera antes de que exista `spec.md`; la corrección del usuario se valida en campo.
- Boceto: sujeto headless de la batería de `sdd-grilling`; en `claude -p` no hay Artifact ni `AskUserQuestion`, así que se puntúa lo que ofrece y con qué (tech-stack, feature 0146).
- Formas (ninguna invocación a las dos skills en `skills/`, línea de origen, `NOTICE`, filas de overrides, literales movidos): Pester, como `SuperpowersCompat.Tests.ps1`.

## Términos y ADR

- Términos resueltos: **diseño por secciones** — devolver el diseño entendido en trozos, con «¿va bien?» tras cada uno, antes de escribir la spec (se evita «play back», que en la 7.0.0 es intercalado durante toda la entrevista).
- ADR candidatas: los forks de superpowers viven como referencias de la skill que los usa, no como skills — alternativa descartada: una skill por fork, como `sdd-implement` (dos `description` más en cada sesión y riesgo de que el enrutado salte la entrada única).

## Delta de comportamiento

### Capacidad: `feature-flow`

**MODIFIED — El diseño de una feature pregunta con `sdd-grilling`** (antes: «AND el flujo (enfoques, diseño por secciones, spec) sigue siendo el de `brainstorming`»)

- GIVEN el paso de spec de `sdd-propose`, con el diseño de una feature que cambia lo que ve el usuario
- WHEN el agente necesita una decisión del usuario
- THEN la pregunta sigue `sdd-grilling` ([`interviewing`](interviewing.md)): una por turno, en texto con el formato fijo, con escena concreta si es de producto
- AND la spec se escribe siguiendo `references/spec-writing.md` de `sdd-propose`, y el plan, `references/plan-writing.md`, sin invocar `superpowers:brainstorming` ni `superpowers:writing-plans`

**ADDED — Una feature grande devuelve el diseño por secciones antes de la spec**

- GIVEN la feature 0012 en `delegate`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike (también mientras el spike corra como full), escribe la spec sin secciones y la presenta en el gate
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones: lo que habría preguntado va a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND las secciones son turnos de la entrevista dentro de la parada de la spec, no una parada nueva del perfil: valen en `pair` y en `delegate`

**ADDED — La spec cita las ADR de los ficheros que toca**

- GIVEN la ADR `0003-bookings-in-memory.md`, `accepted`, con `rutas: src/**`, que guarda las reservas en memoria y descarta SQLite, y una feature cuyo Scope modifica `src/app.js`
- WHEN el agente escribe la spec
- THEN ejecuta `sdd decision index --path .docs/sdd --files src/app.js` y cita la ADR 0003 en «Approach» o en «Términos y ADR»
- AND si el agente elige pasar las reservas a SQLite, «✋ Decisiones que he tomado yo» dice que va contra la ADR 0003; si lo eligió el dev-lead en la entrevista, lo dice «Decisiones tomadas con el dev-lead»; en los dos casos «ADR candidatas» lleva la que la sustituiría (`sustituye a 0003`)
- AND una ADR `proposed` que devuelva el índice se cita como pendiente
- AND en lite hace lo mismo; sin ADR cuyas `rutas` casen con el Scope, la spec no añade nada

**Reglas de la capacidad**
- **Límites**: detector en dos viewports (por defecto `1280x800` y `390x844`), sin tope de rondas; como máximo 3 rondas de arreglo de composición; la sesión se rehace una vez por ejecución; el diseño por secciones, desde 4 tasks previstas, con secciones de unas frases a ~250 palabras.

**REMOVED — Saltarse las preguntas de brainstorming no se lleva la spec**

- motivo: el fork no ofrece saltarse las preguntas; lo que queda del requisito pasa a «Pedir empezar ya no se lleva la spec».

**ADDED — Pedir empezar ya no se lleva la spec**

- GIVEN una feature en el paso de spec de `sdd-propose`
- WHEN el agente pregunta al usuario
- THEN no le ofrece saltarse las preguntas
- AND si el usuario pide empezar ya, el agente escribe `spec.md` con lo que hay, con los huecos en «✋ Decisiones que he tomado yo», y la spec pasa por su gate

### Capacidad: `routing`

**MODIFIED — Una petición de trabajo entra por el kit, no por brainstorming** (antes: «AND `superpowers:brainstorming` se invoca después, desde el paso de la spec de `sdd-propose`, nunca antes»)

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`
- AND `superpowers:brainstorming` no se invoca en ningún momento: la entrevista la lleva `sdd-grilling` y la spec, `references/spec-writing.md` de `sdd-propose`

### Capacidad: `interviewing`

**MODIFIED — Escena concreta en las decisiones de producto** (antes: «AND si la decisión es cómo se ve o cómo se siente una pantalla, deja de preguntar y propone enseñar un boceto o un prototipo desechable»)

- GIVEN una decisión sobre lo que ve o hace quien usa el producto (pegar un vínculo cuando el plugin no ve el portapapeles)
- WHEN el agente la pregunta
- THEN cada alternativa lleva una escena con datos y lo que se ve en cada paso («pegas `https://…/doc/42` → sale la tarjeta "Informe Q3"»), y la limitación técnica se cuenta por su efecto, no por su causa
- AND si la decisión es cómo se ve o cómo se siente una pantalla, deja de preguntar y propone enseñar un boceto: un Artifact con las opciones si la pantalla aún no existe; si existe, sobre la app real con lo que declara `§Frontend` (el detector en vivo, o una captura de la pantalla actual junto a la variante), y sin `§Frontend`, un Artifact
- AND si la app no se puede levantar o no hay acceso, o el harness no tiene Artifact, describe cada opción en texto con su escena y dice por qué no la enseña

**Reglas de la capacidad**
- **Dónde viven los datos**: `sdd-grilling` no escribe ficheros del proyecto, y lo que devuelve lo escribe quien la invoca, en sus documentos de siempre; un boceto vive en un Artifact privado del usuario, y una captura de la pantalla actual, fuera de git (el scratchpad de la sesión), como las de la verificación visual.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-11 | aprobada: «Apruebo (Recomendada)» |

## Anexo — Pieza de la fuente → dónde vive ahora

Superpowers 7.0.0. Una fila por paso, red flag y racionalización de las dos skills (Art. I, fusionar es editar).

### `brainstorming`

| Pieza | Dónde vive ahora · o por qué se descarta |
| --- | --- |
| «You are very good at building… find out what they actually want» (propósito) | `spec-writing.md`, primera línea: por qué la spec se escribe tras la entrevista |
| First: What Do You Actually Know? (quick task → do it) | Descartada: el carril lo decide el paso 2 de `sdd-propose` |
| Your First Message: oferta de saltarse las preguntas | Descartada (RED del 0167: 5 de 5 la ofrecían contra el dev-lead); queda «pedir empezar ya» en `spec-writing.md` |
| Your First Message: una pregunta abierta | `sdd-grilling`, «Discovery» (abierta solo para lo que solo sabe el usuario); el resto, con opciones y la recomendada |
| The Conversation: una pregunta por mensaje, lenguaje llano | `sdd-grilling`, «One decision per turn» y la forma de la pregunta |
| Get them describing / menú solo si se atascan | `sdd-grilling`, «Discovery»; el menú lo sustituye la forma con recomendada (decisión del dev-lead) |
| «Just guess» → propose something concrete | `sdd-grilling`, «Decide for me» |
| How it gets made | Descartada como pieza: `tech-stack.md`, pregunta 11 de `sdd-init-greenfield`, ✋ y «Decide for me» |
| Ground to cover: kind, why now, success | «Intent» de `spec-template.md` |
| Ground to cover: goals, non-goals | «Scope: Entra / No entra» de `spec-template.md` |
| Ground to cover: anti-goals | Descartada: sin fallo que la pida |
| Ground to cover: prior art, current state | `spec-writing.md`: ADR con `sdd decision index --files`; estado actual, `capabilities/` y el código (paso 1) |
| Questions that work (anclar en lo concreto, una suposición corregible) | `sdd-grilling`, escena concreta y «Look it up before asking» |
| Offer recon | Descartada: `sdd-propose` lee el código y los documentos sin pedir permiso (pasos 1 y 2) |
| Think wide privately | Descartada: la forma de `sdd-grilling` enseña las alternativas con su coste |
| Show, don't tell: pantallas, páginas, disposición de una pantalla, opciones que se ven distintas | `sdd-grilling`, regla del boceto (Artifact o app real según `§Frontend`) |
| Show, don't tell: flujos, secuencias, diagramas, líneas de tiempo, horarios | Descartada como regla: el modo largo de `sdd-rubber-duck` explica un flujo paso a paso, y un diagrama se hace a petición; sin fallo que lo pida |
| «Be clear and concise… give the most important findings and offer the rest» | `sdd-grilling`: lo hallado va con su fuente en la pregunta; el resto, el estilo del kit (Art. III, lo que lee la persona es corto) |
| Spike to feel things out | Descartada: carril spike de `sdd-propose` y sondeo de `sdd-explore` |
| Play It Back | `spec-writing.md`, diseño por secciones, solo en features con 4 o más tasks previstas (forma de la 6.x, con evidencia en el ticket de la task 0003) |
| Play back: marcar las suposiciones | ✋ de `spec-template.md` |
| Play back: oferta del visual companion antes de un trozo visual | Descartada con el visual companion |
| Size the Work | Descartada: los cinco carriles de `sdd-propose` |
| Several independent projects → one at a time | Paso 2 de `sdd-propose`, partir |
| «If it grows mid-task, stop, say so, and step up a size» | `sdd-propose`, «el carril solo sube» (`routing`) |
| The Written Design: intent, goals, constraints, how decided, left to builder | `spec-template.md` (Intent, Scope, Approach, ✋, «Decisiones tomadas con el dev-lead») |
| Where it goes: `docs/superpowers/specs/` | Descartada: `.docs/sdd/specs/<carpeta>/spec.md` |
| Builder check y `builder-check-prompt.md` | Descartada: `review-spec.md` (0 de 6 lo despacharon en el 0167) |
| Builder check: tres montones (respondido, menor, del usuario) | ✋ (lo menor que decide el agente) y «Decisiones tomadas con el dev-lead» |
| HARD-GATE: nada se construye sin aprobar | Gate de la spec del paso 4 de `sdd-propose` |
| HARD-GATE: excepción de saltarse las preguntas | Descartada: el gate no se va (ver arriba) |
| HARD-GATE: tras aprobar, writing-plans | Paso 5 de `sdd-propose`, `plan-writing.md` |
| Red flag: «I'll offer options to save them effort» | Descartada: el kit pregunta con opciones y recomendada (decisión del dev-lead) |
| Red flag: «I'll fill in sensible defaults» → say them | ✋ |
| Red flag: «I should explain the process first» | `sdd-grilling`: termina en la pregunta |
| Red flag: «They said "sounds good"» | Paso 4 de `sdd-propose`: elegir un alcance no aprueba |
| Red flag: «The spike works, I'll keep building» | Descartada: el spike es un carril con su propia evidencia |
| Visual Companion y `visual-companion.md`, `scripts/` | Descartada: regla del boceto de `sdd-grilling` |

### `writing-plans`

| Pieza | Dónde vive ahora · o por qué se descarta |
| --- | --- |
| Overview: documentar lo que el implementador no puede decidir | `plan-writing.md` |
| Announce at start | Descartada: el aviso de fase de `sdd-propose` |
| Context: worktree de `using-git-worktrees` | Descartada aquí: la preparación de `sdd-implement` |
| Save plans to `docs/superpowers/plans/` | Descartada: `plan.md` en la carpeta de la spec |
| Scope Check | Paso 2 de `sdd-propose`, partir |
| File Structure | `plan-writing.md`; su forma, §1.1 de `plan-template.md` |
| Task Right-Sizing | `plan-writing.md`; las tasks verticales, en `plan-template.md` |
| Step Granularity | `plan-writing.md` |
| Plan Document Header (Goal, Architecture, Tech Stack, Spec) | `plan-template.md` |
| Global Constraints | `plan-template.md`, «Restricciones globales» |
| Review Focus | `plan-template.md`, «Review Focus» (medido allí) |
| Task Structure (Files, Interfaces, pasos) | `plan-template.md` |
| What a Step Contains | `plan-template.md`, Step 1 y el contraejemplo del patch 0082 |
| Self-Review: cobertura, pasos, tipos, Review Focus, proporción | `plan-writing.md`; la tabla de cobertura, §4 de `plan-template.md` |
| Execution Handoff | `plan-writing.md`, con el ajuste de la fila que sale de `overrides-superpowers.md`: la recomendación va a la línea `Ejecución` y solo `pair` para |
| Handoff: Subagent-driven → `subagent-driven-development`; Native → `executing-plans` | `sdd-implement` (0147) |
| Handoff: «When an execution method has already been supplied» | `plan-writing.md`: `execution: native` o `subagent` en `sdd-kit.json` o `sdd-kit.local.json` (Art. IV), o el método que el dev-lead ya nombró para la feature; no se pregunta |
| «Frequent commits» | `plan-writing.md`, con `commit-milestones.md`: se juntan al quedar limpia la revisión |
