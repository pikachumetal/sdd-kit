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

🦆 Hoy no hay forma de exportar las reservas: el comando `exportar` no existe, solo una ruta calculada que apunta a la raíz del repo. Después de este cambio, `exportar` deja `reservas.csv` dentro de `out/`: con la reserva de Norte del lunes de 10:00 a 12:00, el fichero es `out/reservas.csv` y contiene la línea `Norte,lun,10:00-12:00`. Por dentro: la carpeta sale de la clave `base` de `config.json`, que pasa de `"."` a `"./out"`, y `exportar` crea la carpeta si falta. Lo que más conviene que valides es la decisión 3: esta feature también crea el comando.

Validación: dev-lead — lo que ve quien usa el producto es un fichero en una carpeta: se mira ejecutando `exportar`.

## Capacidades

- Nuevas: `export` — exportar las reservas a un fichero, y en qué carpeta se escribe.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: capacidad nueva (`export`), formato de fichero que otros pueden leer (`reservas.csv`) · tamaño: ~40 líneas en 5 ficheros
- Técnica+dominio (sonnet): si el THEN de `out/reservas.csv` se puede cumplir con lo que hay hoy en `src/app.js` y `src/export.js`, y si algo más del repo fija `base` además de `config.json` y `test/config.test.js` (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin mirar si `exportar` y la carpeta `out/` encajan con el código, que es justo donde la pasada de coherencia ya halló tres huecos
```

1. La carpeta se fija en `config.json`: `"base": "."` pasa a `"base": "./out"` — venía en la spec ya escrita; no hay frase del dev-lead que la confirme. La ruta es relativa al directorio desde el que se ejecuta, y se prueba ejecutando desde la raíz del repo.
2. Capacidad nueva `export`, no `MODIFIED`: `capabilities/` no existe y no hay requisito vigente que modificar; la fusión de prueba rechazó el `MODIFIED` por eso. El nombre `export` es el slug del fichero.
3. El comando `exportar` no existe hoy en `src/app.js` (solo `exportPath()` en `src/export.js`). Lo incluyo en el Scope y propongo: `run('exportar', [])` lee las reservas en memoria de `app.js` y escribe `exportPath()` con una línea `sala,día,franja` por cada reserva activa, sin cabecera, y crea `out/` si falta. **Si preferías que `exportar` fuera otra feature, di «recorta»**: la spec queda en la clave `base` y el test de configuración, y se quita la capacidad `export`.
4. `out/` no va a un `.gitignore` en esta feature: el repo no tiene `.gitignore` y nadie lo pidió; el test limpia `out/` antes y después para no ensuciar el árbol.
5. Enfoque: A frente a B y C (ver Approach).
6. El test `test/config.test.js` («la exportación escribe en la raíz», `base === '.'`) se renombra y pasa a esperar `./out`: fija el literal que se retira.
7. Reglas de la capacidad `export`, todas mías (ver el delta): sin reservas activas, el fichero se escribe vacío; reexportar sobrescribe; las reservas canceladas o anuladas no salen; sin escapado de comas porque los nombres de sala no las llevan hoy; si `out/` no se puede crear, falla el error del sistema, sin aviso propio.
8. Fusión de prueba (`sdd capability merge` sobre una copia de `.docs/sdd`): la primera pasada rechazó el `MODIFIED`; con «Nuevas» y `ADDED`, tras la review, da tres requisitos y cinco reglas añadidos a `export.md` (exit 0); el `capabilities/` del repo no cambia.
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — el GIVEN no fija la reserva ni su estado → GIVEN con la reserva completa (Norte, lun, 10:00-12:00, activa) y un escenario con una cancelada que no sale.
- **Aceptado** — el AND de `out/` no fija el estado previo y el test ensuciaría el repo → GIVEN «`out/` no existe» y el test limpia `out/` antes y después (decisión 4).
- **Aceptado** — el formato no estaba en ningún THEN → pasa a THEN/AND y a «Reglas de la capacidad».
- **Aceptado** — faltaban las cinco reglas → sección «Reglas de la capacidad» y decisión 7.
- **Aceptado** — el Approach se apoyaba en una decisión del dev-lead sin confirmar → reescrito sin atribuirla.
- **Aceptado** — Intent y 🦆 decían que `exportar` ya existía → reescritos; la opción «recorta» queda en la decisión 3.
- **Aceptado** — «vacía» y fusión pendiente → corregido, y la fusión se repitió (decisión 8).
- **Aceptado** — `./out` relativo al cwd → dicho en la decisión 1 y en el Intent.
- **Aceptado** — sin reservas y `out/` imposible de crear → decisión 7 y un escenario para el vacío.
- **Rechazado** — «dev-lead» y «Laura» no aparecen en `PRODUCT.md` → «dev-lead» es el rol del kit para quien desarrolla, aquí la misma persona, y «Laura» es la aprobadora que traía la spec; no se cambia sin que el usuario lo pida.

## Intent

Hoy no hay comando para exportar las reservas, y la ruta que calcularía `exportPath()` sale de `config.json` con `"base": "."`, es decir, la raíz del repo, donde se mezclaría con el código. Se quiere que `exportar` exista y escriba en `out/`. Éxito: ejecutado desde la raíz del repo, tras `exportar` existe `out/reservas.csv` y la raíz no recibe ningún fichero exportado. Fracaso aunque «funcione»: que quien exporta tenga que crear `out/` a mano, o que el fichero acabe también en la raíz.

## Scope

- Entra: `config.json` (la clave `base`), `src/export.js` (crear `out/` si falta y escribir el fichero), `src/app.js` (el comando `exportar`, decisión 3), `test/config.test.js` (el literal que se retira) y `test/export.test.js` (nuevo).
- No entra: un `.gitignore` (decisión 4); otros formatos de exportación (el `.ics` es la fila 0004 de Later); cabecera y escapado de comas (decisión 7).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `"base": "."` | `config.json:2` | Scope, decisión 1 |
| `readConfig().base` esperado `'.'` y el título «la exportación escribe en la raíz» | `test/config.test.js:5-6` | Scope, decisión 6 |
| `exportPath()` = `${base}/reservas.csv` | `src/export.js:4` | Scope: la expresión no cambia, con `./out` da `./out/reservas.csv` |

- Filas que implementa: nada: comprobado con `git grep -n 0020 -- ROADMAP.md` (el roadmap no tiene fila 0020).

## Approach

- A — `base` en `config.json` y `exportar` crea la carpeta al escribir: una sola fuente de la ruta (la que ya existe en `exportPath()`); cuesta crear el comando y un `mkdir`.
- B — ruta `out/` fija en el código, sin tocar `config.json`: más simple, pero deja `base` sin efecto.
- C — que quien exporta cree `out/` antes: cero código, pero falla la primera vez y rompe el éxito del Intent.
- Elegido: A — mantiene la ruta configurable en `config.json`, que es donde ya vive, y no deja pasos manuales. Pendiente de validar con el resto de decisiones.

## Dónde se prueba

- La carpeta y el contenido: por `run('exportar', [])`, en `test/export.test.js`, leyendo `out/reservas.csv`; hoy no hay tests de exportación, la costura es la misma `run` de `test/app.test.js`. El test borra `out/` antes y después.
- El valor de la clave: `test/config.test.js`, actualizado.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `export`

#### ADDED — Exportar las reservas

- GIVEN la reserva activa de Norte el lunes de 10:00-12:00 y que `out/` no existe
- WHEN `exportar`
- THEN escribe `out/reservas.csv` con la única línea `Norte,lun,10:00-12:00`
- AND crea la carpeta `out/`
- AND la raíz del repo no contiene `reservas.csv`

#### ADDED — Exportar solo las reservas activas

- GIVEN la reserva de Norte el lunes cancelada con `cancelar Norte lun`
- WHEN `exportar`
- THEN `out/reservas.csv` existe y está vacío

#### ADDED — Reexportar sobrescribe

- GIVEN un `out/reservas.csv` con la línea `Sur,mar,09:00-10:00` de una exportación anterior
- WHEN `exportar`
- THEN `out/reservas.csv` contiene solo `Norte,lun,10:00-12:00`

#### Reglas de la capacidad — export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el fichero en `out/reservas.csv`, con `out/` sacado de `base` en `config.json`.
- **Idioma de los nombres**: castellano, el de las reservas (`Norte`, `lun`) y el del fichero (`reservas.csv`).
- **Límites**: sin escapado de comas; los nombres de sala no las llevan hoy.
- **Avisos**: no aplica; si `out/` no se puede crear, falla el error del sistema.
- **Regla ante conflicto**: reexportar sobrescribe el fichero.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
