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

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada. El cierre (`sdd-archive`) crea `capabilities/guide.md`; su alcance es solo este requisito.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~1 línea en 1 fichero
- Dominio y técnica (sonnet): si el escenario ejercita la ubicación de la decisión 1 y si «cerrada» y «conserjería» chocan con la Terminology de `PRODUCT.md` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que el THEN pase con la línea mal colocada o duplicada

1. La línea va al final de `docs/guia.md`, tras la lista de comandos.
2. La redacción exacta, el nombre «conserjería» y el número 5500 son los de la petición de la feature, no salen de `PRODUCT.md` ni de la constitución: confírmalos al aprobar.
3. «Conserjería» y «sala cerrada» son solo texto de la guía: no son un rol ni un estado nuevo del producto, y no entran en la Terminology de `PRODUCT.md`.
4. La verificación es un test de `node --test` que lee `docs/guia.md` (así el gate de la constitución, regla 2, cubre esta spec), no una lectura a ojo.
5. `docs/guia.md` ya existe pero aún no está versionado (`docs/` sale como `??`): este cambio lo incorpora al primer commit.

### Hallazgos de la review

- **Aceptado** — verificación solo «leída», sin test que cubra el gate → «Dónde se prueba» pasa a un test de `node --test` (decisión 4).
- **Aceptado** — redacción, número y nombre sin declarar como decisión → decisión 2.
- **Aceptado** — el THEN pasaba con la línea en cualquier sitio o repetida → el THEN exige que sea la última línea y que aparezca una sola vez.
- **Aceptado** — «sala cerrada» y «conserjería» fuera de la Terminology → decisión 3 y «No entra».
- **Aceptado** — reglas del dato nuevo sin declarar → sección «Reglas de la capacidad».
- **Aceptado** — `guide` sin decir quién crea la capacidad → línea en «Capacidades».
- **Aceptado** — `docs/` sin versionar → decisión 5.
- **Aceptado** — horario y canal alternativo sin cubrir → «No entra».
- **Rechazado** — aprobador «Laura» no está en `PRODUCT.md` → la plantilla pide un aprobador con nombre y `PRODUCT.md` no define aprobadores; lo confirma quien apruebe.
- **Rechazado** — valorar el carril patch → la fila 0018 del roadmap es de carril feature y el texto de la línea es una decisión visible que nadie había fijado, lo que excluye el patch.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- Entra: un test que comprueba esa línea (decisión 4).
- No entra: los comandos, que no cambian ni se comportan distinto con una sala cerrada.
- No entra: el horario de conserjería, un canal alternativo ni qué hacer si no contestan.
- No entra: definir «cerrada» o «conserjería» como estado o rol del producto.

## Reglas de la capacidad

- Dónde vive el dato: solo en `docs/guia.md`; no hay otra fuente.
- Idioma: castellano (constitución, regla 4).
- Límites, avisos y regla en conflicto: no aplica.

## Dónde se prueba

- La línea: un test de `node --test` que lee `docs/guia.md` y comprueba la línea, su posición y que no se repite.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta
- WHEN alguien la lee
- THEN encuentra «Si una sala está cerrada, llama a conserjería: 5500.» como última línea, tras la lista de comandos
- AND la línea aparece una sola vez

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
