---
id: 20261105-115850-feature-0316-upgrade-migrations-english
feature: 0316
proposal: 0301
title: Las migraciones de sdd-upgrade en inglés
mode: full
profile: delegate
status: approved
created: 2026-11-05
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-05
---

# Spec — Las migraciones de sdd-upgrade en inglés

🦆 Hoy las 13 migraciones de `sdd-upgrade` están en castellano, y `moon run kit:own` da 277 líneas rojas en ellas (100 en la v3.0.0, la que corren todos los proyectos del equipo). Con esta feature, el agente lee cada paso en inglés, pero lo que escribe en el proyecto sigue igual: el commit `chore(sdd): migrar al kit v3.0.0`, el aviso «Gate con lint: …», las secciones «Por triar» o «En espera» de `debt.md`. Ningún paso cambia, se añade ni se quita. Para no romper nada, cambian a la vez los literales que leen la skill, los tests y los documentos: `**Escribe**:` pasa a `**Writes**:`, `## Verificación` a `## Verification` y «sin gate» a «no gate». Hecho cuando `kit:own` no da ninguna línea en las migraciones y `cli:test` pasa.

Validación: agente — es texto que lee el agente, y lo que se observa entero es `kit:own`, la suite y la ejecución real de dos escenarios de la batería; el repo valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `migration` — los literales de la forma de una migración que nombran sus requisitos (`**Writes**:`, «Verification», «no gate», «no changes to the project», «Also…») y las reglas «Dónde viven los datos» y «Regla ante conflicto»

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (la línea `**Writes**:` y el título «Verification», que leen `sdd-upgrade`, `migration-init-parity.test.ts` y `check.test.ts`), MODIFIED (9 requisitos y 2 reglas de `migration`) · tamaño: ~560 líneas en ~20 ficheros, casi todo traducción
- Dominio: si algún paso traducido cambia lo que hace la migración (un predicado, un gate, un «tal cual») (señal: MODIFIED)
- Técnica: si queda algún sitio de `cli/`, `tests/` o `skills/` que lea un literal viejo (señal: contrato público)
- Mínimo razonable: ninguna — la fidelidad de la traducción la miran el eje Spec de la revisión final, que compara cada fichero con su versión de `develop`, y los dos sujetos del humo; los literales que leen los tests los mira `cli:test`
```

La rúbrica daba «ninguna» con 2 señales. El dev-lead pidió un revisor: uno de siete puntos, en Opus con effort medium (abajo, y sus hallazgos al final de este bloque).

1. **Lo que se queda en castellano** (decisión del dev-lead, aplicada así): todo lo que la migración escribe en el proyecto o dice «tal cual», que ya va entre «…», entre comillas invertidas o en un bloque ```` ```text ````; los mensajes de commit (`chore(sdd): migrar al kit v3.0.0`); y los nombres de las secciones, columnas y campos de los documentos del proyecto. Un nombre así que hoy va sin citar pasa a ir entre «…» allí donde aparezca, también en negrita y en prosa, como hizo la 0304 con el estado de `sdd-roadmap`: en el paso 3 de la v3.0.0, las secciones de `debt.md` («Lista», «Por triar», «En espera», «Descartadas»), sus columnas en negrita (`**«Origen»**`, `**«Causa»** y **«Arreglo»**`, `**«Remedio temporal»**`, `**«Fecha»**`, `**«Impacto»**`) y las de `ROADMAP.md` (`**«Tarea»**`, `**«Externo»**`, `**«Tras»**`, `**«Estado»**`, `**«Tamaño»**`); lo mismo en las demás migraciones. Un texto de varias líneas que se escribe en el proyecto y hoy va como prosa (la nota `> **No es una capacidad.** …` del paso 1 de la v1.0.0) pasa a un bloque ```` ```markdown ````, sangrado como el texto del paso 1 para no cortar la lista, con su primera línea idéntica a la de hoy: `> **No es una capacidad.** …`, la marca que lee `sdd capability check`.
2. **Lo que se traduce**: el resto, también las cabeceras y las celdas de las tablas que el agente enseña al dev-lead (la de reglas del paso 8 de la v3.0.0, las de destinos), porque el agente escribe lo que lee el usuario en su idioma (`sdd-upgrade`, Overview). Los pasos conservan número, orden, predicado y marca **gate**; los comandos y los bloques de código no cambian.
3. **Los literales de forma que cambian**, con todos sus sitios (tabla «Lo que se retira o cambia de forma»): `**Escribe**:` → `**Writes**:`; `## Verificación` → `## Verification` y «Verificación» → «Verification» al nombrarla; «sin gate» → «no gate»; «sin cambios en el proyecto» → «no changes to the project»; la frase «Además…» de la línea de lo que escribe → «Also…»; «Los pasos van en este orden» → «The steps go in this order»; los títulos de los pasos 6 y 7 de la v2.0.0, «Historial de las capacidades» y «Propósito de las capacidades» → «Capability history» y «Capability purpose»; «Migración a vX.Y.Z» → «Migration to vX.Y.Z». Los títulos de los pasos se traducen; el único que se cita desde fuera de `sdd-upgrade`, el paso 1 de la v2.3.0, conserva su nombre al lado, entre «…»: `1. **Roadmap in the template's form** («Roadmap en la forma de la plantilla»).`, porque lo citan literal `skills/sdd-roadmap/SKILL.md:54`, `skills/sdd-archive/references/records.md:7` y `capabilities/roadmap.md:105`, y así esos tres sitios no cambian (la 0308 reescribe `sdd-roadmap`).
   Los tests fijan estos literales de la traducción: `check.test.ts` busca los pasos por «Capability history» y «Capability purpose» y comprueba `/no gate/i`, `/skip the step/i` (de «skip the step and say so») y, en `## Verification`, `/pending/i`; `operations-gate-fields.test.ts` busca «The steps go in this order».
