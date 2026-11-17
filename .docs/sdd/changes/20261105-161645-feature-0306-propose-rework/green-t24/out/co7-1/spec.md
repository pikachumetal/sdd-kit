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

- Nuevas: `export` — la exportación de reservas y la carpeta donde escribe (`out/`).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: capacidad nueva (`export`) · tamaño: ~10 líneas en 2 ficheros
- Único (sonnet, siete puntos): si el THEN de `out/reservas.csv` se puede probar con lo que hay y si el Scope declara dónde vive el dato y qué pasa con `out/` y con lo ya exportado (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que el THEN no se pueda ejecutar con el código actual
```

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`.
2. Capacidad nueva `export`: `.docs/sdd/capabilities/` no existe, así que no hay requisito que modificar y entra como `ADDED`. `sdd capability merge` sobre una copia rechazó el `MODIFIED` («export» no tiene fichero en capabilities/).
3. **Pendiente de tu decisión: la premisa no cuadra con el código.** `run('exportar', …)` no existe: `src/app.js` devuelve `salas` para cualquier comando desconocido, y `src/export.js` solo calcula la ruta (`exportPath()`), no escribe ningún fichero. La spec asume que `exportar` ya escribe en la raíz. Opciones: (a) esta feature también crea el comando y escribe `out/reservas.csv` (crece el Scope); (b) solo cambia la ruta que calcula `exportPath()` y el THEN pasa a probar eso. Recomiendo (b): el comando es otra feature.
4. `test/config.test.js` («la exportación escribe en la raíz», `base` = `.`) deja de valer: se cambia a `./out` y va en el Scope.
5. Delta probado sobre una copia de `.docs/sdd` (el repo no cambia): `export.md: añadido «Exportar las reservas»`.

### Hallazgos de la review

- **Aceptado** — Crítico: el THEN exige un comando `exportar` que no existe → es el punto 3 de arriba; el Delta, el Intent, «Dónde se prueba» y el Scope se reescriben cuando elijas (a) o (b). No lo he decidido yo.
- **Aceptado** — Crítico: `test/export.test.js` no está en el Scope y su vía de prueba no existe → queda atado a la misma decisión (a)/(b).
- **Aceptado** — Importante: el GIVEN no completa el dato → la franja `10:00-12:00` ya sale en el THEN; lo cierro al reescribir el Delta.
- **Aceptado** — Importante: falta la regla de `out/` (¿se crea si no existe?, ¿se sobrescribe `reservas.csv`?) → **pendiente tuyo**: recomiendo crearla si falta y sobrescribir, sin migrar lo ya exportado en la raíz.
- **Aceptado** — Importante: `.gitignore` y lo ya exportado en la raíz → pendiente tuyo; recomiendo que `.gitignore` no entre.
- **Aceptado** — Menor: `sdd-archive` creará `capabilities/export.md` al cerrar; el requisito nace con esta feature.
- **Rechazado** — Menor: aprobador Laura → viene del encargo; no lo toco sin que lo digas.
- **Rechazado** — Importante: «ADDED parece un MODIFIED encubierto» → no hay capacidad previa que modificar (comprobado con `sdd capability merge`); queda dicho en 2.

## Intent

Hoy `exportar` deja los ficheros en la raíz del repo y se mezclan con el código. Tienen que ir a `out/`.

## Scope

- Entra: `config.json`, la clave `base`; `test/config.test.js`, que fija `base` a `.`.
- Sale sin tocar: `src/export.js:4` (`exportPath()` lee `base`).
- No entra: el formato de los ficheros exportados.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `readConfig().base, '.'` y el nombre «la exportación escribe en la raíz» | `test/config.test.js:5-6` | Scope |
| `${readConfig().base}/reservas.csv` | `src/export.js:4` | Sin cambio: lee `base` |

## Dónde se prueba

- La carpeta: por `run('exportar', …)`, en `test/export.test.js`.

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — Exportar las reservas

- GIVEN la reserva de Norte del lunes
- WHEN `exportar`
- THEN escribe `out/reservas.csv` con `Norte,lun,10:00-12:00`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
