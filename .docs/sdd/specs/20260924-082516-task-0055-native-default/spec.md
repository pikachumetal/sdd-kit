---
id: 20260924-082516-task-0055-native-default
task: 0055
title: Native por defecto, SDD para tasks grandes — el método lo elige el handoff del plan
mode: full
status: approved
created: 2026-09-24
author: Claude (Opus 5.5), dev-lead Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-24
---

# Spec — Native por defecto, SDD para tasks grandes: el método lo elige el handoff del plan

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (clave `execution` en `sdd-kit.json`), MODIFIED/REMOVED (control-profiles, onboarding, migration), tres capacidades, dato persistente con migración
- Dominio: si el REMOVED y los dos ADDED de control-profiles conservan lo que protegía el requisito anterior, y si «Apruebo, con <método>» encaja con la regla de aprobación (señal: MODIFIED/REMOVED)
- Técnica: si la pregunta 5 encaja con las init y con los pasos 2 y 5 de la migración v1.2.0, y si el estado intermedio de la decisión 10 rompe el paso 6 (señal: contrato público + migración)
- Mínimo razonable: solo técnica — deja sin mirar si la nueva parada del plan en `pair` pierde algo de lo que protegía la regla vieja
```

Activada por el dev-lead: «Dos revisores (Recomendada)», 2026-09-24. Despacho: `sdd-kit:effort-medium` + `sonnet`, uno por lente, con el reparto de puntos de `review-spec.md`.

### Hallazgos de la review

Dominio:
- **Aceptado** — las reglas de `control-profiles` no dicen qué pasa si `execution` choca con el handoff, ni el resto de reglas → «Regla ante conflicto» ampliada (el valor fijado manda) y «Límites» y «Avisos» marcados «sin cambio».
- **Aceptado** — el bloque de reglas cambia la verdad viva sin etiqueta → `MODIFIED — Reglas de la capacidad`, con lo que cambia.
- **Aceptado** — `execution` no dice si tiene nivel de task o de release → decisión 6 y «Regla ante conflicto»: solo nivel de proyecto; un método que nombra el dev-lead para una task cuenta como dado.
- **Aceptado** — el texto del Art. IV solo estaba esbozado en una decisión → texto literal en el Approach.
- **Aceptado** — `mission.md` describe la ejecución como SDD → la frase entra en Scope, con su texto nuevo en el Approach.
- **Aceptado** — la decisión 9 se podía leer como un predicado propio del kit → dice que el criterio es el del handoff.

Técnica:
- **Aceptado** — el techo del revisor final (Opus, effort high) cambiaba el Art. IV sin escenario → sale de esta task y pasa a la 0057, que adapta la revisión final en Native (decisión 9 y fila 0057).
- **Aceptado** — quitar el campo `Ejecución` por task no tenía escenario → AND en «El método de ejecución lo elige el handoff del plan».
- **Rechazado** — añadir la plantilla de `sdd-kit.json` al Scope → no existe esa plantilla en `sdd-templates`: el esquema vive en la tabla de claves de `control-profiles.md`, que ya entra.
- **Rechazado** — escenario para superpowers < 6.4.1 → la versión validada que declara el README es la 6.4.1 (Art. V), y el manifest resuelve superpowers; las anteriores no tienen el handoff con Native.
- **Aceptado** — «use the preserved method» sin fuente → la decisión 3 cita la fila W1 de la lectura.
- **Aceptado** — precedencia entre el valor fijado y la recomendación → AND en «Un método fijado en `sdd-kit.json` no se pregunta».
- **Aceptado** — la pregunta 5 sin texto literal → texto y motivo literales en la decisión 6.

1. **Lectura de superpowers 6.4.1 antes de la spec** (pedida por el dev-lead). La tabla completa, con 35 filas y veredicto A, S, A+ o «?», está en [`red/lectura-superpowers-641.md`](red/lectura-superpowers-641.md). Es el esqueleto de esta spec y de la nueva `overrides-superpowers.md`. Esta task se queda con las filas del **método y sus paradas**: W1, W2, W4, W5, W6, W7, B1, B3, S1, S4, E8, R1, R2 y R3. Las filas de **cómo se ejecuta en Native** van a la 0057: E1 a E7 (con el techo del modelo del revisor final de E5), E9, E10, E12 a E15, T1, S2, S3, S5 y C1. Las del modelo de la sesión, a la 0058: E11.
2. **El método vale para el plan entero** y va en su cabecera: `Ejecución: <native | subagent>, porque <motivo del plan>`. Desaparece el campo `Ejecución` por task («en línea» dentro de un plan SDD). Motivo: superpowers no mezcla métodos dentro de un plan. El único cambio que admite es el de ejecutor a mitad del plan, con el ledger compartido, y eso es de la 0057.
3. **`auto` delega en la recomendación del handoff** y el kit no añade un predicado propio (decisión del dev-lead). Con `native` o `subagent` en `sdd-kit.json`, el kit trata el método como «ya dado» en el sentido del handoff (fila W1 de la lectura: «If they have already explicitly supplied an execution method … use the preserved method»): no se pregunta en ningún perfil.
4. **En `pair`, el método va dentro de la parada del plan**: una sola pregunta con tres opciones: «Apruebo, con <recomendado>», «Apruebo, con <el otro>» y «Cambios». Las dos primeras cuentan como aprobación porque su texto dice que aprueba (regla vigente de la aprobación).
5. **Choque explícito con «You review the saved plan before anything runs»** (W2): se mantiene la tabla de gates del kit. En `delegate` y `unattended` el plan no para. Lo que protege W2 (aprobar un alcance no es aprobar un plan que no existe) lo cubren el gate de la spec y la comprobación escenario → task. La fila nueva de overrides lo dice con esas palabras.
6. **Clave `execution` en la raíz de `sdd-kit.json`** (`auto | native | subagent`, default `auto`). Va en la raíz y no dentro de `control`, porque no decide dónde para el agente sino cómo ejecuta. La pregunta se añade como **pregunta 5** a la tabla única de `control-profiles.md`: las dos init y la migración v1.2.0 la heredan sin copiarla (Art. V). Texto: «¿Cómo se ejecutan los planes: `auto` (cada plan recomienda su método), `native` (siempre en la sesión) o `subagent` (siempre con subagentes)?». Recomendada `auto`, con este motivo: «el handoff de `writing-plans` pesa cada plan: Native es lo más barato, y los subagentes quedan para los planes largos o cuando se quiere revisión por task». Escribe `execution`; «no sé» no escribe nada y rige `auto`. **Sin nivel de task ni de release**, a diferencia del perfil: el método ya queda escrito en el plan de cada task. Si el dev-lead nombra un método para una task concreta, cuenta como método «ya dado».
7. **Sin guía para comprobar el tipo de agente** (ticket 0053 §1): en el RED, 2 de 2 sujetos sin los agentes `sdd-kit:effort-*` lo dijeron antes del primer despacho, despacharon `general-purpose` con el `model` del plan y lo sacaron como ruling. Sin fallo no hay guía (Art. I). Queda en el roadmap como posible falso negativo: el ticket salió en una sesión larga, con la 0031 fusionada a mitad de la task.
8. **Aviso del hook `SessionStart`** (la otra mitad del ticket 0053 §1): nombra «las skills y los agentes `sdd-kit:*`». Es tooling de este repo, no del kit que reciben los proyectos. Se prueba con Pester, no con sujetos, y no entra en ninguna capacidad.
9. **Art. IV**: el modo de ejecución pasa a elegirlo el handoff de `writing-plans` (`execution: auto`), con el texto exacto del Approach. El criterio entre Native y SDD es el del handoff de superpowers, **no un predicado nuevo del kit**. La política de modelos de los subagentes no cambia. El techo del modelo del revisor final en Native (Opus con effort high frente al «most capable» de superpowers) pasa a la 0057, que adapta la revisión final. El modelo de la sesión en Native es de la 0058.
10. **Estado intermedio consciente**: entre esta task y la 0057, una task Native corre `executing-plans` tal cual, y el paso 6 solo describe SDD. Es aceptable porque la 2.0.0 no se corta hasta cerrar las tres. La primera línea del paso 6 ya enruta por el método del plan.
11. **Campaña del Art. I**, común a 0055, 0057 y 0058 y declarada antes del primer sujeto: **unos 50 sujetos, ~50 $ y ~8 h; techo 65 $** (dev-lead, 2026-09-24). El lanzador común [`red/run.sh`](red/run.sh) suma el coste de las tres carpetas y para con el fichero `stop` o al llegar al techo. Esta task: RED previo con 2 sujetos (1,39 $); GREEN previsto con 9 sujetos, unos 5 $: handoff en `delegate` ×2, en `pair` ×2, método fijado ×2, init greenfield ×1, init brownfield ×1 y migración ×1.
12. **No entra la sección «Review Focus»** (W3): no la pide la fila, y quién escribe sus tests (el hilo, como los RED, o el propio plan) necesita su propio RED. Sigue en la fila 0054 del roadmap.

### Decisiones tomadas con el dev-lead

- Partir la 0055 en tres: 0055 (a), 0057 (b) y 0058 (c), en serie — «Partir en tres (Recomendada)», 2026-09-24.
- Parar en la spec — «Para en la spec (Recomendada)», 2026-09-24.
- Review de spec con dos revisores — «Dos revisores (Recomendada)», 2026-09-24.
- Previsión y techo comunes a las tres tasks — «~50 $, techo 65 $ (Recomendada)», 2026-09-24.
- Native por defecto y SDD para tasks grandes; el método lo elige el handoff; en `pair` dentro del gate del plan y en `delegate`/`unattended` el agente toma la recomendación y la escribe; clave `execution: auto | native | subagent` con `auto` por defecto — decisiones del enunciado de la task, 2026-09-24, que no se vuelven a preguntar.

## Evidencia del RED previo

Detalle en [`tests/native-default-red.md`](../../../../tests/native-default-red.md).

| Conducta nueva | Resultado con el kit de `develop` |
| --- | --- |
| En `delegate` y con `auto`, el plan lleva `Ejecución: <método>, porque <motivo>` y no para | **Falla 2/2** (0026 `g-h-1` y `g-h-2`: ningún método en el plan). Sin el override vigente, 1 de 2 paró a preguntar el método (0006 `g-e1-1`) |
| En `pair`, una sola pregunta aprueba el plan y elige el método | **Falla**, por texto: el kit dice «sin preguntar el método» |
| Con `native` o `subagent` fijado, el método no se pregunta | **Falla**, por texto: la clave no existe |
| Las init y la migración preguntan `execution` | **Falla**, por texto: la tabla de preguntas tiene 4 |
| El aviso del hook nombra los agentes | **Falla**, por texto |
| Antes del primer despacho se dice que falta el tipo `sdd-kit:effort-<nivel>` | **Pasa 2/2** (`e1-1`, `e1-2`): sin guía |

## Intent

superpowers 6.4.1 reconstruyó `executing-plans` como ejecución Native: una sesión, TDD por paso, ledger y una sola revisión final de rama en el modelo más capaz. Es el método más barato. El handoff de `writing-plans` ya recomienda un método con un motivo sacado del plan. Hoy el kit suprime ese handoff e impone `subagent-driven-development`, que cuesta entre 290k y 815k tokens de subagentes por task y deja al usuario sin ver trabajar al agente. Se quiere que el método lo elija el handoff, que las paradas sigan la tabla de gates del kit y que el proyecto pueda fijarlo en `sdd-kit.json`.

## Scope

- Entra:
  - Art. IV;
  - filas de `overrides-superpowers.md` para el handoff, el HARD-GATE, SDD como excepción y las paradas de Native;
  - fila «Plan» de la tabla de gates;
  - cabecera `Ejecución` de `plan-template.md`;
  - primera línea de los pasos 5 y 6 de `sdd-start-task`;
  - clave `execution` y su pregunta 5, y con ellas las init y la migración v1.2.0;
  - aviso del hook `SessionStart`;
  - el párrafo de `mission.md` que describe la ejecución en `delegate`;
  - evidencia RED y GREEN.
- No entra:
  - cómo se ejecuta una task Native en el kit (RED apartados, override de «suite defines green», orden de cierre con `task-done`, cambio de método a mitad, paso 9 de `sdd-end-task`, `commit-milestones.md`): es la 0057;
  - el A/B y el modelo de la sesión: es la 0058;
  - la sección «Review Focus»;
  - una guía para comprobar el tipo `sdd-kit:effort-<nivel>` antes del primer despacho: el RED no muestra el fallo.

## Approach

El kit deja de fijar el método y adopta la recomendación del handoff de `writing-plans` (Art. IX.1). Solo sobrescribe dónde se para y qué cuenta como método «ya dado» (Art. IX.2). Todo cambio va a los ficheros que ya son la fuente única de cada cosa:
- el método y su parada, a la fila «Plan» de la tabla de gates y a `overrides-superpowers.md`;
- la clave, a la tabla de claves y preguntas de `control-profiles.md`, de donde la toman las init y la migración;
- el aviso, al hook del repo.

**Texto nuevo del Art. IV**, que sustituye al inicio de su segundo párrafo, hasta «y la **política de modelos**»:

> También son convención del kit el **modo de ejecución**, que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json`, el default. Las opciones son Native (`executing-plans`), la más barata, o `subagent-driven-development`, que superpowers recomienda cuando se quiere revisión por task o cuando el plan es tan largo que sus últimas tasks correrían con el contexto compactado. Con `execution: native` o `subagent`, el proyecto lo fija. Y es convención del kit la **política de modelos** de los subagentes, …

