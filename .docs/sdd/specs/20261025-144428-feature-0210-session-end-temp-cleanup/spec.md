---
id: 20261025-144428-feature-0210-session-end-temp-cleanup
feature: 0210
title: El plugin borra los temporales de Claude Code del proyecto al cerrar la sesión
mode: lite
profile: delegate
status: approved
created: 2026-10-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-25
---

# Spec — El plugin borra los temporales de Claude Code del proyecto al cerrar la sesión

🦆 Hoy, quien usa el kit sin `Start-KitSession.ps1` va llenando `%TEMP%\claude\` con el scratchpad y las salidas de cada sesión, y Claude Code no lo borra nunca. Con este cambio, al cerrar una sesión el plugin mira las carpetas de sesión de ese mismo proyecto y borra las que llevan más de 24 h sin que se escriba nada dentro: si ayer cerraste tres sesiones en `D:\code\facturas`, al cerrar la de hoy desaparecen `%TEMP%\claude\D--code-facturas\<las tres>\`, y la de hoy y las de otros proyectos se quedan. Si algo no cuadra (no sabe qué sesión es la actual, la ruta sale rara), no borra nada y lo dice. Por dentro es un verbo nuevo de la CLI, `sdd hook session-end`, que `hooks/hooks.json` ejecuta en el evento `SessionEnd`.

## Capacidades

- Modificadas: `cli` — la lista de verbos gana `hook session-end`; dos requisitos nuevos del hook de cierre y sus reglas (datos, límites, avisos)

## ✋ Decisiones que he tomado yo — valida estas

Lite: sin review de spec; la pasada de coherencia la he hecho yo (literales del ejemplo contra la regla del nombre, avisos del delta contra la decisión 7). `sdd capability merge` sobre una copia de `.docs/sdd`: `cli.md: sustituido «La CLI se ejecuta con Node y sin dependencias»`, dos requisitos añadidos y cuatro reglas sustituidas; `capability check`: `Capacidades válidas: 20`.

1. **La lógica vive en `cli/bin/session-end.js`, JavaScript sin tipos, y `sdd.js` la ejecuta antes de comprobar la versión de Node**, como `hook session-start`; `cli/src/hook/` la reexporta y registra el verbo en `VERBS`. Por qué: con un Node viejo la comprobación escribe en stderr y sale con 2, y el hook lo enseñaría al usuario en cada cierre; y cargar el TypeScript de `src/` gasta parte del presupuesto de 1,5 s. El enunciado decía `cli/src/hook/`; la fila del roadmap admite `cli/bin/`.
2. **En `hooks/hooks.json`, un `SessionEnd` sin `matcher`** (todos los motivos: salir, `/clear`, `/resume`, `logout`), en forma exec (`"command": "node"`, `"args"` con `sdd.js`, `hook`, `session-end`), sin `timeout`: la documentación de hooks dice «SessionEnd hooks have a default timeout of 1.5 seconds» y «Timeouts set on plugin-provided hooks don't raise the budget».
3. **Plazo interno de 1 s**: tras 1 s desde que arranca, el verbo no empieza a borrar ninguna sesión más; las que quedan caen en el siguiente cierre. Si Claude Code lo mata a media sesión, queda el borrado parcial, que es lo tolerado.
4. **La base es una sola**: `CLAUDE_CODE_TMPDIR` si viene con valor, y si no `os.tmpdir()` (`%TEMP%` en Windows). Una sesión de `Start-KitSession.ps1` limpia `.temp/claude/`, no lo que dejaran en `%TEMP%` sesiones anteriores sin script. `Clear-ClaudeTemp.ps1` recorre las dos; el enunciado dice «o».
5. **La carpeta del proyecto sale de `CLAUDE_PROJECT_DIR`** y, sin ella, del `cwd` del JSON de stdin: es la raíz del proyecto, no el directorio al que se haya movido la sesión.
6. **Rutas largas** *(enmienda 2026-10-25)*: medido con un sujeto headless Haiku en una ruta de 231 caracteres con `CLAUDE_CODE_TMPDIR` en el scratchpad: un nombre de más de 200 caracteres se recorta a 200 y gana `-` y un hash de 32 bits de la ruta original, de multiplicador 31 como `String.hashCode` de Java (`h = (h << 5) - h + unidad UTF-16`, valor absoluto en base 36); la ruta medida da `…-scratchpad-probe-aaa-bjejxf`, igual en `<base>/claude/` y en `~/.claude/projects`, y el cálculo en Node da `bjejxf`. El verbo calcula el nombre exacto, sin buscar por prefijo. Windows no deja lanzar un proceso con un `cwd` de más de 259 caracteres (`The directory name is invalid`, medido con 261), así que el recorte solo se da entre 201 y 259.
7. **Guardas** (si falla una, no borra nada y escribe en stderr `sdd-kit: no borro los temporales de Claude Code: <motivo>`, sale con 0):
   - `session_id` ausente, vacío o con algo que no sea letra, cifra o `-` → `sin session_id válido en la entrada del hook`; un stdin que no es JSON cae aquí.
   - La base no es absoluta → `<base> no es una ruta absoluta`.
   - El nombre de la carpeta del proyecto sale vacío → `no sale el nombre de la carpeta del proyecto de <ruta>`.
   - Que la carpeta del proyecto no exista no es una guarda: no hay nada que borrar, sale en silencio.
8. **Qué es una sesión borrable**: cada subcarpeta directa de la del proyecto que no sea un enlace simbólico ni un junction, con nombre distinto del `session_id`, cuya escritura más reciente (el `mtime` mayor de sus ficheros, recursivo, sin seguir enlaces; sin ficheros, el de la propia carpeta, como `Clear-ClaudeTemp.ps1`) tiene más de 24 h. Los ficheros sueltos de la carpeta del proyecto no se tocan.
9. **La carpeta del proyecto no se borra aunque quede vacía**: queda fuera de «solo dentro de», y otra sesión puede estar creando la suya en ese momento. `Clear-ClaudeTemp.ps1` sí la borra.
10. **No depende de `.docs/sdd/`**: limpia en cualquier proyecto donde el plugin esté activo, a diferencia de `hook session-start`, que sin `.docs/sdd/` no escribe nada.
11. **No entra en la tabla de verbos de `skills/sdd-templates/SKILL.md`**: ninguna skill lo invoca, y tocar la tabla es editar una skill, con su prueba (Art. I). `hook session-start` está ahí; queda la asimetría.
12. **Documentos que nombran el hook**: `architecture.md` (línea de `hooks/`) y `tech-stack.md` («Hook de sesión») ganan el `SessionEnd` en una frase cada uno.
- Política de modelos: revisores de la spec: ninguno (lite) · ejes de la revisión final: los que fije `sdd-archive` (Spec opus+high, Código sonnet+high) · otros despachos: el sujeto Haiku de la decisión 6 · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

Del enunciado del dev-lead (2026-10-25), con sus palabras:

- Carril lite y perfil delegate — «Arranca la 0210 con sdd-propose, carril lite» · «Perfil delegate»
- Solo dentro de la carpeta del proyecto, con las guardas de `run.sh` — «Solo borra dentro de <CLAUDE_CODE_TMPDIR o %TEMP%>/claude/<carpeta del proyecto>/: nunca claude/ entera, nunca la sesión en curso, nada fuera de esa ruta; si una guarda falla, no borra y avisa»
- Antigüedad recursiva — «La antigüedad es la escritura más reciente de cualquier fichero dentro de la sesión, recursiva, no la fecha de la carpeta»
- Sesión en curso — «La sesión en curso es el session_id del JSON que el hook recibe por stdin»
- Tolerancia — «Tolera los errores («no existe», «en uso», un .output abierto en Windows): deja el borrado parcial y sale con 0, sin fallar nunca la sesión»
- Nombre de la carpeta — «la ruta absoluta del cwd con cada carácter no alfanumérico, guion bajo incluido, cambiado por - … mide qué pasa con rutas muy largas»
- Al fusionar — «`sdd merge --push`»

## Intent

Claude Code guarda en `<CLAUDE_CODE_TMPDIR o %TEMP%>/claude/<proyecto>/<sesión>/` el scratchpad y las salidas de las tareas en segundo plano, y no lo borra nunca (casos públicos de 107 GB y 537 GB, [spec de la 0209](../20261022-083957-feature-0209-worktree-temp/spec.md)). La 0209 lo arregló solo para quien arranca con `Start-KitSession.ps1`, porque `CLAUDE_CODE_TMPDIR` se ignora en los settings del proyecto ([walkthrough de la 0209](../20261022-083957-feature-0209-worktree-temp/walkthrough.md)); el resto («el 99,9 % de la gente») sigue llenando el disco. Éxito: tras cerrar una sesión del proyecto, en su carpeta solo quedan la sesión en curso y las que tuvieron escrituras en las últimas 24 h. Fracasa aunque funcione si borra la sesión en curso, una sesión abierta en otra terminal con una tarea en segundo plano escribiendo, algo de otro proyecto o `claude/` entera, o si el cierre de la sesión enseña un error.

## Scope

- Entra: `hooks/hooks.json` (`SessionEnd`); `cli/bin/session-end.js` y su atajo en `cli/bin/sdd.js`; `cli/src/hook/` (reexportación y verbo) y `VERBS`; `cli/test/hook/session-end.test.ts`; la sonda de rutas largas; `architecture.md` y `tech-stack.md` (decisión 12); el delta de `cli`.
- No entra: limpiar `%TEMP%\claude` y `CLAUDE_CODE_TMPDIR\claude` a la vez; otros proyectos; `~/.claude/projects`; la carpeta del proyecto vacía; `Clear-ClaudeTemp.ps1` y `Select-Claude`, que siguen igual (para este proyecto quedan redundantes); la tabla de verbos de `sdd-templates`; la fila 0212 (workspace del plan a `.temp/sdd/`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La lista de verbos de `--help` gana `hook session-end` | `capabilities/cli.md`, «La CLI se ejecuta con Node y sin dependencias» | delta, `MODIFIED` |
| «hooks.json: SessionStart ejecuta…» | `architecture.md:32`, `tech-stack.md:22` | decisión 12 |

- Filas que implementa: 0210 → `roadmap.md:13` (la fila; la cierra `sdd-archive`) y las menciones de `0210` en `capabilities/control-profiles.md:394-397` y `roadmap.md:191-193`, que son ids de ejemplo, no esta fila: se quedan. Comprobado con `git grep -n 0210 -- skills .docs/sdd/capabilities .docs/sdd/*.md`.

## Approach

Un verbo de la CLI en JavaScript sin tipos, como el de arranque, que lee el JSON de stdin, calcula `<base>/claude/<carpeta del proyecto>/`, comprueba las guardas y borra con `fs.rmSync(…, { recursive: true, force: true })` cada sesión vieja, una a una, tragándose el error de cada una. Las reglas son las de `Clear-ClaudeTemp.ps1` (feature 0028 del repo de PowerShell, sha `8cca7f5`) acotadas al proyecto de la sesión, más las guardas de `run.sh` de la 0209. La función de limpieza recibe la entrada, el entorno y la hora, para probarla con fechas fijas.

## Dónde se prueba

- Borrado por antigüedad, sesión en curso, tarea en segundo plano reciente, otro proyecto, enlaces y ficheros sueltos: `cli/test/hook/session-end.test.ts`, con un árbol de fixture y `utimesSync`, como los tests de `session-start`.
- Guardas y salida 0: el mismo test, llamando a la función con stdin inválido, sin `session_id`, base relativa y dos candidatas de ruta larga.
- `hooks/hooks.json`: el mismo test lee el `SessionEnd` y su `args`.
- Nombre con rutas largas: la sonda de la decisión 6 (hecha) y, en el mismo test, la ruta de la sonda con su nombre medido.
- Funcionamiento real: en campo, al cerrar sesiones del kit (`validation.mode: field`).

## Términos y ADR

- Términos resueltos: carpeta de sesión — `<base>/claude/<carpeta del proyecto>/<session_id>/`; carpeta del proyecto — el nombre que Claude Code saca de la ruta del proyecto
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `cli`

**MODIFIED — La CLI se ejecuta con Node y sin dependencias**

- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start|session-end`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`, `validation serve`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

**ADDED — El hook de cierre borra las sesiones viejas del proyecto**

- GIVEN `CLAUDE_CODE_TMPDIR=<t>`, `CLAUDE_PROJECT_DIR=D:\code\facturas` y, en `<t>/claude/D--code-facturas/`, las sesiones `actual` (último fichero escrito hace 30 h), `vieja` (hace 30 h), `reciente` (hace 2 h) y `tarea` (carpeta y `notas.txt` de hace 30 h, `tasks/b1.output` de hace 10 min), el fichero suelto `leeme.txt` de hace 30 h, y `<t>/claude/D--code-otro/vieja/` de hace 30 h
- WHEN Claude Code cierra la sesión y ejecuta `hooks/hooks.json`, que llama a `sdd hook session-end` con `{"session_id":"actual","cwd":"D:\\code\\facturas","hook_event_name":"SessionEnd","reason":"other"}` por stdin
- THEN borra `<t>/claude/D--code-facturas/vieja/` y nada más: se quedan `actual`, `reciente`, `tarea`, `leeme.txt`, la carpeta `D--code-facturas/` y `D--code-otro/vieja/`
- AND no escribe nada en stdout ni en stderr y sale con 0
- AND sin `CLAUDE_CODE_TMPDIR` la base es la carpeta temporal del sistema (`%TEMP%` en Windows); sin `CLAUDE_PROJECT_DIR`, la ruta es el `cwd` del stdin
- AND `D:\code\_worktrees\sdd-kit-0180` da la carpeta `D--code--worktrees-sdd-kit-0180`: cada carácter que no es letra ASCII ni cifra, guion bajo incluido, pasa a `-`
- AND un nombre de más de 200 caracteres se recorta a 200 y gana `-` y el hash de 32 bits de la ruta (multiplicador 31, por unidades UTF-16) en base 36: la ruta de 231 caracteres de la sonda (`…\scratchpad\probe-` + 30 `a` + `_x.y`) da `…-scratchpad-probe-aaa-bjejxf`
- AND si una sesión no se puede borrar entera (un fichero en uso, una carpeta que otro proceso ya borró), deja lo que no pudo, sigue con las demás y sale con 0
- AND un enlace simbólico o un junction dentro de la carpeta del proyecto no se borra ni se sigue

**ADDED — El hook de cierre no borra si una guarda falla**

- GIVEN las mismas carpetas que en el requisito anterior
- WHEN `sdd hook session-end` recibe por stdin `{"cwd":"D:\\code\\facturas"}`, sin `session_id`, o un texto que no es JSON
- THEN no borra nada, escribe en stderr `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook` y sale con 0
- AND con `CLAUDE_CODE_TMPDIR=temporales`, relativa, escribe `sdd-kit: no borro los temporales de Claude Code: temporales no es una ruta absoluta`, no borra nada y sale con 0
- AND si `<t>/claude/<carpeta del proyecto>/` no existe, no escribe nada y sale con 0

**Reglas de la capacidad**

- **Dónde viven los datos**: `sdd init` escribe `.claude/settings.json`, `.gitignore` y `.docs/sdd/sdd-kit.json` del proyecto; la versión, de `.claude-plugin/plugin.json` del kit; el bloque de settings, de su constante en `cli/src/init/`. `sdd upgrade` lee las migraciones de `skills/sdd-upgrade/references/migrations/` del kit cargado y escribe solo `.docs/sdd/sdd-kit.json`. `sdd validation serve` lee los pasos de `--steps` y el panel de `skills/sdd-archive/references/validation-panel.js` del kit cargado, y escribe solo el fichero de `--out`. `sdd hook session-end` lee el JSON de stdin, `CLAUDE_CODE_TMPDIR` y `CLAUDE_PROJECT_DIR`, y solo borra subcarpetas de `<CLAUDE_CODE_TMPDIR o la carpeta temporal del sistema>/claude/<carpeta del proyecto>/`.
- **Idioma de los nombres**: las opciones y las claves en inglés; los mensajes, en castellano.
- **Límites**: `--ignore` relativo a la raíz, sin vacío, absoluto, `..`, espacios al borde ni saltos de línea; una acción por llamada; `--mark`, solo una versión `X.Y.Z` numérica, con su `vX.Y.Z.md` en el kit y mayor que la del proyecto; `sdd validation serve` escucha solo en `127.0.0.1` y en un puerto que elige el sistema, acepta solo peticiones con `Host` y `Origin` de `127.0.0.1:<puerto>`, y `--steps` es una lista JSON de al menos un `{id, title}` con ids únicos y `title` de texto; `--out` es relativo al directorio de trabajo, su carpeta se crea si falta, y el fichero se escribe de nuevo al arrancar; `sdd hook session-end` borra solo las sesiones sin escrituras en las últimas 24 h, nunca la del `session_id`, y tras 1 s desde que arranca no empieza a borrar ninguna más.
- **Avisos**: `<clave>: la fija sdd init, se ignora`; `<ruta con puntos>: se deja <valor JSON>`; `autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia`; `<ruta> no es JSON válido: no se toca`; `<ruta> no se puede fusionar: <ruta con puntos> no es un objeto`; `el proyecto ya está al día con el kit <versión>`; `sin sdd-kit.json: se aplican todas`; `init en curso: sigue con sdd-init`; `--mark <versión>: el kit no trae esa migración`; `--mark <versión>: el proyecto ya está en <versión>`; `panel: http://127.0.0.1:<puerto>/`; `<ruta>: no es una lista de pasos {id, title}`; `sdd-kit: no borro los temporales de Claude Code: sin session_id válido en la entrada del hook`; `sdd-kit: no borro los temporales de Claude Code: <base> no es una ruta absoluta`; `sdd-kit: no borro los temporales de Claude Code: no sale el nombre de la carpeta del proyecto de <ruta>`.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,75 h
- Estimación de implementación: 2,5 h
- Base de la estimación: un verbo nuevo calcado de `hook session-start` (fichero en `bin/`, atajo en `sdd.js`, verbo), una función de ~60 líneas con su test de fixtures por fechas, la sonda Haiku de rutas largas y dos frases de documentos; la incertidumbre es la regla de rutas largas
- Confianza: media

## Enmiendas

- 2026-10-25 — el hash del recorte se llama «de 32 bits, multiplicador 31» en vez de «djb2», y recorre unidades UTF-16 — la revisión final vio que la fórmula medida es la de `String.hashCode`, no djb2 (33, semilla 5381); el valor medido no cambia — corrección de nombre, sin cambio de comportamiento: ruling, no desvío

- 2026-10-25 — decisión 6, un AND nuevo en «El hook de cierre borra las sesiones viejas del proyecto» y fuera la guarda y el aviso de «<n> carpetas de proyecto posibles» — la sonda midió que el hash del recorte es djb2 en base 36 y se reproduce desde Node: el nombre se calcula exacto, sin buscar por prefijo — aprobada (opción «Apruebo»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-25 | aprobada (opción «Apruebo») |
