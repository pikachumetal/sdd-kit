---
id: 20261105-174730-feature-0012-informes
feature: 0012
title: Informes de ocupación de las salas
mode: full
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Informes de ocupación de las salas

🦆 Hoy no hay forma de saber cuánto se usan las salas. Con esta feature, quien reserva pide un informe de uso y ve cuatro tablas de texto: reservas por sala, reservas por día de la semana, las franjas más reservadas y las salas que nadie ha reservado. Por ejemplo, con Norte reservada el lunes y el martes de 10:00 a 12:00 y Sur el lunes de 14:00 a 16:00, Norte sale con 2 reservas y Sur con 1. Se puede limitar el informe a una sola sala y entonces las cuatro tablas hablan solo de ella. Si no hay reservas, cada tabla dice «sin reservas».

Validación: dev-lead — lo que sale es texto que una persona lee en la terminal; el formato de las tablas solo lo valida quien las mira.

## Capacidades

- Nuevas: `reports` — informes de uso de las salas a partir de las reservas activas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reports`) · tamaño: ~170 líneas en 3 ficheros (código, tests y roadmap)
- Dominio (sonnet): si «ocupación = reservas activas» y «sin reservas» (incluido el caso de `--sala` con una sala sin reservas) son coherentes entre las cuatro vistas y con la `Cancelación` y la `Anulación` de `PRODUCT.md` (señal: capacidad nueva)
- Técnica (sonnet): si cada THEN se puede comprobar con `run('informes', …)` dado que las reservas viven en una lista fija del módulo, y si la tabla y los avisos de «Reglas de la capacidad» son literales comprobables (señal: capacidad nueva)
- Mínimo razonable: un solo revisor con los siete puntos — deja sin segunda lectura de las definiciones de ocupación y de «sin reservas», donde dos vistas pueden discrepar sin que ningún test falle

1. Capacidad nueva `reports` (inglés, kebab-case): hoy no hay capacidades y esto es comportamiento nuevo con nombre propio.
2. «Ocupación» es el número de reservas activas (estado `active`). No hay datos de capacidad (horas disponibles por sala) con los que calcular un porcentaje; no invento uno. Una reserva que se canceló con `cancelar` (Cancelación) o se anuló con `anular` (Anulación) ya no está activa y no cuenta: no ocupa la sala.
3. Cada vista lleva un título y debajo una tabla con cabecera, separador y filas. Títulos: «Ocupación por sala», «Ocupación por día de la semana», «Franjas más reservadas», «Salas sin reservas». Las vistas salen en ese orden, separadas por una línea en blanco, sin línea en blanco al final.
4. Formato de las tablas: columnas separadas por ` | `; cada columna se rellena con espacios hasta el ancho de su celda más larga, cabecera incluida, salvo la última; el separador es una línea de `-` del ancho de cada columna, más uno por el espacio que rodea a ` | `, unidas por `+`. La tabla de una sola columna lleva un separador de `-` del ancho exacto de la columna. Los números a la izquierda, como el resto del texto.
5. Ocupación por sala: todas las salas en el orden en que están dadas de alta (Norte, Sur), también las de 0 reservas. Columnas `Sala` y `Reservas`.
6. Ocupación por día: los siete días en el orden `lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`, también los de 0. Se escriben sin tildes, como `lun` en las reservas actuales; `mar`, `mie`, `jue`, `vie`, `sab` y `dom` son mi suposición de la misma grafía. Una reserva con un día fuera de esos siete no se puede crear hoy: si apareciera, no sale en esta vista. Columnas `Día` y `Reservas`.
7. Franjas más reservadas: solo las franjas con al menos una reserva, de más a menos reservas; en empate, por el texto de la franja de menor a mayor. Sin tope de filas. Columnas `Franja` y `Reservas`.
8. Salas sin reservas: una columna `Sala` con las salas del ámbito del informe que tienen 0 reservas activas. Si todas las del ámbito tienen reservas, la vista dice «todas las salas tienen reservas».
9. «Sin reservas» (literal que dijo el dev-lead) sustituye a la tabla, bajo el título, en cada vista cuando el ámbito del informe (todas las salas, o la de `--sala`) no tiene ninguna reserva activa; por eso, en ese caso, las filas con 0 de las decisiones 5 y 6 no salen. Consecuencia visible que el dev-lead no ha decidido: con `--sala Sur` y Sur sin reservas, la cuarta vista dice «sin reservas» y no lista `Sur`. La otra opción sería listar `Sur`; está así por seguir la regla tal como se dijo. Corrígela aquí si no es lo que quieres.
10. `--sala <nombre>` va detrás de `informes`. El nombre se compara exacto con el de la sala (mayúsculas incluidas, como `cancelar`) y el ámbito pasa a ser solo esa sala: la tabla de ocupación por sala tiene solo su fila, y las demás vistas cuentan solo sus reservas. Con una sala que no existe, el informe no sale y se escribe `sala desconocida: <nombre>`. Si detrás de `--sala` no hay nada, o hay otra opción (empieza por `--`), se escribe `falta el nombre de la sala`. Cualquier otro argumento de `informes` se ignora.
11. Datos y pruebas: el informe lee la lista de reservas en memoria que ya leen `libres`, `cancelar` y `anular`, que hoy solo trae una (Norte, lun, 10:00-12:00). Para que un test cargue otras, `src/app.js` exporta esa lista (`bookings`) y cada test la vacía y la rellena antes de empezar. No cambia el comportamiento de ningún comando actual; un comando desconocido sigue respondiendo `salas`.
12. Todo entra en `src/app.js`, sin módulo nuevo: `tech-stack.md` fija un solo fichero de entrada. Las tablas se generan con espacios, nunca con tabuladores: el lint del gate lo comprueba.
13. Una fila nueva en el roadmap para 0012 (🔄 en curso): no la tenía.
- Política de modelos: revisores de la spec, dos con sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno, las 5 tasks van una tras otra · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Pasada de coherencia: nada se retira ni cambia de forma; `informes` no existe en el repo fuera de las specs (`git grep -i informes`); no hay requisitos `MODIFIED`. Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: crea `reports.md` con 6 requisitos y las 5 reglas, sin rechazos (repetido tras integrar la review).

### Hallazgos de la review

Dominio (10, ningún Crítico):
1. **Aceptado** — los ejemplos de las vistas partían de conjuntos de reservas distintos → todos usan ahora las mismas tres reservas de referencia; el desempate de franjas lleva su propio GIVEN.
2. **Aceptado** — con `--sala Sur` y Sur sin reservas, la cuarta vista dice «sin reservas» aunque Sur sea la sala sin reservas → no lo cambio (es la regla del dev-lead aplicada literal), pero queda dicho en la decisión 9 con la alternativa para que lo valide.
3. **Aceptado** — «todas las salas tienen reservas» era ambiguo con `--sala` → se refiere a las salas del ámbito (decisión 8) y un escenario lo prueba con Norte sin reservas.
4. **Aceptado** — «sin reservas» y las filas con 0 chocaban en el informe vacío → «sin reservas» sustituye a la tabla entera y las filas con 0 solo salen si el ámbito tiene reservas (decisión 9).
5. **Aceptado** — Límites y Regla ante conflicto marcados «no aplica» teniendo valores → Límites: sin tope de filas; Regla ante conflicto: desempate de franjas.
6. **Aceptado** — «cancelada» y «anulada» sin definir contra el glosario → decisión 2 con los términos del glosario y el estado `active`.
7. **Aceptado** — grafía de los días como suposición → dicha como suposición en la decisión 6, sin la salvedad de la enmienda.
8. **Aceptado** — tabla de una columna sin regla → decisión 4.
9. **Aceptado** — dos formulaciones del desempate → una sola («por el texto de la franja de menor a mayor»).
10. **Aceptado** — el cambio de `src/app.js` para que los tests carguen reservas no estaba en el Scope → entra en el Scope y en la decisión 11.

Técnica (10, ningún Crítico):
1. **Aceptado** — la fila `Sur | 1` rompía la regla de formato → literales completos recalculados con el ancho de la cabecera (`Sur  | 1`).
2. **Aceptado** — las vistas filtradas se daban por fragmentos → el escenario de `--sala` da la salida completa y cada AND su GIVEN.
3. **Aceptado** — faltaba el caso de la reserva anulada → escenario con una cancelada y una anulada.
4. **Aceptado** — el mecanismo de carga de reservas y el reinicio por test se dejaban al plan → fijados en la decisión 11.
5. **Aceptado** — el formato de tabla no estaba en ✋ → decisión 4, con el caso de una columna.
6. **Aceptado** — la salida completa y el informe vacío no tenían literal → el escenario «Informe sin reservas» da la salida entera, sin línea en blanco al final.
7. **Aceptado** — día fuera de los siete → decisión 6.
8. **Aceptado** — argumentos de `--sala` sin cubrir → decisión 10.
9. **Aceptado** — la cuarta vista con `--sala` y Norte sin reservas no se probaba → escenario nuevo.
10. **Aceptado** — gate completo y comando desconocido → decisiones 11 y 12 y «Dónde se prueba».

### Decisiones tomadas con el dev-lead

- Un comando `informes` con cuatro vistas: ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado — «un comando informes con cuatro vistas (ocupación por sala, ocupación por día de la semana, franjas más reservadas y salas que nadie ha reservado)»
- Una opción `--sala` que filtra las cuatro vistas — «una opción --sala que filtra las cuatro»
- La salida es una tabla de texto — «la salida es una tabla de texto»
- Sin reservas, cada vista dice «sin reservas» — «sin reservas, cada vista dice «sin reservas»»
- El plan sale en 5 tasks, una por vista y otra para `--sala` — «el plan sale en 5 tasks, una por vista y otra para --sala»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy se puede reservar, cancelar y anular, pero no hay forma de ver cómo se usan las salas: qué sala tiene más reservas, qué días y franjas se llenan, cuál no la ha reservado nadie. El éxito es que con un solo comando se vean esas cuatro respuestas, y que con `--sala` se vean solo las de una sala. Fracasaría, aunque funcionara, si contara reservas canceladas o anuladas, o si dos vistas dieran cifras distintas para las mismas reservas.

## Scope

- Entra: el comando `informes` con las cuatro vistas; la opción `--sala <nombre>` sobre las cuatro; los avisos «sin reservas», «todas las salas tienen reservas», `sala desconocida: <nombre>` y `falta el nombre de la sala`; exportar la lista de reservas de `src/app.js` para que los tests la carguen; los tests de cada vista y de `--sala` en `test/informes.test.js`; la fila 0012 en el roadmap.
- No entra: porcentajes o capacidad de las salas; filtros por día o franja; otros formatos (CSV, JSON); un tope de filas en las franjas; cambiar el comportamiento de `libres`, `reservar`, `cancelar` o `anular`; guardar las reservas fuera de la memoria.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -i informes` fuera de las specs: sin resultados | no aplica |

