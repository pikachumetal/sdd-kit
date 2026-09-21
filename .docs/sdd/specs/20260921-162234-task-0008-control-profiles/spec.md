---
id: 20260921-162234-task-0008-control-profiles
task: 0008
title: Perfiles de control y gates
mode: full
status: approved
created: 2026-09-21
author: Claude (Opus 5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-21
---

# Spec — Perfiles de control y gates

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`control-profiles`), contrato público (claves nuevas de `sdd-kit.json` que leen 0005, 0006 y 0012), MODIFIED (requisitos de `task-flow`), datos o migración (paso nuevo en `migrations/v1.2.0.md`), reglas de visibilidad o permiso (qué no puede hacer el agente en cada perfil)
- Dominio: si la tabla de gates por perfil deja algún gate sin dueño (p. ej. el merge a main en `unattended`) y si «Qué no cubre la autonomía» cierra todo lo que el agente podría concederse a sí mismo, como escribir él el perfil que lo libera (señal: capacidad nueva + permiso)
- Técnica: si las claves de `sdd-kit.json` tienen default para cuando faltan, si la precedencia task > release > proyecto es inequívoca y si la migración solo pregunta lo que falta (señal: contrato público + migración)
- Mínimo razonable: solo dominio — deja sin mirar el contrato de `sdd-kit.json`, que es lo que 0005, 0006 y 0012 van a leer sin poder cambiarlo
```

Activada por el dev-lead: dos revisores (2026-09-21).

1. **Capacidad nueva `control-profiles`** con los perfiles, la tabla de gates, el desvío, la aprobación explícita y la validación diferida. En `task-flow` quedan el flujo y cuatro requisitos de gates que pasan a `MODIFIED`. `release-flow` y `migration` ganan un requisito cada una. Motivo: los perfiles también los leen el carril release (`unattended`) y las tasks 0005, 0006 y 0012.
2. **Validación diferida con símbolo propio** 🧪. *(Decidido contigo el 2026-09-21.)* La forma exacta es decisión mía. En el walkthrough: `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>`. En el roadmap: `🧪 validación diferida a <disparador>`. ✅ solo cuando dices qué probaste.
3. **El gate de desvío salta solo ante cambios a la spec aprobada**: un requisito, un THEN, el Scope o un «No entra». Salir del plan es un ruling que se registra y se presenta en «Me salí del plan en…», sin parar. Arbitra la contradicción con `subagent-driven-development`. *(Decidido contigo el 2026-09-21.)*
4. **La aprobación delegada se convierte en un cambio de perfil de la task.** «Ve tú solo hasta el smoke» dicho en `pair` pasa la task a `delegate`. Se escribe `profile:` en el frontmatter de la spec y una fila en «Aprobaciones» con la fecha y, en «Estado», `perfil → <perfil>: «<frase literal>»`. Así desaparece el concepto suelto de «aprobación delegada».
5. **Se reescribe el Art. IV de la constitution del kit**, que hoy dice «el merge es SIEMPRE decisión del usuario». Pasa a decir: el merge a `develop` sigue la política que el usuario declaró en `sdd-kit.json`, y el merge a `main` y el tag los decide siempre una persona. La ruta «sin segunda ronda» de `release-flow` sigue valiendo, porque ahí la decisión ya la tomó una persona. El Art. IV lo declara cambio mayor; esta spec es la «spec dedicada» que exige, y el plan revisa las skills afectadas.
6. **Claves nuevas en `sdd-kit.json`**, cada una con su default cuando falta: `control.profile` (`"delegate"`), `control.maxParallelAgents` (entero, 3), `control.silence.betweenStepsMinutes` (entero, 8), `control.silence.longCommandMinutes` (entero, 20) y `merge` (`into`: rama destino, cadena; `noFf`: booleano; `removeWorktree`: booleano). **`merge` no tiene default**: si falta el bloque o cualquiera de sus tres campos, el paso 10 pregunta como hoy. Una política que nadie declaró entera no se aplica. Esta task solo define las claves de paralelismo y del vigía; su conducta es de la 0005.
7. **Precedencia del perfil: task > release > proyecto.** La task lo declara en `profile:` de la spec; si lo omite, hereda. La release, con la línea `Perfil de control: <perfil>` justo bajo el encabezado de su sección del roadmap. El proyecto, en `control.profile`. **El agente nunca escribe, sin la frase literal del usuario, un valor de `profile`, `control.*` o `merge` que quite una parada**: sería concederse a sí mismo el atajo (hallazgo de la review de la 0004).
8. **`unattended` se define aquí solo a nivel de gates.** La spec la aprueba el agente con las decisiones registradas. Si una pregunta de la entrevista no tiene respuesta en los documentos, la task se aparca. La validación se aplaza al smoke de la release (🧪 con ese disparador); cuando el dev-lead valida ese smoke, `sdd-end-release` pasa a ✅ las tasks diferidas a él. Encadenar tasks e informe final: una línea en `sdd-start-task`. Los frenos (reintentos, vigía) son de la 0005.
9. **Review de spec: ninguna por defecto.** El agente la recomienda con 4 señales o más, o con contrato público + datos (hoy basta con 2). Si la recomienda, lo pregunta **antes** de presentar la spec, en una sola pregunta con su motivo. En `unattended` decide él y lo registra.
10. **La primera pregunta de la entrevista** confirma carril, modo (ofrece lite si se cumple el predicado) y el perfil vigente, **sola** y antes de cualquier pregunta de diseño. Si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, propone ese enunciado en la misma pregunta. El RED mostró que la oferta de lite se pierde cuando se mezcla con otra pregunta (1 de 2) y cuando el usuario contesta a otra cosa (2 de 2).
11. **«Aprobación explícita»** es responder «sí» o «apruebo» a la pregunta del gate, o elegir una opción cuyo texto diga que aprueba. Elegir un alcance o contestar otra pregunta no aprueba la spec.
12. **El walkthrough deja de ser «inmutable».** El cuerpo no se reescribe tras el cierre; lo posterior (validación tardía, integración con otra task) va en `## 6. Adendas`, con entradas fechadas. También cambia la entrada «Walkthrough» del glosario de `mission.md`. Gana además la sección «Decisiones tomadas sin el dev-lead»: los rulings de la ejecución, que `subagent-driven-development` ya lista en su informe final («Rulings I made»).
13. **Un commit del hilo principal durante la ejecución** entra en el alcance de la revisión de la task en curso; si ya no queda ninguna, en la revisión final de rama.
14. **Estados del roadmap, conjunto cerrado**: `⏳` pendiente · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`. «EN ESPERA» no es un estado del roadmap: es la task en curso esperando al usuario.
15. **A deuda con evidencia**: el frente «no se ofrece lite» (RED 2/2 lo ofrece; posible falso negativo, `red/README.md`). **Fuera por la visión**: los interruptores sueltos por gate.

### Hallazgos de la review

- **Aceptado** — (técnica, Crítico) el paso de migración no tiene escenario → requisito ADDED en `migration`.
- **Aceptado** — (técnica, Crítico) estados nuevos del roadmap sin conjunto cerrado ni sintaxis → decisión 14 y regla «Idioma de los nombres».
- **Aceptado** — (técnica) «la siguiente revisión» es ambigua → decisión 13 y THEN concreto.
- **Aceptado** — (técnica) la forma de la línea del walkthrough no estaba en las decisiones → decisión 2.
- **Aceptado** — (técnica) tipos de `merge` y bloque parcial → decisión 6: tipos fijados; un bloque incompleto no se aplica.
- **Aceptado** — (técnica) posición de `Perfil de control:` → decisión 7: justo bajo el encabezado de la release.
- **Aceptado** — (técnica) el Approach fijaba rutas y campos que son del plan → el Approach queda en el enfoque; los ficheros, al plan.
- **Aceptado** — (técnica) la tabla de Aprobaciones no tiene sitio para la frase → decisión 4: fila propia con la frase en «Estado».
- **Aceptado** — (técnica, Menor) regla de omisión de `profile:` → omitirlo hereda (decisión 7 y requisito).
- **Aceptado** — (dominio, Crítico) `sdd-end-release` cambia sin delta en `release-flow` → requisito ADDED en `release-flow`.
- **Aceptado** — (dominio, Crítico) el atajo concedido a sí mismo seguía abierto para `merge` y `control.*` → decisión 7 y regla ante conflicto ampliadas.
- **Aceptado** — (dominio, Crítico) «La review adversarial tensa la spec antes del gate» parte de «activado por el usuario» → `MODIFIED` en `task-flow`.
- **Aceptado** — (dominio) el glosario de `mission.md` llama inmutable al walkthrough → entra en el Scope (decisión 12).
- **Aceptado** — (dominio) la regla de merge a `main` parecía derogar la ruta sin segunda ronda de `release-flow` → cláusula en decisión 5 y en la regla ante conflicto.

## Intent

El kit para en cada gate igual para todo el mundo, y por eso se siente lento (issue GH #1, dev-lead). A la vez, no sabe qué hacer cuando el usuario delega, se ausenta o difiere la validación a sabiendas: cinco casos de campo acabaron con cinco redacciones improvisadas y ✅ que mezclan «verificado» con «validado». Esta task implementa la visión 1.2.0 (`mission.md`, «Cómo se trabaja con el kit»). El usuario elige cuánto para el agente con un perfil, y cada gate dice qué hace en cada perfil. Es el contrato que leen las tasks 0005, 0006 y 0012.

## Scope

- Entra: perfiles `pair` · `delegate` · `unattended` y su precedencia; tabla de gates por perfil; gate de desvío y `## Enmiendas`; aprobación explícita; primera pregunta de la entrevista (carril, modo, lite, perfil, enunciado desde la rama); review de spec ninguna por defecto; validación diferida (🧪, condiciones, adendas); estados cerrados del roadmap; «Me salí del plan en…» y «Decisiones tomadas sin el dev-lead»; todo fix del hilo pasa por revisión; paso 10 con política de merge; claves de control en `sdd-kit.json` y su paso en `migrations/v1.2.0.md`; Art. IV; glosario «Walkthrough» de `mission.md`; `sdd-end-release` para las 🧪 de su smoke.
- No entra: frenos del modo autónomo, tope de agentes y paralelismo (0005, solo lee las claves); verificación por task y parar procesos (0006); preguntas de la entrevista de las init (0012); carril patch (sus gates no cambian); cosecha del ledger al borrar el workspace y recuperación (0009); interruptores por gate sueltos.

