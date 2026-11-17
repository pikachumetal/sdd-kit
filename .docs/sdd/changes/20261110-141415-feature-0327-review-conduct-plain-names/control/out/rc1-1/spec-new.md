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

🦆 Al cerrar una feature, el aviso dirá, además de qué se cierra, qué filas del roadmap siguen abiertas, cada una con su número y su título. Con el roadmap de hoy, al cerrar la 0005 diría: «quedan pendientes la 0010 — Motivo al cancelar, la 0011 — Anular reservas de otros y la 1 — Avisos por correo antes de la reserva». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`, que pasa a leer `.docs/sdd/roadmap.md`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre (parcial a propósito: solo recoge lo nuevo; «dice qué se cierra» y el gate de hoy no se escriben aquí)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos, más una segunda ronda por un Crítico aceptado — señales: capacidad nueva · tamaño: ~20 líneas en 3 ficheros
- Dominio y técnica (sonnet): si el THEN se sostiene con el roadmap de hoy y si la rúbrica de `c1` distingue la skill de hoy de la nueva (señal: capacidad nueva)
- Mínimo razonable: sin revisión — deja sin mirar el literal del THEN frente al roadmap y la rúbrica frente al RED. **Elegido: un revisor y segunda ronda.**

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill, parcial a propósito.
2. **La regla de qué filas nombra el aviso (la decisión central, valídala): todas las filas ⏳ de «Próximo», salvo la que se cierra, no solo la 0011.** Tu frase hablaba de «la fila abierta»; el roadmap de hoy tiene tres abiertas y la skill no sabe cuál se relaciona con el cierre. Alternativa descartada: nombrar solo la que toque al cierre, que exigiría una relación que el roadmap no escribe.
3. El paso 1 fija el contrato con el roadmap: «1. Di qué se cierra y, leyendo `.docs/sdd/roadmap.md`, qué filas ⏳ de «Próximo» siguen abiertas, con su id y su título (el texto en negrita; sin negrita, el texto de la celda).» Si el formato del roadmap cambia, la skill se rompe: es un contrato implícito nuevo.
4. Enfoque: una frase en el paso 1, frente a un paso nuevo o a una plantilla del aviso (ver Approach).
5. Fixture de `c1`: se cierra la 0005 con el roadmap de hoy (0010, 0011 y 1 abiertas); la 0005 existe como `specs/…-task-0005-weekly`. Sin medir: no he leído cómo el arnés monta el sujeto.
6. Rúbrica de `c1`, una fila por cada fila abierta, con el flag `s` para que un aviso en viñetas también pase: `` `text: /0010.*Motivo al cancelar/s` ``, `` `text: /0011.*Anular reservas de otros/s` `` y `` `text: /\b1\b.*Avisos por correo antes de la reserva/s` ``. Hoy `battery.md` solo tiene la tabla de escenarios y `scripts/plan.mjs` solo lee esa tabla: el formato de rúbrica es mío y sin medir. Condición: si el plan encuentra que el arnés no admite rúbricas `text:` o no monta el roadmap, el plan reabre la spec con una enmienda.
7. El caso «sin filas abiertas» no entra: no está en el pedido y exigiría otro escenario y otra tanda.
8. `c2` queda fuera: no sé qué cubre y no cambio su coste; riesgo de regresión asumido, dime si lo quieres en el GREEN (+1,40 $).
9. Minutos (la constitución pide sujetos, minutos y dólares): ~5 min por tanda de 2 sujetos, estimación mía, sin medir.
10. Política de modelos: sujetos y revisores en Sonnet (`tech-stack.md` fija Sonnet para los sujetos; el cambio no toca reglas de negocio ni roles).
11. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → «aviso-cierre.md: añadido «El aviso nombra las filas abiertas»», salida 0. Previsión de coste: salida real de `plan.mjs` (1.40 $ por tanda).

### Hallazgos de la review

Primera ronda:
- **Aceptado** — Crítico: tres filas abiertas y un THEN solo de la 0011 → decisión 2.
- **Aceptado en parte** — Crítico: «la 0005 no existe» → existe como spec cerrada; el fixture sí faltaba → decisión 5 y paso 1 que lee el roadmap.
- **Aceptado** — rúbrica sin anclar al literal → decisión 6.
- **Aceptado** — estructura de rúbrica nueva en `battery.md` → Scope y decisión 6.
- **Aceptado** — faltan minutos → columna y decisión 9.
- **Aceptado** — `c2` sin justificar → decisión 8.
- **Aceptado** — caso sin filas abiertas → ahora fuera de alcance, decisión 7.
- **Aceptado** — política de revisión mezclada con decisiones de producto → decisión 10.
- **Aceptado** — la 0031 sin fila → dicho en «Filas que implementa».
- **Aceptado** — Approach sin alternativas → reescrito.

Segunda ronda (sin tercera):
- **Aceptado** — Crítico: escenario «sin filas» sin prueba → retirado del delta, decisión 7.
- **Aceptado** — Crítico: rúbrica no verifica la regla de todas las filas, y `.` no cruza líneas → tres filas de rúbrica con flag `s`, decisión 6; THEN reescrito como lista.
- **Aceptado** — la fila que se cierra no cuenta como abierta → decisión 2 y GIVEN.
- **Aceptado** — «título» sin definir → decisión 3.
- **Aceptado** — capacidad parcial → declarada a propósito en Capacidades.
- **Aceptado** — contrato con el roadmap → decisión 3 y Scope.
- **Rechazado en parte** — arnés sin medir: `plan.mjs` está leído y solo lee la tabla; medir el formato de rúbrica exige montar sujetos → condición de enmienda en la decisión 6.
- **Rechazado** — `c2`: sigue fuera, motivo en la decisión 8.
- **Rechazado** — cifra de `plan.mjs` «no consta que se corriera»: se corrió, decisión 11; los minutos sí son estimación.
- **Aceptado** — marcar el nivel elegido → cabecera de la review.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra las filas abiertas del roadmap, la 0011 entre ellas, con su título. Falla aunque diga «pendiente» del gate, o aunque nombre solo una de las filas.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` lee `.docs/sdd/roadmap.md` y nombra las filas ⏳ de «Próximo»; las tres filas de rúbrica de `c1` en `tests/batteries/aviso-cierre/battery.md`; la capacidad nueva `capabilities/aviso-cierre.md`, parcial, que sale del delta al cerrar.
- No entra: el roadmap; el paso 2 de la skill; el escenario `c2`; el caso sin filas abiertas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a la frase de la decisión 3 |

- Filas que implementa: ninguna, la 0031 va sin fila en el roadmap: comprobado con `git grep -n "0031"`

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero. Mínimo cambio.
- B. Un paso nuevo entre el 1 y el 2 — separa el aviso, pero alarga una skill de dos pasos para una frase.
- C. Una plantilla del aviso en un fichero — da forma fija, pero añade un fichero que mantener para una línea.
- Elegido: A.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con las tres filas de rúbrica de la decisión 6: falla si el aviso no nombra, con su título, cada una de las tres filas abiertas. El RED debe mostrar que la skill de hoy no las cumple.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra las filas abiertas

- GIVEN el cierre de la 0005 con las filas 0010, 0011 y 1 en ⏳ en «Próximo» del roadmap
- WHEN se avisa
- THEN el aviso lista cada fila ⏳ con su id y su título: 0010 — Motivo al cancelar, 0011 — Anular reservas de otros y 1 — Avisos por correo antes de la reserva

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Minutos (estimación) |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | ~5 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 | ~5 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 | 0 |
| Suma | 4 sujetos | 2,80 | ~10 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
