---
id: 20260921-074701-task-0004-release-without-client
task: 0004
title: Carril release fuera de un contexto de cliente
mode: full
status: in-review
created: 2026-09-21
author: Claude (Opus 5) con el dev-lead
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Carril release fuera de un contexto de cliente

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor, lente dominio — señales: capacidad nueva (`release-flow`), contrato público y dato persistente (el campo `release.hasRecipient` de `sdd-kit.json`, que leen las dos skills del carril)
- Dominio: si las tres condiciones de «Merge y tag sin segunda ronda» se pueden comprobar sin interpretar al usuario, si queda algún camino para que un `vX.Y.Z` asumido pase el gate, y si el cambio de `true` a `false` a mitad de release deja algún paso sin dueño (señal: capacidad nueva)
- Técnica (descartada): si el campo nuevo convive con `version` e `ids` sin migración (señal: contrato + dato); lo cubre el requisito «Sin el campo, el carril se comporta como hoy»
- Mínimo razonable: sin review — deja sin mirar si «sin destinatario» abre una puerta a que el agente se conceda el atajo solo, justo el tipo de fallo que el gate existe para frenar
```

1. **Con o sin destinatario es configuración del proyecto y vive en `.docs/sdd/sdd-kit.json`**, junto a la versión y a `ids`: `"release": { "hasRecipient": true | false }` (cambio tras el comentario del dev-lead, 2026-09-21: LegalRep.pro tenía cliente, lo habitual es no tenerlo, y el kit tiene que ir bien en los dos casos). Es un booleano y no el nombre del destinatario, para que el nombre de un cliente no quede en un fichero de configuración. Si el campo falta, `sdd-start-release` lo pregunta una vez y lo escribe. `sdd-end-release` lo lee al cerrar. Descarto deducirlo de `client-changelog.md`, que es opt-in, y preguntarlo en cada cierre, que es la ronda que se quiere quitar.
2. **Cambiar de con a sin, o al revés, no es un problema.** Basta con editar el campo. Cada skill lee el valor vigente al ejecutarse y el cambio no necesita migración ni tocar releases pasadas. Una release abierta con un valor y cerrada con otro se cierra con el valor del cierre. **Sin el campo** (proyectos que no han abierto release desde la 1.2.0), `sdd-end-release` se comporta como hoy: el gate queda intacto y hay release notes.
2 bis. **«Destinatario»** es la persona o el grupo, distinto de quien hace la release, que la recibe: un cliente, el equipo que instala el kit, etc. El statusline (un desarrollador que usa su propia herramienta) no lo tiene. El sdd-kit sí: el equipo. En la implementación, el `sdd-kit.json` de este repo recibe `hasRecipient: true`. Que las init lo pregunten es de la task 0012 («carril release opcional que la init pregunta»).
3. **El Art. IV no se reescribe.** Dice que «el merge es SIEMPRE decisión del usuario», y lo sigue siendo. Cuando se cumplen las tres condiciones, la decisión ya está tomada: el usuario autorizó el cierre y escribió la versión. Lo que desaparece es la segunda pregunta. Si prefieres que el Art. IV lo diga de forma literal, es cambio mayor (spec dedicada) y queda fuera de esta task.
4. **Qué cuenta como «versión confirmada de forma explícita».** El usuario escribe o acepta la versión exacta **respondiendo a la propuesta del paso 1**. Que el encargo nombre la versión («cierra la v1.2.0») sigue sin contar, como dice hoy la tabla de racionalizaciones. Así la pregunta de versión se hace siempre, que es lo que frenó el `v0.1.0` asumido.
5. **«Comprometida» y «en preparación».** Comprometida = scope prometido a un destinatario, normalmente con fecha. En preparación = cualquier otro caso. Con `hasRecipient: false` el estado es «en preparación» y no se pregunta.
6. **Sin destinatario, sin release notes ni email.** Basta el changelog sellado, y el paso 8 («Comunicar») no aplica. Descarto escribir notas «para el usuario final» con secciones opcionales, porque sería una plantilla con dos modos para un caso sin lector. El red flag «`.docs/sdd/releases/vX.Y.Z/` no existe al terminar» pasa a exigirse solo si hay destinatario o acta.
7. **Definición del smoke.** Smoke de release = lo que se ejecuta sobre la rama integrada antes del cierre para comprobar que lo entregado funciona. Incluye la suite y un uso real (arrancar, instalar, invocar). Hallazgo = defecto en el comportamiento que entrega la release **detectado por el smoke**, se corrija o no dentro de la release. Lo encontrado dentro de una task antes de su cierre no cuenta: ya lo registró su walkthrough. La línea pasa a `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`.
8. **Capacidad nueva `release-flow`**, con solo los requisitos de este delta y sin volcado del resto del carril. El nombre va en inglés kebab-case, igual que `task-flow`.
9. **Cada punto entra solo si su RED falla (Art. I).** El ticket muestra que el agente de campo ya acertó sin guía en M2 (notas para quien instala, sin email) y en M3 (no creó un fichero de versión). Si el baseline acierta, ese punto se recorta y vuelvo a pedir aprobación del alcance.

## Intent

El carril release supone cliente, fecha y varias personas. En un proyecto de una sola persona, cuatro piezas no tienen sentido: pide una segunda confirmación de merge y tag sin información nueva, pregunta «comprometida o en preparación» (el dev-lead respondió «no te entiendo»), pide release notes y email sin nadie a quien enviarlos, y pide un bump de versión que no tiene fichero. Además, la línea de smoke no dice qué se cuenta, así que la métrica que defiende «release pequeña primero» no es comparable entre releases. Se quiere que el carril se adapte a si hay destinatario sin perder los gates que frenan errores reales.

## Scope

- Entra: el campo `release.hasRecipient` de `sdd-kit.json`: `sdd-start-release` lo pregunta si falta y lo escribe, y `sdd-end-release` lo lee. El valor de este repo. El gate de merge y tag acotado por tres condiciones comprobables (paso 7 + tabla de racionalizaciones). La definición de comprometida / en preparación. Release notes y email solo con destinatario (paso 5, paso 8, `notas-y-roadmap.md`, red flags). El bump sin fichero de versión (paso 7 / `versionado.md`). La definición de smoke y hallazgo (`notas-y-roadmap.md`). La capacidad `release-flow`.
- No entra: reescribir el Art. IV. Cambiar `release-notes-template.md` (con destinatario no cambia nada). Un paso de migración `v1.2.0` para el campo: si falta, el carril se comporta como hoy y la primera apertura lo pregunta, así que no hace falta. El carril release como módulo opcional de la init (task 0012).

## Approach

Guía condicionada a un predicado observable (Art. II): el campo `release.hasRecipient` de `sdd-kit.json`. Todo lo nuevo se activa solo con `false`. Con `true` o sin el campo, el carril queda como hoy. El gate acotado es guía de disciplina: condiciones enumeradas, red flag y racionalización para el caso en que falta una condición. Las definiciones (comprometida, smoke, hallazgo) son guía de forma: una línea cada una, donde se usan. Proceso: RED por punto con sujetos headless sobre un fixture de proyecto unipersonal, más un escenario de control con una condición ausente, porque el atajo no puede dispararse de más. Después, GREEN con los mismos escenarios.

## Delta de comportamiento

### Capacidad: `release-flow`

**ADDED — El proyecto declara si sus releases tienen destinatario**
- GIVEN un proyecto cuyo `.docs/sdd/sdd-kit.json` no tiene `release.hasRecipient`
- WHEN se abre una release con `sdd-start-release`
- THEN el agente pregunta una sola vez si la release se entrega a alguien distinto de quien la hace, y escribe la respuesta en `release.hasRecipient` sin tocar los demás campos
- AND con el campo ya presente no se pregunta

**ADDED — El valor vigente del campo es el que se aplica**
- GIVEN un proyecto que cambia `release.hasRecipient` de `true` a `false`, o al revés, aunque sea con una release abierta
- WHEN se ejecuta `sdd-start-release` o `sdd-end-release`
- THEN la skill aplica el valor que tiene el campo en ese momento, sin migración y sin reescribir releases pasadas

**ADDED — Sin destinatario no se pregunta si la release está comprometida**
- GIVEN `release.hasRecipient: false`
- WHEN `sdd-start-release` llega al estado de la release
- THEN el estado es «en preparación» y no se pregunta
- AND con `true`, la pregunta usa las definiciones: comprometida = scope prometido al destinatario, normalmente con fecha; en preparación = cualquier otro caso

**ADDED — Merge y tag sin segunda ronda cuando la decisión ya está tomada**
- GIVEN un cierre con `sdd-end-release` en el que se cumplen las tres condiciones: (a) el usuario ha autorizado el cierre en la conversación; (b) ha escrito o aceptado la versión exacta respondiendo a la propuesta del paso 1; (c) `sdd-kit.json` tiene `release.hasRecipient: false` y el paso 1 no ha movido ningún item desde esa autorización
- WHEN se llega al paso 7
- THEN el agente presenta el resumen de cierre citando las tres condiciones y ejecuta el merge y el tag en el mismo turno, sin pedir otra confirmación

**ADDED — Sin una de las tres condiciones, el gate de merge y tag se mantiene**
- GIVEN un cierre con `sdd-end-release` en el que falta cualquiera de las tres condiciones (la versión la ha supuesto el agente o solo venía en el encargo, `hasRecipient` es `true` o falta, o se movió scope)
- WHEN se llega al paso 7
- THEN el agente prepara el merge y el tag, los presenta y espera la confirmación explícita, como hasta ahora

**ADDED — Sin destinatario no hay release notes ni email**
- GIVEN `release.hasRecipient: false`
- WHEN se cierra una release
- THEN no se escriben `release-notes.md` ni el borrador de email, el paso «Comunicar» no aplica y el roadmap colapsado enlaza al changelog (y al acta si existe)

**ADDED — Sin fichero de versión, la versión vive en el tag y en el changelog**
- GIVEN un proyecto sin fichero de versión (`package.json`, `*.csproj`, `plugin.json`, etc.)
- WHEN se llega al bump del paso 7
- THEN no se crea ningún fichero para la versión: la registran el tag anotado y la cabecera del changelog sellado

**ADDED — La línea de smoke se cuenta igual en todas las releases**
- GIVEN el colapso de la sección de la release en el roadmap
- WHEN se escribe la línea de smoke
- THEN tiene la forma `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, donde N cuenta solo defectos del comportamiento entregado detectados por el smoke sobre la rama integrada
- AND si no se ejecutó smoke, la línea es `smoke: pendiente`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
