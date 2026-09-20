---
release: v1.1.0
title: Acta de release — v1.1.0
created: 2026-09-20
source: cinco tickets de campo de agentes que usaron el kit 1.1.0 en proyectos reales (2026-09-18 a 2026-09-20) y peticiones directas del dev-lead (2026-09-14 a 2026-09-20); sin demo de cliente
---

# Acta de release — v1.1.0 (2026-09-20)

Fuente: los cinco tickets archivados en [`../../field-reports/`](../../field-reports/) —copiados literales desde scratchpads y worktrees efímeros— más las peticiones del dev-lead recogidas en sesión. Sin demo ni cliente externo: el cliente del kit es el propio equipo.

| Clave | Ticket | Proyecto y task |
| --- | --- | --- |
| FR-0004 | [20260918-task-0004-capabilities-merge.md](../../field-reports/20260918-task-0004-capabilities-merge.md) | `sdd-project-template`, task 0004 (auth) |
| FR-0005 | [20260919-task-0005-field-findings.md](../../field-reports/20260919-task-0005-field-findings.md) | `sdd-project-template`, task 0005 (traducciones en BD) y patch 0000 |
| FR-0008 | [20260920-task-0008-init-template.md](../../field-reports/20260920-task-0008-init-template.md) | `sdd-project-template`, task 0008 (esqueleto SDD + `init-template`) |
| FR-SL | [20260920-statusline-init-greenfield.md](../../field-reports/20260920-statusline-init-greenfield.md) | `statusline`, `sdd-init-greenfield` sobre un proyecto mínimo con código |
| FR-0006a | [20260920-task-0006a-ui-subagents.md](../../field-reports/20260920-task-0006a-ui-subagents.md) | `sdd-project-template`, task 0006a (frontend, 8 tasks, ≈ 25 despachos) |

**Versión.** La 1.1.0 se publicó de hecho el 2026-09-09 —bump en el cierre de T19— y se usó en tres proyectos sin haberse cerrado: el changelog seguía en `[Unreleased]`, sin tag ni acta. Este cierre es la formalidad pendiente; el scope no cambia.

**Cómo leer las verificaciones.** Cada afirmación de un ticket sobre el kit se contrastó con las skills antes de apuntarse; el detalle (fichero y línea) está en la fila correspondiente de la tabla de deuda del [roadmap](../../roadmap.md). «Sin verificar» significa que no se ha contrastado todavía.

## 1. Inventario y triage

**Decisión del dev-lead (2026-09-20), global y no item a item**: «empezamos la nueva […] con todo lo que hemos encontrado». Todas las filas quedan por tanto en `release-siguiente`. La columna Recomendación conserva el criterio del agente donde difiere: es la entrada para que `sdd-start-release` ordene, parta en tramos y, si el dev-lead quiere, recorte.

