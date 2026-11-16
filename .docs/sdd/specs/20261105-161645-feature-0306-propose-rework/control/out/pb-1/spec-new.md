---
id: 20261105-211807-feature-0012-informes
feature: 0012
title: Informes de ocupación de salas
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de salas

🦆 Un comando nuevo, `informes`, enseña cuatro tablas de texto sobre las reservas activas: cuántas tiene cada sala, cuántas cae en cada día de la semana, qué franjas se piden más y qué salas nadie ha reservado. Con `informes --sala Norte` las cuatro tablas se limitan a esa sala. Si no hay reservas, cada tabla dice «sin reservas». Por dentro, todo es lectura sobre la lista de reservas de `src/app.js`; no se guarda nada.

Validación: dev-lead — es una salida que lee una persona; el formato de las tablas solo lo valida quien la usa.

## Capacidades

- Nuevas: `reports` — informes de ocupación de las salas (comando `informes`)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva · tamaño: ~200 líneas en 4 ficheros (código, tests, capacidad, producto)
- Dominio (sonnet): si «ocupación» como recuento de reservas activas y el reparto de «sin reservas» entre las cuatro vistas (decisiones 3 y 8) se contradicen en algún escenario (señal: capacidad nueva)
- Técnica (sonnet): si los tests pueden sembrar reservas con `bookings` y si el orden y los empates de las tablas (decisión 5) son deterministas (señal: capacidad nueva)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin cubrir la segunda lente sobre empates y sembrado de datos

1. **Enfoque** (la decisión central): cuatro funciones puras de agregación en `src/app.js`, una por vista, más una de formato de tabla común, y `run('informes', params)` las junta. Descartado: un fichero nuevo por informe (el stack manda un solo fichero de entrada) y una pasada única que calcule las cuatro (acopla las cuatro tasks).
2. **Salida**: `informes` imprime las cuatro vistas seguidas, cada una con su título en una línea, otra de cabecera y una por fila, con columnas alineadas con dos espacios. Títulos: `Ocupación por sala`, `Ocupación por día`, `Franjas más reservadas`, `Salas sin reservas`. Vistas separadas por una línea en blanco; sin salto de línea final ni relleno tras la última columna. Una vista sin filas no lleva cabecera: solo título y su texto.
3. **«Ocupación»** = número de reservas activas. No hay duración ni aforo en los datos, así que no hay porcentajes. Las canceladas y las anuladas no cuentan en ninguna vista.
4. **Columnas**: `Sala  Reservas` · `Día  Reservas` · `Franja  Reservas` · `Sala`.
5. **Orden**: por sala y por franja, de más a menos reservas; empate por orden alfabético (`localeCompare('es')`). Por día, en orden de semana (lun mar mié jue vie sáb dom) y solo los días con reservas. «Salas sin reservas» en el orden de las salas (Norte, Sur). Las franjas salen todas, sin tope.
6. **«Nadie ha reservado»** = sin ninguna reserva activa (una sala con solo canceladas cuenta como sin reservas).
7. **`--sala <nombre>`** va en cualquier posición de los parámetros; el nombre se compara exacto, con mayúsculas (`norte` → `sala desconocida: norte`). Sala inexistente: `sala desconocida: Oeste`. Sin valor: `indica una sala`. `--sala` repetido: vale el último; otros parámetros se ignoran. `run` devuelve siempre un string (nunca lanza); los errores son ese string.
8. **«sin reservas»**: la vista sin reservas activas en su ámbito (todas, o las de la sala filtrada) imprime su título y debajo `sin reservas`, también «Salas sin reservas». Consecuencia: sin ninguna reserva, esa vista no lista las salas y dice `sin reservas`; con reservas y todas las salas con alguna, dice `ninguna sala sin reservas`; con `--sala` sobre una sala sin reservas, las cuatro dicen `sin reservas`.
9. **Pruebas**: los tests siembran reservas en la lista `bookings`, que pasa a exportarse (cambio del contrato del módulo) y que cada test vacía en sitio con `bookings.length = 0`. Una reserva es `{ room, day, slot, status }` con `status` `active`, `cancelled` o `voided`; solo `active` cuenta. Las salas válidas son las de la constante `rooms` (Norte, Sur); no hay otra forma de sembrar salas. Una reserva sembrada en una sala fuera de `rooms` se ignora; un día fuera de lun…dom se lista al final.
10. Capacidad nueva `reports` (inglés kebab-case); sin «Reglas de la capacidad»: no hay datos persistentes ni topes nuevos.
11. **Diseño por secciones (4+ tasks)**: en `delegate` va aquí y el stop de la spec lo aprueba. Ejemplo con `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00` y `Sur lun 09:00-10:00`:

