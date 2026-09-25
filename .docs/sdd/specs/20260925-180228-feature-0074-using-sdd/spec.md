---
id: 20260925-180228-feature-0074-using-sdd
feature: 0074
title: Skill using-sdd, la puerta de entrada al kit
mode: full
status: approved
created: 2026-09-25
author: Claude (Opus 5.5, perfil delegate)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Skill using-sdd, la puerta de entrada al kit

## Capacidades

- Modificadas: `routing` — el hook inyecta la skill `using-sdd` en vez del router; tres puertas nuevas: preferencias → `sdd-config`, items asignados del gestor → `sdd-roadmap`, petición vaga → una pregunta antes de elegir puerta.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (un requisito de `routing`)
- Mínimo razonable: ninguna — el repaso de coherencia lo hago yo; deja sin mirar una segunda lectura de los THEN de las tres puertas nuevas, que el GREEN mide igualmente
```

1. **RED hecho antes de la spec** ([`tests/using-sdd-red.md`](../../../../tests/using-sdd-red.md)): 14 frases vagas en castellano, sin tu `CLAUDE.md` y con superpowers 6.4.1 cargado con su hook. **10 de 14 caen bien con el router actual.** Fallan tres, 2 de 2 cada una: «me paras mucho» (el agente lo guarda en su memoria y no pasa por `sdd-config`), «me han asignado en Azure el 412 y el 415» (encadena dos features sin pasar por el roadmap) y «hay que mejorar las reservas» (da por hecho que es una feature, sin preguntar qué es). La guidance nueva va solo a esas tres. El resto del router se traslada tal cual y el GREEN lo repite como control.
2. **Aislamiento de los sujetos** — añado `SUPERPOWERS_DIR` a `tests/headless/lib.sh`, con su test: el sujeto corre con `--setting-sources ""` y superpowers por `--plugin-dir`. Tu `CLAUDE.md` ya enruta al kit, y las campañas de enrutado anteriores lo heredaban: habrían medido tu configuración, no la de un dev que empieza el lunes.
3. **La skill es la única fuente**: `hooks/session-start` inyecta `skills/using-sdd/SKILL.md` entero, como hace superpowers con `using-superpowers`, y `hooks/router.md` desaparece. El hook sigue gateado por `.docs/sdd/`: el kit va a nivel de usuario, y avisar en todos los repos del dev sería invasivo. Sin `.docs/sdd/`, la puerta a las init la dan sus `description` (i1 ya cae bien así) y la de `using-sdd`.
4. **Nada se escribe en el proyecto consumidor, así que no hay migración.** La precedencia sobre superpowers viaja en la skill, que el hook inyecta en cada sesión. Copiarla al `CLAUDE.md` del proyecto sería una segunda fuente. El canal `npx skills add` recibe la `description` de `using-sdd` («Usar al empezar cualquier conversación…»), que es como gana `using-superpowers` en Codex.
5. **Sin números de tamaño** (va en paralelo con el patch 0078): «algo grande» es *varias funcionalidades, o una que el criterio de partir de `sdd-start-feature` partiría*, con remisión a ese paso, sin copiar su umbral.
6. **De las skills de entrada solo cambian dos `description`**, y ningún cuerpo: `sdd-config` añade «me paras mucho / quiero menos preguntas / cómo trabajas conmigo», y `sdd-roadmap` dice que los items del gestor entran por ella **aunque te los hayan asignado para hacerlos**. Hoy dice «sin hacerlo todavía», y r3 lo leyó al revés. El resto de `description` no se toca: sus frases ya caen bien.
7. **La batería se repite en cada release**: `red/subject.sh` es el guion, y `tech-stack.md` explica cómo lanzarlo contra el kit del corte. Pasarla a un paso de `sdd-end-release` sería editar el cuerpo de una skill de entrada, y queda fuera.
8. **Codex no se mide** (fila 0074): la fila de deuda del auto-enrutado en Codex se reescribe. Lo que queda es `.codex-plugin/plugin.json` con `"hooks": {}`, que ya no tendría dos routers porque la skill es la única fuente, y su RED en Codex.
9. **Campaña (Art. I)**: el GREEN repite las 14 frases con 2 sujetos cada una, 28 sujetos y ~4,5 $. Pasos que el agente ejecuta y su escenario: cuerpo de `using-sdd` → las 14 frases (s1, r3 y d1 como fallos; las otras 11 como control); `description` de `sdd-config` → s1; `description` de `sdd-roadmap` → r3 y r4, y r2 como control. **Previsión de toda la campaña: 50 sujetos y 18 $**, aprobada por ti. Gastado en el RED: 18 sujetos y 2,88 $.
10. **`r1` («módulo de informes… ponte con ello») cuenta en el RED como equivalente, no como fallo**: los dos sujetos entraron por `sdd-start-feature` y propusieron partir en tres filas. El GREEN espera `sdd-roadmap` como primera skill. Si vuelve a salir la entrada por `sdd-start-feature` con la partición, lo apunto como equivalente, no como regresión.
11. **Repaso de coherencia**: los literales de las frases coinciden con `red/subject.sh`. «Items del gestor» usa las mismas palabras en el delta y en la decisión 6.

### Decisiones tomadas con el dev-lead

- Previsión de la campaña: 50 sujetos Sonnet como máximo y techo de 18 $ — «Apruebo 50 sujetos / 18 $ (Recomendada)» (2026-09-25)
- Perfil `delegate` para esta feature, sin la primera pregunta de carril y modo — «Me dejo recomendar en lo de método: decide tú y cuéntamelo al final» (2026-09-25)

## Intent

Con la 2.0.0, el kit llega a equipos que no lo conocen y sin el `CLAUDE.md` del dev-lead. Lo que decide si SDD se acepta es que una frase normal caiga en la skill correcta. El kit tiene hoy un router de 150 palabras en `hooks/router.md`, que solo lee el hook. Cubre bien las puertas de la 0014, pero no conoce `sdd-config`, pierde los items asignados del gestor y adivina el tamaño de una petición vaga. Se quiere una skill `using-sdd` que sea la única fuente de las puertas, la lea el hook y cubra esos tres huecos.

## Scope

- Entra: skill nueva `skills/using-sdd/SKILL.md` (tabla de puertas, regla de duda, precedencia sobre superpowers); `hooks/session-start` inyecta esa skill; se retira `hooks/router.md`; `description` de `sdd-config` y `sdd-roadmap`; tests que nombran el router (`Hook`, `FeatureRename`, `PlanEntry`); `SUPERPOWERS_DIR` en el lanzador headless; README (catálogo y «Enrutado automático»); `CLAUDE.md` (14 skills) y `architecture.md` del repo; fila de deuda de Codex; cómo repetir la batería en `tech-stack.md`.
- No entra: escribir en el proyecto consumidor (ni `CLAUDE.md` ni migración); `.codex-plugin/` y la medida en Codex; cualquier número de tamaño; los cuerpos de las skills de entrada; el hook en proyectos sin `.docs/sdd/`.

## Approach

`using-sdd` hace para el kit lo que `using-superpowers` hace para superpowers. Su `description` dice que se usa al empezar cualquier conversación en un proyecto con `.docs/sdd/`, y el hook de sesión inyecta su texto. El cuerpo es corto, porque se carga en todas las sesiones. Lleva la precedencia (las puertas son las del kit; `brainstorming`, `writing-plans` y `executing-plans` van dentro de ellas), la tabla de puertas con los nombres definitivos, la regla de duda y la edición trivial directa. Cada regla de `hooks/router.md` se traslada:

| Regla de `hooks/router.md` | Dónde vive ahora |
| --- | --- |
| Es instrucción del proyecto y prevalece sobre `brainstorming` primero | `using-sdd`, sección de precedencia |
| Trabajo (con sus frases) → `sdd-start-feature` antes que `brainstorming` | `using-sdd`, tabla de puertas |
| Planificar sin hacerlo todavía → `sdd-roadmap` | `using-sdd`, tabla de puertas (más los items asignados) |
| Bug pequeño y determinista → `sdd-start-patch` | `using-sdd`, tabla de puertas |
| Pregunta, duda o «¿se puede…?» → `sdd-consult` | `using-sdd`, tabla de puertas |
| Edición sin comportamiento → directa | `using-sdd`, tabla de puertas |

## Delta de comportamiento

### Capacidad: `routing`

**MODIFIED — El router solo existe donde hay SDD** (antes: «inyecta el router, que nombra `sdd-start-feature`, `sdd-start-patch` y `sdd-consult`»)

- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el texto de la skill `using-sdd`, que es la única fuente de las puertas del kit y nombra `sdd-start-feature`, `sdd-start-patch`, `sdd-consult`, `sdd-roadmap`, `sdd-end-release`, `sdd-config`, `sdd-init-greenfield` y `sdd-init-brownfield`

**ADDED — Una preferencia de cómo trabajar entra por `sdd-config`**

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «No me gusta que me pares tanto, quiero trabajar con menos preguntas.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-config`
- AND el agente no guarda la preferencia en su memoria

**ADDED — Los items asignados del gestor entran por `sdd-roadmap`**

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Me han asignado en Azure el 412 (exportar reservas a .ics) y el 415 (máximo 2 reservas por persona).»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`, no `sdd-kit:sdd-start-feature`

**ADDED — Algo grande entra por `sdd-roadmap`**

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario pide varias funcionalidades a la vez: «El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Ponte con ello.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`

**ADDED — Una petición vaga se pregunta antes de elegir puerta**

- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Hay que mejorar las reservas, que se quejan los usuarios.»
- THEN el agente no invoca `sdd-start-feature`, `sdd-start-patch` ni `sdd-roadmap` antes de preguntar
- AND hace una sola pregunta sobre qué es y cuánto abarca, con su recomendación primero
- AND no crea rama ni carpeta

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada: «Apruebo (Recomendada)» |
