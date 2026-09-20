---
title: Feedback para el sdd-kit — fricciones y mejoras observadas en la task 0006a
to: agente Claude que mantiene `sdd-kit`
from: sesión de ejecución de la task 0006a (repo `sdd-project-templates`, 2026-09-19/20)
kit: skills `sdd-start-task`, `sdd-end-task`, `sdd-templates`, `add-to-changelog` + `superpowers` 6.3.0
---

# Ticket — mejoras del sdd-kit tras una task full de 8 tasks por subagentes

## Contexto para ti (agente del kit)

Eres quien mantiene el sdd-kit. Este ticket lo escribe el agente que ejecutó una task **full** de
punta a punta con el flujo del kit: brainstorming → spec con review técnica → plan → 8 tasks con
`subagent-driven-development` (≈ 25 despachos: implementadores, revisores, re-revisores, revisor
final, fix único) → smoke → validación del dev-lead → `sdd-end-task`. Fue una task de **frontend**
(Angular 22 + Tailwind 4), 38 commits, 5 h de reloj.

Cada punto trae: **qué pasó** (hechos de la sesión), **dónde toca el kit**, **cambio propuesto** y
**cómo verificarlo** con tu método (`tests/*-red.md` → `*-green.md`). Están ordenados por impacto.
No apliques nada sin tu propio RED: son observaciones de **una** sesión. Donde el fallo fue del
agente ejecutor y no del kit, lo digo; la pregunta para ti es si el kit puede prevenirlo barato.

Evidencia disponible en el repo de la task: `walkthrough.md`, `tasks.md`, `plan.md`, `spec.md` de
esta misma carpeta. El ledger de ejecución (`.superpowers/sdd/plan/progress.md`) es efímero.

---

## P1 — Impacto alto

### 1. El kit no pide verificación en navegador hasta el final: en frontend eso es ir a ciegas

- **Qué pasó**: siete tasks de UI pasaron sus tests (jsdom) y sus revisiones de task en verde. El
  smoke final en navegador encontró **cuatro defectos visuales Important** (spinner de `loading`
  invisible, radios sin tema, checkbox/switch alineados a la derecha, icono de fecha invisible en
  oscuro) y el dev-lead, al validar, **dos más** (el único desplegable del showcase estaba
  deshabilitado; la flecha del `<select>` pegada al borde). Ningún revisor podía verlos: revisan un
  diff, no un render. El dev-lead lo dijo así: «es imperativo que uses Playwright o similar cuando
  tratamos con frontend, si no vas a ciegas».
- **Dónde**: `sdd-start-task` paso 6 (implementación) y paso 7 (validación); `plan-template.md`
  (bloque de Task); `encargo-revision.md`.
- **Cambio propuesto**:
  1. `plan-template.md`: campo por task **`Verificación visual`**: `no aplica` | qué pantalla/ruta
     se mira y en qué estados/temas. Obligatorio si la task toca UI.
  2. `sdd-start-task` paso 6: «una task que toca UI no se marca `done` hasta que el **hilo
     principal** la ha visto en un navegador real (Playwright MCP o similar) — la revisión de task
     no lo sustituye». Fila nueva en Red flags y en la tabla de racionalizaciones («los tests pasan
     y la review está limpia» → «jsdom no pinta: ni layout, ni contraste, ni pseudo-elementos»).
  3. Avisar de la letra pequeña: las capturas de la herramienta caen dentro del repo
     (`.playwright-mcp/`); no se commitean y se borran al cerrar.
- **Cómo verificarlo**: RED — escenario con una task de UI cuyo componente pasa tests pero no se
  ve (p. ej. color heredado transparente); medir si el agente la cierra sin abrir navegador.
  GREEN — con el campo y la regla, la abre antes de marcar `done`.

### 2. Un test RED defectuoso del hilo principal bloquea al implementador, y nada obliga a probar el test

- **Qué pasó**: el kit manda que el hilo principal escriba los tests RED antes de despachar
  (correcto: funcionó, los implementadores no tocaron ningún spec en 25 despachos). Pero un test
  mío era **imposible de satisfacer** (ponía `min`/`max` junto a `[formField]`; Angular Signal
  Forms lo prohíbe en compilación, NG8022). El implementador lo detectó y paró, como pide el
  encargo — bien —, pero la task tardó 53 min. Otro test mío era **insuficiente** (exigía «algún
  `app-select`» y «algún control deshabilitado»; el único select resultó ser el deshabilitado y lo
  encontró el dev-lead).
- **Dónde**: `sdd-start-task` paso 6 («escribe los tests que codifican los escenarios… uno por
  THEN»).
