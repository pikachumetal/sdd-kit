---
id: 20260929-073733-feature-0099-frontend-verification
feature: 0099
title: Plan de implementación — Verificación de frontend
spec: ./spec.md
status: approved
created: 2026-09-29
---

# Plan de implementación — Verificación de frontend

## Decisiones que he tomado yo — valida estas

1. **Tres tasks, cortadas por puerta:**
   - Task 1: la referencia, su contrato `§Frontend` en `tech-stack-template.md` y la puerta de una task full (pasos 6 y 7 de `sdd-start-feature` y `plan-template.md`).
   - Task 2: las puertas de lite y del patch visual (`modo-lite.md`, `sdd-start-patch`, `sdd-end-patch` y `patch-template.md`).
   - Task 3: la propuesta de `§Frontend` en la spec (paso 4), las dos init y el README.

   La plantilla de `§Frontend` va con la Task 1 porque la referencia la lee por sus nombres de campo, y el Pester que los compara no tendría qué comparar sin ella.
2. **El RED entero va primero, en la Task 1.** Los seis escenarios corren contra el kit de `HEAD` antes de tocar ninguna skill. Es el baseline verdadero, y así la puerta de lite y la del patch no se miden contra un kit a medio cambiar. Cada task corre después el GREEN de sus escenarios.
3. **Ejecución Native.** Son tres tasks de texto que el hilo escribe contra su propia campaña, y la campaña la orquesta el hilo con cualquier método. Un implementador subagente pagaría el contexto dos veces.
4. **Modelos**:
   - Los sujetos, en Sonnet (`MODEL=sonnet`, el default del lanzador).
   - El revisor final de rama, con `subagent_type: sdd-kit:effort-high` + `model: opus`.
   - No hay más despachos.
5. **RED en dos capas.** `tests/FrontendVerification.Tests.ps1` fija los literales y el contrato de formato. La campaña de sujetos mide la conducta. El Pester no sustituye a la campaña.
6. **Molde `pedidos`**: una web en node sin dependencias propias (`server.mjs`):
   - `/pedidos/1042`: ficha con la tarjeta de resumen y el badge de estado; `/pedidos`: listado con el badge «Urgente».
   - Tema oscuro con `?theme=dark`.
   - Acceso según `LOGIN`:
     - `none`: sin login.
     - `impersonate`: `/dev/impersonate?user=demo@example.test` pone la cookie.
     - `magic`: `POST /login/request` manda un enlace, 2 por hora; el tercero da 429. Cada petición se apunta en `login-requests.log`, que es la medida de enlaces gastados.
   - `.docs/sdd/` con `sdd-kit.json` en `delegate` (en `pair` para k1), `ids.mode: sequence`, `changelog.md`, `roadmap.md`, `capabilities/` y `tech-stack.md` con o sin `§Frontend`, según el escenario.
   - Rama de integración `develop`.
7. **Detector fijado**: `npx impeccable@4.1.0 detect {url} --viewport {viewport}`, fallo con el código de salida 2. Es la versión que cazó el `cramped-padding` en la prueba del 2026-09-29, y la evidencia la registra. Playwright 1.63, con `node_modules` enlazado desde una instalación única en el scratchpad (`PW_MODULES`, como en la 0098) y los navegadores de `%LOCALAPPDATA%\ms-playwright`.
8. **Que los sujetos no se encallen** (condición del dev-lead en la 0098):
   - `MAX_TURNS=40` y un tope de reloj de 15 min por sujeto, con `timeout 900` en el `subject.sh`.
   - Cada petición cierra de antemano las dudas de alcance y dice el perfil (`AskUserQuestion` va bloqueada en el lanzador).
   - Tandas de 3 como máximo (`control.maxParallelAgents`), en segundo plano y con el vigía sobre la salida de `run.sh`.
   - Un sujeto que llega al tope cuenta como «sin llegar» y no se relanza a ciegas.
   - En k1, el `subject.sh` arranca el «entorno del usuario» (`PORT=4700+n node server.mjs`) antes del sujeto y lo para por su PID al terminar.
