---
id: 20260923-195017-task-0046-estimation-stats
task: 0046
title: Resumen estadístico del estimation-log
mode: lite
profile: delegate
status: approved
created: 2026-09-23
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — Resumen estadístico del estimation-log

> **Estado**: approved.
> **Siguiente paso**: modo lite → implementación directa, tests primero.

## Decisiones que he tomado yo — valida estas

Sin review de spec: es modo lite. He hecho el repaso de coherencia yo.

1. **Uno de los 37 tests existentes cambia su expresión.** «calcula la mediana por Tipo» ancla la fila en `| docs | 8 | 0.5 |$`, y la columna nueva p25–p75 la rompe se ponga donde se ponga. Cambio solo esa expresión, para que admita la columna, y mantengo sus cuatro valores. Los otros 36 no se tocan. Es la única forma de cumplir a la vez «tabla por tipo con p25–p75» y «los 37 siguen en verde»: de las dos, cede la segunda.
2. **Percentiles por interpolación lineal**, el mismo método que `PERCENTILE.INC` de Excel. Es el método que cualquiera puede reproducir en una hoja de cálculo.
3. **«Dentro de ±25 %» es un ratio entre 0,75 y 1,25, ambos incluidos.** Por debajo cuenta como sobreestimada y por encima como infraestimada, así que los tres porcentajes suman 100. Los tramos del histograma son los que pediste, cerrados por abajo: `[0,5, 0,8)`. Por eso sus cortes (0,8) no coinciden con los de ±25 % (0,75).
4. **Umbrales de n.** Con menos de 5 artefactos con ratio, el log da solo la mediana y la media. Los percentiles, el histograma, los porcentajes y el error absoluto se sustituyen por una línea «n insuficiente (hacen falta 5)». La tendencia necesita 20: con menos de 20, las primeras 10 y las últimas 10 se solaparían. En la tabla por tipo, un tipo con menos de 5 lleva `—` en p25–p75.
5. **La tendencia sigue el orden del log** (por carpeta, que es el orden cronológico) y cuenta solo las filas con ratio.
6. **Error absoluto** = |real − estimado| en horas, solo en las filas con ratio.
7. **Asignación de release** por la fecha de la carpeta frente a la fecha de cada `## [X.Y.Z] - AAAA-MM-DD` de `<docs>/changelog.md` (vale tanto `-` como `—`). Cada artefacto va a la primera versión cuya fecha es igual o posterior a la suya. Un artefacto del mismo día que la release cuenta dentro, porque el changelog no da la hora. Lo posterior a la última versión va a «sin publicar». Una carpeta sin fecha va a «sin fecha». `[Unreleased]` no es una versión. **Sin `changelog.md`, o sin ninguna versión con fecha, la tabla por release no aparece.**
8. **Columnas por release**: artefactos y horas reales cuentan todas las filas, también las que no tienen estimado. La mediana cuenta solo las filas con ratio. «Sujetos ($)» suma las cifras y no cuenta «no medido» ni «no aplica»; sin ninguna cifra, la celda lleva `—`. Las releases salen de la más antigua a la más reciente, con «sin publicar» al final, y una release sin artefactos no aparece.
9. **Los números siguen el formato actual del log**: punto decimal y dos cifras, como `0.59`. Los porcentajes son enteros (`26 %`). No uso la coma, para no tener dos formatos en el mismo fichero.
10. **Los tests de estadística construyen su proyecto en `TestDrive`** con walkthroughs mínimos generados. Así no hay veinte fixtures versionadas: las fixtures versionadas son el contrato del formato de entrada, y estos tests prueban el cálculo. Los valores del spike los compruebo en el smoke, contra el log real, y no en un test: cambian con cada task que se cierra.

### Decisiones tomadas con el dev-lead

- Carril task, modo lite y perfil delegate: confirmados en la primera pregunta de la sesión (opción «Task lite, delegate»).