4. **El fixture `tests/batteries/sdd-upgrade/v2.3.5.md` cambia solo su forma**: `**Escribe**:` → `**Writes**:` y `## Verificación` → `## Verification`, para que la migración de mentira que carga el escenario m2 tenga la forma que nombra la skill; su texto se queda en castellano, porque `kit:own` no lee `tests/` y m2 no entra en el humo. Tampoco cambian `cli/test/fixtures/own/spanish-sample.md` (es la muestra de castellano de `kit:own`), la batería de `sdd-archive` ni el requisito de `archive` que la describe (su molde lleva su propia línea `**Escribe**`, que es texto del proyecto de prueba).
5. **«Una pieza entra, otra sale» (Art. I)**: nada sale. Es una traducción sin guía nueva, y `skills/sdd-upgrade/SKILL.md` solo cambia literales uno por uno, sin palabras de más (tabla de topes).
6. **Pasada de coherencia**: `sdd capability merge` sobre una copia de `.docs/sdd` en el scratchpad → exit 0, con 9 requisitos sustituidos y 2 reglas sustituidas. Corregí en la propia pasada el recuento de requisitos, que decía 8.
7. **El humo `m1` hoy aplica dos migraciones**: el molde `salas` está en 2.3.3 y el kit ya trae la v3.0.0, así que el sujeto aplica la v2.3.4 y llega a la v3.0.0 sin la persona. Pasa si la v2.3.4 cumple M1 (ejecuta `sdd upgrade`, el marcador sale de `sdd upgrade --mark 2.3.4` y su commit `chore(sdd): migrar al kit v2.3.4` solo cambia `sdd-kit.json`) y si en la v3.0.0 no hay marcador 3.0.0 ni commit `chore(sdd): migrar al kit v3.0.0`, y los pasos 1 a 3 quedan pendientes sin mover nada. Lo que hagan los pasos sin gate de la v3.0.0 no cuenta como «otro fichero» de M1. La rúbrica M1, que no cuenta con la v3.0.0, no la toco: no es de esta feature.
- Política de modelos: revisor de la spec, uno de siete puntos en opus + effort medium (hecho) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos del humo en sonnet (los de la batería), los dos en paralelo, dentro de `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pide `CLAUDE.md`; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — (Importante) el título del paso 1 de la v2.3.0 lo citan literal `sdd-roadmap/SKILL.md:54`, `sdd-archive/references/records.md:7` y `capabilities/roadmap.md:105` → decisión 3: se traduce y conserva su nombre en castellano al lado, entre «…»; esos tres sitios no cambian y `roadmap` no entra en el delta. Lo comprobé con grep: ningún otro título de paso se cita fuera.
- **Aceptado** — (Importante) el paso 3 de la v3.0.0 nombra sin citar las columnas de `debt.md` y de `ROADMAP.md` y vuelve a nombrar las secciones fuera de las líneas 76-85 → decisión 1 y su fila de la tabla: todo nombre de sección, columna o campo del proyecto va entre «…» donde aparezca, con la lista de las de la v3.0.0.
- **Aceptado** — (Importante) falta `SKILL.md:26`, que nombra «Verificación» → al Scope y a la fila de `## Verification`.
- **Aceptado** — (Menor) el paso 9 de la v3.0.0 también lleva «Sin gate» → fila de «no gate».
- **Aceptado** — (Menor) «la palabra inglesa de la traducción» no fija el literal de los tests → decisión 3 fija `/no gate/i`, `/skip the step/i`, `/pending/i` y los títulos que buscan.
- **Aceptado** — (Menor) con `SKILL.md` en «Verification», el fixture de m2 se queda con la forma vieja → decisión 4: el fixture cambia solo `**Writes**:` y `## Verification`.
- **Aceptado** — (Menor) el criterio de m1 del Intent no era el que se aplica → decisión 7 y «Dónde se prueba» dicen el criterio real.
- **Aceptado** — (Menor) `tech-stack.md:314` es un aprendizaje con fecha de la task 0019 → sale del Scope: cuenta lo que se hizo entonces, y la regla vigente vive en `sdd-upgrade` y en `migration`.
- **Aceptado** — (Menor) el bloque de la nota de la v1.0.0 puede cortar la lista o perder el `>` → decisión 1: sangrado dentro del paso 1 y con la primera línea idéntica.

