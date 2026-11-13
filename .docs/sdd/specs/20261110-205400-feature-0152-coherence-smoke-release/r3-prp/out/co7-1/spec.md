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

🦆 Hoy la ruta de exportación apunta a la raíz del repo: `./reservas.csv`. Con este cambio apuntará a `./out/reservas.csv`, para que lo exportado no se mezcle con el código. Se cambia la clave `base` de `config.json` y el test, que pasa a comprobar la ruta completa. Ojo: el comando `exportar` todavía no existe, así que este cambio no escribe ningún fichero ni crea `out/` (ver ✋, decisión 2).

Validación: dev-lead — la ruta de salida la usa una persona y la frase que permite validar solo con el agente no está dicha.

## Capacidades

- Nuevas: `export-path` — la ruta donde la exportación dejará sus ficheros (solo la ruta; el comando `exportar` y la escritura quedan para otra capacidad).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~8 líneas en 3 ficheros
- Dominio y técnica, un solo revisor (sonnet): si el escenario `exportPath()` basta para decir «a out/» sin prometer una escritura que no existe, y si el cambio de `base` deja algún otro lector del valor `.` (señal: capacidad nueva)
- Mínimo razonable: este mismo, un revisor — por debajo no hay review y quedaría sin mirar si el escenario promete más de lo que el código hace hoy

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`. `base` es relativa al directorio de trabajo (`readConfig` lee `config.json` de ahí), sin barra final, porque `exportPath` añade `/reservas.csv`. El test es de configuración: lee el `config.json` real y depende de que `node --test` corra desde la raíz del repo.
2. **Premisa corregida, confírmala.** El enunciado decía «`exportar` deja los ficheros en la raíz»; en el código no es así: `run('exportar')` devuelve `'salas'` y nada escribe `reservas.csv` (solo `exportPath()` calcula la ruta). He acotado la spec a lo que existe: la ruta. Construir el comando `exportar`, la escritura del CSV, crear `out/` y añadirlo a `.gitignore` queda fuera. No creo esa fila aquí (decisión 5): hay que apuntarla con `sdd-roadmap` al cerrar o antes.
3. La capacidad es nueva (no había fichero en `capabilities/`): por eso el delta es `ADDED` y no `MODIFIED`. Nombre: `export-path`, y no `export`, para dejar ese nombre al comando cuando exista; entonces se decidirá si la ruta se funde en `export` (`MODIFIED`) o sigue aparte.
4. El test `test/config.test.js` cambia: título «la ruta de exportación apunta a out/», importa `exportPath` y espera `./out/reservas.csv`. No se crea `test/export.test.js`.
5. No hay fila 0020 en `ROADMAP.md`; no la creo en esta feature.
- Política de modelos: revisor de la spec en sonnet (una ronda más si un Crítico se acepta) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → `export-path.md: añadido «La ruta de exportación apunta a out/»` (exit 0).

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario puede pasar sin llamar a `exportPath()` → el test importa `exportPath` y afirma `./out/reservas.csv` (decisión 4, «Dónde se prueba»).
- **Aceptado** — Crítico: el título del test y del ADDED prometían una escritura → «la ruta de exportación apunta a out/» y ADDED «La ruta de exportación apunta a out/».
- **Aceptado** — `export` no describe nada observable → capacidad renombrada `export-path` (decisión 3).
- **Aceptado** — falta `.gitignore` y crear `out/` → pasan a «No entra» y a la decisión 2.
- **Aceptado** — `./out` y su contrato relativo no estaban en ✋ → decisión 1.
- **Aceptado** — el mínimo dejaba sin mirar el riesgo principal → mínimo = un revisor.
- **Aceptado** — falta el otro lector del valor → fila `src/export.js:4` en la tabla.
- **Aceptado** — la línea del delta probado no tenía resultado → anotada la de la ronda 2.
- **Aceptado** — orden test primero → «Dónde se prueba».
- **Rechazado** — «Laura» no cuadra con PRODUCT.md (un solo usuario) → el aprobador viene del borrador que escribió el dev-lead; no lo cambio yo. Si ese nombre no es el tuyo, dilo al aprobar.

Ronda 2 (revisor nuevo, sonnet, obligada por los dos Críticos aceptados), sin Críticos; no hay tercera ronda:

- **Aceptado** — decisión 2 y 5 se contradecían sobre la fila del roadmap → la decisión 2 dice que se apunta con `sdd-roadmap`, no aquí.
- **Aceptado** — el test depende del cwd → decisión 1.
- **Aceptado** — la reescritura del test no estaba en la tabla → fila nueva.
- **Aceptado** — sin resultado del delta → anotado en ✋.
- **Aceptado** — relación futura entre `export-path` y `export` → decisión 3.
- **Rechazado** — «Laura» y «dev-lead» no existen en PRODUCT.md → el aprobador viene del borrador del dev-lead; no lo cambio yo (ya señalado arriba).
- **Rechazado** — separar la «Política de modelos» → es la forma fija de la plantilla de `delegate`.
- **Rechazado** — `mode: full` desproporcionado → el modo viene del borrador y el carril es feature; bajarlo no me toca a mí.

### Decisiones tomadas con el dev-lead

- Capacidad y comportamiento de la exportación: el dev-lead pidió que la exportación vaya a `out/` (enunciado de la 0020); el alcance acotado a la ruta es mío (decisión 2).

## Intent

La ruta de exportación de las reservas apunta hoy a la raíz del repo (`./reservas.csv`) y se mezclaría con el código. Tiene que apuntar a `./out/reservas.csv`. Éxito: `exportPath()` devuelve `./out/reservas.csv`. Fracaso aunque pase el test: que el cambio prometa una exportación que el código no hace.

## Scope

- Entra: `config.json` (clave `base`) y `test/config.test.js`.
- No entra: `src/export.js` (`exportPath` ya lee `base`, no cambia), el formato de los ficheros, el comando `exportar`, la escritura del CSV, crear `out/` y `.gitignore` (decisión 2).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `'.'` (valor esperado) y la aserción sobre `readConfig().base`; el test deja de importar `readConfig` | `test/config.test.js:3,6` | Scope, decisión 4 |
| «la exportación escribe en la raíz» | `test/config.test.js:5` | Scope, decisión 4 |
| `readConfig().base` (lector del valor) | `src/export.js:4` | sin cambio: `exportPath` lee `base`; fuera del Scope |

- Filas que implementa: nada: comprobado con `git grep -n 0020` fuera de la carpeta de la spec

## Approach

Una sola vía sensata: el valor ya vive en `config.json` y `exportPath()` lo lee; cambiar la clave basta. Descartado: fijar `out/` en `src/export.js`, que duplica la fuente que ya es la configuración.

## Dónde se prueba

- La ruta: `exportPath()` en `test/config.test.js`. Test primero: con `"base": "."` falla (devuelve `./reservas.csv`) y pasa con `"./out"`. Se cierra con el gate `node --test && node scripts/lint.mjs`.

## Delta de comportamiento

### Capacidad: `export-path`

#### ADDED — La ruta de exportación apunta a out/

- GIVEN `config.json` con `"base": "./out"`
- WHEN se calcula la ruta de exportación con `exportPath()`
- THEN devuelve `./out/reservas.csv`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
