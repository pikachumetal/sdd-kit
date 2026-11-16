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

- Nuevas: `export` — por ahora solo la ruta donde la exportación deja sus ficheros (`./out`, no la raíz); escribirlos queda para otra feature.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor, más una segunda ronda por un Crítico aceptado — señales: capacidad nueva · tamaño: ~15 líneas en 3 ficheros
- Dominio+técnica (sonnet): si el escenario falla hoy y pasa solo tras el cambio, y si el cambio de `base` toca algo más que `test/config.test.js` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar que un THEN no sea comprobable con el código actual, justo lo que la pasada de coherencia ya encontró una vez

Política de modelos: un revisor de la spec en sonnet (y su segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · hasta `control.maxParallelAgents`.

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`. `exportPath()` ya compone la ruta desde `base`; mantengo la ruta en la configuración, como está.
2. Capacidad nueva `export` (no hay `capabilities/`): el escenario es un `ADDED`. Al cerrar nace `capabilities/export.md` con él.
3. ⚠ **Pendiente de ti, dev-lead, antes de aprobar.** Hoy nada escribe el fichero: `run` en `src/app.js` no tiene comando `exportar` y `exportPath()` solo devuelve la ruta. Esta feature cambia **la ruta configurada**, no escribe ni crea `out/`; el escenario se prueba con `exportPath()`. Si querías que `exportar` exista y escriba el CSV, es otra feature y esta no basta.
4. `test/config.test.js` fija `base == '.'`: se actualiza a `./out`, con el nombre del test. Nombres fijos: `la exportación escribe en out/` (el assert `readConfig().base === './out'`, que sustituye al viejo) y `exportPath() apunta a out/` (nuevo, lee el `config.json` real y exige `./out/reservas.csv`). Son dos hechos distintos —la clave y la ruta compuesta—, y el viejo test desaparece como tal. Los tests dependen de lanzar `node --test` desde la raíz, como ya hace `readConfig()`.
5. Reglas de la capacidad: la ruta es relativa al directorio desde el que se lanza el proceso (como ya lo es `config.json`). Carpeta inexistente, fichero ya existente y límites: no aplica, porque nada escribe todavía (ver 3). Roles y acceso: no aplica, la herramienta no tiene roles (PRODUCT.md). Idioma de los nombres: `reservas.csv` ya existe, no cambia. Avisos: no aplica. Sin `§Frontend`: no cambia lo que se ve.
6. Aparte, sin acción en esta feature: la 0020 no tiene fila en `ROADMAP.md`, y no hay `.gitignore` para `out/` (hoy no se crea nada ahí). Dímelo si quieres que entren.

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario pasaba sin el cambio (el GIVEN ya traía `./out`) → el GIVEN es ahora el `config.json` del repo sin tocar, y falla hoy con `.`.
- **Aceptado** — el Intent prometía escribir ficheros que nada escribe → Intent y capacidad hablan de la ruta configurada; escribir y crear `out/` quedan fuera (decisión 3).
- **Aceptado** — el test nuevo de `exportPath()` no estaba en Scope → Scope y decisión 4.
- **Aceptado** — la decisión 3 era una nota suelta → marcada como pendiente bloqueante.
- **Aceptado** — no decía qué nace al cerrar → decisión 2.
- **Aceptado** — faltaba el grep de efectos de `base` → hecho con `git grep -nE "base|reservas\.csv|exportar|out/"` sobre todo el repo salvo `specs/` y `changes/`: solo `config.json`, `src/export.js` y `test/config.test.js`; `README.md`, `scripts/` y los demás tests sin usos.
- **Aceptado** — relativa al cwd y reglas «no aplica» → decisión 5.
- **Aceptado** — «no hay alternativa razonable» sin evidencia → decisión 1 reescrita.
- **Aceptado** — nota de historia del proceso en la decisión 2 y bloque de review mezclado → quitada la nota; el bloque se queda al abrir, como pide el formato.
- **Aceptado (ronda 2)** — Intent y capacidad prometían una exportación que no existe → «Nuevas» dice que solo cubre la ruta; nombres de tests fijados (decisión 4); reglas por nombre declaradas (decisión 5); `.gitignore`/ROADMAP anotados (decisión 6).
- **Rechazado (ronda 2)** — `develop` no existe → sí existe (`git branch`); nombrar la capacidad `export-path` → `export` es el nombre natural y ya declara su alcance; sacar los hallazgos de la spec → es el formato del kit.
- **Rechazado (ronda 2)** — Crítico: «Laura» y «dev-lead» chocan con PRODUCT.md (un solo usuario) → el aprobador lo puso quien creó la spec y no lo cambio sin que lo digas; **te lo señalo al aprobar** (si eres tú, cambio el nombre).
- **Rechazado** — «Laura/dev-lead no cuadran» → el aprobador del frontmatter es el que puso el dev-lead al crear la spec; no lo cambio sin que lo diga.

## Intent

La ruta de exportación tiene que apuntar a `out/` y no a la raíz del repo, donde los ficheros exportados se mezclarían con el código. Éxito: con el `config.json` del repo, `exportPath()` devuelve `./out/reservas.csv`.

## Scope

- Entra: `config.json` (clave `base`); `test/config.test.js` (el assert y el nombre del test que fijan la raíz, y un test nuevo de `exportPath()`).
- No entra: el formato de los ficheros exportados; `src/export.js` (ya compone la ruta desde `base`); un comando `exportar` en `run`; escribir el fichero o crear `out/`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `readConfig().base, '.'` y «la exportación escribe en la raíz» | `test/config.test.js:5-6` | Scope |

## Dónde se prueba

- La ruta: por `exportPath()` y `readConfig()`, en `test/config.test.js` (`run('exportar', …)` no existe).

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — La exportación apunta a out/

- GIVEN el `config.json` del repo, sin tocar
- WHEN `exportPath()`
- THEN devuelve `./out/reservas.csv`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
