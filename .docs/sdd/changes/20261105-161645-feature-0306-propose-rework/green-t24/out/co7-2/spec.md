---
id: 20261008-180000-feature-0020-export-dir
feature: 0020
title: La exportación escribe en out/
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — La exportación escribe en out/

## Capacidades

- Nuevas: `export` — exportar las reservas a un fichero, que va a `out/` y no a la raíz.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor (hecha) — señales: capacidad nueva, datos nuevos (fichero `out/reservas.csv`) · tamaño: ~40 líneas en 4 ficheros
- Dominio y técnica (sonnet): si los escenarios de `export` se pueden verificar y si el Scope cubre el comando que hoy no existe (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que `exportar` no existe hoy
```

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`.
2. **Hoy no hay exportación que mover.** `run('exportar', …)` cae en el `return 'salas'` final y no escribe nada; solo existe `exportPath()` en `src/export.js`, que compone la ruta. Para que el THEN se cumpla, la feature **implementa el comando `exportar`** (escribe `reservas.csv` con `sala,día,franja`, una línea por reserva activa, sin cabecera) y crea `out/` si no existe. Está en el Scope; si prefieres que la feature se limite a la clave `base`, dímelo y el delta y el Scope se reducen.
3. `export` es una capacidad nueva (no existe ninguna en `.docs/sdd/capabilities/`): por eso el delta es `ADDED` y no `MODIFIED`. Nombre en inglés kebab-case: `export`.
4. El formato de la línea (`Norte,lun,10:00-12:00`) sale de tu THEN: campos sala, día y franja separados por coma, **sin cabecera**, salto de línea al final de cada línea, UTF-8.
5. El test de `test/config.test.js` («la exportación escribe en la raíz», `base === '.'`) afirma lo que se cambia: se actualiza a `./out` y se renombra.

6. Reglas de `export` (las cinco, inventadas por mí, no hay nada en la constitución): datos en `out/reservas.csv`; nombres en castellano; sin límites; sin avisos; si el fichero ya existe, **se sobrescribe**.
7. Los ficheros que ya estén en la raíz no se migran ni se borran, y `out/` no se añade a `.gitignore` (no hay `.gitignore` hoy): quedan fuera.
8. Los tests de `export.test.js` borran `out/reservas.csv` al terminar, para que `node --test` no deje rastro.

- Política de modelos: un revisor de la spec en sonnet (hecho) · ejes de la revisión final: Spec opus+high, Código sonnet+high · sin otros despachos en paralelo · hasta `control.maxParallelAgents`.
- Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` → «export.md: añadido «Exportar las reservas»».

### Hallazgos de la review

Un revisor (sonnet, técnica y dominio juntos: spec pequeña, una capacidad nueva, sin contrato público; sin Crítico, no hay segunda ronda).

- **Aceptado** — el GIVEN no fija franja ni estado → GIVEN con franja 10:00-12:00 y activa; escenarios para reserva cancelada y `out/` inexistente.
- **Aceptado** — nada dice qué pasa con la raíz → THEN «no escribe `reservas.csv` en la raíz».
- **Aceptado** — faltan las reglas de la capacidad → decisión 6 y sección «Reglas de la capacidad».
- **Aceptado** — cabecera ambigua entre decisiones 2 y 4 → «sin cabecera» en ambas, con separador y codificación.
- **Aceptado** — ficheros antiguos y `.gitignore` sin declarar → decisión 7.
- **Aceptado** — el test ensucia `out/` → decisión 8.
- **Aceptado** — el Intent hablaba de «mover» → decisión 2 dice que se implementa el comando; queda pendiente de tu respuesta.
- **Rechazado** — «puede haber una capacidad de reservas que cubra `exportar`» → `sdd capability index` dice «Sin capacidades» y `run()` no tiene rama `exportar`.
- **Rechazado** — rastro del primer `MODIFIED` en la cabecera → ya movido a este bloque.

## Intent

Hoy `exportar` deja los ficheros en la raíz del repo y se mezclan con el código. Tienen que ir a `out/`.

## Scope

- Entra: `config.json`, la clave `base` (`./out`); `src/export.js` y `src/app.js`, el comando `exportar` que escribe `out/reservas.csv` y crea `out/` si falta; `test/config.test.js` (la aserción de `base`) y `test/export.test.js` (nuevo).
- No entra: el formato de los ficheros exportados más allá de la línea del THEN; `exportPath()` no cambia (ya lee `base`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `base === '.'` y el título «la exportación escribe en la raíz» | `test/config.test.js:5-6` | Scope, decisión 5 |
| `` `${readConfig().base}/reservas.csv` `` (compone la ruta con `base`) | `src/export.js:4` | Scope: no cambia, ya sigue a `base` |

- Filas que implementa: 0020 → nada: comprobado con `git grep -n "0020" -- . ':!.docs/sdd/specs'` (la fila no está en `roadmap.md`; la estatuye el dev-lead en esta petición).

## Approach

El destino lo fija solo la clave `base` de `config.json`; el comando `exportar` lee `exportPath()` y no conoce la carpeta.

## Dónde se prueba

- La carpeta: por `run('exportar', …)`, en `test/export.test.js`.
- La clave: `test/config.test.js`, como hoy.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — Exportar las reservas

- GIVEN la reserva activa de Norte el lunes de 10:00-12:00
- WHEN `exportar`
- THEN escribe `out/reservas.csv` con `Norte,lun,10:00-12:00`
- AND no escribe `reservas.csv` en la raíz
- AND si `out/` no existía, la crea

#### ADDED — Las reservas canceladas no se exportan

- GIVEN la reserva de Norte el lunes cancelada
- WHEN `exportar`
- THEN `out/reservas.csv` no contiene `Norte,lun,10:00-12:00`

#### Reglas de la capacidad — export

- **Datos**: `out/reservas.csv`, la carpeta sale de `base` en `config.json`.
- **Nombres**: en castellano.
- **Límites**: no aplica.
- **Avisos**: no aplica.
- **Conflicto**: si `out/reservas.csv` existe, se sobrescribe.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
