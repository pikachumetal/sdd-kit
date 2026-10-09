---
id: 20261009-110857-feature-0160-single-entry-propose
feature: 0160
title: Walkthrough — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-09
---

# Walkthrough — Entrada única: sdd-propose con cinco carriles y ceremonia asimétrica

## 1. Cambios realizados

- **Apertura y reparto** (`9b25ce29`): spec aprobada tras dos revisores (dominio en Opus, técnica en Sonnet; 20 hallazgos, 17 aceptados, 1 en parte), plan de cinco tasks en Native, la fila 0163 (carril spike) partida de esta y dos enmiendas de la propuesta 0131: el reparto y la definición del carril config que dio el dev-lead.
- **Batería y RED** (`fb01b014`): batería completa de `sdd-propose` (`tests/batteries/sdd-propose/`) sobre el molde `reservas` de la 0146 con `operations.md`, `estimation.md` y un lint. El RED con el kit de la apertura falla en seis de ocho escenarios; `a3` y `a4` quedan como control.
- **`sdd-propose` nace con lo movido** (`0490c649`): el Gate 1 y los pasos 1-5 de `sdd-start-feature` y el árbol del patch de `sdd-start-patch`, traducidos al inglés sin cambiar reglas; la evidencia de cada regla, a «Procedencia de las reglas» de la batería. Una veintena de ficheros Pester que fijaban frases de lo movido leen `sdd-propose`. Controles GREEN 7 de 7.
- **Ceremonia asimétrica, config y puerta única** (`4fe7011d`): los cinco carriles, el anuncio de feature y spike en la cabeza de la nota de entendimiento de `brainstorming`, la pregunta de patch, lite y config con su 🦆, el carril de la petición, «el carril solo sube», la sección «Config lane» y el traspaso a `sdd-start-feature`; `using-sdd` con una sola puerta (batería entera 20/20); `mission.md`, el `## Propósito` de `routing` y las referencias que nombraban «la primera pregunta».
- **Estimación previa del patch** (`6824eee8`): la pregunta del carril patch lleva la estimación, y `patch.md` §5 la escribe antes del fix con `- Inicio:`; un test Vitest fija que `sdd estimation log` la lee sin cambios en la CLI. `estimation-template.md` deja de decir que los patches solo registran el real.
- **Gate del plan y topes** (`e9b4248b`): la línea del gate de cierre de `plan-template.md` §3 sale de `operations.md` §Testing; topes finales de `sdd-propose` (4.800) y `sdd-start-feature` (5.400 y 17.400, antes 8.430 y 20.600).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 7,5h
- Esfuerzo real: ~2,5h — reloj del hilo aproximado con las marcas de los commits: del commit de apertura (13:35) al de cierre (~16:05), hora local. Spec y plan: ~0,5h más (13:08-13:35), sin contar la entrevista previa a la carpeta.
- Desviación: -5h (-67 %)
- Causa de la desviación: la estimación tomó como referencia la 0146 (8 tasks de regla, 5,75 h) y contó la campaña en serie; aquí las campañas corrieron en segundo plano mientras el hilo preparaba la task siguiente, y el RED salió a 4,42 $ y ~15 min frente a los ~13 $ previstos.
- Modelo del hilo: Opus 5.5, effort high (toda la feature)
- Tokens del hilo: 134.514.322 — claude-opus-5-5 134.514.322
- Tokens de subagentes: 7.242.827 en 4 despachos — Revisión final 0160 e9b4248b claude-opus-5-5 6.028.209 / 6 min; Revisión spec 0160 técnica claude-sonnet-5-5 310.396 / 1 min; Revisión spec 0160 dominio claude-opus-5-5 721.727 / 2 min; Re-revisión 0160 e9b4248b..e315894d claude-opus-5-5 182.495 / 0 min
- Coste de la sesión: 43,68 $ (hilo 39,01 $ + subagentes 4,67 $)
- Coste de sujetos: 31,00 $ en 123 sujetos Sonnet (2 en Opus) — RED 4,42 $; GREEN y REFACTOR de las tasks ~19,4 $; pasada de fix (a1, a3 y la batería de `using-sdd`) ~7,2 $. Techo aprobado: 64 $.
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet) · hallazgos 20, aceptados 17 y 1 en parte

