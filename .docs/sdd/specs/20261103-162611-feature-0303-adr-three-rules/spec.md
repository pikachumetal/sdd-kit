---
id: 20261103-162611-feature-0303-adr-three-rules
feature: 0303
proposal: 0301
title: ADR de las tres reglas del dev-lead para el texto del kit
mode: lite
status: approved
created: 2026-11-03
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-03
---

# Spec — ADR de las tres reglas del dev-lead para el texto del kit

🦆 Hoy la regla escrita para las copias del kit es «conserva el texto de la fuente», y aplicada como «devuelve el texto» dejó en `sdd-implement` dos frases seguidas que se contradicen: «solo cuatro cosas te paran» y, justo después, «hay una quinta». Con esta feature, la regla escrita pasa a ser la del dev-lead: se parte de la fuente, lo que el kit hace distinto **sustituye** la frase de la fuente, y un fallo se arregla reescribiendo la frase que falla. Las features 0302 a 0310 se especifican y se revisan con ella. Para eso se escribe una ADR nueva, la 0022, que jubila a la 0013 y a una frase de la 0019, y la constitution y `tech-stack.md` la enlazan.

Validación: agente — solo cambian documentos: lo comprueban `sdd decision check`, `sdd decision index --files` y los enlaces; el uso real lo hacen la 0302 y la 0304, que aplican la ADR (`validation.mode: field`).

## Capacidades

- Ninguna, porque docs: la revisión final ya lee la Confirmación de las ADR vigentes que cubren el diff (`verification`), y la forma de una ADR no cambia (`decisions`).

## ✋ Decisiones que he tomado yo — valida estas

- Review de la spec: no aplica, carril lite (sin revisor; la pasada de coherencia la hice yo).
- Política de modelos: ninguno; la sesión escribe la ADR y los dos enlaces sin subagentes.
- Repaso de coherencia: `sdd capability merge` sobre una copia de `capabilities/` → «Sin delta que fusionar». Corregido en el repaso: la primera versión de la frase del Art. IX dejaba la constitution en 2.238 palabras, sobre su tope de 2.236; la de abajo la deja en 2.233.