## Intent

Hoy el final de `estimation-log.md` da la mediana global del ratio y una tabla Tipo | n | Mediana. Con 52 artefactos, eso no dice cuánto se dispersan los ratios, qué factor usar para comprometer una fecha, si el estimador mejora ni cuánto pesa cada release. El dev-lead pidió más estadística y un desglose por release, como excepción al corte de la 2.0.0.

## Scope

- Entra: la sección de resumen que genera `Build-EstimationLog.ps1`, sus tests Pester, la capacidad `estimation` y la regeneración de `.docs/sdd/estimation-log.md`.
- No entra: las filas de la tabla principal, el parseo de walkthroughs y patches, la moda, la curtosis, el sesgo formal y los tags de git. Tampoco las skills (`sdd-start-task`, `sdd-end-task`, `sdd-end-patch`, `plan-template`, `overrides-superpowers`), que van en paralelo con la 0044 y la 0016.

## Approach

El script sigue leyendo las mismas filas. El único cambio está en la sección de calibración: calcula las estadísticas sobre las filas con ratio, lee las fechas de versión de `changelog.md` si existe y escribe el resumen ampliado. Los tests se escriben primero y quedan en RED hasta que el script cambia.

## Delta de comportamiento

### Capacidad: `estimation`

**MODIFIED — El log muestra el factor global y por Tipo** (antes: «una tabla Tipo | n | Mediana»)
- GIVEN filas con ratio
- WHEN se genera el log
- THEN aparece el factor global (mediana real/estimado, n) con la media al lado
- AND una tabla Tipo | n | Mediana | p25–p75, donde p25–p75 es `—` en los tipos con menos de 5 artefactos con ratio
- AND con menos de 10 filas con ratio el log avisa de que la calibración es orientativa

**ADDED — El log resume la dispersión de los ratios**
- GIVEN 5 o más filas con ratio
- WHEN se genera el log
- THEN aparecen el p25–p75 y el p80, con una línea que explica que el p80 sirve para comprometer fechas (la estimación × p80 cubre 4 de cada 5 artefactos)
- AND un histograma por tramos del ratio (`<0.5`, `0.5–0.8`, `0.8–1.25`, `1.25–2`, `≥2`) con n y %
- AND el % dentro de ±25 % (ratio de 0,75 a 1,25), el % de sobreestimadas (<0,75) y el % de infraestimadas (>1,25)
- AND el error absoluto |real − estimado| en horas, con media y mediana
- AND con menos de 5 filas con ratio, todo lo anterior se sustituye por «n insuficiente (hacen falta 5)», sin dividir entre cero

**ADDED — El log muestra la tendencia del ratio**
- GIVEN 20 o más filas con ratio
- WHEN se genera el log
- THEN aparece la mediana de las 10 primeras frente a la de las 10 últimas, en el orden del log
- AND con menos de 20, la tendencia dice «n insuficiente (hacen falta 20)»

**ADDED — El log agrupa por release**
- GIVEN un `<docs>/changelog.md` con versiones `## [X.Y.Z] - AAAA-MM-DD` (o con `—`)
- WHEN se genera el log
- THEN aparece una tabla Release | Artefactos | Horas reales | Mediana | Sujetos ($), de la release más antigua a la más reciente
- AND cada artefacto va a la primera versión con fecha igual o posterior a la de su carpeta; los posteriores a la última versión van a «sin publicar», y los que no tienen fecha, a «sin fecha»
- AND sin `changelog.md`, o sin versiones con fecha, la tabla no aparece

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,4 h
- Estimación de implementación: 2 h (rango 1,5–3)
- Base de la estimación: una función de resumen nueva y la lectura del changelog, unos 12 tests nuevos. Referencia: la 0042, de infra/tooling, estimó 3 h y tardó 1,6 h, y la mediana de infra/tooling es 0,7.
- Confianza: media

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada: «si» |
