---
id: 20261101-175350-feature-0279-drop-superpowers-dependency
feature: 0279
title: Walkthrough — Retirar la dependencia de superpowers del plugin
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Retirar la dependencia de superpowers del plugin

## 1. Cambios realizados

- **Manifests, init y README** (`cd2d3ab8`): `plugin.json` sin `dependencies`, `marketplace.json` sin `allowCrossMarketplaceDependenciesOn`, `INIT_SETTINGS` y el bloque del README sin superpowers, y `sdd-init` paso 7 sin `marketplace add`.
- **Lanzador** (`cd2d3ab8`): `--setting-sources ""` incondicional y `SUPERPOWERS_DIR` opcional. Sale la guarda de `dependencies`.
- **Textos** (`e494adf8`): `sdd-propose` y `sdd-feedback`, la plantilla del ticket sin `superpowers_version`, las baterías, `tech-stack.md`, la constitution (Art. V y IX), la guía de uso y `CLAUDE.md`.
- **Migración** (`daed8c8c`): paso 10 de `v3.0.0.md`, con su pregunta y su informe literales; escenarios `s1` a `s3` de la batería de `sdd-upgrade`, y evidencia en `tests/drop-superpowers-*.md`.
- **Cierre**: pasada de la revisión final (`sdd-upgrade` nombra la revisión de reglas por su función, `s4` y `r1`), delta fusionado y registros.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 1,02 h — reloj de la sesión 1,92 h desde 2026-11-01T17:50Z, sin 54 min de espera al dev-lead (1 espera)
- Desviación: -0,48 h (-32 %)
- Causa de la desviación: la estimación contaba 9 sujetos largos; el molde `salas3` los dejó en ~0,2 $ y pocos minutos cada uno (`tests/drop-superpowers-green.md`).
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 19.496.621 — claude-opus-5-5 19.496.621
- Tokens de subagentes: 5.893.720 en 5 despachos — Revisar la spec de la 0279 claude-opus-5-5 185.034 / 2 min; Eje Spec de la 0279 claude-opus-5-5 1.224.723 / 5 min; Eje Arquitectura de la 0279 claude-opus-5-5 1.382.548 / 3 min; Eje Código de la 0279 claude-sonnet-5-5 2.129.258 / 3 min; Re-revisión final de la 0279 claude-opus-5-5 972.157 / 5 min
- Coste de la sesión: 16,70 $ (hilo 9,86 $ + subagentes 6,84 $)
- Coste de sujetos: 4,29 $ en 21 sujetos sonnet — RED 0,19 $; GREEN y controles 2,49 $; pasada de la revisión final 1,61 $
- Review de spec: 1 revisor (dominio y técnica) · hallazgos 10, aceptados 10

## 3. Desviaciones del plan

- Se añade el molde `salas3`, además del `v2x-superpowers` que pedía el plan: mide las ramas del paso 10 por ~0,2 $ el sujeto.
- La «Verificación» de la Task 2 esperaba `SUPERPOWERS_DIR` en `using-sdd`; quedan `sdd-implement` y `sdd-verify`, opcionales.

### Decisiones tomadas sin el dev-lead

- Saldo de `sdd-upgrade`: el paso 10 suma 172 palabras a la migración — lo aprueban la decisión 14 y los topes de la spec; `SKILL.md` baja de 964 a 961 — coste si está mal: recortar la migración.
- Guarda de `dependencies` retirada, contra el criterio del eje Código — decisión 3 aprobada — coste si está mal: gastar sujetos en un A/B con un kit viejo.
- Molde `salas3` además del `v2x` — más barato, y `s4` cubre el pedido — sin coste.
- Se quitan del paso 10 las cláusulas de JSON roto y sin fichero, y el Review Focus queda superado: el paso 7 falla o crea el fichero antes — sin coste: el paso 7 no toca el fichero.
- Paso 7 de `sdd-init` sin sujeto que lo alcance: `n1` para antes — solo quita texto, y lo cubren `settings`, `readme` y la paridad — coste si está mal: bajo.
- `r1`: ofrecer aparte quitar superpowers, sin escribir, no falla; meterlo en la pregunta de la tabla, sí. Se cambió la fila R1 de la batería tras verlo en 3 de 3 sujetos — coste si está mal: un proyecto que dijo «no» recibe un aviso más.
- MCP de Playwright en `tech-stack.md`: marcado «sin comprobar», sin gastar un sujeto — coste si está mal: una campaña con Playwright lo descubre al lanzar.
- Las 20 skills del smoke frente a las 21 de `skills/`: `sdd-templates` lleva `user-invocable: false` — sin coste.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 293/293 · cli:typecheck: corrió, sin errores · cli:test: corrió 1763/1774, 11 saltados · 118 s · configuración: la del gate · sobre el commit de cierre, antes de juntar la pasada
- `npx vitest run --test-timeout 120000 test/kit/manifests.slow.test.ts` → 4/4, con `claude plugin validate`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · gate verde · smoke real del hook con kit y control sin plugin · 21 sujetos con 1 fila R1 que cambió y 1 literal parafraseado · revisión final Spec, Código y Arquitectura sobre `daed8c8c`, con arreglos · re-revisión: 12 abordados, 5 Minor corregidos en el cierre, revisado en el hilo

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `routing`: carga, inyecta sin avisos y entra por `sdd-propose` | ejecución real | `green/smoke/summary.txt`; `green/out/f1-1`. La frase exacta del THEN no se lanzó |
| `routing`: el hook del proyecto no avisa | ejecución real | Smoke; el control sin plugin sí avisa |
| `onboarding`: bloque sin superpowers, `.gitignore`, memoria y hook | suite | `settings.test.ts`, `readme.test.ts`, `verbs.test.ts` |
| `onboarding`: sin `marketplace add` | suite | Texto retirado; `n1` no llega al paso |
| `cli`: bloque igual al README y fusión por hoja | suite | `settings.test.ts`, `readme.test.ts` |
| `kit-feedback`: cabecera sin superpowers y dato comprobado | ejecución real | `green/out/fb1-1/ticket.md`: `kit_version: 3.0.0`, no el 2.4.0 de las notas |
| `migration`: pregunta literal y espera | ejecución real | `s1`, `s2`, `s3`, `s4` |
| `migration`: el «sí» quita, con su commit | ejecución real | `s1`, `s4` |
| `migration`: el «no» conserva | ejecución real | `s2`: `settings.json` intacto |
| `migration`: informe literal del «no» | ejecución real | **Parcial**: literal en 1 de 3; en 2 sale parafraseado, con las claves correctas |
| `migration`: marketplace compartido | ejecución real | `s3` |
| `migration`: otro plugin en `false`, sin claves | no probado | Regla de texto |
| `migration`: no toca `~/.claude` | no probado | El sujeto lo declara; el molde no lo observa |
| `migration`: paridad con la exención | suite | `migration-init-parity.test.ts` |

### 4.3 Residuales / deuda generada

- El informe del «no» no sale literal en 2 de 3 sujetos: va al ticket; un caso.
- `f2` y `f3` con `SUPERPOWERS_DIR` antes de cortar release: `STEPS=sdd-propose` lanza 10 escenarios, no 2 (~2 $).

## 5. Aprendizajes

- El lanzador mezclaba aislar y cargar superpowers en una variable → `tech-stack.md`, «Un sujeto de enrutado…».
- Un molde ya en la estructura de destino baja un sujeto de migración de ~1,5 $ a ~0,2 $ → `tests/batteries/sdd-upgrade/battery.md`, párrafo «Molde».
- Una línea suelta dentro del delta acaba en la capacidad al fusionar → ticket.

## 6. Adendas

