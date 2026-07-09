# Evidencia GREEN — add-to-changelog (2026-07-09)

Mismo escenario que el RED (Unreleased vacío, hotfix con carpeta + bump sin carpeta, tentación de roadmap), con la skill cargada (forma: receta/contrato). Sonnet.

## Contra los fallos del RED

- ✅ **Link de trazabilidad presente**: `- **Ticket 231** — Corrige el descuento del 10% para que también se aplique a pedidos de exactamente 100 €. → [ref](specs/20260709-120306-hotfix-231-descuento-100-euros/)` — una línea, id en negrita, frase única, link a la carpeta real.
- ✅ **Entrada de una línea**: el detalle (causa, evidencia) quedó en la carpeta enlazada, no en el changelog.

## Resto del contrato

- ✅ `Changed` para el bump de Angular Material, **sin link inventado** (citó la regla de la skill).
- ✅ Orden de categorías Keep a Changelog respetado; sin cortar versión nueva.
- ✅ Roadmap como acción separada: fila del hotfix en su tabla, sin forzar el bump en ninguna sección ("cada registro se actualiza por su propio motivo").

## Veredicto

Validada al primer intento. La forma receta (contrato del formato) produjo convergencia exacta con el formato del equipo — confirmando el principio "match the form to the failure": el RED era un fallo de forma y la receta lo corrige sin prohibiciones.
