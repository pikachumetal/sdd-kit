---
id: 20261013-085540-feature-0175-restore-fork-pieces
feature: 0175
title: Walkthrough — Forks previos a la ADR 0013: sdd-implement y sdd-rubber-duck vuelven al texto de su fuente
spec: ./spec.md
status: done
created: 2026-10-13
---

# Walkthrough — Forks previos a la ADR 0013: `sdd-implement` y `sdd-rubber-duck` vuelven al texto de su fuente

## 1. Cambios realizados

- **`sdd-implement`** (`e7ddf25`): vuelve al texto de `executing-plans` y `subagent-driven-development` de superpowers 7.0.0 que la 0147 había resumido. Las cinco piezas de la fila: los grafos de «The Process» al principio de cada bucle, con los pasos del kit; los dos «Example Workflow» en una sección final, con los comandos `sdd`; el `REQUIRED SUB-SKILL` de `superpowers:verification-before-completion` en el contrato de cierre, que se invoca porque el kit no la ha copiado (Art. IX); y la racionalización «Reviews slow the loop down». Y lo que dio el diff: las reglas enteras que faltaban (responder las preguntas del implementador, no saltarse la revisión de task y exigir sus dos veredictos, no pasar de task con Critical o Important abiertos, no dar órdenes abiertas al revisor, no fingir un despacho sin herramienta de subagentes), los porqués con la evidencia de sesiones reales y las 21 filas de racionalizaciones con su texto. El texto propio del kit sigue en su sitio. «Rulings, not stalls» se acota a lo que resuelve un ruling, porque los frenos del kit paran.
- **Prompts de `references/`** (`e7ddf25`): las cuatro líneas que faltaban en `implementer-prompt.md` y las líneas «Purpose» y «returns» de los dos prompts de revisión.
- **`sdd-rubber-duck`** (`e7ddf25`): sección «Re-pitch: when your last message didn't land» con el texto de `wait-what`, con el disparo en la `description` («no te he entendido», «wait, what?») y el glosario de `PRODUCT.md` nombrado, como la fuente nombra `CONTEXT.md`; el ASD-STE100 vuelve a § Words, con el término técnico y su efecto como una sola idea también en frases cortas.
- **Topes, README y baterías** (`e7ddf25`): `sdd-implement` a 10.240 palabras en `SKILL.md` y 13.950 en total, `sdd-rubber-duck` a 600; el README pasa a 4 skills de superpowers invocadas; la batería de `sdd-rubber-duck` gana `w1` y la fila R10, y las dos baterías, su procedencia.
- **Pasada de fix de la revisión final** (`098fc96`): la línea de cierre del ledger la escribe `sdd task done` en su propia llamada, no en el mismo mensaje que el commit; los ejemplos abren con el aviso de fase y la línea `Workspace del plan`; la Task 2 del ejemplo Native comprueba la base y la copia del RED. Tres tests de frase en `ImplementSkill.Tests.ps1`, RED→GREEN.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 2,5–4 h
- Esfuerzo real: 1,2 h — reloj del hilo por las marcas de los commits, de la apertura (`02445d3`, 11:05) al cierre (~11:55), más ~0,3 h de diff y spec antes de la apertura; sin la espera a la aprobación ni a la pregunta de la ronda.
- Desviación: −1,3 h a −2,8 h (−52 % a −70 %)
- Causa de la desviación: devolver el texto de la fuente fue edición, no diseño, y cada tanda de sujetos tardó ~5–10 min en paralelo; la tanda de diagnóstico y las dos rondas de `w1` sumaron ~25 min.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 50.717.065 — claude-opus-5-5 50.717.065
- Tokens de subagentes: 3.174.759 en 1 despacho — Revisión final rama 0175 claude-opus-5-5 3.174.759 / 5 min
- Coste de la sesión: 19,54 $ (hilo 17,48 $ + subagentes 2,06 $)
- Coste de sujetos: 3,23 $ en 12 sujetos sonnet — humo `h1`, `h2`, `s1`, `w1`, `c1` 1,42 $ (5, `green/`); diagnóstico `h1` ×2 con el texto acotado, `s1` ×2 y `w1` ×1 con el kit de la base, y `w1` con el re-pitch que nombra `PRODUCT.md` 1,72 $ (6, `green-r1/` y `ab-base/`); ronda de `w1` 0,09 $ (1, `green-r2/`)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La previsión de prueba era de 5 sujetos y 3–7 $; fueron 12 sujetos y 3,23 $. La tanda de diagnóstico fue la «tanda más» que admite el Art. I, y la ronda de `w1` la eligió el dev-lead: «Una ronda más (Recomendada)».
- Entraron tres adaptaciones que la spec no preveía, con su fila «kit distinto» en el anexo: «rulings, not stalls» acotado y sin «a cap you would have asked to exceed» (humo `h1`); la línea de cierre del ledger, de `sdd task done`; y el primer mensaje de los ejemplos, con la línea del workspace (revisión final).
- Los topes quedaron por encima de la previsión de la spec (~8.000 y ~11.700): los grafos y los dos ejemplos miden ~2.000 palabras.

