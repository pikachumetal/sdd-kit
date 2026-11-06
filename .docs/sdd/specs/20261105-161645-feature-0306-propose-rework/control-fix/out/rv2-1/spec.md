---
id: 20261008-160000-feature-0018-concierge-phone
feature: 0018
title: El teléfono de conserjería en la guía
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — El teléfono de conserjería en la guía

## Capacidades

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva (`guide`) · tamaño: ~1 línea en 1 fichero
- Técnica y dominio (sonnet): si la capacidad nueva `guide` y su único requisito cuadran con la guía existente, y si el THEN se puede probar con `node --test` (señal: capacidad nueva)
- Mínimo razonable: este mismo nivel, ya es el más bajo — no deja nada sin cubrir

1. La línea va al final de `docs/guia.md`, tras la lista de comandos, como párrafo suelto sin encabezado nuevo.
2. Capacidad nueva en `capabilities/`: `guide` (slug en inglés, kebab-case; es un identificador, no texto de interfaz). El proyecto aún no tiene carpeta `capabilities/`: se crea al cerrar con `guide.md`. Nace solo con el requisito de esta feature: los cuatro comandos ya documentados no entran, porque no cambian.
3. El texto literal de la línea y la extensión `5500`: confirma que es la extensión real de conserjería.
4. Reglas del dato: vive solo en `docs/guia.md` · nombres en castellano · límites: no aplica · avisos: no aplica · conflicto: no aplica.
5. `docs/guia.md` aún no está versionado (`?? docs/`): entra en esta feature. La fila 0018 del roadmap se cierra con la feature.

### Hallazgos de la review

- **Aceptado** — el teléfono no tiene fuente declarada → decisiones 3 y 4.
- **Aceptado** — decisiones tomadas en el cuerpo sin listar → decisiones 1, 2 y 3.
- **Aceptado** — sin verificación ejecutable (constitución regla 2) → «Dónde se prueba» pasa a un test de `node --test`.
- **Aceptado** — alcance de `guide` frente a los comandos existentes → decisión 2.
- **Aceptado** — formato de la línea → decisión 1.
- **Aceptado** — cinco reglas del dato → decisión 4.
- **Rechazado** — slug en inglés frente a la regla 4 → es un identificador, y la decisión 2 lo declara.
- **Rechazado** — «Laura» y «dev-lead» frente a la misión de una sola persona → no lo cambio sin que me digas quién es el aprobador; lo señalo en la presentación.
- **Aceptado** — `docs/` sin versionar y fila 0018 → decisión 5.
- **Aceptado** — lo que no se promete → «No entra».

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- No entra: los comandos, que no cambian; el horario de conserjería, qué hacer si nadie contesta y mostrar el estado de las salas.

## Dónde se prueba

- La línea: un test de `node --test` que lee `docs/guia.md` y busca la frase literal.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta
- WHEN alguien la lee
- THEN encuentra «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
