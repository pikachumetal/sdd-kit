---
name: sdd-init-greenfield
description: Usar cuando arranca un proyecto nuevo (sin código o casi) y hay que dejarlo preparado para trabajar con SDD — "prepara el proyecto", "inicializa la documentación", "empezamos el proyecto X". No para proyectos con codebase existente (eso es sdd-init-brownfield).
---

# sdd-init-greenfield

## Overview

Deja un proyecto nuevo preparado para el flujo SDD: documentación de anclaje por capas en `.docs/sdd/`, `CLAUDE.md` corto con punteros, plantillas y estructura. El contenido sale de una **entrevista con el usuario** — no de tus suposiciones.

El motor de la entrevista es `superpowers:brainstorming`, con las preguntas de `sdd-grilling`, y cada documento se aprueba antes de darse por anclaje.

## ⛔ Gate: sin entrevista no hay documentos

Invocar esta skill arranca la entrevista, no la generación. Si el usuario no está disponible para responder, la init queda **EN ESPERA en la primera pregunta** — convertir las preguntas en "asunciones documentadas" no es una entrevista: es inventar un proyecto.

## Estructura objetivo (la fija el kit, no se rediseña)

`.docs/sdd/` con los documentos de anclaje del kit. **No se rediseña**: nada de `docs/superpowers/specs/`, `docs/decisions/` con ADRs sueltos ni glosario aparte — las decisiones viven en constitution/architecture y el glosario en mission. Árbol exacto y qué va en cada fichero: [estructura.md](references/estructura.md).

## Flujo (crea un todo por paso)

1. **Entrevista** — `superpowers:brainstorming`, con esta lista. **Pregunta con la skill `sdd-grilling`** (invócala con `Skill`), en el orden de la lista. «No sé» deja la entrada pendiente; «no aplica» la cierra. Lo que ya existe (código, un documento de anclaje) se presenta como propuesta para confirmar, y lo que ya fijan las instrucciones del usuario (`CLAUDE.md` global o del proyecto) no se pregunta: se referencia.

   | # | Pregunta | Va a |
   | --- | --- | --- |
   | 1 | ¿Qué problema resuelve el proyecto? | mission |
   | 2 | ¿Quién lo usa y con qué roles? | mission |
   | 3 | ¿Qué módulos imaginas? | mission, roadmap |
   | 4 | ¿Qué queda fuera de alcance? | mission, «Qué es y qué no es» |
   | 5 | ¿Qué términos del dominio hay que fijar? | mission, «Dominio» |
   | 6 | ¿Dónde viven los datos (fichero, tabla, memoria, almacenamiento del cliente)? | constitution, «Reglas de producto» |
   | 7 | ¿En qué idioma van los nombres (API, claves, mensajes)? | constitution, «Reglas de producto» |
   | 8 | ¿Qué límites hay (tamaños, profundidades, número de resultados)? | constitution, «Reglas de producto» |
   | 9 | ¿Qué se avisa al usuario y cuándo (p. ej. un secreto en claro)? | constitution, «Reglas de producto» |
   | 10 | Cuando dos vías dan el mismo dato, ¿cuál manda? | constitution, «Reglas de producto» |
   | 11 | ¿Qué stack? Si no está decidido: opciones con trade-offs y tu recomendación; decide el usuario y puede quedar abierto, con las opciones | tech-stack |
   | 12 | ¿Qué es innegociable (datos, migraciones, seguridad; commits, solo si las instrucciones del usuario no los fijan ya)? | constitution |
   | 13 | ¿Llevamos changelog? | `changelog.md` |
   | 14 | Solo si 13 es sí: ¿también novedades para el cliente? (`client-changelog.md` calcado de `client-changelog-template.md`; lo alimenta `sdd-end-release`) | `client-changelog.md` |
   | 15 | ¿Hay gestor de tickets? | `CLAUDE.md` |
   | 16 | ¿Qué convención de ramas? Recomendada, la del kit: git-flow — `main` estable, `develop` de integración, `feature/<id>` desde `develop` | constitution, paso 5 |
   | 17 | ¿Trabajaréis con worktrees? | `CLAUDE.md` |
   | 18 | Solo si 17 es sí: ¿el entorno de un worktree necesita más que instalar dependencias (BD, puertos, servicios, datos)? Si es sí, se calca `environments.md` de `sdd-templates`; si no, superpowers ya lo cubre | `environments.md` |
   | 19 | Claves del kit: invoca la skill [`sdd-config`](../sdd-config/SKILL.md) con la rama de integración que dejó la 16. Hace, una por turno y con su recomendación, sus preguntas de cómo se numera el trabajo (`ids.mode`), perfil de control, política de merge y push (solo con una rama de integración distinta de la estable), frenos, método de ejecución y quién valida el trabajo al cerrar (`validation.mode`) | `sdd-kit.json` |
   | 20 | ¿Replica los patrones de otro proyecto? Si es sí, ¿cuál? (proyecto de referencia; «no» deja «no aplica») | constitution, «Convenciones» |
   | 21 | Solo si el stack de la 11 tiene interfaz: ¿con qué se verifica lo que se ve? Detector, runner E2E y cómo entra el agente en la aplicación (la URL de entrada si hay login); recomendados, impeccable y Playwright. Se calca `§Frontend` de `tech-stack-template.md`, y «sin detector» queda como `Detector: ninguno` | tech-stack, §Frontend |

   Las preguntas 6 a 10 son las cinco reglas de producto: se preguntan por nombre, porque sin ellas el agente las decide al azar en cada feature.
