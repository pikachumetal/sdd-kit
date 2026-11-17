---
id: 20260930-211302-feature-0118-field-validation-mode
feature: 0118
title: Validación en campo como modo del proyecto
mode: full
status: approved
created: 2026-09-30
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-30
---

# Spec — Validación en campo como modo del proyecto

> **Estado**: approved (por delegación).
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `control-profiles` — entra la validación en campo (`validation.mode: field`) y cambia «La validación puede diferirse con condiciones» (la validación tardía de una fila que ya salió en el corte)
- Modificadas: `feature-flow` — cambia «El trabajo se valida con el usuario antes de cerrar»

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (dos requisitos), contrato público (clave nueva en sdd-kit.json, que leen las skills de cierre) · tamaño: ~70 líneas en 12 ficheros
- Mínimo razonable: ninguna — deja sin mirar a otro par de ojos si algún otro lector de la 🧪 (sdd-end-release, sdd-roadmap) necesita saber que el proyecto va en campo
```

1. **La clave es `validation.mode`, con `manual` (el default, también sin clave) y `field`.** Va en el bloque `validation`, que ya existe en `sdd-kit.local.json` con `startEnvironment`. Es **solo de proyecto**, en `sdd-kit.json`: quién valida es una decisión del equipo, no de cada persona (Art. IV: la configuración personal no cambia la verificación). En `sdd-kit.local.json` se ignora con aviso, por el requisito vigente «Una clave no admitida en el fichero local se ignora con aviso». Ni una release ni una feature la cambian para sí.
2. **Con `field`, en los tres perfiles, nadie para en la validación.** El paso 7 de `sdd-start-feature`, el paso 0 de `sdd-end-feature` y el paso 0 de `sdd-end-patch` no preguntan ni ofrecen diferir. Registran `Validación en campo: <fecha> · <verificación del agente>`. La verificación del agente es la de hoy, sin rebajar nada: revisión final y re-revisión, smoke con una fila por THEN, verificación visual, suite y, en este repo, el RED/GREEN (decisión del 2026-09-28, issue #3: solo cambia quién valida y cuándo). Sin guion de pruebas, porque nadie va a seguirlo. Una decisión que la revisión final deja al usuario se sigue preguntando sola en su turno, como hoy.
3. **El roadmap marca ✅ directamente.** Una feature cerrada en campo no lleva 🧪, un patch no lleva el prefijo 🧪 y tampoco tiene fila en la tabla de la release, que solo reciben los diferidos. Si el uso real encuentra un fallo, llega como ticket de `sdd-feedback` y abre fila nueva, como ya pasó con la 0019, la 0074 y la 0077. `Test-Roadmap.ps1` no cambia: ✅ ya es un estado válido.
4. **Las plantillas ganan la tercera forma.** `walkthrough-template.md` (§ verificación) y `patch-template.md` (§4) admiten `Validación en campo: <fecha> · <verificación del agente>` junto a `Validado` y `Validación diferida`.
5. **La validación tardía de una fila ya cortada entra aquí** (fila de deuda «Validar una diferida después del corte…», que la 0123 dejó para esta feature). Es el mismo párrafo de `control-profiles.md` que ya se toca. Cuando el usuario valida algo diferido cuya fila ya salió en el corte de una release, el agente quita su id de la línea `validaciones pendientes:` de esa release y borra la línea si queda vacía. La adenda del walkthrough (o de `patch.md` §4) es la de hoy.
6. **Partida al arrancar** (dev-lead, 2026-09-30): la 0118 se queda con el modo en los cierres y con la activación en este repo. La **0127**, con fila propia tras la 0118, se lleva la pregunta de `sdd-config` (catálogo), las init y la migración. Hasta que llegue, la clave se escribe a mano en `sdd-kit.json`, y un proyecto que no la escribe sigue en `manual`, que es lo de hoy. Por eso esta feature no lleva migración.
7. **Este repo activa `field`.**
   - `.docs/sdd/sdd-kit.json` gana `"validation":{"mode":"field"}`. El commit cita la frase del dev-lead de la fila.
   - La regla 6 del `CLAUDE.md` se reescribe: la validación final de este repo es en campo. Con eso, en `delegate` quedan como paradas la spec, los desvíos y las decisiones que son del dev-lead.
   - Las 🧪 que quedan vivas (0115, 0123 y el patch 0126) pasan a ✅. Su walkthrough (o `patch.md` §4) gana una adenda fechada `Validación en campo`.
   - Las releases cerradas ya quedaron así con la migración de la 0115 («Validación: en campo»). La 0123 no tocó nada de esto.
8. **Esta misma feature sí para en su validación.** La clave entra en develop con el merge de esta feature, y su validación se presentó delegada («nos vemos en la validación»). La primera feature en campo es la siguiente.
9. **`sdd-end-release` y `sdd-roadmap` no cambian.** Leen las 🧪 para el smoke de la release y para el colapso. En campo no hay 🧪 nuevas, así que no leen nada distinto. Que el corte escriba «Validación: en campo» en la release cerrada no está pedido, y queda fuera.
10. **Campaña (Art. I), previsión de la feature entera.** Cada task que toca skills abre con su RED antes de editar y cierra con su GREEN. Se usan sujetos Sonnet headless sobre moldes sintéticos (proyecto `salas`, como en la 0115 y la 0123). Hay 5 escenarios: 2 sujetos por escenario y fase en `f1`, `f2` y `p1`, y 1 en `d1` y en los controles. En total, 7 en el RED y 9 en el GREEN, más 4 de reserva para una ronda de ajuste. Previsión: ~10 $ y ~90 min. Techo: 14 $ y 2 h. Si un escenario sale limpio en el RED, su guía no se escribe y se repite como control en el GREEN.
    - `f1`: una feature con la revisión final limpia y `validation.mode: field`, que llega al paso 7 de `sdd-start-feature` (decisión 2).
    - `f2`: «cierra la feature», con `field` y sin validación del usuario, en el paso 0 de `sdd-end-feature`, más el walkthrough y la fila del roadmap que escribe (decisiones 2, 3 y 4).
    - `p1`: «cierra el patch» con `field`, en el paso 0 de `sdd-end-patch`, más la fila de «Patches» y la de la release abierta (decisiones 2, 3 y 4).
    - `d1`: con `manual`, el dev-lead dice «probé la 0022, va bien» y la fila de la 0022 ya salió en el corte de la 1.3 (decisión 5).
    - Controles del GREEN, sin RED: `f2` y `p1` con `manual` (sin clave) siguen preguntando. Es la conducta que hoy cumplen los pasos que se tocan.
    - Sin escenario: `unattended` con `field`. Lo cubre la misma fila de la tabla de gates que `f1`, y `unattended` ya no para hoy. `validation.mode` en `sdd-kit.local.json` tampoco lleva escenario: lo cubre el requisito vigente del aviso, que no cambia.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, 2026-09-30 — «Apruebo la spec por delegación, nos vemos en la validación» (opción «Delegada» de la primera pregunta).
- Feature full, perfil `delegate` del proyecto, fila 0118 como enunciado, partida en 0118 + 0127, 2026-09-30 — opción «Partir (Recomendada)» de la misma pregunta.
- Validación en campo en este repo, 2026-09-29 — «probar el kit no se puede hacer, la única forma es en uso, por eso están los tickets de feedback… aquí en general la validación humana es en uso, con lo que este proyecto tiene solo validación tuya en test y smokes. No puede ser de otra forma, no es asumible en tiempo» (fila 0118 del roadmap).

## Intent

En este repo, las 66 filas 🧪 que había se cruzaron con los tickets de campo y ninguna se había validado a mano. Los fallos se supieron siempre por un ticket de `sdd-feedback`. El dev-lead no puede probar el kit fuera del uso real, así que la parada de validación de cada cierre, en este repo, es un turno que termina en 🧪 y nunca se salda. En una aplicación sí hay una pantalla que probar, así que el cambio no es del kit entero: es un modo que el proyecto declara. Con él, el agente cierra con su verificación y la registra como validación en campo, y el uso real hace de validación humana a través de los tickets.

## Scope

- Entra:
  - `skills/sdd-start-feature/references/control-profiles.md`: la fila «Validación» de la tabla de gates, la sección «Validación diferida» (su último párrafo, decisión 5), una sección «Validación en campo» y la fila de `validation.mode` en «Claves de sdd-kit.json».
  - `skills/sdd-start-feature/SKILL.md`: el paso 7 y la red flag de invocar `sdd-end-feature` sin validación.
  - `skills/sdd-end-feature/SKILL.md`: los pasos 0, 1 y 8.
  - `skills/sdd-end-patch/SKILL.md`: el paso 0 y la red flag de §4.
  - `skills/sdd-templates/templates/walkthrough-template.md` y `patch-template.md`.
  - `.docs/sdd/sdd-kit.json`, la regla 6 de `CLAUDE.md` y `.docs/sdd/roadmap.md`: la 0115, la 0123 y el patch 0126 pasan a ✅, la fila de deuda de la decisión 5 se cierra y entra la fila 0127.
  - Las adendas de los walkthroughs de la 0115 y la 0123 y de `patch.md` §4 del 0126.
  - La evidencia en `tests/` y en `red/` y `green/` de esta carpeta.
- Dónde se implementa cada `MODIFIED`:
  - «El trabajo se valida con el usuario antes de cerrar» vive en el paso 7 de `sdd-start-feature` y en el paso 0 de `sdd-end-feature`. El paso 0 de `sdd-end-patch` lo aplica al patch por la tabla de gates. Los tres están en el Scope.
  - «La validación puede diferirse con condiciones» vive en «Validación diferida» de `control-profiles.md`, que está en el Scope. `sdd-end-release` aplica la validación de las diferidas en el corte y no cambia (decisión 9).
- No entra:
  - La pregunta de `sdd-config`, las init y la migración (0127).
  - `sdd-end-release`, `sdd-roadmap` y `Test-Roadmap.ps1` (decisión 9).
  - La guía de uso de `.docs/workflow/`, que se relee en el cierre de la 2.3.0.

## Approach

Un modo nuevo en la tabla de gates, con su sección en `control-profiles.md`, igual que la validación diferida: la regla vive en un sitio y cada paso de cierre que para en la validación la nombra con su condición, porque un paso que resume una regla lleva las condiciones que deciden (architecture, «Anatomía de una skill»). El registro calca las formas de hoy: una tercera línea junto a `Validado` y `Validación diferida`, y ✅ en el roadmap. Cada edición de skill va con su RED y su GREEN, en su task.

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — Con `validation.mode: field`, la validación es en campo**
- GIVEN un proyecto con `"validation":{"mode":"field"}` en `.docs/sdd/sdd-kit.json` y la feature 0030 con la revisión final limpia, su smoke por THEN y la suite en verde, en cualquier perfil
- WHEN el agente llega a la validación (paso 7 de `sdd-start-feature`, paso 0 de `sdd-end-feature`), o cierra el patch 0031 (paso 0 de `sdd-end-patch`)
- THEN no pregunta qué ha probado el usuario ni ofrece diferir, y sigue con el cierre sin parar
- AND el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación en campo: <fecha> · <verificación del agente>`, con la evidencia que ejecutó (p. ej. `suite 412/412 en 96 s · smoke 5/5 THEN con ejecución real · revisión final Opus limpia sobre a1b2c3d`)
- AND la fila de la 0030 en el roadmap queda ✅, y la del patch 0031 en «Patches» no lleva el prefijo 🧪 ni tiene fila en la tabla de la release abierta
- AND sin la clave, o con `"mode":"manual"`, la validación es la de hoy: para en `pair` y `delegate` y se difiere al smoke de la release en `unattended`