- Filas que implementa: 0012 → `.docs/sdd/roadmap.md` (la fila nueva, decisión 13) | ningún otro fichero la nombra: comprobado con `git grep -n 0012 -- . ':!.docs/sdd/specs'`

## Approach

Una función por vista en `src/app.js`, más un formateador común de tablas (decisión 4). `run('informes', params)` separa `--sala`, valida la sala, filtra la lista de reservas activas y compone las cuatro vistas en orden. Filtrar antes de calcular hace que `--sala` valga igual para las cuatro. Las tasks del plan: una por vista (ocupación por sala, por día, franjas, salas sin reservas) y una para `--sala`.

## Dónde se prueba

- Las cuatro vistas, `--sala` y los avisos: por `run('informes', …)`, como los tests actuales de `libres` y `cancelar`, en `test/informes.test.js`, con la lista de reservas cargada en cada test y comparando el texto entero.
- Que lo anterior sigue igual: `node --test` entero y `node scripts/lint.mjs` (gate de cierre), con los tests actuales sin tocar.
- La tabla en la terminal: lo mira el dev-lead en la validación, con `node src/app.js informes`.

## Términos y ADR

- Términos resueltos: Ocupación — número de reservas activas de una sala, un día o una franja; las canceladas y las anuladas no cuentan.
- ADR candidatas: ninguna

