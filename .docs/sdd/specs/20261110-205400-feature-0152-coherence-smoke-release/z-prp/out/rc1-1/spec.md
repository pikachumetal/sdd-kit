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

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor, más una segunda ronda por dos Críticos aceptados — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~3 líneas en 2 ficheros (la frase del paso 1 y la fila de rúbrica)
- Dominio y técnica (sonnet, los siete puntos): si el THEN y la fila de rúbrica de `c1` (frase del THEN) fallan hoy con la skill actual y pasan solo con la frase nueva, y si «la fila que queda abierta» deja huecos con varias abiertas (señal: capacidad nueva)
- Mínimo razonable: este mismo — sin MODIFIED ni contrato público, no baja más; no hay lente de dominio aparte porque la spec no toca reglas de negocio ni roles
```

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Con varias filas abiertas (hoy el roadmap tiene la 0010, la 0011 y la 0008 en ⏳) esta feature no fija cuál se nombra: queda fuera (No entra). El escenario cubre una única fila abierta.
4. La fila de rúbrica de `c1` pide la frase del THEN entera, no solo «pendiente»: con `/pendiente/` el sujeto pasa diciendo la palabra sin nombrar la fila. Criterio: 2 de 2 sujetos.
5. El aviso dice exactamente «queda pendiente la <id> — <título>», con el título del roadmap sin acortar ni traducir; la raya y el orden son parte del contrato y los fija la rúbrica. Minutos: `sin medir` (`plan.mjs` no los da), así que pido aceptar esa excepción a la constitución 5 al aprobar. «Abierta» = estado distinto de ✅ (los estados del roadmap son ⏳, 🔄, ⏸️, 🧪 y ✅) y que no es la fila que se cierra; el paso 1 lee `ROADMAP.md`. Validación: agente. Tanda de n = 2, 0 controles, 0 de REFACTOR. Enfoque: una frase en el paso 1, frente a un paso 2 nuevo para el aviso o a una sección aparte en la skill (ver Approach).
6. Política de modelos: revisor de la spec — uno, Sonnet (dominio y técnica juntas) · revisión final: Spec opus+high, Código sonnet+high · sujetos de `aviso-cierre` (Sonnet), por tandas de 2 · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

- **Aceptado** — Crítico: el caso de la 0005 tiene tres filas abiertas y el escenario cubre una → Intent acotado a «una sola fila abierta» y la elección con varias queda en ✋ 3 para que la decidas.
- **Aceptado** — Crítico: `c1` sin fixture → fixture declarado en Scope y RED que debe fallar por ausencia de la frase.
- **Aceptado** — rúbrica laxa → regex con la frase del THEN, 2 de 2.
- **Rechazado** — requisito base no registrado como MODIFIED: no existe ninguna capacidad en `capabilities/`; «di qué se cierra» no es un requisito vivo, y la delta solo declara lo nuevo.
- **Aceptado** — qué es «abierta» y la lectura del roadmap → Scope y ✋ 5.
- **Aceptado** — minutos → `sin medir` en la previsión.
- **Segunda ronda.** **Aceptado** — GIVEN sin fila que se cierra ni fixture → GIVEN reescrito. **Aceptado** — `c1` ya existe → declarado: no cambia, se le añade la rúbrica. **Aceptado** — texto del paso 1 sin la frase del THEN → el paso 1 lleva la plantilla. **Aceptado** — formato del aviso y estados → ✋ 5. **Aceptado** — fixture aparte del roadmap real. **Rechazado** — comportamiento con varias abiertas: no se añade escenario; sigue en No entra y en ✋ 3 para que lo decidas. **Rechazado** — minutos: no hay medida posible antes del primer sujeto; va como excepción en ✋ 5. **Rechazado** — criterio de parada del RED/GREEN: ya lo fija la constitución 5. **Rechazado** — fila de roadmap para la 0031: el id lo reserva la rama y crear filas es del roadmap.
- **Aceptado** — decisiones solo en el cuerpo → ✋ 5.
- **Aceptado** — `operations.md` → No entra.
- **Rechazado** — caso de la 0005 sin traza: viene de lo que contó el dev-lead; queda `sin medir`.
- **Rechazado** — fila de ejemplo inventada: el proyecto «salas» es ficticio y la 0011 es su propia fila; no hay dato real que proteger.

### Pasada de coherencia

- `sdd id claim`: «sin remoto: la 0031 vale (contador local)». La 0031 no tiene fila en `ROADMAP.md` (`git grep -n "0031"` fuera de las specs: sin resultados).
- El Scope no incluía la batería, y la fila de rúbrica de `c1` no existe hoy en `tests/batteries/aviso-cierre/battery.md` (solo la tabla Id/Paso/n/Modelo): entra en el Scope.
- GIVEN del escenario: «como única fila abierta», por el punto 3.
- Delta probado en una copia de `.docs/sdd`: «aviso-cierre.md: añadido «El aviso nombra la fila abierta»».
- `git grep` de «qué se cierra» y de `aviso-cierre` fuera de las specs: solo `skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/battery.md` y la línea de costes de `operations.md`. El caso real de la 0005 no está documentado en el repo (su walkthrough no lo menciona): `sin medir`.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: cuando solo queda una fila abierta, el aviso la nombra con su título. Cuando quedan varias (hoy la 0010, la 0011 y la 0008) no se decide aquí: ver ✋ 3.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta; la fila de rúbrica de `c1` en `tests/batteries/aviso-cierre/battery.md`.
- Entra también: el paso 1 lee `ROADMAP.md`; «abierta» es una fila con estado distinto de ✅ que no es la que se cierra; el fixture de `c1` es un roadmap de prueba con solo la 0011 abierta, cerrando la 0005, que no contiene la frase del THEN. `c1` ya existe en la batería (fila Id/Paso/n/Modelo, n = 2, sonnet): no cambia; se le añade su fila de rúbrica.
- No entra: el roadmap (no se edita); qué fila se nombra cuando hay varias abiertas; la línea de costes de `operations.md` (n y coste de `c1` no cambian).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y nombra la fila abierta del roadmap con la forma «queda pendiente la <id> — <título>».» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero; coste: una línea.
- B. Un paso nuevo entre el 1 y el 2 — separa el aviso de la fila, pero renumera el gate y la skill pasa a tres pasos para una frase.
- Elegido: A. B no aporta nada que una frase no dé.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con el fixture del Scope y la fila de rúbrica `` `text: /queda pendiente la 0011 — Anular reservas de otros/` ``: falla si el aviso del sujeto no dice la frase del THEN; pasa con 2 de 2 sujetos. El RED corre con la skill de hoy y debe fallar por ausencia de la frase.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN el cierre de la 0005, con un roadmap de prueba (el fixture de `c1`, aparte del `ROADMAP.md` real) donde «0011 — Anular reservas de otros» es la única fila abierta
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
| Suma | 4 sujetos | 2,80 |

Minutos: `sin medir` — `scripts/plan.mjs` no los da; se declaran al medir la primera tanda.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
