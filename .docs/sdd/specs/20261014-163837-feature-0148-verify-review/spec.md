---
id: 20261014-163837-feature-0148-verify-review
feature: 0148
proposal: 0131
title: verify — sdd-verify, revisión final en tres ejes con un solo cierre y los cinco libros
mode: full
profile: delegate
status: approved
created: 2026-10-14
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-14
---

# Spec — verify: `sdd-verify`, revisión final en tres ejes con un solo cierre

🦆 Cuando el agente acabe de implementar una feature, la revisión final la harán dos o tres revisores a la vez, cada uno con su pregunta: si se hizo lo que pedía la spec (con las capacidades, las ADR y tus decisiones), si el código sigue cinco libros de buen diseño y, solo si el plan dice que se cruzan fronteras entre módulos, la arquitectura. Por ejemplo, si una feature quita «avisar por correo de las anulaciones» y el correo se sigue enviando, el revisor de la spec lo marca como fallo grave. Lo que encuentren se arregla en una sola tanda, y una sola re-revisión lo comprueba justo antes de la validación. Lo que quede abierto, el agente lo decide y te lo enseña entre sus decisiones; un fallo grave no se decide, se arregla, y el agente te avisa de que ese arreglo nadie lo revisó. Antes de dar algo por hecho, el agente enseñará la salida del comando que lo prueba, con una skill propia del kit en lugar de la de superpowers.

## Capacidades

- Nuevas: `verification` — la revisión final de rama y la evidencia antes de afirmar: los ejes y lo que recibe cada uno, el cierre único, el paquete, el worktree aislado, la línea `Revisión final:` y la Confirmación de las ADR.
- Modificadas: `feature-flow` — sus nueve requisitos de la revisión final pasan a `verification`. Cambian:
  - el artículo de calidad, que ahora viaja a cada eje;
  - el Review Focus, que viaja al eje Spec;
  - la validación, que espera a que termine el cierre de la revisión;
  - lo cambiado tras la validación, que entra en la única re-revisión o va a ✋ como `sin revisar`;
  - el literal de la línea `Ejecución` de Native.

  Y gana un requisito: el revisor de la spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera.
- Modificadas: `control-profiles` — «Salir del plan es un ruling visible»: la pasada de fix entra en la única re-revisión. «Con `validation.mode: field`»: la línea de la validación en campo lleva los ejes y no dice «limpia» con un `sin revisar` o un `no verificado`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`verification`), MODIFIED/REMOVED (nueve REMOVED en `feature-flow`, un MODIFIED en `control-profiles`), cuatro capacidades (tres tras la review), contrato entre módulos (la línea `Revisión final:` de `tasks.md` la lee `sdd-end-feature`, y `Eje Arquitectura:` del plan la lee `sdd-verify`), área no explorada (`plan-writing.md`, `re-review-prompt.md`, los moldes de las baterías) · tamaño: ~1.500 líneas en ~25 ficheros
- Dominio: si los nueve requisitos que pasan de `feature-flow` a `verification` conservan cada AND (en especial «la validación se presenta cuando vuelve el revisor…» y la pregunta sola de la decisión del dev-lead), y si «Una re-revisión nunca abre otra» dice qué NO hace el agente en `pair` y con `validation.mode: field` (señal: MODIFIED + capacidad nueva)
- Técnica: si el Scope nombra cada fichero que aplica lo que cambia (`control-profiles.md` líneas 79-81 y 143, el paso 7 de `sdd-start-feature`, los pasos 0 y 9 de `sdd-end-feature`, `plan-template.md` línea 18), si los márgenes de palabras cuadran y si el formato nuevo de `Revisión final:` rompe el squash de `commit-milestones.md` (señal: contrato entre módulos + área no explorada)
- Mínimo razonable: solo técnica — deja sin mirar si al mover requisitos se pierde un AND, que no se ve hasta que una feature cierra sin la re-revisión que el requisito viejo exigía
```

Activada por el dev-lead: «Dos, dominio en Opus (Recomendada)». Dominio con `opus` y técnica con `sonnet`, las dos con `sdd-kit:effort-medium`, despachadas en paralelo con `sdd-parallel-agents`.

1. **Skill nueva `sdd-verify`** (la acción verify de la propuesta). Su `SKILL.md` es el fork entero de `verification-before-completion` y `requesting-code-review` de superpowers 7.0.0, con su texto (ADR 0013), más la sección «Final review» que sale de `sdd-implement`. Nace con su batería completa (Art. I).
2. **Tres encargos completos en `sdd-verify/references/`**: `spec-reviewer-prompt.md`, `code-reviewer-prompt.md` y `architecture-reviewer-prompt.md`. Cada uno es el fork de `code-reviewer.md` de superpowers 7.0.0 con su lente, y repite la parte común: solo lectura, sin subagentes, «Declined to judge», «spec is a vision document» y el formato de salida. Prefiero tres ficheros a una plantilla que el hilo componga: lo que el hilo arma a mano es lo que se pierde en los encargos (E3 de `tests/gates-reviews-green.md`).
3. **`encargo-revision.md` se mueve** de `sdd-start-feature/references/` a `sdd-verify/references/` sin cambiar el nombre, y se actualizan sus enlaces y los Pester que lo leen por su ruta. Su cabecera y «Cómo revisar» van en el encargo de cada eje y en el de la re-revisión.
4. **Modelo y effort de cada eje**: Spec, `opus` + `sdd-kit:effort-high`; Código, `sonnet` + `sdd-kit:effort-high` (el piloto de la 0108: Sonnet encontró el fallo de referencia 2 de 2); Arquitectura, `opus` + `sdd-kit:effort-high`. Los modelos de los ejes los fija la propuesta 0131.
5. **La re-revisión**:
   - **Quién y con qué**: un solo revisor, `opus` + `sdd-kit:effort-high`, sobre el paquete `sdd review package <plan> <sha revisado> HEAD`.
   - **Su encargo**: la cabecera de `encargo-revision.md` y `re-review-prompt.md` de `sdd-implement`, con los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron. Arquitectura solo entra si salió.
   - **Cuándo sale**: justo antes de presentar la validación o, en campo, antes de pasar al cierre.
   - **Qué cubre**: `<sha revisado>..HEAD`, es decir, la pasada de fix y cualquier commit posterior del hilo.
   - **Cuándo no sale**: si desde el sha revisado solo hay commits que se revisan en el hilo (documentación de menos de 20 líneas).
   - **En SDD** es la re-revisión acotada de la fix wave de la fuente: no hay otra.
6. **Lo que queda abierto tras la re-revisión**:
   - Un Important residual se adjudica con `Final: Ruling:` y va a ✋.
   - Un **Critical residual no se adjudica**. El hilo lo arregla con TDD (RED→GREEN) y va a ✋ como `sin revisar: <sha> — <qué arregla>`. Si arreglarlo cambia la spec, es un desvío y para.
   - Un commit posterior a la re-revisión que no sea documentación corta va a ✋ como `sin revisar: <sha> — <qué cambia>`. Si la re-revisión aún no salió (revisión limpia, sin fixes), ese commit la abre, y es la única.
7. **Formato de `tasks.md`**:
   - `Revisión final: Spec opus+high, <veredicto> · Código sonnet+high, <veredicto> · Arquitectura opus+high, <veredicto>, sobre <sha corto>`.
   - Sin eje Arquitectura, ese tramo es `Arquitectura no (plan)`; si el hilo lo subió, `Arquitectura opus+high, <veredicto> (subido: <motivo>)`.
   - Una comprobación que un eje no pudo hacer suma `, <n> sin verificar` a su veredicto.
   - Como mucho una línea `Re-revisión:`.
8. **La línea del plan `Eje Arquitectura: sí — <frontera> | no — <motivo>`**:
   - **Dónde**: en la cabecera de `plan-template.md`, junto a «Ejecución».
   - **Cómo se juzga**: `plan-writing.md` la juzga contra `architecture.md` y cuatro señales: un módulo nuevo, una dependencia nueva en un manifest, un contrato entre módulos o datos.
   - **Sin la línea**: en lite, sin plan, o con un plan de antes del kit nuevo, el hilo la decide al despachar con las mismas señales, con un ruling en el ledger. Lite también tiene ledger: `sdd workspace` acepta `spec.md` como plan.
9. **El eje Spec** trae piezas de OpenSpec 1.14.1 (`openspec-verify-change`, MIT), adaptadas:
   - un `ADDED` o `MODIFIED` tiene que estar implementado;
   - un `REMOVED` se comprueba al revés (sigue vivo → Critical);
   - una comprobación no verificada nunca cuenta como limpia.

   De Spec Kit (`converge`) toma solo el concepto de los tipos de hueco con su origen (`missing`, `partial`, `contradicts`, `unrequested`): el Art. IX no lo lista como fuente de texto. El kit añade:
   - **Cada THEN, con la verificación que nombra «Dónde se prueba»** (un test, un escenario de batería, una captura): si el paquete no la trae, «no verificado».
   - **Capacidades**: una capacidad de `sdd capability index` cuyo comportamiento cambia el diff sin que el delta la declare es Important `unrequested`.
   - **ADR**: aplica la `### Confirmación` de cada ADR `accepted` que lista `sdd decision index --files`. Una `proposed` sale solo como aviso, y entre dos ADR solapadas manda la más reciente, como dice `decisions`.
   - **Decisiones del dev-lead**: cada una tiene una regla que la cubre entera; una más estrecha es Important.
