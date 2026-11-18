---
kit_version: 3.0.2
lane: feature
id: 20261118-235653-feature-0356-delegate-interview-asks
task: 0356
mode: full
date: 2026-11-19
---

# Ticket para el kit — feature 0356: en delegate, la entrevista pregunta lo que falta y es del dev-lead

## Contexto

- Carril y modo: feature full; perfil `pair` hasta el plan y `delegate` desde ahí
- Skills del kit usadas: `sdd-propose`, `sdd-grilling`, `sdd-implement`, `sdd-implement-native`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit (skills en Markdown y una CLI en TypeScript), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (revisores de spec, eje Código, sujetos) y Opus 5.5 (eje Spec, re-revisión)
- Coste en reloj: 1,42 h de esfuerzo (2,40 h de reloj) frente a 2 h estimadas
- Coste en tokens: 69,5 M del hilo y 4,3 M de subagentes, 24,67 $; sujetos 20,86 $ en 49

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La pregunta de diseño de la entrevista abrumó al dev-lead dos veces

- **Qué pasó**: la nota de entendimiento llegó con tres hallazgos sobre el texto del kit y la primera pregunta en la forma de `sdd-grilling` (❓, tres alternativas con su coste y ➡️), con términos como «freno Observable output». El dev-lead contestó «no te entiendo nada…» y, dos turnos después, con otra pregunta de tres opciones, «me abrumas con texto cuando creo que es sencillísimo». La regla que buscaba ya la había dicho en una frase.
- **Fuente**: `.docs/sdd/changes/20261118-214723-feature-0356-delegate-interview-asks/walkthrough.md` §5, línea `Retro: corrección repetida`; las respuestas del dev-lead, en «Decisiones tomadas con el dev-lead» de la `spec.md` de esa carpeta.
- **Dónde en el kit**: `skills/sdd-grilling/SKILL.md`, «Shape of a question» (la forma de la pregunta de diseño); `skills/sdd-propose/SKILL.md` paso 4 (la nota de entendimiento abre la entrevista).
- **Por qué el kit no lo evitó**: la forma fija de la pregunta de diseño no distingue entre una decisión con alternativas reales y una regla que el usuario ya puede decir en una frase; y nada pide devolverle primero su propia regla en sus palabras.
- **Coste**: unas seis vueltas de entrevista hasta fijar la regla; esperas al dev-lead de 6, 6 y 10 min en la medida de `sdd session tokens` (sin respaldo para atribuirlas todas a esto).
- **Propuesta**: en `sdd-grilling`, antes de la forma ❓, si el usuario ya ha dicho la regla, devuélvela en sus palabras y pregunta solo si es así; las alternativas, solo cuando lo que falta es elegir entre caminos con coste distinto.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una entrevista en la que el usuario contesta con su regla en una frase («si lo sabes no preguntes; si solo yo puedo decidirlo, pregúntamelo») WHEN el agente sigue THEN su mensaje la repite en sus palabras y pregunta si es así, sin una lista de alternativas ni términos del kit sin explicar.

### 2. Descarté sin preguntar un matiz que la sesión de otra feature traía de parte del dev-lead

- **Qué pasó**: la sesión de la 0357 mandó, «de parte del dev-lead», tres matices de OpenSpec para la regla de esta feature. Adopté uno a medias y descarté dos como ruling, y lo contesté a esa sesión sin decírselo al dev-lead. El dev-lead lo pidió explicar: «¿por qué lo descartas…? la 0357 te lo dice de MI PARTE». Al final no cambió el fondo (era un matiz), pero costó tres turnos de vuelta atrás.
- **Fuente**: decisión 4 de la `spec.md` de la carpeta de la 0356 («Lo propuso el dev-lead a través de la sesión de la 0357»).
- **Dónde en el kit**: no localizado: `skills/sdd-grilling/SKILL.md` «Answers» trata las respuestas del usuario, y ninguna regla trata una petición del dev-lead que llega por otra sesión.
- **Por qué el kit no lo evitó**: lo que trae otra sesión se leyó como opinión de un par, adjudicable, y no como una petición del dev-lead.
- **Coste**: tres turnos de entrevista y una corrección de lo dicho a la otra sesión (sin respaldo de minutos).
- **Propuesta**: una línea en «Answers» de `sdd-grilling`: lo que llega de otra sesión de parte del dev-lead es suyo; descartarlo es una pregunta al dev-lead, no un ruling.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una entrevista abierta y un mensaje de otra sesión «de parte del dev-lead» con tres propuestas WHEN el agente decide no adoptar alguna THEN se lo pregunta al dev-lead antes de contestar a la otra sesión.