**MODIFIED — La validación puede diferirse con condiciones** (antes: «cuando el usuario valida, … pasa la fila a ✅», sin caso para la fila que ya salió en el corte)
- GIVEN una feature o un patch verificados por el agente y un usuario que, presente y con el trabajo delante, dice que probará más tarde; o una feature o un patch en `unattended`; en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente cierra
- THEN el walkthrough registra `Validación diferida: <fecha> · «<frase literal>» · disparador: <feature, release o uso con dueño>` y el roadmap marca la fila `🧪 validación diferida a <disparador>`, no ✅; en un patch, la línea va en `patch.md` §4, debajo de la tabla, y la fila de la tabla de patches empieza por `🧪 validación diferida a <disparador> — `
- AND sin frase del usuario (salvo en `unattended`, cuyo disparador es el smoke de la release) no hay diferido: la feature o el patch siguen esperando la validación
- AND con la frase y sin disparador, o con uno vago («diferida», «se prueba en uso»), el agente no vuelve a preguntar: concreta el uso más próximo, con quien difiere como dueño (`disparador: la primera exportación del informe mensual, a cargo del dev-lead`), y lo dice en el mensaje de cierre para que lo corrija
- AND la pregunta de validación ofrece diferir con un disparador concreto con dueño que elige el agente («Diferir: lo pruebo en <uso más próximo>, a cargo de <quien valida>»); elegir esa opción, aunque sea sin texto, es la frase literal y el disparador, y el agente no vuelve a preguntar
- AND cuando el usuario valida, el agente añade una adenda fechada con **solo lo que él dice que probó** (en un patch, en `patch.md` §4) y pasa la fila a ✅ (en un patch, quita el prefijo 🧪)
- AND si la fila ya salió en el corte de una release (el dev-lead dice «probé la 0022, va bien» y `### v1.3.0 — 2026-10-05` tiene `validaciones pendientes: 0022, 0025`), el agente añade la misma adenda y quita el id de esa línea (`validaciones pendientes: 0025`); si queda vacía, borra la línea

