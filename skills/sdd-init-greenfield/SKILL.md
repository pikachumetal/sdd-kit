---
name: sdd-init-greenfield
description: Usar cuando arranca un proyecto nuevo (sin código o casi) y hay que dejarlo preparado para trabajar con SDD — "prepara el proyecto", "inicializa la documentación", "empezamos el proyecto X". No para proyectos con codebase existente (eso es sdd-init-brownfield).
---

# sdd-init-greenfield

## Overview

Deja un proyecto nuevo preparado para el flujo SDD: documentación de anclaje por capas en `.docs/sdd/`, `CLAUDE.md` corto con punteros, plantillas y estructura. El contenido sale de una **entrevista con el usuario** — no de tus suposiciones.

El motor de la entrevista es `superpowers:brainstorming` (o `grilling` si el usuario lo prefiere): preguntas de una en una, y cada documento se aprueba antes de darse por anclaje.

## ⛔ Gate: sin entrevista no hay documentos

Invocar esta skill arranca la entrevista, no la generación. Si el usuario no está disponible para responder, la init queda **EN ESPERA en la primera pregunta** — convertir las preguntas en "asunciones documentadas" no es una entrevista: es inventar un proyecto.

## Estructura objetivo (la fija el kit, no se rediseña)

```text
/
├── CLAUDE.md                 (corto: punteros + 3-5 reglas críticas)
├── .docs/
│   └── sdd/
│       ├── mission.md        (por qué existe, usuarios/roles, dominio)
│       ├── constitution.md   (principios no negociables)
│       ├── tech-stack.md     (tecnologías con versiones; decisiones abiertas, como abiertas)
│       ├── architecture.md   (cómo se construye)
│       ├── funcional.md      (requisitos; crece con el producto)
│       ├── roadmap.md        (módulos identificados + deuda + tabla de hotfixes)
│       ├── estimation.md     (método) · estimation-log.md (VACÍO: se llena con las tareas)
│       ├── templates/        (copiadas del kit sdd-templates; si el kit no está accesible, carpeta con nota pendiente)
│       └── specs/            (vacía)
```

Nunca `docs/`, `docs/superpowers/` ni taxonomías propias (ADRs sueltos, glosarios aparte): las decisiones técnicas viven en constitution/architecture y el lenguaje del dominio en mission.

## Flujo (crea un todo por paso)

1. **Entrevista** — `superpowers:brainstorming`, una pregunta cada vez, por bloques: (a) producto — problema, usuarios y roles, módulos imaginados; (b) stack — si no está decidido, opciones con trade-offs y tu recomendación, pero **la decisión es del usuario** y puede quedar abierta (se registra en tech-stack como pendiente con las opciones); (c) principios — qué es innegociable (datos, migraciones, commits, seguridad); (d) proceso — ¿changelog? ¿gestor de tickets? ¿convención de ramas?
2. **Generar documento a documento, con gate**: mission → presentar → aprobar; después constitution → … Nada se da por anclaje sin aprobación explícita del usuario.
3. **Estructura**: crear `.docs/sdd/` completa, copiar plantillas, `estimation-log.md` vacío.
4. **`CLAUDE.md` corto**: punteros a los documentos + reglas críticas. No duplicar contenido que ya vive en un doc de anclaje.
5. **Git**: `git init` si no hay repo, con la convención de ramas acordada en la entrevista.
6. **Cierre**: resumen de lo creado + siguientes pasos — partición fina y estimación cuando el funcional madure; skills de nivel 2 recomendadas según el stack (esta skill no las crea).

## Red flags — STOP

- Estás escribiendo mission o constitution y el usuario no ha respondido la entrevista.
- Has decidido tú el alcance del MVP, un rol o el stack "como propuesta razonable".
- Estás creando `docs/`, `docs/superpowers/` o ADRs sueltos en vez de `.docs/sdd/`.
- El estimation-log nace con contenido.

| Racionalización | Realidad |
| --- | --- |
| "El usuario no responde: convierto las preguntas en asunciones documentadas" | Eso es inventar un proyecto. La entrevista ESPERA: tu último mensaje es la primera pregunta de la entrevista. |
| "Lo marco todo como borrador pendiente y así avanzo" | Cientos de líneas de suposiciones anclan las conversaciones futuras a TUS decisiones. Un documento corto y aprobado vale más que ocho borradores inventados. |
| "Una estructura con ADRs y glosario es más estándar" | La estructura del equipo es `.docs/sdd/`. Las decisiones viven en constitution/architecture; el glosario, en mission. |