```text
Ocupación por sala
Sala   Reservas
Norte  2
Sur    1

Ocupación por día
Día  Reservas
lun  2
mar  1

Franjas más reservadas
Franja       Reservas
10:00-12:00  2
09:00-10:00  1

Salas sin reservas
ninguna sala sin reservas
```

12. **Resto de decisiones del cuerpo**: un comando desconocido sigue devolviendo `salas`; los tests van en `test/informes.test.js`; solo cuenta `status === 'active'`.
13. **⚠ A decidir por ti (hallazgo Crítico de la review, rechazado con motivo)**: la vista «Salas sin reservas» dice `sin reservas` cuando no hay reservas en su ámbito, porque pediste que «cada vista» lo diga. Se lee al revés del título y no lista salas que sí están vacías (sin ninguna reserva, o `--sala Sur` con Sur vacía). Alternativa que recomiendo: esa vista lista siempre las salas vacías del ámbito, y `ninguna sala sin reservas` si no hay ninguna; las otras tres siguen con `sin reservas`. Si apruebas sin tocarlo, rige tu frase literal.
14. **Repaso de coherencia**: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: crea `reports.md` con 6 requisitos añadidos y nada rechazado; `git grep -i informes` fuera de las specs no da resultados; sin `MODIFIED` ni retiradas, nada que corregir.
### Hallazgos de la review

- **Aceptado** — escenarios sin el caso de la cuarta vista con filtro, sala vacía con otras con reservas, empates y vacíos con cabecera → escenarios añadidos y regla de cabecera en decisión 2.
- **Aceptado** — reglas de la capacidad sin declarar → bloque «Reglas de la capacidad — reports».
- **Aceptado** — forma de la reserva, reinicio de `bookings`, fuente de las salas, orden con comparador y casos límite de `--sala` → decisiones 5, 7 y 9.
- **Aceptado** — Scope sin los errores de `--sala`; decisiones sueltas en el cuerpo → Scope y decisión 12.
- **Aceptado** — cada escenario repite su GIVEN; añado uno con salida completa literal y uno de `--sala` en otra posición.
- **Rechazado** (Crítico, ambos revisores) — «Salas sin reservas» dice `sin reservas` en vez de listar salas → motivo: es tu frase literal «cada vista dice sin reservas»; no la cambio yo. Va como decisión 13 para que la valides o la cambies.
- **Rechazado** — escenario de CLI real con argv → el cableado `console.log(run(...))` ya existe y no cambia; lo cubre `run`.

- Política de modelos: revisores de la spec: dos, ambos Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas (ocupación por sala, por día de la semana, franjas más reservadas, salas que nadie ha reservado) y opción `--sala` que filtra las cuatro — «decidido con el dev-lead».
- Salida en tabla de texto; sin reservas, cada vista dice «sin reservas» — «decidido con el dev-lead».
- Plan en 5 tasks, una por vista y otra para `--sala`; perfil delegate — «decidido con el dev-lead».

## Intent

Hoy no hay forma de saber cómo se usan las salas: solo se piden las libres de una franja. El dev-lead quiere ver de un vistazo qué salas, días y franjas se reservan más y qué salas no se usan. Éxito: `node src/app.js informes` imprime las cuatro tablas con los números correctos sobre las reservas activas, y con `--sala` las mismas limitadas a una sala. Fracaso aunque funcione: contar canceladas o anuladas, o que una vista vacía salga en blanco.

## Scope

