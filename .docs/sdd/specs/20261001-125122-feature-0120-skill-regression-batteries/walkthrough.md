---
id: 20261001-125122-feature-0120-skill-regression-batteries
feature: 0120
title: Walkthrough — Baterías de regresión por skill, topes de palabras y «una entra, otra sale»
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-01
---

# Walkthrough — Baterías de regresión por skill, topes de palabras y «una entra, otra sale»

## 1. Cambios realizados

- **Topes de palabras** (`24b8df5a`, re-medidos en `bab57041`): `tests/WordBudget.Tests.ps1`, en el conjunto rápido, fija un tope por `SKILL.md`, por skill completa (sin `references/migrations/`), un presupuesto del kit (52.900) y un tope por documento de anclaje. Los valores son la medida con la base al día (tras integrar la 0050 y la 0124), redondeada a la centena siguiente. `using-sdd` conserva su tope de 530, que sale de `UsingSdd.Tests.ps1`.
- **Constitution** (`24b8df5a`, `1735bc6d`): el Art. I gana «Una pieza entra, otra sale», y el Art. V el criterio de versión mayor, que aplica desde la release siguiente a la 2.3.0 (decisión del dev-lead).
- **Lanzador de baterías** (`9de6bdcb`, `5fc5dff2`):
  - `tests/headless/battery.sh` y `battery.mjs` lanzan la batería de una skill entera o por tramos (`STEPS`), con el n y el modelo de cada escenario, en tandas de 5.
  - Dan el veredicto por escenario, saltando la invocación de `using-sdd` y contando como «faltan» los sujetos sin `RESULTADO`.
  - `lib.sh` gana `kit_version`, `put_kit_marker`, `subject_resume` y `TURN2`.
  - Los `.args` llevan la petición.
- **Batería de `using-sdd`** (`d02c1ba5`, `5fc5dff2`): `tests/batteries/using-sdd/` con 18 escenarios (las 15 frases de la 0074 y tres de la 0098), la procedencia de cada regla de la skill, y los moldes `mold-salas/` y `mold-ventas/`. Primera pasada: 24 sujetos Sonnet, 17 de 18 en verde.
- **Experimento de dos turnos** (`eba42959`): la fila 2 del RED de la 0125, en sesión real con `TURN2`, da 0 de 2. No se construye un molde de sesión larga.
- **Documentos** (`eba42959`, `5fc5dff2`):
  - `tech-stack.md` gana «Baterías por skill» y pierde cinco entradas, cuatro sustituidas y una duplicada de `architecture.md`. No crece.
  - `architecture.md` pasa la cota de los documentos de anclaje a `WordBudget.Tests.ps1` y nombra `tests/batteries/`.
  - Dos filas de deuda en el roadmap: el rojo de `r1` y la re-medida de la fila de la 0125.

**Qué retira o adelgaza** (Art. I nuevo):

- el tope duplicado de `UsingSdd.Tests.ps1`;
- cinco entradas de `tech-stack.md`;
- `ventas.sh`, que pasó a molde estático.

La constitution crece 159 palabras con las dos reglas nuevas, con la justificación aprobada en la spec.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,5h — reloj del hilo, aproximado con las marcas de los commits. La apertura fue a las 14:59 y el último commit a las 16:05. Se suman ~20 min del cierre. La spec y el plan, de 14:40 a 14:59, no cuentan aquí.
- Desviación: −2,5h (−62 %)
- Causa de la desviación: la estimación sumaba la espera de las dos campañas y la revisión final como reloj del hilo. Corrieron en segundo plano mientras el hilo escribía `architecture.md`, `tech-stack.md` y los borradores de cierre. Además, el lanzador y la batería salieron en verde a la primera, salvo el veredicto que la pasada destapó.
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución en la misma sesión; no se bajó a gama media)
- Tokens del hilo: 46.753.163 — claude-opus-5-5 46.753.163 (la línea incluye la spec y el plan: la sesión arrancó en la rama ya creada)
- Tokens de subagentes: 6.118.118 en 2 despachos — Re-revisión 0120 5fc5dff2..bab57041 claude-opus-5-5 934.324 / 2 min; Revisión final 0120 eba42959 claude-opus-5-5 5.183.794 / 9 min
- Coste de la sesión: 19,22 $ (hilo 15,65 $ + subagentes 3,58 $)
- Coste de sujetos: 4,95 $ en 26 sujetos Sonnet — batería de `using-sdd` 4,12 $ (24); experimento de dos turnos 0,83 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La batería tiene 18 escenarios y 24 sujetos, no los ~19 y ~26 que estimaba la spec. El techo de la campaña (34 sujetos, 8 $) no cambió y se quedó en 26 y 4,95 $.
- El molde `ventas` pasó de funciones de bash a ficheros estáticos en la pasada de fix (Important 3 de la revisión final).
- `tech-stack.md` se quedó en neto cero quitando además un duplicado de `architecture.md`.
- `architecture.md` se condensó para caber en su tope.