10. **Qué recibe cada eje**:
    - **Spec**: las rutas de `spec.md` y `plan.md`, el Review Focus literal, la lista de ADR, la salida de `sdd capability index` y el puntero a los rulings y minors del ledger.
    - **Código**: el paquete con la cabecera; no recibe ni la spec ni las ADR.
    - **Arquitectura**: el paquete y `architecture.md`.
    - El Review Focus va solo al eje Spec, porque sus líneas son entradas y comportamientos esperados.
11. **El eje Código**:
    - el bloque «De código», que manda;
    - los «Quick Diagnostic» de *Clean Code*, *Refactoring*, *A Philosophy of Software Design* y *The Pragmatic Programmer* de Wondel 1.8.0 (`wondelai/skills`, MIT), literales;
    - las dos reglas de `code-review` de mattpocock/skills v1.3.1: el estándar del repo manda, y cada olor es un juicio, no una infracción;
    - un comentario que repite el código es Important.

    Los 12 olores de Matt no entran: el «Quick Diagnostic» de *Refactoring* cubre su terreno, y la ADR 0013 lo admite como «trae algo de otro kit». El decálogo se queda solo en el encargo del implementador.
12. **El eje Arquitectura**: el «Quick Diagnostic» de *Clean Architecture* de Wondel 1.8.0, literal, sobre el bloque «Architecture» de `code-reviewer.md`.
13. **Agregación y despacho**:
    - Los informes llegan por eje, sin fusionar ni reordenar hallazgos entre ejes (Matt, «Why two axes»). El hilo reordena cada hallazgo por su efecto dentro de su eje, como hoy, y lo apunta en el ledger con su eje.
    - Los ejes salen con `sdd-parallel-agents` dentro de `control.maxParallelAgents`: con 2 y tres ejes, salen dos y el tercero sale cuando vuelve uno.
    - Un eje colgado se relanza solo, con su vigía, y los demás siguen.
    - La `description` de `sdd-parallel-agents` nombra también los ejes de la revisión final.
14. **Capacidad nueva `verification`**. Pasan de `feature-flow` estos nueve requisitos:
    - «El revisor final revisa el paquete sin ejecutar la suite»
    - «El revisor final de Native va con el techo del kit»
    - «El cierre no repite la revisión final de Native»
    - «Un commit del hilo posterior a la revisión final se revisa antes de la validación»
    - «El paquete del revisor final sale del merge-base actual y sin evidencia»
    - «El paquete del revisor final deja fuera los borrados y la carpeta de la feature»
    - «El plan escribe al revisor final con el techo del kit»
    - «El revisor final sale en segundo plano con el commit de la última task»
    - «El revisor final trabaja aislado en el sha que revisa»

    También pasa la Confirmación de las ADR, que en la primera versión iba en `decisions`. En otras capacidades, «revisor final» se lee como cada eje, y «revisión final limpia», como su cierre terminado. Esas lecturas van en las reglas de `verification`, para no reescribir requisitos que no cambian de comportamiento: el umbral en una unidad, el vigía y el workspace.
15. **ADR 0015, «revisión final en tres ejes con un solo cierre»**:
    - Sus `rutas` son `skills/sdd-verify/**` y `skills/sdd-implement/**`.
    - La ADR 0006 sigue vigente: solo se sustituye su parte del revisor final, y la 0015 lo dice en su contexto, porque la forma de la ADR 0001 no prevé sustituciones parciales.
    - **El Art. IV** se reescribe sin crecer: «El revisor final de rama… va con Opus y effort high» pasa a «Spec y Arquitectura en Opus, Código en Sonnet; un eje cambia de modelo solo con datos del principio 5».
    - **Este es el cambio de convención** que el Art. IV pide hacer con spec dedicada.
    - **La release**: es la 3.0.0, que ya es mayor. Su migración (0157) no necesita paso para esto: el paso 9 lee también el formato 2.x de `tasks.md`.
16. **Avisos de terceros**:
    - Wondel entra en la tabla «Fuentes vigiladas» de `THIRD_PARTY_NOTICES.md` (`wondelai/skills`, la versión vista con su tag), con un clone en `SDD_UPSTREAM_DIR` para que `moon run kit:upstream` lo encuentre.
    - El `NOTICE` de `sdd-verify` lista superpowers 7.0.0, mattpocock/skills v1.3.1, Wondel 1.8.0 y OpenSpec 1.14.1, todas MIT.
17. **Topes de palabras** (conteo de `WordBudget`):

    | Fichero | Hoy / tope | Qué pasa |
    | --- | --- | --- |
    | `sdd-implement` SKILL / total | 10.231 / 10.240 · 13.947 / 13.950 | Pierde «Final review». El tope baja a lo que mida. |
    | `sdd-end-feature` total | 4.496 / 4.500 | El paso 9 delega en `sdd-verify`. Si no llega, **decide el dev-lead en este gate**: propongo subirlo a lo que mida. |
    | `sdd-start-feature` total | 12.786 / 13.200 | Sale `encargo-revision.md`. El tope baja a lo que mida. |
    | `sdd-propose` total | 6.272 / 6.300 | La regla de `Eje Arquitectura` (~70 palabras) no cabe. **Propongo subirlo a lo que mida (~6.350)**. |
    | `sdd-parallel-agents` | 1.046 / 1.100 | La `description` y «When to Use» ganan los ejes (~20). Cabe. |
    | `constitution.md` | 2.229 / 2.230 | El Art. IV se reescribe sin crecer. Si no cabe, **decide el dev-lead en este gate**: propongo subirlo a lo que mida. |
    | `architecture.md` | 1.898 / 1.900 | El árbol pasa a `sdd-{tdd,debugging,worktrees,parallel-agents,verify}/`: +0 palabras. |
    | `tech-stack.md` | 18.697 / 18.700 | No se toca: nombra `encargo-revision.md` solo por su nombre. |
    | `sdd-verify` | — | ~2.800 de SKILL y ~7.000 en total. Su tope es lo que mida, redondeado a la centena siguiente. |
18. **Los menores de la revisión final de la 0175** cierran su fila entera:
    - las dos condensaciones de la 0147 vuelven a su texto o llevan su fila con el motivo de la ADR 0013;
    - «in Native, they chose it» pasa a decir que lo eligió la línea `Ejecución` del plan;
    - «the most capable model» junto a `opus` desaparece con el traslado de «Final review»;
    - las filas de procedencia de `sdd-rubber-duck` entran en su tabla de `tests/batteries/sdd-rubber-duck/battery.md`.
19. **El molde de `h2`**: la spec de la 0010 (`tests/batteries/sdd-implement/fixtures/spec-0010.md`) gana el AND «sin `--motivo` responde «motivo no válido: cambio de planes, sala ocupada, otro»», que es lo que ya responde `app-task1.js`. Así `h2` no para en el freno de la salida observable y llega a despachar.
20. **El texto forkeado se contrasta con las paradas del kit antes del humo**: las frases absolutas y los ejemplos de VBC y de `requesting-code-review` contra la tabla de `control-profiles.md` y los pasos de `sdd-verify`. Cada choque se acota con su fila «kit distinto» en el anexo. Es la fila de deuda del texto devuelto a un fork que choca con paradas del kit, que la 0151 hará general.
21. **El punto de las decisiones del dev-lead** va en la lente de dominio de `review-spec.md` (con un solo revisor, en sus siete puntos, que pasan a ocho): es una pregunta de reglas, no de contratos.
22. **Previsión de la prueba** (Art. I): unos 39 sujetos en ~3,5 h de campaña y ~43 $, con una tanda de REFACTOR incluida. Sube frente a los ~26 sujetos y ~30 $ de la sección 4 de la entrevista por tres escenarios: `s1`, el tramo de propose, y los de la review (`c4`, formato 2.x; `c5`, Critical residual). El detalle está en «Previsión de la prueba».
23. **Fuera**:
    - los patches siguen sin revisión final (es de la 0149);
    - los comentarios que citan documentos van a la 0182;
    - el contraste del research de un spike pasa a la 0163, que va tras la 0148;
    - la campaña de n ≥ 5 por modelo de la 0108 no se hace: los modelos de la propuesta y la regla del Art. IV la sustituyen;
    - las re-revisiones del bucle de task de SDD no cambian: el «como mucho una» es de la revisión final.