2. **Generar documento a documento, con gate**: mission → presentar → aprobar; después constitution (con la sección «Reglas de producto»: las cinco por nombre, cada una respondida · pendiente · no aplica; si difiere por capacidad, por capacidad dentro de la entrada) → … Nada se da por anclaje sin aprobación explícita del usuario.
3. **Estructura**: crear `.docs/sdd/` completa y `sdd-kit.json` con la versión del kit instalada (la mayor de `sdd-init-brownfield/references/migrations/`), el campo `ids` y las claves que el usuario respondió en la 19 (solo esas: «no sé» no escribe la clave). Las preferencias de cada persona no se preguntan aquí: el resumen de cierre dice que se fijan con `sdd-config`. Cada documento se **calca** de su plantilla de `sdd-templates` (lista en [estructura.md](references/estructura.md)): la forma es la de la plantilla y el contenido, el de la entrevista. Nunca se copia un documento del `.docs/` del kit ni de otro proyecto, y no se crea carpeta `templates/`. Además:
   - **Funcional aportado**: si el usuario aporta un funcional (un documento, un correo o texto pegado en el chat), se guarda literal en `.docs/sdd/sources/`: con su nombre original si es un fichero, o como `<yyyyMMdd>-functional-brief.md` si llegó pegado. No se edita nunca: los documentos de anclaje lo resumen y lo enlazan — `mission.md` lo enlaza en una línea, y cada fila de módulo del roadmap que sale de él cita su sección (`sources/<fichero> §<n>`). Ninguna capacidad nace de él: describe lo que se quiere construir, no lo construido.
   - `estimation-log.md` no se escribe a mano: se genera con `pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`, que lo deja con su cabecera y sin filas. El script vive en el kit y no se copia al proyecto.
   - `.claude/settings.json`: se crea, o se fusiona sin tocar las demás claves, con `"autoMemoryEnabled": false`. La memoria automática vive en una sola máquina, y lo que se aprende va a los docs. Si ya tiene `"autoMemoryEnabled": true`, pregunta antes de cambiarlo; si el usuario dice que no, se deja y el resumen de cierre lo anota. Lleva también `extraKnownMarketplaces.superpowers-marketplace` con la fuente `{"source": "github", "repo": "obra/superpowers-marketplace"}`, sin tocar las demás entradas: quien clone el proyecto necesita ese marketplace para que se instale superpowers, la dependencia del kit. Si `claude plugin marketplace list` no muestra `superpowers-marketplace`, ejecuta `claude plugin marketplace add obra/superpowers-marketplace`.
   - `.gitignore`: se añaden `.playwright-mcp/`, `.superpowers/` y `.docs/sdd/sdd-kit.local.json` (las preferencias de cada persona, que no van a git), y la ruta de la sesión de `§Frontend` si la 21 la declara, si faltan, sin duplicar líneas; se crea si no existe.
   - `capabilities/` y `specs/` no se crean: git no versiona carpetas vacías, y ninguna se crea vacía ni con `.gitkeep`. Nacen con su primer fichero (la primera feature, o el volcado del paso 6).
