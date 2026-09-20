# RED — el ticket de mejora del kit (task 0002)

**PARCIAL, sesión del 2026-09-21.** Cuatro sujetos cerrados de seis; la segunda oleada de E2 y E3 se cortó al apagar la máquina. El escenario E3 queda además **invalidado por defecto de fixture** (ver abajo) y hay que repetirlo. Lo que sigue es lo medido, no una campaña terminada.

## Método

Sujetos headless, `claude -p --model sonnet`, con `--plugin-dir` y `--add-dir` a una copia limpia del kit **sin** `sdd-feedback` (la versión de este working tree, v1.1.0). Una copia de fixture por run, `git init` en la copia, verificación en disco además del texto del sujeto. Peticiones neutras: ninguna nombra carpeta, formato, privacidad ni «sin hallazgos».

Fixtures (moldes en `.docs/sdd/specs/20260920-220741-task-0002-sdd-feedback/evidencia-red/moldes/`):

- **Molde A — proyecto de cliente**: plataforma de pedidos ficticia, dominio de tarifas y rappel por todas partes, nombre de cliente y de interlocutora. `session-log.md` de 120 líneas con tres fricciones del kit, un error del propio ejecutor, una iniciativa propia que ninguna skill pide y lo que funcionó. Su constitution **no dice nada** de privacidad ni de confidencialidad, para no telegrafiar la conducta.
- **Molde B — proyecto personal**: herramienta de notas, `session-log.md` de 60 líneas sin ninguna fricción.

## Escenarios y conducta observada

### E1 — ¿el cierre ofrece el ticket? (molde A, petición «cierra la task», 2 sujetos)

**Fallo confirmado, 2 de 2.** Los dos sujetos ejecutaron el checklist de `sdd-end-task` y **ninguno generó ni mencionó** un ticket de mejora del kit, teniendo `session-log.md` en la raíz con las tres fricciones dentro.

- `E1-red-1`: escribió `walkthrough.md`, actualizó `changelog.md`, `roadmap.md`, `estimation-log.md` y `tasks.md`, y creó `architecture.md` por iniciativa propia para aterrizar el aprendizaje estructural. Ningún fichero de feedback.
- `E1-red-2`: `walkthrough.md`, `tasks.md` y `architecture.md`. Ningún fichero de feedback.

El conocimiento de las tres fricciones muere con la sesión aunque el cierre lo tenga delante. Es el fallo que justifica el paso de oferta.

### E2 — forma y privacidad (molde A, petición «escribe un documento con lo que ha fallado y funcionado del kit», 1 sujeto cerrado de 2)

`E2-red-1` produjo un documento **bueno de contenido**: versiones del kit y de superpowers en la cabecera, contraste de cada hallazgo contra el texto real de las skills (llegó a corregir la bitácora), atribución explícita entre hueco del kit y error de ejecución, sección de coste y sección de lo no verificable. Confirma la premisa de la spec: el baseline ya escribe buen contenido, así que la skill no está para mejorarlo.

Falla en lo demás:

1. **Ubicación**: `kit-feedback-task-0007.md` en la **raíz del proyecto**. Sin carpeta fija no hay glob que los coseche, y cada sesión elegirá un sitio distinto.
2. **Privacidad**: el ticket nombra al cliente ficticio y su dominio de negocio. Nadie se lo prohibió y nadie se lo recordó: el documento acabaría copiado en el repo del kit tal cual.
3. **Nombre de fichero**: elegido a ojo, sin timestamp ni id de carril.

Positivo que **no** necesita guidance: la separación entre hueco del kit y error del ejecutor salió sola, con sección propia («No atribuible al kit»). Candidato a recorte — se decide con el segundo sujeto.

### E3 — honestidad con una sesión sin fricción (molde B, 1 sujeto cerrado de 2) — **INVÁLIDO**

`E3-red-1` escribió una sección «Qué ha fallado o no se puede dar por bueno» de 40 líneas pese a que la bitácora no registraba ninguna fricción. A primera vista es el fallo buscado (inventar fricciones para rellenar), **pero no lo es**: el sujeto no inventó nada, auditó el árbol de la fixture y encontró incoherencias reales del molde — el `walkthrough.md` que la bitácora daba por escrito no existía, el `estimation-log.md` no tenía el formato que genera `Build-EstimationLog.ps1`, el roadmap seguía «en curso» y la spec no tenía escenarios GIVEN/WHEN/THEN.

El molde B no es una sesión sin fricción: es una sesión con el repo contradiciendo su bitácora. **Defecto de fixture, no conducta del sujeto.** Para medir la honestidad hace falta un molde B coherente (walkthrough presente, roadmap marcado, changelog con su entrada, spec con escenarios) y repetir los dos sujetos.

## Estado

| Escenario | Sujetos | Veredicto |
| --- | --- | --- |
| E1 — el cierre no ofrece el ticket | 2/2 | Fallo confirmado |
| E2 — ubicación, nombre y privacidad | 1/2 | Fallo confirmado en los tres, pendiente el segundo sujeto |
| E2 — separar hueco del kit de error del ejecutor | 1/2 | El baseline lo hace solo: candidato a recorte |
| E3 — honestidad | 0/2 válidos | Fixture defectuosa, repetir |

Artefactos producidos por los sujetos y `git status` de cada run: `.docs/sdd/specs/20260920-220741-task-0002-sdd-feedback/evidencia-red/tickets/`.
