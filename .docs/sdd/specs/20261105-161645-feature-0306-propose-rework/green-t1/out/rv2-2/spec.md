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

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~1 línea en 1 fichero (+ 1 test)
- Revisor único (sonnet, siete puntos): si el escenario de `guide` se puede comprobar y si la decisión 1 (crear `docs/guia.md`) contradice el repo (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar que la premisa «la guía está en `docs/guia.md`» no se sostiene en el repo, que es justo lo que encontró

Política de modelos: revisor de spec en sonnet, uno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

Prueba del delta (`sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal): `guide.md: añadido «La guía dice a quién llamar con una sala cerrada»`.

1. `docs/guia.md` no existe en el repo (no hay carpeta `docs/`; solo `README.md` y `PRODUCT.md`): la feature crea el fichero con esa única línea. No hay lista de comandos tras la que ponerla, así que la premisa de «al final, tras los comandos» no se sostiene. **Valida esto: si la guía que tenías en mente es otra (README, la ayuda de la CLI), dímelo.**
2. `guide` es una capacidad nueva: `.docs/sdd/capabilities/` no existe y no hay ninguna que describa la guía. Se declara con ese nombre, en inglés kebab-case.
3. La guía es documentación del repo, no algo que la CLI muestre: la CLI no cambia (ya decía «No entra: los comandos»). Con eso, el Intent se cumple para quien lee la documentación.
4. La frase y el número («conserjería: 5500») son tal cual los dijiste; no los he inventado ni cambiado.
5. La prueba es un test de `node --test` que lee `docs/guia.md` y busca la línea exacta, para que entre en el gate de cierre (constitución, punto 2).

### Hallazgos de la review

- **Aceptado** — `guide` «nueva» sin `capabilities/` que lo confirme → comprobado: no existe la carpeta; escrito en la decisión 2.
- **Aceptado** — «`docs/guia.md` no existe» sin evidencia → evidencia añadida en la decisión 1 (sin carpeta `docs/`), con la pregunta de validar.
- **Aceptado** — el escenario solo prueba un fichero que quien usa la CLI no ve → decisión 3: es documentación del repo y la CLI no cambia; queda a tu validación.
- **Aceptado** — el Intent prometía más que el Scope → Intent acotado a «la guía de la documentación».
- **Aceptado** — «leída» no es una prueba y choca con el gate → decisión 5 y «Dónde se prueba» con test de `node --test`.
- **Aceptado** — origen del número → decisión 4: viene de tu enunciado.
- **Aceptado** — redacción literal como decisión → decisión 4.
- **Rechazado** — `mode: full` desproporcionado para una línea → lo fijó el arranque (feature, modo full) y no cambia sin que lo pidas; si prefieres lite, dilo en el gate.
- **Rechazado** — quién es Laura frente a la misión → Laura es la aprobadora que ya figuraba en la spec que me diste; no la toco, la confirmas tú al aprobar.
- **Rechazado** — estructura futura del fichero → fuera de esta feature; no se fija nada más que la línea.
- **Rechazado** — número «real» frente a ejemplo → es el dato real que diste; ver decisión 4.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía de la documentación tiene que decirlo.

## Scope

- Entra: crear `docs/guia.md` con una línea: «Si una sala está cerrada, llama a conserjería: 5500.»
- No entra: los comandos, que no cambian.

## Dónde se prueba

- La línea: un test de `node --test` lee `docs/guia.md` y comprueba que contiene la frase exacta.

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
