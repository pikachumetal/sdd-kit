# Misión — sdd-kit

## Por qué existe

El equipo aplicaba SDD con skills copiadas en cada repo (marketplace, legacy, banco de pruebas), y las copias derivaban: rutas distintas, módulos distintos, fraseos distintos. El kit es el **nivel 1 de la taxonomía de skills del equipo** — el proceso, agnóstico de stack — con un único origen de verdad, instalable y actualizable centralmente.

El principio que lo gobierna: **el resultado debe depender del proceso, no del criterio individual de quien ejecuta**. Las skills encapsulan las convenciones; el dev sigue un flujo guiado con gates.

## Usuarios

- Developers del equipo trabajando con Claude Code en cualquier proyecto (nuevo o legacy).
- Los propios agentes: las skills están escritas para que un agente las cumpla bajo presión (validadas contra baselines que fallan sin ellas).

## Qué es y qué no es

- **Es**: las 7 skills de proceso (init ×2, task ×2, hotfix ×2, changelog) + las plantillas canónicas.
- **No es**: skills técnicas por stack (nivel 2: sql-migration, backend-*, frontend-*) ni específicas de proyecto (nivel 3: build, dialogs, styles) — esas viven en cada repo o en futuros kits.

## Dominio (lenguaje del equipo)

- **Documentos de anclaje**: mission, constitution, tech-stack, architecture, funcional, roadmap — el contexto por capas que sustituye al CLAUDE.md monolítico.
- **Carril task / carril hotfix**: flujo completo con spec y plan vs registro ligero para bugs deterministas.
- **Módulo por predicado observable**: una capacidad opcional (estimación, changelog) se activa por la presencia de su fichero, sin configuración.
- **Walkthrough**: cierre inmutable de una task; alimenta docs vivos, skills y estimation-log.
