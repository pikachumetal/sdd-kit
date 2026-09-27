---
id: 20260922-083703-task-0013-postponed-anchor
task: 0013
title: Walkthrough — Anclaje pospuesto sin vía de retorno
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Anclaje pospuesto sin vía de retorno

## 1. Cambios realizados

- **Plantillas** (`ed7130f`, `93ee1c7`): siete nuevas en `skills/sdd-templates/templates/` (`mission`, `constitution`, `tech-stack`, `architecture`, `roadmap`, `estimation`, `changelog`). Tienen sus filas en el índice, la `description` de `sdd-templates` las nombra y el README ahora cuenta 20 plantillas. El roadmap lleva literales las secciones y cabeceras que leen otras skills y los cinco estados de fila. El changelog lleva `## [Unreleased]`. La constitution lleva las cinco reglas de producto. La estimation lleva el método genérico y la calibración vacía.
- **Cierre** (`12d9fbd`, `f4f50bb`, `93ee1c7`): en el paso 4 de `sdd-end-task`, un destino que falta se crea calcando su plantilla y se dice en el informe. Si no tiene plantilla, va a deuda. La regla está en el `SKILL.md`, con red flag y racionalización, y el detalle en `references/aprendizajes-skills.md`.
- **Init y nombrado** (`12d9fbd`): `estructura.md` y el paso 3 de `sdd-init-greenfield`, y `generacion.md` de brownfield, calcan cada documento de su plantilla y nunca copian de otro proyecto. `nombrado.md` dice de dónde sale la forma de `architecture.md`.
- **Tests** (`tests/AnchorTemplates.Tests.ps1`, 43 casos): los escribió el hilo antes de las plantillas y vio 34 en rojo. Evidencia en `tests/postponed-anchor-red.md` y `tests/postponed-anchor-green.md`.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: 1,5 h (aproximado, por los commits: de 11:05 a 11:42 la implementación y la revisión, más unos 45 min de campaña GREEN y rerun en segundo plano, con redacción de evidencia)
- Desviación: −1,5 h (−50 %)
- Causa de la desviación: se estimó el GREEN como horas de trabajo. Los sujetos corren en segundo plano, y el tiempo real es el de redactar la evidencia (el tercer aviso de `estimation.md`). Las plantillas y los consumidores fueron ediciones cortas, con el contexto del RED ya cargado.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda de alcance aprobada** (2026-09-22): de una sola plantilla (`architecture`) a siete, y las dos init las calcan. Está registrada en `## Enmiendas` de la spec.
- **La regla del cierre subió al `SKILL.md`**: el plan la ponía en `references/aprendizajes-skills.md`, y el GREEN falló 0/2 con ella ahí.
- **`sdd-templates/SKILL.md`, `description` ampliada**: el plan no la mencionaba.
- **El GREEN tuvo 12 sujetos, no 6**: 2 del E1b fallido, más 4 reruns tras el REFACTOR. Costó 6,92 $, dentro de lo estimado (6–9 $).

### Decisiones tomadas sin el dev-lead

- **Hallazgo 3 de la revisión, aceptado solo a medias**: el paso 4 no vuelve a ser un puntero, porque es lo que falló en el GREEN. Coste si está mal: la regla queda duplicada entre el `SKILL.md` y la referencia, aunque sin contradicción.
- **E3 no se repitió tras renombrar la columna de la tabla de deuda** (`Deuda · Plan` pasó a `Ítem · Destino`): es un cambio de texto. Coste si está mal: una init real podría usar la cabecera vieja, cosa poco probable porque calca la plantilla vigente.
- **El sujeto `e1b-refactor-1` no cuenta en el veredicto**: no registró el aprendizaje, así que le falta la precondición del THEN. Coste si está mal: el 3/3 sería un 3/4.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: 285 pasan, 0 fallan y 6 se saltan (los de `claude plugin validate`, según su condición), también en el hook de cada commit.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «diferimos, el sdd.kit e smuy dificil de probar sino es ne ltrabnjo diario» · disparador: uso diario del kit 1.2.0 por el dev-lead (la primera init o task real con él)

Verificado por el agente (campañas headless, Sonnet; detalle en `green/README.md`):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Cierre sin `architecture.md` crea el documento desde la plantilla (E1b) | T2: 0/2 · tras el REFACTOR: 3/3 |
| 2 | No redirige el aprendizaje a otro documento | 3/3 (RED: 3/4 lo llevaban a `tech-stack.md`) |
| 3 | Lo dice en el informe final | 2/3; el tercero, solo en el walkthrough |
| 4 | Una task que completa el anclaje pospuesto calca la plantilla (E2) | 2/2 (RED: 0/2) |
| 5 | Greenfield: siete documentos con las secciones de su plantilla y tablas literales (E3) | 2/2 |
| 6 | Brownfield calca las plantillas | por lectura de `generacion.md` + Pester |
| 7 | Revisión de código (Sonnet) y re-revisión del diff de fixes | 0 Critical; 3 Important y 2 Minor resueltos; 1 Minor anotado |

### 4.3 Residuales / deuda generada

- **Cosecha de aprendizajes de `review.md`**: 1 de 4 sujetos no convirtió en aprendizaje la nota de estructura del revisor. Va a una fila de deuda.
- **Fila «Greenfield deja a la deducción la forma de casi todo»**: esta task salda el punto A2. Siguen abiertos A3–A6 y B*.
- **Fila «`sdd-templates` no tiene plantilla de `estimation.md`»**: saldada.

## 5. Aprendizajes

- Una regla que gobierna una decisión, puesta en `references/`, no se lee (0/2), y en el `SKILL.md` sí (3/3) → `architecture.md` (anatomía de una skill, punto 6).
- El GREEN puede reproducir el fallo de campo que el RED no reprodujo: quitar la salida que usaban los sujetos destapó la pérdida en silencio → `tech-stack.md` (método de campañas).
- El sujeto headless hereda el `CLAUDE.md` global de la máquina → `tech-stack.md` (método de campañas).
- Comportamiento: dos requisitos en `capabilities/task-flow.md` y uno en `capabilities/onboarding.md`, fusionados desde el delta.
- Revisión de skills: este repo no tiene `.claude/skills/` (lo he mirado). Las skills del kit son el objeto de la task y ya están editadas con su RED y su GREEN. No aplica ninguna más.

## 6. Adendas

- _Ninguna._
