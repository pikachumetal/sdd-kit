---
id: 20261119-101604-feature-0347-template-instance-init-first
feature: 0347
title: Una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-19
---

# Spec — Una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/

🦆 Hoy, al abrir un proyecto recién creado desde un template, la sesión dice «el proyecto tiene el kit 3.0.2 y el kit trae migraciones hasta la 3.0.3: pide «actualízame al kit»», y el agente migra un esqueleto que aún no se ha rellenado. Con este cambio, si algún documento todavía lleva la marca de «por rellenar» del template, el aviso dice que se entra primero por `sdd-init`, y `sdd upgrade` se niega a migrar y remite a `sdd-init`. Además, cuando `sdd-init` acaba, su resumen nombra los ficheros que tocó fuera de `.docs/` (`.claude/settings.json`, `.claude/hooks/sdd-kit-loaded.mjs`, `.gitignore`) y dice que van en el commit de cierre, para que quien commitea no se los encuentre por sorpresa; si queda alguna marca por un «no sé», también la nombra, porque mientras esté el kit no migra.

Validación: en campo — `validation.mode: field` en `.docs/sdd/sdd-kit.json`: cierra la verificación del agente (tests de `cli/`, RED/GREEN de la batería), y el uso real lo validan los tickets de `sdd-feedback`.

## Capacidades

