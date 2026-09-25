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

> Documento post-implementación: resume lo que se hizo REALMENTE (no lo planeado), las desviaciones,
> la verificación con evidencia y los aprendizajes que vuelven a los docs vivos. El cuerpo no se
> reescribe tras el cierre: lo que cambia después (validación tardía, integración con otra task) se
> añade como entrada fechada en `## 6. Adendas`. Borra los bloques de ayuda (`>`) al redactar.

## 1. Cambios realizados

- Resumen por área, con ficheros clave y commit hash.

## 2. Tiempo y coste: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Estimación de implementación (del plan): <Yh>
- Esfuerzo real: <Zh> — reloj del hilo (aproximado si no hay medición exacta — nunca en blanco). Los minutos de los subagentes NO se suman aquí: van en su línea. Sin reloj exacto, aproxima con las marcas de los commits y dilo; «no tengo reloj del hilo, sumo los despachos» convierte el ratio en el de los subagentes.
- Desviación: <±h> (<±%>)
- Causa de la desviación (obligatoria si |desviación| > 30%): <…>
- Modelo del hilo: <modelo>
- Tokens del hilo: <N> — <modelo> <N>; … | no medido (<motivo>) *(esta línea, la de subagentes y la del coste se pegan tal cual de `Measure-SessionTokens.ps1 -Path <worktree> -Branch <rama de la task>`, en `scripts/` de `sdd-templates`, que lee los transcripts de Claude Code. Fuera de Claude Code no hay transcripts: «no medido (sin transcripts de Claude Code)»)*
- Tokens de subagentes: <total> en <n> despachos — <descripción> <modelo> <tokens> / <min> min; … | no aplica *(la línea abre con el total sumado: el log lee esa primera cifra, no la lista)*
- Coste de la sesión: <X> $ (hilo <a> $ + subagentes <b> $) | sin precio (<motivo>) | no medido (<motivo>) *(«sin precio» si falta la tabla `pricing` de `sdd-kit.json` o un modelo en ella: el script no inventa precios)*
- Coste de sujetos: <X> $ en <n> sujetos <modelo> — <campaña> <X> $; … | no aplica
- Review de spec: <no | 1 revisor (dominio|técnica) | 2 revisores> · hallazgos <N>, aceptados <M>

## 3. Desviaciones del plan

- _Ninguna_ / lista de divergencias entre `plan.md` y la implementación final, con la razón.

### Decisiones tomadas sin el dev-lead

> Los rulings de la ejecución («Rulings I made», del informe final de `subagent-driven-development`): salir
> del plan sin cambiar la spec y seguir, sin parar. _Ninguna_ si no hubo.

- <decisión> — <por qué> — <coste si está mal>

## 4. Verificación

### 4.1 Builds

- Comandos ejecutados y resultado real (no "debería funcionar").

### 4.2 Smoke / tests

> Distinguir siempre lo **verificado por el agente** (con evidencia) de lo **reportado por el usuario**.

- Validado por el dev-lead: <fecha> · <qué probó> **o** Validación diferida: <fecha> · «<frase literal>» ·
  disparador: <task, release o uso con dueño> *(obligatorio: sin uno de los dos no hay cierre; si validó
  sobre lo reportado por el agente, dilo)*

| # | Caso | Resultado |
| --- | --- | --- |

### 4.3 Residuales / deuda generada

- Ítems fuera de scope que pasan a otra spec, al backlog o a la tabla de deuda del roadmap.

## 5. Aprendizajes

> Cada punto indica a qué doc vivo o skill se ha volcado (constitution / architecture / tech-stack / skill X). Un aprendizaje sin destino se pierde.

- <aprendizaje> → <destino>

## 6. Adendas

> Lo que cambia después del cierre: validación tardía, integración con otra task. El cuerpo de arriba
> (secciones 1-5) no se reescribe.

- <fecha> — <qué cambia> — <quién lo dice>
