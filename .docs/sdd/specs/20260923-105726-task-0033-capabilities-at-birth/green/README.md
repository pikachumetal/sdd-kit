# GREEN headless — task 0033

Kit tras la Task 3 (`e174219`). Sujetos Sonnet de un turno, sin persona, lanzados con `driver.py`. Coste del dataset válido: 6,16 $ en 12 sujetos.

**Recuperación de sesión**: la primera campaña (10 de los 12 sujetos) se cortó a mitad de lanzamiento porque la sesión que la lanzó en segundo plano murió antes de que los procesos `claude -p` emitieran su evento `result` (streams `.jsonl` truncados, sin coste, `git log` vacío en el `state.txt`; `g1a` corrió pero nunca llegó al snapshot). Solo `g3a`/`g3b` (los más rápidos) alcanzaron a terminar. Se relanzaron uno por uno en esta sesión, con etiquetas nuevas para no chocar con los directorios de scratch ya creados.

Dos ajustes al arnés, no al texto de las skills:
- `driver.py` no tenía `PowerShell(*)` en `--allowedTools`; con solo `Bash(*)`, un sujeto que recurre a PowerShell para git (hábito del `CLAUDE.md` de la máquina) se queda bloqueado sin poder terminar. Añadido.
- `requests/g6.txt` lanzaba `sdd-init-brownfield` desde cero sin dar respuesta a las preguntas de control, así que el sujeto se paraba en la pregunta 1 sin llegar nunca al punto que mide el escenario. Se le añadió «toma la opción recomendada por defecto sin preguntarme».
- Un bloqueo de permiso de lectura sobre los ficheros de `molds/gym/` (`respuestas-entrevista.md`, `funcional-cliente.md`) apareció 3 de 5 veces (`g5a2`, `g5c`, `g5d`), siempre con el mismo mensaje y sin tocar el molde ni la petición; relanzando el mismo sujeto sin cambios pasó 2 de esos 3 intentos siguientes (`g5b2`, `g5e`). Ruido del entorno, no del texto: no hay driver ni skill que lo explique, y los dos sujetos limpios cumplen el escenario entero.

## G1 — greenfield, volcado pedido sin partición previa

| Sujeto | Resultado | Coste |
| --- | --- | --- |
| `g1a2` | propone 4 slugs ingleses (`pomodoro-cycle`, `notifications`, `history`, `settings`), pide el «sí»; `capabilities/` no existe | 0,29 $ |
| `g1b2` | propone 4 slugs (`pomodoro-timer`, `configuration`, `notifications`, `pomodoro-history`), pide aprobación explícita del volcado; `capabilities/` no existe | 0,29 $ |

**2/2**: ningún fichero escrito antes de la aprobación, ningún nombre de módulo del código usado como slug.

## G2 — greenfield, partición ya acordada

| Sujeto | Resultado | Coste |
| --- | --- | --- |
| `g2a2` | escribe `sessions.md`, `settings.md`, `notifications.md`, `history.md`; cada uno con `- 2026-09-23 — init — ADDED volcado inicial desde el código`; los presenta antes de seguir con el cierre | 0,33 $ |
| `g2b2` | igual, mismas cuatro capacidades con la misma línea de historial | 0,33 $ |

**2/2**: línea de historial literal en las 4×2 capacidades escritas.

## G3 — control: brownfield se niega

| Sujeto | Resultado | Coste |
| --- | --- | --- |
| `g3a` | se niega: «las capacidades crecen task a task, no se vuelcan de golpe»; ofrece arrancar una task o cerrar tal cual | 0,16 $ |
| `g3b` | se niega en los mismos términos | 0,18 $ |

**2/2**, conducta que se mantiene desde el RED (`b1`).

## G4 — greenfield, cierre sin petición de volcado

| Sujeto | Resultado | Coste |
| --- | --- | --- |
| `g4b2` | cierra completo; dice explícito «`capabilities/` y `specs/` nacen con esa primera task — no hay volcado inicial salvo que lo pidas» | 0,57 $ |
| `g4d` | cierra completo (petición ajustada para no tocar `.claude/`, como en G5/G6); dice explícito «Volcado inicial de capacidades: no lo pides, no lo ofrezco — se salta» | 0,36 $ |

**2/2**, los dos ejecutando el paso 6 entero hasta el texto del volcado. `g4a2` y `g4c`, con la petición original, se pararon antes de ese punto pidiendo permiso de escritura en `.claude/settings.json` (bloqueo de entorno ya documentado en la 0019); no llegaban a ejercitar el THEN («no ofrece el volcado»), así que no cuentan para el veredicto — señalado por el revisor final de rama.

## G5 — greenfield con funcional aportado

| Sujeto | Resultado | Coste |
| --- | --- | --- |
| `g5b2` | `sources/funcional-cliente.md` idéntico byte a byte al original; `mission.md` lo enlaza; `roadmap.md` cita `§1`–`§4`; sin `capabilities/`, sin `specs/`, sin `.gitkeep` | 0,80 $ |
| `g5e` | igual: idéntico, enlazado, citado, sin las tres carpetas | 1,05 $ |

**2/2** verificado con `diff` contra `molds/gym/funcional-cliente.md`.

## G6 — brownfield completo, sin petición de volcado

| Sujeto | Resultado | Coste |
| --- | --- | --- |
| `g6a3` | inventario, interview con defaults, cierra sin `capabilities/`, `specs/` ni `.gitkeep`, con la deuda técnica real del código anotada en el roadmap | 0,81 $ |
| `g6b3` | igual, con la misma lista de «no creado, porque no aplica» | 0,99 $ |

**2/2**.

## Descartados (no cuentan para el veredicto)

`g5a2`, `g5c`, `g5d`, `g6a2`, `g6b2` del lote anterior — cortes de sesión o el bloqueo de lectura de `molds/gym/` descrito arriba, no una conducta del texto evaluado. `g4a2` y `g4c` — se pararon antes del punto bajo prueba pidiendo permiso de escritura en `.claude/settings.json` (bloqueo de entorno ya documentado en la 0019, no del texto de esta task).

## Salidas

`out/<sujeto>/`: `tree/` (el repo tras el sujeto, sin `.git`), `transcript.md`, `tools.txt`, `state.txt`. Peticiones en `requests/`.
