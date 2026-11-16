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

🦆 Quien abra la guía de salas verá, como última línea y tras la lista de comandos, «Si una sala está cerrada, llama a conserjería: 5500.». Hoy la guía no dice a quién llamar en ese caso. Los comandos no cambian. Una prueba automática comprobará que la línea existe y que va la última. El número 5500 es el del enunciado y no he podido comprobarlo.

## Capacidades

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva (`guide`) · tamaño: ~1 línea de guía + 1 test en 2 ficheros
- Dominio y técnica (sonnet, los siete puntos): que la capacidad nueva y el dato nuevo (5500) estén declarados, y que el THEN de «Delta de comportamiento» no pase con solo escribir la frase (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar un THEN que se cumpla a ojo, el hueco que ya salió en esta spec

1. La línea va al final de `docs/guia.md`, tras la lista de comandos.
2. Declaro `guide` como capacidad nueva: `capabilities/` no existe aún y la guía pasa a ser comportamiento que el producto garantiza (lo que dice a quien la lee).
3. El teléfono «5500» es el que figura en el enunciado de la spec: no lo he inventado ni lo puedo comprobar. **Confírmalo al aprobar.**
4. La spec lleva un test (`node --test`) que lee `docs/guia.md` y exige la línea exacta en último lugar: la constitución pide tests antes que código (regla 2) y «leída a ojo» pasaría sin la línea.
5. «Sala cerrada» es el término del enunciado; no está en la terminología de `PRODUCT.md` y no lo añado ahí: esta feature no toca `PRODUCT.md`.

### Hallazgos de la review

- **Aceptado** — Importante: `guide` declarada en «Capacidades» pero no en el ✋ → decisión 2.
- **Aceptado** — Importante: el THEN y «Dónde se prueba» pasaban sin la línea y no había test → test añadido al Scope, a «Dónde se prueba» y al THEN (decisión 4).
- **Aceptado, en parte** — Importante: el Intent promete más que el Scope (¿llega la guía a quien está ante la sala cerrada?) → Intent acotado a que la guía contenga el teléfono; cómo llega la guía a quien la necesita queda fuera de esta feature. **Rechazado** la parte de fijar «sala cerrada» en `PRODUCT.md` → decisión 5.
- **Aceptado** — Importante: faltaban las cinco reglas del dato nuevo → sección «Reglas de la capacidad».
- **Aceptado** — Menor: la posición («al final») no estaba cubierta → el THEN y el test exigen que sea la última línea.
- **Aceptado** — Menor: 5500 sin procedencia → decisión 3.
- **Pendiente de ti** — Menor: aprobadora «Laura», y `PRODUCT.md` dice que no hay más usuarios ni desarrolladores → no lo cambio: no sé quién es Laura. Dime si es el dev-lead o la quito.

## Intent

Quien lee la guía y encuentra una sala cerrada tiene que ver en ella a quién llamar. Esta feature solo hace que la guía contenga ese teléfono.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- Entra: un test en `test/` que lee `docs/guia.md` y comprueba que esa línea es la última no vacía.
- No entra: los comandos, que no cambian.
- No entra: cómo llega la guía a quien está ante una sala cerrada.

## Reglas de la capacidad

- Dónde vive el dato: `docs/guia.md` es la única fuente del número; si cambia, se cambia ahí y en el test.
- Idioma: castellano (constitución, regla 4).
- Límites: no aplica.
- Avisos: no aplica.
- Regla en conflicto: no aplica.

## Dónde se prueba

- La línea: test de `node --test` sobre `docs/guia.md` (rojo hoy: la línea no existe; verde con ella).

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta
- WHEN alguien la lee
- THEN su última línea es «Si una sala está cerrada, llama a conserjería: 5500.», tras la lista de comandos

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