### Decisiones tomadas con el dev-lead

- Review de la spec: un revisor de siete puntos en Opus — «2», a la pregunta del nivel (2026-11-05)

- Alcance: las 13 migraciones; fuera, cambiar qué hace una migración y las demás `references/` en castellano (0305, 0306, 0296 y 0307) — petición de arranque, 2026-11-05
- Lo que una migración escribe en los documentos del proyecto se queda en castellano, y las citas también — petición de arranque
- Cada título se busca antes en `cli/` y `tests/` — petición de arranque
- La traducción sigue la frase de la fuente sin mejorarla (ADR 0022, regla 1) — petición de arranque
- El rojo es la comprobación de castellano de `kit:own` — dev-lead, a la 0304: «1»
- Perfil `delegate`; al fusionar, `sdd merge --push` — petición de arranque

## Intent

Las migraciones son instrucciones para el agente, y el Art. III dice que van en inglés; la 0299 dejó `sdd-upgrade` como «se queda» porque no miró el idioma de sus `references/`. Hoy `kit:own` da 277 rojos en las 13 migraciones, y la 0311 no puede pasar la comprobación al pre-commit con ellos. El éxito: cero rojos de `kit:own` en `migrations/`, `cli:test` en verde y la misma conducta del agente al migrar (el humo `v1` pasa su rúbrica, y `m1` el criterio de la decisión 7). Fracasa, aunque `kit:own` quede en verde, si un proyecto recibe algo distinto: un texto en inglés en sus documentos, un paso que pierde su gate o un aviso «tal cual» reescrito.

## Scope

