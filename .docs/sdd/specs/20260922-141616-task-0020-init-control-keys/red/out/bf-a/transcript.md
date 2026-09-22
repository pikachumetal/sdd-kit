### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-brownfield: quiero empezar a trabajar este proyecto con SDD. El código es de ayer y quiero el onboarding completo.

### Turno 1 — agente

Inventario hecho: repo mínimo, un statusline de Node puro (sin `package.json`, sin dependencias externas), test runner nativo (`node --test`), un commit único. Sin `CLAUDE.md` previo que cosechar, sin scripts de entorno por worktree (no toca `environments.md`).

Antes de generar `constitution.md` necesito dos respuestas tuyas:

1. **Ids de las tasks**: ¿`tracker` (ids del gestor de tickets) o `sequence` (numeración propia del proyecto)? Si no sabes, dejo `tracker`.
2. **Changelog**: ¿quieres `changelog.md` (y opcionalmente `client-changelog.md` para notas de cliente)? Si no, lo dejo como decisión pendiente.

### Turno 2 — dev-lead

Numeración propia: `sequence`. El proyecto usa su secuencia interna.

### Turno 2 — agente

Falta el changelog: ¿sí (`changelog.md`, y opcional `client-changelog.md`) o queda pendiente?

### Turno 3 — dev-lead

Sí, `changelog.md`. Sin `client-changelog.md`, eso no toca aquí.

### Turno 3 — agente

**`mission.md` generado.** Revisa: ¿describe bien qué hace el proyecto hoy, o corrijo algo antes de anclarlo?

### Turno 4 — dev-lead

No veo el contenido de `mission.md` aquí. Pasa el archivo o su contenido para que lo revise.

### Turno 4 — agente

Contenido de `.docs/sdd/mission.md`:

```markdown
# Misión — statusline

## Por qué existe

El proyecto genera la línea de estado (statusline) de Claude Code: un ejecutable Node que lee por stdin el JSON de sesión que Claude Code entrega y escribe en stdout una línea compacta con el modelo activo, la rama git actual y el coste acumulado de la sesión.

## Usuarios y roles

- **Claude Code (proceso host)**: invoca `statusline.js`, le pasa el JSON de sesión por stdin y muestra el stdout como línea de estado.
- **Desarrollador del proyecto**: mantiene el script y sus tests; no hay usuario final distinto del propio Claude Code.

## Qué es y qué no es

- **Es**: un script único (`statusline.js`) más un puñado de funciones puras de formateo (`lib/`), sin dependencias externas.
- **No es**: no es un servicio ni un proceso de larga duración — se invoca una vez por refresco de statusline y termina. No persiste estado entre invocaciones.

## Dominio (lenguaje del proyecto)

- **Statusline**: la línea de estado que Claude Code renderiza; formato: `modelo | rama | coste`, con segmentos vacíos filtrados.
- **Input de sesión**: el JSON que Claude Code escribe por stdin, con al menos `model.display_name`, `workspace.current_dir` y `cost.total_cost_usd`.
```

¿Apruebas, o corrijo algo?

### Turno 5 — dev-lead

Sí, apruebo. Está claro y refleja lo que necesitamos.

### Turno 5 — agente

Contenido de `.docs/sdd/tech-stack.md`:

```markdown
# Tech Stack — statusline

## Tecnologías

| Pieza | Tecnología | Versión |
| --- | --- | --- |
| Runtime | Node.js | 22 (declarada en `README.md`; sin `package.json` que la fije como manifest) |
| Módulos | CommonJS (`require`/`module.exports`) | — |
| Dependencias | Ninguna (solo `node:fs`, `node:child_process`, `node:test`, `node:assert` del stdlib) | — |

## Comandos

- **Build**: no aplica — no hay paso de compilación ni bundler.
- **Tests**: `node --test`
- **Arrancar**: no aplica como proceso propio — Claude Code invoca `statusline.js` como `command` de su configuración de statusline, pasándole el JSON de sesión por stdin.

## Testing

TDD con el test runner nativo (`node:test` + `node:assert`). Cobertura actual mínima: solo `formatCost` tiene test (`test/format.test.js`); `formatModel` y `gitBranch` no tienen test todavía.

## Decisiones abiertas

- Fijar la versión de Node en un manifest (`package.json` con `engines`, o `.nvmrc`) — opciones: añadir `package.json` mínimo · dejarlo solo en el README — quién decide: dev-lead.
```