El resto del párrafo queda igual. Como es un cambio de convención del Art. IV, el plan lleva la revisión de las skills afectadas.

**Texto nuevo de `mission.md`** («Flujo por defecto», la frase de la ejecución):

> Desde la aprobación el agente trabaja solo: planifica sin gate del plan (comprueba que cada escenario de la spec tiene su task y escribe el método que recomienda el plan) y ejecuta en la propia sesión (Native) o, en los planes largos, con subagentes: un máximo de tres en paralelo, cada uno en su worktree y solo en tasks que el plan clasifica como independientes.

## Delta de comportamiento

### Capacidad: `control-profiles`

**REMOVED — El plan no pregunta el método de ejecución**
- motivo: el kit deja de fijar el método; lo sustituyen «El método de ejecución lo elige el handoff del plan» y «Un método fijado en `sdd-kit.json` no se pregunta».

**ADDED — El método de ejecución lo elige el handoff del plan**
- GIVEN una task en modo full con la spec aprobada, superpowers ≥ 6.4.1 y `execution` ausente o `auto` en `sdd-kit.json`
- WHEN el agente guarda el plan
- THEN en `delegate` y `unattended` no para: toma el método que recomienda el handoff de `writing-plans` y lo escribe en la cabecera del plan como `Ejecución: <native | subagent>, porque <motivo sacado del plan>`
- AND en `pair` la parada del plan es una sola pregunta que aprueba el plan y elige el método, con la recomendación del handoff como primera opción; no hay una parada aparte para el método
- AND ninguna task del plan lleva un campo `Ejecución` propio: el método es del plan entero