- Entra: traducir al inglés `skills/sdd-upgrade/references/migrations/v0.2.0.md`, `v0.4.0.md`, `v1.0.0.md`, `v1.1.0.md`, `v2.0.0.md`, `v2.1.0.md`, `v2.2.0.md`, `v2.3.0.md`, `v2.3.1.md`, `v2.3.2.md`, `v2.3.3.md`, `v2.3.4.md` y `v3.0.0.md`, con las reglas de las decisiones 1 a 3.
- Entra: los sitios que leen un literal que cambia: `skills/sdd-upgrade/SKILL.md` (líneas 16, 19, 24, 26 y 38), `cli/test/kit/migration-init-parity.test.ts`, `cli/test/capability/check.test.ts` (bloque «the 2.0.0 migration»), `cli/test/kit/operations-gate-fields.test.ts`, la forma de `tests/batteries/sdd-upgrade/v2.3.5.md` (decisión 4), el Art. V de `.docs/sdd/constitution.md` y el delta de `capabilities/migration.md`.
- Entra: `dist/`, regenerado con `moon run kit:build` (ADR 0023).
- No entra: cambiar qué hace una migración, o añadir o quitar pasos; las demás `references/` en castellano (0305, 0306, 0296, 0307); los ficheros de la decisión 4; la heurística de `kit:own`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `**Escribe**:` → `**Writes**:` | las 13 migraciones (salvo v0.2.0 y v0.4.0, que no la llevan) · `skills/sdd-upgrade/SKILL.md:24` · `cli/test/kit/migration-init-parity.test.ts:16, 46, 60` · `.docs/sdd/constitution.md:61` (Art. V) · `tests/batteries/sdd-upgrade/v2.3.5.md:8` · `capabilities/migration.md:27, 114, 135, 164, 361, 385` | Scope; en `migration`, delta `MODIFIED` y regla «Dónde viven los datos» |
| `**Escribe**` en la batería de `sdd-archive` (`battery.md:22, 155`, `subject.mjs:303`), en `capabilities/archive.md:227` y en `.docs/sdd/tech-stack.md:314` | esos sitios | se quedan: decisión 4 y hallazgo 8 (un aprendizaje con fecha) |
| `## Verificación` / «Verificación» → `## Verification` / «Verification» | las 13 migraciones · `tests/batteries/sdd-upgrade/v2.3.5.md:10` · `skills/sdd-upgrade/SKILL.md:19, 24, 26` · `cli/test/capability/check.test.ts:349` · `capabilities/migration.md:27, 54, 271` | Scope; delta `MODIFIED` |
| «sin gate» → «no gate» | `v2.0.0.md` (pasos 3, 5-9), `v3.0.0.md` (pasos 5, 6, 7 y 9) · `skills/sdd-upgrade/SKILL.md:16, 38` · `cli/test/capability/check.test.ts` (`/Sin gate/i`) · `capabilities/migration.md:216, 389` | Scope; delta `MODIFIED` y regla «Regla ante conflicto» |
| «sin cambios en el proyecto» → «no changes to the project» | `v2.1.0.md`, `v2.2.0.md`, `v2.3.1.md`-`v2.3.4.md` · `.docs/sdd/constitution.md:61` · `capabilities/migration.md:27, 32` | Scope; delta `MODIFIED` |
| «Además…» → «Also…» | `v2.0.0.md:56`, `v3.0.0.md:177` · `capabilities/migration.md:135` | Scope; delta `MODIFIED` |
| «Los pasos van en este orden» → «The steps go in this order» | `v3.0.0.md:15` · `cli/test/kit/operations-gate-fields.test.ts:7` | Scope |
| «Historial de las capacidades», «Propósito de las capacidades» → «Capability history», «Capability purpose» | `v2.0.0.md:43, 44` · `cli/test/capability/check.test.ts` (`stepAbout`) | Scope |
| `se salta`, `pendiente` en los tests | `cli/test/capability/check.test.ts` (`/se salta/i`, `/pendiente/i`) | Scope: pasan a `/skip the step/i` y `/pending/i` (decisión 3) |
| Título del paso 1 de la v2.3.0, «Roadmap en la forma de la plantilla» | `v2.3.0.md:5` · lo citan `skills/sdd-roadmap/SKILL.md:54`, `skills/sdd-archive/references/records.md:7`, `capabilities/roadmap.md:105` | decisión 3: se traduce y conserva el nombre entre «…»; los tres sitios no cambian |
| Nombres de secciones, columnas y campos del proyecto, sin citar | `v3.0.0.md`, paso 3 entero (secciones de `debt.md` y columnas de `debt.md` y `ROADMAP.md`), y donde aparezcan en las demás | decisión 1: van entre «…» |
| La nota `> **No es una capacidad.** …` en prosa | `v1.0.0.md:5` | decisión 1: a un bloque ```` ```markdown ```` |

- Filas que implementa: 0316 → la nombra `roadmap.md` (fila 0316, y la 0311, que va tras ella), la propuesta 0301 (reparto, fila 13b) y el inventario de la 0304; ninguna en `capabilities/` ni `skills/`: comprobado con `grep -rn "0316" .docs/sdd/capabilities skills`. El cierre marca la fila.

## Approach

La traducción sigue la frase de la fuente, una a una, sin mejorarla ni reordenarla (ADR 0022, regla 1). Cada fichero se traduce entero en una pasada; después, `kit:own` dice qué líneas quedan, y una línea que sigue roja por un literal del proyecto se cita («…») o va a un bloque, nunca se reescribe. Primero van los literales de forma con sus sitios (skill, tests, documentos), para que `cli:test` quede en verde a cada paso.

## Dónde se prueba

- Ninguna línea de castellano en las migraciones: `moon run kit:own`, sin ninguna línea de `dist/skills/sdd-upgrade/references/migrations/` (RED de hoy: 277).
- Los literales que leen los tests: `moon run cli:test`, con `migration-init-parity`, `check.test.ts` y `operations-gate-fields` sobre el texto nuevo, y `cli/test/upgrade`.
- La conducta igual: el humo de la batería de `sdd-upgrade`, `m1` (migración de solo marcador) y `v1` (la v3.0.0 entera, con la persona), n = 1 cada uno: `v1` con la rúbrica de `tests/batteries/sdd-upgrade/battery.md` (V1-V4, V6-V10), y `m1` con el criterio de la decisión 7.
- La fidelidad de cada frase: el eje Spec de la revisión final, con el diff de cada migración contra `develop`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `migration`

#### MODIFIED — Cada release lleva su migración

- GIVEN una release del kit, cambie o no la estructura de `.docs/sdd/`
- WHEN se cierra la release
- THEN existe `skills/sdd-upgrade/references/migrations/vX.Y.Z.md` con pasos verificables por predicado, o, si la release no cambia nada del proyecto, con la frase «no changes to the project», su «Verification» y su línea `**Writes**:`
- AND la suite del kit falla si la `version` de `.claude-plugin/plugin.json` no tiene su fichero en esa carpeta

#### MODIFIED — Una migración sin cambios solo avanza el marcador

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` a `2.0.0` y el kit 2.1.0, cuyo `v2.1.0.md` dice «no changes to the project»
- WHEN el usuario pide «actualízame al kit»
- THEN `sdd-kit.json` queda con `version` `2.1.0` y la fecha del día, escritos con `sdd upgrade --mark 2.1.0`, y ningún otro fichero del proyecto cambia
- AND hay un commit `chore(sdd): migrar al kit v2.1.0`

