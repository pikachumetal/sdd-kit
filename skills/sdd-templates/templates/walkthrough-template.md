---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
task: <id>
title: Walkthrough — <título de la spec>
spec: ./spec.md
plan: ./plan.md
status: done
created: <YYYY-MM-DD>
---

# Walkthrough — <título>

> Documento post-implementación e inmutable: resume lo que se hizo REALMENTE (no lo planeado),
> las desviaciones, la verificación con evidencia y los aprendizajes que vuelven a los docs
> vivos. Borra los bloques de ayuda (`>`) al redactar.

## 1. Cambios realizados

- Resumen por área, con ficheros clave y commit hash.

## 2. Tiempo: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Estimación de implementación (del plan): <Yh>
- Esfuerzo real: <Zh> (aproximado si no hay medición exacta — nunca en blanco)
- Desviación: <±h> (<±%>)
- Causa de la desviación (obligatoria si |desviación| > 30%): <…>
- Review de spec: <no | 1 revisor (dominio|técnica) | 2 revisores> · hallazgos <N>, aceptados <M>

## 3. Desviaciones del plan

- _Ninguna_ / lista de divergencias entre `plan.md` y la implementación final, con la razón.

## 4. Verificación

### 4.1 Builds

- Comandos ejecutados y resultado real (no "debería funcionar").

### 4.2 Smoke / tests

> Distinguir siempre lo **verificado por el agente** (con evidencia) de lo **reportado por el usuario**.

- Validado por el dev-lead: <fecha> · <qué probó> *(obligatorio: sin validación no hay cierre; si validó sobre lo reportado por el agente, dilo)*

| # | Caso | Resultado |
| --- | --- | --- |

### 4.3 Residuales / deuda generada

- Ítems fuera de scope que pasan a otra spec, al backlog o a la tabla de deuda del roadmap.

## 5. Aprendizajes

> Cada punto indica a qué doc vivo o skill se ha volcado (constitution / architecture / tech-stack / skill X). Un aprendizaje sin destino se pierde.

- <aprendizaje> → <destino>