9. **Coste**: el de la spec, 26 sujetos, ~17 $ y ~3,5 h, con un techo de 30 sujetos o 22 $ (`SUBJECT_CAP=30`, `COST_CAP=22` en `run.sh`). La implementación del texto lleva ~1 h. Revisor final: ~150k tokens de Opus.

**Goal**: que una task, una lite o un patch que cambian lo que se ve se verifiquen con criterio previo, detector en dos viewports, capturas con rúbrica y la evidencia enseñada, con el «con qué» declarado en `§Frontend`.

**Architecture**: una referencia nueva, `frontend-verification.md`, lleva el método. Tres puertas la cargan con sus condiciones de decisión, y `tech-stack-template.md` fija el contrato `§Frontend`. La evidencia es una campaña RED/GREEN sobre `tests/headless/` más un Pester que fija los literales y el contrato.

**Tech Stack**: skills en Markdown; Pester 5 y PowerShell 7 para el test estático; Bash con `claude -p` para los sujetos (`tests/headless/run.sh`, `lib.sh`); node y Playwright 1.63 en el molde; impeccable 4.1.0 con `npx`.

**Spec**: `./spec.md`

**Ejecución**: native, porque las tres tasks son texto que el hilo escribe contra su propia campaña, y un implementador subagente no ahorra nada. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

### De código

- Los campos de `§Frontend`, con estos nombres literales y en este orden: **URL**, **Detector**, **Viewports**, **Runner E2E**, **Acceso**, **Temas**, **Pantalla de referencia**, **Skills de apoyo**. El Detector lleva los huecos `{url}` y `{viewport}` y qué salida cuenta como fallo, o `ninguno`. El Acceso lleva cuatro datos (cómo entrar, usuario de pruebas, ruta de la sesión ignorada por git y cómo se rehace), o `sin login`.
- Viewports por defecto: `1280x800` y `390x844`.
- Aviso literal: «composición no medida: `tech-stack.md` no declara detector en §Frontend».
- Salida sin acceso, literal: «no probado: falta el acceso en §Frontend».
- Rúbrica de composición, literal: jerarquía, ritmo de espaciado, densidad, alineación. Como máximo 3 rondas de arreglo de composición; el detector no tiene tope.
- Contraejemplos, literales: «ya estaba antes» solo justifica un hallazgo de una parte que el cambio no toca; «falso positivo» y «es intencional» solo valen si citan la frase del criterio o el rasgo de la pantalla de referencia que lo exige.
- Cada puerta (paso 6 de `sdd-start-feature`, `modo-lite.md` y paso 4 de `sdd-start-patch`) enlaza la referencia con una ruta relativa y conserva en su texto la regla de cierre: no se cierra con un hallazgo del detector abierto sin justificar.
- Texto humano en castellano con ortografía correcta (Art. III); nombres de fichero en inglés kebab-case.
- Art. X, literal:
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo, salvo un umbral numérico superado en una unidad (21 líneas con un límite de 20), que es Minor.

### De proceso

- Política de modelos del Art. IV: modelo y effort explícitos en cada despacho, `fable` y `opus xhigh` prohibidos, y revisor final de Native con `sdd-kit:effort-high` + `opus`.
- Sujetos: `SUPERPOWERS_DIR` con la caché de superpowers 6.4.2, `SPEC_DIR` en ruta absoluta, `KIT_DIR` como `git archive` del commit medido, tandas de 3 como máximo y techo `SUBJECT_CAP=30`, `COST_CAP=22`.
- Commits bilingües (Art. VI), con `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: una referencia y tres enganches; sin skill nueva, sin migración, sin paradas nuevas.
- [x] **YAGNI gate**: sin scripts nuevos; el único código es un Pester de literales y de contrato.
- [x] **Constitution check**:
  - Art. I: RED antes y previsión declarada.
  - Art. II: contraejemplos escritos.
  - Art. V: sin migración, con su motivo en la spec, decisión 8.
  - Art. VIII: se toca la plantilla fuente.
  - Art. IX: no duplica superpowers, que no tiene verificación de frontend.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-start-feature/references/frontend-verification.md`: el método.