## 3. Desviaciones del plan

- **Task 3**: el anuncio de feature y spike necesitó cuatro rondas de REFACTOR; quedó dentro de la nota de entendimiento de `brainstorming` (paso 4) y como bloque del aviso de fase (paso 2), no solo en el paso 2 como decía el plan.
- **Task 4**: `estimation-template.md` entró en la task, no estaba en la lista de ficheros: contradecía la regla.
- **Task 2**: `NativeDefault.Tests.ps1` se commiteó con un string que no parseaba; lo cazó `sdd task done` con `-CI` y se juntó en el commit de la task.

- **Pasada de fix de la revisión final**: los seis Important, con `tests/SingleEntry.Tests.ps1` (9 de 9 en RED antes); la estimación sin pregunta necesitó una segunda forma tras re-medirla (0/2 → 2/2).

### Decisiones tomadas sin el dev-lead

Los rulings de la ejecución están en `tasks.md`, sección «Rulings». Los que más pesan, con su coste si están mal:

- Las frases que el agente escribe al usuario se quedan en castellano dentro de la skill en inglés — si está mal, un proyecto en inglés las recibe en castellano.
- El anuncio de feature y spike va en la cabeza de la nota de entendimiento de `brainstorming` y queda 4 de 6 tras seis rondas; la regla se queda y la medida va a deuda — si está mal, un tercio de las features arranca sin decir carril, perfil ni las frases de delegación.
- `estimation-template.md` entró en la Task 4 sin estar en el Scope — si está mal, un fichero de plantilla más.
- `SUBJECT_CAP` de la campaña subió de 78 a 130 por las rondas de REFACTOR y la pasada de fix; el techo aprobado era en dólares — si está mal, la previsión en sujetos de la spec (78) queda superada en 45, con 31 $ de 64.
- s2 del pato queda 1/2 con el escenario ya limpio; la skill no se toca en esta feature — si está mal, el pato aún puede listar opciones.
- Seis Minor de la revisión final, diferidos a una fila de deuda.

## 4. Verificación

### 4.1 Builds

