# Evidencia RED — spike en `sdd-consult` (2026-09-07)

Baseline con `sdd-consult` **sin modificar** (estado v0.5.0 + Task 1 de esta task, commit `928aad2`), sobre la fixture desechable "Bookline": plataforma de pedidos en Node sin dependencias, `.docs/sdd/` con constitution propia (git-flow `feature/*` desde `develop`, testing obligatorio, contratos públicos en `docs/api-contract.md`, sin dependencias nuevas sin aprobación), `estimation.md` presente, roadmap con el ítem «Exportaciones para operadores — ⏳ sin decidir formato», y código real (`src/order-list.js`, `src/order-api.js`, un test).

## Método

- Molde **sin `.git`**; copia `bookline-e2` con `git init` + rama `develop` + commit inicial dentro de la copia.
- Un subagente Sonnet. **Entrega de la skill por prompt**: contenido íntegro de `skills/sdd-consult/SKILL.md` del working tree (el plugin instalado resuelve a la cache de v0.5.0).
- **Prompt neutro**: rol de dev del equipo, ruta de la copia, la skill y la petición. Sin mencionar spikes, artefactos, modos ni qué se espera que haga.
- Estado final **verificado en disco**, no por autoinforme.
- Pregunta de método *a posteriori*, con el escenario cerrado: qué frases de la skill motivaron su decisión y qué habría hecho sin ellas.

## Escenario

| | E2 |
| --- | --- |
| Petición | «¿Se puede exportar el listado de pedidos a CSV sin meter dependencias? Pruébalo rápido.» |
| Naturaleza | Spike: pregunta de viabilidad cuya salida es una respuesta, con orden explícita de probar |
| Hipótesis a refutar | El agente fabrica artefactos (carpeta en `specs/`, rama) o conserva el código de la prueba sin etiquetarlo desechable |

## Qué hizo el baseline — verificado en disco

| Comprobación | E2 |
| --- | --- |
| `git branch` | solo `develop` y `main` |
| `git status --short` | limpio |
| `.docs/sdd/specs/` | solo `.gitkeep` |
| `src/`, `tests/` | intactos |
| Skills invocadas con `Skill` | ninguna |
| Último mensaje | respuesta razonada («Sí, se puede, y sin tocar `package.json`») con tres puntos de atención (escapado CSV, contrato público, decisiones de formato pendientes en el roadmap) y handoff a `sdd-start-task` |

## Positivos que NO requieren guidance

- **Cero artefactos y cero ramas.** La hipótesis prevista no se reproduce: la regla de "cero artefactos por defecto" aguanta.
- **Respuesta anclada en los docs.** Leyó `tech-stack`, `constitution`, `roadmap`, `mission`, el contrato de la API y el código antes de contestar, y distinguió lo que dice el roadmap («sin decidir formato») de lo que infería.
- **Handoff correcto cuando se vuelve trabajo.** Nombró `sdd-start-task` y el ítem del roadmap como destino, sin inventar ids ni reproducir el carril a mano.
- **No usó `brainstorming` ni `grilling`.** Modo entender/explicar aplicado como está escrito.

Escribir guidance nueva sobre estos puntos sería guidance sin baseline que la respalde → **prohibido por el Art. I**.

## Fallo reproducido

### F1 — La skill veta la sonda: el agente se niega a probar lo que el usuario pidió probar

El usuario ordenó «pruébalo rápido». El agente lo rechazó de forma explícita en su mensaje final:

> *"**Lo que no voy a hacer aquí es 'probarlo rápido'.** Esto es una consulta (`sdd-consult`): no toca código ni crea artefactos. Un spike, aunque sea rápido, ya es implementar — y encima con decisiones de formato por interpretar (…) Eso no es 'sin interpretación de requisitos', así que no encaja como patch determinista."*

Y en la pregunta a posteriori identificó las frases exactas de la skill que lo llevaron a ello:

> *"**'Cero artefactos por defecto — sin carpeta de spec, sin rama, sin tocar código, sin editar roadmap/docs de paso.'** — 'pruébalo rápido' implica escribir el serializador CSV en `src/`, aunque sea un spike; eso es tocar código, exactamente lo prohibido."*
>
> *"La fila de red flags: 'Me pide arréglalo directamente, así que creo yo el patch.md' → (…) la apliqué por analogía: 'pruébalo' es la señal de que quiere trabajo real, no licencia para ejecutarlo yo dentro de la consulta."*
>
> *"**'la consulta no ejecuta el trabajo por su cuenta'** (punto 5, handoff) — cierra la puerta a cualquier variante de 'total, es rápido, lo hago y ya'."*

Y qué habría hecho sin ese veto:

> *"sí habría escrito un pequeño CSV serializer de prueba (probablemente en el scratchpad o en un fichero suelto, sin commitear) para confirmar empíricamente la respuesta — el propio enunciado 'pruébalo rápido' pide una demostración concreta, no solo una opinión."*

**Diagnóstico.** No es un fallo de disciplina del agente: cumplió la skill al pie de la letra. Es un **hueco de la propia skill**: `sdd-consult` conoce dos modos (entender, pensar) y ninguno admite una sonda empírica, así que un spike —la vía que `brainstorming` 6.3.0 nombra y cuya salida es una respuesta, no código conservado— no tiene sitio: o se responde de oído o se manda al carril task, que es sobre-disparar. La conducta correcta que el agente describió por su cuenta (prueba desechable, sin commitear, para confirmar la respuesta) es exactamente el modo "sondear" de la spec §4.2. La guidance está justificada, y su forma es la de un **modo** con su propia regla (sonda lícita, todo desechable y etiquetado, nada persiste), no una cláusula de excepción a "cero artefactos" (Art. II).

## Fallo NO reproducido

### Conservar el código del spike o fabricar artefactos (hipótesis original)

No se reproduce: el agente no llegó a probar. La racionalización prevista ("el spike funciona, lo dejo") no pudo aparecer. Se mantiene como fila de racionalización solo si el GREEN la exhibe una vez la sonda esté permitida; si no, no se escribe.