24. **Corregido en el repaso de coherencia, antes de la review**:
    - en campo, la re-revisión sale «antes de pasar al cierre»;
    - el Scope ganó la línea 54 de `plan-template.md`, «Setup» paso 7 y «Every commit of yours» de `sdd-implement`, y los seis Pester que leen `encargo-revision.md` por su ruta.

### Hallazgos de la review

Revisor de dominio (D) y revisor técnico (T). Varios coinciden.

- **Aceptado** — D1 y T1 (Crítico): «Lo cambiado tras la validación se separa de lo validado» manda el commit a una re-revisión aunque ya haya salido otra. Era un `MODIFIED` no declarado → `MODIFIED` en `feature-flow`: entra en la única re-revisión si aún no salió y, si salió, va a ✋ `sin revisar`.
- **Aceptado** — D2 y T1: «El trabajo se valida…» y «Con `validation.mode: field`…» piden «revisión final limpia», y su ejemplo es «Opus limpia». La línea `Ejecución` de Native reserva «el modelo más capaz» para toda la revisión → tres `MODIFIED`:
  - el GIVEN pide el cierre de la revisión terminado;
  - la línea de campo lleva los ejes y no dice «limpia» con un `sin revisar`;
  - el literal de `Ejecución` dice «…para los ejes Spec y Arquitectura de la revisión final» (`plan-template.md` línea 30 y `tests/SessionModel.Tests.ps1`).
- **Aceptado en parte** — T1: los demás requisitos que dicen «revisor final» (el umbral en una unidad, el vigía, el workspace, el tipo de effort) no cambian de comportamiento → no se reescriben. Las reglas de `verification` fijan cómo se leen «revisor final» y «revisión final limpia» (decisión 14).
- **Aceptado** — D3 y T3: al moverlo, «El revisor final de Native va con el techo del kit» perdía el GIVEN de Native con las tasks completas y el AND de la cabecera y «Cómo revisar» → los dos vuelven en «La revisión final sale en ejes».
- **Rechazado** — T3, el AND del tipo de effort: no se pierde. Vive en «Sin el tipo de effort, se dice antes del primer despacho», que se queda en `feature-flow`.
- **Aceptado** — D4: en SDD salían dos re-revisiones, la de la fix wave de la fuente y la del cierre → son la misma (decisión 5, anexo y un AND en «La revisión se cierra una vez»).
- **Aceptado** — D5 y T2 (Crítico): un Critical residual se cerraba con un ruling, también en campo → no se adjudica: el hilo lo arregla con TDD y va a ✋ `sin revisar`, o para como desvío si cambia la spec (decisión 6, escenario `c5`).
- **Aceptado** — D6: `sin revisar` y `no verificado` no decían qué no puede afirmarse → la línea de campo y el walkthrough no dicen «limpia» mientras quede alguno.
- **Aceptado** — D7: no se decía qué recibe cada eje ni qué cubre la re-revisión → decisiones 5 y 10, y un AND en «La revisión final sale en ejes».
- **Aceptado** — D8: se exigía la Confirmación también de ADR `proposed` → solo `accepted`; `proposed` sale como aviso, y manda la más reciente.
- **Aceptado en parte** — D9: el Art. IV pide una spec dedicada para cambiar la convención, y lo es. La release es la 3.0.0, ya mayor. El formato viejo de `tasks.md` se lee sin migración (`c4`). La regla del Art. IV se reescribe: los modelos de los ejes los fija la propuesta, y cambiarlos pide datos.
  **Rechazado** subir el eje Código a Opus: es una decisión de la propuesta 0131.
- **Aceptado** — D10: «el kit deja de invocar» no tenía requisito → ADDED «El kit no invoca las skills de superpowers que sustituye `sdd-verify`», con su Pester. El Scope gana `walkthrough-template.md` (línea 65, su ejemplo). El índice de capacidades se genera solo desde los ficheros: no hay nada que tocar.
- **Aceptado** — T4: `sdd-parallel-agents` no estaba en el Scope, ni el tope de agentes ni el cuelgue de un eje → al Scope; `f2` con `maxParallelAgents: 2`; un eje colgado se relanza solo.
- **Aceptado** — T5: la re-revisión no estaba definida → decisión 5 y su rúbrica en `c1`.
- **Aceptado** — T6: faltaba la compatibilidad con planes sin `Eje Arquitectura:` y con `tasks.md` en formato 2.x → el hilo decide el eje al despachar; la línea 2.x cuenta como revisión, con su `Pasada de fix:` en la cadena (escenario `c4`).
- **Aceptado** — T7: `unrequested` sin GIVEN, el índice sin origen y «el test de un THEN» sin definir → GIVEN completo, `sdd capability index`, y la verificación que nombra «Dónde se prueba».
- **Aceptado en parte** — T8: lite sí tiene ledger (`sdd workspace` acepta `spec.md`), así que no falta destino. Sí faltaba el formato del eje subido en `Revisión final:` → `(subido: <motivo>)`. El patrón con el `<` sin cerrar se reescribe.
- **Aceptado** — T9:
  - la pregunta sola de la decisión del dev-lead sale de `verification`, porque vive en `feature-flow`;
  - la Confirmación de las ADR pasa de `decisions` a `verification`;
  - el MODIFIED de `control-profiles` remite a `verification` en vez de repetirla;
  - las dos decisiones que faltaban en ✋ entran: la 10 (el Review Focus, al eje Spec) y la 21 (el punto, a la lente de dominio).
- **Aceptado** — T10: la Previsión gana filas o motivos para el paso 0 de `sdd-end-feature`, el Review Focus en `f3`, «Every commit of yours», «Finish», `commit-milestones.md`, `sdd-parallel-agents` y el formato 2.x.

### Decisiones tomadas con el dev-lead

- Partir la 0148 en tres: esta (`sdd-verify`), la 0182 (el verbo de la CLI para los comentarios que citan documentos, `parent: 0148`, tras la 0148) y el contraste del research de un spike, que pasa a la 0163 — «Partir en tres (Recomendada)» (2026-10-14)
- Parar en la spec — «Enséñame la spec (Recomendada)» (2026-10-14)
- Un solo cierre, igual en Native y en SDD: una pasada de fix, una re-revisión antes de la validación, lo residual a ✋ y una re-revisión nunca abre otra — «1» (2026-10-14)
- El eje Arquitectura lo declara el plan, y el hilo solo puede subirlo — «1» (2026-10-14)
- Los cinco libros, con los «Quick Diagnostic» de Wondel — «1» (2026-10-14)
- Capacidades y ADR en la revisión, y piezas de OpenSpec, Matt y Spec Kit — «dale una vuelta si hay que añadir algo de capabilities o decision… y si en openspec/matt/speckit hay algo similar hay que sacar de allí algo también» (2026-10-14)
- Diseño por secciones: la sección 1 con ese añadido; las secciones 2 a 4, «si» (2026-10-14)
- Review de la spec — «Dos, dominio en Opus (Recomendada)» (2026-10-14)
- La prueba pasa la previsión de sujetos (40 de ~39, por tres rondas de REFACTOR; 27,82 $ de 43): seguir con el REFACTOR de `c1` y `c2` y la Task 5 — «Sigo con todo (Recomendada)» (2026-10-14)
- Aprobación de la spec con los topes propuestos (sdd-propose total a lo que mida, ~6.350; sdd-end-feature total y constitution.md a lo que midan si no caben) — «Apruebo (Recomendada)» (2026-10-14)
- Del prompt de arranque: el fork de `verification-before-completion` 7.0.0 con la ADR 0013, conservando el texto de la fuente — «La 0148» (2026-10-13). El fork sustituye la invocación que la 0175 devolvió al contrato de cierre de Native. La previsión lleva el margen de palabras de cada fichero que se edita, y el gate decide el tope que no llegue. Salda las filas del humo `h2` y de los menores de la 0175. Perfil `delegate`, y al fusionar, `sdd merge --push`.

