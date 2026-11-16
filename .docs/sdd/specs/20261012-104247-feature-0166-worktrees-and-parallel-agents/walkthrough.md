---
id: 20261012-104247-feature-0166-worktrees-and-parallel-agents
feature: 0166
title: Walkthrough — sdd-worktrees y sdd-parallel-agents
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-12
---

# Walkthrough — `sdd-worktrees` y `sdd-parallel-agents`

## 1. Cambios realizados

- **Los dos desvíos de `sdd-implement`** (`39868b0`): escenarios `k1` y `k2` en la batería de `sdd-implement`, con el molde nuevo `mold-kit/` (un kit mínimo con la skill `guardar-nota`). `k2` falló 2/2 en el RED (los dos commitearon «no escribir hasta confirmar» como ruling) y el punto del desvío de «Deviations and rulings» gana su contraejemplo: la guía de una ronda de REFACTOR o de fix que añade o cambia un THEN o un AND para antes del commit; GREEN 2/2. `k1` salió limpio con un molde fiel a la 0168 (0/2 tocaron el README de «No entra»): su contraejemplo no se escribe y sale del delta por enmienda.
- **`sdd-worktrees`** (`d59bf7b`): fork entero de `using-git-worktrees` 7.0.0 con su `NOTICE`; amplía el Step 2 con `env:setup` si existe `environments.md` y cambia el comando de la baseline por el gate de cierre del proyecto. `sdd-implement` la invoca en su paso 1; la plantilla de `environments.md`, la pregunta 18 de `sdd-init-greenfield` y el README dejan de nombrar el worktree de superpowers, y sale su fila de `overrides-superpowers.md`. El kit invoca ahora 3 skills de superpowers.
- **`sdd-parallel-agents`** (`1d1fd15`): fork entero de `dispatching-parallel-agents` 7.0.0 con su `NOTICE`; amplía el despacho con el tope `control.maxParallelAgents` (por tandas) y modelo y effort en cada agente, y dice que las tasks del plan no se reparten aquí. `review-spec.md` despacha con ella los dos revisores.
- **Documentos** (`7a4fa5a`): catálogo del README, `CLAUDE.md` (22 skills), `THIRD_PARTY_NOTICES.md` con el enlace al anexo de la spec, `mission.md` y `architecture.md`; en el roadmap, la fila de deuda de los dos desvíos queda parcial y la 0152 suma la contradicción de `mission.md` sobre las tasks en paralelo.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 1,9 h — reloj activo del hilo por las marcas de los commits: de la apertura (`bc0ff4e`, 12:49) a la pasada de fix (13:46), más ~35 min de las dos rondas de REFACTOR de `w1`, la enmienda y la re-revisión, y ~20 min de cierre; sin las dos esperas a las preguntas del dev-lead. Spec y plan: ~1,2 h, con las tres secciones de diseño.
- Desviación: −2,1 h (−52 %)
- Causa de la desviación: los sujetos fueron baratos (0,25-0,66 $) y cortos, las dos skills se copiaron enteras sin decidir recortes, y `k1` salió limpio, sin GREEN. Lo que costó fue rehacer el molde de `k1` y las rondas de `w1`.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 64.560.836 — claude-opus-5-5 64.560.836
- Tokens de subagentes: 5.323.803 en 2 despachos — Revisión final rama 0166 claude-opus-5-5 4.513.144 / 5 min; Re-revisión tramo 0166 claude-opus-5-5 810.659 / 4 min
- Coste de la sesión: 30,96 $ (hilo 27,77 $ + subagentes 3,19 $)
- Coste de sujetos: 5,82 $ en 16 sujetos sonnet — RED `k1` (dos moldes) y `k2` 1,8 $; GREEN `k2` 0,5 $; `w1` (tres tandas) 1,0 $; `a1` 0,66 $ con sus dos revisores; resto, en seco
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- `k1` necesitó un segundo molde: el primero contradecía dos THEN y los sujetos pararon por eso, sin que el «No entra» decidiera nada. El segundo, fiel a la 0168, salió limpio y su texto no entró (enmienda de la spec, aprobada por la decisión 6).
- Los topes de las dos skills nuevas entraron en las Tasks 2 y 3, no en la 4: `WordBudget` exige tope a toda skill en cuanto existe.