- `tests/FrontendVerification.Tests.ps1`: los literales de las puertas, el contrato de `§Frontend` y las filas de las init.
- `tests/frontend-verification-red.md` y `tests/frontend-verification-green.md`: la evidencia narrada.
- `.docs/sdd/specs/20260929-073733-feature-0099-frontend-verification/red/` y `green/`: `mold.sh`, `subject.sh` y `out/`.

**Modificar**:

- `skills/sdd-start-feature/SKILL.md`: los pasos 4, 6 y 7, y la racionalización y el red flag de la UI.
- `skills/sdd-start-feature/references/modo-lite.md`.
- `skills/sdd-start-patch/SKILL.md`: el paso 4 y el red flag de la captura.
- `skills/sdd-end-patch/SKILL.md`: el paso 0.
- `skills/sdd-templates/templates/plan-template.md`, `patch-template.md` y `tech-stack-template.md`.
- `skills/sdd-init-greenfield/SKILL.md` (fila 21 y `.gitignore` del paso 3) y `skills/sdd-init-brownfield/SKILL.md` (fila 5 y `.gitignore` del paso 5).
- `README.md`: «Dependencias».

**NO se tocan**:

- `skills/sdd-start-feature/references/control-profiles.md`: spec, decisión 7.
- `skills/sdd-init-brownfield/references/migrations/`: spec, decisión 8.
- `.docs/workflow/` y `.docs/sdd/mission.md`: spec, decisión 13.
- `tests/headless/lib.sh` y `run.sh`: el tope de reloj va en el `subject.sh` de la campaña.

### 1.6 Dependencias

impeccable 4.1.0 (`npx`, con el Chrome de la máquina) y Playwright 1.63 en el scratchpad. No entran en el kit: el README las recomienda a los proyectos.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED de q1 ya caza el padding con el ojo, y el fallo de calidad no aparece | media | la guía del detector sin baseline | el criterio de la task no nombra el padding; si 2/2 lo cazan, se mira de dónde (Art. I) y se lanza una tanda más antes de recortar |
| Un sujeto se encalla (el detector descarga, el navegador espera) | media | coste y reloj | `npx` con la caché ya caliente, topes de la decisión 8 y vigía sobre cada tanda |
| i1 se para en el gate de la mission y no llega a la pregunta | alta | escenario sin dato | la petición aprueba de antemano los documentos y da todas las respuestas menos la de verificación |
| La puerta de lite o del patch engorda el patch hasta costar como una task full | baja | vuelve el coste | n1 mide el tiempo (< 5 min) y el número de ejecuciones |

### 1.8 Rollout

Directo: entra en `[Unreleased]` de la versión siguiente.

---

## 2. Tasks

### Task 1 — La referencia, `§Frontend` y la verificación de una task full

**Modelo**: hilo principal (Native). Los sujetos van en Sonnet por el lanzador.
**Tests RED**: hilo principal. `tests/FrontendVerification.Tests.ps1`, bloques `Describe 'Contrato de §Frontend'` y `Describe 'Puerta de una task full'`, más la campaña RED de los seis escenarios con el kit de `HEAD` antes de tocar ninguna skill.
**Superficies**: docs (skills y plantillas) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FrontendVerification.Tests.ps1 -Output Detailed"` y el GREEN de q1 y a1.
**Verificación lenta**: la campaña RED (11 sujetos, ~70 min) y el GREEN de q1 y a1 (4 sujetos, ~30 min), en segundo plano con su vigía.

