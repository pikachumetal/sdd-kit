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

```text
Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~1 línea en 1 fichero
- Dominio y técnica (sonnet): si el THEN y «Dónde se prueba» pueden fallar de verdad, y si `guide` como capacidad nueva y el dato «5500» están declarados (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que la prueba repite el THEN y que el número no tiene origen declarado
```

1. La línea va al final de `docs/guia.md`, tras la lista de comandos, como una sola línea suelta, con el texto literal del Scope (en castellano, art. 4 de la constitución).
2. `guide` se declara capacidad nueva: la guía es lo que lee quien usa la herramienta. Si prefieres que sea solo documentación sin capacidad, se retira del delta. **Decide tú.**
3. El número «5500» y el nombre de conserjería los tomo tal cual de la spec: no he verificado que sea el número real ni quién lo mantiene. **Confírmalo.**
4. Reglas de la capacidad: el dato vive solo en `docs/guia.md`; idioma castellano; límites, avisos y conflicto: no aplica. La constitución no define «Reglas de producto».
5. `PRODUCT.md` (Terminology) no se toca: «conserjería» no pasa a vocabulario del producto.

### Hallazgos de la review

- **Aceptado** — La fila de prueba repite el THEN y se verifica a ojo → «Dónde se prueba» pasa a un test de `node --test` en `test/guia.test.js` que busca la cadena exacta en `docs/guia.md`.
- **Rechazado** — `guide` como capacidad nueva sin carpeta `capabilities/` → es la decisión 2 de arriba: no la cambio yo, la decides tú.
- **Aceptado** — Faltan las cinco reglas del dato nuevo → decisión 4.
- **Aceptado** — Sin origen declarado del número → decisión 3, a confirmar por ti.
- **Aceptado** — Faltan decisiones del cuerpo (texto literal, una línea, `PRODUCT.md` intacto) → decisiones 1 y 5.
- **Aceptado** — «Sala cerrada» no existe en el producto → añadido a «No entra».
- **Rechazado** — Laura como aprobadora contradice «no hay más usuarios» de `PRODUCT.md`, y «5500»/«Laura» parecen datos reales → no los cambio yo: son tuyos. **Dime quién es Laura y si el 5500 es real**, o los sustituyo por datos de ejemplo.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- No entra: los comandos, que no cambian.
- No entra: un estado «sala cerrada» ni un comando que lo cause; es una situación física fuera de la herramienta.

## Dónde se prueba

- La línea: `test/guia.test.js` (`node --test`) lee `docs/guia.md` y comprueba que contiene la cadena exacta del THEN.

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