## Intent

Hoy la revisión final la hace un solo revisor Opus con `code-reviewer.md` de superpowers, y depende de dos skills de superpowers que la 3.0.0 saca del kit. Su cierre no tiene tope:

- en Native, la pasada de fix no la revisa nadie;
- en el paso 9, cada commit posterior abre otra re-revisión «hasta que vuelva sin Critical ni Important», que es la fricción de ~25 tickets y las tres re-revisiones de la 0128.

El éxito tiene cuatro partes:

- cada feature cierra con una revisión en dos o tres ejes y como mucho una re-revisión de la revisión final;
- el eje Spec ve lo que hoy no ve nadie: un `REMOVED` que sigue vivo, una capacidad cambiada sin declarar, una ADR incumplida y una decisión del dev-lead cubierta a medias;
- el kit deja de invocar `verification-before-completion` y `requesting-code-review` de superpowers;
- `sdd-implement` recupera margen de palabras.

Fracasaría si el cierre único deja sin revisar arreglos sin que el dev-lead lo vea en ✋, si una feature cierra con un Critical conocido abierto, o si el eje Código levanta como Important juicios que el estándar del proyecto desmiente.

## Scope

- Entra:
  - `skills/sdd-verify/`: `SKILL.md`, `NOTICE`, `references/spec-reviewer-prompt.md`, `code-reviewer-prompt.md`, `architecture-reviewer-prompt.md` y `encargo-revision.md` (movido).
  - `skills/sdd-implement/SKILL.md`:
    - sale «Final review»;
    - el `REQUIRED SUB-SKILL` del contrato de cierre y los nodos de los dos grafos pasan a `sdd-verify`;
    - «Setup» paso 7 nombra los ejes como primer despacho de Native;
    - «Every commit of yours», en «Deviations and rulings», pasa a la única re-revisión;
    - «Finish» y los ejemplos dejan de citar un revisor único;
    - los menores de la 0175.
  - `skills/sdd-implement/references/implementer-prompt.md`: la condensación «Are names clear and accurate».
  - `skills/sdd-implement/references/re-review-prompt.md`: sirve también a la re-revisión final, con los hallazgos de todos los ejes.
  - `skills/sdd-parallel-agents/SKILL.md`: la `description` y «When to Use» nombran los ejes de la revisión final.
  - `skills/sdd-end-feature/SKILL.md`, pasos 0 y 9.
  - `skills/sdd-start-feature/SKILL.md`, paso 7.
  - `skills/sdd-start-feature/references/control-profiles.md`: líneas 79-81 y 143.
  - `skills/sdd-start-feature/references/review-spec.md`: el punto de las decisiones del dev-lead en el encargo del revisor de la spec.
  - `skills/sdd-propose/references/plan-writing.md` y `skills/sdd-templates/templates/plan-template.md`:
    - la cabecera gana `Eje Arquitectura:`;
    - la línea 18 nombra los ejes en lugar de «el revisor final… `opus`»;
    - la línea 30 cambia el literal de Native;
    - la línea 54 lleva el Review Focus al eje Spec.
  - `skills/sdd-templates/templates/walkthrough-template.md`: su ejemplo de la línea 65 pasa al formato por ejes.
  - `skills/sdd-start-feature/references/commit-milestones.md`: solo si el formato nuevo de `Revisión final:` cambia su ejemplo.
  - `.docs/sdd/capabilities/feature-flow.md` y `control-profiles.md` (delta), y `verification.md` (nueva).
  - `.docs/sdd/constitution.md` Art. IV, `.docs/sdd/decisions/0015-final-review-in-three-axes.md`, `.docs/sdd/architecture.md` (el árbol), `THIRD_PARTY_NOTICES.md`, `README.md` (catálogo) y `CLAUDE.md` («las 22 skills» pasa a 23).
  - `tests/batteries/sdd-verify/` (nueva), `tests/batteries/sdd-implement/` (`spec-0010.md`, `h1` y `h2`), `tests/batteries/sdd-propose/` (el tramo del paso del plan y `p`), `tests/batteries/sdd-rubber-duck/battery.md` (sus filas de procedencia).
  - Pester:
    - `tests/WordBudget.Tests.ps1`;
    - `tests/SessionModel.Tests.ps1` (el literal de Native);
    - los que leen `encargo-revision.md` por su ruta: `ClosingOffCriticalPath`, `FinalReviewPackage`, `NativeAdapt`, `PlanReviewFocus`, `ProportionalReview` y `SilenceWatch`;
    - los que buscan frases que se mueven: `ImplementSkill` y los de anatomía;
    - uno nuevo para «El kit no invoca las skills de superpowers que sustituye `sdd-verify`».

    Las campañas `tests/*-red.md` y `*-green.md` que nombran el fichero son eventos: no se editan.
  - El roadmap: la fila 0148 acotada, la fila 0182 nueva, la 0163 con el contraste del research y tras la 0148, y las filas de deuda que salda. La propuesta 0131: su línea de «Enmiendas».
- No entra:
  - la revisión de task de SDD (`task-reviewer-prompt.md`) y su bucle de cinco rondas con sus re-revisiones;
  - la revisión final en los patches (0149);
  - el verbo de la CLI para los comentarios que citan documentos (0182);
  - el contraste del research de un spike (0163);
  - la campaña de modelos de la 0108;
  - `tech-stack.md`;
  - `.docs/sdd/capabilities/decisions.md`, porque la Confirmación pasa a `verification`;
  - un paso de migración (0157), porque el paso 9 lee el formato 2.x.

## Approach

`sdd-verify` es el dueño de dos momentos:

- **El contrato de cierre de cada task.** Es la parte de `verification-before-completion`, que `sdd-implement` carga como `REQUIRED SUB-SKILL`.
- **La revisión final de rama.** `sdd-implement` la invoca tras la última task, y el paso 9 de `sdd-end-feature` la comprueba.

La revisión sale en ejes, en paralelo con `sdd-parallel-agents`, sobre el paquete de la receta de `encargo-revision.md`, y cada eje recibe lo suyo (decisión 10). El cierre es el que eligió el dev-lead: una pasada de fix, una re-revisión antes de la validación y lo residual a ✋. El Critical residual es la excepción: se arregla, no se adjudica.

Los forks conservan el texto de su fuente. Cada pieza cambiada lleva su fila en el anexo, con uno de los tres motivos de la ADR 0013.

## Dónde se prueba

- La evidencia antes de afirmar: un sujeto en el cierre de una task Native, como `h1` de la batería de `sdd-implement` (`v1`).
- El despacho por ejes, lo que recibe cada uno, el tope de agentes y la subida de `Eje Arquitectura`: sujetos con el plan terminado sobre el molde de reservas, puntuando el `<etiqueta>.jsonl` de cada despacho (`f1`, `f2`).
- Lo que ve cada eje: el encargo como prompt de un sujeto revisor sobre un paquete con fallos sembrados, puntuando su informe (`f3`, `f4`).
- El cierre único, la re-revisión y el Critical residual: sujetos sobre el molde de reservas con los informes de los ejes ya escritos, puntuando la pasada de fix, el despacho de la re-revisión y el ✋ (`c1`, `c2`, `c5`).
- El paso 9 y el formato 2.x de `tasks.md`: sujetos que entran por `sdd-end-feature` (`c3`, `c4`).
- La línea `Eje Arquitectura:` del plan: el paso del plan de la batería de `sdd-propose` (`p`).
- El punto del revisor de la spec: su encargo como prompt de un sujeto sobre una spec con una regla más estrecha que una decisión del dev-lead (`s1`).
- Los bucles de `sdd-implement` sin «Final review»: `h1` y `h2`.
- Topes, enlaces, literales y que ningún fichero de `skills/` invoque las skills sustituidas: Pester.

## Términos y ADR

- Términos resueltos:
  - **eje**: cada revisor de la revisión final (Spec, Código, Arquitectura), con su lente y su modelo. Se evita «lente» para la revisión final, porque es el término de la review de spec.
  - **cierre de la revisión**: una pasada de fix y una re-revisión, con lo residual adjudicado o, si es Critical, arreglado. Se evita «fix wave», salvo en las citas de la fuente.
  - **`sin revisar`**: un commit que, por el cierre único, ningún revisor ha visto, y que va a ✋.
- ADR candidatas: «La revisión final sale en ejes con un solo cierre». La alternativa descartada era un revisor Opus único con re-revisiones hasta quedar limpia. Se escribe en esta feature como la 0015, porque el Art. IV la cita.