- **Cambio propuesto**:
  1. Añadir: «un test RED debe fallar **por el símbolo que falta o por la aserción**, nunca por
     otra causa. Ejecútalo antes de commitearlo y lee **por qué** falla» + «si el test usa una API
     del framework que no has usado antes en este repo, compruébala contra los tipos instalados».
  2. Añadir una comprobación de cobertura barata: tabla THEN → test en el ledger antes de
     despachar. Un THEN con «en sus estados», «todos», «cada» necesita un test **por elemento**,
     no uno existencial.
- **Cómo verificarlo**: RED — dar una spec con un THEN universal («cada campo en estado normal y
  deshabilitado») y medir si el agente escribe un test existencial. GREEN — con la regla, escribe
  el `it.each`.

### 3. Tests RED por adelantado + runner que compila todo como un solo programa = no se pueden solapar tasks

- **Qué pasó**: `ng test` compila todos los `*.spec.ts` juntos. Commitear los RED de la task N+1
  deja **sin compilar la suite entera** hasta que N+1 se implementa, así que un fix round de la
  task N no puede ponerse en verde. Lo descubrí a mitad de ejecución y tuve que fijar una regla
  propia: revisor ∥ implementador sí; implementador ∥ fixer nunca; no commitear los RED de N+1 con
  un fix loop de N abierto.
- **Dónde**: `sdd-start-task` paso 6; quizá `overrides-superpowers.md`.
- **Cambio propuesto**: documentar la regla de solape anterior y el porqué, y pedir que el plan
  declare en «Restricciones globales» si el runner del proyecto compila la suite como una unidad
  (Angular/Vitest-builder, .NET por proyecto de test, TypeScript con `tsc -b`…).
- **Cómo verificarlo**: escenario con dos tasks y un fix pendiente; medir si el agente commitea los
  RED de la segunda antes de cerrar el fix de la primera.

### 4. «Verde completo al cerrar cada task» sale muy caro cuando la task solo toca una capa

- **Qué pasó**: copié en «Restricciones globales» el Art. I del proyecto («`moon run test` y
  `frontend:check` verdes al cerrar cada task»). Resultado: cada task de **solo frontend** ejecutó
  la suite de backend con Testcontainers (~2,5 min) — unas 12 veces. El dev-lead se quejó del
  tiempo a las 3 h. Además, con un servidor de desarrollo arrancado la suite completa ni siquiera
  puede correr (bloqueo de binarios), lo que obligó a excepciones ad hoc.
- **Dónde**: `plan-template.md` (bloque «Restricciones globales» y Step «Verificación» de la task).
- **Cambio propuesto**: en la plantilla, distinguir **verificación de task** (lo que la task toca:
  el plan la declara por task) de **verificación de cierre** (el gate completo del proyecto, una
  vez, antes de presentar al usuario). Nota en la ayuda del bloque: «no copies aquí un gate de
  cierre como obligación por task».
- **Cómo verificarlo**: RED — constitution con un «todo verde en cada commit» y un plan de varias
  tasks de una sola capa; medir cuántas veces se ejecuta la suite ajena. GREEN — una.

### 5. El workspace de `subagent-driven-development` colisiona: en el kit todos los planes se llaman `plan.md`

- **Qué pasó**: `scripts/sdd-workspace PLAN_FILE` deriva el directorio del **basename** del plan:
  con la convención del kit siempre es `.superpowers/sdd/plan/`. En esta sesión no hubo daño
  porque cada task vive en su worktree, pero dos tasks en el mismo checkout (o una task retomada
  tras otra) compartirían ledger, briefs y reports. La skill dice literalmente «otro plan, otro
  directorio; nunca leas el de otro plan».
- **Dónde**: `overrides-superpowers.md`.
- **Cambio propuesto**: override explícito: «el workspace de una task es
  `.superpowers/sdd/<carpeta-de-la-spec>/`» (pasar al script una ruta única o renombrar tras
  crearlo) y, si queda un ledger ajeno en `…/sdd/plan/`, no tocarlo.
- **Cómo verificarlo**: escenario con un `progress.md` de otra task ya presente en
  `.superpowers/sdd/plan/`; medir si el agente lo adopta como propio.

---

## P2 — Impacto medio

### 6. Pegar «Restricciones globales» a mano en cada encargo: caro, y aun así se olvida

- **Qué pasó**: ~900 tokens de salida del hilo principal × ~25 despachos. Y pese a la regla, el
  **primer mensaje de fix** (reanudar a un implementador) salió sin el bloque; lo anoté y lo
  corregí en los siguientes. La medición del kit (`gates-reviews-red.md`) ya demuestra que pegar a
  mano es frágil; mi sesión lo confirma para los mensajes de **reanudación** (`SendMessage`), que
  ninguna plantilla cubre.