### Capabilities — prioridad declarada por el dev-lead

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | La fusión del delta en `capabilities/` como paso propio y numerado del cierre, con red flag y racionalización | FR-0004 P1–P2 | `sdd-end-task` | release-siguiente | **release-siguiente** |
| 2 | Regla de reparto: comportamiento observable solo en `capabilities/`; los anclajes enlazan, no copian. Punto nuevo en el revisor de spec | FR-0004 P3–P4 | `spec-template`, `plan-template`, `review-spec` | release-siguiente | **release-siguiente** |
| 3 | Declarar que el enlace a una capacidad nueva cuelga hasta el cierre; alternativa `status: draft` | FR-0004 P5 | `sdd-start-task` | una frase sí; el borrador, backlog: sin evidencia de que haga falta | **release-siguiente** |
| 4 | Decisión de capacidad **obligatoria**, no condicional; test de pertenencia; punto de pertenencia en la lente dominio; quitar «Capacidad nueva» como señal de la rúbrica; alarma en el cierre sin crear nada; aviso en las init si la primera capacidad se llama como el producto | FR-0005 §1 (P1.1–P1.6) | `sdd-start-task`, `spec-template`, `review-spec`, `sdd-end-task`, `sdd-init-*` | release-siguiente — el incentivo invertido de la rúbrica es la causa, lo demás son redes | **release-siguiente** |
| 5 | `MODIFIED` aditivo: hoy la letra recorta la capacidad al fusionar | FR-0008 §4 | `spec-template`, `review-spec`, `sdd-end-task` | release-siguiente, **adoptando la regla de OpenSpec** (copiar el bloque entero del requisito) en vez de inventar `EXTENDED` | **release-siguiente** |
| 6 | Regla del idioma del slug (`inglés kebab-case`, lo aprueba el dev-lead) en el punto de uso; hoy solo vive en `migrations/v1.1.0.md` | FR-SL A1 · dev-lead 2026-09-20 | `capability-template`, `sdd-init-greenfield` | release-siguiente | **release-siguiente** |
| 7 | Volcado inicial de capacidades desde el código como excepción con condiciones; formato de historial para ese volcado; campo opcional `Cobertura` por requisito | FR-SL B5 · dev-lead 2026-09-20 | `capability-template`, `sdd-init-*` | decisión de diseño del dev-lead: hoy el kit lo prohíbe por escrito en las dos init | **release-siguiente** |
| 8 | Cuando lo construido difiere del delta, qué manda al fusionar: «`capabilities/` recoge lo **construido y validado**; nunca se fusiona un THEN que el código no cumple» | FR-0006a §10 | `sdd-end-task` | release-siguiente — quinta deuda sobre capabilities y la que más se acerca a falsear la verdad viva | **release-siguiente** |
| 9 | Un sitio único para las reglas de capabilities: skill `sdd-capability` frente a referencia en `sdd-templates`; validador determinista (`Test-Capabilities.ps1`) al estilo de `openspec validate`; inventario inyectado con `` !`comando` `` | consulta del dev-lead 2026-09-20 | nuevo | release-siguiente; la forma la decide un RED de cuatro brazos | **release-siguiente** |

### Skills de init

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| 10 | Modo «greenfield sobre template» por predicado observable (`sdd-template: pending`); decidir el contrato del marcador | FR-0008 §1 · B4 del roadmap | `sdd-init-greenfield` | release-siguiente | **release-siguiente** |
| 11 | Entrevista como tabla numerada con destino por pregunta; dos racionalizaciones nuevas (autorización genérica, nota visible como salvoconducto) | FR-0008 §1–§2 | `sdd-init-greenfield` | release-siguiente | **release-siguiente** |
| 12 | Greenfield con código previo: leer stack y arquitectura del código; paso de git para repo existente; git-flow como default declarado; overrides de `brainstorming`; no re-preguntar lo que fija el `CLAUDE.md` global; tests RED por el hilo como principio por defecto | FR-SL B1, A7, A8, B2, C1, C2 | `sdd-init-greenfield` | release-siguiente | **release-siguiente** |
| 13 | Forma de lo que la init crea: secciones mínimas por documento y texto literal de lo que otra skill parsea; `estimation-log` vacío; criterio único de `capabilities/` entre las dos init; opcionales en el árbol; `VERSION` y criterio de canal; `CLAUDE.md` dentro del gate; estado de init en curso; pasos sin herramienta de todos; «no aplica» en el paso 1; definir «nivel 2»; gate agrupado para documentos sin decisiones nuevas | FR-SL A2–A6, B3, B4, B6, B7, C3, C4 | `sdd-init-greenfield`, `estructura.md` | release-siguiente lo que otra skill parsea y la contradicción entre las init; el resto, según quepa | **release-siguiente** |
| 14 | Plantilla `estimation-template.md` con el método genérico (tercer reporte independiente) | FR-0008 §5 · FR-SL A2 | `sdd-templates` | release-siguiente — barata y repetida | **release-siguiente** |
| 15 | Las init nombran dónde vive `Build-EstimationLog.ps1` | dev-lead 2026-09-14 | `sdd-init-*` | release-siguiente | **release-siguiente** |
| 16 | El carril release como módulo opcional que la init pregunta | dev-lead 2026-09-14 | `sdd-init-*`, `nombrado.md`, `sdd-start-release` | release-siguiente | **release-siguiente** |
| 17 | `autoMemoryEnabled: false` en las init, migración para proyectos existentes y paso de migrar lo ya memorizado | dev-lead 2026-09-20 | `sdd-init-*`, `migrations/`, README | release-siguiente | **release-siguiente** |
| 18 | Un anclaje pospuesto no tiene vía de retorno; `sdd-end-task` pierde aprendizajes en silencio si falta `architecture.md` | dev-lead 2026-09-15 | `sdd-start-task`, `sdd-end-task`, `sdd-consult` | release-siguiente — impacto alto y acumulativo | **release-siguiente** |
| 19 | Ignorar las carpetas de scratch de herramientas (`.playwright-mcp/`, `.superpowers/`) | FR-0006a §16 | `sdd-init-*` | release-siguiente, una línea | **release-siguiente** |