### Decisiones tomadas sin el dev-lead

- Tope de `using-sdd` en 530 y no 600 (la centena) — el hook la carga en cada sesión y el tope previo era más estricto — coste si está mal: 70 palabras menos de margen.
- `battery.mjs` se escribió antes que sus tests. Los tests de `lib.sh` y `battery.sh` salieron en RED por ausencia, y los del veredicto se comprobaron con mutantes. El de «faltan» no mordía y se reforzó con una fila de umbral 1/2 — coste si está mal: un caso del veredicto sin cubrir.
- `BATTERY_DIR` sustituye a `tests/batteries/<skill>` en los tests — coste si está mal: ninguno, es opcional.
- `.args` lleva la petición como última línea — coste si está mal: una línea más en los `.args`.
- **Incidente**: el script del primer mutante restauró con una ruta relativa cuando el directorio actual estaba en el módulo de Pester. Sobrescribió `Pester.ScriptScope.ps1` de Pester 6.2.0 en la máquina del dev-lead. Se repuso desde `Save-Module Pester -RequiredVersion 6.2.0` de PSGallery (`psm1` y `psd1` con el mismo hash) y la suite volvió a 27/27 — coste si está mal: Pester roto en esa máquina.
- El veredicto ignora `sdd-kit:using-sdd` como primera skill. En 9 de los 10 sujetos que salían en rojo en el primer recuento, el sujeto invocaba primero el enrutador, que no elige puerta. Test RED→GREEN — coste si está mal: una batería que mida esa invocación tendría que quitar la excepción.
- El test de montaje esperaba 5 `.args` y eran 6, porque `p1` también es del paso `sdd-start-patch`. Se corrigió la expectativa — coste si está mal: ninguno.
- El rojo de `r1` (1 de 2) va a deuda sin relanzarlo ni editar la skill (decisión 5 de la spec) — coste si está mal: una regresión de enrutado sin arreglar hasta la 0121.
- `c1` de la 0098 se renombra `c1w`, y `h1`, `f*`, `b1` y `k1` quedan fuera: miden el carril patch, no la puerta — coste si está mal: ninguno.
- La pasada de fix cambia el mensaje del commit base del molde («feat: base del molde salas|ventas»), que ya no es el de la pasada — coste si está mal: una diferencia de molde entre esta pasada y la siguiente.
- Fila de deuda: el veredicto «se lee» no imprime la ruta del `texts.txt`, que pedía la decisión 2 de la spec. Sin uso en `using-sdd`.
- Minors diferidos de la revisión final (a deuda en el roadmap):
  - `battery.md:3` dice «la primera línea `>>> Skill:`».
  - `New-Battery` tiene 21 líneas y `New-Campaign` 4 parámetros.
  - `kit_version` lee la versión por `grep`.
  - El segundo turno se traga su error, y `SUBJECT_TIMEOUT` pasa a ser por turno.
  - `battery.mjs` no valida filas incompletas.
  - El test de montaje no mira el aviso de migración.
  - `architecture.md` conserva «hoy usado como diario».
  - La entrada del mutante va fuera de su subsección.
  - `roadmap.md` cita la batería de puertas de la 0074.
  - `tech-stack.md` no dice que el tramo es el control del GREEN.
  - `WordBudget` mide cada skill varias veces.

