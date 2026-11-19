---
id: 20261008-180000-feature-0020-export-dir
feature: 0020
title: Nuevo comando exportar que escribe en out/
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Nuevo comando exportar que escribe en out/

## Capacidades

- Nuevas: `export` — exportar las reservas activas a `./out/reservas.csv`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos, y una segunda ronda por dos Críticos aceptados — señales: capacidad nueva (`export`) · tamaño: ~30 líneas en 6 ficheros (<50, sin MODIFIED ni contrato público)
- Un revisor (sonnet): si el THEN `./out/reservas.csv` con `Norte,lun,10:00-12:00` se sostiene con un `exportar` que hoy no existe (✋ 2), y si el Scope cubre `test/config.test.js` (señal: capacidad nueva)
- Mínimo razonable: el mismo, un revisor — deja sin cubrir la segunda lente (técnica) sobre dónde se crea `out/`
```

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`. Es una clave que solo lee `exportPath` y PRODUCT.md solo conoce un usuario: sin migración.
2. **Implemento `exportar`.** En el código no existe: `run('exportar', …)` devuelve `salas` y nada escribe `reservas.csv`; solo `exportPath()` (`src/export.js:4`) compone la ruta. La feature entra como capacidad **nueva** `export` (no hay fichero en `capabilities/`) y el comando va en `src/app.js`. Alternativa si no lo quieres: recortar el THEN a la ruta de `exportPath()`.
3. Reglas de la capacidad: dónde vive el dato: `./out/reservas.csv`, con la ruta de `base` en `config.json` · nombres en castellano, como la terminología · límites: sin tope · avisos: devuelve `exportado ./out/reservas.csv` (la ruta tal como la compone `base`, sin normalizar) o `no se pudo escribir ./out/reservas.csv` · conflicto: si `reservas.csv` ya existe, se **sobrescribe**.
4. `out/` se crea (recursivo) si no existe; si no se puede escribir, `exportar` devuelve el mensaje en castellano de la decisión 3 y no cambia nada de lo que hubiera. Quito la promesa de «sin fichero a medias» (ningún escenario la ejercita).
5. `out/` se añade a `.gitignore` (hoy no hay) y los `reservas.csv` ya presentes en la raíz no se tocan.
6. Roles y permisos: no aplica (PRODUCT.md solo conoce un usuario, el desarrollador).
7. Se exportan solo las reservas **activas** (no las canceladas ni anuladas); sin ninguna, se escribe el fichero vacío. Sin cabecera, una reserva por línea.
8. `test/export.test.js` corre en un directorio temporal (`process.chdir`), para no escribir en el `out/` real del repo; `./out` se resuelve contra el directorio de trabajo.

### Hallazgos de la review

Ronda 1:

- **Aceptado** — Crítico: el Intent decía «hoy exporta» y no hay comando → Intent reescrito; decisión 2.
- **Aceptado** — Crítico: GIVEN sin franja, THEN sin comprobar la raíz → GIVEN completo, THEN con raíz limpia y escenarios de `out/` inexistente, fichero previo y error de escritura.
- **Aceptado** — Importante: otros consumidores de `base` → único consumidor `exportPath` (`git grep`); decisión 1; `test/config.test.js` cubre el valor.
- **Aceptado** — Importante: creación de `out/` y permisos → decisión 4 y escenario de error.
- **Aceptado** — Importante: cinco reglas → decisión 3 (la constitución no tiene «Reglas de producto»: sin contra qué cotejar).
- **Aceptado** — Importante: `.gitignore` y ficheros antiguos → decisión 5; `.gitignore` entra en el Scope.
- **Aceptado** — Menor: plural «ficheros» → solo `reservas.csv`.
- **Rechazado** — Menor: Laura como aprobadora → la fija el dev-lead en el frontmatter.
- **Aceptado** — Menor: hechos de proceso fuera de las decisiones → quitados de ✋.

Ronda 2 (sin Críticos, sin tercera ronda):

- **Aceptado** — Importante: THEN de «sin poder escribir» pasaba con cualquier implementación → THEN con el mensaje exacto y sin cambios en `out`; decisión 4.
- **Aceptado** — Importante: el aviso no estaba en ningún THEN y `./out` cambia el texto → decisión 3 fija `./out/…` y el THEN lo comprueba.
- **Aceptado** — Importante: mensaje de error en castellano (constitución) → decisión 3 y THEN.
- **Aceptado** — Importante: GIVEN sin raíz limpia → «sin `reservas.csv` en la raíz» en el GIVEN.
- **Aceptado** — Importante: contenido sin acotar → decisión 7 y dos escenarios (solo activas, sin reservas).
- **Aceptado** — Importante: tamaño «4 ficheros» falso → 6 ficheros, ~30 líneas; el mínimo sigue valiendo.
- **Aceptado** — Importante: cómo se prueba sin tocar el `out/` real → decisión 8 y «Dónde se prueba».
- **Aceptado** — Menor: nota «Verificación» colgante → quitada.
- **Aceptado** — Menor: título subestimaba el alcance → retitulada.
- **Aceptado** — Menor: contrato de `base` → decisión 1.

## Intent

`exportar` aún no existe. Hay que implementarlo y que escriba `reservas.csv` en `out/`, no en la raíz del repo, donde se mezclaría con el código.

## Scope

- Entra: `config.json` (clave `base`); `src/app.js` (comando `exportar`); `src/export.js` (crear `out/` y escribir); `.gitignore` (nuevo, con `out/`); `test/config.test.js` (su aserción sobre `base`); `test/export.test.js` (nuevo).
- No entra: cabecera o formato del CSV más allá de lo dicho en la decisión 7; otros ficheros exportados; mover los `reservas.csv` ya existentes.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `readConfig().base, '.'` y el título «la exportación escribe en la raíz» | `test/config.test.js:5-6` | Scope: se reescribe a `./out` |
| `${readConfig().base}/reservas.csv` | `src/export.js:4` | Scope: sigue leyendo `base`; es el único consumidor |

## Dónde se prueba

- Los casos: por `run('exportar', …)`, en `test/export.test.js`, en un directorio temporal (decisión 8).
- `base`: por `readConfig()`, en `test/config.test.js`.

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — Exportar las reservas

- GIVEN la reserva activa de Norte, lunes, 10:00-12:00, `out/` sin crear y sin `reservas.csv` en la raíz
- WHEN `exportar`
- THEN crea `out/`, escribe `out/reservas.csv` con `Norte,lun,10:00-12:00`, devuelve `exportado ./out/reservas.csv` y la raíz no cambia

#### ADDED — Exportar solo las reservas activas

- GIVEN la reserva activa de Norte, lunes, 10:00-12:00 y la de Sur, martes, cancelada
- WHEN `exportar`
- THEN `out/reservas.csv` contiene solo `Norte,lun,10:00-12:00`

#### ADDED — Exportar sin reservas

- GIVEN ninguna reserva activa
- WHEN `exportar`
- THEN escribe `out/reservas.csv` vacío

#### ADDED — Exportar sobre un fichero previo

- GIVEN `out/reservas.csv` con otro contenido
- WHEN `exportar`
- THEN lo sobrescribe con las reservas actuales

#### ADDED — Exportar sin poder escribir

- GIVEN `out` existe como fichero, no como carpeta
- WHEN `exportar`
- THEN devuelve `no se pudo escribir ./out/reservas.csv` y el contenido de `out` no cambia

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
