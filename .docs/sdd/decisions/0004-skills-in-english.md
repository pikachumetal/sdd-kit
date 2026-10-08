---
status: accepted
date: 2026-10-02
rutas:
  - skills/**
---

# Skills en inglés, texto humano en castellano

## Contexto y problema

El 2026-07-09 se decidió que las skills se escribían en castellano y no se traducían, como el resto del texto del equipo. La decisión se tomó sin plantear el idioma al empezar, no midiéndolo. El ecosistema de skills (superpowers, mattpocock/skills, skill-creator) está en inglés, el inglés gasta menos tokens por instrucción y `sdd-grilling` (feature 0128) se escribió en inglés como piloto.

## Opciones consideradas

- Todo en castellano, skills incluidas (vigente hasta el 2026-10-02).
- Skills en inglés, diciéndole al agente que hable con el usuario en su idioma; el resto del texto humano en castellano.

## Decisión

Texto humano (docs, tests, cuerpo de los commits) en castellano con ortografía correcta; nombres de skill y de fichero en inglés kebab-case; las skills se escriben en inglés y cada una le dice al agente que hable con el usuario en su idioma. Las que siguen en castellano se traducen al reescribirlas (0121, absorbida por la 3.0.0); hasta entonces conviven (dev-lead, 2026-10-02).

### Consecuencias

- Durante la 3.0.0 conviven skills en los dos idiomas.
- Traducir una skill es editarla (ADR 0002): lleva su prueba.

### Confirmación

Revisión final de la feature que escribe o reescribe la skill.