## 4. Verificación

### 4.1 Builds

- Sin build.
- Suite completa: `Invoke-Pester -Path tests`, desde PowerShell. Antes de sincronizar, 1.219 pasan y 0 fallan en 463 s. Tras sincronizar con `develop`, 1.260 pasan, 0 fallan y 10 se saltan, en 440 s.
- Conjunto rápido tras sincronizar: 915 pasan y 0 fallan (pre-commit de `bab57041`).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-01 · suite completa 1.260/1.260 tras sincronizar · smoke 7/7 THEN (5 con ejecución real) · revisión final Opus con fixes sobre `eba42959` y pasada `5fc5dff2` · re-revisión Opus limpia sobre `bab57041`

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Topes: `WordBudget.Tests.ps1` pasa con la base al día; 200 palabras más en `using-sdd` y una skill sin tope lo hacen fallar con medida, tope y salida | ejecución real | Pasa (47/47) tras integrar la 0050 y la 0124. El mutante falla 6 veces con «mide 719 y el tope es 530: recorta, o sube el tope…» y «la skill nueva no tiene tope» |
| Molde con la versión del kit: `plugin.json` 2.2.0 y `v2.3.0.md` → marcador `2.3.0` | ejecución real | `sdd-kit.json` de los moldes `s1-1` y `v1-1` de la pasada: `"version": "2.3.0"` |
| Tramo: `STEPS=sdd-roadmap` lanza solo los escenarios de ese paso, con su n y su modelo | suite | `battery.sh lanza solo el tramo pedido` y `la batería de using-sdd monta su molde…`, en seco |
| Veredicto: una línea por escenario con pasan/n, umbral y color; sale con 0 solo si todo está verde; cada rojo con su fila de deuda | ejecución real | La pasada da 17 verdes y `r1 · 1/2 · rojo`, y sale con 1. La fila de `r1` está en la deuda del roadmap |
| Segundo turno: `--resume <session_id del primero>` con el mismo aislamiento; coste por el último `result` | suite + ejecución real | Test en seco verde. En el experimento, `b1-1.resume.args` lleva `--resume 9e7c1a00-…` y cada `tools.txt` tiene 2 `RESULTADO` |
| Sesión larga contestada en `tech-stack.md`, con evidencia | ejecución real | «Sin molde de sesión larga: … 0 de 2», con las salidas en `exp/out/` |
| Art. V con el criterio de versión mayor y sus tres ejemplos; Art. I con «una entra, otra sale» y el presupuesto | suite | Lectura de `constitution.md`: los dos párrafos están, y el Art. V con «Desde la release siguiente a la 2.3.0» |

### 4.3 Residuales / deuda generada

- Rojo de `r1` en la batería de `using-sdd` → fila de deuda, para re-medir en la 0121.
- Minors diferidos de la revisión final → una fila de deuda.
- `spec-template.md` no tiene hueco para «qué retira o adelgaza», porque la feature no edita skills → en la misma fila, para la 0121.
- Margen de 4 palabras en `sdd-end-feature` (4.496 de 4.500) y `tech-stack.md` (18.696 de 18.700): la próxima edición de cualquiera de los dos pondrá el test en rojo. Es la regla, no un fallo.

## 5. Aprendizajes

- Una batería por skill con tramo por paso, umbral, modelo, marcador generado y segundo turno real → `tech-stack.md`, «Baterías por skill».
- Un mutante restaura con ruta absoluta: `Invoke-Pester` deja el directorio en su módulo → `tech-stack.md`, «Baterías por skill».
- Que la sesión larga no se reproduce con dos turnos reales (0 de 2) → `tech-stack.md`, en la misma subsección, y en la fila de la 0125 del roadmap.
- Los topes nacen con la medida de la rama y se vuelven a medir con la base al día, porque las features en paralelo crecen mientras tanto → decisión 9 de la spec; el método está en la constitution (Art. I) y en el mensaje del test.

## 6. Adendas