## Delta de comportamiento

### Capacidad: `verification`

**ADDED — No se afirma un estado sin la evidencia de esta sesión**
- GIVEN la Task 2 de un plan Native, con su «Verificación» `npm test -- cancel`, y el hilo a punto de escribir su línea `complete`
- WHEN el hilo dice que la task pasa
- THEN antes ha ejecutado `npm test -- cancel` en esta sesión y ha leído su salida («8/8 pass»), y la línea la escribe `sdd task done` con ese resultado
- AND «debería pasar», «parece correcto» o el informe de un subagente sin su diff comprobado no cuentan como evidencia

**ADDED — El kit no invoca las skills de superpowers que sustituye `sdd-verify`**
- GIVEN los ficheros de `skills/` de la rama
- WHEN se buscan `superpowers:verification-before-completion`, `superpowers:requesting-code-review` y `code-reviewer.md` de superpowers
- THEN ninguno aparece: el contrato de cierre de `sdd-implement` y el paso 9 de `sdd-end-feature` invocan `sdd-verify`
- AND los nombres de las fuentes solo aparecen en el `NOTICE` de `sdd-verify` y en su anexo de procedencia

**ADDED — La revisión final sale en ejes, en paralelo**
- GIVEN un plan con `Ejecución: native`, todas sus tasks completas en el ledger, `Eje Arquitectura: no — solo texto de skills` y el commit `a1b2c3d` de su última task
- WHEN el hilo despacha la revisión final
- THEN con `sdd-parallel-agents` y en segundo plano salen dos revisores sobre `a1b2c3d`: el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`, cada uno con su vigía de silencio
- AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Restricciones de código»), su sección «Cómo revisar» y el encargo de su eje de `sdd-verify`
- AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, solo el paquete; el eje Arquitectura, el paquete y `architecture.md`
- AND con `Eje Arquitectura: sí — <frontera>` sale además el eje Arquitectura, con `sdd-kit:effort-high` + `opus`
- AND con `control.maxParallelAgents: 2` y tres ejes, salen dos y el tercero cuando vuelve uno
- AND los ejes trabajan en el mismo worktree desanclado `review-<id>-a1b2c3d`
- AND un eje colgado se relanza solo, una vez, como dice «Vigía de silencio», y los demás siguen
- AND el hilo recibe los informes por eje y no fusiona ni reordena hallazgos de un eje con los de otro

**ADDED — El eje Arquitectura lo declara el plan y el hilo solo lo sube**
- GIVEN un plan con `Eje Arquitectura: no — sin módulos nuevos` y un diff que añade `"zod"` a `dependencies` de `package.json`
- WHEN el hilo va a despachar la revisión final
- THEN despacha también el eje Arquitectura y registra en el ledger `Final: Ruling: Eje Arquitectura no → sí — dependencia nueva zod en package.json — <coste si se equivoca>`
- AND `tasks.md` lo escribe `Arquitectura opus+high, <veredicto> (subido: dependencia nueva zod)`
- AND con `Eje Arquitectura: sí` nunca lo quita
- AND sin la línea —en lite, sin plan, o con un plan anterior al kit nuevo—, el hilo lo decide al despachar con las señales de `plan-writing.md` (módulo nuevo, dependencia nueva en un manifest, contrato entre módulos, datos) y lo registra en el ledger como ruling

**ADDED — El eje Spec contrasta el diff con el delta de capacidades**
- GIVEN una spec cuyo delta trae `REMOVED — Las anulaciones se avisan por correo` en `bookings`, y un diff que deja `sendCancellationMail()` llamado desde `annul()` en `src/annul.js`
- WHEN revisa el eje Spec
- THEN marca Critical «REMOVED sigue implementado: Las anulaciones se avisan por correo», con `src/annul.js:<línea>` y el tipo de hueco `contradicts`
- AND un `ADDED` o `MODIFIED` sin implementación es `missing` o `partial`, con el THEN del que sale
- AND un THEN cuya verificación nombrada en «Dónde se prueba» (un test, un escenario de batería, una captura) no está en el diff es un hallazgo; si el paquete no deja verlo, es «no verificado»
- AND con el mismo diff cambiando además la respuesta de `facturar` en `src/invoices.js`, de la capacidad `invoicing` que lista `sdd capability index`, y un delta sin subsección `invoicing`, marca Important `unrequested` «invoicing cambia sin delta: la respuesta de facturar»

**ADDED — El eje Spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera**
- GIVEN «Decisiones tomadas con el dev-lead» con «artifacts cubre el visual companion entero», y un diff cuya regla solo cubre pantallas
- WHEN revisa el eje Spec
- THEN marca Important «decisión del dev-lead cubierta a medias: el visual companion — la regla cubre pantallas, no flujos ni diagramas»

**ADDED — La revisión final comprueba la Confirmación de las ADR que cubren el diff**
- GIVEN `0013-fork-keeps-source-text.md` (`accepted`, `rutas: skills/**`) con una `### Confirmación` que pide marcar como Important cada pieza de la fuente quitada sin motivo ni A/B, y un diff que quita de `skills/sdd-verify/SKILL.md` la tabla «Rationalization Prevention» de la fuente sin fila en el anexo
- WHEN el hilo despacha el eje Spec
- THEN su encargo lleva la lista que imprime `sdd decision index --files <ficheros del diff>`, con la 0013
- AND el eje Spec marca Important «ADR 0013, Confirmación: pieza de la fuente quitada sin motivo ni A/B — Rationalization Prevention»
- AND una ADR `proposed` de la lista sale solo como aviso («ADR propuesta, no se exige: 0016»), y entre dos ADR `accepted` que se contradicen manda la más reciente

**ADDED — Una comprobación no verificada no cuenta como limpia**
- GIVEN un eje Spec que no puede comprobar la verificación de un THEN porque «Dónde se prueba» nombra `test/e2e/booking.spec.ts` y el paquete no trae ese fichero
- WHEN informa
- THEN escribe esa comprobación como «no verificado: el paquete no trae `test/e2e/booking.spec.ts`», y no la cuenta como superada
- AND el hilo escribe `Revisión final: Spec opus+high, limpia, 1 sin verificar · …`, y antes de la validación la verifica él mismo o la adjudica con `Final: Ruling:`

**ADDED — El eje Código revisa con los cinco libros, bajo el estándar del proyecto**
- GIVEN el bloque «De código» del proyecto con «funciones ≤ 30 líneas», y un diff con una función de 26 líneas y el comentario `// incrementa i` sobre `i++`
- WHEN revisa el eje Código
- THEN marca Important el comentario que repite el código
- AND no marca la función de 26 líneas, aunque el «Quick Diagnostic» de *Clean Code* pregunte «Are all functions under 20 lines?»: manda el estándar del proyecto
- AND cada hallazgo que sale de una tabla «Quick Diagnostic» se escribe como juicio («posible Feature Envy»), no como infracción

**ADDED — La revisión se cierra una vez**
- GIVEN la revisión final sobre `a1b2c3d`, con 1 Important del eje Código y 1 Minor del eje Spec
- WHEN el hilo la procesa, con cualquier método
- THEN el Important entra en una sola pasada de fix (en Native, el hilo con TDD; en SDD, un subagente con todos los hallazgos de todos los ejes), y el Minor va al ledger como `Final: minor (deferred): <una línea>`
- AND justo antes de presentar la validación (con `validation.mode: field`, antes de pasar al cierre), despacha una sola re-revisión con `sdd-kit:effort-high` + `opus`, con la cabecera de `encargo-revision.md` y `re-review-prompt.md`, los hallazgos abiertos de todos los ejes y el «What to Check» de los ejes que salieron, sobre el paquete `sdd review package <plan> a1b2c3d HEAD`; apunta `Re-revisión: a1b2c3d..<head>, sdd-kit:effort-high + opus, <veredicto>`
- AND en SDD la fix wave no lleva otra re-revisión: es esta
- AND un Important que la re-revisión deja abierto, el hilo lo adjudica con `Final: Ruling:` y llega a ✋ en la presentación y en el walkthrough, sin otra pasada de fix ni otra re-revisión
- AND si desde `a1b2c3d` solo hay commits que se revisan en el hilo, no despacha re-revisión

**ADDED — Un Critical que deja la re-revisión no se adjudica**
- GIVEN un proyecto con `validation.mode: field` y una re-revisión que vuelve con 1 Critical abierto: «`cancelar` sin `--motivo` borra la reserva»
- WHEN el hilo procesa la re-revisión
- THEN no lo adjudica con un ruling: escribe el test que lo reproduce, lo ve fallar, lo arregla, corre la suite y lleva a ✋ `sin revisar: <sha> — arregla el Critical «cancelar sin --motivo borra la reserva»`
- AND no despacha otra re-revisión
- AND si arreglarlo cambia la spec, para como un desvío (en `unattended`, la opción más conservadora y aparca si bloquea)

**ADDED — Una re-revisión nunca abre otra**
- GIVEN `Re-revisión: a1b2c3d..c7d8e9f, sdd-kit:effort-high + opus, limpia` en `tasks.md`, y después un commit `f0a1b2c` que cambia `src/cancel.js`
- WHEN el hilo va a cerrar, en cualquier perfil y con cualquier `validation.mode`
- THEN no despacha revisor, y la presentación (o el mensaje con el que pasa al cierre, en campo) y el walkthrough llevan en ✋ `sin revisar: f0a1b2c — <qué cambia>`
- AND si el commit es documentación de menos de 20 líneas, lo anota como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND si la revisión final volvió limpia y no hubo re-revisión, ese commit abre la única, sobre `a1b2c3d..HEAD`
- AND mientras quede un `sin revisar` o un «no verificado» sin resolver, ni la línea `Validación en campo:` ni el walkthrough dicen que la revisión quedó limpia: dicen cuántos quedan («…, 1 sin revisar»)

**ADDED — `tasks.md` registra cada eje**
- GIVEN la revisión final de una feature con los ejes Spec y Código, y el plan con `Eje Arquitectura: no`
- WHEN vuelve
- THEN `tasks.md` lleva `Revisión final: Spec opus+high, limpia · Código sonnet+high, 1 Important · Arquitectura no (plan), sobre a1b2c3d`
- AND como mucho una línea `Re-revisión:`
- AND sin `tasks.md`, la misma línea va en la presentación de la validación

**ADDED — El revisor final revisa el paquete sin ejecutar la suite**
- GIVEN el despacho de los ejes con el paquete de review de la rama
- WHEN cada eje revisa
- THEN lee el paquete y no ejecuta la suite, el build ni el lint del proyecto
- AND si cree que hace falta una verificación pesada, la recomienda en su informe

**ADDED — El revisor final sale en segundo plano con el commit de la última task**
- GIVEN una feature Native con una task que cambia la UI, cuyo commit `a1b2c3d` acaba de hacerse, y su «Verificación visual» pendiente
- WHEN el hilo cierra esa task
- THEN el siguiente despacho son los ejes en segundo plano sobre `a1b2c3d`, antes de arrancar la aplicación para la verificación visual
- AND mientras los ejes trabajan, el hilo hace la verificación visual y escribe los borradores de cierre: `walkthrough.md` sin la verificación ni el tiempo, el delta fusionado en `capabilities/` y la entrada del changelog, todos sin commitear
- AND la validación se presenta cuando el cierre de la revisión ha terminado (la pasada de fix y la re-revisión, si las hay), con lo residual en ✋, no antes
- AND en SDD el disparador es el commit juntado de la última task, tras su revisión limpia

**ADDED — El revisor final trabaja aislado en el sha que revisa**
- GIVEN los ejes despachados sobre `a1b2c3d`, y el hilo que commitea después `e4f5a6b` (un fix de la verificación visual)
- WHEN los ejes leen el código y el historial
- THEN trabajan en un worktree desanclado `review-0096-a1b2c3d`, creado con `git worktree add --detach` en `a1b2c3d`, con el paquete construido allí, y su encargo les dice que no miren ramas ni commits posteriores
- AND ningún informe cita `e4f5a6b`
- AND la re-revisión se ancla igual, en el último sha de su tramo
- AND el hilo retira el worktree con `git worktree remove` cuando han vuelto todos los ejes

**ADDED — El paquete del revisor final sale del merge-base actual y sin evidencia**
- GIVEN una feature lite, sin `plan.md`, que tras su primer commit integró `develop` con un merge que trae los commits de otra feature (`skills/otra/SKILL.md`), y con `.docs/sdd/specs/<carpeta>/red/out.jsonl` en su rama
- WHEN el hilo prepara el paquete del revisor final
- THEN la sección de diff del paquete no contiene `skills/otra/SKILL.md` ni ningún fichero bajo `red/` o `green/`
- AND la sección de commits lista solo los de la feature y el merge
- AND el paquete se genera a la primera, con `spec.md` como plan

**ADDED — El paquete del revisor final deja fuera los borrados y la carpeta de la feature**
- GIVEN una rama que borra `docs/legacy-visual-spec.md` (500 líneas) y cinco fixtures, y trae `spec.md` y `plan.md` en su carpeta de `.docs/sdd/specs/`
- WHEN el hilo prepara el paquete del revisor final
- THEN el paquete no contiene el cuerpo de los ficheros borrados ni ningún fichero de la carpeta de la feature
- AND lista los borrados por nombre en su sección «Ficheros borrados»
- AND cada eje lo lee en tramos de 400 líneas con `offset` y `limit`, y ningún `Read` devuelve `exceeds maximum allowed tokens (25000)`

**ADDED — El plan escribe la revisión final con sus ejes**
- GIVEN una spec aprobada en `delegate` y un plan Native de una sola task pequeña
- WHEN el agente escribe `plan.md`
- THEN la revisión final aparece con sus ejes —Spec `sdd-kit:effort-high` + `opus`, Código `sdd-kit:effort-high` + `sonnet` y Arquitectura según `Eje Arquitectura:`—, o no aparece
- AND la cabecera del plan lleva `Eje Arquitectura: sí — <frontera>` o `no — <motivo>`

**ADDED — El cierre no repite la revisión final**
- GIVEN una feature cuya línea `Revisión final:` de `tasks.md` registra la revisión `sobre a1b2c3d`, y después de ese commit solo hay commits que se revisan en el hilo
- WHEN se entra en `sdd-end-feature`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué ejes y modelos
- AND si después del último revisado hay un commit `e4f5a6b` que cambia `src/slots.js` y `tasks.md` no tiene `Re-revisión:`, antes de escribir el walkthrough despacha la única re-revisión del tramo `<último revisado>..HEAD` (`sdd-kit:effort-high` + `opus`) y apunta `Re-revisión: <último revisado>..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND si `tasks.md` ya tiene `Re-revisión:`, no despacha: el walkthrough lleva `sin revisar: e4f5a6b — <qué cambia>` en ✋
- AND el último revisado es el segundo sha de la `Re-revisión:`; si no hay, el `sobre` de `Revisión final:`; y si la línea dice «juntada en el cierre», el commit de cierre
- AND una línea en el formato 2.x (`Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d`, sin ejes) cuenta como revisión final, y el tramo de la única re-revisión empieza en su `sobre`, con la pasada de fix dentro, como en el cierre único
- AND solo sin la línea `Revisión final:` (ni, sin `tasks.md`, el informe de los ejes en esta sesión) invoca `sdd-verify` para la revisión final

**Reglas de la capacidad**
- **Dónde viven los datos**: las líneas `Revisión final:`, `Pasada de fix:` y `Re-revisión:` en `tasks.md` (sin él, en la presentación de la validación); los hallazgos, rulings y minors en el ledger del workspace del plan (en lite, el de `spec.md`), hasta que «Finish» los cosecha.
- **Idioma de los nombres**: los encargos de los ejes en inglés, como sus fuentes; los nombres de skill y de fichero en inglés kebab-case.
- **Límites**:
  - dos o tres ejes por revisión final, dentro de `control.maxParallelAgents`;
  - una pasada de fix;
  - como mucho una re-revisión de la revisión final por feature;
  - cada eje lee el paquete en tramos de 400 líneas.
- **Avisos**:
  - un commit sin revisor, `sin revisar: <sha> — <qué cambia>` en ✋;
  - una comprobación que un eje no pudo hacer, `no verificado: <motivo>`;
  - una ADR propuesta, `ADR propuesta, no se exige: <número>`.
- **Regla ante conflicto**:
  - el bloque «De código» del proyecto manda sobre los «Quick Diagnostic»;
  - la spec manda sobre el plan;
  - entre dos ADR `accepted` que se contradicen, manda la más reciente;
  - un eje no reordena ni anula los hallazgos de otro.
  - En las demás capacidades, «el revisor final» es cada eje de la revisión final, y «la revisión final limpia» es su cierre terminado, sin Critical abiertos ni Important sin adjudicar.

### Capacidad: `feature-flow`

**MODIFIED — El artículo de calidad de código viaja a implementadores y revisores** (antes: «…un re-revisor o el revisor final»)
- GIVEN un plan cuyas Restricciones globales tienen un bloque «De código», con el artículo de calidad de la constitution, y un bloque «De proceso», o una feature en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task, un re-revisor o un eje de la revisión final
- THEN el encargo lleva el bloque «De código» literal como primera sección
- AND el bloque «De proceso» (política de modelos, modo de ejecución, atribución de commits) no aparece en el encargo de ningún revisor
- AND en modo lite el bloque es el artículo de calidad de código de la constitution, copiado literal; la política de modelos la aplica quien despacha

**MODIFIED — El plan lleva su Review Focus y viaja al revisor final** (antes: «al despachar el revisor final, su encargo lleva…»)
- GIVEN la spec de la 0012 aprobada (filtro de reservas por `status`, que no dice qué pasa con `status=Foo`) y un plan escrito con `plan-template.md`
- WHEN el agente termina el plan
- THEN el plan tiene una sección `## Review Focus` entre «Restricciones globales» y «Phase -1», con una línea por entrada o fallo que ningún test de las tasks ejercita, con su comportamiento esperado y su task (p. ej. «`status=Foo` → 400 con los estados válidos · Task 1, `Rejects_unknown_status`»), o «ninguna: comprobado»
- AND «Decisiones que he tomado yo» lleva una línea que la resume («Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección»)
- AND el self-review §4 lleva una fila por línea del Review Focus con su task y su test
- AND al despachar la revisión final, el encargo del eje Spec lleva la sección `## Review Focus` del plan, copiada literal

**MODIFIED — El trabajo se valida con el usuario antes de cerrar** (antes: «…con la implementación terminada y la revisión final limpia…»)
- GIVEN una feature con la implementación terminada y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-feature` presenta, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, con los datos de los escenarios de la spec. Lo que no se puede probar en la aplicación lo dice en su paso, con la comprobación que sí se puede hacer. Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

**MODIFIED — Lo cambiado tras la validación se separa de lo validado** (antes: «THEN el commit pasa por la re-revisión del tramo antes del walkthrough»)
- GIVEN una feature validada con «probé borrar un fichero y funciona» y, después, a petición del dev-lead, un commit `c7d8e9f` que cambia el texto del error «No se pudo borrar» por «El fichero ya no existe»
- WHEN se cierra
- THEN si la re-revisión de la revisión final aún no salió, el commit entra en ella antes del walkthrough; si ya salió, no se despacha otra y el walkthrough lleva en ✋ `sin revisar: c7d8e9f — el texto del error de borrar`, como dice «Una re-revisión nunca abre otra» de [`verification`](verification.md)
- AND la verificación del walkthrough y el mensaje final dicen que el dev-lead probó la versión anterior y qué verificó el agente del cambio (`c7d8e9f`), separado de la línea de validación
- AND el hilo no para a pedir otra validación

**MODIFIED — Con Native, el plan registra el modelo recomendado para la sesión** (antes: «…el modelo más capaz se reserva para la revisión final.»)
- GIVEN un plan cuyo método es Native
- WHEN el agente escribe su línea `Ejecución`
- THEN la línea lleva, literal, «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.»

**ADDED — El revisor de la spec comprueba que cada decisión del dev-lead tiene una regla que la cubre entera**
- GIVEN una spec con «artifacts cubre el visual companion entero» en «Decisiones tomadas con el dev-lead», y un delta cuyo único requisito sobre el companion habla de pantallas
- WHEN la revisa el revisor de la spec (la lente de dominio, o el revisor único)
- THEN devuelve «Importante · Delta · la decisión del dev-lead sobre el visual companion queda cubierta solo para pantallas · ampliar el requisito a flujos y diagramas»

**REMOVED — El revisor final revisa el paquete sin ejecutar la suite**
- motivo: pasa a `verification`, que lo aplica a cada eje

**REMOVED — El revisor final de Native va con el techo del kit**
- motivo: pasa a `verification` como «La revisión final sale en ejes, en paralelo», con su GIVEN de Native y el AND de la cabecera de `encargo-revision.md`

**REMOVED — El cierre no repite la revisión final de Native**
- motivo: pasa a `verification` como «El cierre no repite la revisión final», con la única re-revisión y la lectura del formato 2.x

**REMOVED — Un commit del hilo posterior a la revisión final se revisa antes de la validación**
- motivo: pasa a `verification` como «La revisión se cierra una vez» y «Una re-revisión nunca abre otra»

**REMOVED — El paquete del revisor final sale del merge-base actual y sin evidencia**
- motivo: pasa a `verification`, igual

**REMOVED — El paquete del revisor final deja fuera los borrados y la carpeta de la feature**
- motivo: pasa a `verification`, con «cada eje» en lugar de «el revisor»

**REMOVED — El plan escribe al revisor final con el techo del kit**
- motivo: pasa a `verification` como «El plan escribe la revisión final con sus ejes»

**REMOVED — El revisor final sale en segundo plano con el commit de la última task**
- motivo: pasa a `verification`, con la validación tras el cierre de la revisión

**REMOVED — El revisor final trabaja aislado en el sha que revisa**
- motivo: pasa a `verification`, con los ejes en el mismo worktree

### Capacidad: `control-profiles`

**MODIFIED — Salir del plan es un ruling visible** (antes: «…de la re-revisión del tramo `<revisión final>..HEAD`» y «la pasada de fix de la propia revisión final tampoco entra en la re-revisión del tramo: en Native la verifica su TDD, y en SDD su re-revisión acotada»)
- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso; si no queda ninguna, de la revisión final de rama; y si la revisión final ya volvió, del cierre de la revisión de [`verification`](verification.md): la única re-revisión o, si ya salió, `sin revisar` en ✋
- AND un commit del hilo que cambia menos de 20 líneas (añadidas más borradas, `git diff --numstat`; en un merge, las de `git show --remerge-diff`) y en el que todo lo que cambia es documentación o comentarios —ficheros bajo `.docs/`, `*.md` de cualquier ruta y líneas de comentario del código— no despacha revisor: el hilo lee el diff y lo anota en «✋ Me salí del plan en…» como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND un `.md` que un agente o un programa lee como instrucciones o como plantilla, un comentario que una herramienta interpreta (`eslint-disable`) y cualquier otra línea, también un diccionario del corrector, despachan revisor
- AND la pasada de fix de la propia revisión final entra en esa re-revisión, con los dos métodos
- AND la presentación de la validación abre con el 🦆 y el bloque «✋ Me salí del plan en…», separado del resto de decisiones

**MODIFIED — Con `validation.mode: field`, la validación es en campo** (antes: «…con la revisión final limpia…» y el ejemplo «revisión final Opus limpia sobre a1b2c3d»)
- GIVEN un proyecto con `"validation":{"mode":"field"}` en `.docs/sdd/sdd-kit.json` y la feature 0030 con el cierre de su revisión final terminado, su smoke por THEN y la suite en verde, en cualquier perfil
- WHEN el agente llega a la validación (paso 7 de `sdd-start-feature`, paso 0 de `sdd-end-feature`), o cierra el patch 0031 (paso 0 de `sdd-end-patch`)
- THEN no pregunta qué ha probado el usuario ni ofrece diferir, y sigue con el cierre sin parar
- AND el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación en campo: <fecha> · <verificación del agente>`, con la evidencia que ejecutó (p. ej. `suite 412/412 en 96 s · smoke 5/5 THEN con ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia`)
- AND con un `sin revisar` o un «no verificado» sin resolver, esa línea no dice «limpia»: dice cuántos quedan (`…, re-revisión limpia, 1 sin revisar`)
- AND la fila de la 0030 en el roadmap queda ✅, y la del patch 0031 en «Patches» no lleva el prefijo 🧪 ni tiene fila en la tabla de la release abierta
- AND sin la clave, o con `"mode":"manual"`, la validación es la de hoy: para en `pair` y `delegate` y se difiere al smoke de la release en `unattended`

## Previsión de la prueba (Art. I)

Sonnet por defecto. `f3` usa Opus, porque es el modelo del eje que prueba; `f4`, Sonnet. Los RED corren con el kit de `develop` y los GREEN con la rama. Llevan RED con n = 1 y GREEN con n = 2, salvo que la fila diga otra cosa.

| Paso nuevo o cambiado | Escenario | Sujetos | Motivo si no se mide |
| --- | --- | --- | --- |
| `sdd-verify`: la evidencia antes de afirmar (el fork de VBC) | `v1`: «tests should pass» en el cierre de una task Native | 3 | — |
| `sdd-verify`: despacho por ejes, lo que recibe cada uno, agregación; `sdd-parallel-agents` | `f1`: plan con `Eje Arquitectura: no` | 3 | — |
| `sdd-verify`: subir `Eje Arquitectura`; el tope de agentes | `f2`: un diff que añade una dependencia, con `maxParallelAgents: 2` | 3 | — |
| `spec-reviewer-prompt.md` | `f3`: paquete con un `REMOVED` vivo, una capacidad sin declarar, una ADR incumplida, una decisión cubierta a medias y una línea de Review Focus sin test | 3 | — |
| `code-reviewer-prompt.md` | `f4`: un comentario que repite el código y un umbral del «Quick Diagnostic» desmentido por «De código» | 3 | — |
| `architecture-reviewer-prompt.md` | — | 0 | Texto literal de la fuente (ADR 0013); su despacho lo cubre `f2` |
| `sdd-verify`, `sdd-start-feature` paso 7, `re-review-prompt.md` y «Finish»: el cierre único, la re-revisión y los rulings en ✋ | `c1`: 1 Important y 1 Minor | 3 | — |
| `sdd-verify`, `control-profiles.md` y «Every commit of yours»: una re-revisión nunca abre otra | `c2`: un fix de validación tras la re-revisión | 3 | — |
| `sdd-end-feature` pasos 0 y 9 | `c3`: revisión limpia y un commit en `src/` | 3 | — |
| `sdd-end-feature` paso 9: el formato 2.x de `tasks.md` | `c4`: `tasks.md` en formato 2.x con `Pasada de fix:` y un commit posterior en `src/` | 2 | Solo GREEN: el RED es el kit que escribe ese formato |
| `sdd-verify`: el Critical residual | `c5`: en campo, la re-revisión deja un Critical abierto | 3 | — |
| `plan-writing.md` y `plan-template.md` | `p`: plan de una feature con una dependencia nueva, más el tramo del paso del plan de la batería de `sdd-propose` (2) | 5 | — |
| `review-spec.md`: el punto de las decisiones del dev-lead | `s1`: spec con una regla más estrecha que una decisión del dev-lead | 3 | — |
| `sdd-implement` sin «Final review» y con `sdd-verify` en el contrato | `h1` (Native) y `h2` (SDD, con el molde arreglado) | 2 | Solo GREEN: humo |
| Menores de la 0175 | — | 0 | Texto devuelto a su fuente (ADR 0013); lo cubren `h1` y `h2` |
| `commit-milestones.md` | — | 0 | Solo cambia, si cambia, el ejemplo de formato; lo comprueba el squash de esta propia feature |

Total: ~39 sujetos, ~3,5 h y ~43 $, con una tanda de REFACTOR. Si la prueba lo supera, se para y decide el dev-lead.

## Anexo — fork: regla de la fuente → dónde vive ahora

| Fuente | Pieza | Dónde vive ahora | Se conserva o motivo (ADR 0013) |
| --- | --- | --- | --- |
| VBC 7.0.0 | Overview, Iron Law, Gate Function | `sdd-verify/SKILL.md` | Se conserva |
| VBC 7.0.0 | Common Failures, Red Flags, Rationalization Prevention, Key Patterns | `sdd-verify/SKILL.md` | Se conserva |
| VBC 7.0.0 | When To Apply | `sdd-verify/SKILL.md` | Se conserva y lo amplía: nombra el contrato de cierre de `sdd-implement` y la línea `Revisión final:` |
| `requesting-code-review` 7.0.0 | Overview, «Core principle» | `sdd-verify/SKILL.md` | Se conserva |
| `requesting-code-review` 7.0.0 | When to Request | `sdd-verify/SKILL.md` | Kit distinto: tras cada task en SDD es la revisión de task de `sdd-implement`; tras la feature, los ejes; antes de fusionar, el cierre único (el merge a `main` lo decide una persona) |
| `requesting-code-review` 7.0.0 | How to Request (`HEAD~1`, un `general-purpose`) | `sdd-verify/SKILL.md` | Kit distinto: la receta del paquete de `encargo-revision.md` y los tres encargos con `sdd-kit:effort-*` |
| `requesting-code-review` 7.0.0 | Act on feedback | `sdd-verify/SKILL.md` | Kit distinto: se reordena por efecto, una pasada de fix, Minor al ledger, Important residual a ✋, Critical residual arreglado |
| `requesting-code-review` 7.0.0 | Example | `sdd-verify/SKILL.md` | Kit distinto: el ejemplo con el paquete y los ejes |
| `requesting-code-review` 7.0.0 | Common Rationalizations, Red Flags | `sdd-verify/SKILL.md` | Se conserva; «Proceed with unfixed Important issues» se acota al cierre único (kit distinto) |
| `code-reviewer.md` 7.0.0 | Rol, «spec is a vision document», Declined to judge, Read-Only, No subagents, Calibration, Output Format, Critical Rules | los tres encargos | Se conserva en cada uno |
| `code-reviewer.md` 7.0.0 | Git Range to Review | los tres encargos | Kit distinto: el paquete y el worktree desanclado |
| `code-reviewer.md` 7.0.0 | What to Check: Plan alignment, Testing, Production readiness | `spec-reviewer-prompt.md` | Kit distinto: repartido por eje |
| `code-reviewer.md` 7.0.0 | What to Check: Code quality | `code-reviewer-prompt.md` | Kit distinto: repartido por eje, con los «Quick Diagnostic» (otro kit) |
| `code-reviewer.md` 7.0.0 | What to Check: Architecture | `architecture-reviewer-prompt.md` | Kit distinto: repartido por eje, con el «Quick Diagnostic» de *Clean Architecture* (otro kit) |
| `code-reviewer.md` 7.0.0 | Example Output | `code-reviewer-prompt.md` | Se conserva |
| `executing-plans` 7.0.0 | Native: «Do not dispatch a re-review…» | `sdd-verify/SKILL.md` | Kit distinto: la única re-revisión del cierre (decisión del dev-lead, 2026-10-14) |
| `subagent-driven-development` 7.0.0 | «ONE fix dispatch, one scoped re-review, adjudicate residuals» | `sdd-verify/SKILL.md` | Kit distinto: esa re-revisión acotada es la única del cierre, la adelanta hasta antes de la validación para que cubra también los commits posteriores, y un Critical residual no se adjudica |
| mattpocock/skills v1.3.1 `code-review` | Ejes en paralelo, «Why two axes», no reordenar entre ejes | `sdd-verify/SKILL.md` | Otro kit |
| mattpocock/skills v1.3.1 `code-review` | «The repo overrides», «Always a judgement call» | `code-reviewer-prompt.md` | Otro kit |
| mattpocock/skills v1.3.1 `code-review` | Smell baseline (12 olores) | — | No entra: lo cubre el «Quick Diagnostic» de *Refactoring* (otro kit) |
| Wondel 1.8.0 | «Quick Diagnostic» de *Clean Code*, *Refactoring*, *A Philosophy of Software Design*, *The Pragmatic Programmer* | `code-reviewer-prompt.md` | Otro kit, literal |
| Wondel 1.8.0 | «Quick Diagnostic» de *Clean Architecture* | `architecture-reviewer-prompt.md` | Otro kit, literal |
| OpenSpec 1.14.1 `openspec-verify-change` | Comprobaciones por `ADDED`/`MODIFIED`/`REMOVED`, Scenario Coverage, «Not verified» ≠ superado | `spec-reviewer-prompt.md` | Otro kit, adaptado (el kit no tiene `RENAMED`; el escenario se cubre con la verificación que nombra «Dónde se prueba») |
| Spec Kit `converge` | Tipos de hueco `missing`/`partial`/`contradicts`/`unrequested` | `spec-reviewer-prompt.md` | Solo el concepto, sin texto (Art. IX) |

## Enmiendas

- 2026-10-14 — «El cierre no repite la revisión final»: con una línea en el formato 2.x, el tramo de la re-revisión empezaba en `Pasada de fix:`, como en la 2.x → empieza en el `sobre` de `Revisión final:`, con la pasada de fix dentro, como en el cierre único — en `c4`, 2 de 2 sujetos re-revisaron desde el `sobre`: una regla para los dos formatos, y la pasada de fix, que en el cierre nuevo siempre se revisa, se revisa también aquí — Task 4 — aprobada: «Desde su «sobre» (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-14 | aprobada: «Apruebo (Recomendada)» |