#### MODIFIED — Un proyecto ya inicializado se migra, no se re-inicializa

- GIVEN un proyecto con `.docs/sdd/sdd-kit.json` sin la clave `init`, o con `.docs/sdd/mission.md` y sin `sdd-kit.json`, y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-upgrade`
- THEN ejecuta `sdd upgrade --root <raíz>`, que lista las migraciones posteriores a la `version` de `sdd-kit.json` hasta la mayor del kit cargado, en orden SemVer
- AND sin `sdd-kit.json`, la pregunta de si es un proyecto anterior a la v0.2.0, la recomendada, o una init de la 2.x que se cortó la hace el predicado 4 de `sdd-init`: si la sesión aún no la respondió, `sdd-upgrade` invoca `sdd-init`; con «anterior a la v0.2.0», `sdd-upgrade` las aplica todas, y con «init cortada», sigue la init sin migrar
- AND las aplica en orden, con gate por fichero, y al acabar cada versión ejecuta su «Verification», escribe el marcador con `sdd upgrade --mark <versión>` y hace su commit
- AND no regenera los documentos de anclaje desde cero ni vuelca `capabilities/`: una migración solo los reestructura con una tabla de destinos y su gate
- AND con la `version` igual a la mayor migración del kit cargado, `sdd upgrade` escribe «el proyecto ya está al día con el kit <versión>» y el agente no toca nada
- AND un `sdd-kit.json` con la clave `init` no se migra: `sdd upgrade` escribe «init en curso: sigue con sdd-init», y la init sigue por `sdd-init` ([`onboarding`](onboarding.md))
- AND pedida a `sdd-init`, la migración la hace `sdd-upgrade`: `sdd-init` no aplica ninguna migración

#### MODIFIED — Lo que escribe una migración lo reciben también las init

- GIVEN una migración de `skills/sdd-upgrade/references/migrations/` que escribe en `sdd-kit.json` u otro fichero del proyecto
- WHEN corre la suite del kit
- THEN la migración declara en su línea `**Writes**:` cada fichero y cada clave que escribe
- AND la suite falla si una clave declarada no aparece literal en `sdd-init`, contando su `SKILL.md`, sus `references/`, los documentos que estos enlazan salvo `skills/sdd-upgrade/`, `sdd-config` incluido, y los `.ts` de `cli/src/init/`, salvo `extraKnownMarketplaces.superpowers-marketplace`, que el kit retiró después de escribirla `v2.0.0.md`
- AND la suite falla si el texto de una pregunta del catálogo de `sdd-config` aparece en la init o en una migración, o si una de ellas no nombra `sdd-config`

#### MODIFIED — La migración a v2.0.0 añade el propósito a las capacidades

- GIVEN un proyecto en el kit v1.1.0 con `capabilities/bookings.md`, que abre con el párrafo «Verdad viva de las reservas de salas por franja. La declaró la spec de la task 0003.» y no tiene `## Propósito`
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` lleva tras el título `## Propósito` con una o dos frases de 300 caracteres como máximo sacadas de ese párrafo sin la procedencia («Reservas de salas por franja.»), y el párrafo desaparece
- AND si la capacidad no tiene párrafo bajo el título, el propósito sale de los títulos de sus requisitos
- AND va sin gate, y el informe lista las capacidades a las que se ha escrito el propósito, para que el dev-lead lo revise en el diff
- AND la verificación de la migración ejecuta `sdd capability check --path .docs/sdd`, y no queda ningún fallo del propósito
- AND la línea `**Writes**:` de `v2.0.0.md` no gana tokens: el paso va en su frase «Also…», como el del historial, y `cli/test/kit/migration-init-parity.test.ts` sigue en verde
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