- Suite completa tras la pasada de fix: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → Pester 1029 pasados, 0 fallos, 15 omitidos; Vitest 718 (`cli:test`), 156 (`cli:test-slow`) y 874 (`cli:test-min`, Node 22.18.0); typecheck limpio · 191 s
- `sdd capability check --artifact spec.md` → 18 capacidades válidas; `sdd roadmap check` → válido.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-09 · suite 1029/1029 Pester y 1748/1748 CLI · smoke por THEN con ejecución real de sujetos headless (`tests/sdd-propose-0160-green.md`), anuncio 4/6 y 5 THEN no probados · revisión final opus con arreglos sobre e9b4248b, pasada de fix (6 hallazgos) y re-revisión limpia del commit del test lento, juntadas en el cierre

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un cambio entra por `sdd-propose`, no por `brainstorming` (feature, fallo, ajuste, retirada, texto literal, solución del agente) | ejecución real (batería de `using-sdd`) | 20/20 dos veces (Task 3 y pasada de fix) |
| Un cambio sin comportamiento entra por config: pregunta, gate de `operations.md`, commit con `Gate:`, sin commit en rojo ni en la rama estable | ejecución real (k1, k3, k4) | 2/2 cada uno |
| Un typo en una etiqueta de pantalla es patch, no config | no probado | sin escenario |
| Full y spike anuncian y siguen; patch, lite y config preguntan | ejecución real (a1, a2, l1, k1, k2) | anuncio 4/6 (a1); patch 2/2 (a2); lite 2/2 (l1); config 2/2 (k1); spike 2/2 (k2) |
| Partir sigue siendo pregunta, con la opción de delegar | ejecución real (x1) | 2/2 |
| En `unattended` no pregunta | no probado | sin escenario |
| El carril que trae la petición se respeta si concuerda; si se ve uno más pesado, se pregunta | ejecución real (a3, a4) | 2/2 y 2/2 |
| El carril solo sube | no probado | regla con la forma de las subidas vigentes |
| Una investigación con evidencia entra por spike; «¿se puede…?» por consult | ejecución real (k2; c1 de `using-sdd`) | 2/2 |
| Petición vaga, planificar, items del gestor | ejecución real (batería de `using-sdd`: d1, r1-r5) | verdes |
| El perfil vigente y su nivel, con el aviso de la clave local ignorada | ejecución real (a1, l1) | dentro del anuncio, 4/6 |
| La spec aprobada por delegación no para | no probado | la opción se mide en x1; la aprobación sin parar, no |
| El índice de capacidades, la carpeta `-feature-`, `sdd-grilling`, el aviso de fase y la review de spec desde `sdd-propose` | ejecución real (s1, r1, a1) | 2/2 |
| Una migración solo de datos no descarta lite | no probado | l1 mide la oferta de lite sin migración |
| El gate de cierre del plan sale de `operations.md` | ejecución real (p2) | 2/2 |
| `sdd-propose` entrega a `sdd-start-feature` tras el plan | ejecución real (p1, REFACTOR) | 2/2 |
| La estimación de un patch se escribe antes del fix, con `- Inicio:` | ejecución real (a2, a3) y suite (Vitest) | 2/2 y 2/2 |
| La pregunta de un carril que pregunta abre con su 🦆 | ejecución real (a2, a4) | 2/2 y 2/2 |

### 4.3 Residuales / deuda generada

- **El anuncio de feature y spike sale 4 de 6** → fila de deuda del roadmap.
- **Pester cuenta un contenedor que no parsea como cero fallos**, y `kit:test-fast` sale con 0 → fila de deuda.
- **Seis Minor de la revisión final** (referencias obsoletas a `sdd-start-feature` en `control-profiles.md`, `spec-template.md`, `sdd-templates/SKILL.md` y el README; la lista «Perfiles» sin la parada del arranque; los pasos 3-5 de `sdd-propose` sin decir para qué carriles son; títulos de Pester de `PatchLane`; una fila de procedencia que habla de la primera pregunta; config en `unattended` sin gate) → fila de deuda, a la 0152.
- **s2 de `sdd-rubber-duck` 1/2** con el escenario ya limpio → la fila de deuda del pato queda parcial.

## 5. Aprendizajes

- **Una regla de forma que tiene que salir en un mensaje que otra skill ya estructura va dentro de ese mensaje**: el anuncio de feature salió 0 de 6 en el paso 2 y en el aviso de fase, y 2 de 2 en la cabeza de la nota de entendimiento de `brainstorming`. → `tech-stack.md`, «Baterías por skill».
- **Pester cuenta un contenedor que no parsea como cero fallos**: `FailedCount` no lo suma, y `kit:test-fast` sale con 0. → fila de deuda del roadmap (el hook del repo).
- **Un escenario que invoca la skill con «/sdd-kit:<skill>» no deja `>>> Skill:` en el stream**: la puerta de `battery.sh` sale roja aunque la skill cargó; se lee la conducta. → `tech-stack.md`, «Baterías por skill».
- **Lo que un sujeto escribe se busca por la carpeta que crea, no por fecha de modificación**: el `subject.sh` heredado guardaba ficheros del molde como si fueran del sujeto. → `tech-stack.md`, «Baterías por skill».

- **Revisión de skills**: las skills que toca la feature (`sdd-propose`, `sdd-start-feature`, `sdd-start-patch`, `using-sdd`, `sdd-consult`, `sdd-roadmap`) son su objeto; lo aprendido sobre su prueba va a `tech-stack.md`. Ninguna otra skill cambia por esta feature.

## 6. Adendas
