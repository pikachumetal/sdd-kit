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

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Para saberlo, la skill lee la tabla «Próximo» del roadmap, sin modificarla. Cambia el paso 1 de la skill `aviso-cierre`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~3 líneas en 1 fichero
- Dominio + técnica (sonnet): si el escenario ata la skill a una fila concreta y de dónde sale el dato (señal: capacidad nueva)
- Mínimo razonable: este mismo — no deja nada sin cubrir que la rúbrica exija

Política de modelos: revisor de la spec en Sonnet (la spec no toca roles ni reglas de negocio); sujetos de la prueba en Sonnet, como fija `tech-stack.md`. Sin paralelismo: un solo revisor.

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. «Fila abierta» = una fila de la tabla «Próximo» de `.docs/sdd/roadmap.md` distinta de la que se cierra (la que se cierra la dice quien cierra). La skill lee ese fichero y depende de su formato (tabla «Próximo», id en la primera columna, título en negrita); no lo modifica.
4. Formato del aviso: «queda pendiente la `<id>` — `<título>`», con raya larga; el título es el texto en negrita de la fila.
5. Enfoque: una frase en el paso 1, frente a un paso 3 nuevo (ver Approach).
6. El requisito vale solo con exactamente una fila abierta con título. Con varias, ninguna o una sin título no se especifica nada: la skill no tiene requisito y no se prueba. Esos casos, si hacen falta, son otra feature.
7. Reglas de la capacidad: no aplica — no hay datos persistentes, nombres nuevos, límites, avisos ni conflictos; el aviso solo repite lo que ya está en el roadmap.
8. Excepción a la constitución 5: la previsión da sujetos y dólares, y los minutos van «sin medir» (ni `tech-stack.md` ni `scripts/plan.mjs` los dan). Valídala o dame los minutos.

### Hallazgos de la review

- **Aceptado** — Crítico: el escenario ata la skill a la 0011 y no dice de dónde sale el dato → THEN reformulado como regla (id y título de la fila abierta) con la 0011 como ejemplo; fuente declarada (decisión 3).
- **Aceptado** — Crítico: el Scope no declara que la skill lee el roadmap → Scope «Entra» lo declara (solo lectura).
- **Rechazado** — Importante: falta un requisito «El aviso dice qué se cierra» → ese comportamiento no cambia y este cambio no lo toca; la capacidad nace con lo que añade esta feature.
- **Aceptado** — Importante: THEN literal poco robusto → ver el primero.
- **Aceptado** — Importante: decisiones tomadas en el cuerpo sin declarar → decisiones 3 a 6.
- **Rechazado** — Importante: las cinco reglas sin declarar → decisión 7, «no aplica» con su motivo. Los casos límite (varias filas, ninguna, sin título) quedan fuera por decisión 6, no se amplía la batería.
- **Aceptado** (segunda ronda) — Importante: WHEN sin cierre → el WHEN nombra el cierre; el segundo escenario con otra fila se rechaza: son más sujetos que la previsión de la constitución 5 y la decisión 6 limita el requisito a una fila.
- **Aceptado** (segunda ronda) — Importante: varias filas contradecían el ADDED → decisión 6 limita el requisito a una fila.
- **Aceptado** (segunda ronda) — Importante: dependencia del formato del roadmap → decisión 3.
- **Aceptado** (segunda ronda) — Menor: los minutos «sin medir» son una excepción → decisión 8 pide validarla.
- **Rechazado** — Importante: n = 2 no prueba que generalice → n lo fija `battery.md` y la constitución exige la previsión, no más sujetos; criterio de paso: los 2 sujetos de `c1` cumplen `C1-A`.
- **Aceptado** — Menor: faltan minutos → decisión 8.
- **Rechazado** — Menor: estado de aprobación duplicado → es la plantilla del kit.
- **Aceptado** — Menor: «Destino» mezclaba destino y cambio → corregido; y la fila 0031 se comprobó por id y por título en el roadmap: no existe.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta de la tabla «Próximo» de `.docs/sdd/roadmap.md`, que la skill lee.
- No entra: modificar el roadmap; varias filas abiertas, ninguna o una sin título (decisión 6, sin requisito ni prueba).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Modificado: «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"` y por título («aviso de cierre», «aviso-cierre») en `.docs/sdd/roadmap.md`

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- B. Un paso 3 nuevo — el aviso saldría en dos sitios y el paso 1 seguiría incompleto.
- Elegido: A.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2. Pasa si los 2 sujetos cumplen `C1-A`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN que se cierra la 0005 y la 0011 es la única fila abierta del roadmap, con título
- WHEN se avisa del cierre
- THEN el aviso incluye el id y el título de la fila abierta, con el formato «queda pendiente la `<id>` — `<título>`», aquí «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Min |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | sin medir |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | sin medir |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | 2,80 | sin medir |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