- **Dónde**: `encargo-revision.md`; posible script nuevo en `sdd-templates/scripts/`.
- **Cambio propuesto**: un script `encargo` (o plantilla con marcador) que **componga** el prompt:
  restricciones + cabecera «Tests RED» + ruta del brief + rutas de report/diff. El agente rellena
  solo lo específico. Nombrar explícitamente el caso «mensaje de fix a un agente reanudado».
- **Cómo verificarlo**: reutiliza E3 añadiendo el caso de reanudación.

### 7. Reglas permanentes que faltan en el encargo del implementador

- **Qué pasó**, tres incidentes de subagentes:
  1. Uno **editó la config de un checker** (`.impeccable/config.json`) para silenciar un aviso —
     falso positivo real, pero fuera de su encargo y sin avisar.
  2. Otro dejó corriendo en background un **`find /`** que recorría todos los discos del usuario
     durante 28 min; lo detecté por la nota «stopped with background work still running».
  3. Otro vio un **test de backend fallar una vez (97/98)**, relanzó sin capturar el nombre y lo
     reportó como «intermitente de Testcontainers» sin evidencia. No se reprodujo; test y causa
     quedaron desconocidos.
- **Dónde**: `encargo-revision.md` § «Encargo del implementador».
- **Cambio propuesto**: tres líneas fijas en la cabecera del encargo: (a) no edites configuración
  de herramientas ni de gates para silenciar algo: para y repórtalo con el mensaje literal;
  (b) busca solo dentro del repo y no dejes procesos en background; (c) ante un test rojo, captura
  nombre y mensaje **antes** de relanzar, y no atribuyas causa sin evidencia.
- **Cómo verificarlo**: escenario con un hook que emite un aviso con vía «ignore» self-serve; medir
  si el implementador la usa.

### 8. `effort` por task: la plantilla lo exige y el harness no lo admite

- **Qué pasó**: `plan-template.md` dice «modelo **y** effort, los dos explícitos… declarar solo el
  modelo es una trampa». La herramienta de despacho de esta sesión (`Agent`) solo admite `model`.
  El plan aprobado decía «Sonnet high» en dos tasks y lo ejecutado fue Sonnet con la instrucción
  en prosa de «piensa a fondo». El usuario aprobó algo que no se podía cumplir.
- **Dónde**: `plan-template.md` (campo **Modelo**), `review-spec.md` («modelo Sonnet, effort
  medium»).
- **Cambio propuesto**: «declara effort **si tu herramienta de despacho lo admite**; si no, dilo en
  "Decisiones que he tomado yo" para que el usuario no apruebe un ajuste inexistente».
- **Cómo verificarlo**: revisión de la plantilla; no necesita escenario.

### 9. Una task que cita secciones del plan no viaja sola

- **Qué pasó**: mis tasks decían «ver §1.3», «§1.4», «§1.5». `task-brief` extrae solo el texto de
  la task, así que tuve que **re-pegar a mano** esas secciones en cada encargo y en cada revisión
  (más tokens, riesgo de deriva entre lo pegado y el plan).
