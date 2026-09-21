---
id: 20260921-162234-task-0008-control-profiles
task: 0008
title: Perfiles de control y gates
mode: full
status: draft
created: 2026-09-21
author: Claude (Opus 5) con el dev-lead
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Perfiles de control y gates

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`control-profiles`), contrato público (claves nuevas de `sdd-kit.json` que leen 0005, 0006 y 0012), MODIFIED (tres requisitos de `task-flow`), datos o migración (paso nuevo en `migrations/v1.2.0.md`), reglas de visibilidad o permiso (qué no puede hacer el agente en cada perfil)
- Dominio: si la tabla de gates por perfil deja algún gate sin dueño (p. ej. el merge a main en `unattended`) y si «Qué no cubre la autonomía» cierra todo lo que el agente podría concederse a sí mismo, como escribir él el perfil que lo libera (señal: capacidad nueva + permiso)
- Técnica: si las claves de `sdd-kit.json` tienen default para cuando faltan, si la precedencia task > release > proyecto es inequívoca y si la migración solo pregunta lo que falta (señal: contrato público + migración)
- Mínimo razonable: solo dominio — deja sin mirar el contrato de `sdd-kit.json`, que es lo que 0005, 0006 y 0012 van a leer sin poder cambiarlo
```

1. **Capacidad nueva `control-profiles`** con los perfiles, la tabla de gates, el desvío, la aprobación explícita y la validación diferida. `task-flow` conserva el flujo, y sus tres requisitos de gates pasan a `MODIFIED`. Motivo: los perfiles también los leen el carril release (`unattended`) y las tasks 0005, 0006 y 0012.
2. **Validación diferida con símbolo propio** 🧪 en el roadmap: «verificada, validación diferida a `<disparador>`». ✅ solo cuando el dev-lead dice qué probó. *(Decidido contigo el 2026-09-21.)*
3. **El gate de desvío salta solo ante cambios a la spec aprobada**: un requisito, un THEN, el Scope o un «No entra». Salir del plan es un ruling que se registra y se presenta en «Me salí del plan en…», sin parar. Esto arbitra la contradicción con `subagent-driven-development`. *(Decidido contigo el 2026-09-21.)*
4. **La aprobación delegada se convierte en un cambio de perfil de la task.** «Ve tú solo hasta el smoke» dicho en `pair` pasa la task a `delegate`: se escribe `profile:` en el frontmatter de la spec y la frase literal con su fecha en «Aprobaciones». Así desaparece el concepto suelto de «aprobación delegada»: `delegate` ya es el caso de FR-0009 §5.
5. **Se reescribe el Art. IV de la constitution del kit.** Hoy dice «el merge es SIEMPRE decisión del usuario». Pasa a decir: el merge a `develop` sigue la política que el usuario declaró en `sdd-kit.json`, y el merge a `main` y el tag los decide siempre una persona. El Art. IV declara esto cambio mayor; esta spec es la «spec dedicada» que exige, y el plan revisa las skills afectadas.
6. **Claves nuevas en `sdd-kit.json`**, cada una con su default cuando falta: `control.profile` (`delegate`), `control.maxParallelAgents` (3), `control.silence.betweenStepsMinutes` (8), `control.silence.longCommandMinutes` (20) y `merge` (`into`, `noFf`, `removeWorktree`). **Sin `merge`, el paso 10 pregunta como hoy.** Una política que nadie declaró no se aplica. Esta task solo define las claves de paralelismo y del vigía; su conducta es de la 0005.
7. **Precedencia del perfil: task > release > proyecto.** La task lo declara en `profile:` de la spec. La release, con una línea `Perfil de control: <perfil>` en su sección del roadmap. El proyecto, en `control.profile`. **El agente nunca escribe un perfil más permisivo que el vigente sin la frase del usuario**: eso sería concederse a sí mismo el atajo (hallazgo de la review de la 0004).
8. **`unattended` se define aquí solo a nivel de gates.** La spec la aprueba el agente con las decisiones registradas. Si una pregunta de la entrevista no tiene respuesta en los documentos, la task se aparca como bloqueada. La validación se aplaza al smoke de la release (🧪 con ese disparador), y `sdd-end-release` pasa a ✅ las tasks cuyo disparador era su smoke. Encadenar tasks e informe final: una línea en `sdd-start-task`. Los frenos (reintentos, vigía) son de la 0005.
9. **Review de spec: ninguna por defecto.** El agente la recomienda con 4 señales o más, o con contrato público + datos (hoy basta con 2). Si la recomienda, lo pregunta **antes** de presentar la spec, en una sola pregunta con su motivo. En `unattended` decide él y lo registra.
10. **La primera pregunta de la entrevista** confirma carril, modo (ofrece lite si se cumple el predicado) y el perfil vigente, **sola** y antes de cualquier pregunta de diseño. Si la rama es `feature/<id>` y `<id>` tiene fila pendiente en el roadmap, propone ese enunciado en la misma pregunta. El RED mostró que la oferta de lite se pierde cuando se mezcla con otra pregunta (1 de 2) y cuando el usuario contesta a otra cosa (2 de 2).
11. **«Aprobación explícita»** es responder «sí» o «apruebo» a la pregunta del gate, o elegir una opción cuyo texto diga que aprueba. Elegir un alcance o contestar otra pregunta no aprueba la spec.
12. **El walkthrough deja de ser «inmutable».** El cuerpo no se reescribe tras el cierre; lo posterior (validación tardía, integración con otra task) va en `## 6. Adendas`, con entradas fechadas. Gana además la sección «Decisiones tomadas sin el dev-lead»: los rulings de la ejecución, que `subagent-driven-development` ya lista en su informe final como «Rulings I made».
13. **Fuera, a deuda con evidencia**: el frente «no se ofrece lite» (RED 2/2 lo ofrece; posible falso negativo, `red/README.md`) y los interruptores sueltos por gate (fuera por la visión).

