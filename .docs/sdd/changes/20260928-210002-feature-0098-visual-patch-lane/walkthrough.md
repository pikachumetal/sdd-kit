---
id: 20260928-210002-feature-0098-visual-patch-lane
feature: 0098
title: Walkthrough — El carril patch acepta ajustes visuales
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — El carril patch acepta ajustes visuales

## 1. Cambios realizados

- **Puertas** (`d6b4255`, arreglos de la revisión final en el commit de cierre):
  - `skills/using-sdd/SKILL.md`: la fila del patch admite «un ajuste pedido solo de presentación», con el predicado entero. La fila de edición directa dice «Mover lo que se ve es patch; cambiar un texto visible, feature». La tabla de racionalizaciones gana «Solo toco la plantilla: edición directa».
  - `skills/sdd-start-feature/SKILL.md`, paso 2: la salida al patch incluye el ajuste pedido solo de presentación, con el predicado y el contraejemplo del `@if`.
  - `skills/sdd-start-patch/SKILL.md`: `description`, Overview, el diamante «¿Ajuste pedido, no un fallo? ¿Solo presentación (predicado)?» y el párrafo del predicado. Un fallo que se arregla solo en CSS sigue siendo un bug, con `systematic-debugging`.
- **Recorrido y cierre** (`96173bf`, arreglos de la revisión final en el commit de cierre):
  - `sdd-start-patch`: en el paso 1, la variante de la intención en una frase. En el paso 4, la captura por pantalla en un navegador real, fuera de git y con su ruta en §4, y qué hacer si cae el predicado a mitad de patch. Un red flag nuevo y el del fallo no reproducido con su salvedad.
  - `sdd-end-patch`: en el paso 0, la ruta de cada captura; en el paso 3, `Changed`.
  - `sdd-templates/templates/patch-template.md`: §2 «Causa raíz (o intención, en un ajuste visual)» y una fila de captura en §4.
- **Docs**:
  - `.docs/sdd/mission.md`: el glosario del carril patch.
  - `.docs/sdd/roadmap.md`: la frase del orden 5, que comparte `sdd-start-feature/SKILL.md` con la 0098.
- **Tests**:
  - `tests/VisualPatch.Tests.ps1`: 13 tests de literales.
  - `tests/UsingSdd.Tests.ps1`: el tope de 450 pasa a 530 palabras.
  - Evidencia en `tests/visual-patch-red.md` y `tests/visual-patch-green.md`, con molde, sujeto y salidas en `red/` y `green/`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,5h
- Esfuerzo real: 1,5h — reloj del hilo, aproximado con las marcas de los commits: apertura a las 23:07, pasada de fix a las 23:53 y cierre hacia las 00:15; spec y plan desde las ~22:45.
- Desviación: -2h (-57 %)
- Causa de la desviación: la campaña, que era el 70 % de la estimación, fue mucho más rápida de lo previsto. Los sujetos de puerta pararon en su primera pregunta (4-10 turnos), los de recorrido tardaron 14-22 turnos, y cada tanda de 3 en paralelo duró unos 5 min. La estimación tomó la 0095, cuyos sujetos simulaban despachos largos.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 42.243.866 — claude-opus-5-5 42.243.866
- Tokens de subagentes: 1.958.995 en 1 despacho — Revisor final 0098 claude-opus-5-5 1.958.995 / 4 min
- Coste de la sesión: 15,72 $ (hilo 14,20 $ + subagentes 1,52 $)
- Coste de sujetos: 8,33 $ en 35 sujetos Sonnet — RED de las puertas 1,44 $; RED del recorrido 1,31 $; GREEN de las puertas 2,36 $; GREEN del recorrido 1,63 $; RED y GREEN de los arreglos 1,59 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **La puerta trasera era la edición directa.** El plan solo tocaba la fila del patch de `using-sdd`. El RED mostró que la maquetación y el texto visible entraban por la fila de edición directa, y esa fila también cambió.
- **La revisión final trajo una pasada de fix con tres escenarios nuevos** (b1, h1, t1) y un control (c2). El dev-lead subió para ella el techo de la campaña de 32 a 36 sujetos.
- **Los arreglos de la revisión llevaron el predicado entero a `using-sdd`**, como pedía la decisión 6 de la spec, y subieron el tope de palabras a 530.