1. **Número y nombre**: `0022-three-rules-for-kit-text.md`, título «El texto del kit parte de la fuente, sustituye y mejora la frase que falla» — 0022 es el siguiente a la 0021, y no existe en ninguna rama de `origin` (`git log --all -- .docs/sdd/decisions/0022*`, vacío).
2. **La ADR 0013 pasa a `status: superseded by 0022`** y no cambia nada más de su texto (Art. XI: la vieja solo cambia su `status`).
3. **La sustitución parcial de la 0019 se marca como ya lo hizo la propia 0019 con la 0011, y la 0015 con la 0006**: la ADR nueva lo dice en sus Consecuencias («Sustituye la consecuencia de la ADR 0019 «Editar una frase de una skill no toca ningún test. Cambiar la forma de una plantilla tampoco». La 0019 sigue vigente en lo demás y no se edita»), y la 0019 sigue `accepted` y sin tocar. La plantilla no prevé otra marca, y `sdd decision check` no tiene un estado parcial: inventar uno sería cambiar la forma de las ADR (`decisions`), fuera de alcance.
4. **Lo que entra en la consecuencia sustituida de la 0019**: «Editar una frase de una skill o la forma de una plantilla sigue sin tocar ningún test que compruebe qué dice una frase. Sí puede poner en rojo las comprobaciones de la 0302 y la 0304, que comprueban de dónde sale cada frase: el diff de una copia contra su fuente, las frases de la fuente que se sustituyen sin quedar al lado, y la misma regla escrita en dos skills». Las dos frases de la 0019 se sustituyen juntas porque la 0304 también mira las plantillas (`sdd-templates` está en `dist/`).
5. **Lo que la ADR nueva conserva de la 0013**, porque sigue en pie dentro de la regla 1: la evidencia de la fuente vale para el Principio 1, y quitar texto de la fuente sin sustituirlo exige un A/B de no-regresión con el escenario donde actúa (Art. I). Lo que retira: «lo amplía» como motivo para cambiar el texto de la fuente, que es la puerta por la que el kit pone su frase al lado de la de la fuente; un añadido del kit que deja falsa una frase absoluta de la fuente es una sustitución de esa frase, y «trae algo de otro kit» pasa a ser otra fuente de la copia, con las mismas reglas.
6. **Regla 3 para todo el kit, copias y propias**: las 9 excepciones pegadas de la 0299 están en las dos (P21 en `sdd-config`, propia). La ADR la escribe con su corolario del research: una regla vive en el paso donde se decide, y si dos skills la necesitan, viene de un solo sitio.
7. **`rutas`: `skills/**` y `THIRD_PARTY_NOTICES.md`**, las de la 0013: la ADR gobierna el texto de las skills, las plantillas incluidas, y el aviso de sus fuentes. `tests/**` y `cli/test/kit/**` siguen con la 0019.
8. **Confirmación**: la revisión final, hasta que existan las comprobaciones, marca Important en cada copia, comparada con su fuente, cada frase de la fuente que queda al lado de la del kit diciendo lo contrario y cada pieza quitada sin su A/B, y en toda skill del diff, copia o propia, cada arreglo que añade una frase o una excepción junto a la que falla en vez de reescribirla; desde la 0302 y la 0304, lo comprueban ellas en el pre-commit y la CI (0311), y la revisión cubre lo que dicen que no ven (añadido en otra sección, paráfrasis).
9. **Fuera del alcance literal, pero dentro: reescribo la frase del Art. IX que dice la regla de la 0013**, no solo su enlace. El prompt pide que la constitution «enlace la ADR nueva donde hoy enlaza la 0013», pero el Art. IX dice hoy, con sus palabras, la regla de la 0013 («Conserva el texto de su fuente… salvo donde el kit trabaja distinto, lo amplía o trae algo de otro kit»). Cambiar solo el enlace dejaría la constitution diciendo una regla y su ADR otra: la regla 2 rota en el propio documento que la fija. La frase nueva sustituye a la vieja y dice las tres reglas; el *Por qué* del artículo suma el de la ADR nueva, sin artículo nuevo. Texto en el Approach.
10. **El escenario de `capabilities/verification.md` «La revisión final comprueba la Confirmación de las ADR que cubren el diff» se queda como está**, aunque nombra la 0013 en su GIVEN: el GIVEN fija su propio estado (`accepted`, su Confirmación) y prueba el mecanismo, no la ADR; reescribirlo sería un delta de capacidad sin cambio de conducta.
11. **Las filas del roadmap que nombran la 0013 se quedan**: la 0175, la B18 y las tres de deuda son historia o evidencia (Art. XI), y la 0296 se especificará con la ADR nueva, a la que la 0013 apunta con su `status`. La deuda «Devolver a un fork el texto de su fuente choca con paradas y pasos del kit» (ticket 0175 §1) entra en el contexto de la ADR como evidencia: es el mismo fallo, visto el mismo día que `e7ddf254`; no se salda aquí, porque la 0302 es la que lo encuentra de forma mecánica.

### Decisiones tomadas con el dev-lead

- Las tres reglas, literales — dev-lead, 2026-11-03 (propuesta 0301, «Por qué»).
- Sustituye entera a la 0013 y la consecuencia de la 0019 «Editar una frase de una skill no toca ningún test»; cómo se marca la sustitución parcial lo decide la spec — prompt de la 0303: «Cómo se marca una sustitución parcial, si la plantilla no la prevé, lo decides en la spec».
- Perfil `delegate`; al fusionar, `sdd merge --push` — prompt de la 0303: «Perfil delegate. Al fusionar, `sdd merge --push`».

## Intent

