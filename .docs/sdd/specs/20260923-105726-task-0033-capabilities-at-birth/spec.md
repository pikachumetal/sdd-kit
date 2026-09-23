---
id: 20260923-105726-task-0033-capabilities-at-birth
task: 0033
parent: 0019
title: Capacidades al nacer
mode: full
status: approved
created: 2026-09-23
author: Claude (Opus 5.5) con Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — Capacidades al nacer

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (la estructura de `.docs/sdd/` que reciben los proyectos gana `sources/` y pierde las carpetas vacías; la línea de historial `init`), MODIFIED («Brownfield no vuelca `capabilities/`» cubre ahora la petición del usuario)
- Dominio: si «a petición del usuario» deja pasar un volcado que el agente sugiere y el usuario solo acepta (señal: MODIFIED)
- Técnica: si la línea `init` del historial rompe algo que parsea el historial (señal: contrato público)
- Mínimo razonable: ninguna — deja sin segunda mirada las dos preguntas de arriba, que el repaso de coherencia ha comprobado: nada del kit parsea el historial (solo `capability-template.md` lo describe), y el THEN del volcado exige que la petición salga del usuario
```

1. **RED previo: 7 sujetos, 3,73 $, los tres frentes fallan** (`red/README.md`).
   - Carpetas: 3/3 greenfield completos dejan `capabilities/` y `specs/` vacías, que git no ve.
   - Volcado en greenfield, 2/2: `v1` volcó sin pedir partición ni nombres (cuatro ficheros con nombres de módulo —`timer`, `config`, `notify`, `history`—, sin historial, escritos antes de enseñar nada); `v2` se negó porque el kit lo prohíbe. El control de brownfield se negó (`b1`), que es la conducta que se mantiene.
   - Funcional, 3/3: el original se queda en la raíz sin enlace desde `.docs/sdd/`, y los docs llevan un resumen en «Reglas de producto» y mission que pierde reglas (la ventana del monitor, 3/3; la publicación de los jueves, 1/3).
2. **`specs/` sigue la misma regla que `capabilities/`: ninguna init la crea vacía.** Fuera de la fila, pero es el mismo defecto en las mismas dos líneas de `estructura.md` y `generacion.md`, y el RED lo muestra 3/3. `sdd-start-task` ya crea la carpeta de la task con su primer fichero. Si prefieres dejarlo fuera, va a deuda.
3. **El volcado vive en `sdd-init-greenfield`, en el paso 6 (cierre)**, con sus condiciones en el `SKILL.md` y no en `references/`, porque decide. El agente no lo ofrece: solo responde a una petición del usuario.
4. **Partición y nombres se aprueban antes de escribir ningún fichero**: el agente lee el código entero, propone la lista de capacidades (slug inglés kebab-case y sustantivo del dominio, regla 1 de la plantilla: `v1` usó `notify`, un verbo copiado del nombre del módulo) y espera el «sí». Después presenta cada capacidad con el mismo gate que los documentos de anclaje. Si no puede leer el código entero en la sesión, lo dice y no vuelca.
5. **Historial del volcado**: una línea por capacidad, `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`. Una línea por requisito repetiría el listado que está justo encima. `sdd-end-task` sigue escribiendo `task <id>` en las fusiones posteriores.
6. **La regla 4 de `capability-template.md` pasa a «Las init no vuelcan»**, con la excepción de greenfield enlazada, y el bloque de ayuda del historial muestra la línea `init`.
7. **El funcional aportado se guarda literal en `.docs/sdd/sources/`, con su nombre original.** Es un documento del cliente, como los tickets de campo: renombrarlo rompe la traza con el correo en que llegó. Si llega pegado en el chat, se guarda como `sources/<yyyyMMdd>-functional-brief.md`. No se edita nunca; `mission.md` lo enlaza en una línea y cada fila de módulo del roadmap que sale de él cita la sección (`sources/<fichero> §<n>`). No se vuelca a `capabilities/`: describe lo que se quiere construir, no lo construido.
8. **Sin migración.** Los proyectos existentes conservan su `capabilities/` y su `specs/`; `sources/` es opcional y no hay nada que mover. El Art. V pide migración cuando la release cambia o retira algo del proyecto consumidor, y aquí solo cambia lo que crea una init nueva. `MigrationInitParity.Tests.ps1` no se ve afectado: ninguna migración escribe estas carpetas.
9. **Brownfield no gana `sources/`**: la fila habla del funcional de un greenfield, y en brownfield el funcional histórico ya tiene su vía (`capabilities/legacy.md` de la migración v1.0.0).
10. **Entra el Minor de la 0019**: el paso 5 de `generacion.md` se parte en viñetas, porque esta task reescribe su frase de `capabilities/`. La deuda del roadmap lo asignaba a «la 0033 o la 0034».
11. **Sin capacidad nueva**: el delta toca `capabilities` y `onboarding`, las dos existentes.

### Decisiones tomadas con el dev-lead

- Task full, perfil `delegate`, enunciado = fila 0033 del roadmap. — «Sí, full + delegate (Recommended)»
- Ninguna init crea `capabilities/`; nace con la primera task que declara una capacidad o con el volcado de excepción. — «No se crea (Recommended)»
- «Codebase pequeño» = revisable, sin umbral numérico: lectura entera, partición y nombres aprobados, gate por capacidad. — «Revisable, sin umbral (Recommended)»
- El funcional aportado vive literal en `.docs/sdd/sources/`. — «Literal en sources/ (Recommended)»
- Techo de gasto de las campañas headless: 20 $ entre el RED previo y el GREEN. — «Techo 20 $ (Recommended)»

## Intent

Las dos init se contradicen con `capabilities/`: greenfield la crea vacía, brownfield no, y git no versiona una carpeta vacía, así que un agente improvisa un `.gitkeep`. El volcado inicial que el dev-lead decidió como excepción de greenfield (2026-09-20) no está escrito: el kit lo prohíbe y, cuando un usuario lo pide, el agente o se niega o vuelca sin pedir partición ni nombres y sin historial. Y el funcional que un cliente entrega en un greenfield se usa en la entrevista y se pierde: el detalle no queda en `.docs/sdd/`.

## Scope

- Entra: criterio único de `capabilities/` y `specs/` en las dos init (no se crean vacías); volcado inicial como excepción de greenfield con sus condiciones y su línea de historial; regla 4 y ayuda del historial de `capability-template.md`; `sources/` para el funcional aportado en greenfield, enlazado desde mission y roadmap; paso 5 de `generacion.md` en viñetas; RED/GREEN de cada frente.
- No entra: volcado en brownfield (se sigue negando); `sources/` en brownfield; que `sdd-start-task` lea `sources/` por su cuenta (la fila del roadmap ya lo cita); campo `Cobertura` por requisito (acta v1.1.0, ítem 7); migración; la 0034 (proceso de la init: `CLAUDE.md` en el gate, init en curso, canal).

## Approach

Texto de skills y plantilla, con la evidencia RED/GREEN en `tests/`. La regla de carpetas va al árbol de `estructura.md` y al paso 5 de `generacion.md`; el volcado, al paso 6 de `sdd-init-greenfield/SKILL.md` con una red flag; el funcional, a la entrevista (paso 1) y al árbol de greenfield; la línea `init`, a la plantilla de capacidad. Un test estructural fija las frases que deciden, como en las tasks anteriores de las init.

## Delta de comportamiento

### Capacidad: `capabilities`

**MODIFIED — Brownfield no vuelca `capabilities/`** (antes: sin la petición del usuario)
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`, aunque el usuario pida generar las capacidades desde el código
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera task que toque una capacidad
- AND si el usuario lo pidió, el agente explica que en brownfield las capacidades crecen task a task