## Intent

El kit para en cada gate igual para todo el mundo, y por eso se siente lento (issue GH #1, dev-lead). A la vez, no sabe qué hacer cuando el usuario delega, se ausenta o difiere la validación a sabiendas: cinco casos de campo acabaron con cinco redacciones improvisadas y ✅ que mezclan «verificado» con «validado». Esta task implementa la visión 1.2.0 (`mission.md`, «Cómo se trabaja con el kit»). El usuario elige cuánto para el agente con un perfil, y cada gate dice qué hace en cada perfil. Es el contrato que leen las tasks 0005, 0006 y 0012.

## Scope

- Entra: perfiles `pair` · `delegate` · `unattended` y su precedencia; tabla de gates por perfil; gate de desvío y `## Enmiendas`; aprobación explícita; primera pregunta de la entrevista (carril, modo, lite, perfil, enunciado desde la rama); review de spec ninguna por defecto; validación diferida (🧪, condiciones, adendas); «Me salí del plan en…» y «Decisiones tomadas sin el dev-lead»; todo fix del hilo pasa por revisión; paso 10 con política de merge; claves de control en `sdd-kit.json` y su paso en `migrations/v1.2.0.md`; Art. IV; una línea en `sdd-end-release` para las 🧪 de su smoke.
- No entra: frenos del modo autónomo, tope de agentes y paralelismo (0005, solo lee las claves); verificación por task y parar procesos (0006); preguntas de la entrevista de las init (0012); carril patch (sus gates no cambian); cosecha del ledger al borrar el workspace y recuperación (0009); interruptores por gate sueltos.

## Approach

Una referencia nueva de `sdd-start-task`, `references/control-profiles.md`, con la tabla de gates por perfil como **fuente única**. Cada paso con gate de `sdd-start-task` y `sdd-end-task` dice «según el perfil» y enlaza la tabla, sin copiarla. `overrides-superpowers.md` gana dos filas: los rulings de `subagent-driven-development` frente al gate de desvío, y `finishing-a-development-branch` frente a la política de merge. Plantillas: `spec-template` (`profile:`, «Enmiendas», decisiones tomadas con el dev-lead), `walkthrough-template` (diferida, adendas, decisiones sin el dev-lead). Todo va con RED/GREEN por comportamiento (Art. I), con sujetos headless.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — El perfil de control decide dónde para el agente**
- GIVEN un proyecto con `control.profile` en `sdd-kit.json`, o sin él (default `delegate`)
- WHEN el agente recorre una task
- THEN para en estos puntos y en ningún otro: `pair` en la spec, el plan, tras cada task, los desvíos, la validación y antes del merge; `delegate` en la spec, los desvíos y la validación; `unattended` en ninguno hasta terminar la release
- AND en los tres perfiles se confirman siempre las acciones hacia fuera (push, PR, publicar), y el merge a `main` y el tag los decide una persona

**ADDED — El perfil se hereda de la task, de la release o del proyecto**
- GIVEN un perfil en el `profile:` de la spec, una línea `Perfil de control:` en la sección de la release del roadmap o `control.profile`
- WHEN el agente determina el perfil vigente
- THEN manda la task sobre la release, y la release sobre el proyecto
- AND el agente solo escribe un perfil más permisivo que el vigente si el usuario lo pidió, con su frase literal y la fecha en «Aprobaciones»

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
- AND en `unattended` elige la opción más conservadora, la registra como enmienda sin aprobar y, si no hay opción que no bloquee, aparca la task como bloqueada

**ADDED — Salir del plan es un ruling visible**
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal)
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la siguiente revisión
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

