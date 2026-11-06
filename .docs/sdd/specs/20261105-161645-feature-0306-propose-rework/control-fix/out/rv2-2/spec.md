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

🦆 Hoy, si abres la guía de salas, te dice cómo reservar y cancelar, pero no qué hacer si la sala está cerrada. Después de este cambio, la última línea de la guía dice: «Si una sala está cerrada, llama a conserjería: 5500.» Un test comprueba que la línea está, una sola vez, tras la lista de comandos.

## Capacidades

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~1 línea en 1 fichero
- Revisor único (sonnet, siete puntos): si «Dónde se prueba» basta para verificar el THEN y si declarar `guide` como capacidad nueva es coherente con que no exista `capabilities/` (señal: capacidad nueva)
- Mínimo razonable: un revisor — no hay nivel inferior defendible; sin él queda sin mirar el vacío entre el THEN y su verificación

1. **Enfoque**: editar `docs/guia.md` a mano con la línea literal del roadmap, más un test que la comprueba. Descartado generar la guía desde los comandos: el teléfono no es un comando y la guía hoy es un fichero escrito a mano.
2. La línea va al final de `docs/guia.md`, tras la lista de comandos.
3. **Capacidad nueva**: `guide` (inglés, kebab-case). El proyecto aún no tiene `capabilities/`; `sdd-archive` crea `capabilities/guide.md` al cerrar la feature, con el requisito de abajo.
4. **`docs/` no está en git** (`git status`: `?? docs/`). El commit de la feature añadirá `docs/guia.md` entero, con sus comandos actuales y la línea nueva. Si no quieres versionar la guía, dímelo y cambia el alcance.
5. **El test** vive en `test/guia.test.js` y corre con `node --test`, como el resto (constitución, regla 2). Lo he añadido yo: el roadmap no lo pedía.

### Hallazgos de la review

- **Aceptado** — el THEN no es verificable con el gate: `node --test` no cubre la línea → añadido el test de «Dónde se prueba» (decisión 5).
- **Aceptado** — la comprobación no dice línea exacta, una sola aparición ni posición → fijadas las tres en «Dónde se prueba».
- **Aceptado** — nadie dice quién crea `capabilities/guide.md` → decisión 3: `sdd-archive`, al cerrar.
- **Aceptado** — faltan «Reglas de la capacidad» → añadidas abajo; la constitución no tiene «Reglas de producto», así que valen estas.
- **Aceptado** — el Intent promete más que la guía → Intent acotado a «la guía dice…» y «No entra» lista la CLI.
- **Aceptado** — `docs/` sin seguimiento en git → decisión 4.
- **Aceptado** — otros canales de contacto y línea equivalente previa → en «No entra»; comprobado con `git grep`: la guía no tiene hoy ninguna línea sobre salas cerradas, así que no hay MODIFIED.
- **Aceptado** — la colocación «al final» no era verificable → el test la comprueba.
- **Rechazado** — separar la review de las decisiones → el bloque abre «✋ Decisiones que he tomado yo» por regla del kit.
- **Rechazado** — «Laura» contradice la misión → es el nombre de aprobadora que traía la spec; no lo cambio sin que la propia aprobadora lo diga. Confírmalo al aprobar.

## Intent

Quien abre la guía y encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo. Éxito: la guía contiene el teléfono de conserjería, en la línea exacta de abajo.

## Scope

- Entra: una línea al final de `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- Entra: un test en `test/guia.test.js` que lo comprueba.
- Entra: versionar `docs/guia.md` en git (decisión 4).
- No entra: los comandos de la guía, que no cambian.
- No entra: avisos de la herramienta (`src/app.js`) cuando una sala está cerrada.
- No entra: otros canales de contacto ni quién mantiene el teléfono.

## Reglas de la capacidad

- Dónde vive el dato: solo en `docs/guia.md`, no se copia en el código.
- Idioma de los nombres: castellano (constitución, regla 4).
- Límites, avisos y regla en conflicto: no aplica.

## Dónde se prueba

- `test/guia.test.js`, con `node --test`: lee `docs/guia.md` y comprueba que la línea exacta aparece una sola vez y después de la última línea de la lista de comandos.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta, `docs/guia.md`
- WHEN alguien la lee
- THEN encuentra, una sola vez y tras la lista de comandos, «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