La ADR 0013 solo dice «conserva el texto de la fuente» y deja cambiarlo donde el kit «trabaja distinto, lo amplía o trae algo de otro kit», sin decir cómo: la 0175 la aplicó como «devolver el texto» y en `e7ddf254` (2026-10-13) volvió a pegar «Four things stop you, and only these» delante de la frase del kit «a fifth class, not an exception to the four» (`sdd-implement/SKILL.md:18`). Las auditorías de la 0296 y la 0299 contaron una contradicción, nueve excepciones pegadas, un texto de la fuente quitado sin motivo y 33 reglas repetidas entre skills. Éxito: una ADR vigente con las tres reglas literales del dev-lead y esa evidencia, a la que apuntan la constitution y `tech-stack.md`; `sdd decision index --files skills/<cualquiera>` la da a ella y no a la 0013. Fracaso aunque funcione: una ADR que añade las reglas al lado de la 0013 o de la 0019 sin sustituirlas, o una constitution que sigue diciendo la regla vieja.

## Scope

- Entra:
  - `.docs/sdd/decisions/0022-three-rules-for-kit-text.md`, nueva, calcada de `adr-template.md`.
  - `.docs/sdd/decisions/0013-fork-keeps-source-text.md`: solo `status: superseded by 0022`.
  - `.docs/sdd/constitution.md`, Art. IX: la frase de la regla y el enlace (decisión 9).
  - `.docs/sdd/tech-stack.md:324`: la frase que cita «los tres motivos de la ADR 0013» y su enlace.
- No entra:
  - Ninguna skill, test ni plantilla: las reglas se aplican en las features 0302 a 0310.
  - `.docs/sdd/decisions/0019-skills-not-tested-by-phrases.md`: no se edita (decisión 3).
  - `capabilities/` y las filas del roadmap que nombran la 0013 (decisiones 10 y 11).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| ADR 0013 «Un fork conserva el texto de su fuente», vigente | `decisions/0013-fork-keeps-source-text.md` | Scope: `superseded by 0022` |
| Consecuencia de la 0019 «Editar una frase de una skill no toca ningún test. Cambiar la forma de una plantilla tampoco.» | `decisions/0019-skills-not-tested-by-phrases.md:30` | ADR 0022, Consecuencias (decisiones 3 y 4) |
| Frase del Art. IX «Conserva el texto de su fuente… exige un A/B que demuestre que funciona sin él» y su enlace a la 0013 | `constitution.md:85` y `:87` | Scope: sustituida (decisión 9) |
| «los tres motivos de la ADR 0013» | `tech-stack.md:324` | Scope: sustituida |
| GIVEN con `0013-fork-keeps-source-text.md` | `capabilities/verification.md:63` y `:66` | Se queda (decisión 10) |
| Filas que nombran la 0013 | `roadmap.md:103` (0175), `:140` (0296), `:188` (B18), `:256`, `:262`, `:316` | Se quedan (decisión 11) |

- Filas que implementa: 0303 → `roadmap.md:136` y la tabla de reparto de `specs/20261103-170656-proposal-0301-kit-three-rules/proposal.md`; la fila la marca el cierre. La propuesta no se edita (artefacto de evento).
- Comprobado con `Select-String` de `ADR 0013|0013-fork|ADR 0019|0019-skills|fork-keeps` en `skills/`, `.docs/sdd/` (capabilities, decisions, constitution, tech-stack, architecture, roadmap), `.docs/workflow/`, `CLAUDE.md`, `THIRD_PARTY_NOTICES.md` y `cli/test/`: ningún hit en `skills/`, `.docs/workflow/`, `CLAUDE.md` ni `THIRD_PARTY_NOTICES.md`. `tech-stack.md:6` enlaza la 0019 por los tests de `cli/test/kit/`, que siguen en pie: se queda.

## Approach

La ADR 0022, con la forma de `adr-template.md`:

- **Contexto y problema**: la 0013 y su aplicación en `e7ddf254`; los hallazgos de `fork-audit.md` (0296) y del research de la 0299 (§2.2: K1, las nueve X —cinco nacidas en un cierre o en la pasada de fix de una revisión final—, K37; §2.3: 33 reglas repetidas, 5 ya divergentes); la deuda del ticket 0175 §1; y la frase del dev-lead que abre la propuesta 0301.
- **Opciones consideradas**: seguir con la 0013 y un recordatorio de no contradecir; forks delgados (ya descartados por la 0013); las tres reglas, con la sustitución como única forma de cambiar el texto de la fuente.
- **Decisión**: las tres reglas, literales y numeradas, cada una con lo que significa al escribir y al arreglar, y lo que conserva de la 0013 (decisión 5).
- **Consecuencias**: sustituye a la 0013 entera y a la consecuencia de la 0019 (decisiones 3 y 4); la tabla «Regla de la fuente → dónde vive ahora» de cada fork dice por fila si se conserva, se sustituye o se quita con su A/B, hasta que la 0302 lo pase a marcas en la fuente anotada; las features 0302 a 0310 se especifican y se revisan con ella.
- **Confirmación**: decisión 8.

