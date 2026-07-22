# Constitution — sdd-kit

Principios no negociables del kit. La constitution manda sobre cualquier spec.

## Art. I — Ley de hierro de skills

Ninguna skill nueva ni edición de una existente sin test que falle primero: baseline sin la skill (RED, con racionalizaciones textuales documentadas) → skill dirigida a esos fallos (GREEN, mismos escenarios) → cierre de huecos. La evidencia vive en `tests/<skill>-red.md` y `tests/<skill>-green.md`. Aplica también a recortes, traducciones y "pequeños ajustes". Si el baseline no exhibe el fallo, no se escribe la guidance.

## Art. II — La forma sigue al fallo

- Fallo de disciplina (sabe la regla y la salta bajo presión) → prohibición + tabla de racionalizaciones + red flags.
- Fallo de forma (cumple pero con la forma equivocada) → receta/contrato de cómo ES el output.
- Comportamiento condicional → predicado observable ("si existe `.docs/sdd/estimation.md`…"), nunca cláusulas de excepción.

## Art. III — Idioma

Texto humano (skills, docs, tests, commits-cuerpo) en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case; los documentos de flujo del equipo (`.docs/flux/`) en catalán. No se traducen las skills al inglés por ahorro de tokens: el ahorro es marginal y rompe la validación y la legibilidad del equipo (decisión 2026-07-09).

## Art. IV — Convenciones que el kit fija a los proyectos

`.docs/sdd/` como raíz de artefactos; naming `<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>` en UTC con id de ticket (0000 si no hay); artefactos de release (acta, release notes) en `.docs/sdd/releases/vX.Y.Z/`; módulos por predicado observable; el merge es SIEMPRE decisión del usuario. Cambiar cualquiera de estas convenciones es un cambio mayor: spec dedicada + revisión de las 9 skills afectadas.

## Art. V — Versionado

SemVer en `.claude-plugin/plugin.json`. Cada release: bump de versión + entrada en `.docs/sdd/changelog.md`. Los usuarios actualizan con `/plugin marketplace update`.

## Art. VI — Commits

Tipo/scope en inglés, título y cuerpo en castellano, nunca title-only.

## Art. VII — Dogfooding

Los cambios no triviales del kit pasan por su propio flujo: `sdd-start-task` → spec → plan → implementación → `sdd-end-task`, con artefactos en `.docs/sdd/specs/`. Los fixes pequeños deterministas, por el carril patch.

## Art. VIII — Una sola fuente de plantillas

Las plantillas canónicas viven SOLO en `skills/sdd-templates/templates/`. Ninguna copia en ningún sitio: ni en este repo ni en los proyectos consumidores — al crear un artefacto se calca del skill `sdd-templates` (decisión 2026-07-21; antes los proyectos instalaban copia y derivaban).