### Gates, ejecución por subagentes y coste

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| 20 | «Verificado» distingue suite de ejecución real: fila por THEN con evidencia de valores cerrados; el smoke provoca de verdad los THEN de fallo | FR-0005 §3 (P3.1–P3.3) | `sdd-start-task` paso 7, `walkthrough-template` | release-siguiente | **release-siguiente** |
| 21 | Frontend: verificación visual **por task**, no solo al final — campo `Verificación visual` en el plan con qué mirar, regla de paso 6, red flag y racionalización | FR-0006a §1 · dev-lead: «es imperativo que uses Playwright o similar cuando tratamos con frontend, si no vas a ciegas» | `plan-template`, `sdd-start-task`, `encargo-revision` | release-siguiente, junto a la 20: segundo reporte independiente (cuatro defectos en FR-0005, seis en FR-0006a) | **release-siguiente** |
| 22 | Calidad del test RED del hilo: falla por el símbolo o la aserción y se lee **por qué** falla; pasa lint y formateador antes de commitearse; un THEN universal («cada», «todos») pide test por elemento, no existencial; tabla THEN → test antes de despachar; la cabecera del implementador admite cambios de formato | FR-0005 §5 · FR-0006a §2 | `sdd-start-task` paso 6, `encargo-revision` | release-siguiente | **release-siguiente** |
| 23 | Regla de solape cuando el runner compila la suite como una unidad: no commitear los RED de N+1 con un fix de N abierto; el plan lo declara | FR-0006a §3 | `sdd-start-task`, `plan-template` | release-siguiente | **release-siguiente** |
| 24 | Verificación de **task** (lo que toca) frente a verificación de **cierre** (el gate completo, una vez): una suite de backend corrió ~12 veces en una task de solo frontend | FR-0006a §4 | `plan-template` | release-siguiente — coste directo de reloj | **release-siguiente** |
| 25 | Coste de revisión: sección «Fuera del alcance del revisor», separar restricciones de código y de proceso, revisión proporcional al diff, tolerancia declarada en umbrales | FR-0005 §4 (P4.1–P4.4) | `encargo-revision`, `plan-template` | release-siguiente | **release-siguiente** |
| 26 | Componer el encargo con un script o plantilla con marcador en vez de pegar las restricciones a mano; cubrir el mensaje de fix a un agente reanudado | FR-0006a §6 | `encargo-revision`, `sdd-templates/scripts` | release-siguiente si el RED confirma el olvido en reanudación | **release-siguiente** |
| 27 | Tres reglas fijas en el encargo del implementador: no editar configuración de herramientas ni gates; buscar solo dentro del repo y sin procesos en background; ante un test rojo, capturar nombre y mensaje antes de relanzar | FR-0006a §7 | `encargo-revision` | release-siguiente — el `find /` de 28 min y el checker silenciado son daño real | **release-siguiente** |
| 28 | `effort` que el harness no admite: tercer reporte. Vías: condicionar la exigencia, definiciones de agente, o skills con `model`/`effort`/`context: fork` | FR-0008 §6 · FR-0006a §8 | `plan-template`, `review-spec` | release-siguiente, **antes** que la 25 (P4.3 heredaría el defecto) | **release-siguiente** |
| 29 | Una task del plan viaja sola: no remite a otras secciones, copia los valores que necesita | FR-0006a §9 | `plan-template` | release-siguiente, una regla de redacción | **release-siguiente** |
| 30 | El workspace de `subagent-driven-development` colisiona porque en el kit todo plan se llama `plan.md` → `.superpowers/sdd/plan/` (verificado en el script `sdd-workspace` de superpowers) | FR-0006a §5 | `overrides-superpowers` | release-siguiente, un override | **release-siguiente** |
| 31 | Usuario ausente: qué manda entre «decide con el usuario» y «no pares, anota el ruling»; todo fix del hilo pasa por revisión; bloque «Me salí del plan en…» y sección de decisiones sin el dev-lead en el walkthrough | FR-0005 §6 · FR-0006a §11 | `overrides-superpowers`, `sdd-start-task`, `walkthrough-template` | release-siguiente | **release-siguiente** |
| 32 | Estado «validación diferida» con condición de validez (usuario presente, frase literal, task con dueño); qué hacer con el walkthrough «inmutable»; símbolo del roadmap | FR-0005 §7 · FR-0008 §3 | `sdd-start-task`, `sdd-end-task`, `walkthrough-template` | release-siguiente — dos casos independientes | **release-siguiente** |
| 33 | Modelo para tasks en paralelo: detectar otras tasks abiertas, integrar la base **antes** de escribir el cierre, receta por fichero compartido, repetir gates tras integrar | FR-0005 §2 (P2.1–P2.4) | `sdd-start-task`, `sdd-end-task` | release-siguiente — y aplicable a esta misma release, que se trabajará en worktrees | **release-siguiente** |
| 34 | El estimation-log registra coste en tokens y modelos | dev-lead 2026-09-15 | `walkthrough-template`, script | release-siguiente, con salida honesta «no medido» | **release-siguiente** |

