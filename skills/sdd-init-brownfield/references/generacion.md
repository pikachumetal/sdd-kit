# Generación de los documentos de anclaje en brownfield — detalle

## Paso 3 — Orden de generación y gate

3. **Generar documento a documento, con gate de revisión**: `mission.md` (qué hace el sistema HOY) → `tech-stack.md` (versiones exactas y bloqueos) → `architecture.md` (estructura real) → `constitution.md` (convenciones observadas COMO PROPUESTA + reglas de oro brownfield + sección «Reglas de producto» con las cinco reglas por nombre —dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto— deducidas del código como propuesta a confirmar; lo no deducible queda pendiente) → `roadmap.md` (deuda técnica inventariada en tabla + bloqueos + tabla de patches vacía). Cada documento se presenta al usuario antes de darse por anclaje; si el usuario no está disponible, se entregan marcados **PENDIENTES DE REVISIÓN** — nunca como aprobados.

## Paso 4 — Reglas de oro brownfield

4. **Reglas de oro brownfield** (van a la constitution): retrocompatibilidad por defecto; respetar el patrón existente aunque no sea ideal; cero refactor oportunista; migraciones masivas solo con justificación escrita.

## Paso 5 — Estructura

5. **Estructura**: `.docs/sdd/` completa + `estimation.md` y `estimation-log.md` vacío + `specs/` vacía + `sdd-kit.json` con la versión del kit instalada (`{ "version", "channel": "plugin"|"cli", "updated" }`; la versión es la mayor de `references/migrations/` de esta skill). **`funcional/` NO se crea ni se vuelca**: aparece con la primera task que toque una capacidad — volcar el comportamiento de golpe produce ficheros que nadie revisa. Sin carpeta `templates/`: las plantillas viven en el skill `sdd-templates`. ¿Changelog? — preguntar, o dejar como decisión pendiente. **`environments.md`** calcando `environments-template.md` del skill `sdd-templates` **si el inventario encontró scripts de entorno** (medido en `tests/entorno-worktree-red.md`, F3: sin este paso el entorno queda repartido en notas que ningún predicado lee).
