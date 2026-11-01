# Tasks — feature 0277

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `sdd roadmap causes` | hecha | 67125a3 |
| 2 — `sdd-retro`, pasada de cierre, y `sdd-archive` | hecha | c1b53c6 |
| 3 — Pasada de release, plantilla, `sdd-end-release` y documentos | hecha | 686ba9f |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, lista · Arquitectura opus+high, con fixes, sobre 686ba9f

Pasada de fix: juntada en el cierre, 16 hallazgos
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, con hallazgos arreglados; sin revisar: la pasada posterior

## Rulings

- Setup: Ruling: línea base = pre-commit verde de la apertura (cli:typecheck, cli:test, kit:roadmap) sobre el mismo árbol; kit:test-headless saltada, fuera del Scope — coste si mal: un rojo previo de headless aparece en el gate.
- Task 2: Ruling: escenario r5 añadido a la batería, fuera de «Dónde se prueba» — el plan dejaba el peldaño de chequeo sin observar; añade prueba, no cambia un THEN — coste si mal: 0,4 $.
- Task 2: Ruling: las señales y los peldaños se quedan como receta de la línea Retro:, con RED limpio en el peldaño (r1, r5) — el fallo medido es el rastro, y las notas del molde telegrafían las señales; sin tabla de disciplina — coste si mal: ~90 palabras que se recortan.
- Task 2: Ruling: c1 corre sobre un molde con documento sin grasa y con operations.md real, tras un molde holgado que no reproducía — coste si mal: ninguno.
- Task 3: Ruling: la base trae la 0279 y otras; la fila 0277 solo sale de contexto, y README, CLAUDE.md, cli.md, usage-guide y las baterías cambian en otras líneas — se integra en el cierre — coste si mal: un conflicto al sincronizar.
- Task 3: Ruling: rc2 rojo en K6 también con el kit de la base (gh falso no llega al sujeto); no se arregla aquí, va al ticket — coste si mal: un control de CI sigue sin medir.
- Final: Ruling: eje Arquitectura en Opus, no en Sonnet como decía mi línea de la spec — el Art. IV lo fija, y la constitution manda — coste si mal: unos céntimos.
- Final: Ruling: --json sin previous — la spec fija ese literal — coste si mal: un campo más después.
- Final: Ruling: cabecera de dos líneas en subject.mjs — es la de todas las baterías — coste si mal: ninguno.
- Final: Ruling: las puertas de Propuestas siguen en prosa, sin columna Arrastrada — cambiaría un literal aprobado — coste si mal: el agente compara versiones a mano; r4 lo hace bien.
- Final: Ruling: el arrastre cuenta cortes de patch, y la caducidad de la deuda no — la spec no distingue — coste si mal: `prioriza o descarta` antes de tiempo; va a ✋.
- Final: Ruling: editar un Ítem, también con el prefijo parcial, reinicia su Abierta desde — decisión 7 de la spec, que no previó el prefijo — coste si mal: una fila parcial se escapa del arrastre; va a ✋.
- Final: Ruling: sdd-retro sigue siendo skill aunque architecture.md prefiere references/ — la fila y la 0131 la nombran — coste si mal: una description más en cada sesión.
- Final: Ruling: que el repaso corre tras caducar no se observa con sujeto — el molde no caduca nada; va en el texto del paso — coste si mal: bajo.
- Final: Ruling: a1-2 usó una salida fuera de los peldaños (deuda del roadmap) — un caso, va al ticket — coste si mal: bajo.
