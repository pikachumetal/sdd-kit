---
id: 20261008-193241-feature-0146-propose-spec-and-plan
feature: 0146
title: Walkthrough — Spec y plan de propose
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-09
---

# Walkthrough — Spec y plan de propose

## 1. Cambios realizados

- **Reparto** (`4ea38478`): la 0146 se partió al arrancar en tres features en cadena —0146 (spec y plan de propose), 0160 (entrada única con cinco carriles y spike) y 0161 (explore y prompt de arranque)— con su enmienda en la propuesta 0131; la 0147 pasa a ir tras la 0161.
- **Batería y RED** (`5fd09615`): batería nueva de humo de `sdd-start-feature` (`tests/batteries/sdd-start-feature/`, molde `reservas` con glosario y siete escenarios situados en su paso: spec, gate, review, plan, update y validación manual y en campo); `t1` en la batería de `sdd-grilling` y `l2` en la de `sdd-rubber-duck`.
- **Enmienda por el RED** (`024ae2d6`): salen tres reglas cuyo RED pasó sin ellas: el contraste de lenguaje de `sdd-grilling`, la lista de la explicación larga en el idioma del usuario (recuperada después) y la verificación del plan desde «Dónde se prueba», con la parte de la 0097.
- **La spec abre con 🦆 y ✋** (`f5b0d1c7`): `spec-template.md` gana el párrafo 🦆, el bloque «✋ Decisiones que he tomado yo» exhaustivo (cada texto con su literal) y las secciones «Dónde se prueba» y «Términos y ADR»; el paso 4 presenta primero el 🦆 y el ✋; `review-spec.md` y `CapabilityRules.Tests.ps1` usan el nombre nuevo.
- **Gate con opciones fijas y modelo del revisor de dominio** (`bcac584a`): la pregunta del gate de la spec es `AskUserQuestion` con «Apruebo (Recomendada)» y «Cambios» (y, en `delegate` con el modelo más capaz, la de parar antes de la Task 1); la pregunta de review lleva el modelo del revisor de dominio con recomendación. Salda la fila de deuda del gate en `delegate`.
- **`Tras` en el plan** (`7f987c29`): cada task de `plan-template.md` declara la que la bloquea, y el plan dice que se ejecutan en orden, sin paralelo.
- **Acción update** (`e7c502c9`): un cambio a la spec aprobada para con 🦆 y ✋, se corrige en su sitio con su línea en «Enmiendas»; lo que toca una task cerrada va a una task nueva sin reabrirla, y lo que solo cambia la task en curso sigue en ella. Tope total de `sdd-start-feature` a 20.600.
- **Validación con 🦆 y ✋** (`9e241b37`): la presentación de la validación, y con `validation.mode: field` el mensaje que invoca el cierre y el mensaje final de `sdd-end-feature`, abren con el 🦆 y «✋ Me salí del plan en…».
- **`sdd-rubber-duck`** (`b3ca088e`): lo pendiente tras el 🦆 como afirmación desnuda; la lista de la explicación larga en el idioma del usuario; una pregunta en inglés se contesta en inglés aunque los documentos estén en castellano.
- **Plan** (`22cd1982`): Restricciones y Review Focus sin lo que sacó el RED.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 7h
- Esfuerzo real: ~5,75h — reloj del hilo aproximado con las marcas de los commits: del commit de apertura (2026-10-08 21:46) a medianoche, ~2,5 h, y el 2026-10-09 de ~08:15 a ~11:30, ~3,25 h, sin contar la noche. Spec y plan: ~1,5 h más (19:30-21:46).
- Desviación: -1,25h (-18 %)
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 153.418.589 — claude-opus-5-5 153.418.589
- Tokens de subagentes: 5.220.777 en 3 despachos — Revisión spec 0146 dominio claude-opus-5-5 478.109 / 2 min; Revisión spec 0146 técnica claude-sonnet-5-5 594.689 / 1 min; Revisión final 0146 b3ca088e claude-opus-5-5 4.147.979 / 6 min
- Coste de la sesión: 49,52 $ (hilo 45,88 $ + subagentes 3,64 $)
- Coste de sujetos: ~28 $ en ~78 sujetos Sonnet (8 en Opus) — RED ~10 $; GREEN y REFACTOR ~18 $ (estimado con los logs de `run.sh`; las salidas de cada etiqueta se sobrescriben entre rondas). Techo aprobado: 46 $.
- Review de spec: 2 revisores (dominio Opus, técnica Sonnet) · hallazgos 20, aceptados 19

## 3. Desviaciones del plan

- **Task 7 (contraste de lenguaje de `sdd-grilling`)**: no se ejecutó; su RED pasó 2/2 sin la regla (enmienda aprobada del 2026-10-08).
- **Task 4**: la «Verificación» desde «Dónde se prueba» salió por el RED (P2 2/2 limpio); la task quedó en `Tras` y «sin paralelo».
- **Task 5**: la regla afinada —task nueva solo si la enmienda toca una task cerrada— por enmienda aprobada del 2026-10-09; la regla subió al paso 6 porque en `control-profiles.md` nadie la abría.
- **Task 6**: la forma también va al mensaje final de `sdd-end-feature`, fichero que el plan no listaba.
- **Task 8**: recupera la lista en el idioma del usuario (enmienda aprobada del 2026-10-09) y aclara el idioma del Overview.

