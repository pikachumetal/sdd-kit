---
id: 20261101-151300-feature-0151-agent-writing
feature: 0151
proposal: 0131
title: sdd-agent-writing, una skill para escribir para agentes
mode: full
profile: delegate
status: approved
created: 2026-11-01
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-01
---

# Spec — `sdd-agent-writing`

🦆 Cuando alguien pida «quiero una skill para las migraciones SQL», el kit tendrá una puerta propia para escribirla y probarla, en lugar de tratarla como un cambio cualquiera. Quien edite una skill encontrará en un solo sitio cómo escribirla y cómo probarla, sin depender de dos skills externas que hoy nadie carga. Una previsión de campaña de 3 escenarios dejará de salir en 4,50 $ sin margen, y el paso a otra skill dirá que es lo primero del paso. Las reglas que el RED no vio fallar no entran como guía nueva y siguen en la deuda.

Validación: agente — son texto de skills y su batería; el uso real llega por los tickets (`validation.mode: field`).

## Capacidades

- Nuevas: `agent-writing` — cómo escribe y prueba el kit lo que lee un agente.
- Modificadas: `routing` — se añade la puerta «quiero una skill».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva · tamaño: ~8.500 palabras de fork en 3 ficheros y ~30 líneas en otros 9
- Mínimo razonable: ninguna — deja sin mirar por un tercero el reparto de la tabla de procedencia, que la revisión final vuelve a leer.

1. **La skill es un fork de tres ficheros**: `SKILL.md` (de `writing-for-agents`), `references/skill-mechanics.md` (`SKILL-MECHANICS.md` y la parte de forma de `writing-skills`) y `references/skill-testing.md` (la parte de prueba de `writing-skills`, `testing-skills-with-subagents.md` y `persuasion-principles.md`), en inglés (Art. III), con tabla de procedencia en la batería (ADR 0013).
2. **Fuera del fork, con su motivo**: `anthropic-best-practices.md` (5.803 palabras de documentación oficial: un puntero externo vale), `render-graphs.js`, `graphviz-conventions.dot` y `examples/` (herramientas del repo de origen, que el kit no usa).
3. **La tensión entre las dos fuentes se resuelve por la ADR 0013**: se conserva el texto de `writing-skills`, también lo que los no-ops de `writing-for-agents` quitarían.
4. **Prueba según dónde se escribe**: en un proyecto, la prueba es ligera (un escenario lanzado o dejado escrito antes de dar la skill por hecha); en este repo, RED/GREEN con el Art. I y `tech-stack.md`.
5. **Rebato la propuesta 0131 en un punto: ni `sdd-roadmap` ni el prompt de arranque invocan la skill.** `launch-prompt-template.md` ya lleva las palancas desde la 0262, y cargar ~1.800 palabras por cada prompt no tiene ningún fallo medido detrás (Principio 1). La invocará la retro (0277).
6. **Los frentes con RED limpio no entran como guía nueva**: forma del elemento omitido (R3, f1 0 fallos de 2), regla en su paso (R4, t1 0 de 2), contraste con la base y repetir el baseline (R7 y R8, b2 0 de 2). Las filas de la 0146 §1, 0146 §2, 0175 §2 y 0172 quedan en la deuda como **posible falso negativo**, con este RED por evidencia. El texto de las fuentes que ya los cubre sí entra por el fork. Medido en un molde pequeño y en un turno, que puede no reproducir el campo.
7. **Tres frentes aún sin medir llevan su RED en la Task 1**: fila de la 0175 §1 (buscar choques al devolver texto de un fork), de la 0160 §1 (forma de un mensaje que estructura otra skill) y la comprobación previa de un escenario (0077, 0036, 0080, 0156). n = 2 cada uno. Si fallan, su regla entra; si no, siguen la decisión 6.
8. **Se retiran `.agents/skills/writing-skills` y `.agents/skills/writing-for-agents`**, con sus enlaces en `.claude/skills/` y sus entradas de `skills-lock.json`: dos fuentes de lo mismo derivarían. `skill-creator` se queda.
9. **`THIRD_PARTY_NOTICES.md`**: los dos pasan de «Skills de desarrollo» a la lista del plugin, y la skill lleva su `NOTICE`.
10. **`README.md` dirá «invoca 0 skills de superpowers»** y `skills.test.ts` dejará de exigir más de cero. La dependencia de `plugin.json` no se toca: no hay fila que la retire, así que abro una al cerrar, con el ticket.
11. **La previsión de campaña** lleva, además de RED y GREEN: una tanda de REFACTOR con n = 2 por regla nueva que fije un literal o vaya a `references/`, y una partida de controles, pasada de fix y cambio de modelo de un 20 % de sujetos, dentro del techo.
12. **El traspaso** se escribe como lo primero del paso, nombra la skill y prohíbe seguir desde él. Es la forma que dio 4/4 en la 0147.
13. **`p1` se repite en un molde con migraciones SQL**: en este RED los dos sujetos pararon a preguntar porque no había SQL, y R1 y R2 no se midieron.
14. **Los sujetos de este molde no pueden escribir en `.claude/skills/`** y dejan el cambio en su mensaje. Se califica sobre ese texto; no cambia lo que se mide.
15. **Delta probado en una copia**: `sdd capability merge` añade 3 requisitos a `agent-writing.md` y 1 a `routing.md`, sin rechazos.

- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Se parte en 0151, 0276 y 0277 — opción «Parto en tres (Recomendada)», respondida «1», 2026-11-01.
- Perfil y cierre — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

Hoy la guía para escribir skills vive en dos skills de desarrollo de este repo que nadie carga: la 0173 gastó ~1,6 h y 3,52 $ en medir una regla que `writing-skills` ya traía. Los proyectos no tienen nada, y el kit todavía cita `superpowers:writing-skills`. El éxito es una sola skill del kit, sin citas a superpowers, con GREEN en los fallos del RED: `p1` entra por la skill, R5 y R6 pasan. Fracasa si añade guía sin fallo medido o si la skill no se carga al editar una skill de este repo.

## Scope

- Entra: `skills/sdd-agent-writing/` (tres ficheros y `NOTICE`), `tests/batteries/sdd-agent-writing/`, `skills/using-sdd/SKILL.md` (una fila de la tabla), `skills/sdd-archive/references/aprendizajes-skills.md` (el puntero), `CLAUDE.md`, `README.md`, `THIRD_PARTY_NOTICES.md`, `skills-lock.json`, `cli/test/kit/word-budget.test.ts`, `cli/test/kit/skills.test.ts`, `.docs/sdd/architecture.md` (el árbol), el roadmap.
- No entra: triaje por causa (0276); `sdd-retro` y las filas de deuda del tope de un documento, de `feedback-template.md` y de los tres anuncios que salen a medias (0277); retirar la dependencia de superpowers (fila nueva, decisión 10); `.docs/sdd/tech-stack.md`, que sigue siendo el método de este repo y está cerca de su tope.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `superpowers:writing-skills` | `skills/sdd-archive/references/aprendizajes-skills.md:11`, `README.md:182` | Scope: pasa a `sdd-agent-writing` y «0 skills» |
| Skills de desarrollo `writing-skills` y `writing-for-agents` | `.agents/skills/`, `.claude/skills/`, `skills-lock.json`, `THIRD_PARTY_NOTICES.md:40-41` | Decisiones 8 y 9 |
| `cited.length` mayor que cero | `cli/test/kit/skills.test.ts:70` | Decisión 10 |
| «las 20 skills» | `CLAUDE.md:22` | Scope: 21 |

- Filas que implementa: 0151 → la fila del roadmap; `release-flow.md:118` y `publish*.slow.test.ts` solo la usan de ejemplo y se quedan. Salda de la deuda: «Al editar una skill no se carga la skill de escribir skills», «Un traspaso de una línea a otra skill no se sigue» y «La previsión de la campaña no reserva sujetos», si su GREEN pasa. La 0173 («la 0151 lo hereda») entra por el fork.