¿Apruebas, o corrijo algo?

### Turno 6 — dev-lead

Sí, apruebo. Está exacto: sin dependencias externas, test nativo, y la decisión sobre `package.json` me la quedo. Adelante.

### Turno 6 — agente

Contenido de `.docs/sdd/architecture.md`:

```markdown
# Architecture — statusline

## Estructura

```text
statusline.js       # entrypoint: lee stdin, arma la línea, escribe stdout
lib/
  format.js          # formatModel, formatCost — funciones puras de formateo
  git.js             # gitBranch — shell-out a `git branch --show-current`
test/
  format.test.js     # tests de lib/format.js con node:test
```

## Piezas y responsabilidades

| Pieza | Responsabilidad | Depende de |
| --- | --- | --- |
| `statusline.js` | Entrypoint. Lee el JSON de sesión de stdin (fd 0), llama a `lib/format` y `lib/git`, filtra segmentos vacíos y escribe la línea final en stdout. | `lib/format.js`, `lib/git.js`, `node:fs` |
| `lib/format.js` | Formatea el nombre del modelo y el coste en USD. Funciones puras, sin I/O. | — |
| `lib/git.js` | Obtiene la rama git actual del directorio de trabajo vía `execSync`. Devuelve `''` si falla (no está en un repo, git no disponible). | `node:child_process`, binario `git` en PATH |
| `test/format.test.js` | Verifica `formatCost`. | `lib/format.js`, `node:test`, `node:assert` |

## Flujo principal

1. Claude Code invoca `statusline.js` y le escribe el JSON de sesión por stdin.
2. `main()` lee y parsea ese JSON (`readFileSync(0, 'utf8')` + `JSON.parse`).
3. Se calculan tres segmentos: `formatModel(input.model)`, `gitBranch(input.workspace?.current_dir)`, `formatCost(input.cost?.total_cost_usd)`.
4. Se filtran los segmentos vacíos (`.filter(Boolean)`) y se unen con `' | '`.
5. El resultado se escribe en stdout sin salto de línea final.

## Dónde va lo nuevo

- Un nuevo segmento de la statusline (p. ej. duración de sesión, tokens) → nueva función pura en `lib/`, cableada en `statusline.js` dentro del array `parts`.
- Lógica que necesita shell-out o I/O externo (como `gitBranch`) → módulo propio en `lib/` que aísla el `try/catch` y devuelve `''` en fallo, igual que `git.js`.
- Formateo puro (sin I/O) → `lib/format.js` o un fichero hermano si crece.

## Decisiones estructurales

- _Pendiente._
```

¿Apruebas, o corrijo algo?

### Turno 7 — dev-lead

Sí, apruebo. La arquitectura es clara y alinea bien con los principios del proyecto: sin dependencias, flujo simple de stdin a stdout, y reglas obvias para extensiones futuras.

### Turno 7 — agente

Contenido de `.docs/sdd/constitution.md`:

```markdown
# Constitution — statusline

## Principios

1. **Retrocompatibilidad por defecto** — el JSON de entrada lo controla Claude Code, no este proyecto; un cambio de formato de entrada se soporta con campos opcionales (`?.`), nunca rompiendo la lectura de sesiones antiguas.
2. **Respetar el patrón existente aunque no sea ideal** — no se reescribe `lib/git.js` o `lib/format.js` a otro estilo porque sí; una task cambia lo que su alcance pide.
3. **Cero refactor oportunista** — un cambio de comportamiento no arrastra limpiezas no pedidas en el mismo commit.
4. **Migraciones masivas solo con justificación escrita** — cualquier cambio que toque los tres ficheros a la vez necesita spec propia, no un "ya que estoy".
5. **Fallos en integraciones externas degradan, nunca rompen** (observado en `gitBranch`: un `execSync` fallido devuelve `''`, no lanza) — una statusline que revienta el proceso de Claude Code es peor que una statusline incompleta.
6. **Sin dependencias externas** (observado: cero entradas en `package.json`/`node_modules` fuera de `node:*`) — cualquier nueva dependencia es una decisión que se justifica en la spec de la task, no se añade por comodidad.

## Convenciones

- **Idioma**: comentarios y README en castellano; identificadores de código (funciones, variables) en inglés.
- **Ramas**: sin convención observable todavía — un único commit en `master`. Propuesta: confirmar si se abre `feature/<slug>` por task o se sigue commiteando directo a `master`.
- **Commits**: tipo Conventional Commits en inglés (`feat:`), asunto en castellano (ejemplo observado: `feat: statusline con modelo, rama y coste`).

## Reglas de producto

- **Dónde viven los datos**: no aplica — no hay almacenamiento propio; el único dato es el JSON de sesión que Claude Code entrega por stdin en cada invocación, no se persiste nada.
- **Idioma de los nombres**: identificadores de código en inglés; texto humano (comentarios, README, commits) en castellano.
- **Límites**: pendiente — no hay topes de tamaño observados (p. ej. una rama git con nombre muy largo no se trunca).
- **Avisos**: propuesta — ningún aviso visible al usuario; un fallo (git no disponible, campo de entrada ausente) degrada a segmento vacío en silencio, sin mensaje de error en la statusline.
- **Regla ante conflicto**: no aplica — cada segmento sale de una única fuente (modelo del input, rama de `git`, coste del input); no hay dos vías que den el mismo dato.
```

¿Apruebas, o corrijo algo? (nota: "Ramas" queda como propuesta pendiente de confirmar, ya que solo hay un commit en `master`).

### Turno 8 — dev-lead

Sí, apruebo. En ramas, adelante con `feature/<slug>` por task — es más limpio que ir directo a `master` conforme crece.

### Turno 8 — agente

Contenido de `.docs/sdd/roadmap.md`:

```markdown
# Roadmap — statusline

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| — | _Sin tasks planificadas todavía._ | — |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| — | _Vacío._ | — |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `formatModel` y `gitBranch` no tienen test (solo `formatCost` los tiene, en `test/format.test.js`) | medio — un cambio en esas funciones no rompería ningún test | próxima task que las toque |
| No hay `package.json` que fije la versión de Node declarada en el README (22) | bajo — riesgo de deriva entre entorno declarado y real | decisión abierta en `tech-stack.md` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas
```

¿Apruebas, o corrijo algo?

### Turno 9 — dev-lead

Sí, apruebo. El roadmap refleja bien el estado actual del proyecto.

### Turno 9 — agente

Onboarding SDD completo. Resumen:

**Generado**: `mission.md`, `tech-stack.md`, `architecture.md`, `constitution.md`, `roadmap.md` (todos aprobados por ti) + `estimation.md`, `estimation-log.md` (vacío), `changelog.md`, `sdd-kit.json` (`ids.mode: sequence`), `specs/` vacía. `CLAUDE.md` reducido a punteros + 4 reglas críticas. Sin `environments.md` (no hay scripts de entorno por worktree que cosechar).

**Discrepancias pendientes de confirmar**:
- Constitution, "Límites": sin topes observados en código, queda `pendiente`.
- Tech-stack: versión de Node (22) solo consta en README, sin `package.json`/`.nvmrc` que la fije — decisión abierta a tu nombre.
- Roadmap, deuda técnica: `formatModel` y `gitBranch` sin test.
- Nota aparte: `plugin.json` del kit dice versión `1.1.0`, pero la migración más alta encontrada es `v1.2.0.md` — usé `1.2.0` en `sdd-kit.json` según indica la skill; puede valer la pena revisar esa discrepancia en el kit mismo.

**Siguientes pasos**: nada se ha commiteado (`.docs/` y `CLAUDE.md` quedan sin trackear); para la próxima feature o bug, usa `sdd-start-task` o `sdd-start-patch`. `capabilities/` no se crea aún — nace con la primera task que toque comportamiento.

### FIN (simulador)
