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

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada. (No existe `.docs/sdd/capabilities/`: hoy no hay ninguna capacidad escrita.)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~6 líneas en 2 ficheros
- Dominio y técnica juntas (sonnet): si el único THEN se puede comprobar con el test que propone la decisión 4, y si crear `docs/guia.md` (decisión 1) deja algo prometido en el Intent sin cubrir (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin mirar que la guía nueva no contradiga a `README.md` ni a `PRODUCT.md`, que describen la herramienta

1. **`docs/guia.md` no existe**: el repo no tiene carpeta `docs/` ni lista de comandos donde añadir la línea. Lo creo, con el título `# Guía` y debajo la línea. Descarto añadirla a `README.md`: el dev-lead habló de «la guía», y el README es la portada, no una guía.
2. **Capacidad nueva `guide`** (inglés, kebab-case: es nombre de fichero). Al cerrar se escribe `.docs/sdd/capabilities/guide.md`.
3. **Enfoque**: un solo camino sensato, escribir la línea literal en el fichero. Descartados: generarla desde código (no hay código de la guía) y ponerla en el mensaje de ayuda de `src/app.js` (la feature pide la guía, no la salida del programa).
4. **Cómo se prueba**: un test en `test/guia.test.js` que lee `docs/guia.md` y comprueba que contiene la línea, para que el gate `node --test` (constitución, art. 2) la cubra. La spec original solo decía «leída en el fichero».
5. **Texto en castellano**, como pide la constitución (art. 4); el número 5500 y «conserjería» van literales como los dio el dev-lead, con el formato exacto del Scope (mayúscula inicial, dos puntos, punto final).
6. **Las cinco reglas del dato** (el teléfono y el nombre «conserjería»): dónde vive: solo en `docs/guia.md`, sin configuración · idioma: castellano · límites: no aplica · avisos: no aplica · conflicto: no aplica (un solo sitio donde se escribe).
7. **El 5500 está duplicado a propósito** en la guía y en el test: el test es el guardián de la línea. Si cambia el teléfono, se edita en los dos.
8. **Descubrimiento fuera de alcance**: nada enlaza la guía todavía (ni README ni `src/app.js`). Si se quiere enlazarla, es otra feature.
9. **`capabilities/` se crea al archivar**, con `guide.md` como primera capacidad escrita.

### Hallazgos de la review

- **Aceptado** — el test solo comprobaba «contiene» → el test exige la línea completa como línea propia, fuera de bloques de código (Dónde se prueba).
- **Aceptado** — el título `# Guía` no es comportamiento verificable → el Scope dice que el test no lo comprueba.
- **Aceptado** — descubrimiento de la guía → decisión 8, fuera de alcance.
- **Rechazado** — enlazar la guía desde el README → ensancha el Scope y la decisión 1 descartó tocarlo; va a otra feature si se quiere.
- **Aceptado** — cinco reglas del dato sin declarar → decisión 6.
- **Aceptado** — 5500 duplicado → decisión 7.
- **Aceptado** — carpeta `capabilities/` sin declarar → decisión 9.
- **Aceptado** — formato de la línea sin fijar → decisión 5 y Scope.
- **Aceptado** — decisión 1 citaba una «spec original» ausente → reformulada sin esa referencia.
- **Rechazado** — «`PRODUCT.md` puede no existir» → existe en la raíz (lo leí); la referencia se queda.
- **Rechazado** — aprobador «Laura» frente a la misión de un solo desarrollador → el aprobador viene del arranque del dev-lead, no es decisión mía; te lo pregunto en el gate.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: crear `docs/guia.md` con el título `# Guía` y la línea exacta «Si una sala está cerrada, llama a conserjería: 5500.»; un test que comprueba la línea (el título no se comprueba: no es comportamiento).
- No entra: documentar los comandos, tocar `README.md`, enlazar la guía desde ningún sitio ni cambiar el código de `src/app.js`.

## Dónde se prueba

- La línea: `test/guia.test.js` lee `docs/guia.md` y comprueba que la línea completa aparece como línea propia, fuera de un bloque de código.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta, `docs/guia.md`
- WHEN alguien la lee
- THEN encuentra «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