### Decisiones tomadas sin el dev-lead

Los rulings de la ejecución, con su coste si están mal, están en `tasks.md`, sección «Rulings». Los que más pesan:

- `AskUserQuestion` no existe en `claude -p`: G1 y R1 puntúan el intento de llamarla o las opciones literales — si está mal, G1 deja pasar un gate en prosa bien escrito.
- Moldes corregidos entre RED y GREEN: la spec de p1 sin «quién canceló» y los rulings de v1 coherentes con el historial — si está mal, RED y GREEN de esos escenarios no comparten molde exacto.
- La lista de frenos de alcance del paso 6, repuesta en forma corta, y «Trabajo descubierto fuera de scope» resumido para caber en el tope — si está mal, esa sección remite al paso 6 en vez de repetirlo.
- s2 de `sdd-rubber-duck` queda 3 de 6 (RED 0/2): la regla se queda y su medida limpia va a deuda — si está mal, el pato aún puede listar opciones que la parada vuelve a preguntar.

## 4. Verificación

### 4.1 Builds

- Suite completa tras la pasada de fix: `pwsh -NoProfile -Command "Invoke-Pester tests -CI"` → 1010 pasados, 0 fallos, 14 omitidos · 174 s; `npx vitest run` en `cli/` → 870 pasados en 38 ficheros · 85 s. Total ~4,4 min.
- `sdd capability check --artifact spec.md` → 18 capacidades válidas; `sdd roadmap check` → válido.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-09 · suite 1010/1010 Pester y 870/870 CLI · smoke 11/12 THEN con ejecución real de sujetos headless (`tests/sdd-start-feature-0146-green.md`), 1 no probado · revisión final opus con arreglos sobre b3ca088e y pasada de fix 079a0698 (5 hallazgos)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La spec abre con 🦆 y ✋, con «Términos y ADR» | ejecución real (s1) | 2/2 |
| La spec dice dónde se prueba | ejecución real (s1) | 2/2 |
| `Tras` y «sin paralelo» en el plan | ejecución real (p1) | `Tras` 2/2; «sin paralelo» 1/1 aplicable (rúbrica enmendada; 1/2 con la original) |
| La pregunta del gate lleva opciones fijas | ejecución real (g1, Opus) | 2/2 (rúbrica enmendada; 1/2 con la original) |
| En `delegate`, la opción de bajar de modelo | ejecución real (g1) | 2/2 |
| La pregunta de review lleva el modelo de dominio | ejecución real (r1) | 2/2 |
| El revisor se despacha con el modelo elegido | no probado | se mide la pregunta, no el despacho |
| La validación abre con 🦆 y ✋ (manual y en campo) | ejecución real (v1a, v1b) | 2/2 y 2/2 |
| Un cambio a la spec aprobada usa la acción update | ejecución real (u1, u2) | u1 2/2; u2 task nueva 2/2, nota en la cerrada 0/2 |
| Salir del plan es un ruling visible con ✋ | ejecución real (v1a) | 2/2 |
| Lo pendiente tras el 🦆, como afirmación | ejecución real (s2) | 3 de 6 en tres rondas (RED 0/2) |
| La lista de la explicación larga, en el idioma del usuario | ejecución real (l2) | 2/2 |

### 4.3 Residuales / deuda generada

- **El escenario s2 de `sdd-rubber-duck` mezcla la parada y el pato** → fila de deuda del roadmap, a actuar en la 0160.
- La parte de propose de la 0097 vuelve a su fila: el RED mostró que el plan ya verifica por superficie.
- El tercer ajuste de `sdd-rubber-duck` (el escenario c2 frente a «¿cómo funciona…?») va a la 0161.

## 5. Aprendizajes

- **Un RED limpio con n=2 puede ser suerte**: `l2` salió 2/2 limpio y, repetido con el mismo kit, 0/2. Antes de sacar una regla por un baseline limpio, se repite el baseline cuando la conducta depende del idioma o del tono de la respuesta. → `tech-stack.md`, «Baterías por skill».
- **Una regla que solo vive en una referencia no se lee**: en u1, ninguno de los sujetos abrió `control-profiles.md`; la regla funcionó al subir una frase al paso que la dispara. → `tech-stack.md`, «Baterías por skill».
- **En `claude -p` no existe `AskUserQuestion`**: un escenario que mide un diálogo de opciones puntúa el intento (la búsqueda con `ToolSearch`) o las opciones literales. → `tech-stack.md`, «Baterías por skill».
- **`grep` con un emoji puede no casar en Git Bash**: el primer veredicto de v1b salió falso; la puntuación con emoji se hace con una lectura UTF-8 (Python o Node). → `tech-stack.md`, «Baterías por skill».

- **Revisión de skills**: las skills que la feature toca son su objeto; lo aprendido sobre su prueba va a `tech-stack.md`. Ninguna otra skill cambia por esta feature.

## 6. Adendas