### Enrutado y pulido

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| 35 | Auto-enrutado: frases naturales en las `description` y hook `SessionStart` condicionado a `.docs/sdd/`; repaso del frontmatter | compañeros del dev-lead 2026-09-20 · B5 del roadmap | las 11 skills, `hooks/` nuevo | release-siguiente, midiendo antes: T13 ya midió que la `description` dispara sola ante «implementa la task N» | **release-siguiente** |
| 36 | Pulido de la ejecución: gate 1 con la rama ya nombrada; paso 10 con el merge ya ordenado; reloj de pared en el gate del plan; la propuesta de review de spec dice para qué sirve cada lente y la opción mínima; estado de `spec.md` al cerrar *(sin verificar)*; fecha de cierre en la fila del log *(sin verificar)*; skills de dominio listadas en el plan; «evidencia = salida leída, no el exit code de un pipeline» | FR-0008 §7 · FR-0006a §12–§15, §17 y errores del ejecutor | varias | backlog salvo lo que caiga en una skill que ya se toque | **release-siguiente** |
| 37 | Método de test: la aprobación de un sujeto va en el encargo inicial, no por `SendMessage`; las pruebas de generadores de entorno van contra un directorio temporal | FR-0008 §7 · FR-0005 nota final | `tech-stack.md`, `environments-template` | release-siguiente, son dos líneas | **release-siguiente** |
| 38 | **Ids de task autoincrementales para proyectos sin gestor de tickets.** Hoy `<id>` es el ticket del gestor y `0000` si no hay (`nombrado.md:7`, `spec-template.md:3`, `sdd-start-patch:36`); en los proyectos de trabajo con Azure DevOps va bien, en los personales todo sale `0000`. Verificado el coste: la rama es `feature/<ticket>` (`sdd-start-task:34`), así que **dos tasks sin ticket en worktrees paralelos chocan en `feature/0000`**, y la columna Task del estimation-log y el `<id>` del changelog quedan inservibles. `sdd-project-template` ya numera de hecho (0004, 0005, 0006a, 0008) por acuerdo con el dev-lead, que es lo único que el kit prevé: «sin gestor a la vista, la numeración se acuerda con el usuario» (`roadmap-fuente.md:5`) | dev-lead 2026-09-20 | `sdd-init-*`, `nombrado.md`, `sdd-start-task`, `sdd-start-patch`, `sdd-start-release`, `sdd-consult` | release-siguiente, y **antes de abrir worktrees**: afecta a esta misma release, cuyas tasks son todas `0000`. Diseño propuesto: modo de ids **por proyecto**, decidido en el bloque (d) de la entrevista (que ya pregunta por el gestor) y guardado en `sdd-kit.json` — `gestor` o `secuencia`. En modo secuencia el id lo **reserva el hilo principal al planificar** (fila del roadmap), no el agente de la task: es la única forma de que dos worktrees no cojan el mismo número; para una task no planificada, script determinista en `sdd-templates/scripts/` (mayor id en `specs/` y roadmap + 1, cuatro dígitos). Hay que reconciliarlo con «los ids de ticket no se inventan» (`sdd-consult:37`, `sdd-start-release:58`): en modo secuencia el generador es el kit, no es inventar. Decisiones del dev-lead: ¿una sola secuencia para tasks y patches?, ¿sufijos tipo `0006a` para tasks partidas? | **release-siguiente** |

