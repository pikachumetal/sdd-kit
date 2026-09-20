# Generación de los documentos de anclaje en brownfield — detalle

## Paso 3 — Orden de generación y gate

3. **Generar documento a documento, con gate de revisión**: `mission.md` (qué hace el sistema HOY) → `tech-stack.md` (versiones exactas y bloqueos) → `architecture.md` (estructura real) → `constitution.md` (convenciones observadas COMO PROPUESTA + reglas de oro brownfield + sección «Reglas de producto» con las cinco reglas por nombre —dónde viven los datos (fichero, tabla, memoria, almacenamiento del cliente) · idioma de los nombres (API, claves, mensajes) · límites (topes: tamaños, profundidades, número de resultados) · avisos (qué se avisa al usuario y cuándo, p. ej. un secreto en claro) · regla ante conflicto (qué manda cuando dos vías dan el mismo dato)— deducidas del código como propuesta a confirmar; lo no deducible queda pendiente) → `roadmap.md` (deuda técnica inventariada en tabla + bloqueos + tabla de patches vacía). Cada documento se presenta al usuario antes de darse por anclaje; si el usuario no está disponible, se entregan marcados **PENDIENTES DE REVISIÓN** — nunca como aprobados.

## Paso 4 — Reglas de oro brownfield

4. **Reglas de oro brownfield** (van a la constitution): retrocompatibilidad por defecto; respetar el patrón existente aunque no sea ideal; cero refactor oportunista; migraciones masivas solo con justificación escrita.

## Paso 5 — Estructura

5. **Estructura**: `.docs/sdd/` completa + `estimation.md` y `estimation-log.md` vacío + `specs/` vacía + `sdd-kit.json` con la versión del kit instalada y el modo de ids que respondió la entrevista (`{ "version", "channel": "plugin"|"cli", "updated", "ids": { "mode": "tracker"|"sequence" } }`; la versión es la mayor de `references/migrations/` de esta skill). **`capabilities/` NO se crea ni se vuelca**: aparece con la primera task que toque una capacidad — volcar el comportamiento de golpe produce ficheros que nadie revisa. Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates`. ¿Changelog? — preguntar, o dejar como decisión pendiente; si sí, ¿también novedades para el cliente? (`client-changelog.md` calcado de `client-changelog-template.md`, alimentado por `sdd-end-release` desde las release notes). **`environments.md`** calcando `environments-template.md` del skill `sdd-templates` **si el inventario encontró scripts de entorno** (medido en `tests/entorno-worktree-red.md`, F3: sin este paso el entorno queda repartido en notas que ningún predicado lee).