### Decisiones tomadas sin el dev-lead

- Task 1: Ruling: effort — `sdd-kit:effort-high` está entre los agentes de la sesión: el revisor final va con su tipo y `opus`.
- Task 1: Ruling: sin `app-0018.js` en la primera versión del molde — `mold-reservas` ya tenía `anular` — sin coste.
- Task 1: Ruling: el primer molde de `k1` (dos THEN que se contradecían) no medía el «No entra»: 2/2 sujetos pararon por la contradicción, no por el README — se rehace fiel a la 0168 (un test existente, `test/readme.test.js`, exige tocar el README al añadir `ayuda`) y se relanza `k1`; las salidas del primero quedan en `red-k1v1/` — ~0,5 $ y un sujeto más por fila
- Task 1: RED k2 2/2 falla (K2): los dos commitean «no escribir hasta que el usuario confirme» como `Ruling:` aunque dicen que cambia la salida observable — el texto del REFACTOR entra
- Task 1: Ruling: el nombre de la skill del molde de `k2` es `guardar-nota`, no `sdd-avisos` como decía el plan — sin coste
- Task 2: Ruling: `w1` informa la rama y no la ruta del worktree — el texto de la fuente ya pide «at `<path>`» y se conserva; no se añade guía por un detalle del informe — si importa, el dev-lead no ve la ruta en el chat (la tiene en el prompt de arranque de Orca)
- Task 2: Ruling: el tope `Kit` de `WordBudget` está suspendido («mientras conviven las plantillas 2.x y 3.0.0», hasta la 0157): no se sube; la 0157 lo re-mide — sin coste
- Task 4: Ruling: architecture.md quedaba en 1.903 de 1.900 por la línea nueva del árbol (la spec, decisión 7, solo contó el cambio de nombre) — las cuatro carpetas van en una entrada sdd-{tdd,debugging,worktrees,parallel-agents}/, sin recortar texto ajeno ni subir el tope — el árbol se lee algo peor
- Task 4: Ruling: el RED de la Task 4 (WordBudget sin tope de las skills nuevas) ya lo pusieron en verde las Tasks 2 y 3, como dijo el escaneo previo — sin coste
- Final: Ruling: Declined «el segundo molde de k1 deja una salida fácil (sacar ayuda de commands)» — mide que no toca lo excluido si puede evitarlo; el caso de la 0168 también tenía alternativa — si importa, el RED de «No entra» subestima el fallo y la fila espera su 2.º ticket
- Final: Ruling: Declined «w1 solo cubre la rama tech-stack.md del orden del gate y las tandas no tienen sujeto» — el plan los deja en lectura (Review Focus) — un fallo en esas ramas solo se vería en campo
- Final: Ruling: Declined «capabilities/control-profiles.md:295 dice que el tope lo define la task 0022» — no lo toca el delta; queda desfasado — pendiente del dev-lead, al informe final
- Final: minor (deferred): sdd-parallel-agents:81 «omitted, both inherit the session's» deja abierta la herencia de modelo a un llamador que no los nombre (la 0148)
- Final: minor (deferred): sdd-worktrees Step 0: rechazar el worktree en main no es consentir implementar en main; falta la frase que lo separa
- Final: minor (deferred): sdd-implement:41, «also when you didn't write the AND» es ambiguo, y el GREEN de k2 usa el mismo molde que el contraejemplo cita; variante de código para la 0152
- Final: minor (deferred): el cuarto punto del Review Focus del plan («what the spec leaves») quedó sin objeto con la enmienda de k1
- Final: minor (deferred): contabilidad — commit de la Task 4 en tasks.md, enlace al walkthrough que nace en el cierre, «Esperar 2.º caso» en battery.md frente a «Esperar 2.º ticket» en el roadmap
- Final: minor (deferred): environments-template.md:8 rompe el ajuste a ancho del bloque
- Final: Ruling: TaskVerification.Tests.ps1 fijaba «closing gate … runs once»; pasa a «once in the final validation … never inside a task», la regla corregida por el Important 2 — sin coste
- Final: Ruling: Important 1 — dos rondas de REFACTOR sin efecto (w1 0/3 escribe la ruta); se retiran y el THEN pasa a «con su rama» por enmienda aprobada («Enmienda: solo la rama (Recomendada)», 2026-10-12)