### Capacidad: `feature-flow`

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: sin excepción; ahora, salvo en campo)
- GIVEN una feature con la implementación terminada y la revisión final limpia, en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-feature` presenta, empezando por «Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

## Enmiendas

### E1 — `validation.mode` entra en la regla del atajo autoconcedido (2026-10-01, aprobada por el dev-lead: «Apruebo E1 (Recomendada)»)

La revisión final (Important 3) encontró que `validation.mode: field` quita la parada de validación y no estaba en la regla «el agente nunca escribe, sin la frase literal del usuario, un `profile`, un `control.*` o un `merge` que quite una parada». En el RED, `p1-1` ya ofreció «Si con él querías validar en campo, dímelo y lo aplico». La pasada de fix lo añade en `control-profiles.md` (las dos enumeraciones). Cambia una regla de la capacidad `control-profiles` que el delta no tocaba:

**MODIFIED — regla de la capacidad `control-profiles`, «el agente nunca escribe sin la frase literal»** (antes: `profile`, `control.*` o `merge`)
- El agente nunca escribe, sin la frase literal del usuario, un `profile`, un `control.*`, un `merge` o un `validation.mode` que quite una parada.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-30 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
| dev-lead | Àngel Delgado | 2026-10-01 | enmienda E1 aprobada: «Apruebo E1 (Recomendada)» |