**Lo que los tickets piden no tocar** (funcionó): las cinco reglas de producto preguntadas por nombre, el gate «sin entrevista no hay documentos» y «pendiente» como estado válido (FR-SL D); los tests RED del hilo como contrato —0 specs modificados por implementadores en 25 despachos—, el bloque «Decisiones que he tomado yo», el gate de validación con el usuario ausente y el fix único tras la revisión final con el smoke en paralelo (FR-0006a).

**Inventario provisional en la tabla de deuda.** Durante estos días los hallazgos se apuntaron en «Deuda técnica» del roadmap porque no había release abierta que los recibiera. Es el sitio equivocado para peticiones que cambian el producto; `sdd-start-release` los reubica en el plan de la release.

## 2. Cambios de requisito detectados

- **`capability-template.md`, regla 4 («no se vuelca»)** y sus gemelas en las dos init — el dev-lead pidió un volcado inicial en el proyecto `statusline` y el ticket FR-SL argumenta la excepción. Contradice el supuesto; lo decide el dev-lead en la release siguiente.
- **«Sin validación no hay cierre»** (`walkthrough-template.md`, `sdd-end-task`) — dos veces el dev-lead, presente y preguntado, difirió la validación a conciencia. El supuesto de que solo existen «validó» y «EN ESPERA» no se sostiene.
- **Walkthrough «inmutable»** — el propio flujo obligó a editarlo cuatro veces tras el cierre (FR-0005 §7).
- **`MODIFIED` = «sustituye»** (`aprendizajes-skills.md`) — aplicado a la letra recorta la capacidad cuando el cambio es aditivo; un agente fusionó contra la regla para no perder contenido (FR-0008 §4).
- **«El delta de la spec se fusiona»** — cuando lo construido difiere del delta, otro agente fusionó lo construido por decisión propia (FR-0006a §10).

## 3. Retro

- **Agregado de la release** (estimation-log, regenerado en este cierre): una task y un patch — T19 english-file-names 1,5 h → 1,0 h (0,67) y el patch del parser 1,5 h → 1,2 h (0,8). Total estimado **3,0 h** · real **2,2 h** · ratio **0,73**.

