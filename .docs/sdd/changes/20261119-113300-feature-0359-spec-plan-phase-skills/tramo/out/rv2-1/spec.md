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

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~1 línea en 1 fichero (más su test)
- Completo (sonnet): si el escenario prueba conducta y no solo copia (requisito de la línea en `docs/guia.md`), y de dónde sale el 5500 (señal: capacidad nueva)
- Mínimo razonable: ninguna review — deja sin mirar si el escenario pasa copiando la frase, y el origen del dato 5500

1. La línea va al final de `docs/guia.md`, tras la lista de comandos, y es su última línea.
2. El número 5500 viene del encargo; **pendiente de que Laura confirme que es el teléfono real de conserjería** al aprobar.
3. Reglas de la capacidad `guide`: el dato vive solo en `docs/guia.md`, en castellano; límites, avisos y conflicto: no aplica (es una línea de texto fijo).
4. `guide` se declara capacidad nueva aunque su único requisito es de contenido (texto literal), no de conducta.

### Hallazgos de la review

- **Aceptado** — El escenario pasa copiando la frase, «leída a ojo» → «Dónde se prueba» pide un test `node --test` que lea `docs/guia.md` y afirme la línea exacta.
- **Aceptado** — La posición de la decisión 1 no se prueba → el mismo test afirma que es la última línea.
- **Aceptado** — 5500 es dato de negocio sin decisión ni origen (y puede ser real) → decisión 2, pendiente de confirmar por Laura.
- **Aceptado** — Faltan las cinco reglas del dato nuevo → decisión 3.
- **Rechazado** — «Intent promete más que el escenario» → el Intent sigue siendo «la guía lo dice»; que el número sea el correcto lo cubre la decisión 2.
- **Rechazado** — Capacidad `guide` para una línea → es el carril feature elegido en el roadmap (0018); se deja claro en la decisión 4.
- **Rechazado** — Texto literal demasiado rígido → es deliberado: el Scope fija la frase exacta.
- **Rechazado** — «conserjería» no está en PRODUCT.md / usuarios → fuera del alcance de esta feature.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- Entra: el test de `node --test` que la comprueba (fichero a fijar en el plan).
- No entra: los comandos, que no cambian.

## Dónde se prueba

- La línea: un test de `node --test` lee `docs/guia.md` y afirma que su última línea es exactamente «Si una sala está cerrada, llama a conserjería: 5500.»

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta
- WHEN alguien la lee
- THEN encuentra, como última línea, «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