## Approach

La tabla de gates por perfil vive en **un solo sitio** y cada gate de las skills de task la enlaza en lugar de copiarla: dos copias divergen en el primer cambio. Donde el kit sobreescribe un default de superpowers (los rulings de `subagent-driven-development`, las cuatro opciones de `finishing-a-development-branch`), el override se declara en la tabla de overrides, como el resto (Art. IX). Las plantillas dan forma fija a lo que hoy se improvisa: perfil de la task, enmiendas, validación diferida, adendas y decisiones sin el dev-lead. Cada comportamiento va con RED/GREEN (Art. I) y sujetos headless; lo que el RED no reproduzca se recorta y se vuelve a pedir aprobación.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — El perfil de control decide dónde para el agente**
- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una task
- THEN para en estos puntos y en ningún otro: `pair` en la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND en los tres perfiles se confirman siempre las acciones hacia fuera (push, PR, publicar), y el merge a `main` y el tag los decide una persona

**ADDED — El perfil se hereda de la task, de la release o del proyecto**
- GIVEN un perfil en el `profile:` de la spec, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap o `control.profile`
- WHEN el agente determina el perfil vigente
- THEN manda la task sobre la release, y la release sobre el proyecto; una spec sin `profile:` hereda
- AND el agente solo escribe un `profile`, un `control.*` o un `merge` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`)

**ADDED — La primera pregunta confirma carril, modo y perfil**
- GIVEN una task que arranca con usuario presente
- WHEN el agente termina de leer el contexto
- THEN su primera pregunta, sola en su turno, confirma carril y modo, ofrece lite citando el predicado si se cumple y dice el perfil vigente con la opción de cambiarlo para esta task
- AND si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, la pregunta propone esa fila como enunciado

**ADDED — Una respuesta cuenta como aprobación solo si aprueba**
- GIVEN un gate de aprobación (spec, plan en `pair`, enmienda)
- WHEN el usuario responde
- THEN cuenta como aprobación un «sí» o un «apruebo» a la pregunta del gate, o elegir una opción cuyo texto diga que aprueba
- AND elegir un alcance o responder a otra pregunta no aprueba: el agente pregunta la aprobación en una línea

**ADDED — Un cambio a la spec aprobada es un desvío**
- GIVEN una spec aprobada y una ejecución en curso
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope o un «No entra»
- THEN en `pair` y `delegate` el agente para, propone el cambio como entrada de `## Enmiendas` en la spec y espera la aprobación
- AND en `unattended` elige la opción más conservadora, la registra como enmienda sin aprobar y, si no hay opción que no bloquee, aparca la task (`⏸️ aparcada: <motivo>`)

