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

🦆 Hoy no hay forma de exportar las reservas: el comando `exportar` no existe y solo hay una ruta calculada a partir de `config.json`. Con esta feature, `node src/app.js exportar` escribe `out/reservas.csv` con una línea por reserva activa (`Norte,lun,10:00-12:00`) y nunca deja ficheros en la raíz del repo. La carpeta sale de `config.json` (`"base": "./out"`). Para que eso sea cierto hay que crear el comando, y eso es más de lo que decía la petición: míralo en ✋ 1.

Validación: agente — es un fichero de salida que los tests leen entero; nadie ve nada que `node --test` no mida ya.

## Capacidades

- Nuevas: `export` — exportar las reservas activas a `out/reservas.csv`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~25 líneas en 4 ficheros
- Dominio y técnica (sonnet): que el THEN de «Exportar las reservas» salga de lo que hace `run('exportar', [])` y no de una reserva inventada, y que `config.test.js` y `exportPath` queden coherentes con `"./out"` (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor único — deja sin mirar un segundo juicio sobre si crear `exportar` entra o no en esta feature, que es la decisión 1

1. **(Bloquea la aprobación: decide el alcance.) La petición dice «hoy `exportar` deja los ficheros en la raíz», y eso no es cierto en el código**: `src/app.js` no tiene comando `exportar` y `src/export.js` solo calcula `${base}/reservas.csv` sin escribir nada. Para que la feature tenga comportamiento que probar, **la spec incluye crear el comando** (`run('exportar', [])` escribe el fichero). Alternativa: no crearlo y tratar esto como un cambio de configuración (solo `config.json` y su test), sin THEN de fichero escrito; se pierde que el cambio sea observable. Lo recomiendo así porque sin comando la carpeta no se usa para nada.
2. La capacidad es **nueva**, `export` (nombre en inglés, kebab-case): `capabilities/` no existe y no hay requisito vigente que modificar; por eso el delta es `ADDED`, no `MODIFIED`.
3. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"`.
4. El comando crea `out/` si no existe (`mkdir` recursivo) y sobrescribe `out/reservas.csv` en cada ejecución.
5. El fichero lleva una línea por reserva **activa**, sin cabecera, con el formato `sala,día,tramo`: `Norte,lun,10:00-12:00`.
6. Texto que devuelve `exportar`: `exportado: ./out/reservas.csv` (la ruta que da `exportPath()`).
7. Se añade `.gitignore` con `out/`, para que lo exportado no se cuele en los commits. Si prefieres versionarlo, se quita.
8. Enfoque: A, frente a B (ver Approach).
9. «Reserva activa» = ni cancelada ni anulada. Las canceladas y las anuladas no se exportan. Sin reservas activas, `out/reservas.csv` queda **vacío** y el comando devuelve el mismo texto de la decisión 6.
10. Formato exacto: el día se escribe tal como está guardado en la reserva (`lun`), las líneas van en el orden en que están las reservas, cada línea termina en salto de línea, y no se escapa nada (las salas se llaman Norte y Sur, sin comas).
11. La ruta es relativa a la carpeta desde la que se ejecuta el comando, porque `readConfig()` lee `config.json` de ahí; se espera ejecutarlo desde la raíz del repo.
12. Las reservas viven en memoria, con la reserva de Norte del lunes como dato inicial: `node src/app.js exportar` en un proceso nuevo exporta esa. Que las reservas persistan entre procesos no entra.
13. Las cinco reglas de la capacidad (ver el delta) son todas mías: la constitución no tiene «Reglas de producto».
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Coherencia, hecho antes de la review: `sdd capability merge` sobre una copia de `.docs/sdd` rechazaba el borrador anterior («export» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»); corregido con la decisión 2 y el `ADDED`. Resultado con la spec de esa versión: `export.md: añadido «Exportar las reservas»` (salida 0). Hay que repetirlo con los requisitos añadidos tras la review (resultado al final de esta sección).

### Hallazgos de la review

- **Aceptado** — Crítico, un solo escenario de camino feliz → añadidos tres requisitos con datos distintos: activas, canceladas y anuladas excluidas, y sin reservas.
- **Aceptado** — Importante, decisiones 4, 6 y 7 sin escenario → `out/` inexistente, sobrescritura y texto devuelto pasan a ANDs del primer escenario; el `.gitignore` queda en el Scope con su fila de prueba fuera (no es comportamiento).
- **Aceptado** — Importante, faltaba «Reglas de la capacidad» → añadida con las cinco reglas; ✋ 13 dice que son mías.
- **Aceptado** — Importante, formato sin cerrar (día, orden, salto, escape) → ✋ 10.
- **Aceptado** — Importante, reservas en memoria y cwd → ✋ 11 y 12.
- **Aceptado** — Importante, «activa» sin definir → ✋ 9.
- **Aceptado** — Menor, el AND de la raíz se comprueba mal → «Dónde se prueba» compara el listado de la raíz antes y después.
- **Aceptado** — Menor, la decisión 1 contradice la petición → se presenta primero y se marca como la que bloquea la aprobación.
- **Aceptado** — Menor, resultado de la fusión sin dar → ver abajo.
- **Rechazado** — Menor, evitar `bookings`: es el identificador interno que ya usa `src/app.js`, y el «Evitar: booking» de `PRODUCT.md` rige para el texto que ve el usuario; ninguno de los textos nuevos lo lleva.

Fusión repetida con la spec final, sobre una copia (el repo no cambia): `export.md`, 3 requisitos añadidos y 5 reglas añadidas, salida 0.

Sin Crítico aceptado de reescritura del enfoque ni de la decisión central, no hay segunda ronda: los Críticos eran de escenarios, no del enfoque.

## Intent

Hoy no hay exportación: `src/export.js` solo calcula la ruta `./reservas.csv` desde `config.json`, y nada escribe ese fichero. Se quiere que `exportar` exista y que deje su resultado en `out/`, separado del código. Éxito: tras `node src/app.js exportar`, existe `out/reservas.csv` con las reservas activas y no aparece ningún fichero nuevo en la raíz.

## Scope

- Entra: `config.json` (clave `base`); `src/export.js` (escribir el fichero y crear `out/`); `src/app.js` (comando `exportar`); `test/config.test.js` (hoy fija `base` en `.`); `test/export.test.js` (nuevo); `.gitignore` (nuevo, `out/`).
- No entra: el formato del CSV más allá de la línea de ✋ 5 (cabecera, reservas canceladas o anuladas, otros formatos como `.ics`, que es la 0004).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope, decisión 3 |
| `assert.equal(readConfig().base, '.')` y el nombre «la exportación escribe en la raíz» | `test/config.test.js:5-6` | Scope: pasa a `'./out'` y «la exportación escribe en out/» |
| `exportPath()` → `./reservas.csv` | `src/export.js:4` | Scope: pasa a `./out/reservas.csv` por el cambio de `base`, sin tocar la función |

- Filas que implementa: 0020 → no consta en `ROADMAP.md` ni en ningún fichero fuera de su carpeta de spec: comprobado con `git grep -n 0020 -- . ':!.docs/sdd/specs'`, sin resultados.

## Approach

- A — El comando `exportar` en `run` de `src/app.js` llama a una función nueva de `src/export.js` que crea `out/` y escribe el CSV con las reservas activas; la carpeta sale de `readConfig().base`. Cuesta una función nueva y exportar `bookings` o pasarla por parámetro.
- B — Solo cambiar `config.json` y su test, sin comando. Cuesta nada, pero no hay comportamiento observable: nada se escribe en `out/`.
- Elegido: A — la petición pide que la exportación escriba en `out/`, y hoy no hay exportación que escriba.

Cómo: `src/app.js` pasa sus reservas activas a la función de `src/export.js` para no duplicar la lista; `readConfig()` sigue leyendo `config.json` de la carpeta de trabajo.

## Dónde se prueba

- El fichero escrito, su contenido, la sobrescritura, las canceladas y anuladas y el caso vacío: por `run('exportar', [])`, en `test/export.test.js`, leyendo `out/reservas.csv` (como los tests actuales de `cancelar`, que llaman a `run`). «Nada en la raíz»: el test compara el listado de la raíz antes y después.
- La clave de configuración: `test/config.test.js`, que ya existe.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — Exportar las reservas

- GIVEN las reservas activas de Norte el lunes de 10:00 a 12:00 y de Sur el martes de 14:00 a 15:00, y que `out/` no existe
- WHEN `exportar`
- THEN crea `out/` y escribe `out/reservas.csv` con las líneas `Norte,lun,10:00-12:00` y `Sur,mar,14:00-15:00`, cada una terminada en salto de línea
- AND devuelve `exportado: ./out/reservas.csv`
- AND no escribe ningún fichero en la raíz
- AND una segunda ejecución con solo la de Norte reemplaza el contenido: el fichero queda con `Norte,lun,10:00-12:00`

#### ADDED — Las reservas canceladas y anuladas no se exportan

- GIVEN Norte el lunes activa, Sur el martes cancelada y Sur el miércoles anulada
- WHEN `exportar`
- THEN `out/reservas.csv` contiene solo `Norte,lun,10:00-12:00`

#### ADDED — Exportar sin reservas activas

- GIVEN ninguna reserva activa
- WHEN `exportar`
- THEN `out/reservas.csv` existe y está vacío
- AND devuelve `exportado: ./out/reservas.csv`

#### Reglas de la capacidad — export

- **Dónde viven los datos**: la carpeta, en `config.json` (`base`); el fichero, `reservas.csv` dentro de ella.
- **Idioma de los nombres**: fichero y texto devuelto en castellano; el nombre de la capacidad, `export`, en inglés.
- **Límites**: no aplica.
- **Avisos**: no aplica; sin reservas no avisa, escribe el fichero vacío.
- **Regla ante conflicto**: si `out/reservas.csv` ya existe, lo sobrescribe.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