Art. IX de la constitution, la frase «Conserva el texto de su fuente, cuya evidencia vale para el Principio 1, salvo donde el kit trabaja distinto, lo amplía o trae algo de otro kit; quitarlo sin esos motivos exige un A/B que demuestre que funciona sin él.» pasa a:

«Parte de su fuente sin tocar lo que funciona: la evidencia de la fuente vale para el Principio 1, y quitar una frase sin sustituirla exige un A/B que demuestre que funciona sin ella. Lo que el kit hace distinto sustituye la frase de la fuente; nunca se añade al lado contradiciéndola. Un problema, en una copia o en una skill propia, se arregla mejorando la frase que falla, no añadiendo otra.»

Su *Por qué* suma, tras el de la 0009: «; y una frase del kit junto a la de su fuente deja dos reglas que se contradicen», con el enlace a la ADR 0022 en el sitio del de la 0013.

`tech-stack.md:324`, «en un fork, el texto nuevo entra salvo por los tres motivos de la [ADR 0013]» pasa a «en un fork, el texto nuevo de la fuente entra, y lo que el kit hace distinto sustituye su frase ([ADR 0022])».

## Dónde se prueba

- La ADR nueva y el `status` de la 0013: `node cli/bin/sdd.js decision check --path .docs/sdd`, sale con 0.
- La 0022 gobierna las skills y la 0013 ya no: `node cli/bin/sdd.js decision index --path .docs/sdd --files skills/sdd-tdd/SKILL.md` lista la 0022 y no la 0013.
- Los enlaces de la constitution, `tech-stack.md` y la ADR resuelven a un fichero que existe: un script de un uso en el scratchpad.
- Topes: `cli/test/kit/word-budget.test.ts`, dentro del gate de cierre.

## Términos y ADR

- Términos resueltos: **excepción pegada** — una frase aparte, o una cláusula añadida después, que exceptúa una absoluta sin cambiarla (research 0299 §2.2); **A+C** — la frase de la fuente y la del kit sobre la misma regla, una al lado de la otra.
- ADR candidatas: ninguna más; esta feature es la ADR.

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 0,5 h
- Base de la estimación: una ADR y dos frases en documentos de anclaje; referencia, la 0289 (docs, 0,5 h estimada, 0,34 h real) y la mediana de docs del log (0,57)
- Confianza: alta

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `constitution.md` | 2.183 / 2.236 | 53 | sin cambio: la frase nueva del Art. IX (72 palabras, por las 40 de la vieja) y su *Por qué* (18) dejan 2.233 |
| `tech-stack.md` | 22.082 / 19.663 (×1,25 = 24.579) | 2.497 sobre el tope con margen | sin cambio: la frase queda con el mismo largo |

## Enmiendas

- 2026-11-03 — Decisiones 5 y 8: la regla 2 deja de decir «lo propio del kit va en sustituciones o fuera de la copia» y dice que un añadido que deja falsa una absoluta de la fuente es una sustitución; «trae algo de otro kit» pasa a ser otra fuente; y la Confirmación de la regla 3 cubre toda skill del diff, no solo las copias — la revisión final (eje Código, Important; eje Spec, Minor) vio dos lecturas de la regla 2 frente al Art. IX y una Confirmación más estrecha que la decisión 6; la redacción nueva aplica literal la regla 2 («nunca se añade al lado contradiciéndola») y «para todo el kit» de «Decisiones tomadas con el dev-lead» — pasada de fix de la revisión final — sin aprobar (aplica literal una decisión tomada con el dev-lead)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-03 | aprobada (opción «Apruebo») |
