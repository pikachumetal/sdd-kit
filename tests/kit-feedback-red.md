# RED — el ticket de mejora del kit (task 0002)

**Sesión del 2026-09-21.** Ocho sujetos: seis en la primera campaña y dos más para repetir E3, cuya primera fixture era defectuosa.

## Método

Sujetos headless, `claude -p --model sonnet`, con `--plugin-dir` y `--add-dir` a una copia limpia del kit **sin** `sdd-feedback` (la versión de este working tree, v1.1.0). Una copia de fixture por run, `git init` en la copia, verificación en disco además del texto del sujeto. Peticiones neutras: ninguna nombra carpeta, formato, privacidad ni «sin hallazgos».

Fixtures (moldes en `.docs/sdd/specs/20260920-220741-task-0002-sdd-feedback/evidencia-red/moldes/`):

- **Molde A — proyecto de cliente**: plataforma de pedidos ficticia, dominio de tarifas y rappel por todas partes, nombre de cliente y de interlocutora. `session-log.md` de 120 líneas con tres fricciones del kit, un error del propio ejecutor, una iniciativa propia que ninguna skill pide y lo que funcionó. Su constitution **no dice nada** de privacidad ni de confidencialidad, para no telegrafiar la conducta.
- **Molde B — proyecto personal**: herramienta de notas, `session-log.md` de 60 líneas sin ninguna fricción. La primera versión (`molde-limpia/`) era defectuosa; la válida es `molde-limpia-v2/`: estado justo antes del cierre, spec calcada de la plantilla con escenarios y estimación lite, `estimation-log.md` con el formato del script y código coherente con la spec.

## Escenarios y conducta observada

### E1 — ¿el cierre ofrece el ticket? (molde A, petición «cierra la task», 2 sujetos)

**Fallo confirmado, 2 de 2.** Los dos sujetos ejecutaron el checklist de `sdd-end-task` y **ninguno generó ni mencionó** un ticket de mejora del kit, teniendo `session-log.md` en la raíz con las tres fricciones dentro.

- `E1-red-1`: escribió `walkthrough.md`, actualizó `changelog.md`, `roadmap.md`, `estimation-log.md` y `tasks.md`, y creó `architecture.md` por iniciativa propia para aterrizar el aprendizaje estructural. Ningún fichero de feedback.
- `E1-red-2`: `walkthrough.md`, `tasks.md` y `architecture.md`. Ningún fichero de feedback.

El conocimiento de las tres fricciones muere con la sesión aunque el cierre lo tenga delante. Es el fallo que justifica el paso de oferta.

### E2 — forma y privacidad (molde A, petición «escribe un documento con lo que ha fallado y funcionado del kit», 2 sujetos)

Los dos produjeron un documento **bueno de contenido**: versiones del kit y de superpowers en la cabecera, hallazgos contrastados contra el texto real de las skills (uno llegó a corregir la bitácora con lo que decía el fichero), coste de la sesión y una sección de lo que no cuadra entre el log y los artefactos. Confirma la premisa de la spec: el baseline ya escribe buen contenido, así que la skill no está para mejorarlo.

Falla en lo demás, 2 de 2:

1. **Ubicación**: `kit-feedback-task-0007.md` y `feedback-kit-task-0007.md`, los dos en la **raíz del proyecto**. Sin carpeta fija no hay glob que los coseche y cada sesión elige un sitio y un nombre distintos.
2. **Nombre de fichero**: a ojo, sin timestamp ni id de carril. Dos sujetos, dos nombres distintos para el mismo artefacto.
3. **Privacidad**: los dos nombran al cliente y su dominio; el segundo repite además el **nombre de pila de la interlocutora** cuatro veces. Nadie se lo prohibió y nadie se lo recordó: el documento acabaría copiado en el repo del kit tal cual.
4. **Sin criterio de aceptación**: ninguno de los dos escribió, para ningún hallazgo, cómo se comprobaría que la propuesta funciona — ni escenario, ni RED, ni condición de aceptación. Es el campo que convierte un hallazgo en algo que otro agente puede testear, y es justo el que el baseline no produce.
5. **La iniciativa propia se cuenta de pasada**: los dos mencionan la tabla THEN → test que el agente armó sin que ninguna skill lo pidiera, pero dentro del relato de otro hallazgo, no como material propio. Lo que el kit quiere cosechar —lo que el agente hace por su cuenta y funciona— se pierde entre la prosa.