### 3. La pasada de fix parafraseó una regla y perdió su contraejemplo, aunque la ADR 0035 lo prohíbe

- **Qué pasó**: al mover los anti-goals al montón del dev-lead, reescribí la frase y quité «as territory, not a script». La re-revisión lo marcó como Important nuevo contra la ADR 0035 («una regla de territorio que baja a un llamante va literal, con su contraejemplo»). Hizo falta un commit más fuera de toda revisión.
- **Fuente**: `tasks.md` de la carpeta de la 0356, línea `Re-revisión:`; `.docs/sdd/decisions/0035-interviewer-core-and-caller-territory.md`, Consecuencias.
- **Dónde en el kit**: `skills/sdd-verify/references/closing-the-review.md` (la pasada de fix en Native) y la Confirmación de la ADR 0035, que no está en ningún paso de una skill.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué; vive en una ADR que la pasada de fix no lee.
- **Coste**: una ronda de arreglo tras la re-revisión y un commit «sin revisar» en el cierre.
- **Propuesta**: en la pasada de fix de un texto que copia o adapta una fuente (`upstream.json`), antes de commitear, `git diff -U0` de las líneas quitadas y comprobar que cada frase quitada sale entera o se sustituye; o mover la Confirmación de la ADR 0035 a una comprobación de `kit:own`.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una pasada de fix que reescribe una frase de `spec-writing.md` y quita «as territory, not a script» WHEN el hilo va a commitear THEN el paso o la comprobación lo señala antes del commit.

## Lo que hice por iniciativa propia

- Coordiné con la sesión de la 0357 qué hace la entrevista con la sección «Abierto» que esa feature crea, para que su prompt no escriba «pregúntaselo». Funcionó, salvo el hallazgo 2.
- La petición de un escenario de batería admite `<br>` como salto de línea (`subject.mjs` y `battery.mjs`), para medir un prompt de arranque de varias líneas. Funcionó.

## Funcionó, no tocar

- La parada del plan cuando el RED sale limpio (decisión 7 del plan): el dev-lead redirigió la feature a lo que sí fallaba en vez de escribir guía para un fallo que no se reproducía.
- Las dos rondas de review de spec y los dos ejes de la revisión final encontraron conflictos reales (un THEN que su fila de rúbrica ya no fijaba, frases de la guía que se contradecían) a un coste bajo.

## Menores

- La fila «Suma» de «Previsión de coste» con texto junto al número dejó la campaña sin techo, y el lanzador solo dijo «define SUBJECT_CAP (previsión de la spec)» — `skills/sdd-templates/templates/spec-template.md` («Previsión de coste») y `tests/headless/campaign.mjs`.
- Edité `THIRD_PARTY_NOTICES.md` a mano; el pre-commit lo paró (`notices.test.ts`) y el cambio fue a `upstream.json` — funcionó.
- Cambié a mano un THEN del delta ya fusionado en `capabilities/`; lo deshice y lo volví a fusionar con `sdd capability merge` — `skills/sdd-archive/SKILL.md` paso 3 ya lo prohíbe.
- El fallo de campo de la 0355 («en `delegate` no pregunta nada») no se reprodujo ni con una petición corta (3/3) ni con un prompt de arranque largo (2/2); queda como posible falso negativo de sesión larga — `.docs/sdd/steering/operations.md` ya lo advierte (task 0003).
