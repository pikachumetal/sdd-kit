---
id: 20261102-210125-feature-0289-upstream-review
feature: 0289
title: Revisar las fuentes de upstream antes del corte de la 3.0.0
mode: full
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — Revisar las fuentes de upstream antes del corte de la 3.0.0

🦆 Hoy el aviso de fuentes sale en rojo: las cinco fuentes de las que el kit copia texto o toma ideas tienen versión nueva, y la release no se corta así. Esta feature lee lo que cambió en cada una por los ficheros que el kit usa y deja escrita la decisión de cada cambio: se queda como está, no aplica o es candidata. Las candidatas son tres, y el dev-lead decide cada una: por ejemplo, «las skills de más de 20.000 caracteres se cortan tras compactar» (C1). Después se suben las versiones vistas en `THIRD_PARTY_NOTICES.md`, `moon run kit:upstream` sale «Fuentes al día: 7.» y las candidatas aceptadas se abren como filas.

Validación: agente — el resultado es un documento y un comando en verde que el agente mide; el uso real lo da el campo (`validation.mode: field`).

## Capacidades

- Ninguna, porque docs y herramientas del repo: la feature escribe una revisión y cambia la tabla de versiones vistas que lee `tests/upstream/check.ts`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (sin capacidad, sin delta, sin contrato, sin datos, sin dependencia; los ficheros que toca los he leído en esta sesión) · tamaño: ~10 líneas en 1 fichero, más la revisión. Repaso de coherencia hecho; `sdd capability merge` sobre una copia de `.docs/sdd`: «Sin delta que fusionar».

1. **La revisión se escribe antes del gate**, no en el plan: el dev-lead decide las candidatas en la aprobación de la spec, que es la única parada de `delegate`. Sin eso, decidirlas sería una parada más a media feature.
2. **Spec Kit sube a `v1.2.6`**, no a la `v1.2.5` del prompt: `moon run kit:upstream` del 2026-11-02 ya da `v1.2.6`. Revisado hasta ahí.
3. **Las versiones de los forks no cambian** en sus `NOTICE` ni en los avisos de `THIRD_PARTY_NOTICES.md`: no se trae texto. Solo cambia «Versión vista» y «Fecha» (2026-11-02) de las cinco filas de «Fuentes vigiladas».
4. **Recomendación por candidata** (detalle en [upstream-review.md](upstream-review.md)):
   - **C1 — Skills de más de 20.000 caracteres tras una compactación** (superpowers 7.0.1, #2481). Cinco `SKILL.md` del kit pasan del tope; `sdd-implement` lo triplica (61.562). El corte sale de las notas de superpowers, sin comprobar en Claude Code. Recomiendo **abrir fila en la 3.1**, con un primer paso de medir: comprobar el corte en Claude Code y, si se confirma, un test de tamaño y mover secciones a `references/`, que se leen en el paso que las usa. Coste: medir ~1 h; partir `sdd-implement` y las otras cuatro, M–L con RED/GREEN por skill. No en la 3.0.0: sin fallo medido en el kit, y el kit ya cuenta con que la sesión compactada no relee la skill (cabecera del plan y ledger, task 0057).
   - **C2 — `sdd-verify`: un `REMOVED` se busca por el comportamiento del requisito vigente, no por su título** (OpenSpec 1.14.2 y 1.15.0, fork de `openspec-verify-change`). Recomiendo **descartar sin fila**: sin un caso nuestro de un `REMOVED` que pasara la revisión, y la revisión lo deja escrito para traerlo si aparece. Coste si se trae: S, dos líneas en `spec-reviewer-prompt.md` con su RED.
   - **C3 — `brainstorming`: «Lay out the approaches» en un mensaje propio, sustituyendo a «Think wide privately»** (superpowers 7.0.1). Recomiendo **descartar**: `sdd-grilling` ya enseña las alternativas de cada decisión de diseño con su coste y la recomendada, y no hay fallo nuestro de alternativas sin enseñar. Coste si se trae: S–M, RED/GREEN de `sdd-grilling`.
5. **La fila de deuda «`sdd-grilling`: la pregunta como frase interrogativa con su porqué» no cambia**: superpowers 7.0.1 trae la misma idea, pero es otra fuente, no el caso de campo que la fila espera.
6. Las aceptadas se abren con `sdd-roadmap`; las de la 3.0.0, antes de la 0284 y la 0198.
- Política de modelos: sin revisores de la spec · revisión final: la que pida `sdd-verify` al cerrar (Spec opus+high, Código sonnet+high) · sin despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Fuera de alcance implementar lo que se traiga, cambiar qué fuentes se vigilan o cómo, y rehacer los forks; sin sujetos — prompt de arranque, 2026-11-02.
- Una novedad sin fallo detrás de nosotros se recomienda descartar o dejar para la 3.1 — prompt de arranque, 2026-11-02: «la release está en su tramo final».
- C1, skills de más de 20.000 caracteres tras compactar: fila en la 3.0.0, antes de la 0284 y la 0198 — opción «Fila en la 3.0.0», 2026-11-02 (recomendaba la 3.1).
- C2, `sdd-verify` busca un `REMOVED` por el comportamiento de su requisito vigente: fila en la 3.0.0, antes de la 0284 y la 0198 — opción «Fila en la 3.0.0», 2026-11-02 (recomendaba descartar).
- C3, «Lay out the approaches» en `sdd-grilling`: se descarta — opción «Descartar», 2026-11-02.

## Intent

`moon run kit:upstream` falla con versión nueva en las cinco fuentes, y la regla 5 de `CLAUDE.md` hace de esa revisión parte de preparar la release (Art. V). Éxito: el comando sale en verde, la revisión da un veredicto por cambio relevante de cada fuente y nombra lo que no se leyó, y cada candidata tiene la decisión del dev-lead, con las aceptadas abiertas como filas. Fracaso aunque el comando salga en verde: subir las versiones vistas sin haber leído los ficheros que el kit usa.

## Scope

- Entra: `upstream-review.md` en esta carpeta; las cinco filas de «Fuentes vigiladas» de `THIRD_PARTY_NOTICES.md`; las filas de las candidatas aceptadas, con `sdd-roadmap`.
- No entra: implementar lo que se traiga, salvo una errata de una línea en un fork (no hay ninguna); tocar reglas de skills; cambiar qué fuentes se vigilan o cómo (`tests/upstream/check.ts`, `moon.yml`); rehacer los forks.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: solo cambian cinco valores de «Versión vista» y «Fecha» | `THIRD_PARTY_NOTICES.md`, tabla «Fuentes vigiladas» | Scope |

- Filas que implementa: 0289 → la fila del roadmap; su estado lo cambia el cierre.

## Approach

Leer cada diff por los ficheros que el kit usa, con la procedencia de la 0181 como mapa, y comparar cada cambio con la pieza del kit que le corresponde. Cuando un `SKILL.md` se parte en `references/`, comparar las líneas del viejo con el nuevo más sus referencias, para separar texto movido de reglas nuevas.

## Dónde se prueba

- Versiones vistas al día: `moon run kit:upstream` sale con código 0 y «Fuentes al día: 7.».
- La tabla sigue siendo legible para `check.ts`: la misma ejecución (si no la lee, imprime «Sin la tabla de «Fuentes vigiladas»»).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