**ADDED — Salir del plan es un ruling visible**
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal)
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso o, si no queda ninguna, de la revisión final de rama
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

**ADDED — La validación puede diferirse con condiciones**
- GIVEN una task verificada por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una task en `unattended`
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) o sin disparador con dueño no hay diferido: la task sigue esperando la validación
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** y pasa la fila a ✅

**ADDED — En `unattended`, lo que falta aparca la task**
- GIVEN una task en `unattended`
- WHEN una pregunta de la entrevista no tiene respuesta en los documentos del proyecto
- THEN la task queda `⏸️ aparcada: <pregunta>` en el roadmap y el agente sigue con la siguiente task de la release
- AND al terminar la release entrega un solo informe: tasks cerradas, decisiones, enmiendas sin aprobar y tasks aparcadas

**ADDED — El merge a develop sigue la política declarada**
- GIVEN una task validada (o diferida) y un bloque `merge` completo (`into`, `noFf`, `removeWorktree`) en `sdd-kit.json`
- WHEN el agente llega al paso de rama del cierre
- THEN en `delegate` y `unattended` aplica la política sin preguntar; en `pair` la presenta y espera
- AND con el bloque ausente o incompleto pregunta como hoy; nunca fusiona a `main` ni etiqueta

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge`); el perfil de la task, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap.
- **Idioma de los nombres**: claves JSON en inglés camelCase, como `ids.mode`; valores de perfil `pair`, `delegate`, `unattended`; estados del roadmap, conjunto cerrado: `⏳` · `🔄 en curso` · `⏸️ aparcada: <motivo>` · `🧪 validación diferida a <disparador>` · `✅`.
- **Límites**: `control.maxParallelAgents` 3 y `control.silence` 8 y 20 minutos por defecto; su conducta la define la 0005.
- **Avisos**: no aplica.
- **Regla ante conflicto**: la task manda sobre la release y la release sobre el proyecto; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera, y no deroga la ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow`, donde la decisión ya la tomó una persona.