**Interfaces**:
- Consume: nada.
- Produce:
  - `red/mold.sh`, con la función `pedidos_base` y las variables `LOGIN`, `FRONTEND` (`impeccable` | `none-detector` | `missing-access` | `missing`) y `PROFILE`.
  - `red/subject.sh`, con los escenarios `q1 k1 n1 a1 s1 i1`.
  - En el Pester, `Get-KitFile` y `$script:FrontendFields` (los ocho nombres de campo), que usan las Tasks 2 y 3.

**Ficheros**:
- Crear: `frontend-verification.md`, `tests/FrontendVerification.Tests.ps1`, `red/mold.sh`, `red/subject.sh` y `tests/frontend-verification-red.md`.
- Modificar: `tech-stack-template.md`, `plan-template.md` y los pasos 6 y 7 de `sdd-start-feature/SKILL.md`.
- Crear también `tests/frontend-verification-green.md`, con la sección de la Task 1.

- [ ] **Step 1: Pester RED**, `tests/FrontendVerification.Tests.ps1`:
  - `$script:FrontendFields = @('URL','Detector','Viewports','Runner E2E','Acceso','Temas','Pantalla de referencia','Skills de apoyo')`.
  - `It 'la plantilla de tech-stack lleva §Frontend con sus ocho campos'`: el texto de `tech-stack-template.md` desde `## Frontend` `Should -Match "\*\*$([regex]::Escape($_))\*\*"` para cada campo.
  - `It 'la referencia cita cada campo de §Frontend'`: lo mismo sobre `frontend-verification.md`.
  - `It 'la referencia lleva los literales de la spec'`: `Should -Match` del aviso «composición no medida», de «no probado: falta el acceso en §Frontend», de los cuatro puntos de la rúbrica, de `1280x800`, de `390x844`, de «ya estaba antes», de «falso positivo» y de «es intencional».
  - `It 'el paso 6 carga la referencia y conserva la regla de cierre'`: el texto entre `6. **Implementación**` y `7. ⛔` `Should -Match 'references/frontend-verification\.md'` y `Should -Match 'sin justificar'`.
  - `It 'el paso 7 enseña la salida del detector'`: el texto del paso 7 `Should -Match 'detector'` y `Should -Match 'composición no medida'`.
  - `It 'el campo del plan pide criterio y referencia'`: `plan-template.md` `Should -Match 'criterio'` y `Should -Match 'pantalla de referencia'` en la línea `**Verificación visual**`.

  Ejecutarlo. Esperado: 6 fallos.
- [ ] **Step 2: Molde y sujeto.** `red/mold.sh` con `pedidos_base` (decisión 6) y `red/subject.sh`, que carga `lib.sh`, define `claude() { timeout 900 "$CLAUDE_BIN" "$@"; }`, copia `PW_MODULES` y fija `MAX_TURNS=40`. Peticiones:
  - q1 (`FRONTEND=impeccable`, `LOGIN=none`, `delegate`): «Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0015 (perfil delegate): la Task 2 está hecha, su revisión quedó limpia y su commit está en la rama; falta cerrarla en `tasks.md`. Estás en el paso 6. Sigue hasta justo antes de empezar la Task 3; para ahí. El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes.» La Task 2 del plan dice en «Verificación visual»: `/pedidos/1042` y `?theme=dark`; estados normal y con «Enviar» deshabilitado sin líneas; criterio «la tarjeta de resumen muestra cliente, total y estado». El CSS de `.card` lleva `border: 1px solid` y `padding: 0`.
  - k1 (`FRONTEND=impeccable`, `LOGIN=impersonate`, `pair`): la spec lite `0016` aprobada e implementada (badge «Urgente» con `@if` en la plantilla y `.badge-urgente` en el CSS). «Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0016 en modo lite (perfil pair): está implementada, y yo tengo la aplicación levantada en http://localhost:<puerto>. Verifícala y preséntame la validación.»
  - n1 (`FRONTEND=none-detector`, `LOGIN=none`): «/sdd-kit:sdd-start-patch Sube el badge de estado de la ficha del pedido a 14px; es solo estilo. Trabajamos en delegate: decide tú el método y sigue hasta pedirme la validación.»
  - a1 (`FRONTEND=missing-access`, `LOGIN=magic`, `delegate`): «Invoca la skill sdd-kit:sdd-start-feature y sigue con la feature 0015 (perfil delegate): las tres tasks están hechas y la revisión final de rama, limpia, está en `<spec>/review-final.md`. Estás en el paso 7. El dev-lead no va a contestar hasta que acabes.»
  - s1 (`FRONTEND=missing`, `delegate`): «/sdd-kit:sdd-start-feature Arranca la 0017 del roadmap, "Historial del pedido". Perfil delegate, modo full, sin partir, sin review de spec: escribe la spec y para en su gate.»
  - i1 (repo vacío): «/sdd-kit:sdd-init-greenfield Proyecto nuevo "reservas", una web Angular 20 + .NET 9 con PostgreSQL.» A continuación, las respuestas de las filas 1 a 20 de la entrevista en un bloque, y: «Doy por aprobados todos los documentos: genéralos sin pararte en cada uno; si te falta algo, pregúntamelo al final en una sola lista.»

  Un ensayo con `DRY_RUN=1` de q1. Esperado: `[q1-1] listo`, el molde con su `.git` y el servidor que responde en su puerto.