4. **`CLAUDE.md` corto**: punteros a los documentos + reglas críticas. No duplicar contenido que ya vive en un doc de anclaje.
5. **Git**: `git init` si no hay repo, con la convención de ramas acordada en la entrevista. Si el repo ya existe y sus ramas o su remoto no siguen esa convención, presenta el plan completo —renombrados, ramas nuevas, rama por defecto del remoto, borrados— y espera el «sí» antes de ejecutar nada. Lo que toca el remoto (push, rama por defecto, borrar ramas) lo ejecuta el usuario, con los comandos que le das.
6. **Cierre**: resumen de lo creado + siguientes pasos — partición fina y estimación cuando `capabilities/` madure; skills de nivel 2 recomendadas según el stack (esta skill no las crea).
   **Volcado inicial de capacidades, solo si el usuario lo pide** (nunca lo ofrezcas). Es la única excepción a que las capacidades crecen feature a feature, y solo existe en greenfield:
   - Lee el código entero. Si no puedes leerlo entero en esta sesión, dilo y no vuelques.
   - Antes de escribir ningún fichero, propón la partición: la lista de capacidades, cada una con su slug en inglés kebab-case y sustantivo del dominio (regla 1 de `capability-template.md`; el nombre de un módulo del código no es un nombre de capacidad). Espera el «sí».
   - Escribe cada capacidad calcando `capability-template.md`, con lo que el código hace hoy, y preséntala con el mismo gate que los documentos de anclaje.

## Red flags — STOP

- Estás escribiendo mission o constitution y el usuario no ha respondido la entrevista.
- Has decidido tú el alcance del MVP, un rol o el stack "como propuesta razonable".
- Estás creando `docs/`, `docs/superpowers/` o ADRs sueltos en vez de `.docs/sdd/`.
- El estimation-log nace con filas, o escrito a mano en vez de generado por el script.
- Estás volcando capacidades que el usuario no ha pedido, o escribiendo alguna antes de que apruebe la partición.

| Racionalización | Realidad |
| --- | --- |
| "El usuario no responde: convierto las preguntas en asunciones documentadas" | Eso es inventar un proyecto. La entrevista ESPERA: tu último mensaje es la primera pregunta de la entrevista. |
| "Lo marco todo como borrador pendiente y así avanzo" | Cientos de líneas de suposiciones anclan las conversaciones futuras a TUS decisiones. Un documento corto y aprobado vale más que ocho borradores inventados. |
| "Una estructura con ADRs y glosario es más estándar" | La estructura del equipo es `.docs/sdd/`. Las decisiones viven en constitution/architecture; el glosario, en mission. |
| "El kit dice que las capacidades crecen feature a feature: me niego a volcarlas" | En greenfield, a petición del usuario, el volcado es la excepción escrita en el paso 6. Negarse es el fallo que mostró el RED (1/2): aplica sus condiciones. |
| "El código es pequeño: vuelco las capacidades y las enseño al final" | La partición se aprueba antes de escribir ningún fichero. En el RED, un volcado directo nombró las capacidades como los módulos del código. |
