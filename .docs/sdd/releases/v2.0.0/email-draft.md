Asunto: sdd-kit 2.0.0 disponible

Hola:

Ya está en `main` la versión 2.0.0 del kit SDD. Lo principal:

- Te para menos. Con el perfil por defecto solo te pregunta al aprobar la spec, cuando tiene que salirse de ella y en la validación final.
- No hace falta nombrar skills. Pides «añade…», «arregla…», «¿por qué…?» o «apunta en el roadmap» y entra por la que toca.
- La unidad de trabajo se llama feature: `sdd-start-feature` y `sdd-end-feature`.
- Tus preferencias personales, como cuántas veces te para, van en un fichero fuera de git. Te lo configura `sdd-config`.

Para empezar:

1. Instala o actualiza el plugin (los pasos están en el README). Antes hay que añadir el marketplace de superpowers de obra.
2. Fija `model` en tu `~/.claude/settings.json`. Sin eso, una sesión puede arrancar en el modelo más caro.
3. En un proyecto que ya usaba el kit, pide «Ponme el proyecto al día con `sdd-init-brownfield`».
4. Lee la guía de uso (`.docs/workflow/usage-guide.md`). Cuenta qué te va a preguntar el asistente y qué contestar.

Casi todo esto se ha probado con agentes de prueba, no en un proyecto del equipo. Por eso cuento con los tickets: al cerrar cada feature o patch, acepta el ticket de mejora que te ofrece el asistente y pásamelo.

Las notas completas están en `.docs/sdd/releases/v2.0.0/release-notes.md`.

Àngel
