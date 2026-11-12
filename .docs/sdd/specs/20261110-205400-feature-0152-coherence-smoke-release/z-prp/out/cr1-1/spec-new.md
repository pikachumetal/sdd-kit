---
id: 20261112-160440-feature-0028-aviso-pendiente
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso dice solo qué se cierra: al cerrar la 0005, la persona no supo que seguía abierta otra fila del roadmap, y el dev-lead tuvo que parar a preguntarlo. Con este cambio, el paso 1 de `aviso-cierre` dice además qué queda pendiente: «Cierro la 0005. Siguen abiertas: 0010 Motivo al cancelar, 0011 Anular reservas de otros, 0008 Avisos por correo antes de la reserva». Se cambia una línea de una skill y se prueba con sujetos antes y después (RED y GREEN); el RED aún no se ha medido.

Validación: dev-lead — el fallo del ticket es que una persona no se enteró de algo al leer el aviso; lo que ella lee en el aviso de un sujeto no lo mide un test.

## Capacidades

- Ninguna, porque docs (el texto de una skill del kit; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (siete puntos) — señales: ninguna de la rúbrica (sin capacidad, contrato público, `MODIFIED` ni datos) · tamaño: ~3 líneas en 1 fichero
- Único (sonnet): si lo que entra («qué queda pendiente») tiene su prueba en «Dónde se prueba» y si «pendiente» está definido sin huecos (señal: ninguna; tamaño pequeño)
- Mínimo razonable (no elegido: despacho el revisor de arriba): sin review — deja sin mirar si la definición de «pendiente» (decisión 1) sirve a un sujeto que cierra con filas de dos tablas del roadmap

1. «Pendiente» = las filas de la tabla `Now` de `ROADMAP.md` cuyo Estado no es ✅ ni 🧪, sin contar la fila que se cierra, con su id y su título; las de `Next` y `Later` no cuentan (son planificación, no trabajo abierto); sin ninguna, el aviso lo dice con cualquier formulación equivalente a «no queda nada abierto» — el ticket dice solo «una fila abierta».
2. Texto del paso 1 de `skills/aviso-cierre/SKILL.md`: «1. Di qué se cierra y qué queda pendiente: las filas de `Now` en el roadmap cuyo Estado no es ✅ ni 🧪, sin la que cierras, cada una con su id y su título (el texto en negrita de la celda Tarea); si no queda ninguna, dilo.» — el literal lo propongo yo; el paso 2 («Corre el gate.») no cambia.
3. Enfoque: A, frente a B y C (ver Approach).
4. Previsión de coste: 14 sujetos, 9,80 $ en total (tabla de «Previsión de coste»), declarada antes del primer sujeto (art. 5): si la prueba la supera, una tanda de REFACTOR incluida, se para y decide el dev-lead. «Controles» va a cero. La medición tras la revisión final (2 sujetos, 1,40 $) cuenta para el tope; el coste de los revisores de la spec no. **Pido al dev-lead que dé una estimación de minutos o exima expresamente ese requisito del art. 5**: `plan.mjs` no los da y no los invento; hasta entonces van `sin medir`.
5. Validación `dev-lead`, no `agente` — en duda, la persona.
6. Sin medir: el RED no se ha medido, y no he leído qué dejan abierto los escenarios `c1` y `c2` (la batería solo tiene su tabla). Salida: si no hay un caso (a) en ninguno de los dos, o los casos (b), (c) o (d) no los produce ninguno (solo se miden los que existen), o si ninguno cierra con una fila abierta de `Now`, o el RED no falla, no se edita la skill y decide el dev-lead entre ampliar la batería (cambio de Scope, con su coste) o abandonar la spec.
7. Sin tabla de «Topes de palabras»: el proyecto no tiene ningún test que ponga tope a las palabras de una skill (`git grep` en `test/` y `scripts/`: sin resultados).
8. Gate de cierre: `node --test && node scripts/lint.mjs` sigue en verde (`src/` no cambia) y se corre al cerrar.
9. La 0028 no tiene fila en `ROADMAP.md` (su id sale del contador local) y la rama `feature/0028-close-notice-pending` y la carpeta (`aviso-pendiente`) difieren en el slug; no renombro la rama sin que lo pidas.
10. Delta sobre copia de `.docs/sdd`: no aplica, la spec no lleva delta.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de `aviso-cierre` en sonnet, por tandas (`operations.md`) · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** (Crítico) — la batería no mide «pendiente» y c1/c2 no se han leído → decisión 6 con salida explícita: sin fila abierta o sin fallo en el RED, no se edita y decide el dev-lead.
- **Rechazado** (Crítico) — sin escenarios GIVEN/WHEN/THEN → no hay capacidad ni delta donde fusionarlos (`capabilities/` no existe); los tres casos con datos van a «Dónde se prueba».
- **Aceptado** — la fila que se cierra cuenta como pendiente → excluida en decisión 1 y en el literal.
- **Aceptado** — estados y dos tablas sin definir → decisión 1: solo `Now`, Estado distinto de ✅ y 🧪.
- **Aceptado** — faltan minutos y «tope» mal dicho → columna Minutos `sin medir` y decisión 4 reformulada.
- **Rechazado** — «único» y «mínimo» contradictorios → es la forma fija del bloque; aclarado cuál se despacha.
- **Aceptado** — grep sin excluir `changes/` → rehecho: solo `SKILL.md:8`.
- **Aceptado** (ronda 2, Críticos) — ejemplos con la 0008, casos según el roadmap de cada sujeto, umbral 1 de 4 / 4 de 4, definición y «título» dentro del literal, caso de `Later`, minutos pedidos al dev-lead, medición final dentro del tope.
- **Rechazado** (ronda 2) — «el repo solo tiene `main`»: existe `develop`; el nombre de «dev-lead» es el del kit, aquí el autor.
- **Aceptado** — salida si el RED no falla; equivalencia de la frase; gate de cierre → decisiones 6, 1 y 8.

### Decisiones tomadas con el dev-lead

- La spec nace del ticket de campo `.docs/sdd/field-reports/20260914-aviso.md` §1 y la entrevista ya está hecha — «La entrevista ya está hecha; decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1; el RED aún no se ha medido.»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo qué se cierra. Al cerrar la 0005 quedaba una fila abierta y la persona no lo supo: coste, una parada del dev-lead (ticket §1). Se quiere que el aviso diga también qué queda pendiente. Éxito: en los sujetos de GREEN, cada aviso nombra cada fila abierta de `Now` (sin la que se cierra) con su id y su título, y nada cerrado como pendiente. Fracaso aunque «funcione»: un aviso que lista lo pendiente pero se come el paso 2 (el gate), o que cuenta como pendiente una fila ✅.

## Scope

- Entra, si el RED lo exhibe (si no, ver decisión 6): el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente (todo el cambio sale de un ticket sin medir).
- No entra: el paso 2 (el gate); la batería `tests/batteries/aviso-cierre/battery.md` y los otros apartados del ticket (esta spec solo cubre §1); ordenar o cerrar filas del roadmap; cualquier otra skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope y decisión 2 |
| Nombre `aviso-cierre` (no cambia) | `.docs/sdd/steering/operations.md:16`, `tests/batteries/aviso-cierre/battery.md` | Sin cambio: solo la nombran, el nombre no cambia |

- Filas que implementa: nada: comprobado con `git grep -niE "0028|Di qué se cierra" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes' ':!.docs/sdd/field-reports' ':!tests/*.md'`, que solo da `skills/aviso-cierre/SKILL.md:8`; la 0028 no tiene fila en `ROADMAP.md`.

## Approach

- A: ampliar el paso 1 con «y qué queda pendiente» — una línea cambiada, un solo sitio, el gate sigue siendo el paso 2.
- B: un paso nuevo «Di qué queda pendiente» entre los dos — renumera el gate a 3 y cualquier referencia a «paso 2»; más superficie para una línea.
- C: poner lo pendiente en el gate o en otra skill — el aviso seguiría sin decirlo, que es el fallo del ticket.
- Elegido: A — lo eligió el dev-lead: «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».

El texto es el de la decisión 2; la definición de «pendiente», la de la decisión 1.

## Dónde se prueba

- Que el aviso dice qué queda pendiente: sujetos de `aviso-cierre` con la batería existente (`c1` y `c2`, paso cierre, Sonnet), RED con la skill de hoy y GREEN con el paso 1 nuevo; se mide con el roadmap que ve cada sujeto (el de su escenario manda), con estos casos, solo los que ese roadmap permite: (a) con 0010, 0011 y 0008 ⏳ en `Now` y se cierra la 0005 → el aviso nombra «0010 Motivo al cancelar», «0011 Anular reservas de otros» y «0008 Avisos por correo antes de la reserva», y no la 0005; (b) sin filas abiertas → «no queda nada abierto» o equivalente; (c) 0007 ✅ en `Now` → no aparece; (d) 0004 ⏳ en `Later` → no aparece. En todos, el paso 2 (el gate) se sigue ejecutando. Criterio: el RED falla si al menos 1 de 4 sujetos omite una fila abierta o cuenta una que no lo es; el GREEN pasa si 4 de 4 cumplen los casos que su roadmap permite. Id y título presentes o ausentes se comprueban por texto; lo demás lo juzga el dev-lead (aquí, el autor). No llevan GIVEN/WHEN/THEN en un delta porque no hay capacidad que los fusione.
- No hay test unitario: es el texto de una skill, sin código de `src/`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Minutos |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 | sin medir |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 | sin medir |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 | sin medir |
| Controles | sin controles: un solo paso y sin comportamiento nuevo que contrastar | 0 | sin medir |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | sin medir |
| Suma | 14 sujetos | 9,80 | sin medir |

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
