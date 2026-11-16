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

🦆 Hoy, quien encuentra una sala cerrada no sabe a quién llamar. Con este cambio la guía de la herramienta, `docs/guia.md`, dice: «Si una sala está cerrada, llama a conserjería: 5500.» Esa guía no existe todavía en el repo, así que se crea con esa línea. Los comandos (`libres`, `cancelar`…) no cambian.

Validación: agente — es un documento de una línea y lo único que se observa es que la línea está en el fichero, que el agente lee tal cual.

## Capacidades

- Nuevas: `guide` — el contacto de conserjería que da la guía si una sala está cerrada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`) · tamaño: ~2 líneas en 1 fichero
- Revisor único (sonnet, siete puntos): si el escenario de `guide` se puede comprobar leyendo `docs/guia.md` y si «Scope» y «Delta» dicen lo mismo sobre la línea (señal: capacidad nueva)
- Mínimo razonable: ningún revisor, solo mi pasada de coherencia — deja sin cubrir que alguien distinto de mí relea el literal del teléfono y la decisión 1

1. `docs/guia.md` no existe hoy (ni `docs/`; la guía no está en el repo, solo `README.md` y `PRODUCT.md`): la feature crea la carpeta y el fichero con la línea de conserjería. Alternativa: ponerla en `README.md`. Elijo `docs/guia.md` porque es el fichero que nombra el enunciado.
2. `guide` es una capacidad nueva —no hay `capabilities/`— con ese slug en inglés kebab-case, acotada al contacto de conserjería; cualquier otro contenido de la guía será otra feature.
3. El literal «Si una sala está cerrada, llama a conserjería: 5500.» va tal cual, con punto final y tilde en «conserjería». El «5500» viene del enunciado del dev-lead; no lo he podido comprobar.
4. Validación `agente`, no `dev-lead`: ver la línea `Validación:` de arriba.
5. Sin test nuevo: no hay código, solo un documento, y la regla 2 de la constitución habla de tests antes que código. La línea se comprueba leyendo el fichero; el gate (`node --test && node scripts/lint.mjs`) debe seguir verde. Es una excepción a esa regla, dicha aquí.
6. Nada enlaza la guía desde `README.md` (no entra): así llega a ella quien ya sabe dónde está. Si quieres el enlace, es cambio de Scope.
7. Aprobadora: dejo «Laura» como venía en la spec; no sé quién es y la misión dice que el único usuario es el dev-lead. Corrige el nombre al aprobar si hace falta.

### Hallazgos de la review

- **Aceptado** — el GIVEN presupone un fichero que no existe → GIVEN y THEN reescritos sobre el repo con la feature aplicada.
- **Rechazado (en parte)** — la guía no es alcanzable, sin enlace desde `README.md` → el enlace no lo pidió nadie; queda como decisión 6, para que lo aceptes o lo pidas.
- **Aceptado** — `guide` con alcance abierto → acotada en «Capacidades» y decisión 2.
- **Aceptado** — `Validación: agente` frente a una aprobadora que no se explica → decisión 7; la validación se queda en `agente` por ser un documento.
- **Aceptado** — falta la excepción a «tests antes que código» → decisión 5.
- **Rechazado** — «`scripts/lint.mjs` y `src/` pueden no existir» → existen (`git ls-files`); `docs/` no, y la decisión 1 ya dice que se crea.
- **Rechazado** — los comandos `libres` y `cancelar` no tienen fuente → salen de `run` en `src/app.js`.
- **Aceptado** — el 5500 sin fuente → decisión 3.
- **Rechazado** — la política de modelos mezclada con las decisiones → la línea es del formato de la spec en `delegate`.
- **Aceptado** — referencia a una versión anterior que nadie ve → quitada de la decisión 1.
- Sin Críticos: no hay segunda ronda.

Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: `guide.md: añadido «La guía dice a quién llamar con una sala cerrada»`, sin errores.
- Política de modelos: revisor de la spec, uno, en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: crear `docs/guia.md` con una línea: «Si una sala está cerrada, llama a conserjería: 5500.»
- No entra: los comandos, que no cambian; `README.md`; código de `src/`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0018 → ninguna fila ni fichero la nombra: comprobado con `grep -rn 0018` (solo aparece en esta carpeta) · el roadmap no tiene fila 0018 y la feature sale del enunciado del dev-lead

## Dónde se prueba

- La línea: leída en `docs/guia.md` (sin código, no hay test que escribir; `node --test && node scripts/lint.mjs` sigue verde).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN el repo con esta feature aplicada
- WHEN alguien lee `docs/guia.md`
- THEN el fichero existe y contiene «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