- Entra: comando `informes` con las cuatro vistas; opción `--sala`; texto «sin reservas»; capacidad `reports`; exportar `bookings` para los tests.
- Entra también: mensajes `sala desconocida: <sala>` e `indica una sala`; orden y formato de las tablas.
- No entra: porcentajes o aforo, rangos de fechas, exportar a fichero, otros formatos (JSON, CSV), filtrar por día o franja, cambiar cómo se reserva o se cancela.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira; `run` añade un comando y los desconocidos siguen devolviendo `salas` | `src/app.js` (`run`) | Scope |

- Filas que implementa: 0012 → nada: comprobado con `git grep -n -i informes` (sin resultados fuera de esta spec).

## Approach

Ver decisión 1. Las funciones agregan sobre `bookings` filtrando `status === 'active'` y, con `--sala`, `room === <nombre>`; `run('informes', params)` formatea y junta las cuatro tablas.

## Dónde se prueba

- Las cuatro vistas, `--sala`, los vacíos y los errores: por `run('informes', [...])`, como los tests de `cancelar`, en `test/informes.test.js`, sembrando `bookings`.

## Términos y ADR

- Términos resueltos: **Ocupación** — número de reservas activas.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN reservas activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00`, `Sur lun 09:00-10:00` y una `Sur mié 09:00-10:00` cancelada
- WHEN `informes`
- THEN la vista `Ocupación por sala` es `Ocupación por sala`, `Sala   Reservas`, `Norte  2`, `Sur    1`, una por línea
- AND con empate (Norte 1 y Sur 1) salen por orden alfabético: `Norte` y después `Sur`

#### ADDED — Ocupación por día de la semana

- GIVEN reservas activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00`, `Sur lun 09:00-10:00` y una `Sur mié 09:00-10:00` cancelada
- WHEN `informes`
- THEN `Ocupación por día` lista `lun  2` y `mar  1`, en orden de semana; `mié` no sale porque su única reserva está cancelada

#### ADDED — Franjas más reservadas

- GIVEN reservas activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00`, `Sur lun 09:00-10:00`
- WHEN `informes`
- THEN `Franjas más reservadas` lista `10:00-12:00  2` y `09:00-10:00  1`, de más a menos
- AND con empate (`09:00-10:00` y `10:00-12:00` con 1) sale primero `09:00-10:00`

#### ADDED — Salas sin reservas

- GIVEN solo la reserva activa `Norte lun 10:00-12:00`
- WHEN `informes`
- THEN `Salas sin reservas` es el título, `Sala` y `Sur`
- AND con reservas activas en Norte y en Sur dice `ninguna sala sin reservas` bajo el título

#### ADDED — Filtrar por sala

- GIVEN reservas activas `Norte lun 10:00-12:00`, `Norte mar 10:00-12:00`, `Sur lun 09:00-10:00`
- WHEN `informes --sala Norte`
- THEN sala `Norte  2`, días `lun  1` y `mar  1`, franja `10:00-12:00  2`, y `Salas sin reservas` dice `ninguna sala sin reservas`
- AND `informes --sala Norte` y `informes --sala` en otra posición (`informes extra --sala Norte`) dan lo mismo

#### ADDED — Errores de la opción de sala

- GIVEN cualquier reserva
- WHEN `informes --sala Oeste`, `informes --sala norte` o `informes --sala`
- THEN `run` devuelve `sala desconocida: Oeste`, `sala desconocida: norte` e `indica una sala`

#### ADDED — Sin reservas

- GIVEN ninguna reserva activa
- WHEN `informes`
- THEN cada una de las cuatro vistas es su título y debajo `sin reservas`, sin cabecera

#### ADDED — Sala sin reservas con filtro

- GIVEN una reserva activa `Norte lun 10:00-12:00` y ninguna de Sur
- WHEN `informes --sala Sur`
- THEN las cuatro vistas son su título y debajo `sin reservas`

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: `bookings` y `rooms` de `src/app.js`, en memoria
- **Idioma de los nombres**: castellano (títulos, días, errores)
- **Límites**: sin tope de filas
- **Avisos**: `sala desconocida: <sala>` · `indica una sala`
- **Regla ante conflicto**: `--sala` repetido, vale el último

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
