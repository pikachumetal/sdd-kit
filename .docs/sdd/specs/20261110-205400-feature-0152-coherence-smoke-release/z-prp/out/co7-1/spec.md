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

- Nuevas: `export` — dónde escribe la exportación sus ficheros (hoy ninguna capacidad la describe).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet), despachado — señales: área sin explorar (`export` sin capacidad) · tamaño: ~5 líneas en 3 ficheros con la ✋ 3 en su rama mínima; más con `exportar`
- Dominio+técnica (sonnet): si el THEN es observable con el código de hoy (señal: área sin explorar)
- Mínimo razonable: sin review — dejaría sin ver que el THEN depende de un comando que no existe

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`.
2. `export` es capacidad nueva (en inglés, kebab-case): no hay `capabilities/`, así que el delta es un `ADDED`, no un `MODIFIED`.
3. **⚠ Premisa sin medir: `exportar` no existe en el código.** `run` (`src/app.js:27`) devuelve `salas` para cualquier comando desconocido, y `exportPath()` (`src/export.js:4`) no tiene ningún llamador: nada escribe `reservas.csv` hoy, ni en la raíz ni en `out/`. Con solo el cambio de `config.json` el THEN no se puede observar. Propongo (recomendada) que la feature incluya un `exportar` mínimo que escriba `out/reservas.csv` con las reservas activas (creando `out/` si falta); la alternativa es dejar la feature en el cambio de configuración y mover el THEN a la feature que cree `exportar`. **Necesito tu respuesta antes de aprobar.**
4. `out/` no se versiona: se añadiría `.gitignore` con `out/` (hoy no hay `.gitignore`). Mi propuesta, no pedida.
5. Política de modelos: sin cambios respecto al perfil `delegate` del proyecto (`sdd-kit.json`); review en sonnet porque no toca reglas de negocio ni roles.

Pasada de coherencia (copia de `.docs/sdd` en temp): `sdd capability merge` rechazaba el `MODIFIED` porque `export` no tiene fichero; corregido a «Nuevas» + `ADDED`; resultado tras la corrección: `export.md: añadido «Exportar las reservas»`, salida 0. No medido: nada de lo que `exportar` haría, porque no existe.

### Hallazgos de la review

1. **Aceptado** (Crítico) — `exportar` no existe y el Scope no cubre su código → queda en la ✋ 3 como decisión abierta; el Scope se reescribe cuando la respondas, no antes.
2. **Aceptado** (Crítico) — la premisa «hoy `exportar` deja los ficheros en la raíz» era falsa → Intent reescrito.
3. **Aceptado** (Crítico) — el `ADDED` crea comportamiento y el Scope excluye el formato → se resuelve con la ✋ 3: si entra `exportar`, el formato se fija en un scenario y se parte en dos requisitos (comando · destino `out/`); si no entra, se quita el `ADDED`.
4. **Aceptado** (Importante) — faltan scenarios de `out/` ausente, sin reservas activas, y cancelada o anulada → se escriben si entra `exportar`.
5. **Aceptado** (Importante) — formato CSV, filtro de «activas» y creación de `out/` sin declarar → se declaran en ✋ si entra `exportar`; `.gitignore` ya está en la ✋ 4 y se añade al Scope y a la tabla al aprobar.
6. **Aceptado** (Importante) — `./out/reservas.csv` frente a `out/reservas.csv` → la ruta es relativa al directorio de trabajo (`readFileSync('config.json')` ya lo es); el test compara tras normalizar.
7. **Aceptado** (Importante) — no abrir la capacidad si no entra `exportar`; el nombre `export` va en inglés por ser un nombre de fichero (regla del kit).
8. **Aceptado** (Importante) — el test de `exportar` usará un directorio temporal y limpieza → al planificar, si entra `exportar`.
9. **Aceptado** (Menor) — la tabla de cambios se completa con lo que salga de las ✋ 3 y 4.
10. **Aceptado** (Menor) — rastro de la review reubicado y tamaño corregido arriba.

Segunda ronda: con Críticos aceptados toca, pero reseñar una spec cuya decisión central (✋ 3) sigue abierta no sirve; la lanzo con la spec reescrita tras tu respuesta y antes del gate.

## Intent

Lo pedido: que los ficheros exportados no se mezclen con el código en la raíz del repo y vayan a `out/`. Hoy `config.json` fija `"base": "."` y `exportPath()` compone `./reservas.csv`, pero ningún comando escribe ese fichero (ver ✋ 3). Éxito: con la ✋ 3 resuelta, la exportación deja `out/reservas.csv` y la raíz queda limpia.

## Scope

- Entra: `config.json`, la clave `base`; `test/config.test.js` (fija `'.'` en la línea 6 y se llama «la exportación escribe en la raíz»: pasa a `'./out'`).
- Fuera, con su motivo: `src/export.js` — `exportPath()` compone `${base}/reservas.csv`, así que con `./out` ya da `./out/reservas.csv` sin tocarlo (salvo lo que decida la ✋ 3).
- No entra: el formato de los ficheros exportados.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `readConfig().base === '.'` | `test/config.test.js:6` | Scope |
| «la exportación escribe en la raíz» | `test/config.test.js:5` | Scope |

## Dónde se prueba

- La carpeta: por `run('exportar', …)`, en `test/export.test.js` (fichero nuevo; depende de la ✋ 3, porque `exportar` no existe hoy). La clave de config: `test/config.test.js`.

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
