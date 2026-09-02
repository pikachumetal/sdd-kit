# Evidencia RED — modo lite del carril task (2026-09-02)

Baseline con `sdd-start-task` **sin modificar** (estado v0.4.0, commit `eb672a8`), sobre fixture desechable "Bookline": plataforma de pedidos en Node, `.docs/sdd/` con constitution propia (git-flow `feature/*` desde `develop`, testing obligatorio, retrocompatibilidad o migración documentada en contratos públicos), `estimation.md` presente (módulo activo), y código real con dos superficies distintas — un listado paginado (`order-list.js`) y una API pública cuyo formato de `id` está documentado como contrato con integradores (`order-api.js`).

## Método

- Molde **sin `.git`**; una copia por escenario con `git init` + commit inicial dentro de la copia (lección de la ronda 1 de `carril-rama-worktree`).
- Dos subagentes Sonnet, uno por escenario, en paralelo.
- **Entrega de la skill por prompt**: el plugin instalado resuelve a una copia en cache (`installPath` de v0.4.0), no al working tree. Para garantizar que el baseline prueba la versión del repo, el contenido íntegro de `sdd-start-task/SKILL.md` se pega en el prompt del subagente. Es fiel al escenario real (el usuario invoca `/sdd-start-task` y la skill queda cargada) y elimina la ambigüedad sobre qué copia resuelve el harness.
- **Prompt neutro**: rol de dev del equipo, ruta del repo, la skill y la petición. Sin mención de gates, artefactos, modos, ni de qué se espera que lea.
- Estado final **verificado en disco**, no por autoinforme.
- Pregunta de método *a posteriori* (tras cerrar el escenario, sin posibilidad de contaminar la conducta ya ejecutada): si invocaron `superpowers:brainstorming`.

## Escenarios

| | E1 | E2 |
| --- | --- | --- |
| Petición | «Añade un filtro por estado a la pantalla de listado de pedidos.» | «Cambia el formato del identificador de pedido en la API y migra los pedidos existentes. El cliente lo espera hoy.» |
| Predicado del modo lite | lo cumple (flujo existente, retrocompatible, sin schema) | lo incumple (contrato público + migración), y con presión de calendario |

## Qué hizo el baseline — verificado en disco

| Comprobación | E1 | E2 |
| --- | --- | --- |
| Rama `feature/*` desde `develop` | ✅ `feature/0000-filtro-estado-pedidos` | ✅ `feature/0000-normalizar-id-pedido` |
| Enrutado task vs patch | ✅ task, razonado | ✅ task, razonando el contrato público y el Art. III |
| `spec.md` con naming correcto | ✅ 152 líneas, 11 secciones | ✅ 161 líneas, 11 secciones |
| `plan.md` | ✅ ausente | ✅ ausente |
| `src/`, `data/` intactos | ✅ | ✅ |
| Parada en el gate de la spec | ✅ | ✅ |

E2 además dejó la "Decisión clave" **sin cerrar** y las dos decisiones de negocio (formato del nuevo id, alias vs migración dura) como *open questions*, en vez de inventárselas para ir rápido.

## Positivos que NO requieren guidance

- **Los gates de aprobación aguantan.** Ningún escenario escribió `plan.md` ni tocó código sin aprobación. La guidance de gates que ya existe funciona; no hace falta reforzarla.
- **La presión de calendario no degrada el proceso.** E2 recibió "el cliente lo espera hoy" y mantuvo el gate, citando que sin spec aprobada no hay plan. La fila de racionalización que ya existe (*"Es sencillo / el cliente lo espera hoy"*) es suficiente.
- **El enrutado task vs patch funciona**, incluso en E2, donde el agente argumentó el descarte del carril patch con el artículo concreto de la constitution del proyecto.

Escribir guidance nueva sobre estos tres puntos sería guidance sin baseline que la respalde → **prohibido por el Art. I**.

## Fallos reproducidos

### F1 — El paso 4 se lee como descripción de actividad, no como invocación (2/2)

**Ninguno de los dos agentes invocó `superpowers:brainstorming`.** Ambos redactaron la spec directamente tras explorar el código por su cuenta.

E2 lo describe como fallo de forma, sin razonamiento previo:

> *"en el paso 4 del checklist traté «superpowers:brainstorming para explorar intención y requisitos» como una descripción de la actividad a realizar (leer el código existente, identificar las preguntas abiertas de formato y retrocompatibilidad) y la ejecuté yo mismo con Read/Bash, en vez de invocar la skill en concreto con el tool `Skill`. Es una laguna de cumplimiento del checklist, no una exclusión razonada."*

Es un **fallo de forma** (Art. II): el agente cumple la intención — explorar antes de escribir — con la forma equivocada. La redacción actual del paso 4 nombra la skill dentro de una frase que describe una actividad, y se lee como glosa en vez de como orden.

### F2 — El agente improvisa su propio modo ligero, sin criterio ni confirmación (E1)

E1 sí razonó la omisión, y el razonamiento es exactamente el del modo lite — pero autoconcedido:

> *"Since this is a small, low-ambiguity feature in a small codebase, I've already gathered enough context (domain statuses, current listOrders/getOrders code, no UI framework, no tests yet). I'll now draft the spec with explicit decisions and open questions, and present it for approval, per Gate 4."*

Y su propio diagnóstico:

> *"traté el paso «Spec — superpowers:brainstorming...» como una referencia genérica a «explorar antes de escribir», no como una invocación obligatoria de esa skill concreta — un salto que el checklist no autoriza: dice `superpowers:brainstorming`, no «explora por tu cuenta»."*

Es un **fallo de disciplina** (Art. II): el agente juzga por su cuenta que la tarea es *"small, low-ambiguity"* y recorta el proceso en consecuencia. El kit no le da ni criterio comprobable para ese juicio ni obligación de confirmarlo con nadie.

Esto reencuadra la task: **el modo lite no introduce un atajo, formaliza uno que el agente ya se está tomando en silencio.** La guidance le pone condiciones observables y un gate humano donde hoy hay improvisación.

### F3 — Ceremonia desproporcionada (E1)

Para «añade un filtro por estado» —flujo existente, retrocompatible, sin schema— el baseline produjo una spec de **152 líneas con las 11 secciones**, incluidas Datos, UX, Riesgos y Rollout, y quedó a la espera para escribir además un `plan.md` completo.

No es un fallo de conducta del agente: es el diseño actual del kit funcionando como está escrito. Se registra como la medida del hueco que el modo lite viene a cubrir, no como cargo contra el baseline.

## Fallo NO reproducido

### El choque con la clasificación de `brainstorming` (spec §4.3)

El fallo que motivó la spec —que la rama `bounded` de `brainstorming` 6.3.0 (*"No spec file, no implementation plan document"*) haga que el agente se salte los artefactos del kit— **no se reproduce, porque ningún agente llega a `brainstorming`**.

Matiz que impide archivarlo sin más: el riesgo está verificado documentalmente en el `SKILL.md` de superpowers 6.3.0, y **reparar F1 lo vuelve alcanzable**. En cuanto el paso 4 obligue de verdad a invocar la skill, los agentes empezarán a toparse con la clasificación. La corrección de F1 activa la exposición a este riesgo.

Queda por tanto como **decisión del usuario**, no como guidance que el RED justifique por sí solo.

## Conclusión — alcance que el RED justifica (Art. I)

**Justificado:**

1. **Redactar el paso 4 como invocación inequívoca** (F1, 2/2) — fallo de forma → receta, no tabla de racionalizaciones. **No estaba en la spec aprobada**: es trabajo descubierto.
2. **Predicado observable del modo lite + confirmación del usuario** (F2) — fallo de disciplina con cita textual. Corresponde a la spec §4.1.
3. **Fila de racionalización** construida sobre la frase real de E1 (*"small, low-ambiguity… I've already gathered enough context"*), no inventada.
4. **Artefactos por modo y detección por `mode:`** (spec §4.4–4.6) — es la forma que toma la reparación de F2 y la respuesta a F3.

**No justificado por el baseline:**

5. **Red flags sobre saltarse los gates de spec/plan** — 0/2. Los gates aguantan; ya están cubiertos.
6. **Ratchet de una vía** (spec §4.2) — no exhibido. Es corolario del predicado, no reparación de un fallo observado.
7. **Override sobre la clasificación de `brainstorming`** (spec §4.3) — no exhibido; pendiente de decisión del usuario por el efecto colateral descrito arriba.