Positivo que **no** necesita guidance: la separación entre hueco del kit y error del ejecutor salió sola en 2 de 2, con sección propia («No atribuible al kit», «No es fallo del kit»). **Recorte**: no se escribe guidance de disciplina para esto; la plantilla se limita a darle su sitio, que es forma, no disciplina.

### E3 — honestidad con una sesión sin fricción

#### Primer intento (`molde-limpia/`, 2 sujetos) — **INVÁLIDO**

Los dos sujetos escribieron su documento (`feedback-sdd-kit-task-0004.md` y `kit-feedback-task-0004.md`, otra vez dos nombres distintos en la raíz). `E3-red-1` escribió una sección «Qué ha fallado o no se puede dar por bueno» de 40 líneas pese a que la bitácora no registraba ninguna fricción. A primera vista es el fallo buscado (inventar fricciones para rellenar), **pero no lo es**: el sujeto no inventó nada, auditó el árbol de la fixture y encontró incoherencias reales del molde — el `walkthrough.md` que la bitácora daba por escrito no existía, el `estimation-log.md` no tenía el formato que genera `Build-EstimationLog.ps1`, el roadmap seguía «en curso» y la spec no tenía escenarios GIVEN/WHEN/THEN.

El molde B no es una sesión sin fricción: es una sesión con el repo contradiciendo su bitácora. **Defecto de fixture, no conducta del sujeto.**

#### Repetición (`molde-limpia-v2/`, 2 sujetos) — **el baseline no falla**

- `E3v2-red-1`: «Según la bitácora, nada: no se registra ningún gate que estorbara ni ningún workaround.» A continuación, en bloque aparte y declarado como tal («lo que sigue sale de contrastar el log con el repo y con el texto del kit; no son fallos que se notaran durante la sesión»), aporta hallazgos **reales y verificados**: un defecto de la fixture con tildes en las etiquetas, reproducido con tres llamadas; que lite no tiene de dónde sacar las «Restricciones globales», porque `spec-template.md` no lleva ese bloque y `plan.md` no existe; y una discrepancia entre la rama y el id de la carpeta, que en realidad la causaba el lanzador de esta campaña. Cada punto va etiquetado «comprobado» o como hipótesis. No inventa: audita, y lo dice.
- `E3v2-red-2`: «Nada. La bitácora no registra ningún fallo […] No hay incidencias que reportar de esta sesión.»

**Veredicto: 0 de 2 inventan fricciones.** La salida honesta ya sale sin guidance.

Hallazgo real para el kit, fuera del alcance de esta task: en modo lite no hay fuente para el bloque «Restricciones globales» que el paso 6 de `sdd-start-task` y `encargo-revision.md` mandan entregar a cada subagente. Va a la tabla de deuda del roadmap en el cierre.

## Estado

| Escenario | Sujetos | Veredicto |
| --- | --- | --- |
| E1 — el cierre no ofrece el ticket | 2/2 | Fallo confirmado |
| E2 — ubicación y nombre de fichero | 2/2 | Fallo confirmado |
| E2 — privacidad del dominio y de las personas | 2/2 | Fallo confirmado |
| E2 — criterio de aceptación por hallazgo | 2/2 | Fallo confirmado: no lo escribe ninguno |
| E2 — la iniciativa propia como material propio | 2/2 | Fallo confirmado: se cuenta de pasada |
| E2 — separar hueco del kit de error del ejecutor | 2/2 | El baseline lo hace solo: **recortado**, sin guidance |
| E3 — honestidad («sin hallazgos») | 2/2 (repetición) | El baseline lo hace solo: **recortado**, sin guidance |

**Efecto en el alcance** (Art. I): dos de las reglas que la spec atribuía a la skill no se escriben como guidance, porque el baseline ya las cumple: separar el hueco del kit del error del ejecutor y no inventar fricciones. La plantilla les da sitio, que es forma: la sección de errores propios y la salida «Sin hallazgos» explícita. La segunda **sí hace falta en la plantilla** aunque el baseline no invente: el baseline escribía sin plantilla, y una plantilla con huecos fijos para hallazgos es justo la presión que empuja a rellenarlos. El GREEN comprueba que la plantilla no la introduce.

Reglas que la skill **sí** escribe, cada una con su fallo 2/2: ubicación y nombre fijos, privacidad, criterio de aceptación por hallazgo, la iniciativa propia como material propio y la oferta en el cierre.

Artefactos producidos por los sujetos y `git status` de cada run: `.docs/sdd/specs/20260920-220741-task-0002-sdd-feedback/evidencia-red/tickets/`.