## 4. Verificación

### 4.1 Builds

- Gate de cierre (`no declarado` en `tech-stack.md`; el de la 0165): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre la pasada de fix y la enmienda → CLI 757/757, lentos 157/157, Node mínimo 918/918, Pester 1.167 con 1 fallo: `FastSuiteBudget` (el conjunto rápido tarda 31-34 s con umbral de 30), que falla igual en la base `9e0c308` sin la feature (32,4 s): no es de la 0166.
- `sdd roadmap check` → válido; `sdd capability check` → 18 capacidades válidas.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-12 · suite completa en verde salvo `FastSuiteBudget`, rojo también en la base · smoke con ejecución real por sujetos headless (`k2` 2/2, `w1` 3/3 en lo que queda tras la enmienda, `a1` 1/1) · revisión final opus effort high sobre `7a4fa5a` (2 Important arreglados: uno con su test, otro por enmienda) y re-revisión limpia del tramo de la pasada de fix y la enmienda.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El hilo para con 🦆 y ✋ antes de commitear la guía de un REFACTOR que añade un AND | ejecución real (`k2` GREEN 2/2; RED 2/2 falla) | ✅ |
| `sdd-worktrees` detecta el worktree enlazado, lo dice con su rama y no crea otro | ejecución real (`w1` 3/3) | ✅ |
| `env:setup` tras las dependencias y el marcador en los encargos | ejecución real (`w1` 3/3, `.sdd-env.json` en `active`); el marcador en el encargo, por `implementer-prompt.md` | ✅ |
| La baseline ejecuta el gate de cierre; sin gate declarado, pregunta | ejecución real para `tech-stack.md` (`w1` 3/3); sin gate: no probado (lectura del Step 3) | ✅ / no probado |
| Si la baseline falla, informa y pregunta | no probado (texto de la fuente, conservado) | no probado |
| Ninguna skill invoca las dos de superpowers | suite (`ForkSkills.Tests.ps1`, `Skills.Tests.ps1`) | ✅ |
| Dos revisores en la misma respuesta, con `model` y `sdd-kit:effort-medium` | ejecución real (`a1` 1/1) | ✅ |
| Nunca más agentes que `control.maxParallelAgents`; tasks del plan no van en paralelo | no probado (lectura; ningún escenario pasa de dos agentes) | no probado |

### 4.3 Residuales / deuda generada

- Fila de deuda de los dos desvíos: parcial; el contraejemplo de «No entra» espera su 2.º ticket.
- La 0152 suma la contradicción de `mission.md` sobre las tasks en paralelo.
- Minors diferidos de la revisión final (ledger): la herencia de modelo en `sdd-parallel-agents`, rechazar el worktree en `main` frente a consentir implementar en `main`, la ambigüedad del inciso del REFACTOR, y `environments-template.md:8`.
- `capabilities/control-profiles.md` dice que el tope de agentes lo define la task 0022: queda desfasado, pendiente del dev-lead.
- `FastSuiteBudget` rojo en la base: el conjunto rápido del pre-commit pasa de 30 s en esta máquina.

## 5. Aprendizajes

- Un molde que deja una salida más fácil que el fallo medido no mide nada: el primer `k1` daba dos THEN contradictorios, y los sujetos pararon por la contradicción. La comprobación en seco veía que el molde llegaba al punto, no que hubiera otra salida antes → `tech-stack.md`, «Comprobación previa de cada escenario».
- Ni el freno de alcance «una decisión que cambia la salida observable» paró a los sujetos de `k2`, que lo nombraron y lo anotaron como ruling: el contraejemplo con el caso concreto, en el punto del desvío, sí (Art. II).
- Revisión de skills: se revisaron al hacerlas `sdd-worktrees`, `sdd-parallel-agents`, `sdd-implement` y `review-spec.md`; nada más que llevar a otra skill.

## 6. Adendas
