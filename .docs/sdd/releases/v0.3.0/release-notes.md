---
release: v0.3.0
title: sdd-kit v0.3.0 — Carril de consulta
created: 2026-07-21
---

# sdd-kit v0.3.0 — Carril de consulta

*21 de julio de 2026*

## Resumen

El kit gana un cuarto carril, `sdd-consult`, para el caso más frecuente del día a día: preguntar, entender o estructurar algo del proyecto con el contexto cargado, **sin arrancar el flujo SDD completo** ni generar artefactos.

## Novedades

- **Para quien solo tiene una duda**: `sdd-consult` prima los documentos de anclaje relevantes y responde anclado en ellos — distinguiendo lo que dicen los docs de lo que infiere — sin crear specs, ramas ni tocar el roadmap.
- **Para quien quiere estructurar una dirección** (no construirla aún): el carril usa `grilling` (interrogatorio pregunta a pregunta) en lugar de `brainstorming`, que es el motor de construir features y acaba en spec.
- **Para cuando la consulta se vuelve trabajo**: transiciona de forma anunciada al carril adecuado (task/hotfix/release), que aplica sus propios gates — nunca fabrica el artefacto ni inventa un id de ticket por su cuenta.

## Problema conocido

- El kit sigue instalándose desde ruta local: no hay repositorio remoto del equipo, así que esta versión no llega por `/plugin marketplace update` hasta que lo haya.

## Fuera de alcance de esta entrega

- El REFACTOR con la fricción del estreno real y la pasada de recorte de skills largas: pasan a v0.4.0.

## Próximos pasos

- Por nuestra parte: **publicar el repositorio remoto** (decisión pendiente desde v0.2.0) para que las mejoras lleguen al equipo.
- Por vuestra parte: cuando haya remoto, `/plugin marketplace update`; mientras tanto, reinstalar desde la ruta local si necesitáis el carril de consulta ya.