#### MODIFIED — La migración a v2.3.0 lleva el roadmap a la forma de la plantilla

- GIVEN un proyecto en 2.2.0 con `roadmap.md` commiteado en `284d195`, que falla `sdd roadmap check` (sección «Versión siguiente», decisiones en prosa, una fila saldada antes de la última release), y el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente presenta una tabla con cada bloque que sale o se mueve y su destino, y espera la aprobación antes de cambiar `roadmap.md`
- AND tras aprobar, `sdd roadmap check` escribe `Roadmap válido` y sale con 0
- AND el informe y el cuerpo del commit de la migración llevan `git show 284d195:.docs/sdd/roadmap.md` como la forma de ver el roadmap anterior
- AND si el dev-lead cambia un destino de la tabla, se aplica el suyo; si la rechaza, `roadmap.md` queda sin tocar y el paso, pendiente
- AND con `roadmap.md` sin commitear, el paso para antes de la tabla y lo dice
- AND `v2.3.0.md` declara en su línea `**Writes**:` `roadmap.md`, `validation.mode` y el marcador, y `cli/test/kit/migration-init-parity.test.ts` sigue en verde

#### MODIFIED — Un paso que borra o reestructura pregunta antes aunque su migración no lo marque

- GIVEN un proyecto en `9.9.8`, un kit con `v9.9.9.md` cuyo paso 1, sin marca **gate**, dice «borra `.docs/sdd/legacy.md`», y la petición «actualízame al kit, el dev-lead no está»
- WHEN el agente llega a ese paso
- THEN `.docs/sdd/legacy.md` sigue en disco y el informe lista el paso como pendiente, con su comando
- AND no hay commit de la migración ni cambia el marcador de `sdd-kit.json`
- AND con el dev-lead presente, presenta el borrado y espera su «sí» antes de ejecutarlo
- AND lo mismo vale para un paso sin marca que borra una sección entera o una clave de un JSON, o cambia la ruta de un fichero; un paso que solo sustituye un nombre, o uno que su migración marca «no gate», se ejecuta sin preguntar

#### MODIFIED — La migración a v3.0.0 cambia los nombres de las skills retiradas

- GIVEN un proyecto en 2.3.4 cuyo `CLAUDE.md` dice «Cierra cada feature con `sdd-end-feature`.», con `.claude/commands/pregunta.md` que dice «Usa `/sdd-consult` para responder.» y con una carpeta de `specs/` cuyo `walkthrough.md` cita `sdd-end-feature`
- WHEN se aplica la v3.0.0
- THEN `CLAUDE.md` dice «Cierra cada feature con `sdd-archive`.» y `pregunta.md` dice «Usa `/sdd-explore` para responder.», sin gate
- AND `sdd-end-patch` pasa a `sdd-archive`, y `sdd-init-greenfield` y `sdd-init-brownfield` a `sdd-init`, en `CLAUDE.md`, `AGENTS.md`, `.docs/sdd/*.md`, `.docs/sdd/steering/*.md`, `.docs/sdd/capabilities/*.md`, `.claude/skills/` y `.claude/commands/`
- AND el `walkthrough.md` de `specs/` sigue citando `sdd-end-feature`, y tampoco cambian `CHANGELOG.md`, `decisions/`, `releases/` ni `kit-feedback/`
- AND el informe lista los ficheros cambiados; sin ninguna mención, el paso se salta y lo dice
- AND la «Verification», con `git grep --untracked -nE 'sdd-(end-feature|end-patch|consult|init-greenfield|init-brownfield)'` sobre esas rutas (las carpetas con `:(glob)`, y sin `changelog.md`, `client-changelog.md` ni `roadmap.md` de `.docs/sdd/`), no devuelve nada, también sin `AGENTS.md` ni `.claude/`

