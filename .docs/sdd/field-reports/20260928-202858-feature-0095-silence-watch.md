---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-202858-feature-0095-silence-watch
task: 0095
mode: full
date: 2026-09-28
---

# Ticket para el kit — feature 0095: el vigía de silencio, y un hilo que tampoco decía cómo iba

## Contexto

- Carril y modo: feature full, perfil `delegate`, `execution: auto` (salió Native).
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates`, `sdd-end-feature`, `add-to-changelog` y `sdd-feedback`. De superpowers: `brainstorming`, `writing-plans`, `executing-plans` y `test-driven-development`.
- Proyecto: el repo del propio kit (skills en Markdown y scripts PowerShell 7), con un solo dev en la sesión.
- Modelo del hilo: claude-opus-5-5 (effort no registrado).
- Modelos de los subagentes: revisor final claude-opus-5-5 con `sdd-kit:effort-high`, un smoke en Haiku y 28 sujetos headless en Sonnet.
- Coste en reloj: ~3,2 h, de ellas ~1 h de spec y plan, y ~1,5 h de campaña RED/GREEN.
- Coste en tokens: hilo 38.395.194; subagentes 1.868.584; sujetos 13,93 $ (`Measure-SessionTokens.ps1`).

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Durante una campaña larga en segundo plano, el hilo no dice cómo va hasta que el dev-lead pregunta

- **Qué pasó**: la campaña corrió ~1,5 h con los sujetos en serie y en segundo plano. El dev-lead tuvo que preguntar tres veces: «llevas 40 min ..», «como va?» y «llevas 3 horas con esto». Cada vez el hilo tenía el dato (sujetos hechos, coste acumulado, tiempo restante), pero no lo había dado. Es el mismo fallo que la feature arreglaba para los subagentes, aplicado al hilo.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, «Aviso de fase», que solo salta al pasar de paso. La campaña va entera dentro del paso 6. `tests/headless/run.sh` imprime por sujeto, pero nadie lo lee hasta que termina.
- **Por qué el kit no lo evitó**: el aviso de fase da minutos al entrar en el paso y no vuelve a hablar dentro de un paso largo. La previsión inicial (~45 min de RED) se quedó corta y no se corrigió en voz alta.
- **Coste**: tres interrupciones del dev-lead y su confianza en la estimación. En sus palabras: «llevas 3 horas con esto».
- **Propuesta**: en una campaña o un paso en segundo plano de más de ~15 min, el hilo lanza un aviso por cada tanda de escenarios, o cuando la previsión se desvía más de un 30 %, con hechos, coste y lo que queda.
- **Criterio de aceptación**: GIVEN una campaña de 12 sujetos en serie, a ~4 min por sujeto · WHEN pasan 20 min · THEN el hilo ya ha dado al menos un aviso «van N de 12, X $, quedan ~M min» sin que el dev-lead pregunte. RED de hoy: 0 avisos en 40 min.

### 2. Los sujetos headless no cargan el kit sin `SUPERPOWERS_DIR`, y `lib.sh` no lo avisa

- **Qué pasó**: los dos primeros sujetos respondieron «The plugin "sdd-kit" did not load in this session (unmet dependency)» y cerraron en 2 y 5 turnos. Con `SUPERPOWERS_DIR` apuntando a la caché de superpowers, cargó.
- **Dónde en el kit**: `tests/headless/lib.sh`, `build_claude_args` y `subject_launch`.
- **Por qué el kit no lo evitó**: `plugin.json` declara la dependencia de superpowers, que con `--plugin-dir` no se resuelve si la configuración que hereda el sujeto no la tiene. `lib.sh` trata `SUPERPOWERS_DIR` como opcional.
- **Coste**: 0,43 $ y ~10 min hasta ver la causa.
- **Propuesta**: si `$KIT/.claude-plugin/plugin.json` declara `dependencies` y falta `SUPERPOWERS_DIR`, `subject_init` muere con un mensaje que nombra la variable. Ya está anotado en `tech-stack.md`; falta que lo haga el script.
- **Criterio de aceptación**: GIVEN una copia del kit con la dependencia de superpowers y sin `SUPERPOWERS_DIR` · WHEN se lanza `run.sh` · THEN falla antes del primer `claude -p` con «define SUPERPOWERS_DIR», sin gastar un sujeto.

### 3. Las Restricciones globales del plan no llevan las convenciones de la suite

- **Qué pasó**: el pre-commit bloqueó la pasada de fix. El fichero de tests nuevo lanzaba procesos sin `-Tag 'Slow'` (el conjunto rápido pasó de 30 s) y ejecutaba git sin `Clear-GitEnv`. Lo cazaron `tests/*` de convención, no el plan ni la revisión.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, «De código».
- **Por qué el kit no lo evitó**: esas convenciones viven solo en los tests que las vigilan. Ni el plan ni el encargo del revisor las nombran.
- **Coste**: un commit bloqueado y una vuelta de la suite completa (~7 min).
- **Propuesta**: que «De código» diga que las convenciones de test que vigila la suite del proyecto (tag de lentos, aislamiento del entorno) entran en la restricción, o enlazar dónde las documenta `tech-stack.md`.
- **Criterio de aceptación**: GIVEN un plan con un fichero de tests nuevo que lanza procesos y git · WHEN el implementador lo escribe · THEN lleva `-Tag 'Slow'` y `Clear-GitEnv` antes del primer commit.

## Lo que hice por iniciativa propia

- **Vigilé con el propio vigía** la salida de la campaña y el transcript del revisor final. Funcionó (`EN MARCHA … umbral 8 min`), y sirvió de smoke real.
- **Smoke con un subagente Haiku de 40 s**: encontró un límite que la suite no veía. Un subagente que deja trabajo propio en segundo plano y cierra el turno da `TERMINADO` al instante. Ya está en la deuda del roadmap.
- **Un hook `PreToolUse` que finge el despacho** («ya corre en segundo plano, no lo vuelvas a despachar») para medir qué hace el hilo mientras espera. Sirvió en s1-s3. En s4 tuvo un efecto secundario: el hook bloqueó el relanzado que la guía pedía. Para escenarios de relanzamiento hace falta un hook que distinga el primer despacho del segundo.

## Funcionó, no tocar

- **La primera pregunta de `sdd-start-feature`**: carril, modo, perfil y la opción de bajar de modelo, con el predicado lite citado condición por condición.
- **El cruce de la base del paso 6**: `develop` había tocado `roadmap.md` y `tech-stack.md`. La excepción de los registros compartidos evitó un freno falso.
- **La receta del paquete del revisor final**: 817 líneas, que se leyeron sin error de tamaño.
- **La revisión final en Opus** encontró cuatro Important reales que la suite y la campaña no veían: la `description` repetida, las llamadas en paralelo, el vigía de la verificación lenta y los umbrales inválidos.

## Errores míos, no huecos del kit

- La primera pregunta de alcance fue abstracta y no citaba lo que el roadmap y la visión ya decidían. El dev-lead contestó «ya teníamos la configuración hecha... explícame bien qué me pide». La segunda versión, con un ejemplo del caso del ticket, funcionó.
- Intenté editar `red/subject.sh` mientras la campaña lo estaba leyendo. Windows lo bloqueó, y lo resolví con una copia para el GREEN.
- Escribí la línea `Pasada de fix:` con el sha anterior porque el commit había fallado sin que lo comprobara, y tuve que corregirla.