### Decisiones tomadas sin el dev-lead

- Las peticiones de puerta van sin «decide tú el método y sigue», para que el sujeto pare tras elegir la puerta — es lo medido, y la condición de la aprobación pedía sujetos rápidos — coste si está mal: no se ve qué haría después, que aquí no se mide.
- El molde lleva `playwright` 1.63, cuyo Chromium 1243 ya estaba en la caché, con `node_modules` copiado de una instalación única — así ningún sujeto descarga navegador — sin coste.
- El tope de reloj del sujeto llama a `claude` por su ruta (`type -P claude`). `timeout` no ejecuta el builtin `command`, y la primera tanda no arrancó (0 $, salidas borradas) — sin coste.
- `red/visual-patch-done.sh` construye el patch hecho de f2 — el plan pedía ese estado sin decir dónde — sin coste.
- La petición de f2 lleva la validación del usuario. Con la frase escrita en `patch.md`, 2/2 sujetos pararon en el paso 0, con razón; quedan como «-molde» y cuentan para el techo — coste: 0,31 $.
- El tope de palabras de `using-sdd` sube de 450 a 510 en la Task 1 y a 530 en la pasada de fix (la skill queda en 519) — el predicado entero no cabe de otro modo, y recortar otras filas pediría un A/B — coste si está mal: ~100 tokens por sesión en todo proyecto con el hook.
- La fila de edición directa gana «Mover lo que se ve es patch; cambiar un texto visible, feature», y una racionalización — el RED mostró la puerta trasera ahí (v1 2/2, c2 2/2) — coste si está mal: una línea.
- El 0011 que `Get-NextSddId.ps1` propuso a los sujetos de patch es ruido del molde (una fila de patch sin carpeta en `specs/`) y no se arregla aquí — en un proyecto real el patch tiene su carpeta — coste si está mal: un id quemado.
- La variante del paso 1 se escribe aunque el RED de f1 ya sacaba la intención 2/2 — la spec la pide como paso, y esa conducta salía del Overview — coste si está mal: un párrafo.
- M1 (red flag del fallo no reproducido) sube de Minor a Important — en una lista de STOP podía parar un patch visual legítimo — coste si está mal: una frase.
- I3: si el predicado cae a mitad de patch, se borran la carpeta y `patch.md` sin commitear, el id del patch queda consumido y la feature reserva el suyo — lo decide la regla vigente de `nombrado.md` — coste si está mal: un id quemado por cada subida.
- I4 se retira. El RED de t1 sale limpio: la conducta viene de la fila «un typo», no de una fuente incidental, y el Art. I no escribe guía sin fallo. I2 se queda por la letra de la spec, no por el RED — t1 y h1 van como control en el GREEN — coste si está mal: que una errata de UI vaya a feature, y el control lo mide.
- Los 3 fallos del gate en `Measure-SessionTokens.Tests.ps1` (bloque «sin -ProjectsRoot», `Slow`) son previos: salen igual sobre `develop` limpio y sin `CLAUDE_CONFIG_DIR` — coste si está mal: un fallo del kit que queda en una fila de deuda.
- Minors diferidos de la revisión final:
  - **M2**: dos filas «1» en §4 de la plantilla.
  - **M3**: la fórmula de «Capacidades» de `sdd-end-patch` no tiene la forma visual.
  - **M4**: la captura en `%TEMP%` puede no existir en otra sesión. Además, b1 sobrescribió en `%TEMP%\patch-0012\` la captura de f1-2.
  - **M5**: `overrides-superpowers.md` L19 manda hacer directo un cambio de una frase.
  - **M6**: la `description` de `sdd-start-feature` no nombra el ajuste visual.
  - **M7**: `README.md:112` describe el patch solo como carril de bugs.
  - **M8**: el test de `Changed` busca en toda la skill.

## 4. Verificación

### 4.1 Builds

- Pre-commit de cada commit: `Invoke-Pester -Path tests -ExcludeTagFilter Slow` → 775 en verde, 0 fallos, en el último.
- Suite completa: `Invoke-Pester -Path tests` → 1022 en verde, 3 fallos, 9 omitidos · 366 s. Los 3 fallos están en `Measure-SessionTokens.Tests.ps1` («sin -ProjectsRoot»), un fichero que esta rama no toca: salen igual sobre `develop` limpio y sin `CLAUDE_CONFIG_DIR`.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-28 · «ok probamos diferido al uso d el kit, feebackk commit y merge» · disparador: el primer ajuste visual real con el kit en un proyecto del equipo, a cargo del dev-lead.
- Revisión final: `sdd-kit:effort-high` + opus sobre `96173bf`, con arreglos (0 Critical, 4 Important, 8 Minor). Pasada de fix (commit `274834f`, juntado después en el de cierre), verificada con Pester RED→GREEN y sujetos, sin re-revisión (Native). El registro en `tasks.md` que la siguió (solo docs, 3 líneas) se revisó en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El ajuste visual abre `sdd-start-patch` citando el predicado | ejecución real | v1 2/2, v2 2/2, h1 1/1 (RED: 0/4) |
| … y no se crea `spec.md` | ejecución real | 0 `spec.md` en v1, v2 y h1 |
| Lógica o textos entran por `sdd-start-feature` | ejecución real | c1 2/2, c2 3/3 (RED de c2: 0/2) |
| … nombrando la condición que falla | ejecución real | c1: «Eso es lógica»; c2: el texto y el delta de `order-sheets` |
| Si la condición cae dentro de un patch visual, para y pasa a feature | suite | Pester «el paso 4 del patch visual para y pasa a feature…»; ningún sujeto lo provoca |
| §2 con la intención, sin `systematic-debugging` | ejecución real | f1 2/2, h1 1/1 |
| Captura en navegador real, fuera de git, con su ruta en §4 | ejecución real | f1 2/2, 0 PNG en git (RED: 1/2 commiteó 4 PNG) |
| El paso 0 de `sdd-end-patch` enseña esas rutas | no probado | f2 llega con la validación en la petición |
| El changelog va en `Changed` | ejecución real | f2 2/2 (RED: 0/2) |
| Un bug determinista sigue con la causa raíz de `systematic-debugging` | ejecución real | k1 2/2, b1 1/1 (RED de b1: 0/1) |
| … y cierra en `Fixed` | no probado | ningún sujeto de k1 o b1 llegó al cierre |

### 4.3 Residuales / deuda generada

- Podar `using-sdd` con A/B: el tope de palabras pasó de 450 a 530 → fila de deuda.
- 3 tests `Slow` de `Measure-SessionTokens.Tests.ps1` fallan en esta máquina, también en `develop` → fila de deuda.
- Minors M2-M8 de la revisión final → fila de deuda.
- Tres THEN sin observar: el paso 0 enseñando las capturas, el `Fixed` del bug determinista y la subida a feature a mitad de patch. Van al smoke del disparador de la validación diferida.

## 5. Aprendizajes

- `timeout` de coreutils no ejecuta un builtin: el envoltorio de reloj de un sujeto llama al binario por su ruta → `tech-stack.md`.
- Un sujeto con Playwright no descarga navegador si el paquete coincide con un Chromium de la caché, porque cada versión del paquete fija su revisión → `tech-stack.md`.
- Una validación escrita de antemano en el molde no valida: el sujeto para en el gate, con razón. La validación va en la petición → `tech-stack.md`.
- Los sujetos que guardan capturas en `%TEMP%` con un nombre fijo se pisan entre sí: la evidencia de una captura se lee de su ruta única → `tech-stack.md`.
- La puerta trasera de un atajo puede ser otra puerta ya existente, no la que se abre: aquí era la edición directa, no el patch. El RED de un carril nuevo mide también las puertas vecinas → `tech-stack.md`.
- Cambio de comportamiento: los tres requisitos ADDED de `routing` → `capabilities/routing.md`.

## 6. Adendas
