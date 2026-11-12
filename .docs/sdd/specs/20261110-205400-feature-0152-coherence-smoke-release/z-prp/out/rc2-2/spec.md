---
id: 20261012-090000-feature-0031-close-notice-row
feature: 0031
title: El aviso de cierre nombra la fila que queda abierta
mode: full
profile: delegate
status: draft
created: 2026-10-12
author: agente con el dev-lead
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre nombra la fila que queda abierta

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `close-notice` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~15 líneas en 2 ficheros más la capacidad nueva al archivar (sin contrato público ni `MODIFIED`)
- Dominio (sonnet): si el THEN de «El aviso nombra la fila abierta» y la fila `C1-A` se contradicen, y si «la fila abierta» está definida cuando el roadmap tiene varias (señal: capacidad nueva)
- Mínimo razonable: el mismo revisor — no deja nada sin cubrir

1. Capacidad nueva `close-notice` (corregido en la pasada de coherencia: el slug va en inglés, `aviso-cierre` era el nombre de la skill, en castellano).
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Enfoque: una frase en el paso 1 (ver Approach).
4. «Fila abierta» = la única fila abierta del roadmap del escenario: el sujeto de `c1` trabaja con un roadmap de prueba que tiene una sola abierta, la 0011. El roadmap real de hoy tiene tres (0010, 0011, 0008); qué nombrar con varias abiertas, o con ninguna, no entra en esta feature y el comportamiento queda sin definir.
5. La fila `C1-A` de la batería dice `text: /pendiente/` como «Falla si»: tal cual, falla con el texto que el THEN espera. Entra en el Scope corregirla antes del RED: la fila falla si el aviso no contiene «queda pendiente la 0011 — Anular reservas de otros»; la sintaxis exacta de la rúbrica queda `sin medir` hasta la Task 1. El RED con la skill de hoy es el control de la fila corregida: debe fallar.
6. Formato literal del aviso: «queda pendiente la <id> — <título>» (minúscula, separador «—»), y la frase del paso 1 de «Lo que se retira o cambia de forma».
7. Coherencia: `git grep -n "0031"` sin resultados (no hay fila 0031 en el roadmap, así que no implementa ninguna); `git grep` de «Di qué se cierra» y de `aviso-cierre` fuera de las carpetas de evidencia: un solo hit de la frase (el paso 1) y los demás son el nombre de la skill y la batería; previsión de coste comprobada con `scripts/plan.mjs`: 1.40 $ por tanda, 2.80 $ en total; delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «aviso-cierre.md: añadido «El aviso nombra la fila abierta»» con el slug anterior, y con `close-notice` → «close-notice.md: añadido «El aviso nombra la fila abierta»».
8. Reglas de la capacidad: datos nuevos, nombres, límites, avisos y conflicto: no aplica — el aviso solo repite el id y el título que ya tiene la fila; título vacío o largo queda fuera.
9. Minutos de la previsión: supuesto mío, ~3 min por sujeto (un sujeto cierra una feature entera) → 6 min por tanda, 12 min en total; `operations.md` no da tiempo por sujeto, corrígelo si lo conoces.
10. El id 0031 viene de la rama `feature/0031-…` y no hay fila en el roadmap: no se añade ninguna (no entra).
11. Con varias filas abiertas o ninguna el comportamiento queda sin definir y el riesgo se acepta: la skill se publica así hasta una feature propia. Un título con «—» o comillas también queda fuera.
12. El escenario `c1` de la batería no define hoy su roadmap de prueba (la batería solo tiene la tabla y la rúbrica): se escribe en `battery.md` en la Task 1, con una sola fila abierta, la 0011. Si el RED pasa con la skill de hoy, no hay comportamiento que probar: se para y se enmienda la spec.

13. Política de modelos: un revisor de la spec en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — el GIVEN no fija de dónde sale el título → el GIVEN nombra «0011 — Anular reservas de otros» en un roadmap de prueba.
- **Aceptado** — `C1-A` pasa sin el comportamiento y su condición no está fijada → decisión 5 fija la condición («0011» y el título) y el RED es el control.
- **Rechazado** — segundo escenario con otra fila y fila de control → el texto de la skill no lleva «0011» literal, así que la cadena solo puede salir del roadmap; el RED con la skill de hoy ya hace de control.
- **Aceptado** — sin fila abierta / varias abiertas sin definir → Scope y decisión 4 lo declaran fuera, sin definir.
- **Aceptado** — «fila abierta» circular → decisión 4 la define sobre el roadmap de prueba con una sola abierta.
- **Aceptado** — el Intent promete elegir la correcta → el Intent pasa a «nombra la fila abierta».
- **Aceptado** — formato y frase fuera del ✋ → decisión 6.
- **Aceptado** — Scope sin la capacidad → Scope la lista al archivar; el merge ya está rehecho con `close-notice`.
- **Aceptado** — ficheros mal contados → el tamaño dice 2 ficheros más la capacidad.
- **Aceptado** — faltan minutos → decisión 9.
- **Aceptado (ronda 2)** — faltan minutos → decisión 9, supuesto declarado.
- **Aceptado (ronda 2)** — `C1-A` más débil que el THEN → exige la frase completa (decisión 5).
- **Aceptado (ronda 2)** — varias o ninguna abiertas → decisión 11, riesgo aceptado a la vista.
- **Aceptado (ronda 2)** — roadmap de prueba sin ubicar → decisión 12 y Scope.
- **Aceptado (ronda 2)** — el RED podría pasar sin el paso nuevo → decisión 12: si pasa, se para.
- **Aceptado (ronda 2)** — orden de las decisiones y separador en el título → reordenado; decisión 11.
- **Rechazado (ronda 2)** — origen del id 0031 → decisión 10 lo aclara, sin fila que añadir; `PRODUCT.md` está en la raíz y el ejemplo es del propio roadmap.
- **Rechazado** — falta `PRODUCT.md` → existe en la raíz del repo; las cinco reglas van en la decisión 8.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: con la 0011 como única fila abierta, el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- Entra: la fila `C1-A` de `tests/batteries/aviso-cierre/battery.md` exige la frase completa «queda pendiente la 0011 — Anular reservas de otros», no solo la palabra «pendiente».
- Entra: el roadmap de prueba de `c1` en la misma `battery.md`.
- Entra: al archivar, se crea `capabilities/close-notice.md` con el delta.
- No entra: el roadmap; elegir qué fila nombrar cuando hay varias abiertas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `close-notice`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre y un roadmap de prueba cuya única fila abierta es «0011 — Anular reservas de otros»
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 4 sujetos · ~12 min (supuesto, decisión 9) | 2,80 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
