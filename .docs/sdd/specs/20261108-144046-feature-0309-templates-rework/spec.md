---
id: 20261108-144046-feature-0309-templates-rework
feature: 0309
proposal: 0301
title: sdd-templates, una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador
mode: full
profile: delegate
status: approved
created: 2026-11-08
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — sdd-templates: una forma por regla, el Approach con sus enfoques y la previsión desde el lanzador

🦆 Hoy una spec del kit guarda en su Approach solo lo que se decidió, y quien la relee no sabe qué otras vías había ni por qué se descartaron: de las 7 últimas specs del kit, 6 no lo dicen. Con este cambio, el Approach lleva los dos o tres enfoques con lo que cuesta cada uno y el elegido con su porqué, como hace `brainstorming` 7.0.2. La «Previsión de coste» deja de multiplicar a mano un precio de `tech-stack.md` y pega la línea que da el lanzador (`suma: 4 sujetos · coste previsto: 3.46 $`). Y las plantillas dejan de decir la misma regla de dos formas: el esfuerzo real, cuándo vale `Validación: agente` y la línea `Validado` salen igual en el patch y en el walkthrough.

Validación: dev-lead — las plantillas las rellena el agente y las lee el dev-lead; con `validation.mode: field`, la valida el uso en campo, a través de los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `feature-flow` — dónde van los enfoques de la spec (el Approach) y de dónde salen las cifras de la «Previsión de coste» (la salida del comando de previsión)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (dos requisitos de `feature-flow`), contrato público (la forma de `walkthrough.md` y `patch.md`, que leen `sdd-archive` y `sdd estimation log`) · tamaño: ~70 líneas en 9 ficheros
- Dominio (sonnet): si el `MODIFIED` de «Una feature grande devuelve el diseño por secciones» deja coherentes el mensaje de enfoques de `pair`, el ✋ de `delegate` y el Approach, y si la tabla de hallazgos (decisión 3) deja alguna regla de `sdd-templates` en dos formas (señal: `MODIFIED`); sin reglas de negocio ni roles, en Sonnet
- Técnica (sonnet): si `walkthrough.md` con `Validado:` sigue entrando en `sdd estimation log` y `sdd-archive`, y si el molde nuevo de `co4` mide lo que dice la fila CO4 (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin la segunda lectura el contrato de forma de los artefactos que leen la CLI y el cierre

1. **Enfoque: A** (ver Approach). Dentro de `sdd-templates`, cada regla con una sola forma; la línea que dos plantillas necesitan va igual en las dos y la regla que la explica, en una; la copia de otra skill (P7, P12-P20) se queda para la 0311 o la fila de esa skill — por qué los otros no: B (`includes/`) choca con el Art. VIII, que pone las plantillas solo en `templates/`, y C (una plantilla nombra a la otra) depende de que el agente abra un fichero que no está usando.
2. **El Approach guarda los enfoques, con lo que cuesta cada uno y el porqué del elegido, en todos los perfiles; en `delegate`, el ✋ solo nombra el elegido y los descartados (`Enfoque: A, frente a B y C (ver Approach)`), sin repetir el porqué** (enmienda del 2026-11-09). Para eso se sustituyen tres frases de `skills/sdd-propose/references/spec-writing.md` (`:16`, `:30` y `:36`), que hoy mandan los enfoques al ✋: es otra skill, fuera de `Ficheros: skills/sdd-templates/` de la fila, pero sin cambiarlas la plantilla nueva quedaría al lado de una frase que dice lo contrario (ADR 0022, regla 2). La fila PB de la batería de `sdd-propose` mide la frase de `:30`, así que PB cambia con ella y se vuelve a medir (`pb` en GREEN).
3. **Qué se hace con cada hallazgo** de la tabla de la 0299 (research §2.1, P10-P20, con P7, que la petición nombra):

   | Hallazgo | En `sdd-templates` | Fuera |
   | --- | --- | --- |
   | P10 Esfuerzo real, dos formas | `patch-template.md` §5 y `walkthrough-template.md` §2, el mismo hueco: «la línea `Esfuerzo real:` de `sdd session tokens …`, tal cual: «<Zh> — reloj de la sesión…»», y fuera de Claude Code, en los dos, `<Yh>, aproximado con las marcas de los commits`; sale de los dos huecos cómo se cuenta (desde el arranque, sin esperas), que es de la CLI y queda en el «Método» de `estimation-template.md` | — |
   | P11 `Validación: agente`, condiciones distintas | `patch-template.md` lleva el criterio con las mismas palabras que `spec-template.md` (con sus ejemplos); cambia solo quién concede el atajo: en el patch, la frase literal del dev-lead, porque no tiene gate de spec | — |
   | P12 Capacidad = sustantivo, slug en inglés | vive en la regla 1 de `capability-template.md`; `spec-template.md` (delta) la nombra en vez de repetirla | `spec-writing.md:22` de `sdd-propose`, a la 0311 |
   | P13 Campos de `§Frontend` | sin cambio: el hueco de `operations-template.md` es la forma | `frontend-verification.md`, a la 0311 |
   | P14 La línea `Gate:` | sin cambio: patch y walkthrough ya llevan la misma forma; el walkthrough añade duración, configuración y sha, que solo él usa | `sdd-verify`, `sdd-propose`, `sdd-archive`, a la 0311 |
   | P15 Qué es un desvío | sin cambio: una sola vez en la skill (Enmiendas) | `control-profiles.md`, `sdd-implement`, a la 0311 |
   | P16 Documento técnico enlaza sin copiar | sale la segunda frase de la «Regla de reparto» de `spec-template.md`; queda en `plan-template.md` §1.1, la task que documenta | `aprendizajes-skills.md`, a la 0311 |
   | P17 Método y sus cuatro factores | sin cambio: una sola vez en la skill (`Ejecución` del plan); AX y p1 miden esa línea | `plan-writing.md`, `sdd-implement`, a la 0311 |
   | P18 Modelo y effort por despacho | sin cambio: una sola vez en la skill (`Modelo` de la task) | tres skills, a la 0311 |
   | P19 Líneas de validación (y S456/S457) | `walkthrough-template.md` 4.2 pasa de `Validado por el dev-lead: <fecha> · <qué probó>` a `Validado: <fecha> · «<frase literal del dev-lead>»[ · no detalló qué probó]`, la forma de `sdd-archive/references/validation-modes.md:25`, y `patch-template.md` §4 gana el mismo `[ · no detalló qué probó]`; qué probó va en la frase del dev-lead, que la validación pide con ello (`feature-flow`, «El trabajo se valida con el usuario antes de cerrar»), o en el recuento del panel (`panel: 3/3 OK · «listo»`); y el literal de `sdd-archive/SKILL.md:29` con ella | `control-profiles.md`, a la 0311 |
   | P20 El delta de un patch | `patch-template.md` §6 deja de repetir la línea «Ninguna, porque…»: la dice §Capacidades | `records.md`, a la 0311 |
   | P7 Privacidad del ticket | sin cambio: una sola vez en la skill | `sdd-feedback`, su fila |

4. **La «Previsión de coste» cita el comando que nombra `tech-stack.md`, no `battery.mjs` a secas**: la plantilla viaja a todos los proyectos y la ruta `tests/headless/battery.mjs` solo existe en el kit. El hueco pide la salida del comando de previsión que nombre `tech-stack.md`, con el del kit como ejemplo; sin ese comando, la batería y el precio por sujeto de `tech-stack.md`, como hoy. No hay hueco nuevo en el `tech-stack.md` de los proyectos: el precio por sujeto tampoco lo tiene en ninguna plantilla, y los dos los escribe en él quien prueba skills con sujetos.
5. **El molde `reservas-skills` gana un comando de previsión** (`scripts/plan.mjs`, que imprime una línea por escenario y `suma: <n> sujetos · coste previsto: <x> $`) y `tech-stack.md` lo nombra junto al precio viejo de ~0,70 $, como el `tech-stack.md` del kit, que tiene los dos. La fila CO4 pasa a pedir que cada cifra cite esa salida, y una fila nueva, AP, pide los enfoques en el Approach de `spec-new.md`; las dos se miden con `co4`. Cambia el molde de `cr1`, `cr2` y `cr3`, y `cr1` va de control.
6. **Una pieza entra, otra sale**: salen cómo se cuenta el esfuerzo real (dos veces), la segunda frase de la «Regla de reparto», la regla del nombre de la capacidad en la spec y la línea repetida del delta del patch; entran el hueco de enfoques del Approach y el ejemplo del comando de previsión. Saldo medido sobre un borrador: +94 palabras en `sdd-templates`, +17 en `sdd-propose`, −3 en `sdd-archive` (+108 en el kit). Lo que sube es el Approach que pidió el dev-lead.
7. **`kit:own` ya cumple el criterio de hecho**: hoy da 26 líneas y una sola de `sdd-templates`, la frase de idioma repetida en 13 `SKILL.md`, que es de la 0311; las plantillas no las mira (`EXCLUDED` de `tests/own/repeated.ts`). Medido sobre el borrador: las mismas 26 líneas. Por eso la verificación de P10-P20 es la tabla de la decisión 3, leída en la revisión final, no `kit:own`.
8. **Sin test de humo propio para P12 y P16**: la frase que sale sigue, con las mismas palabras, en la otra plantilla, y ningún paso cambia de conducta. P10, P11, P19 y P20 tienen humo en `sdd-archive` (`a2`, cierre de patch; `t3`, walkthrough con `Validación: agente`).
9. **El delta, probado en una copia**: `sdd capability merge` sobre una copia de `capabilities/` da «añadido «La spec guarda sus enfoques en el Approach»» y «sustituido» en los dos `MODIFIED`, y `sdd capability check`, contra el de la base, solo cambia los avisos de longitud de los dos `MODIFIED`, que ya los tenían (1.622 → 1.674 y 545 → 843 caracteres, por el GIVEN con la invocación y la rama sin comando); el `ADDED` queda por debajo de 500.
10. **El registro de fuentes**: `upstream.json` añade `spec-template.md` al concepto `brainstorming` 7.0.2 y su nota dice dónde van los enfoques. Es un `concept`, no una `copy`: `kit:copies` no lo compara (`build/sources.ts`).
11. **Lo que la previsión y la prueba dan por hecho**: el RED no corre `pb`, porque su fila nueva pide lo que el kit de hoy manda al ✋, y las 6 de 7 specs sin enfoques en el Approach ya son el RED; los moldes cambiados toman el precio que da `battery.mjs plan`, el de la última campaña de `co4`; el rojo de `kit:skill-size` en `sdd-roadmap` (21.680 bytes) es de la base y no cuenta como nuevo; el AND de `pair` del `ADDED` y el caso de una sola vía sensata quedan `sin medir`, porque ningún escenario de la batería llega al Approach en `pair` (`pb-p` para en el mensaje de enfoques).
### Hallazgos de la review

- **Rechazado** — (técnica, Crítico) solo se cita `statistics.test.ts` y no se buscó el hueco en `cli/` → buscado: `git grep -e '<Zh>' -e 'Validado por el dev-lead' -- cli skills tests/batteries build` da solo `statistics.test.ts:199` (ya en el Scope), `timing.test.ts:202` (huecos del plan, que no cambian) y los dos sitios de la tabla; ningún fichero de `cli/src` lee `Validado`, y `sdd estimation log` lee la etiqueta `Esfuerzo real` (`REAL_LABEL`), que no cambia. Va a «Lo que se retira».
- **Aceptado** — (dominio y técnica) `Validado:` sin «qué probó» choca con `feature-flow` → la forma pasa a la de `validation-modes.md:25`, con `[ · no detalló qué probó]`, en el walkthrough y en el patch (decisión 3, P19).
- **Aceptado** — (dominio y técnica) faltan en «Lo que se retira» los requisitos de `estimation`, `archive` y `control-profiles` que nombran las líneas cambiadas → filas añadidas, con su destino.
- **Aceptado** — (dominio) el `ADDED` repite la regla del ✋ en `delegate`, que ya dice el `MODIFIED`, y deja fuera `unattended`, la spec aprobada por delegación y «empieza ya» → el `ADDED` dice solo el Approach, en todos los perfiles; el ✋ queda en «Una feature grande…».
- **Aceptado** — (técnica) el GIVEN de la previsión no da la invocación con escenarios y n → la da; la rama sin comando queda como AND con su condición, como las demás ramas de esa capacidad.
- **Aceptado** — (técnica) el AND de `pair` y el caso de una sola vía no tienen medida → `sin medir` en la decisión 11.
- **Aceptado** — (técnica) decisiones en el cuerpo fuera del ✋ (RED sin `pb`, precio de los moldes cambiados, rojo heredado) → decisión 11; la de una sola vía sensata es del hueco que pide el dev-lead, como `brainstorming`.
- **Aceptado** — (técnica) «~30 líneas en 5 plantillas» no cuadra → medido en el borrador: 18 líneas añadidas y 14 quitadas en 3 plantillas, `spec-writing.md` y `sdd-archive/SKILL.md`; el resto, hasta ~70 en 9, son batería, molde, test y `upstream.json`.
- **Aceptado** — (técnica) «la misma salida fuera de Claude Code» no dice cuál → la decisión 3 (P10) la cita.
- **Rechazado** — (técnica) `tech-stack-template.md` no tiene el hueco del comando → no hay plantilla de `tech-stack.md`, y el precio por sujeto que se usa hoy tampoco tiene hueco (decisión 4).
- **Rechazado** — (técnica) `kit:copies` compara `spec-writing.md` → es un `concept` de `upstream.json`, no una copia (decisión 10).
- **Rechazado** — (dominio) «La review adversarial…» queda desfasado porque el elegido pasa al Approach → en `delegate` el ✋ sigue llevando el elegido y su porqué (decisión 2), y en `pair` el mensaje de enfoques sigue: la definición de decisión central vale igual.
- **Rechazado** — (dominio) en lite no se dice si el Approach lleva enfoques → los lleva como hoy el mensaje de enfoques, que `spec-writing.md` no limita a full; el criterio medible y la pantalla de un lite visual son «las partes del cómo» del hueco.
- **Rechazado** — (dominio) el GIVEN de la previsión ata el requisito a `scripts/plan.mjs` → un GIVEN es un caso concreto, como `aviso-cierre` y su ~0,70 $ en el mismo escenario.
- **Rechazado** — (dominio) `author:` nombra a una persona real → es el campo de la plantilla, con el `git config user.name` de quien escribe la spec, como en las demás specs del kit.
- **Rechazado** — (dominio) el Intent no dice que las filas «sin cambio» cuentan → «Dónde se prueba» ya dice que lo comprueba la tabla de la decisión 3 en la revisión final.

- Política de modelos (solo en `delegate`): revisores de la spec, dominio y técnica en `sonnet` + `sdd-kit:effort-medium` · ejes de la revisión final: Spec `opus` + high, Código `sonnet` + high, Arquitectura no (no entra módulo, dependencia ni contrato entre módulos) · sujetos de la batería en `sonnet`, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide `CLAUDE.md`; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Perfil `delegate` y merge con `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`.»
- La skill es propia y no se traduce nada; sin batería propia, el RED de cada regla lo decide `sdd-agent-writing`, y si se usa la batería de otra skill se cita la salida de `battery.mjs plan` — «La skill es propia (tabla de la 0299), así que no hay que traducir nada»
- Una frase de plantilla que mide una batería se queda — «Si la mide, la frase se queda, porque en la 0305 mover frases medidas dejó 10 sujetos en rojo»
- Quitar en un REFACTOR algo que la spec dice que se queda es un desvío — «Quitar en un REFACTOR algo que la spec dice que se queda es un desvío: paras, no lo resuelves con un ruling»
- El Approach guarda las alternativas y la previsión cita la salida del lanzador — «Dos cambios de plantilla ya decididos: el Approach de la spec guarda las alternativas, y la Previsión de coste cita la salida del lanzador»

## Intent

Las plantillas son la forma de lo que escribe el agente, y una regla dicha de dos formas da dos artefactos distintos: el esfuerzo real sale como «la línea pegada» en el patch y como «<Zh> — reloj…» en el walkthrough; `Validado` sale con frase literal en el patch y con «qué probó» en el walkthrough. El Approach no deja ver qué se descartó, y la previsión manda calcular a mano un precio que la 0320 sustituyó por un comando. Éxito: ninguna regla de `sdd-templates` en dos formas dentro de la skill, el Approach con sus enfoques en `co4` y `pb` (2 de 2), y la previsión con la línea del comando (2 de 2), sin rojos nuevos en `kit:build`, `kit:copies`, `kit:own` y `kit:skill-size`.

## Scope

- Entra:
  - `skills/sdd-templates/templates/spec-template.md`: el hueco del Approach, la «Previsión de coste», la «Regla de reparto» (P16) y la regla del nombre de la capacidad (P12).
  - `skills/sdd-templates/templates/patch-template.md`: P10, P11, P19 y P20.
  - `skills/sdd-templates/templates/walkthrough-template.md`: P10 y P19.
  - `skills/sdd-propose/references/spec-writing.md:16`, `:30` y `:36` (decisión 2), `skills/sdd-propose/SKILL.md:64` (enmienda del 2026-11-08), y `skills/sdd-archive/SKILL.md:29`, el literal `Validado` (P19).
  - `tests/batteries/sdd-propose/`: las filas CO4, PB y AP, sus filas de procedencia y el molde `reservas-skills` (decisión 5).
  - `cli/test/estimation/statistics.test.ts:198`, que rellena el hueco `- Esfuerzo real: <Zh>` de la plantilla del walkthrough: con el hueco nuevo no casaría y el test dejaría de leer el real.
  - `upstream.json` (decisión 10) y `dist/`, que construye `moon run kit:build`.
  - El delta de `feature-flow`.
- No entra:
  - La copia de otra skill de las reglas repetidas (P7, P12-P20): 0311 o la fila de esa skill.
  - `launch-prompt-template.md`: ningún hallazgo de `sdd-templates` lo pide.
  - `includes/` y la frase de idioma del Overview (0311).
  - K20 y K32, que la tabla de la 0299 da con sitio en `sdd-templates`: son hallazgos de `sdd-propose` y `sdd-verify`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Cada cifra cita su batería y el precio por sujeto de `tech-stack.md`» | `spec-template.md:149`; `capabilities/feature-flow.md:710`; fila CO4 (`tests/batteries/sdd-propose/battery.md:139`) y su procedencia (`:221`) | delta, `MODIFIED`; Scope (CO4) |
| Los enfoques van al ✋ | `spec-writing.md:30` y `:36`; `capabilities/feature-flow.md:572` y `:573`; fila PB (`battery.md:111`) y su procedencia (`:207`); nota de `upstream.json:477` | Scope (decisión 2); delta, `MODIFIED` |
| «Approach: the parts of the how the user decided» | `spec-writing.md:16` | Scope (decisión 2) |
| `Validado por el dev-lead: <fecha> · <qué probó>` | `walkthrough-template.md:65`; `sdd-archive/SKILL.md:29` | Scope (decisión 3, P19) |
| Cómo se cuenta el esfuerzo real, en el hueco | `patch-template.md:79`; `walkthrough-template.md:26` | decisión 3, P10: queda en `estimation-template.md:8` |
| El hueco `- Esfuerzo real: <Zh>` del walkthrough | `walkthrough-template.md:26`; `cli/test/estimation/statistics.test.ts:198`, que lo rellena por su texto | Scope: el test rellena el hueco nuevo |
| «`tech-stack.md`, `architecture.md` y `environments.md` dicen dónde está la pieza técnica…» | `spec-template.md:29` | decisión 3, P16: queda en `plan-template.md:75` |
| «Una capacidad es un sustantivo del dominio… kebab-case» | `spec-template.md:101` | decisión 3, P12: queda en `capability-template.md:4` |
| «Ninguna, porque el fix devuelve…» repetida | `patch-template.md:85` | decisión 3, P20: queda en `patch-template.md:30` |
| La línea `Esfuerzo real` pegada de `sdd session tokens` | `capabilities/estimation.md:140`, `:163`, `:171`, `:220` y `:235` | sin cambio: el hueco nuevo pide esa misma línea, tal cual |
| `Validado: <fecha> · …` | `capabilities/archive.md:160`, `:264`; `capabilities/feature-flow.md:83`, `:88`; `sdd-archive/references/validation-modes.md:25`; `dev-validation.md:55` | sin cambio: la forma nueva es la de `validation-modes.md:25`, y el panel la rellena con su recuento |
| Quién concede `Validación: agente` en un patch | `capabilities/control-profiles.md:499` | sin cambio: ya dice «solo con su frase literal en la petición o en la pregunta del carril», que el patch pasa a decir con el criterio de la spec |
| `<Zh>` y `Validado por el dev-lead` en `cli/` | `cli/test/estimation/statistics.test.ts:199`; `cli/test/session/timing.test.ts:202` (huecos del plan) | Scope (`statistics.test.ts`); `timing.test.ts`, sin cambio: rellena `plan-template.md`, que no cambia |

- Filas que implementa: 0309 → `roadmap.md:146` (la cierra `sdd-archive`) y `:156`, la 0311, que la nombra en su «tras»; ningún fichero de `skills/` la nombra: comprobado con `git grep -n "0309" -- skills tests/batteries cli`.

## Approach

- A: dentro de `sdd-templates`, una forma por regla; la línea que dos plantillas necesitan va igual en las dos, y la regla que la explica, en una — ~30 líneas en 3 plantillas, 3 frases de `sdd-propose` y una de `sdd-archive`, sin mecanismo nuevo; nada impide que las dos copias del hueco vuelvan a divergir, salvo la revisión.
- B: `includes/` para los literales que comparten dos plantillas — una sola fuente que copia el build, la misma que usará la 0311; pero el Art. VIII pone las plantillas solo en `skills/sdd-templates/templates/` e `includes/` está definido para reglas de dos skills: pide enmendar la constitution.
- C: una plantilla es dueña de la regla y la otra la nombra — menos palabras; pero el agente que rellena `patch.md` no tiene abierta `walkthrough-template.md`, y una regla que solo está en un fichero nombrado no se lee (`architecture.md`, «Ficheros auxiliares»: 0/2).
- Elegido: A — corrige las dos formas sin tocar la constitution ni depender de que se abra otro fichero; B queda para la 0311, que ya tiene `includes/` en su alcance.

El Approach de la plantilla sigue el «Approaches» de `brainstorming` 7.0.2 («the two or three ways you considered building it, what each trades off, which one they picked, and why»): un hueco por enfoque con lo que cuesta, y una línea `Elegido:`; con una sola vía sensata, esa y por qué no encajan las otras. La «Previsión de coste» pide, por fila, la salida del comando de previsión con sus escenarios y su n, y el ejemplo es el del kit: `SCENARIOS="co4 pb" N=1 node tests/headless/battery.mjs plan tests/batteries/sdd-propose/battery.md` → `suma: 2 sujetos · coste previsto: 1.73 $`.

Orden: primero el molde y las filas de la batería, con el RED de `co4` sobre el kit de hoy; después las plantillas y `spec-writing.md`, con el GREEN; al final P10-P20 con su humo.

## Dónde se prueba

- Los enfoques en el Approach: batería de `sdd-propose`, `co4` (fila AP, nueva) y `pb` (fila PB, cambiada), con sujetos sobre `dist/`.
- La previsión con la salida del comando: `co4` (fila CO4, cambiada), sobre el molde `reservas-skills` con `scripts/plan.mjs`.
- P10, P11, P19 y P20 en un cierre: batería de `sdd-archive`, `a2` (cierre de patch: `patch.md` §4 y §5) y `t3` (walkthrough con `Validación por el agente:`), n = 1, como humo.
- Que ninguna regla de `sdd-templates` quede en dos formas: la tabla de la decisión 3, leída en la revisión final contra el diff.
- `walkthrough.md` con `Validado:` en la CLI: `cli:test` (`cli/test/estimation/`, que lee walkthroughs, y `cli/test/kit/`).
- Sin rojos nuevos: `moon run kit:build kit:copies kit:own kit:skill-size`, contra la base (hoy `kit:own` da 26 líneas y `kit:skill-size`, rojo heredado en `sdd-roadmap`, 21.680 bytes).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

#### ADDED — La spec guarda sus enfoques en el Approach

- GIVEN la feature 0013 de `reservas`, en `delegate`, con la entrevista hecha
- WHEN el agente escribe `spec.md`
- THEN su `## Approach` lleva dos o tres enfoques, cada uno con lo que cuesta, y una línea `Elegido: <enfoque> — <porqué>`; con una sola vía sensata, esa y por qué no encajan las otras
- AND en `pair`, los del mensaje de enfoques y el que eligió el dev-lead, con su frase; en `unattended` o tras «empieza ya», los del agente

#### MODIFIED — Una feature grande devuelve el diseño por secciones antes de la spec

- GIVEN la feature 0012 en `pair`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes dice los enfoques en un mensaje propio —dos o tres maneras de construirlo, con lo que cuesta cada una y la que recomienda— y, elegido uno, presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND lo que el agente rellenó sin que el usuario lo dijera va en la sección como su propuesta, con su motivo
- AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike, escribe la spec sin secciones y la presenta en el gate
- AND en `delegate` no hay mensaje de los enfoques: los enfoques, con su coste y el porqué del elegido, van al Approach de la spec, y «✋ Decisiones que he tomado yo» nombra el elegido y los descartados («Enfoque: A, frente a B y C (ver Approach)») y lleva las secciones; la parada de la spec los aprueba, sin un turno por enfoque ni por sección
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones ni mensaje de enfoques: los enfoques van al Approach de la spec y lo que habría preguntado, a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás

#### MODIFIED — La spec que edita una skill con sujetos prevé su coste

- GIVEN un repo con `tests/batteries/aviso-cierre/`, `tech-stack.md` con «un sujeto de `aviso-cierre` cuesta ~0,70 $» y con la previsión de una tanda en `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs <battery.md>`, y una spec que edita `skills/aviso-cierre/SKILL.md`
- WHEN el agente escribe la spec
- THEN «Previsión de coste» lleva las filas RED, GREEN, una tanda de REFACTOR, controles y medición tras la revisión final, cada una con sus sujetos y sus dólares
- AND cada fila cita la línea `suma: <n> sujetos · coste previsto: <x> $` del comando de previsión para sus escenarios y su n, y el total es la suma de las filas
- AND con un `tech-stack.md` que no nombra comando de previsión, cada cifra cita su batería y el precio por sujeto de `tech-stack.md`
- AND una spec que no edita una skill probada con sujetos no lleva la sección

## Topes de palabras

Medido con el conteo de `cli/test/kit/word-budget.test.ts` (`dist/`, sin migraciones), que aplica todavía el margen de 1,25 (lo quita la 0284). Borrador medido el 2026-11-08 en un worktree aparte.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-templates` (la skill entera) | 16.792 / 19.650 (15.720 × 1,25) | 2.858 | sin cambio (borrador: 16.886) |
| `sdd-propose` (la skill entera) | 14.008 / 17.750 (14.200 × 1,25) | 3.742 | sin cambio (borrador: 14.025) |
| `sdd-archive` (`SKILL.md` / la skill entera) | 2.894 / 4.900 · 9.797 / 10.000 | 2.006 · 203 | sin cambio (borrador: 2.891 · 9.794) |
| el kit entero | 103.192 / 111.660 (89.328 × 1,25) | 8.468 | sin cambio (borrador: 103.300) |

## Previsión de coste

Cada fila, con la salida de `node tests/headless/battery.mjs plan` sobre su batería; los moldes cambiados (`reservas-skills`) toman el precio de la última campaña de `co4`.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="co4"` (sdd-propose) → `suma: 2 sujetos · coste previsto: 1.47 $`; `pb` no, porque la fila PB nueva pide el Approach, que el kit de hoy manda al ✋, y las 6 de 7 specs del kit sin enfoques en el Approach son el RED a coste cero | 1,47 |
| GREEN | `SCENARIOS="co4 pb"` → `suma: 4 sujetos · coste previsto: 3.46 $` | 3,46 |
| Una tanda de REFACTOR | `SCENARIOS="co4 pb"` → `suma: 4 sujetos · coste previsto: 3.46 $` | 3,46 |
| Controles | `SCENARIOS="cr1 pb-p" N=1` (sdd-propose) → `suma: 2 sujetos · coste previsto: 1.02 $`; humo, `SCENARIOS="a2 t3" N=1` (sdd-archive) → `suma: 2 sujetos · coste previsto: 0.74 $` | 1,76 |
| Medición tras la revisión final | `SCENARIOS="co4 pb" N=1` → `suma: 2 sujetos · coste previsto: 1.73 $` | 1,73 |
| Suma | 16 sujetos | 14,00 (por filas, 11,88; sube en la enmienda del 2026-11-09) |

## Enmiendas

- 2026-11-09 — la decisión 2 y el AND de `delegate` de «Una feature grande…»: el porqué del elegido vive solo en el Approach, y el ✋ nombra el elegido y los descartados; la fila Suma de la previsión pasa a «16 sujetos» (la lee `campaign.mjs`) y a 14 $ — el GREEN dio PB 0/2 porque la spec pedía el porqué en el Approach y en el ✋, la misma regla en dos sitios (ADR 0022); RED y GREEN costaron 5,43 $ frente a 4,93, y lo que queda, a ese ritmo, ~8 $ — aprobada: «sigue» (a la opción D, la recomendada)
- 2026-11-08 — el Scope añade `skills/sdd-propose/SKILL.md:64`: «they go to the ✋» pasa a «they go to the spec's Approach» (+11 bytes, 19.960 de 20.000) — el paso 4 manda los enfoques al ✋ en `delegate`, `unattended`, con la spec aprobada por delegación y tras «empieza ya», y contradice el Approach nuevo y `spec-writing.md:30` (ADR 0022, regla 2); el repaso de coherencia no lo vio — aprobada (opción «Apruebo la enmienda»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada (opción «Apruebo») |
