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

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada. Recoge solo esa línea; los comandos que la guía ya documenta no pasan a la capacidad en esta feature.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`), dato nuevo (el teléfono 5500), área sin explorar (`docs/guia.md` y `test/`, que no he leído enteros) · tamaño: ~15 líneas en 3 ficheros
- Dominio+técnica (sonnet): si el THEN de la línea se puede comprobar sin verla a ojo y si el 5500 y «cerrada» están declarados como decisiones (señal: dato nuevo)
- Mínimo razonable: el mismo revisor — no hay nivel menor; sin él queda sin mirar que un escenario pase con solo copiar la frase

1. **Capacidad nueva:** `guide` (slug en inglés, kebab-case).
2. **Texto y número:** la línea es literalmente «Si una sala está cerrada, llama a conserjería: 5500.». El 5500 es el dato que más importa: valida que es el número correcto.
3. **Colocación:** la línea va al final de `docs/guia.md`, tras la lista de comandos, como prosa suelta (no como un comando más de la lista).
4. **«Cerrada»:** lo tomo como un cierre físico de la sala, fuera del sistema; la herramienta no tiene ese estado y esta feature no lo crea. Si es un estado de la herramienta, dímelo y cambia la spec.
5. **Comprobación:** además de leerla, un test de `node --test` (en `test/`) lee `docs/guia.md` y comprueba la línea exacta y que es la última (la constitución pide tests antes que código).
6. **Aprobadora:** `approvers` dice Laura; `PRODUCT.md` dice que el único usuario eres tú. No la he tocado: dime si Laura es otra persona o hay que poner tu nombre.
7. **Enfoque:** una línea en la guía, frente a avisar también desde la salida de la herramienta (ver Approach).

### Hallazgos de la review

- **Aceptado** — «leída en `docs/guia.md`» pasa con solo copiar la frase → decisión 5 y test en «Dónde se prueba».
- **Aceptado** — faltaban por declarar el texto, el 5500, la forma y `guide` → decisiones 1 a 3.
- **Aceptado** — el Intent promete más de lo que entrega, si la guía solo se lee en la terminal → el Intent habla de la guía y «No entra» excluye la salida de la herramienta.
- **Aceptado** — sin reglas de la capacidad → sección «Reglas de la capacidad».
- **Aceptado** — `guide` y los comandos ya documentados → nota en «Capacidades».
- **Aceptado** — «cerrada» sin definir → decisión 4.
- **Aceptado** — la posición no la cubría el THEN → el THEN dice «como última línea».
- **Aceptado** — el 5500 podría no estar aprobado → decisión 2.
- **Aceptado** — Laura no cuadra con `PRODUCT.md` → decisión 6, sin cambiar la cabecera hasta que respondas.

## Intent

Quien lee la guía de la herramienta y encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo. Éxito: la última línea de `docs/guia.md` nombra a conserjería y su teléfono.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.» y su test en `test/`.
- No entra: los comandos, que no cambian; la salida de la herramienta (`src/`), que no avisa de nada; definir «sala cerrada» como estado.

## Approach

Una sola vía razonable: la línea en `docs/guia.md` con su test. Se descarta avisar también desde la salida de la herramienta: exigiría un estado «cerrada» que la herramienta no tiene (decisión 4) y nadie lo pidió.

## Reglas de la capacidad

- Dónde vive el dato: solo en `docs/guia.md`; es la única fuente del 5500.
- Idioma de los nombres: castellano (constitución, regla 4).
- Límites: no aplica.
- Avisos: no aplica.
- Regla de conflicto: no aplica; si el número cambia, se cambia la línea y su test.

## Dónde se prueba

- La línea: test de `node --test` que lee `docs/guia.md` y comprueba que su última línea no vacía es la frase exacta.
- A ojo, al validar: la línea leída en `docs/guia.md`.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta
- WHEN alguien la lee
- THEN encuentra «Si una sala está cerrada, llama a conserjería: 5500.» como última línea de la guía

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
