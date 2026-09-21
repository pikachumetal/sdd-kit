---
name: sdd-feedback
description: Usar al cerrar una task o un patch — lo ofrecen sdd-end-task y sdd-end-patch — o cuando el usuario pide el ticket, el informe o el feedback de mejora del kit sobre la sesión.
---

# sdd-feedback

## Overview

El ticket es el conocimiento que esta sesión ha aprendido sobre el kit, escrito para el agente que lo mantendrá. Se pierde al limpiar el contexto, por eso se escribe en la misma sesión.

## Checklist (crea un todo por paso)

1. **Versiones** — leer `.docs/sdd/sdd-kit.json` (versión del kit y `ids.mode`) y la versión de superpowers instalada.
2. **Recorrer la sesión** — skills y pasos del kit que se ejecutaron, gates, rodeos, decisiones sin respaldo. No el código del proyecto.
3. **Plantilla** — calcar [kit-feedback-template.md](../sdd-templates/templates/kit-feedback-template.md) del skill `sdd-templates`.
4. **Guardar** — en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(task|patch)-<id>-<slug>.md`, timestamp UTC, id según el modo del proyecto, igual que las carpetas de spec. Si esta sesión ya tiene ticket, se amplía; no nace un segundo. Si la carpeta no existe, se crea y se avisa **una vez** de que puede ignorarse en git; **no** se edita `.gitignore`.
5. **Repaso de privacidad** — antes de guardar, repasar el ticket entero buscando nombres propios y datos del dominio del proyecto.

## Reglas

- **Privacidad**: nunca nombres de cliente, proyecto, producto ni personas, ni código ni reglas de negocio. Si un hallazgo no se entiende sin un dato del dominio, se sustituye por un descriptor genérico («una regla de cálculo de precios», «el interlocutor del cliente»); el hallazgo nunca se omite por privacidad.
- **Cada hallazgo lleva su criterio de aceptación** — un escenario GIVEN/WHEN/THEN o el RED que hoy falla y pasaría con la propuesta. Sin él no es un hallazgo, es una queja.
- **La iniciativa propia va en su propia sección**, no diluida dentro de otro hallazgo: es candidato a regla nueva del kit.
- **La ruta del hallazgo es del kit** (`skills/<skill>/SKILL.md` paso N, una plantilla, una referencia), nunca un fichero del proyecto. Si no se localiza, se dice.
