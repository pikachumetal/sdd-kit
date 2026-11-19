---
id: 20261119-161000-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en la plantilla del aviso de sala
mode: lite
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en la plantilla del aviso de sala

🦆 La plantilla del aviso de sala pasa de una línea a dos: debajo de «Aviso de sala: {sala} el {dia}.» aparece «Conserjería: 5500». Así, un aviso de `Norte` el `lun` acaba con el teléfono al que llamar. Ningún código lee hoy esa plantilla: el cambio es solo el fichero de texto y un test que fija la línea.

Validación: dev-lead — es el texto que leerá quien reciba el aviso; el test mide que la línea está y el tope de palabras, no que diga lo que el dev-lead quiere.

## Capacidades

- Ninguna, porque docs (`docs/plantillas/aviso.md` es un documento; no existe `capabilities/` ni código que lo lea).

## ✋ Decisiones que he tomado yo — valida estas

> Review: nivel mínimo. Una línea de un documento, sin comportamiento de código ni capacidad; una lente (coherencia con el tope de palabras y con la plantilla), y lo que deja sin cubrir es que el texto sea el que el dev-lead quiere, que valida él.

1. La línea va **debajo** de la existente, como línea propia, con salto de línea final `
`: «el aviso añade una línea» no dijo dónde. Hoy el fichero ya acaba en `
` (comprobado con `od -c`), y sigue así: el test parte por `/?
/` y descarta la última cadena vacía, para que valga también con CRLF en Windows.
2. El literal es exactamente `Conserjería: 5500`, **sin punto final** y con «5500» escrito a mano, no como variable `{...}`: es la frase del dev-lead y nada renderiza la plantilla; la primera línea sí acaba en punto y la nueva no, tal como se pidió.
3. El porqué del cambio **pendiente**: no se preguntó («la entrevista ya está hecha»); la suposición es que quien recibe el aviso necesita un teléfono al que llamar, y no se usa para decidir nada.
4. Nuevo test `test/plantillas.test.js` que lee `docs/plantillas/aviso.md` y exige la línea `Conserjería: 5500`: la constitution pide tests antes que código y hoy ningún test lee el contenido del aviso (`test/words.test.js` solo cuenta palabras).
5. «Conserjería» y «aviso» **no se añaden** a «Terminology» de `PRODUCT.md`: son literales de la plantilla, no términos del dominio; si el dev-lead lo quiere ahí, es otra decisión.
6. El tope de 60 palabras de `docs/plantillas` **no cambia**: 52 medidas + 2 previstas = 54 (ver Topes de palabras).
- Política de modelos (delegate): revisores de la spec: ninguno, un revisor de coherencia como mucho · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- `docs/plantillas/aviso.md` añade una línea con el teléfono de conserjería — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»

### Hallazgos de la review

> Un revisor (lite, sonnet), sin Críticos: no hay segunda ronda.

- **Aceptado** — Importante: el final de línea no estaba fijado y CRLF podía romper el test → decisión 1 fija `
` y el test normaliza `
`.
- **Aceptado** — Importante: «salto final» y «como está hoy» podían contradecirse → decisión 1 dice que hoy ya acaba en `
` (medido) y sigue igual.
- **Rechazado** — Importante: el recuento de palabras no cuadraba → sí cuadra: `{sala}` y `{dia}` ya cuentan como palabras en las 6 de `aviso.md`; medido con el método del test (52 hoy, 54 después); queda declarado en Topes de palabras.
- **Aceptado** — Menor: el porqué aparecía como hecho en el Intent → ahora dice «suposición, pendiente».
- **Rechazado** — Menor: «dev-lead» contradice que haya un solo desarrollador → «dev-lead» es el rol de quien aprueba en el kit y es la misma persona que desarrolla; no cambia nada en la spec.
- **Aceptado** — Menor: «aviso» tampoco es término → añadido a la decisión 5 (no se añade a Terminology).
- **Rechazado** — Menor: la política de modelos no es una decisión → la plantilla del kit exige esa línea dentro de ✋ en `delegate`.
- **Aceptado** — Menor: números de línea citados que caducan → quitados.

## Intent

Hoy `docs/plantillas/aviso.md` tiene una sola línea, `Aviso de sala: {sala} el {dia}.`. El porqué no se preguntó; la suposición (pendiente, decisión 3) es que quien recibe el aviso necesita un teléfono al que llamar. El dev-lead decidió añadir una línea con el teléfono de conserjería. Éxito: el fichero tiene exactamente las dos líneas (`Aviso de sala: {sala} el {dia}.` y `Conserjería: 5500`) y `node --test && node scripts/lint.mjs` sigue en verde. Anti-objetivo: que el aviso supere el tope de 60 palabras de `docs/plantillas` o que cambie la primera línea.

## Scope

- Entra: la línea `Conserjería: 5500` en `docs/plantillas/aviso.md`; el test que la fija.
- No entra: parametrizar el teléfono (config o variable), tocar `recibo.md`, `src/app.js` (nada lee las plantillas), cambiar el tope de palabras, añadir el término a `PRODUCT.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Forma de `aviso.md`: de 1 línea a 2 | `docs/plantillas/aviso.md`; el test «docs/plantillas cabe en su tope de 60 palabras» de `test/words.test.js` (solo cuenta, no cita el texto) | Scope y decisión 1; el tope no cambia (decisión 6) |

- Filas que implementa: nada: comprobado con `grep -n "0014\|aviso" ROADMAP.md .docs/sdd/steering/*.md` (la 0008 «Avisos por correo» es otra cosa y ninguna fila nombra `aviso.md`).

## Approach

- A. Línea literal en el fichero + un test que la fija — cuesta un test nuevo de pocas líneas; no inventa mecanismos.
- B. Teléfono como variable `{conserjeria}` rellenada desde una configuración — descartada: nada renderiza hoy la plantilla (`grep -rn aviso` solo da el test de palabras) y el dev-lead dio el literal.
- C. Sin test, solo editar el fichero — descartada: el único test que toca el fichero cuenta palabras y no vería que la línea falta.
- Elegido: A — es lo que dijo el dev-lead («Conserjería: 5500») con el menor cambio; en `delegate` el enfoque lo aprueba el gate de esta spec.

`aviso.md` queda así:

```text
Aviso de sala: {sala} el {dia}.
Conserjería: 5500
```

## Dónde se prueba

- Línea presente: `test/plantillas.test.js` (nuevo, unitario como `test/words.test.js`): lee `docs/plantillas/aviso.md` y comprueba que sus líneas son las dos de arriba.
- Tope de palabras: `test/words.test.js` existente, sin cambios.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

No aplica: capacidades «Ninguna, porque docs».

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,3h
- Estimación de implementación: 0,2h
- Base de la estimación: un fichero de una línea y un test de lectura; sin incertidumbres (sin referencia del estimation-log: no existe aún)
- Confianza: alta

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas` (suma de `aviso.md` 6 + `recibo.md` 46; conteo de `test/words.test.js`) | 52 / 60 | 8 | previsto +2 → 54, dentro del margen: sin cambio. Conteo del test: `split(/s+/)` sin vacíos, así que `{sala}` y `{dia}` cuentan como palabras; medido con ese método sobre las dos plantillas: 52 hoy y 54 con la línea nueva (`printf` de las dos líneas de `aviso.md` → 8 palabras + 46 de `recibo.md`) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