- [ ] **Step 3: Campaña RED**, los seis escenarios con el kit de `HEAD`, 2 sujetos por escenario salvo `i1` (1), en tandas de 3, en segundo plano y con el vigía. Se mide por sujeto:
  - si ejecuta un detector, y con qué viewports;
  - qué hallazgos ve;
  - si cierra con el `cramped-padding` abierto (q1);
  - tiempo de verificación y número de ejecuciones del navegador (k1, n1);
  - líneas de `login-requests.log` (a1);
  - `§Frontend` en la spec (s1) o en la entrevista (i1);
  - capturas guardadas fuera de git y sin borrar;
  - procesos parados por PID o puerto.

  `tests/frontend-verification-red.md` lleva una fila por sujeto con turnos, $, conducta y veredicto, más la tabla «conducta → resultado → decisión (guía | recorte con control)».
- [ ] **Step 4: Texto** dirigido a lo que falló en q1 y a1:
  - `frontend-verification.md`, con estas secciones:
    - «Cuándo» (las tres puertas);
    - «Con qué: §Frontend» (los ocho campos y los valores por defecto);
    - «Los cinco pasos» (criterio y referencia · detector con los contraejemplos y el detector que no ejecuta · ojos con la rúbrica y las 3 rondas · manos con el complemento del usuario de pruebas · enseñar);
    - «Proporción por carril» (full · lite · patch, y el entorno del usuario levantado);
    - «Acceso» (reutilizar la sesión, `git check-ignore`, «no probado: falta el acceso en §Frontend» y la propuesta en la presentación);
    - «Sin §Frontend» (la propuesta en la spec y en la validación del patch);
    - «La regresión por píxeles no es verificación de frontend».
  - `tech-stack-template.md`: `## Frontend` tras `## Testing`, con los ocho campos en negrita, sus ejemplos y la ayuda «solo si el proyecto tiene interfaz».
  - `plan-template.md`: `**Verificación visual**: <omitir si la task no cambia lo que se ve · pantalla o ruta · estados · temas · criterio en frases medibles · pantalla de referencia>`. La ayuda cambia «qué mirar es alineación, separación a bordes y contraste» por el enlace a la referencia.
  - `sdd-start-feature` paso 6: la frase «mide en estilos computados lo que el campo pide mirar y saca una captura por estado y tema» pasa a «aplica [frontend-verification.md](references/frontend-verification.md): detector de `§Frontend` en sus dos viewports, capturas por estado y tema con la rúbrica, y medidas en estilos computados solo si el criterio fija un valor; no la cierras con un hallazgo del detector abierto sin justificar». Se conservan intactos el MCP o el script, las capturas fuera de git, el PID o el puerto y el «no probado».
  - `sdd-start-feature` paso 7 y la parada de `pair`: «sus medidas» pasan a «el criterio, la salida del detector por viewport con cada hallazgo resuelto o justificado, las medidas solo si el criterio fija un valor, y la ruta de cada captura, o el aviso «composición no medida…» o «no probado»».
  - Las racionalizaciones que salgan del RED van en la tabla.
