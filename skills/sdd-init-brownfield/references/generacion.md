# Generación de los documentos de anclaje en brownfield — detalle

## Paso 3 — Orden de generación y gate

3. **Generar documento a documento, con gate de revisión**: `mission.md` (qué hace el sistema HOY) → `tech-stack.md` (versiones exactas y bloqueos) → `architecture.md` (estructura real) → `constitution.md` (convenciones observadas COMO PROPUESTA + reglas de oro brownfield + sección «Reglas de producto» con las cinco reglas por nombre —dónde viven los datos (fichero, tabla, memoria, almacenamiento del cliente) · idioma de los nombres (API, claves, mensajes) · límites (topes: tamaños, profundidades, número de resultados) · avisos (qué se avisa al usuario y cuándo, p. ej. un secreto en claro) · regla ante conflicto (qué manda cuando dos vías dan el mismo dato)— deducidas del código como propuesta a confirmar; lo no deducible queda pendiente) → `roadmap.md` (deuda técnica inventariada en tabla + bloqueos + tabla de patches vacía). Cada documento se calca de su plantilla de `sdd-templates` (`mission-template.md`, `tech-stack-template.md`, `architecture-template.md`, `constitution-template.md`, `roadmap-template.md`): la forma es la de la plantilla y el contenido, el del código; nunca se copia el documento de otro proyecto. Cada documento se presenta al usuario antes de darse por anclaje; si el usuario no está disponible, se entregan marcados **PENDIENTES DE REVISIÓN** — nunca como aprobados.

## Paso 4 — Reglas de oro brownfield

4. **Reglas de oro brownfield** (van a la constitution): retrocompatibilidad por defecto; respetar el patrón existente aunque no sea ideal; cero refactor oportunista; migraciones masivas solo con justificación escrita.

## Paso 5 — Estructura

5. **Estructura**: `.docs/sdd/` con:
   - `estimation.md` calcando `estimation-template.md`, con la calibración vacía.
   - `estimation-log.md` generado con `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`, que lo deja con su cabecera y sin filas (el script vive en el kit y no se copia al proyecto).
   - `sdd-kit.json` con la versión del kit instalada, el modo de ids y las claves de control que respondió la entrevista (`{ "version", "channel": "plugin"|"cli", "updated", "ids": { "mode": "tracker"|"sequence" }, "control"?, "merge"?, "execution"? }`, con `ids.mode` de la pregunta 1 (`sdd-config`), con `control`, `merge` y `execution` solo con lo respondido; la versión es la mayor de `references/migrations/` de esta skill).
   - **`capabilities/` y `specs/` no se crean**: git no versiona carpetas vacías, y ninguna se crea vacía ni con `.gitkeep`. `specs/` nace con la primera task o patch; `capabilities/`, con la primera task que toque una capacidad. **Brownfield no vuelca capacidades, aunque el usuario lo pida**: volcar el comportamiento de golpe produce ficheros que nadie revisa. Si lo pide, explícale que crecen task a task.
   - Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates`.
   - ¿Changelog? — preguntas 6 y 7 del paso 3 (o decisión pendiente); si sí, `changelog.md` calcando `changelog-template.md`, y ¿también novedades para el cliente? (`client-changelog.md` calcado de `client-changelog-template.md`, alimentado por `sdd-end-release` desde las release notes).
   - **Configuración del proyecto**: `.claude/settings.json` se crea, o se fusiona sin tocar las demás claves, con `"autoMemoryEnabled": false`, porque la memoria automática vive en una sola máquina y lo que se aprende va a los docs; si ya tiene `"autoMemoryEnabled": true`, pregunta antes de cambiarlo y, si el usuario dice que no, se deja y el resumen de cierre lo anota.
   - `.gitignore` gana `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` si faltan, sin duplicar líneas, y se crea si no existe.
   - **`environments.md`** calcando `environments-template.md` del skill `sdd-templates` **si el inventario encontró scripts de entorno** (medido en `tests/entorno-worktree-red.md`, F3: sin este paso el entorno queda repartido en notas que ningún predicado lee).