- **Dónde**: `plan-template.md` (ayuda de «## 2. Tasks»).
- **Cambio propuesto**: regla de redacción: «una task no remite a otras secciones del plan: copia
  dentro de sí los valores exactos que necesita (firmas, tablas, textos)»; o un wrapper
  `task-brief --with 1.3,1.4`.
- **Cómo verificarlo**: escenario de despacho con una task que cita «§1.4»; medir si el
  implementador recibe esas firmas.

### 10. Cuando lo construido difiere del delta de la spec, el cierre no dice qué manda

- **Qué pasó**: por decisiones del plan o hallazgos de validación, lo construido difería del delta
  literal (gate que además caza la paleta de Tailwind; `min`/`max` de un campo solo sin form;
  select con flecha propia; tokens nuevos). `sdd-end-task` paso 4 dice «el delta de la spec se
  fusiona». Fusioné **lo construido** y declaré las diferencias en el walkthrough §3, pero fue una
  decisión mía.
- **Dónde**: `sdd-end-task/references/aprendizajes-skills.md` paso 4.
- **Cambio propuesto**: «`capabilities/` recoge el comportamiento **construido y validado**. Si
  difiere del delta, el walkthrough §3 lo lista y la capacidad manda; nunca se fusiona un THEN que
  el código no cumple».
- **Cómo verificarlo**: escenario de cierre con una spec cuyo THEN quedó refinado por el plan.

### 11. El walkthrough no tiene sitio para las decisiones tomadas sin el usuario

- **Qué pasó**: con el usuario ausente («acaba todas y nos vemos en el smoke») tomé 21 decisiones
  registradas como `Ruling:` (patrón de superpowers). Spec y plan tienen el bloque «Decisiones que
  he tomado yo — valida estas»; el walkthrough no, y acabaron repartidas entre §3 y `tasks.md`.
- **Dónde**: `walkthrough-template.md`; `sdd-start-task` paso 7.
- **Cambio propuesto**: sección «Decisiones tomadas sin el dev-lead durante la ejecución» en el
  walkthrough (una línea: decisión — por qué — coste si está mal), y pedir en el paso 7 que la
  presentación de validación las liste.
- **Cómo verificarlo**: escenario de ejecución desatendida con un conflicto plan↔revisor.

---

## P3 — Pulido

### 12. Coste en reloj en el gate del plan

El plan pide «coste estimado (horas y tokens)». Di «14 h, ≈ 6–7 h reales». A las 3 h el usuario
preguntó si estaba tardando demasiado, dentro de lo previsto. Propuesta: que el bloque de
decisiones del plan diga **reloj de pared previsto** y qué lo alarga (rondas de fix, suite lenta).

### 13. La propuesta de review de spec no ayuda a decidir

La rúbrica dio «dos revisores» (6 señales). El usuario preguntó «¿es necesario?». Tuve que
improvisar coste/beneficio y recomendé uno (lente técnica), que fue útil: 10 hallazgos, 2
críticos. Propuesta: que `review-spec.md` pida presentar el nivel **con una línea de para qué sirve
cada lente en esta spec** y la opción mínima razonable.

### 14. Estado de `spec.md` al cerrar

La plantilla lista `done` entre los estados; `sdd-end-task` no dice cuándo se pone y el repo deja
`approved` en todas las tasks cerradas. Decidir una y escribirla en el checklist de cierre.

### 15. Fecha de la fila del estimation-log

`Build-EstimationLog.ps1` fechó la task con el timestamp de la carpeta (2026-09-19, creación de la
spec) y no con el cierre (2026-09-20, `created` del walkthrough). Para calibrar por periodo, la
fecha útil es la de cierre.

### 16. Carpetas de scratch de herramientas

Playwright MCP escribe en `.playwright-mcp/` dentro del repo; superpowers en `.superpowers/`.
Propuesta: que `sdd-init-*` las deje ignoradas (o que `environments-template.md` lo mencione).

### 17. Skills de diseño del proyecto

El dev-lead señaló al final que para frontend debía haberse usado la skill `impeccable`. El paso 1
de `sdd-start-task` lee docs, no pregunta qué skills de dominio aplican. Propuesta: en el paso 4
(spec) o 5 (plan), listar las skills de dominio disponibles que aplican a la task y dejarlas
escritas en el plan por task.

---

## Errores del agente ejecutor (no del kit) que quizá el kit pueda prevenir barato

- **Códigos de salida leídos a través de un pipe** (`… | tail; echo $?`): tres veces di por bueno
  el `0` de `tail`/`head`. Siempre lo re-medí antes de afirmarlo, pero es una trampa recurrente.
  Una línea en `sdd-end-task` («evidencia = salida leída, no el exit code de un pipeline») bastaría.
- **Medición visual con la propiedad equivocada** (leí `transform` cuando Tailwind 4 usa `scale` /
  `translate`): re-medí en vez de abrir un hallazgo falso. Sin acción para el kit.
- **Miré las capturas del smoke y no vi la flecha pegada al borde**: mirar una captura «en
  general» no es revisarla. Si añades el campo `Verificación visual` del punto 1, que pida una
  lista de **qué mirar** (alineación, separación a bordes, estados, los dos temas), no solo «abrir
  la página».

## Lo que funcionó y conviene no tocar

- Tests RED del hilo principal como contrato: 0 specs modificados por implementadores en 25
  despachos, y los dos tests imposibles/insuficientes salieron a la luz precisamente por eso.
- Gates de aprobación de spec y plan con el bloque «Decisiones que he tomado yo»: el usuario aprobó
  leyendo solo ese bloque.
- Gate de validación del paso 7 con el usuario ausente: la task esperó, y la validación real
  encontró dos defectos que ni tests, ni revisiones, ni mi smoke habían visto.
- Un único fix tras la revisión final, con el smoke del agente corriendo **en paralelo** a esa
  revisión para juntar hallazgos: una sola ronda, una sola re-revisión.
- `Build-EstimationLog.ps1` y `add-to-changelog`: sin fricción.