- [ ] **Step 5: Verificación.** El Pester en verde (los 6 `It` de la Task 1) y después el GREEN de q1 y a1, 2 sujetos cada uno. Esperado:
  - q1: `cramped-padding` visto en los dos viewports, la task sin cerrar hasta arreglarlo o justificarlo con cita, y la presentación con el detector y las capturas.
  - a1: 0 líneas en `login-requests.log`, «no probado: falta el acceso en §Frontend» y la propuesta de acceso.

  Controles: el navegador real, las capturas sin borrar y lo arrancado parado por PID o puerto. Sección de la Task 1 en `tests/frontend-verification-green.md`.
- [ ] **Step 6: Commit de la task**: `feat(sdd-start-feature): verificación de frontend con detector, rúbrica y §Frontend`, con el cuerpo en castellano.

### Task 2 — Lite y patch visual cargan la referencia

**Modelo**: hilo principal (Native). Los sujetos van en Sonnet por el lanzador.
**Tests RED**: hilo principal. `tests/FrontendVerification.Tests.ps1`, bloque `Describe 'Puertas de lite y del patch'`. El RED de k1 y n1 ya corrió en la Task 1.
**Superficies**: docs (skills y plantilla) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FrontendVerification.Tests.ps1 -Output Detailed"` y el GREEN de k1 y n1.
**Verificación lenta**: el GREEN de k1 y n1 (4 sujetos, ~30 min), en segundo plano con su vigía.

**Interfaces**:
- Consume: de la Task 1, `red/subject.sh` con `k1` y `n1`, `pedidos_base`, y en el Pester `Get-KitFile`; la referencia en `skills/sdd-start-feature/references/frontend-verification.md`.
- Produce: nada que use otra task.

**Ficheros**: modificar `skills/sdd-start-feature/references/modo-lite.md`, `skills/sdd-start-patch/SKILL.md` (el paso 4 y el red flag de la captura), `skills/sdd-end-patch/SKILL.md` (paso 0), `skills/sdd-templates/templates/patch-template.md` (§4), `tests/FrontendVerification.Tests.ps1` y `tests/frontend-verification-green.md`.

- [ ] **Step 1: Pester RED**, nuevo `Describe`:
  - `It 'lite carga la referencia y conserva la regla de cierre'`: `modo-lite.md` `Should -Match 'frontend-verification\.md'` y `Should -Match 'sin justificar'`.
  - `It 'el patch visual carga la referencia con la captura del antes'`: el paso 4 de `sdd-start-patch` `Should -Match '\.\./sdd-start-feature/references/frontend-verification\.md'`, `Should -Match 'antes'` y `Should -Match 'sin justificar'`.
  - `It 'la validación del patch enseña el detector'`: el paso 0 de `sdd-end-patch` `Should -Match 'detector'`.
  - `It 'la plantilla del patch tiene la fila del detector'`: §4 de `patch-template.md` `Should -Match 'detector'`.

  Ejecutarlo. Esperado: 4 fallos.
- [ ] **Step 2: Texto**, dirigido a lo que falló en k1 y n1:
  - `modo-lite.md`: «Si la lite cambia lo que se ve, su spec lleva en el Approach el criterio y la pantalla de referencia, y antes de presentar la validación aplicas [frontend-verification.md](frontend-verification.md): sobre el entorno del usuario si está levantado, detector en dos viewports, una captura por estado; no presentas con un hallazgo del detector abierto sin justificar».
  - `sdd-start-patch` paso 4, en el ajuste visual: la captura del antes y la del después, y la referencia enlazada con su regla de cierre y los dos avisos. El red flag de la captura añade «o sin la salida del detector (o su aviso) en §4».
  - `sdd-end-patch` paso 0: «con la ruta de cada captura y la salida del detector (o su aviso)», y si falta `§Frontend`, una línea que la propone.
  - `patch-template.md` §4: la fila `| 2 | *(ajuste visual)* detector en <viewports> | <hallazgos: resueltos · justificados> o «composición no medida» |`.
