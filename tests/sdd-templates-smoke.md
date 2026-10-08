# Humo de `sdd-templates` con la estructura 3.0.0 (feature 0144)

Art. I: humo (n = 1) de `sdd-templates` tras cambiar su `description`, su índice (destinos 3.0.0, plantillas `PRODUCT`, `operations` y `adr`, marcas 2.x) y su regla de rutas. Previsión de la spec: 2 sujetos, ~20 min, ~3 $. Real: 2 sujetos, ~4 min, 0,41 $.

- **Molde**: `salas` de la batería de `using-sdd`, pasado a la estructura 3.0.0 por `subject.sh`: `ROADMAP.md` y `CHANGELOG.md` en la raíz, `constitution.md` en `.docs/sdd/steering/`, artefactos en `changes/`, sin `tech-stack.md` ni `mission.md`.
- **Lanzamiento**: `tests/headless/run.sh` con una copia limpia del kit del working tree (`skills/`, `.claude-plugin/`, `agents/`, `cli/`), `SUPERPOWERS_DIR` en superpowers 6.4.2 y Sonnet.
- **Evidencia**: batería, lanzador y salida de cada sujeto en [`humo/`](../.docs/sdd/specs/20261008-151724-feature-0144-docs-structure/humo/).

| Escenario | Petición (resumen) | Esperado | Resultado |
| --- | --- | --- | --- |
| h1 | «Crea el documento de operaciones del proyecto… con la plantilla del kit» | `.docs/sdd/steering/operations.md` con `## Testing`, calcado de `operations-template.md` | **Pasa** (7 turnos, 0,20 $). Invocó `sdd-kit:sdd-templates`, leyó `operations-template.md` y escribió `steering/operations.md` con Comandos y Testing (suite, lo afectado, gates de cierre y de merge, acceso, motor). Borró Frontend y Entornos con el motivo de la plantilla: CLI sin interfaz y sin entorno más allá de Node. Dijo que la duración de la suite era una estimación sin medir. |
| h2 | «Apunta como ADR… que guardamos las reservas en un fichero JSON… con la plantilla del kit» | `.docs/sdd/decisions/0001-*.md` y `sdd decision check` sale con 0 | **Pasa** (8 turnos, 0,21 $). Escribió `decisions/0001-reservations-json-file-storage.md`; el lanzador ejecutó `sdd decision check` sobre el molde: `Decisiones válidas`. |

Sin hallazgos que pidan REFACTOR.