### Decisiones tomadas sin el dev-lead

- Pre-flight: Ruling: gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, el de la 0165, 0166 y 0173, porque ni `operations.md` ni `tech-stack.md` §Testing lo declaran — si es incorrecto, una ejecución más con el gate bueno
- Task 1: Ruling: la baseline corrió con las ediciones de la Task 1 ya en el árbol; los 6 rojos venían de la edición (dos frases que vigilan los tests, restauradas; la lista de superpowers y los dos topes, previstos), y el conjunto rápido sobre la apertura salió verde (1.114)
- Task 1: Ruling: `sdd task start` no encuentra «Task 1» en una spec lite — BASE = `02445d3`, la apertura; el brief es la spec — sin coste
- Task 1: Ruling: «Rulings, not stalls» acotado a lo que resuelve un ruling, y fuera «a cap you would have asked to exceed» — el kit trabaja distinto: el tercer arreglo y la salida observable son frenos que paran — si es incorrecto, una frase de la fuente adaptada de más
- Task 1: Ruling: una tanda de diagnóstico — `h1` ×2 con el texto acotado; `s1` ×2 y `w1` ×1 con el kit de la base, para saber si el R1 de `s1` y las palabras de `w1` venían de esta edición
- Task 1: Ruling: REFACTOR de `w1` (elemento omitido: el sujeto no abrió el glosario) — el re-pitch nombra la «Terminology» de `PRODUCT.md`, como `wait-what` nombra `CONTEXT.md`
- Task 1: Ruling: ronda de REFACTOR elegida por el dev-lead (fallo de forma, Art. II): la regla de palabras como contrato, «the term and its effect are one idea», también en frases cortas; `w1` ×1, sin más rondas
- Final: Ruling: Important 4 (faltaba en el ledger el resultado del último `w1`) — no era un fallo del código: el resultado existía en `green-r2/` y se registró — sin coste
- Final: Ruling: recomendación «relanzar `h2` hasta que despache» — `h2` paró en un freno de alcance legítimo, que es la conducta del kit; la fila S queda sin medir y va a deuda — si importa, el bucle SDD devuelto no tiene humo propio hasta la 0148
- Final: minor (deferred): `implementer-prompt.md` «Are names clear and accurate» quedó condensado en «Do names match…» (condensación de la 0147), sin fila en el anexo
- Final: minor (deferred): Models funde los ejemplos «(multi-file coordination, pattern matching, debugging)» y «not the session default» en las señales de complejidad, sin fila en el anexo
- Final: minor (deferred): «in Native, they chose it to spend less» — en el kit decide la línea `Ejecución`; mejor «it was chosen»
- Final: minor (deferred): «dispatch the reviewer on the most capable model» junto a «`opus`… the kit's ceiling» — más claro «the most capable model the kit allows (`opus`)»
- Final: minor (deferred): las tres filas nuevas de procedencia de la batería de `sdd-rubber-duck` van tras el párrafo «Recortadas», en una tabla sin cabecera (maquetación previa)

## 4. Verificación

### 4.1 Builds