## Delta de comportamiento

Reservas de referencia, en los escenarios que dicen «las de referencia»: Norte lun 10:00-12:00, Norte mar 10:00-12:00 y Sur lun 14:00-16:00, las tres activas.

### Capacidad: `reports`

#### ADDED — Ocupación por sala

- GIVEN las reservas de referencia
- WHEN se pide `informes`
- THEN la primera vista es
  ```text
  Ocupación por sala
  Sala  | Reservas
  ------+---------
  Norte | 2
  Sur   | 1
  ```
- AND una sala sin reservas sale con 0, en el orden de alta (GIVEN solo Norte lun 10:00-12:00: `Norte | 1` y `Sur   | 0`)
- AND una reserva cancelada o anulada no cuenta (GIVEN Norte lun 10:00-12:00 cancelada, Norte mar 10:00-12:00 anulada y Sur mar 10:00-12:00 activa: `Norte | 0` y `Sur   | 1`)

#### ADDED — Ocupación por día de la semana

- GIVEN las reservas de referencia
- WHEN se pide `informes`
- THEN la segunda vista es
  ```text
  Ocupación por día de la semana
  Día | Reservas
  ----+---------
  lun | 2
  mar | 1
  mie | 0
  jue | 0
  vie | 0
  sab | 0
  dom | 0
  ```

