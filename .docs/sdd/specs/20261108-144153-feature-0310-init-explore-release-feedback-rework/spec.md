---
id: 20261108-144153-feature-0310-init-explore-release-feedback-rework
feature: 0310
proposal: 0301
title: sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022
mode: full
profile: delegate
status: approved
created: 2026-11-08
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-08
---

# Spec — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022

🦆 Para quien usa el kit no cambia nada que se vea: el agente que arranca un proyecto, cierra una release, escribe el ticket del kit o apunta una línea en el changelog hace lo mismo que hoy. Cambia dónde está escrita cada regla: cuatro reglas que el kit decía dos veces pasan a decirse una sola vez, en el sitio donde el agente las usa. Por ejemplo, la privacidad del ticket («nunca nombres de cliente, proyecto, producto ni personas») queda solo en la plantilla que el agente calca al escribirlo, y sale de la skill. Dos hallazgos de la auditoría no se tocan, y la spec dice por qué.

Validación: agente — refactor de texto de skills sin cambio de conducta: lo que un humano vería ya lo miden los sujetos y las comprobaciones; en este repo la validación es en campo (`validation.mode: field`).

## Capacidades

- Ninguna, porque refactor: `onboarding` («La init calca cada documento de su plantilla», con «las columnas y cabeceras literales de la plantilla», línea 52), `release-flow` (la línea `smoke:`, líneas 94-95) y `kit-feedback` (privacidad, líneas 40 y 77) siguen dichas donde el agente las lee en su paso (decisiones 2 a 4).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: ninguna (sin capacidad nueva, sin contrato público, sin MODIFIED, todo leído en esta sesión) · tamaño: ~12 líneas en 7 ficheros · sin delta, así que no hay `capability merge` que probar en una copia
- Un revisor (sonnet): si los dos descartes (P5 y P9, decisiones 6 y 7) se sostienen contra research §2.3 y la ADR 0022, y si las frases que salen (decisiones 2 a 5) siguen dichas en el sitio que la spec nombra
- Mínimo razonable: sin review — deja sin mirar si un descarte esconde una regla repetida que la ADR 0022 manda arreglar aquí
```

1. **Enfoque: quitar la copia del lado de estas cinco skills y dejar la regla en un solo sitio, donde el agente la decide o la calca.** Alternativas: (b) dejar la frase en la skill y quitarla de la plantilla, que es de `sdd-templates` (fila 0309) y está fuera de los ficheros de esta fila; además, un hueco de plantilla gana a la receta del paso (`tech-stack.md`, «Baterías por skill», feature 0236), así que la plantilla es el mejor sitio para lo que se escribe calcándola. (c) Llevar la regla a `includes/`: solo sirve a skills propias (`architecture.md:35`) y la 0311 ya hace ese trabajo para las repetidas entre filas. — Elegida (a) porque es la única que cabe en los ficheros de la fila y deja una sola fuente.
2. **P8** (`sdd-init`): sale el párrafo de `references/structure.md:29` («No `templates/` folder… **Tracing** is following the template's sections and table headers… drags in other people's notes and decisions.»). Lo que solo decía él, «sections and table headers», lo exige la capacidad `onboarding` (línea 52), así que entra en el paso 4 sustituyendo, no añadiendo: en `SKILL.md:59`, «the form is the template's, the content is…» pasa a «its sections and table headers are the template's, literal; the content is…». El resto del párrafo ya está en esa misma frase de `SKILL.md:59` (plantilla de `sdd-templates`, no copiar del `.docs/` del kit ni de otro proyecto, sin `templates/`). Pierde el porqué («drags in other people's notes and decisions»): no lo subo a `SKILL.md`, que ya pasaba de su tope nominal antes de esta fila (tabla de topes).
3. **P6** (`sdd-end-release`): la forma de la línea `smoke:` y su caso `pendiente` quedan solo en el paso 3, donde se escriben. En `SKILL.md:28`, «or `smoke: pendiente`, per [release-notes.md]» pasa a «or `smoke: pendiente` if none ran, per [release-notes.md]». En `references/release-notes.md:11`, «The line is `smoke: <date> · <N> hallazgos (<what ran>; <M> corregidos en la release)`, or `smoke: pendiente` if none ran: the number is never made up. It reads…» pasa a «The number of the line is never made up. The line reads…». La referencia conserva qué es smoke, qué es hallazgo y el porqué del patrón.
4. **P7** (`sdd-feedback`): sale la regla «**Privacy**: never client, project, product or people names, nor code or business rules. If a finding isn't understood without a datum from the domain, replace it with a generic descriptor (…); the finding is never omitted for privacy.» de `SKILL.md:23`. No va a `references/`: la misma regla, con el descriptor genérico y «nunca se omite», está en el bloque de ayuda de `kit-feedback-template.md:12-16`, que el paso 3 manda calcar, y el paso 5 («Privacy pass») sigue releyendo el ticket entero. La batería no mide la privacidad, así que añado a su rúbrica una fila P, «Privacidad», sobre `fb1`: falla si el ticket nombra el dominio del molde, que `notas-sesion.md:3` trae («exportar las reservas a Excel»; el molde sale de `salas`): `reservas`, `Excel` o `salas`. En «Procedencia de las reglas» (`battery.md:29`), la privacidad sale de la fila «Las demás reglas…» a una fila propia («vive en `kit-feedback-template.md`; fila P de `fb1`»), y esa fila pierde su remisión a `tests/KitFeedback.Tests.ps1`, que no existe.
5. **S686** (`add-to-changelog`): `SKILL.md:10` pasa de «The changelog is the project's **technical** record (Keep a Changelog 1.1.0), *backward-looking*. The roadmap is *forward-looking*: touching one doesn't replace the other.» a «The changelog is the project's **technical** record (Keep a Changelog 1.1.0): touching it doesn't replace touching the roadmap, nor the reverse.». Sale solo la descripción «backward/forward-looking», que sigue en la cabecera de `changelog-template.md:3`; la regla que el agente aplica (tocar uno no sustituye al otro) se queda.
6. **P9 no se toca (te rebato la auditoría).** `sdd-init:31` decide si hay código (manifiestos en la raíz o ficheros de código fuera de `node_modules/`, `.git/` y `.docs/`); `sdd-verify:58` decide si una rama toca el build (manifiestos más lockfiles y configuración, a cualquier profundidad). Son dos preguntas con respuestas distintas que comparten diez nombres de manifiesto; unificar las listas haría que la init cuente un `tsconfig.json` como código o que el gate deje de ver un `bun.lock`. No hay frase que falle que sustituir. La alternativa de una lista única en `includes/` no cabe: `sdd-verify` es una copia (`upstream.json`) e `includes/` solo sirve a las propias. El motivo queda en esta decisión y en el ticket del cierre, para que una auditoría futura no lo reabra.
7. **P5 no se toca en `sdd-explore`.** `sdd-explore/SKILL.md:26` es la regla del paso 5 que mide `e2` de su batería (fila 41 de «Procedencia»): por la regla de la 0305, se queda donde está. La única frase repetida con `sdd-roadmap/SKILL.md:56` es la del «arráncalo», que es de la 0311. Lo demás que comparten, «traced from [launch-prompt-template.md]» (`sdd-explore:26`, `sdd-roadmap:37` y `:56`), es un puntero a la fuente única, no la regla copiada. `sdd-explore` acaba la feature sin cambios.
8. **Alcance: research §5 literal** — P5, P6, P7, P8, P9 y S686. Las parejas bajo el umbral de estas skills que §5 no reparte aquí (S347, S358, S359, S517, S561, S642) no entran; S665, la caducidad de «En espera», que difiere con `sdd-roadmap`, la reparte §5 a la 0308.
9. **Pruebas.** Sin RED: ninguna edición trae guidance nueva (Art. I: una edición lleva el tramo de su batería y, sin batería, humo). GREEN con `N=1` y Sonnet:
   - `n2` de `sdd-init`, el escenario del paso 4 que presenta el siguiente documento (`operations.md`): además de su rúbrica, se lee a mano que el documento presentado lleva los títulos de sección y las cabeceras de tabla literales de `operations-template.md`.
   - `fb1` de `sdd-feedback`, con la fila P nueva.
   - `r4` de la batería de `sdd-retro`, como humo de `sdd-end-release` y `add-to-changelog`: su molde `corte` trae `CHANGELOG.md` con `[Unreleased]`, y se lee a mano que el `CHANGELOG.md` sellado lleva la línea `smoke:` con la forma del paso 3 y una línea por entrada.
   Un escenario rojo se compara con el mismo escenario y el kit de `develop` (`KIT_DIR` de `git archive develop:dist`); solo cuenta un rojo nuevo. `sdd-explore` no cambia y no se mide.
10. **Ninguna frase sale de un `SKILL.md` hacia `references/`**: las que salen (decisiones 4 y 5) quedan en una plantilla, con su motivo arriba. La tanda de REFACTOR lleva `fb1` con n = 2 por la decisión 4, la única regla que deja un `SKILL.md`.
11. **Topes de palabras sin cambio**: las ediciones bajan el recuento de cada skill completa; los dos `SKILL.md` que suben (+4 y +3) ya pasaban de su tope nominal antes de esta fila, y caben con el margen del 25 % (tabla abajo).
- Política de modelos (solo en `delegate`): revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de batería en sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- **Rechazado** — `sdd-feedback/SKILL.md:26` dice «a datum from a project file goes with a generic descriptor, like the rest of the ticket», y «the rest of the ticket» remitiría a la regla que sale → la frase sigue siendo cierta: la regla de privacidad del ticket entero sigue en la plantilla que el paso 3 calca; reescribirla sería tocar una frase que no falla.
- **Aceptado** — la capacidad `onboarding:52` exige cabeceras literales y solo lo decía `structure.md:29` → decisión 2: `SKILL.md:59` lo dice sustituyendo «the form is the template's».
- **Aceptado** — en `release-notes.md`, «It reads…» quedaba sin referente y `smoke: pendiente` seguía en dos sitios → decisión 3: «The line reads…», y el caso `pendiente` con su condición solo en `SKILL.md:28`.
- **Aceptado** — la fila 29 de «Procedencia» remite a `tests/KitFeedback.Tests.ps1`, que no existe → decisión 4: la privacidad pasa a fila propia y la remisión muerta sale.
- **Aceptado** — la fila P no demostraba que el molde traiga datos del dominio → decisión 4 cita `notas-sesion.md:3`. Sin ticket sintético de control: la fila se lee a mano.
- **Aceptado** — el descarte de P9 no dejaba rastro → decisión 6: va también al ticket del cierre.
- **Aceptado** — P5 afirmaba el puntero sin cita → decisión 7 da las líneas.
- **Aceptado** — S686: decir qué sale → decisión 5: sale la descripción, la regla se queda.
- **Aceptado** — `n4` y `n5` no medían P8 → decisión 9: `n2` con `N=1` y lectura a mano de las cabeceras; la previsión baja de 4 a 3 sujetos de GREEN.
- **Aceptado** — avisar de que el exceso sobre el tope nominal es previo → decisión 11 y tabla de topes.

### Decisiones tomadas con el dev-lead

- Perfil delegate y merge con `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`.»
- La frase que falla se sustituye, sin añadir otra, y cada skill cierra con `kit:own`, `kit:copies` y `kit:skill-size` en verde en sus ficheros — «La frase que falla se sustituye, sin añadir otra al lado, y cada skill cierra con kit:own, kit:copies y kit:skill-size en verde en sus ficheros.»
- Fuera: las repetidas con skills de otras filas y la frase de idioma del Overview — «las frases que kit:own da repetidas con skills de otras filas: 0311» · «la frase de idioma del Overview: va a includes/ en la 0311»
- RED de las dos skills sin batería decidido con `sdd-agent-writing` — «sdd-end-release y add-to-changelog no tienen batería en tests/batteries/. Su RED lo decides con sdd-agent-writing (Art. I).»
- Previsión con la salida de `battery.mjs plan`, n = 2 de REFACTOR por regla movida a `references/`, humo con `N=1` — «La previsión de coste cita la salida de node tests/headless/battery.mjs plan (suma de n y coste) y lleva n = 2 de REFACTOR por cada regla que se mueve a references/… Para un humo, N=1»
- Una frase medida por la batería en su paso se queda — «Antes de mover a references/ una frase, mira si la batería de su skill la mide en ese paso. Si la mide, la frase se queda donde está (0305)»

## Intent

La auditoría de la 0299 (research §5) dejó a estas cinco skills seis hallazgos de «la misma regla en dos sitios»: P5, P6, P7, P8, P9 y S686. Una regla dicha dos veces deriva (en P9 las listas ya no coinciden) y obliga a cambiar dos sitios. El éxito: cada regla de estos hallazgos queda en un solo sitio, el del paso que la decide o la plantilla que se calca. Ninguna frase se arregla añadiendo otra (ADR 0022, regla 3). Ninguna conducta cambia: los sujetos sin rojos nuevos contra `develop`. Fracasa si un sujeto deja de cumplir una regla porque se quedó solo en un sitio que no lee.

## Scope

- Entra: `skills/sdd-init/SKILL.md` y `references/structure.md` (P8); `skills/sdd-end-release/SKILL.md` y `references/release-notes.md` (P6); `skills/sdd-feedback/SKILL.md` (P7); `skills/add-to-changelog/SKILL.md` (S686); `tests/batteries/sdd-feedback/battery.md` (fila P de la rúbrica y la fila de privacidad de «Procedencia»); la evidencia de las tandas en la carpeta de esta spec.
- No entra: `skills/sdd-explore/` y la lista de `sdd-init/SKILL.md:31` (decisiones 6 y 7); las frases repetidas con skills de otras filas y la de idioma del Overview (0311); `skills/sdd-templates/` (0309); `skills/sdd-verify/` y `skills/sdd-roadmap/`; las parejas bajo el umbral de la decisión 8.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Párrafo «No `templates/` folder… **Tracing** is…» | `skills/sdd-init/references/structure.md:29` (único sitio fuera de la evidencia; `dist/` lo construye) | decisión 2: sale; la regla vive en `skills/sdd-init/SKILL.md:59` |
| «the form is the template's» | `skills/sdd-init/SKILL.md:59` | decisión 2: pasa a «its sections and table headers are the template's, literal»; `capabilities/onboarding.md:52` sin cambio |
| Literal `smoke: <date> · <N> hallazgos (…)` y `smoke: pendiente` en la referencia | `skills/sdd-end-release/references/release-notes.md:11` | decisión 3: sale de la referencia; vive en `skills/sdd-end-release/SKILL.md:28`, que gana «if none ran»; `capabilities/release-flow.md:94-95` sin cambio |
| Regla «**Privacy**: never client…» | `skills/sdd-feedback/SKILL.md:23`; `tests/batteries/sdd-feedback/battery.md:29` la nombra como regla de la skill | decisión 4: sale de la skill; vive en `kit-feedback-template.md:12-16`; la fila 29 de la batería se parte; `capabilities/kit-feedback.md:40, 77` sin cambio |
| «*backward-looking*. The roadmap is *forward-looking*» | `skills/add-to-changelog/SKILL.md:10` | decisión 5: se reescribe; la descripción vive en `changelog-template.md:3` (y en la instancia `.docs/sdd/changelog.md:3` de este repo, que no cambia) |

- Filas que implementa: 0310 → `.docs/sdd/roadmap.md:147` (la cierra `sdd-archive`); la nombran también las filas 0311 y 0284 («tras») y la ADR 0022 (consecuencias), que no cambian. Comprobado con `git grep -n -w 0310` fuera de la evidencia.

## Approach

Seis sustituciones de texto (decisiones 2 a 5) y dos filas de la batería de `sdd-feedback` (decisión 4). Medido sobre un borrador con las seis sustituciones aplicadas en un worktree aparte, el 2026-11-08: `node tests/own/check.ts` da, de estas cinco skills, solo las cuatro líneas de hoy repetidas con skills de otras filas (idioma del Overview en `sdd-init`, `sdd-end-release` y `sdd-explore`; «the literals of the project's documents stay as written here» con `sdd-retro`; «arráncalo» con `sdd-roadmap`). `tests/copies/check.ts` y `tests/skill-size/check.ts` dan los mismos dos rojos que la rama sin cambios, ninguno de estas skills: `skills/sdd-verify/references/` sin anotar (0297) y `sdd-roadmap/SKILL.md` en 21.680 bytes (0308).

## Dónde se prueba

- Que las reglas siguen cumpliéndose: los sujetos de la decisión 9, con `node tests/headless/battery.mjs run` y su veredicto, más las lecturas a mano que nombra.
- Que cada regla queda en un solo sitio y no hay rojos nuevos: `moon run kit:build kit:copies kit:own kit:skill-size`, comparado con la rama sin cambios (Approach).
- Topes: `cli/test/kit/word-budget.test.ts` en `cli:test`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

Medido sobre `dist/` con el conteo de `word-budget.test.ts`, hoy y con el borrador. «Tope» es el nominal; el test aplica hoy el margen del 25 % (lo quita la 0284). Los excesos sobre el nominal son de antes de esta fila.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-init/SKILL.md` | 2.644 → 2.648 / 2.500 | −148 (pasa con el margen: 3.125) | sin cambio |
| `sdd-init` (skill completa) | 3.241 → 3.193 / 3.100 | −93 (pasa con el margen: 3.875) | sin cambio |
| `sdd-end-release/SKILL.md` | 1.917 → 1.920 / 1.900 | −20 (pasa con el margen: 2.375) | sin cambio |
| `sdd-end-release` (skill completa) | 2.132 → 2.118 / 2.500 | 382 | sin cambio |
| `sdd-feedback` (`SKILL.md` = skill completa) | 704 → 656 / 800 | 144 | sin cambio |
| `add-to-changelog` (`SKILL.md` = skill completa) | 350 → 349 / 500 | 151 | sin cambio |

## Previsión de coste

Cifras de `node tests/headless/battery.mjs plan` (2026-11-08), con `SCENARIOS` y `N` como se lanzan.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0 — sin guidance nueva (decisión 9) | 0,00 |
| GREEN | 3: `n2` con `N=1` (`sdd-init`, `plan`: 1 sujeto · 0,17 $); `fb1` (`sdd-feedback`: 1 · 0,17 $); `r4` con `N=1` (`sdd-retro`: 1 · 0,15 $) | 0,49 |
| Una tanda de REFACTOR | 2: `fb1` con n = 2 (decisión 10; 0,17 $ por sujeto según `plan`) | 0,34 |
| Controles | 1: el escenario que salga rojo, con el kit de `develop` (~20 %; el más caro, 0,17 $) | 0,17 |
| Medición tras la revisión final | 1: el escenario de la skill que toque la pasada de fix, si toca una (el más caro, 0,17 $) | 0,17 |
| Suma | 7 sujetos | 1,17 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-08 | aprobada («1», Apruebo) |