**ADDED — Un método fijado en `sdd-kit.json` no se pregunta**
- GIVEN una task en modo full con la spec aprobada y `execution: native` o `execution: subagent` en `sdd-kit.json`
- WHEN el agente guarda el plan
- THEN escribe en la cabecera `Ejecución: <valor>, fijado en sdd-kit.json` y no pregunta el método en ningún perfil
- AND el valor fijado manda aunque el handoff recomiende el otro método
- AND en `pair` la parada del plan solo pide aprobarlo

**MODIFIED — Reglas de la capacidad** (Dónde viven los datos, Idioma de los nombres y Regla ante conflicto; antes: sin `execution`)
- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge` con `merge.push` opcional, y `execution`); el perfil de la task, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap; el método de un plan, en la línea `Ejecución:` de su cabecera.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como `ids.mode`; valores de perfil `pair`, `delegate`, `unattended`; valores de `execution`: `auto`, `native`, `subagent`; estados del roadmap, conjunto cerrado: `⏳` · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`.
- **Límites**: sin cambio.
- **Avisos**: sin cambio.
- **Regla ante conflicto**: la task manda sobre la release y la release sobre el proyecto; `execution` no sigue esa herencia: solo tiene nivel de proyecto (`sdd-kit.json`), un valor fijado ahí manda sobre la recomendación del handoff y un método que el dev-lead nombra para una task cuenta como método dado; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera distintas del push de la rama de integración que autoriza `merge.push`, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona. Un merge o un push que el entorno o el remoto deniegan no se reintenta: lo desbloquea una persona.

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las claves de control** (antes: cuatro preguntas; se añade la del método de ejecución)
- GIVEN una init greenfield o brownfield con el usuario presente
- WHEN la entrevista llega a las claves de control
- THEN el agente hace, en turnos distintos, las preguntas del bloque de `control-profiles.md`, cada una con su opción recomendada y su motivo: perfil (`delegate`), política de merge (rama de integración, `--no-ff`, el worktree lo borra una persona), push de la rama de integración tras el merge («sí» con git-flow), frenos (3 agentes; 8 y 20 minutos) y método de ejecución (`auto`)
- AND escribe en `sdd-kit.json` solo lo que el usuario responde: «no sé» no escribe la clave y rige su default, y un «no» a la política de merge deja `merge` sin declarar
- AND si la rama de integración es la estable, la pregunta de merge no se hace y `merge` queda sin declarar; sin `merge` declarado, la de push tampoco se hace
- AND la pregunta de push recomienda «sí» solo si la convención de ramas es git-flow; con otra convención se hace sin opción recomendada
- AND en brownfield sin usuario, las cinco quedan pendientes explícitas en el resumen de cierre y el proyecto funciona con los defaults

### Capacidad: `migration`

**MODIFIED — La migración a v1.2.0 pregunta las claves de control que faltan** (antes: sin `execution`)
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile`, un bloque `merge` completo, `merge.push` con el bloque `merge` completo, las claves de frenos (`control.maxParallelAgents`, `control.silence.*`) o `execution`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el agente hace, una por turno, las preguntas del bloque de `control-profiles.md` que corresponden a lo que falta, las mismas que hace la init y con la misma recomendación, y escribe solo lo que responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con los defaults (`execution: auto` incluido), con el paso 10 del cierre preguntando el merge y sin push, y el informe dice cómo reanudarlo

### Tooling del repo (sin capacidad)

**Aviso de sesión fuera del script**
- GIVEN una sesión de este repo que no salió de `Start-KitSession.ps1`
- WHEN corre el hook `SessionStart` (`.claude/hooks/Test-KitSessionSource.ps1`)
- THEN el aviso dice que ni las skills ni los agentes `sdd-kit:*` salen de la rama

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-24 | aprobada: «si» |