**ADDED — Ninguna init crea `capabilities/` vacía**
- GIVEN un `sdd-init-greenfield` o un `sdd-init-brownfield` sin petición de volcado
- WHEN crea la estructura de `.docs/sdd/`
- THEN no existe `capabilities/` ni `specs/` al terminar, ni ningún `.gitkeep` en `.docs/sdd/`
- AND `capabilities/` aparece con la primera task que declara una capacidad, y `specs/` con la primera task o patch

**ADDED — El volcado inicial es una excepción de greenfield**
- GIVEN un `sdd-init-greenfield` sobre un proyecto con código, en el que el usuario pide generar las capacidades desde el código
- WHEN el agente atiende la petición
- THEN antes de escribir ningún fichero propone la partición (slugs en inglés kebab-case, sustantivos del dominio) y espera la aprobación
- AND presenta cada capacidad para su aprobación, como los documentos de anclaje
- AND cada capacidad lleva en «Historial» la línea `- <YYYY-MM-DD> — init — ADDED volcado inicial desde el código`
- AND si no puede leer el código entero en la sesión, lo dice y no vuelca
- AND el agente no propone el volcado si el usuario no lo pide

### Capacidad: `onboarding`

**ADDED — El funcional aportado se guarda literal**
- GIVEN un `sdd-init-greenfield` en el que el usuario aporta un funcional (un documento, o texto pegado en el chat)
- WHEN la init crea la estructura
- THEN el funcional está en `.docs/sdd/sources/` sin editar: con su nombre original si es un fichero, o como `<yyyyMMdd>-functional-brief.md` si llegó pegado
- AND `mission.md` lo enlaza, y cada fila de módulo del roadmap que sale de él cita su sección
- AND ninguna capacidad nace de él

**Reglas de la capacidad**
- **Dónde viven los datos**: el funcional aportado, en `.docs/sdd/sources/`, literal y sin editar.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada: «si» |