- **Comprobación de los action items de v1.0.0**:
  - **[A8] Feedback de la migración real de Alybo y MDT** — **pendiente, arrastrado una vez**: no hay reporte de esos dos proyectos. Sí volvió un patch desde una migración real, la de LegalRep.pro (parser del log de estimación, 2026-09-10), que es justo el mecanismo que A8 describía.
  - **[A9] Estimar los ciclos Art. I en minutos de campaña** — **no medible**: la 1.1.0 no tuvo ninguna task de tipo docs. Se arrastra a la siguiente, que tendrá muchas.
  - **[A10] Medir la lente dominio con las cinco reglas** — **pendiente, arrastrado una vez**: ninguna task tocó `review-spec.md`. La release siguiente lo toca por varias vías (filas 2, 4 y 5), así que ahí se mide o se descarta explícitamente.

- **Qué funcionó**:
  - **El uso real devolvió más en cuatro días que las campañas en semanas**: cinco tickets de agentes ejecutores, con rutas del kit que permitieron verificar cada afirmación. De las contrastadas, todas resistieron menos una del propio mantenedor («ninguna skill fija el idioma del slug»: sí lo fija una migración).
  - **Pedir el ticket al agente que ejecutó la task, al terminarla**, con qué pasó, por qué el kit no lo evitó, propuesta y escenario RED. El formato se afinó solo de un ticket al siguiente.
  - **El hook de pre-commit** mantuvo Pester en verde en cada commit de la release (149 tests).
  - **OpenSpec como estado del arte** dio respuesta directa a una deuda (`MODIFIED` copiando el bloque entero) y respaldo a otra (capacidad obligatoria con opt-out).

- **Qué corregir**:
  - **Se publicó sin cerrar**: bump el 2026-09-09, cierre formal el 2026-09-20. Once días con el changelog en `[Unreleased]`, sin tag y sin acta, mientras tres proyectos la usaban.
  - **El estimation-log no se regeneró tras el último patch**: faltaba su fila, y era precisamente el patch que arreglaba filas perdidas. Se regeneró en este cierre.
  - **Los tickets vivían en sitios efímeros**: el worktree de la task 0008 ya no existía un día después. Desde el 2026-09-20 se copian a `field-reports/` al recibirlos.
  - **El conocimiento del mantenedor estaba en la memoria del agente**, local a una máquina. Migrado a los docs y desactivada la memoria automática en este repo.
  - **38 peticiones para una sola release contradice «release pequeña primero»** (T15): la siguiente debe partirse en tramos con smoke por tramo.

- **Action items nuevos** (verificables):
  - **[A11] Cerrar la release el mismo día del bump** — se verifica comparando la fecha del commit que sube `plugin.json` con la del tag anotado de la release siguiente.
  - **[A12] Todo ticket de campo se copia a `field-reports/` al recibirse** — se verifica con que el roadmap y el acta siguiente no citen ninguna ruta de scratchpad o worktree como fuente.
  - **[A13] La release siguiente se planifica en tramos con smoke por tramo** — se verifica con las líneas «smoke:» por tramo en su acta.
  - Se arrastran **[A8]**, **[A9]** y **[A10]**; A8 y A10 van por su segundo arrastre: en la próxima acta se resuelven o se descartan explícitamente.

- **Smoke de la release**: el de T19 (su walkthrough, 2026-09-09) y Pester 149/149 con `claude plugin validate` en este cierre. Uso real en tres proyectos del 2026-09-16 al 2026-09-20. Hallazgos sobre lo entregado en la 1.1.0: **1** — la convención de nombres en inglés no llegó al punto de uso de quien crea una capacidad (fila 6). El resto de hallazgos de campo son sobre el kit en general y están triados arriba.

- **Compatibilidad con superpowers**: los tickets se ejecutaron con 6.2–6.3.0; la validada en el README es 6.3.0. Sin minor nuevo que re-testar. Un hueco nuevo observado en su lado: `sdd-workspace` deriva el directorio del basename del plan (fila 30).