### Capacidad: `task-flow`

**MODIFIED — La spec propone su propio nivel de review por complejidad** (antes: el nivel se proponía siempre en el gate y el usuario lo activaba)
- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra; en modo lite no se propone

**MODIFIED — La review adversarial tensa la spec antes del gate** (antes: «GIVEN un nivel de review activado por el usuario»)
- GIVEN un nivel de review activado por el usuario o, en `unattended`, decidido y registrado por el agente
- WHEN el agente despacha el revisor con la spec, la constitution, la mission y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación
- AND con dos revisores cada lente recibe puntos disjuntos y el encargo le prohíbe reportar lo que pertenece al punto de la otra
- AND con un revisor la lente única recibe todos los puntos

**MODIFIED — El plan presenta primero las decisiones tomadas sin el usuario**
- GIVEN un plan en modo full
- WHEN el agente lo termina
- THEN el primer bloque es «Decisiones que he tomado yo — valida estas», con modelo y effort por task, ejecución, decisiones técnicas fuera de la spec, riesgos altos y coste estimado
- AND en `pair` lo presenta en el gate; en `delegate` y `unattended` no hay gate: el agente comprueba que cada escenario de la spec tiene su task, lo anota en el plan y sigue
- AND el resto del plan es para el ejecutor

**MODIFIED — El trabajo se valida con el usuario antes de cerrar**
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, cómo probarlo y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND si el usuario no responde, la task queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones»; en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección

**ADDED — El walkthrough crece por adendas**
- GIVEN una task cerrada con walkthrough
- WHEN algo cambia después del cierre (validación tardía, integración con otra task)
- THEN se añade una entrada fechada en `## 6. Adendas` y el cuerpo no se reescribe

### Capacidad: `release-flow`

**ADDED — El smoke de la release valida las tasks diferidas a él**
- GIVEN una release con tasks `🧪 validación diferida a <esta release>`
- WHEN el dev-lead valida el smoke de la release en `sdd-end-release`, diciendo qué probó
- THEN cada una de esas tasks gana una adenda fechada en su walkthrough con lo que el dev-lead probó que le toca, y su fila pasa a ✅
- AND una task que el dev-lead no menciona sigue en 🧪, y el cierre la lista

### Capacidad: `migration`

**ADDED — La migración a v1.2.0 pregunta las claves de control que faltan**
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene `control.profile` o no tiene un bloque `merge` completo
- WHEN se aplica `migrations/v1.2.0.md`
- THEN un solo gate pregunta al dev-lead el perfil (recomendado `delegate`) y la política de merge a `develop`, y escribe solo lo que responde; lo que ya estaba no se pregunta
- AND sin dev-lead, el paso queda pendiente explícito: el proyecto funciona con `delegate` y con el paso 10 preguntando el merge, y el informe dice cómo reanudarlo

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-21 | aprobada: «Apruebo la spec» (opción del gate, tras la review de dos revisores) |