#### MODIFIED — La migración a v3.0.0 deja el hook del proyecto

- GIVEN un proyecto que migra a v3.0.0 sin `.claude/hooks/sdd-kit-loaded.mjs`
- WHEN corre la migración
- THEN el fichero queda escrito y su entrada en `hooks.UserPromptSubmit` de `.claude/settings.json`, una sola vez, sin gate y sin tocar las demás entradas
- AND si la entrada ya estaba, no la duplica, y la línea `**Writes**:` de la migración los nombra

#### Reglas de la capacidad — migration

- **Dónde viven los datos**: las migraciones viven en `skills/sdd-upgrade/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto, que escribe `sdd upgrade --mark`; lo que escribe cada migración, en su línea `**Writes**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`. El roadmap anterior a la migración a v2.3.0, en el commit que nombran el informe y el commit de la migración. Los `mission.md`, `tech-stack.md`, `environments.md` y `roadmap.md` anteriores a la migración a v3.0.0, en el commit que nombran su informe y su commit (`git show <sha>:<ruta>`); los documentos de estado, en `.docs/sdd/steering/` tras ella.
- **Regla ante conflicto**: un paso que su migración marca «no gate» se ejecuta sin preguntar aunque borre o reestructure; la regla del gate de un paso que borra o reestructura cubre solo los pasos sin marca. Un documento que una migración lleva a la raíz y ya existe allí (`PRODUCT.md` de impeccable, un `CHANGELOG.md`) se funde sección a sección con gate: ninguno pisa al otro.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-upgrade` (`dist/skills/sdd-upgrade/SKILL.md`; las migraciones no cuentan) | 961 / 1225 (980 × 1,25) | 264 | sin cambio: los cambios son literal por literal |
| `.docs/sdd/constitution.md` | 2250 / 2795 (2236 × 1,25) | 545 | sin cambio |

## Previsión de coste

Batería de `sdd-upgrade` (`tests/batteries/sdd-upgrade/battery.md`), sujetos en sonnet. Precio: la mediana de `tech-stack.md` para «Migración» es 0,26 $; un sujeto de la v3.0.0 con la persona costó ~0,75 $ en la 0236 (walkthrough, Task 1: ~1,5 $ por `v4` y `g2` repetidos).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0: el rojo es `kit:own` (277 líneas), sin sujetos | 0 |
| GREEN | 2: `m1` y `v1`, n = 1 | 1,1 |
| Una tanda de REFACTOR | 2: los mismos | 1,1 |
| Controles | 0: no hay A/B; la duda de conducta la cubre el GREEN | 0 |
| Medición tras la revisión final | 0: si la pasada de fix toca una migración, se repite el sujeto que la cubre dentro de la tanda de REFACTOR | 0 |
| Suma | 4 | 2,2 |

Pasos que cambian y su escenario (Art. I):

- `v3.0.0.md`, pasos 1 a 8 y su «Verification»: `v1`. Pasos 9 y 10: sin medir; su conducta son tres avisos y dos preguntas en bloques ```` ```text ```` que no cambian, y el predicado que los abre se traduce frase a frase (los midieron `g1`, `g2` y `s1`-`s4` en la 0235, la 0236 y la 0279).
- `v2.1.0.md` a `v2.3.4.md` (solo marcador) y `sdd-upgrade/SKILL.md`: `m1`, que aplica la de solo marcador y cierra con el título «Verification».
- `v0.2.0.md` a `v2.3.0.md`: sin medir. Ningún proyecto del equipo está por debajo de la 2.3.4, el molde para medirlas no existe (`salas-legacy` es el fixture de m2), y la fidelidad la mira el eje Spec de la revisión final.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-05 | aprobada (opción «Apruebo») |
