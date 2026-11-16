---
id: 20261008-180000-feature-0020-export-dir
feature: 0020
title: La ruta de exportación apunta a out/
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — La ruta de exportación apunta a out/

🦆 Hoy la ruta donde se exporta es `./reservas.csv`, en la raíz del repo, mezclada con el código. Con este cambio la ruta pasa a ser `./out/reservas.csv`. Solo cambia esa ruta: hoy no hay ningún comando `exportar` que escriba el fichero, así que escribirlo queda fuera. Se cambia en `config.json` (`base`) y se ajusta el test que fijaba la raíz.

Validación: dev-lead — la ruta de salida es lo que usa una persona al buscar el fichero exportado, aunque el test la mida.

## Capacidades

- Nuevas: `export` — dónde se escribe el fichero de la exportación.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~6 líneas en 3 ficheros
- Único (sonnet): si el THEN `./out/reservas.csv` sale de lo que hace `exportPath()` y si «No entra» deja algún hueco con el Intent (señal: capacidad nueva)
- Mínimo razonable: ninguna review — deja sin mirar si la capacidad `export` nace describiendo algo que el código no hace

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"` (decisión de la spec original, no la tomó el usuario en esta sesión).
2. **La premisa del Intent no se sostenía**: no hay comando `exportar` ni nada que escriba el CSV; solo `exportPath()` (`src/export.js:4`) compone la ruta, y nadie la usa todavía. Por eso la spec cubre solo la ruta. Escribir el CSV, crear `out/` y su contenido no entran; propongo una fila de roadmap aparte si lo quieres.
3. Capacidad nueva `export` (en `capabilities/` no existe: el `MODIFIED` original lo habría rechazado `sdd capability merge`), con un único requisito `ADDED` sobre la ruta.
4. El test se ajusta en su sitio actual, `test/config.test.js`, sin crear `test/export.test.js`: es la costura que ya importa `src/export.js`. Su título «la exportación escribe en la raíz» cambia a «la exportación escribe en out/».
5. Formato `./out` con prefijo, carpeta llamada `out` y descartar fijarla en `src/export.js` — por seguir `"."` del valor actual y no dejar `base` sin uso.
6. `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal: «export.md: añadido «La exportación va a out/»» más las cinco reglas, y `capability check` da «Capacidades válidas: 1». El `capabilities/` del repo no se ha tocado.

### Hallazgos de la review

- **Aceptado** — el GIVEN fijaba `base` y pasaba sin tocar `config.json` → el GIVEN pasa a «el `config.json` del repo» y el THEN lo comprueba leyéndolo.
- **Aceptado** — el Intent prometía «ningún documento» sin barrido → `git grep -nE "raíz|reservas\.csv"` fuera de specs: solo `src/export.js:4` y `test/config.test.js:5`, ya en la tabla; ningún documento la nombra.
- **Aceptado** — `ADDED` encubría un `MODIFIED` → decisión 3: la ruta anterior no estaba en ninguna capacidad, no hay requisito vivo que contradecir.
- **Aceptado** — el requisito prometía el fichero → el THEN dice «la ruta calculada es» y «No entra» lo deja explícito.
- **Aceptado** — decisiones sueltas en el cuerpo → decisión 5 (formato `./out`, nombre `out`, descartar fijarlo en código).
- **Aceptado** — `reservas.csv` antiguo y `.gitignore` sin destino → filas en «No entra» y en la tabla.
- **Aceptado** — cinco reglas de la capacidad → «Reglas de la capacidad — export», con «no aplica» razonado.
- **Rechazado** — mover la verificación de `capability merge` fuera de ✋ → es evidencia del repaso de coherencia, que la skill manda escribir ahí.
- **Rechazado** — renombrar `out/` a `salida/` → la constitución 4 habla de texto de interfaz y documentos; `out` es nombre de carpeta técnica y es el que pidió el dev-lead.
- **Rechazado** — cambiar aprobador y validación → vienen de la spec original; no los cambio sin que el dev-lead lo diga.
- **Rechazado** — fijar el orden test-primero en la spec → es del plan (constitución 2); el plan lo recoge.

- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

## Intent

Hoy `exportPath()` devuelve `./reservas.csv`: la ruta de exportación cae en la raíz del repo, junto al código. Tiene que caer en `out/`. Éxito: `exportPath()` devuelve `./out/reservas.csv` y ningún test ni documento sigue diciendo que la ruta es la raíz.

## Scope

- Entra: `config.json` (clave `base`) y `test/config.test.js` (aserción y título).
- No entra: `.gitignore` y el `reservas.csv` que alguien tenga ya en la raíz; `src/export.js`, que compone `<base>/reservas.csv` y no cambia; escribir el CSV, su contenido y crear la carpeta `out/` (no hay comando que lo haga hoy).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope |
| `'.'` en la aserción de `base` | `test/config.test.js:6` | Scope |
| título «la exportación escribe en la raíz» | `test/config.test.js:5` | Scope, decisión 4 |
| `${base}/reservas.csv` | `src/export.js:4` | Scope: no cambia, concatena |
| `reservas.csv` en la raíz, ya exportado | repos de quien lo usó | Scope: no entra |

- Filas que implementa: nada: comprobado con `git grep -n 0020 -- . ':!.docs/sdd/specs'`, sin resultados.

## Approach

- Cambiar la clave `base` de `config.json` — un valor, sin código: `exportPath()` ya lo concatena.
- Poner `./out` fijo en `src/export.js` — descarta la configuración que ya existe y deja `base` sin uso.
- Elegido: cambiar `base`, porque es la única costura que ya existe y no toca código de producción.

## Dónde se prueba

- La ruta: llamando a `exportPath()`, en `test/config.test.js`, que ya importa `src/export.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — La exportación va a out/

- GIVEN el `config.json` del repo
- WHEN se calcula `exportPath()`
- THEN la ruta calculada es `./out/reservas.csv`

#### Reglas de la capacidad — export

- **Dónde viven los datos**: `config.json`, clave `base`
- **Idioma de los nombres**: no aplica: `out` y `reservas.csv` son nombres de fichero, no texto de interfaz
- **Límites**: no aplica
- **Avisos**: no aplica
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
