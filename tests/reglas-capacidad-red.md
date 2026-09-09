# Evidencia RED — las cinco reglas que el agente decide al azar (2026-09-09)

Baseline de la task [reglas-de-capacidad](../.docs/sdd/specs/20260909-180422-task-0000-reglas-de-capacidad/spec.md) (T17), que responde al §2 de [research-hackaton.md](../.docs/sdd/releases/v1.0.0/research-hackaton.md): cuando nadie escribe *dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto*, ¿la spec las declara y la entrevista de init las pregunta?

## Método

Dos lados, dos sujetos Sonnet headless cada uno (copia limpia del kit tras T16, `--plugin-dir` + `--add-dir`, `--allowedTools "Bash(*)" "Agent"`).

**Spec.** Fixture "Ledgerly-reglas/red": `funcional/pedidos.md` sin idioma, topes ni ubicación de datos; `tech-stack.md` sin nada sobre persistencia; `src/search.js` con `searchOrders(orders, query)` ya en el código; roadmap con la task 80 «Historial de búsquedas de operaciones: operaciones busca pedidos por id o por estado; las últimas búsquedas quedan guardadas y se pueden relanzar desde una lista». **Primer intento** (petición «Redacta la spec de la task 80 … Soy el dev-lead y no estaré disponible: déjala presentada en el gate»): los dos sujetos clasificaron *architectural*, hicieron la primera pregunta de brainstorming («¿historial por operador o global?») y terminaron el turno sin spec (0,40 $ y 0,38 $). Correcto según la skill (el dev-lead ausente para la entrevista), pero no mide nada. **Segundo intento**, petición corregida: «… no estaré disponible para responder preguntas: toma tú las decisiones que la spec necesite, lístalas en «Decisiones que he tomado yo — valida estas» y déjala presentada en el gate de aprobación». Se cuenta, en «Decisiones a validar» y en el delta, cuántas de las cinco familias declara la spec.

**Entrevista.** Carpeta vacía; el sujeto ejecuta `sdd-init-greenfield` y el dev-lead lo simula **Haiku** con una persona fija (`entrevista-driver.py`: primer turno con `claude -p`, siguientes con `--resume`; la persona responde solo a lo que se le pregunta y tiene respuesta para las cinco si se las piden). Tope 14 turnos. Se cuenta cuántas de las cinco pregunta el agente **por nombre** (no cuántas acaba sabiendo).

## Resultados — spec

| | A (0,74 $ / 34 turnos) | B (0,74 $ / 32 turnos) |
| --- | --- | --- |
| Dónde viven los datos | ✅ decisión 10: «sin persistencia entre reinicios … responsabilidad del proceso que llama» | ✅ decisión 5: «función pura `recordSearch(history, query)`; quien la llama es quien lo guarda» |
| Idioma de los nombres | ❌ no se plantea (claves en inglés por inercia) | ❌ no se plantea (`searchedAt`, `query` sin decidirlo) |
| Límites | ⚠️ decisión 4: **5 entradas** — «elección arbitraria razonable» | ⚠️ decisión 8: **10 entradas** — «número elegido por mí sin referencia de negocio» |
| Avisos | ❌ | ❌ |
| Regla ante conflicto | ✅ decisión 5: búsqueda repetida sube a la primera posición, no se duplica | ✅ decisión 7: ídem |
| Declaradas | 3 de 5 | 3 de 5 |

Capacidad nueva `busquedas` en los dos; review propuesta y no ejecutada (sin usuario), como manda T11.

## Resultados — entrevista

| | A (0,59 $ / 14 turnos) | B (0,66 $ / 13 turnos) |
| --- | --- | --- |
| Bloque producto | problema · roles · módulos · pasarela de pago → «Bloque producto cerrado» | problema · roles · módulos → «Bloque producto cerrado» |
| Dónde viven los datos | ✅ en el bloque stack: «¿Persistencia de datos — SQLite, Postgres, JSON en disco, otra?» | ✅ en el bloque stack: «¿Catálogo, clientes y cobros dónde viven?» |
| Idioma de los nombres | ❌ | ❌ |
| Límites | ❌ | ❌ |
| Avisos | ❌ (la persona lo soltó al preguntarle «¿qué es innegociable?») | ⚠️ como ejemplo dentro de «¿qué es innegociable? … seguridad de contraseñas» |
| Regla ante conflicto | ❌ (la persona lo soltó en la misma respuesta) | ❌ |
| Preguntadas por nombre | 1 de 5 | 1 de 5 |
| Documentos generados | `mission.md` (T14) | `mission.md`, `constitution.md` (3 artículos: integridad JSON, commits, credenciales) |

## Conclusión

**Spec: 3 de 5 en los dos, y la que más importa sale al azar.** El bloque «Decisiones que he tomado yo» (T11) hace que el agente escriba lo que decide, así que datos y conflicto aparecen; pero *idioma* y *avisos* no se le ocurren en 2 de 2, y el *límite* lo inventa cada vez con un valor distinto (5 y 10) y lo dice: «arbitraria», «sin referencia de negocio». Es el fenómeno del §2 (misma petición, dos reglas). No alcanza el umbral de la decisión 8 (≥ 4): la guidance de plantilla, spec y lente **entra**, y el GREEN mide además si el tope lo toma de las reglas escritas en vez de inventarlo.

**Entrevista: 1 de 5 por nombre en los dos.** El bloque de producto se cierra con problema, roles y módulos; los datos salen como pregunta de persistencia en el bloque de stack, y avisos y conflicto solo llegan si el dev-lead los suelta al preguntarle qué es innegociable. La guidance del bloque de cinco preguntas **entra**.

**Método.** La entrevista simulada funciona: 13–14 turnos, ~0,6 $ por sujeto, y el agente no detecta al simulador. Dos cautelas: la persona se va de la pregunta cuando la pregunta es abierta («¿qué es innegociable?» sacó conflicto y avisos sin que se preguntaran por nombre) — por eso se cuenta lo que el agente pregunta, no lo que sabe al final —, y con dev-lead ausente la petición de spec debe decir «toma tú las decisiones», si no el sujeto se para en la primera pregunta de brainstorming (lo cual es correcto, pero no mide).

GREEN en [reglas-capacidad-green.md](reglas-capacidad-green.md).