#### ADDED — Franjas más reservadas

- GIVEN las reservas de referencia
- WHEN se pide `informes`
- THEN la tercera vista es
  ```text
  Franjas más reservadas
  Franja      | Reservas
  ------------+---------
  10:00-12:00 | 2
  14:00-16:00 | 1
  ```
- AND en empate de reservas va antes la franja de menor texto (GIVEN solo Sur lun 14:00-16:00 y Norte mar 08:00-09:00: `08:00-09:00 | 1` antes de `14:00-16:00 | 1`) y las franjas sin reservas no salen

#### ADDED — Salas sin reservas

- GIVEN solo la reserva activa Norte lun 10:00-12:00
- WHEN se pide `informes`
- THEN la cuarta vista es
  ```text
  Salas sin reservas
  Sala
  ----
  Sur
  ```
- AND con las reservas de referencia, que ocupan Norte y Sur, la vista dice `todas las salas tienen reservas` bajo su título

#### ADDED — Informe sin reservas

- GIVEN ninguna reserva activa (la única, Norte lun 10:00-12:00, está cancelada)
- WHEN se pide `informes`
- THEN sale exactamente, sin línea en blanco al final:
  ```text
  Ocupación por sala
  sin reservas

  Ocupación por día de la semana
  sin reservas

  Franjas más reservadas
  sin reservas

  Salas sin reservas
  sin reservas
  ```

#### ADDED — Filtrar el informe por sala

- GIVEN las reservas de referencia
- WHEN se pide `informes --sala Sur`
- THEN sale exactamente:
  ```text
  Ocupación por sala
  Sala | Reservas
  -----+---------
  Sur  | 1

  Ocupación por día de la semana
  Día | Reservas
  ----+---------
  lun | 1
  mar | 0
  mie | 0
  jue | 0
  vie | 0
  sab | 0
  dom | 0

  Franjas más reservadas
  Franja      | Reservas
  ------------+---------
  14:00-16:00 | 1

  Salas sin reservas
  todas las salas tienen reservas
  ```
- AND con solo Sur lun 14:00-16:00 y `--sala Sur`, la cuarta vista dice `todas las salas tienen reservas` aunque Norte no tenga ninguna: mira solo el ámbito
- AND con solo Norte lun 10:00-12:00 y `--sala Sur`, las cuatro vistas dicen `sin reservas`
- AND con las reservas de referencia y `--sala Oeste`, que no existe, solo sale `sala desconocida: Oeste`
- AND con `informes --sala` o `informes --sala --otra`, solo sale `falta el nombre de la sala`

#### Reglas de la capacidad — reports

- **Dónde viven los datos**: la lista de reservas en memoria del módulo, la misma que leen `libres`, `cancelar` y `anular`; el informe solo la lee
- **Idioma de los nombres**: castellano (constitución, regla 4); los días, como en las reservas: `lun`, `mar`, `mie`, `jue`, `vie`, `sab`, `dom`
- **Límites**: sin tope de filas en las franjas
- **Avisos**: `sin reservas` · `todas las salas tienen reservas` · `sala desconocida: <nombre>` · `falta el nombre de la sala`
- **Regla ante conflicto**: en las franjas, el empate de reservas se desempata por el texto de la franja, de menor a mayor

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