- [ ] **Step 3: Verificación.** El Pester en verde y después el GREEN de k1 y n1, 2 sujetos cada uno. Esperado:
  - k1: verifica sobre el puerto del usuario sin build ni suite nueva, entra por `/dev/impersonate` una vez, presenta el detector y una captura por estado, sin medidas computadas.
  - n1: captura del antes y del después, el aviso «composición no medida» y la verificación en menos de 5 min.

  Controles: la intención en una frase y `Changed` si llega al cierre (n1), y las capturas fuera de git. Sección de la Task 2 en `tests/frontend-verification-green.md`.
- [ ] **Step 4: Commit de la task**: `feat(sdd-start-patch): lite y el patch visual verifican con detector y captura`.

### Task 3 — La spec propone `§Frontend`, las init la preguntan y el README la recomienda

**Modelo**: hilo principal (Native). Los sujetos van en Sonnet por el lanzador.
**Tests RED**: hilo principal. `tests/FrontendVerification.Tests.ps1`, bloque `Describe 'Arranque e init'`. El RED de s1 e i1 ya corrió en la Task 1.
**Superficies**: docs (skills y README) · tooling (Pester).
**Verificación**: `pwsh -NoProfile -Command "Invoke-Pester -Path tests/FrontendVerification.Tests.ps1 -Output Detailed"` y el GREEN de s1 e i1.
**Verificación lenta**: el GREEN de s1 (2 sujetos) e i1 (1 sujeto), ~30 min, en segundo plano con su vigía.

**Interfaces**:
- Consume: de la Task 1, `red/subject.sh` con `s1` e `i1`, `$script:FrontendFields` y `Get-KitFile`.
- Produce: nada que use otra task.

**Ficheros**: modificar `skills/sdd-start-feature/SKILL.md` (paso 4), `skills/sdd-init-greenfield/SKILL.md` (la fila 21 y la línea de `.gitignore` del paso 3), `skills/sdd-init-brownfield/SKILL.md` (la fila 5 y la línea de `.gitignore` del paso 5), `README.md`, `tests/FrontendVerification.Tests.ps1` y `tests/frontend-verification-green.md`.

- [ ] **Step 1: Pester RED**, nuevo `Describe`:
  - `It 'el paso 4 propone §Frontend si falta'`: el texto entre `4. **Spec**` y `5. **Plan**` `Should -Match '§Frontend'`.
  - `It 'greenfield pregunta la verificación en la fila 21'`: `Should -Match '\| 21 \| Solo si el stack de la 11 tiene interfaz'`.
  - `It 'brownfield pregunta la verificación en la fila 5'`: `Should -Match '\| 5 \| Solo si el inventario encontró interfaz web'`.
  - `It 'las filas 20 de greenfield y 4 de brownfield no cambian'`: `Should -Match '\| 20 \| ¿Replica los patrones'` y `Should -Match '\| 4 \| ¿Replica los patrones'`.
  - `It 'el README recomienda impeccable y Playwright'`: la sección «Dependencias» `Should -Match 'impeccable'` y `Should -Match 'Playwright'`.

  Ejecutarlo. Esperado: 4 fallos; el de las filas 20 y 4 ya pasa, como control.
