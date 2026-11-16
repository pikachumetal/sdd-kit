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

Review de spec propuesta: un revisor — señales: capacidad nueva (`guide`), área sin explorar (`docs/guia.md`, leída en esta sesión) · tamaño: ~10 líneas en 2 ficheros
- Dominio+técnica (sonnet): si el THEN de «La guía dice a quién llamar con una sala cerrada» falla hoy y pasa tras el cambio, y qué cubre el gate `node --test && node scripts/lint.mjs` (señal: capacidad nueva)
- Mínimo razonable: este mismo nivel — ya es un solo revisor; no hay nada menor que defender

1. La línea va al final de `docs/guia.md`, tras la lista de comandos, como párrafo propio separado por una línea en blanco.
2. El texto literal («Si una sala está cerrada, llama a conserjería: 5500.») y el número 5500 **sin confirmar**: el brief de la fila 0018 del roadmap está vacío y no los he visto en ninguna otra fuente. Valida el texto y el número tal cual.
3. Se añade un test que lee `docs/guia.md` y exige la frase exacta **como línea completa** (párrafo propio, no dentro de un bloque de código ni de un comando), escrito antes que la línea (constitución, art. 2). Resuelve la ruta desde la raíz del repo con `import.meta.url`, para pasar con `node --test` desde cualquier cwd. Hoy falla en el assert, no por falta de fichero: `docs/guia.md` existe.
4. La capacidad `guide` nace con un solo requisito (el de la línea) y es documental: no describe comportamiento de `src/`. El resto de la guía, los comandos, no queda especificado por ella.
5. Se mantiene el carril feature, modo full, aunque el cambio sea de una línea: lo pidió así la fila del roadmap y el carril solo sube.
6. Política de modelos: un revisor de la spec en sonnet (hecho) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
7. Pasada de coherencia: `git grep` de «conserjer» y «5500» fuera de la spec: sin resultados, nada que retirar ni cambiar de forma. Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: «guide.md: añadido «La guía dice a quién llamar con una sala cerrada»», sin rechazos. `scripts/lint.mjs` solo mira tabuladores en `src/app.js`: no lo toca este cambio.
8. «Sala cerrada» no está en el vocabulario de `PRODUCT.md` (Terminology); uso la palabra corriente y no añado el término.

### Hallazgos de la review

- **Aceptado** — Crítico: el único «test» era leer la línea, y `node --test` pasa igual sin ella → test nuevo escrito antes que la línea (decisión 3, «Dónde se prueba»).
- **Aceptado** — Importante: «alguien la lee» no es un WHEN verificable → el WHEN pasa a «se abre `docs/guia.md`». El THEN conserva la frase literal: es el texto que se pide, no un comportamiento que reformular.
- **Aceptado** — Importante: alcance de `guide` → decisión 4.
- **Aceptado** — Importante: texto y número sin respaldo → decisión 2, marcada sin confirmar.
- **Rechazado** — Importante: añadir «cerrada» a Terminology → no hay estado «cerrada» ni comando que lo gestione; es solo una palabra de la frase (decisión 8).
- **Aceptado** — Importante: aprobador → queda abierto, ver «Aprobaciones»: Laura figura en la spec y `PRODUCT.md` no la nombra.
- **Aceptado** — Menor: formato de la línea → decisión 1.
- **Rechazado** — Menor: «5500» parece dato real → es el número que se pide publicar, no un ejemplo; su origen se valida en la decisión 2.
- **Aceptado** — Menor: lint → decisión 7.
- **Aceptado** — Menor: `capabilities/guide.md` como entregable del cierre → entra en Scope. Bajar a patch: rechazado (decisión 5).

### Hallazgos de la segunda ronda

- **Aceptado** — Importante: el test podía pasar con la frase en un bloque de código → línea completa, decisión 3.
- **Aceptado** — Menor: ruta del test desde cualquier cwd → decisión 3.
- **Aceptado** — Menor: `docs/` sin rastrear → entra en Scope: el commit incorpora `docs/guia.md` entero.
- **Aceptado** — Importante: aprobador → sigue abierto, ver «Aprobaciones»; se lo pregunto al dev-lead en el gate.
- **Rechazado** — Importante: condicionar la aprobación al número → la aprobación de esta spec es esa validación (decisión 2); si cambia el 5500, se corrige aquí antes del plan.
- **Rechazado** — Importante: reformular el escenario porque es una tautología con el test → el requisito es documental y esa frase literal es lo pedido; la decisión 4 lo dice.
- **Rechazado** — Menor: sacar la prueba del delta de ✋ y la política de modelos → ambas líneas van en ✋ por exigencia del kit en `delegate`.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: una línea en `docs/guia.md`, como párrafo propio: «Si una sala está cerrada, llama a conserjería: 5500.»
- Entra: un test en `test/guide.test.js` que exige esa frase en `docs/guia.md`.
- Entra: `docs/guia.md` entero en el commit: hoy la carpeta `docs/` no está rastreada en git.
- Entra: `capabilities/guide.md`, que crea el cierre al integrar el delta.
- No entra: los comandos, que no cambian; `src/` y el lint, que no se tocan.

## Dónde se prueba

- La frase: `node --test test/guide.test.js`, rojo antes de escribir la línea y verde después.
- Cierre: `node --test && node scripts/lint.mjs` entero en verde.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta, `docs/guia.md`
- WHEN se abre
- THEN contiene «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
