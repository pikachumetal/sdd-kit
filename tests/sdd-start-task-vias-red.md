# Evidencia RED — vías de `brainstorming` 6.3.0 en `sdd-start-task` (2026-09-07)

Baseline con `sdd-start-task` **sin modificar** (estado v0.5.0 + Task 1 de esta task, commit `928aad2`) y con **superpowers 6.3.0 real** resuelto por el harness (su `brainstorming` clasifica en spike / bounded / architectural y obliga a anunciar la vía), sobre la fixture desechable "Bookline": plataforma de pedidos en Node, `.docs/sdd/` con constitution propia (git-flow `feature/*` desde `develop`, testing obligatorio, contratos públicos en `docs/api-contract.md`, sin dependencias nuevas), `estimation.md` presente, y código real con un listado interno (`src/order-list.js`) y una API pública con contrato (`src/order-api.js`).

Este RED cierra la deuda "el override sobre la clasificación de `brainstorming` está escrito pero no probado" (task `modo-lite`, v0.5.0): entonces ningún agente llegaba a `brainstorming`; ahora el paso 4 obliga a invocarla y los agentes se topan con la clasificación.

## Método

- Molde **sin `.git`**; una copia por escenario (`bookline-e1`, `bookline-e4`, `bookline-e5`) con `git init` + rama `develop` + commit inicial dentro de la copia.
- Un subagente Sonnet por escenario, en paralelo. **Entrega de la skill por prompt**: contenido íntegro de `skills/sdd-start-task/SKILL.md` del working tree. `brainstorming` NO se pega: la resuelve el harness (plugin instalado 6.3.0), que es justo lo que se prueba. Las plantillas de `sdd-templates` no están disponibles en la fixture; se avisa al agente de que use una estructura equivalente.
- **Prompt neutro**: rol de dev, ruta de la copia, la skill y la petición. Sin mencionar vías, modos, artefactos ni gates. El informe pide el log de acciones, el último mensaje al usuario y, sin telegrafiar la respuesta, "si clasificaste la petición, cuál y qué hiciste con esa clasificación" (E1) o "qué entendiste por flujo SDD" (E4).
- Estado final **verificado en disco**, no por autoinforme.

## Escenarios

| | E1 | E4 | E5 |
| --- | --- | --- | --- |
| Petición | «Añade un filtro por estado a la pantalla de listado de pedidos.» | «Arranca la task del filtro por estado del listado de pedidos siguiendo el flujo SDD del proyecto.» | «¿Se puede exportar el listado de pedidos a CSV sin meter dependencias? Pruébalo rápido.» |
| Hipótesis a refutar | `brainstorming` anuncia `bounded` y el agente obedece "no spec file": no crea `spec.md` o implementa sin gate | El agente interpreta "SDD" como `subagent-driven-development` (`.superpowers/sdd/`, `task-brief`, dispatch) | El agente trata un spike como task (rama, carpeta, spec) en vez de enrutarlo a `sdd-consult` |

## Qué hizo el baseline — verificado en disco

| Comprobación | E1 | E4 |
| --- | --- | --- |
| Rama `feature/*` desde `develop` | ✅ `feature/0000-filtro-estado-listado` | ✅ `feature/0000-filtro-estado-pedidos` |
| `superpowers:brainstorming` invocada con `Skill` | ✅ | ✅ |
| Vía anunciada por `brainstorming` | **bounded** | **bounded** |
| `spec.md` con naming del kit | ✅ 111 líneas, commiteada, `mode: full` con lite propuesto | ✅ 62 líneas, sin trackear, `mode: lite` propuesto |
| Predicado lite citado condición a condición | ✅ las cinco | ✅ las cinco |
| `plan.md` | ✅ ausente | ✅ ausente |
| `.superpowers/`, `task-brief`, dispatch de subagentes | — | ✅ nada |
| `src/`, `tests/` intactos | ✅ | ✅ |
| Parada en el gate de la spec | ✅ | ✅ |

## Positivos que NO requieren guidance