**ADDED — La validación puede diferirse con condiciones**
- GIVEN una task verificada por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una task en `unattended`
- WHEN el agente cierra
- THEN el walkthrough registra «Validación diferida: `<fecha>` · «`<frase literal>`» · disparador: `<task, release o uso con dueño>`», y el roadmap marca la task 🧪 con ese disparador, no ✅
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) o sin disparador con dueño no hay diferido: la task queda EN ESPERA
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** y pasa la fila a ✅; `sdd-end-release` lo hace con las 🧪 cuyo disparador es su smoke

**ADDED — En `unattended`, lo que falta aparca la task**
- GIVEN una task en `unattended`
- WHEN una pregunta de la entrevista no tiene respuesta en los documentos del proyecto
- THEN la task se aparca como bloqueada con la pregunta escrita, y el agente sigue con la siguiente task de la release
- AND al terminar la release entrega un solo informe: tasks cerradas, decisiones, enmiendas sin aprobar y tasks aparcadas

**ADDED — El merge a develop sigue la política declarada**
- GIVEN una task validada (o diferida) y un bloque `merge` en `sdd-kit.json`
- WHEN el agente llega al paso de rama del cierre
- THEN en `delegate` y `unattended` aplica la política sin preguntar (destino, `--no-ff`, borrado del worktree); en `pair` la presenta y espera
- AND sin bloque `merge` pregunta como hoy; nunca fusiona a `main` ni etiqueta

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge`); el perfil de la task, en el frontmatter de su spec; el de la release, en su sección del roadmap.
- **Idioma de los nombres**: claves JSON en inglés camelCase; valores de perfil `pair`, `delegate`, `unattended`.
- **Límites**: `control.maxParallelAgents` 3 y `control.silence` 8 y 20 minutos por defecto; su conducta la define la 0005.
- **Avisos**: no aplica.
- **Regla ante conflicto**: la task manda sobre la release y la release sobre el proyecto; ninguna regla del perfil cubre el merge a `main`, el tag ni las acciones hacia fuera.

### Capacidad: `task-flow`

**MODIFIED — La spec propone su propio nivel de review por complejidad** (antes: el nivel propuesto se presentaba siempre y el usuario lo activaba en el gate)
- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN por defecto no hay review; con 4 señales o más, o contrato público + datos, el agente la recomienda **antes** de presentar la spec, en una sola pregunta con el nivel, las señales, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra; en modo lite no se propone

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

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