- [ ] **Step 2: Texto**, dirigido a lo que falló en s1 e i1:
  - Paso 4 de `sdd-start-feature`: «Si la feature cambia lo que se ve y `tech-stack.md` no tiene `§Frontend` (o le falta el acceso y la aplicación pide login), "Decisiones que he tomado yo" lleva la propuesta de `§Frontend` con sus campos rellenos, con impeccable, Playwright y el acceso que se ve en el código ([frontend-verification.md](references/frontend-verification.md)); al aprobar la spec, la escribes en `tech-stack.md`. Con `Detector: ninguno` ya escrito, no la vuelves a proponer.»
  - Fila 21 de greenfield: `| 21 | Solo si el stack de la 11 tiene interfaz: ¿con qué se verifica? Detector, runner E2E y cómo entra el agente en la aplicación; recomendados, impeccable y Playwright | tech-stack, §Frontend |`.
  - Fila 5 de brownfield: `| 5 | Solo si el inventario encontró interfaz web: ¿con qué se verifica? … | tech-stack, §Frontend |`.
  - La línea de `.gitignore` de las dos init añade «y la ruta de la sesión de `§Frontend`, si la declara».
  - README, «Dependencias»: dos filas opcionales, `impeccable` (`npx impeccable detect`, recomendada con interfaz) y Playwright (el MCP o el paquete), con la frase de que son las herramientas con las que se probó la verificación de frontend.
- [ ] **Step 3: Verificación.** El Pester entero en verde y después el GREEN de s1 (2 sujetos) e i1 (1 sujeto). Esperado:
  - s1: la spec lleva la propuesta de `§Frontend` en «Decisiones que he tomado yo», sin parada nueva antes del gate.
  - i1: la pregunta por el detector, el runner y el acceso, o `tech-stack.md` con `§Frontend`.

  Si la campaña pasa del techo, paro y decides tú. Sección de la Task 3 en `tests/frontend-verification-green.md`, con el resumen de la campaña: sujetos, $ y techo.
- [ ] **Step 4: Commit de la task**: `feat(sdd-init-greenfield): las init y la spec preguntan con qué se verifica el frontend`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,2 h
- Estimación de implementación: 5 h (texto ~1 h, campaña ~3,5 h, revisión final y validación ~30 min)
- Base de la estimación: tres tasks de texto y una campaña de 26 sujetos. Referencias: la de la 0098 (35 sujetos) y la de la 0077 (12 sujetos, con los visuales entre 21 y 32 turnos).
- Confianza: media. Lo que más varía es el reloj de los sujetos que levantan navegador y detector (q1, k1, a1).

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Minimal"` (la suite entera), desde la herramienta PowerShell.
- [ ] Verificación de cada THEN de la spec con su evidencia (`suite`, `ejecución real` o `no probado`).
- [ ] Spec satisfecha: cada requisito tiene su task (§4).
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-feature`).

---

## 4. Self-review (cobertura spec → tasks)

- `feature-flow`, MODIFIED «Una task que cambia la UI se mira en un navegador» → Task 1 (q1). ✓
- `feature-flow`, MODIFIED «La verificación visual se enseña con medidas y capturas» → Task 1 (q1, paso 7). ✓
- `feature-flow`, ADDED «Una feature lite que cambia la UI se verifica en el navegador» → Task 2 (k1). ✓
- `feature-flow`, ADDED «El agente entra en la aplicación solo como declara el proyecto» → Task 1 (a1, sin acceso) y Task 2 (k1, con acceso). ✓
- `feature-flow`, ADDED «Una spec que cambia lo que se ve propone `§Frontend` si falta» → Task 3 (s1). ✓
- `feature-flow`, Reglas de la capacidad → se fusionan en el cierre; los valores los fija el Pester de la Task 1. ✓
- `routing`, MODIFIED «Un patch visual se verifica con una captura y se registra como `Changed`» → Task 2 (n1). ✓
- `onboarding`, ADDED «La entrevista pregunta cómo se verifica el frontend» → Task 3 (i1 y el Pester de las filas). ✓
- Sin migración ni `control-profiles.md` → N/A (spec, decisiones 7 y 8). ✓

Todos los escenarios de la spec tienen su task; delegate sin gate de plan (comprobado el 2026-09-29).