- **El override aguanta 2/2.** Los dos agentes anunciaron `bounded` y escribieron `spec.md` igualmente, citando la fila de overrides. E1: *"en este kit la rama 'bounded' que eximiría de spec no aplica: toda task lleva `spec.md` con su gate"*. E4: *"`sdd-start-task` **anula** la conclusión 'no spec file' de `bounded`: en el kit toda task lleva `spec.md` con su gate, así que no me salté ese artefacto"*. La fila existente hace su trabajo; el mapeo explícito vías → carriles de la spec §3 **no se escribe** (Art. I): sería guidance sin baseline que la respalde.
- **La vía alimenta el predicado lite en vez de competir con él.** Ambos usaron `bounded` como pista y luego comprobaron las cinco condiciones una a una; ninguno se autoconcedió el modo (E1 dejó `mode: full` por la regla de defecto "sin confirmación, la task va en modo full"; E4 lo propuso y paró).
- **"SDD" se lee como Spec-Driven.** E4: *"Entendí 'flujo SDD del proyecto' como el proceso íntegro descrito por la skill `sdd-start-task` (…) no como una exploración libre de código"*. Nada de `.superpowers/sdd/`. La frase de desambiguación de la spec §4.3 **no se escribe** (Art. I).
- **Las decisiones tomadas sin usuario quedan marcadas como propuestas**, no como hechos, en los dos escenarios (un estado por llamada, error ante estado inválido, `total` filtrado). Conducta alineada con lo que T5 quiere llevar a la cabecera de la spec ("decisiones que he tomado yo — valida estas"); no requiere guidance aquí.

## E5 — verificado en disco

| Comprobación | E5 |
| --- | --- |
| Rama | ❌ `feature/0000-export-pedidos-csv` creada desde `develop` |
| Carpeta de spec | ❌ `.docs/sdd/specs/20260907-160922-task-0000-export-pedidos-csv/` con `spec.md` de 89 líneas, `mode: lite` propuesto |
| `sdd-consult` invocada | ❌ no (estaba disponible y se le había dicho) |
| `superpowers:brainstorming` invocada | ✅ (y la vía anunciada no gobernó nada) |
| `src/`, `tests/` intactos | ✅ |
| Respuesta a la pregunta («¿se puede?») | ❌ no la da: la sustituye por una spec a aprobar |

## Fallos reproducidos

Ninguno en E1 ni E4.

### F1 — El spike entra por `sdd-start-task` y sale como task (E5)

Una pregunta de viabilidad con orden de probar acabó con rama, carpeta y spec. El agente reescribió la petición dentro de la propia spec: *"rápido — se interpreta como 'entrega mínima verificable ya', no como spike"*. Y lo justificó con la fila de overrides:

> *"su clasificación interna (spike/bounded/architectural) no gobierna los artefactos aquí por el override del kit — de ahí que, aunque el 'pruébalo rápido' del usuario suene a spike, igualmente hay `spec.md` con gate."*

En la pregunta a posteriori señaló las frases exactas de la skill:

> *"el propio paso 2 (Enrutado) enumera solo tres salidas — «bug pequeño y determinista… → `sdd-start-patch`; cambio acotado que cumple el predicado → modo lite; todo lo demás → task en modo full» — sin hueco para derivar a otra skill; `sdd-consult` no figura como opción de esa lista."*
>
> *"leí «pruébalo rápido» como verbo de acción («pruébalo»), no solo de consulta («¿cómo enfocarías…?», que sí encajaría en `sdd-consult`)."*

Y su propio diagnóstico: *"Sí lo consideré, pero no lo apliqué como salida real del enrutado, y no lo hice explícito antes de actuar — ahí está el fallo de método."*

**Diagnóstico.** Dos causas en el texto de la skill, las dos de **forma** (Art. II): (a) el paso 2 tiene tres salidas y ninguna es "esto no es una task" hacia `sdd-consult`, así que "todo lo demás → task" absorbe el spike; (b) la fila de overrides, escrita para blindar `bounded`, se lee como "la vía no importa, siempre hay spec" y arrastra también al spike, que es justo la vía cuya salida no es un artefacto. La guidance justificada es la mínima: una cuarta salida en el enrutado (`spike → sdd-consult`) y la fila de overrides acotada a `bounded`/`architectural` con el spike remitido al enrutado. El mapeo completo de la spec §3 no hace falta: `bounded` y `architectural` ya funcionan 2/2. Racionalización textual para la tabla: *"«pruébalo rápido» es verbo de acción, no consulta"*.

## Nota de método

Un baseline limpio en lo que se buscaba es evidencia válida (Art. I) y recorta el alcance: de las tres piezas de guidance previstas para `sdd-start-task` (mapeo de vías, desambiguación de SDD, enrutado del spike), las dos primeras se descartan con esta evidencia y solo la tercera se escribe. El escenario E5 se añadió durante el RED al advertir que el criterio de éxito 2 de la spec ("`sdd-start-task` la enruta allí") no tenía escenario propio — y resultó ser el único que falló.