- Suite completa (`no declarado` en `tech-stack.md`; el de la 0165, 0166 y 0173): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre `e7ddf25` → Pester 1.169/1.169, CLI 761/761, lentos 157/157, Node mínimo 918/918 · 3 min 36 s. Tras la pasada de fix, `moon run kit:test` sobre `098fc96` → Pester 1.172/1.172 · 3 min 54 s.
- Revisión final: `sdd-kit:effort-high` + opus sobre `e7ddf25`, «With fixes»: 0 Critical, 4 Important (3 arreglados RED→GREEN en `098fc96` y 1 registrado), 5 Minor diferidos. Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-13 · gate de cierre en verde · smoke con ejecución real por sujetos headless (`w1` con gate, R1, R2, R10 y el AND del glosario y de UTC; `h1` y `h2` en los dos bucles; `s1` y `c1` como control) · revisión final opus effort high sobre `e7ddf25` (3 Important arreglados en `098fc96`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `explaining`: «no te he entendido» → entra `sdd-rubber-duck` y lo vuelve a contar con contexto primero | ejecución real (`w1` 3/3 con el kit de la 0175: `green/`, `green-r1/`, `green-r2/`; con el de la base, entra `sdd-explore`) | ✅ |
| … con frases de 25 palabras como mucho, una idea cada una | ejecución real (`w1`, R10) | ✅ |
| … con el glosario, sin `toISOString()`, sin el nombre del test y sin «UTC» sin explicar en la misma frase | ejecución real (`w1` ronda 2: «escrita en UTC, que es un reloj dos horas por detrás del nuestro»; antes, en la frase siguiente y, sin `PRODUCT.md` nombrado, «evento» por «reserva») | ✅ |
| Bucle Native con el texto devuelto | ejecución real (`h1` 3/3 implementa y deja `Task <N>: complete`; con «rulings, not stalls» acotado, 2/2 conservan la salida sin motivo) | ✅ |
| Bucle SDD | ejecución real (`h2`: anuncia el workspace y para en el freno de la salida sin motivo; la fila S, sin medir) | no probado (S) |
| «No lo pillo» sigue en `sdd-explore` | ejecución real (`c1` 1/1) | ✅ |
| Topes y README | suite (`WordBudget.Tests.ps1`, `Skills.Tests.ps1`) | ✅ |

### 4.3 Residuales / deuda generada

- El 🦆 de `s1` mete el comando y la ruta del fichero: R1 falla 2 de 2 con el kit de la base y 1 de 1 con el de la 0175; en la 0145 y la 0160, 4 de 4 limpios. Es previo a esta feature (fila de deuda, «Actuar»).
- El bucle SDD devuelto no tiene humo que llegue a despachar: `h2` para, con razón, en el freno del molde (fila de deuda, «Actuar en la 0148»).
- Los cinco Minor de la revisión final (fila de deuda, «Actuar en la 0148»).
- La línea del workspace sale en `h1` 1 de 3 y en `h2` 1 de 1, y `h1` usó `git add -A` en 2 de 3: pruebas nuevas en sus filas de deuda, que ya existían.

## 5. Aprendizajes

- Devolver el texto de la fuente a un fork puede chocar con una parada del kit: «a running plan does not wait on a human» llevó a `h1` a decidir como ruling una salida observable que el kit para; el humo del bucle principal lo destapó → procedencia de la batería de `sdd-implement`. El método general ya lo pide el Art. I (humo en toda edición).
- Donde la fuente nombra un fichero, la adaptación nombra el del kit, no una sección de la skill: con «§ Words», `w1` no abrió el glosario; con `PRODUCT.md` en la frase, 2 de 2 → procedencia de la batería de `sdd-rubber-duck`; confirma la regla de `architecture.md` («un fichero que el agente debe leer se nombra en la skill que lo lee»), sin texto nuevo, porque el documento está en su tope.
- Revisión de skills: se miró `.claude/skills/` (`skill-creator`, `writing-for-agents`, `writing-skills`); nada que llevar: la regla de los forks vive en la ADR 0013 y en el Art. IX.

## 6. Adendas