## Approach

Fork primero, con el texto de sus fuentes; lo propio del kit, solo donde el RED falló o su Task 1 lo mida. El cableado va después, y la retirada de las copias de desarrollo la última, cuando la skill ya esté en GREEN.

## Dónde se prueba

- Puerta y conducta: `tests/batteries/sdd-agent-writing/`, con sujetos, como las demás baterías.
- La fila de `using-sdd`: su batería, por tramo de la puerta.
- Citas, enlaces, topes y `name`: `cli/test/kit/skills.test.ts` y `word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `agent-writing`

#### ADDED — Pedir una skill entra por sdd-agent-writing

- GIVEN un proyecto con `.docs/sdd/` y migraciones SQL en `db/migrations/`
- WHEN el usuario pide «quiero una skill para las migraciones SQL» sin nombrar ninguna skill
- THEN la primera skill invocada es `sdd-agent-writing`
- AND la `description` que escribe dice solo cuándo usarla, sin resumir su proceso
- AND no da la skill por hecha sin un escenario lanzado o dejado escrito que la pruebe

#### ADDED — Un traspaso a otra skill es lo primero del paso

- GIVEN la skill `exportes` y la petición de pasar el trabajo a `avisos` al terminar
- WHEN el agente la edita con `sdd-agent-writing`
- THEN el paso nombra `avisos`, dice que invocarla es lo primero del paso y prohíbe seguir desde él

#### ADDED — La previsión de una campaña lleva sus partidas

- GIVEN tres escenarios, RED con n = 1 y GREEN con n = 2, a 0,5 $ por sujeto
- WHEN el agente escribe la previsión con `sdd-agent-writing`
- THEN además de RED (3 sujetos) y GREEN (6) lleva una tanda de REFACTOR y una partida de controles, pasada de fix y cambio de modelo
- AND el total no sale en 4,50 $

### Capacidad: `routing`

#### ADDED — Quien pide una skill o instrucciones para un agente entra por sdd-agent-writing

- GIVEN un proyecto con `.docs/sdd/`
- WHEN el usuario pide crear una skill («quiero una skill para…»)
- THEN la puerta es `sdd-kit:sdd-agent-writing`, no `sdd-propose`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-agent-writing` (nueva) | 0 / sin tope | — | `SKILL.md` 2.000; total 8.470: 8.783 de las fuentes, menos ~600 de lo común y lo de plataforma, más ~120 del kit y 2 % |
| `using-sdd` | 524 / 570 | 46 | sin cambio |
| `sdd-archive` | sin aumento | — | sin cambio |
| kit | 92.830 / 89.328, con holgura ×1,25 | 18.830 con la holgura | sin cambio |
| `architecture.md` | 1.986 / 1.900, con holgura ×1,25 | 389 con la holgura | sin cambio |

## Previsión de coste

Precio por sujeto: techo de 0,5 $, el de un paso de la 0206 (~0,5 $ medido). En este RED se midieron 0,12 $ por sujeto, así que lo normal es ~4 $.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED previo, ya gastado | 10 | 1,16 |
| RED de `p1` en su molde y de los tres frentes de la decisión 7 | 8 | 4 |
| GREEN: `p1`, `t1`, `b1` y los frentes que fallen, n = 2 | 12 | 6 |
| Una tanda de REFACTOR | 4 | 2 |
| Controles: `f1`, `b2` y el tramo de la puerta de `using-sdd` | 7 | 3,5 |
| Medición tras la revisión final | 4 | 2 |
| Suma | 45 | 18,66 |

Pasos nuevos del agente y su medida: puerta → `p1`; description y prueba ligera → `p1`; traspaso → `t1`; previsión → `b1`. Fila de `using-sdd` → su tramo. El resto del fork conserva el texto de su fuente y se cubre por humo (`f1`, `b2`).

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-01 | aprobada (opción «Apruebo») |
