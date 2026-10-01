---
name: sdd-feedback
description: Usar al cerrar una feature o un patch — lo ofrecen sdd-end-feature y sdd-end-patch — o cuando el usuario pide el ticket, el informe o el feedback de mejora del kit sobre la sesión.
---

# sdd-feedback

## Overview

El ticket es el conocimiento que esta sesión ha aprendido sobre el kit, escrito para el agente que lo mantendrá. Se pierde al limpiar el contexto, por eso se escribe en la misma sesión.

## Checklist (crea un todo por paso)

1. **Versiones** — leer `.docs/sdd/sdd-kit.json` (versión del kit y `ids.mode`) y la versión de superpowers instalada.
2. **Recorrer la sesión** — skills y pasos del kit que se ejecutaron, gates, rodeos, decisiones sin respaldo. No el código del proyecto.
3. **Plantilla** — calcar `kit-feedback-template.md` del skill `sdd-templates`. Cierre limpio —ningún hallazgo por encima de un menor y el reloj dentro del techo de la estimación— → el **ticket mínimo** de la plantilla: cabecera y tres líneas, más los menores.
4. **Guardar** — en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>.md`, timestamp UTC, id y slug como las carpetas de spec. Un ticket por feature o patch: se amplía solo el de esta misma; si la sesión escribió el de otra, nace el suyo y aquel no se toca. Si la carpeta no existe, se crea y se avisa **una vez** de que puede ignorarse en git; **no** se edita `.gitignore`.
5. **Repaso de privacidad** — antes de guardar, repasar el ticket entero buscando nombres propios y datos del dominio del proyecto.
6. **Lint** — pasar al ticket el lint de docs del proyecto (el de `tech-stack.md`, su gate de docs o su pre-commit) y arreglarlo hasta que pase, antes de que el cierre lo commitee. Sin lint de docs, dilo en una línea.

## Reglas

- **Privacidad**: nunca nombres de cliente, proyecto, producto ni personas, ni código ni reglas de negocio. Si un hallazgo no se entiende sin un dato del dominio, se sustituye por un descriptor genérico («una regla de cálculo de precios», «el interlocutor del cliente»); el hallazgo nunca se omite por privacidad.
- **Cada hallazgo lleva su criterio de aceptación** — un escenario GIVEN/WHEN/THEN o el RED que hoy falla y pasaría con la propuesta. Sin él no es un hallazgo, es una queja.
- **Cada propuesta dice si está verificada** (`sí — <cómo>` o `sin verificar`). Un fallo de ejecución citado lleva el comando exacto, el shell y la línea de error.
- **Una causa de coste se respalda** con la spec, el walkthrough o un commit. Una frase del usuario, aunque sea del dev-lead, no la respalda: cifra y causa «sin respaldo».
- **Un error tuyo** que una regla, un paso o una plantilla del kit pudo evitar es un hallazgo con esa ruta, también si la regla existía y no la aplicaste: es una regla que no aguantó. Un fallo del shell o del harness que una regla del kit cubre también es hallazgo; solo el que ninguna regla del kit cubriría no va al ticket.
- **Menores**: menos de ~10 min y una sola vez en la sesión → una línea en «Menores». Si se repitió o costó más, es un hallazgo. Cuenta el coste que viste en la sesión, aunque su causa vaya «sin respaldo».
- **La iniciativa propia va en su propia sección**, no diluida dentro de otro hallazgo: es candidato a regla nueva del kit.
- **La ruta del hallazgo es del kit** (`skills/<skill>/SKILL.md` paso N, una plantilla, una referencia), nunca un fichero del proyecto. Si no se localiza, se dice.