- Modificadas: `migration` — una instancia de template sin inicializar no recibe el aviso de migraciones ni se migra: remite a `sdd-init`
- Modificadas: `onboarding` — el resumen de cierre de `sdd-init` nombra lo que `--finish` escribió fuera de `.docs/`

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la salida del hook de inicio y la de `sdd upgrade` las leen el agente y `sdd-upgrade`) · tamaño: ~150 líneas en 9 ficheros
- Dominio (sonnet): que «Una instancia de template sin inicializar no recibe la oferta de migrar» no deje encerrada una instancia ya inicializada que conserva marcas de template por un «no sé» (decisión 3), y que el resumen de la decisión 6 cuadre con lo que imprime `--finish`
- Técnica (sonnet): la regla de detección de la decisión 2 contra los ficheros reales (este repo cita la marca en `ROADMAP.md` y `steering/debt.md` dentro de backticks), el coste de leerlos en cada arranque y que `cli/src/upgrade/run.ts` importe la detección de `cli/bin/session-start.js` como ya importa `isOlder`
- Mínimo razonable: un revisor con los siete puntos — deja sin la segunda lente el caso de la marca citada en línea, que es el que haría saltar el aviso en este mismo repo
```

1. **Enfoque**: A, frente a B y C (ver Approach) — una sola detección, en `cli/bin/session-start.js`, que usan el hook y `sdd upgrade`.
2. **Qué cuenta como marca de template**: el texto `<!-- sdd-template: pending` sin un backtick justo delante, en cualquier posición de la línea (encabezado, celda de tabla, viñeta, cita) y con o sin texto detrás, fuera de un bloque de código vallado, en `PRODUCT.md`, `ROADMAP.md`, `.docs/sdd/*.md` o `.docs/sdd/steering/*.md`. *Por qué*: `onboarding` fija que «el contrato con el template es el texto `sdd-template: pending`: su posición y su número los decide el template», así que no se exige línea propia; el backtick delante excluye la cita como código, que es como la nombran la fila 0347 de `ROADMAP.md` y `steering/debt.md` de este repo; el bloque vallado excluye la documentación de la marca: se abre con tres o más ``` o ~~~ y se cierra con la misma secuencia, y uno sin cerrar llega al final del fichero, como en CommonMark; los bloques indentados cuentan, porque ningún documento del kit los usa. No se leen `CLAUDE.md` (no es documento del esqueleto; ningún template lo marca), `capabilities/` (la init no la crea) ni `changes/`, `field-reports/` y `decisions/` (citan la marca como evidencia, y `changes/` crece sin tope).
3. **Una marca de template que queda tras inicializar sigue remitiendo a `sdd-init`, y `--finish` la señala** — es lo que ya hace el predicado 1 de `sdd-init`, que va antes que «Initialized»: mientras quede una marca, la init no ha terminado. Una init terminada puede dejarla: `onboarding` admite «pendiente» o el marcador de la plantilla ante un «no sé» en `## Capabilities and Constraints` y `## Terminology`. Para que no quede sin que nadie lo sepa, `sdd init --finish` imprime, por cada fichero que aún la lleva, `<fichero>: queda <!-- sdd-template: pending -->: hasta quitarla, el kit no migra el proyecto y manda a sdd-init`, con la misma detección; el resumen de cierre la nombra, porque el paso 8 ya lista «discrepancies and pending questions». Es salida por pantalla: lo que `--finish` escribe en disco no cambia. La salida de la instancia es responder en `sdd-init` o borrar la línea. No se usa `sdd-kit.json` para distinguir una init terminada: un template se hace desde un proyecto ya inicializado y puede traer `channel` y `updated`, las claves que escribe `--finish`. Alternativa descartada: que la init cambie la marca por «pendiente» ante un «no sé», que es un `MODIFIED` de «La entrevista fija las cinco reglas de producto» y más texto en `sdd-init`.
4. **Texto del aviso**, en lugar del de migraciones pendientes y sin orden detrás (ni la de ofrecer, ni la de la 3.0.0, ni la de `unattended`): «AVISO sdd-kit: el proyecto viene de un template sin inicializar (`<fichero>` lleva `<!-- sdd-template: pending -->`): entra primero por la skill `sdd-init`; las migraciones del kit, hasta la <mayor>, después.». La marca va en su forma canónica aunque el fichero la lleve con texto detrás. `<fichero>` es el primero que la lleva en el orden `PRODUCT.md`, `ROADMAP.md`, `.docs/sdd/*.md` y `.docs/sdd/steering/*.md`, cada carpeta con `sort()` de JavaScript (orden binario, sin configuración regional). Sin migraciones pendientes no hay aviso, igual que hoy: la marca solo cambia un aviso que ya iba a salir, así que el hook solo lee esos ficheros cuando ese aviso iba a salir. Con un 2.x y la 3.0.0 en el kit tampoco va la orden de migrar antes de nada: `sdd-init` completa el esqueleto 2.x en su forma (predicado 1), y su resumen de cierre manda después a la migración. El aviso de versión (kit cargado menor que el marcador) no cambia. Sin `sdd-kit.json` o sin `version` no hay aviso, haya o no marca, como hoy; con la clave `init`, `version` y una marca, sale el aviso de template, que lleva igual a `sdd-init`. Fuera del aviso no se prohíbe nada: la petición del usuario se atiende por su puerta, y decidir cuándo inicializar es suyo.
5. **Texto y precedencia de `sdd upgrade`**: `template sin inicializar: sigue con sdd-init`, como error de dominio igual que `init en curso: sigue con sdd-init`, con y sin `--mark`, sin escribir nada. Precedencia: `sdd-kit.json` que no es JSON → `init en curso` → marca de template → lo de hoy («ya está al día», «sin sdd-kit.json: se aplican todas», la lista). Una instancia al día con marca da `template sin inicializar`: lo que le falta es la init, no una migración. `skills/sdd-upgrade/SKILL.md` no se toca de entrada: su paso 1 dice «or `init en curso: sigue con sdd-init` (invoke `sdd-init` with `Skill`: an init in progress isn't migrated)»; el escenario `t1` mide si eso basta con el texto nuevo, y solo si falla se edita (Scope, «Entra, si el RED lo exhibe»).
6. **El paso 8 de `sdd-init` lista las líneas de `--finish` fuera de `.docs/` que dicen `creado` o `actualizado`, literales, y que van en el commit de cierre**, en toda init, no solo en un template: `--finish` ya imprime `<fichero>: creado | actualizado | sin cambios` (`cli/src/init/run.ts`, `apply`), así que la lista sale de su salida y no de memoria (Art. II: con una orden delante, esa orden).
7. **Saldo de palabras de `sdd-init` igual o menor** (regla 6 de `CLAUDE.md`): lo que entra en el paso 8 sale del paso 7, cuya descripción de lo que escribe `--finish` en `settings.json` ya la imprime la CLI en sus notas; la orden de preguntar ante `autoMemoryEnabled: se deja true` sigue literal. El recorte exacto se mide con `cli/test/kit/word-budget.test.ts`; el tope no sube.
8. **Escenarios de batería nuevos**: `n8` en `tests/batteries/sdd-init/battery.md`, molde `template-finish`: el molde `template` con todos los documentos completos y aprobados en `init.approved`, `CLAUDE.md` incluido, un `.claude/settings.json` propio y un `.gitignore` que ya trae todas las líneas de la init, para que `--finish` lo imprima `sin cambios` y el resumen que lo nombre de memoria falle, y `PRODUCT.md` con una marca que dejó un «no sé» en `## Terminology`; petición «Usa la skill sdd-kit:sdd-init. Sigue con la init, se cortó ayer.». Y `t1` en `tests/batteries/sdd-upgrade/battery.md`, molde `template`: `sdd-kit.json` en una versión anterior a la mayor migración y una marca de template en `PRODUCT.md`; petición «Actualízame al kit.»; esperado `sdd-kit:sdd-init` y `sdd-kit.json` sin cambios. `t1` es RED con la CLI de hoy (el aviso ofrece migrar y `sdd upgrade` lista) y GREEN con la nueva; vale tanto que el sujeto entre por `sdd-init` por el aviso como tras el error de `sdd upgrade`.
9. **Pasada de coherencia**: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge` → `migration.md`: dos requisitos y dos reglas sustituidos, tres requisitos añadidos; `onboarding.md`: un requisito añadido y la regla «Avisos» sustituida; sin rechazos. Con la regla de la decisión 2, `git grep -nE '(^|[^`])<!--[[:space:]]*sdd-template:[[:space:]]*pending' -- PRODUCT.md ROADMAP.md '.docs/sdd/*.md' ':!.docs/sdd/changes' ':!.docs/sdd/field-reports'` no da nada en este repo, y sobre `.docs/sdd/changes` sí da los moldes de template de la task 0012 (control del patrón). En la spec, «marcador» queda para `sdd-kit.json`, como en `migration`, y lo del template es «marca de template». Pasos de skill que cambian y su escenario: `sdd-init` pasos 7 y 8 → `n8`; `sdd-upgrade` paso 1, sin cambio salvo RED → `t1`.
- Política de modelos: revisores de la spec, dos en sonnet (dominio y técnica), en paralelo, confirmados por el dev-lead · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos de la batería en sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- **Rechazado** — Crítico (dominio 1): una instancia ya inicializada que conserva una marca por un «no sé» queda sin salida → la salida es responderlo en `sdd-init` o borrar la línea, y el aviso nombra el fichero (decisión 3, ampliada); distinguir por `sdd-kit.json` no es fiable porque un template puede traer `channel` y `updated`.
- **Aceptado** — Crítico (dominio 2; técnica 4, Importante): los ADDED contradecían dos requisitos vigentes de `migration` → MODIFIED de «La sesión avisa cuando el proyecto tiene migraciones pendientes» y de «Un proyecto ya inicializado se migra, no se re-inicializa», con un AND cada uno.
- **Aceptado** — Crítico (técnica 1): «la línea empieza por la marca» estrechaba el contrato de `onboarding` («su posición y su número los decide el template») → la marca cuenta en cualquier posición si no lleva un backtick justo delante (decisión 2), con escenario de celda de tabla.
- **Aceptado** — Crítico (técnica 2; dominio 6, Importante): una marca documentada en un bloque de código vallado dispararía el aviso → se ignoran los bloques vallados con ```, con escenario; los bloques indentados no se tratan (ningún documento del kit los usa).
- **Aceptado** — Importante (dominio 3): la orden de migrar de la 3.0.0 frente al aviso de template → decisión 4: con marca no va la orden; `sdd-init` completa el 2.x en su forma y su cierre manda a la migración.
- **Aceptado** — Importante (dominio 4; técnica 3): precedencia de `sdd upgrade` sin fijar → decisión 5 y escenario: JSON inválido → `init en curso` → template → lo de hoy.
- **Aceptado** — Importante (dominio 5): faltaban las «Reglas de la capacidad» → «Avisos» y «Regla ante conflicto» de `migration` y «Avisos» de `onboarding`, con su valor entero; el resto, sin cambio.
- **Aceptado** — Importante (dominio 7; técnica 7): `n8` pasaba nombrando los ficheros de memoria y no ejercía «`sin cambios` no se nombra» → el molde trae un `.gitignore` ya completo, y el THEN exige los dos ficheros con su estado y que `.gitignore` no salga; el GIVEN dice «sobre un template o no».
- **Aceptado** — Importante (técnica 8): `t1` como control pasaba sin el cambio → pasa a RED con la CLI de hoy y GREEN con la nueva (decisión 8); +1 sujeto en la previsión.
- **Aceptado** — Importante (técnica 5): ficheros excluidos y orden del `<fichero>` decididos en el cuerpo → al ✋ (decisiones 2 y 4), con `sort()` binario.
- **Rechazado** — Importante (técnica 6): leer los ficheros en cada arranque sin tope → solo se leen cuando ya iba a salir el aviso de migraciones, una vez por sesión y tras cada release; son los documentos de anclaje, con tope de palabras propio; un test de «no se abre ningún fichero» probaría la implementación, no el comportamiento.
- **Aceptado** — Menor (dominio 9): la marca del aviso frente a la del fichero → el aviso la da en su forma canónica (decisión 4).
- **Aceptado** — Menor (técnica 9): citar el paso 1 de `sdd-upgrade` → decisión 5, literal.
- **Aceptado** — Menor (técnica 10): un requisito con cuatro comportamientos → partido: «no recibe la oferta» y «Una marca citada no cuenta como marca de template».
- **Rechazado** — Menor (dominio 8): en `unattended` no se anota nada → la init necesita a una persona en su entrevista (gate de `sdd-init`), y el aviso ya está en el contexto del agente.
- **Rechazado** — Menor (dominio 10): el Intent nombra la feature 0100 del proyecto de templates → es un proyecto del propio equipo, ya citado en la fila 0347 y en su ticket de `field-reports/`; no hay cliente ni dato personal.

Segunda ronda (un revisor, sonnet, siete puntos):

- **Aceptado** — Crítico 1: el fichero salió duplicado de un reemplazo mío (un `$` seguido de backtick en `String.replace`) → restaurada la primera copia y la tabla de coste rehecha; el delta se vuelve a pasar por `sdd capability merge`.
- **Aceptado** — Crítico 2: una init terminada puede dejar la marca por un «no sé» (`onboarding`, «La entrevista fija las cinco reglas de producto») → decisión 3: `--finish` la señala y el resumen la nombra; requisito de `onboarding` con su AND; `n8` lleva una marca residual.
- **Rechazado** — Importante 3: el aviso no prohíbe el trabajo sobre el esqueleto → decidir cuándo inicializar es del usuario; el aviso informa y no migra (decisión 4).
- **Aceptado** — Importante 4: precedencia del hook con `init` y sin `sdd-kit.json` → decisión 4.
- **Aceptado** — Importante 5: el patrón del `git grep` → `[[:space:]]`, con su control positivo (decisión 9).
- **Rechazado** — Importante 6: medir la pregunta de `autoMemoryEnabled` tras recortar el paso 7 → esa orden queda literal; solo sale la descripción del contenido de `settings.json` (decisión 7).
- **Aceptado** — Importante 7: vallas `~~~`, de cuatro o más y sin cerrar, y bloques indentados → decisión 2.
- **Aceptado** — Menor 8: el GIVEN del `MODIFIED` «Un proyecto ya inicializado…» dice «sin marca de template».
- **Aceptado** — Menor 9: AND de `unattended` con su GIVEN.
- **Aceptado** — Menor 10: filas citadas por id; total de `sdd-init` medido (3202 / 3212).

### Decisiones tomadas con el dev-lead

- `--finish` sigue escribiendo en `.claude/` y `.gitignore` en un template y lo anuncia en el resumen, porque sin el hook la instancia se queda sin él y meterlo en el template lo ataría a una versión del kit — «si» (2026-11-19, a la propuesta de la sesión del template)
- Sin alargar ninguna skill: el saldo de palabras de `sdd-init` queda igual o baja — regla 6 de `CLAUDE.md`, repetida en el prompt de arranque

## Intent

Una instancia recién creada desde un template trae `sdd-kit.json` en la versión del template (hoy `3.0.2`), así que con cada release del kit el hook de inicio le ofrece migrar antes de inicializarla. En la feature 0100 del proyecto de templates la sesión lanzó `sdd-upgrade` antes que `sdd-init`: migrar el esqueleto cambia la forma que `sdd-init` conserva y pone en rojo el test de forma del template. Y el cierre de `sdd-init` no dice que `--finish` cambió `.claude/settings.json`, `.claude/hooks/sdd-kit-loaded.mjs` y `.gitignore`: el sujeto los presentó como «Cambios que no te había anunciado» y el guard de rama del template bloqueó el commit. Éxito: con una marca de template, el aviso no contiene «actualízame al kit» y nombra `sdd-init`; `sdd upgrade` sale sin escribir y remite a `sdd-init`; el resumen de cierre nombra los ficheros de fuera de `.docs/`. Fracaso aunque funcione: que este repo, que cita la marca en su roadmap y su deuda, reciba el aviso de template, o que el arranque de sesión se haga notar por leer `changes/`.

## Scope

- Entra: `cli/bin/session-start.js` — detección de la marca de template (exportada) y el aviso de la decisión 4; `cli/src/hook/session-start.ts` reexporta la salida y no cambia.
- Entra: `cli/src/upgrade/run.ts` — el error de la decisión 5.
- Entra: `cli/src/init/run.ts` y su test en `cli/test/init/` — la línea de `--finish` por cada marca que queda (decisión 3).
- Entra: `cli/test/hook/session-start.test.ts` y `cli/test/upgrade/upgrade.test.ts` — los casos de «Dónde se prueba».
- Entra: `skills/sdd-init/SKILL.md`, pasos 7 y 8 (decisiones 6 y 7).
- Entra: `tests/batteries/sdd-init/battery.md` y `subject.mjs` (escenario `n8`, molde `template-finish`); `tests/batteries/sdd-upgrade/battery.md` y su `subject.mjs` (escenario `t1`, molde `template`).
- Entra, si el RED lo exhibe: `skills/sdd-upgrade/SKILL.md`, paso 1, si el sujeto `t1` no invoca `sdd-init` ante `template sin inicializar: sigue con sdd-init`, con saldo de palabras igual o menor.
- No entra: cambiar qué escribe `--finish` en disco (ni un modo `--docs-only`); el guard de rama y el test de hooks del template, ya rodeados en su commit `752ecd1`; el predicado 1 de `sdd-init`, que ya lee la marca así.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 7 de `sdd-init`: la descripción de lo que `--finish` escribe en `.claude/settings.json` (memoria, marketplace, `enabledPlugins`, fusión hoja a hoja) | `skills/sdd-init/SKILL.md`, paso 7 «Finish» | decisión 7: sale para compensar el paso 8; lo dice la salida de `--finish` y lo fija el requisito «La init deja la memoria automática desactivada y los temporales ignorados» de `onboarding`, que no cambia |

- Filas que implementa: 0347 → su fila de `ROADMAP.md` (pasa a hecha al cerrar) y las dos filas de `.docs/sdd/steering/debt.md` con 0347 en «Fila» (aviso de migración y escrituras de `--finish`; las salda el cierre) — comprobado con `git grep -n "0347" -- ':!.docs/sdd/changes' ':!.docs/sdd/field-reports'`

## Approach

- **A — Una detección en `cli/bin/session-start.js`, exportada, que importa `cli/src/upgrade/run.ts`** — lo que cuesta: una función pura más en el hook y un `import` en `run.ts`, que ya importa `isOlder` y `migrationVersions` de ese fichero; el hook solo lee los ficheros cuando ya iba a salir un aviso de migraciones.
- **B — La detección duplicada en el hook y en `run.ts`** — lo que cuesta: dos reglas que pueden divergir; el hook es `.js` sin compilar y `run.ts` ya depende de él, así que la duplicación no ahorra nada.
- **C — Sin CLI: que `sdd-upgrade` y `using-sdd` miren la marca en su texto** — lo que cuesta: alarga dos skills (contra la regla 6) y deja lo mecánico en manos del agente (principio 4 de la constitution); y el aviso del hook seguiría ofreciendo migrar.
- Elegido: A — una regla, en el sitio que ya comparten el hook y `sdd upgrade`, y sin texto nuevo en las skills.

Para el resumen de `sdd-init`, una sola vía sensata: el paso 8 lista lo que `--finish` ya imprime. Un `--finish` que imprima una línea de resumen propia añadiría texto a la CLI para repetir datos que su salida ya trae; un `--docs-only` cambia qué escribe `--finish`, fuera de alcance.

## Dónde se prueba

- Aviso con marca de template: `cli/test/hook/session-start.test.ts`, como los casos actuales de `sessionStartOutput` sobre un proyecto temporal: marca en línea propia, en una celda de tabla y con texto detrás → aviso de template sin orden; marca citada con backtick delante o dentro de un bloque vallado → el aviso de siempre; sin migraciones pendientes → sin aviso; 2.x con `v3.0.0.md` y marca → aviso de template sin la orden de la 3.0.0.
- `sdd upgrade` con marca de template: `cli/test/upgrade/upgrade.test.ts`, como el caso `init en curso`: error `template sin inicializar: sigue con sdd-init` con y sin `--mark`, `sdd-kit.json` intacto; con `init` y marca gana `init en curso`; al día y con marca, `template sin inicializar`.
- Resumen de cierre de `sdd-init`: escenario `n8` de la batería de `sdd-init`, RED con la skill de hoy y GREEN con la editada.
- `sdd-upgrade` remite a `sdd-init`: escenario `t1` de la batería de `sdd-upgrade`, RED con la CLI de hoy y GREEN con la nueva.

## Términos y ADR

- Términos resueltos: marca de template — el texto `<!-- sdd-template: pending` en un documento de anclaje, sin backtick delante y fuera de un bloque vallado (decisión 2); instancia de template sin inicializar — un proyecto con alguna marca de template
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `migration`

#### MODIFIED — La sesión avisa cuando el proyecto tiene migraciones pendientes

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y una sesión de Claude Code que carga el plugin `sdd-kit` con `v2.1.0.md` como mayor migración en `skills/sdd-upgrade/references/migrations/` que no pasa de la versión de su `.claude-plugin/plugin.json`
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto tiene aplicado el kit 2.0.0 (.docs/sdd/sdd-kit.json) y el kit cargado trae migraciones hasta la 2.1.0. Para aplicarlas, pide «actualízame al kit».»
- AND el agente recibe el mismo aviso al principio de su contexto, seguido de «Antes de atender la primera petición, ofrece aplicarlas con una pregunta de sí o no; si la petición ya pide ponerse al día, invoca la skill `sdd-upgrade` sin preguntar. Con el «sí», invoca `sdd-upgrade` y, tras su informe, atiende la petición; con el «no», atiende la petición y no lo vuelvas a ofrecer en esta sesión. Sin ese «sí», no migres.»
- AND con `control.profile: unattended` en `.docs/sdd/sdd-kit.local.json` o, sin perfil en él, en `.docs/sdd/sdd-kit.json`, la orden es «El perfil vigente es `unattended`: no ofrezcas ni migres; atiende la petición y anótalo en tu mensaje final.»; con `pair` en `sdd-kit.local.json` sobre un `sdd-kit.json` en `unattended`, la orden es la de ofrecer
- AND con el marcador en `2.3.4` y `v3.0.0.md` en el kit cargado, la orden es «El kit cargado exige la forma 3.0.0 y el proyecto sigue en la 2.x: antes de atender ninguna petición, invoca la skill `sdd-upgrade` y migra; sin migrar, las skills no encuentran sus documentos. Con el «no» del usuario, no hagas el trabajo: dile que lo pida tras migrar.», y en `unattended`, «El kit cargado exige la forma 3.0.0 y el proyecto sigue en la 2.x, con el perfil `unattended`: no hagas el trabajo; anota en tu mensaje final que el proyecto tiene que migrar a la 3.0.0 («actualízame al kit»).»
- AND con `v0.9.0.md` y `v0.10.0.md` como migraciones del kit y el marcador en `0.9.0`, el aviso dice «hasta la 0.10.0»
- AND con el marcador y el kit cargado en `2.3.4` y `v3.0.0.md` en la carpeta de migraciones, no hay aviso de migraciones ni orden de ofrecerlas
- AND con el kit cargado menor que el marcador, sale solo el aviso de la versión
- AND con el marcador en `2.1.0`, sin `sdd-kit.json`, con un `sdd-kit.json` en curso (sin `version`) o sin carpeta de migraciones en el kit cargado, no hay aviso de migraciones, y el hook sigue inyectando `using-sdd`
- AND con una marca de template, en su lugar sale el aviso de «Una instancia de template sin inicializar no recibe la oferta de migrar», sin ninguna de estas órdenes

#### MODIFIED — Un proyecto ya inicializado se migra, no se re-inicializa

- GIVEN un proyecto sin marca de template, con `.docs/sdd/sdd-kit.json` sin la clave `init`, o con `.docs/sdd/mission.md` y sin `sdd-kit.json`, y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-upgrade`
- THEN ejecuta `sdd upgrade --root <raíz>`, que lista las migraciones posteriores a la `version` de `sdd-kit.json` hasta la mayor del kit cargado, en orden SemVer
- AND sin `sdd-kit.json`, la pregunta de si es un proyecto anterior a la v0.2.0, la recomendada, o una init de la 2.x que se cortó la hace el predicado 4 de `sdd-init`: si la sesión aún no la respondió, `sdd-upgrade` invoca `sdd-init`; con «anterior a la v0.2.0», `sdd-upgrade` las aplica todas, y con «init cortada», sigue la init sin migrar
- AND las aplica en orden, con gate por fichero, y al acabar cada versión ejecuta su «Verification», escribe el marcador con `sdd upgrade --mark <versión>` y hace su commit
- AND no regenera los documentos de anclaje desde cero ni vuelca `capabilities/`: una migración solo los reestructura con una tabla de destinos y su gate
- AND con la `version` igual a la mayor migración del kit cargado, `sdd upgrade` escribe «el proyecto ya está al día con el kit <versión>» y el agente no toca nada
- AND un `sdd-kit.json` con la clave `init` no se migra: `sdd upgrade` escribe «init en curso: sigue con sdd-init», y la init sigue por `sdd-init` ([`onboarding`](onboarding.md))
- AND pedida a `sdd-init`, la migración la hace `sdd-upgrade`: `sdd-init` no aplica ninguna migración
- AND con una marca de template no se migra: `sdd upgrade` escribe «template sin inicializar: sigue con sdd-init» (requisito «`sdd upgrade` no migra una instancia de template sin inicializar»)

#### ADDED — Una instancia de template sin inicializar no recibe la oferta de migrar

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.2`, una sesión que carga el kit con `v3.0.3.md` como mayor migración, y `PRODUCT.md` con la línea `<!-- sdd-template: pending -->`
- WHEN arranca la sesión
- THEN el usuario ve «AVISO sdd-kit: el proyecto viene de un template sin inicializar (`PRODUCT.md` lleva `<!-- sdd-template: pending -->`): entra primero por la skill `sdd-init`; las migraciones del kit, hasta la 3.0.3, después.», sin «actualízame al kit»
- AND el agente recibe el mismo aviso al principio de su contexto, sin orden de ofrecer ni de aplicar migraciones
- AND con `control.profile: unattended` en `sdd-kit.json`, el mismo aviso, sin «no ofrezcas ni migres»
- AND con `sdd-kit.json` en `2.3.2`, `v3.0.0.md` en el kit y `.docs/sdd/mission.md` con `<!-- sdd-template: pending — el usuario no tiene respuesta todavía («no sé») -->`, sale el mismo aviso con `.docs/sdd/mission.md` y la marca en su forma canónica, sin la orden de migrar antes de nada
- AND con la marca en una celda de tabla de `.docs/sdd/steering/constitution.md` (`| Reglas | <!-- sdd-template: pending --> |`), sale el mismo aviso con ese fichero
- AND sin migraciones pendientes no hay aviso, haya o no marca

#### ADDED — Una marca citada no cuenta como marca de template

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.2`, una sesión que carga el kit con `v3.0.3.md` como mayor migración, y `ROADMAP.md` con la fila «el aviso mira `<!-- sdd-template: pending -->`»
- WHEN arranca la sesión
- THEN sale el aviso de migraciones pendientes de siempre, con «actualízame al kit»
- AND lo mismo con la marca en una línea propia dentro de un bloque vallado con ``` de `.docs/sdd/steering/operations.md`, o solo en `.docs/sdd/changes/`

#### ADDED — `sdd upgrade` no migra una instancia de template sin inicializar

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `3.0.2` y `.docs/sdd/steering/constitution.md` con la línea `<!-- sdd-template: pending -->`
- WHEN el agente ejecuta `sdd upgrade --root <raíz>`, con o sin `--mark 3.0.3`
- THEN sale con error de dominio y escribe `template sin inicializar: sigue con sdd-init`
- AND `sdd-kit.json` no cambia
- AND con `sdd-kit.json` ya en la mayor migración del kit, el mismo error, no «el proyecto ya está al día»
- AND con la clave `init` en `sdd-kit.json`, gana «init en curso: sigue con sdd-init»
- AND el agente invoca `sdd-init`, que entra por su predicado 1

#### Reglas de la capacidad — migration

- **Avisos**: la sesión avisa, al usuario y al agente, cuando el kit cargado es menor que el marcador del proyecto (actualizar el plugin) y cuando el marcador es menor que la mayor migración del kit cargado que no pasa de la versión de su `plugin.json` (migrar el proyecto); en el segundo caso el agente ofrece migrar antes de atender la primera petición y no migra sin el «sí», salvo con `control.profile: unattended` (el de `sdd-kit.local.json` manda sobre el de `sdd-kit.json`), que ni ofrece ni migra y lo anota en su mensaje final; con un proyecto 2.x y la migración a la 3.0.0 en el kit, migrar no es una oferta: el agente migra antes de atender nada, o no hace el trabajo; un paso con gate que el dev-lead no responde queda como pendiente explícito en el informe, con cómo reanudarlo; no se ejecuta ni se deja preparado; un paso sin marca que borra un fichero, una sección entera o una clave, o que cambia la ruta de un fichero, es un gate; con una marca de template (`<!-- sdd-template: pending` sin backtick delante, fuera de un bloque vallado, en `PRODUCT.md`, `ROADMAP.md`, `.docs/sdd/*.md` o `.docs/sdd/steering/*.md`), en lugar del aviso de migraciones sale el de template sin inicializar, que remite a `sdd-init` y no lleva orden de migrar.
- **Regla ante conflicto**: un paso que su migración marca «no gate» se ejecuta sin preguntar aunque borre o reestructure; la regla del gate de un paso que borra o reestructura cubre solo los pasos sin marca. Un paso «no gate» que choca con el estado del proyecto (árbol sucio, una carpeta repetida en el destino, algo sin versionar) para sin escribir nada y lo dice. Un documento que una migración lleva a la raíz y ya existe allí (`PRODUCT.md` de impeccable, un `CHANGELOG.md`) se funde sección a sección con gate: ninguno pisa al otro. Una marca de template gana a una migración pendiente: la instancia se inicializa con `sdd-init` antes de migrar, y `sdd upgrade` lo dice después de `init en curso` y antes de «ya está al día».

### Capacidad: `onboarding`

#### ADDED — El resumen de cierre nombra lo que `--finish` escribió fuera de `.docs/`

- GIVEN un `sdd-init`, sobre un template o no, con todos los documentos aprobados, un `.claude/settings.json` propio y un `.gitignore` que ya trae todas las líneas de la init
- WHEN ejecuta `sdd init --root <raíz> --finish` y escribe su resumen de cierre
- THEN el resumen nombra, literales, `.claude/settings.json: actualizado` y `.claude/hooks/sdd-kit-loaded.mjs: creado`, como `--finish` los imprimió, y dice que van en el commit de cierre
- AND no pone `.gitignore`, que `--finish` imprimió `sin cambios`, entre lo que va en el commit de cierre
- AND con `PRODUCT.md` aún con `<!-- sdd-template: pending -->`, `--finish` imprime `PRODUCT.md: queda <!-- sdd-template: pending -->: hasta quitarla, el kit no migra el proyecto y manda a sdd-init`, y el resumen lo nombra entre lo pendiente

#### Reglas de la capacidad — onboarding

- **Avisos**: la init dice su modo en una línea antes de la primera pregunta, y con «con código» ofrece corregirlo si es un template; con `autoMemoryEnabled: true` pregunta antes de cambiarlo, y un «no» lo anota el resumen de cierre; tras un template 2.x, el resumen de cierre dice que el proyecto se pone al día con la migración; el resumen de cierre nombra cada línea de `--finish` fuera de `.docs/` que dice `creado` o `actualizado`, y que van en el commit de cierre, y cada marca de template que `--finish` dice que queda.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-init` (`dist/skills/sdd-init/SKILL.md`) | 2657 / 2667 | 10 | sin cambio: saldo ≤ 0 (decisión 7) |
| `sdd-init` (total) | 3202 / 3212 | 10 | sin cambio: saldo ≤ 0 (decisión 7) |

## Previsión de coste

Los escenarios `n8` y `t1` no existen aún: el comando de previsión no los lee, así que cada fila cita el de un escenario de la misma batería, un solo turno y molde parecido (`n1` para `n8`, `h2` para `t1`).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="n1" N=1` (por `n8`) → `suma: 1 sujetos · coste previsto: 0.13 $`; `SCENARIOS="h2" N=1` (por `t1`) → `suma: 1 sujetos · coste previsto: 0.13 $` | 0,26 |
| GREEN | `SCENARIOS="n1" N=2` (por `n8`) → 2 × 0,13; `SCENARIOS="h2" N=1` (por `t1`) → 0,13 | 0,39 |
| Una tanda de REFACTOR | `SCENARIOS="n1" N=1` (por `n8`) → 0,13 | 0,13 |
| Controles | `SCENARIOS="n5" N=1` → `suma: 1 sujetos · coste previsto: 0.13 $` | 0,13 |
| Medición tras la revisión final | 0: solo si la revisión toca el paso 8 | 0 |
| Suma | 7 sujetos, ~35 min | 0,91 |

## Enmiendas

- 2026-11-19 — el AND de `.gitignore` del requisito «El resumen de cierre nombra lo que `--finish` escribió fuera de `.docs/`» pasa de «no nombra `.gitignore`» a «no lo pone entre lo que va en el commit de cierre» — los dos sujetos del GREEN de `n8` listan `.gitignore: sin cambios` y lo dejan fuera del commit, que es lo que pedía el ticket; Task 3 — aprobada: «1»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-19 | aprobada (opción «Apruebo») |
