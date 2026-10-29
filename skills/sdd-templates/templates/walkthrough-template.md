---
id: <yyyyMMdd-HHmmss>-feature-<id>-<slug>
feature: <id>
title: Walkthrough — <título de la spec>
spec: ./spec.md
plan: ./plan.md
status: done
created: <YYYY-MM-DD>
---

# Walkthrough — <título>

> Documento post-implementación: resume lo que se hizo REALMENTE (no lo planeado), las desviaciones,
> la verificación con evidencia y los aprendizajes que vuelven a los docs vivos. El cuerpo no se
> reescribe tras el cierre: lo que cambia después (validación tardía, integración con otra feature) se
> añade como entrada fechada en `## 6. Adendas`. Borra los bloques de ayuda (`>`) al redactar.

## 1. Cambios realizados

- Resumen por área, con ficheros clave y commit hash.

## 2. Tiempo y coste: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Estimación de implementación (del plan): <Yh>
- Esfuerzo real: <Zh> — reloj de la sesión <h> desde <inicio>, sin <min> min de espera al dev-lead (<n> esperas)[, sin <h> h sin actividad (<n> huecos)] *(tal cual de `sdd session tokens`: desde el arranque de la sesión que lo abrió, investigación previa incluida, sin las esperas al dev-lead. Fuera de Claude Code, nunca en blanco: aproxima el reloj del hilo con las marcas de los commits y dilo; los minutos de los subagentes no se suman, y «sumo los despachos» convierte el ratio en el de los subagentes)*
- Desviación: <±h> (<±%>)
- Causa de la desviación (obligatoria si |desviación| > 30%): <…>
- Compactación: <`no` · `sí, en la Task <N> → <Native | SDD> desde la Task <M>` · `sí, en la Task <N> → Native` si no quedaba ninguna después, sacado de la línea `Ruling: compactación` del ledger>
- Modelo del hilo: <modelo y effort; si cambiaron durante la feature, los de cada fase en esta misma línea: «Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)»; «effort no registrado» en la fase cuyo effort no sabes, nunca uno supuesto>
- Tokens del hilo: <N> — <modelo> <N>; … | no medido (<motivo>) *(esta línea, la de subagentes y la del coste se pegan tal cual de `sdd session tokens --path <worktree> --branch <rama de la feature>`, que lee los transcripts de Claude Code. Fuera de Claude Code no hay transcripts: «no medido (sin transcripts de Claude Code)»)*
- Tokens de subagentes: <total> en <n> despachos — <descripción> <modelo> <tokens> / <min> min; … | no aplica *(la línea abre con el total sumado: el log lee esa primera cifra, no la lista)*
- Coste de la sesión: <X> $ (hilo <a> $ + subagentes <b> $) | sin precio (<motivo>) | no medido (<motivo>) *(«sin precio» si falta la tabla `pricing` de `sdd-kit.json` o un modelo en ella: el script no inventa precios)*
- Coste de sujetos: <X> $ en <n> sujetos <modelo> — <campaña> <X> $; … | no aplica
- Review de spec: <no | 1 revisor (dominio|técnica) | 2 revisores> · hallazgos <N>, aceptados <M>

## 3. Desviaciones del plan

- _Ninguna_ / lista de divergencias entre `plan.md` y la implementación final, con la razón.

### Decisiones tomadas sin el dev-lead

> Los rulings de la ejecución («Rulings I made», del mensaje final de `sdd-implement`): salir
> del plan sin cambiar la spec y seguir, sin parar. _Ninguna_ si no hubo.

- <decisión> — <por qué> — <coste si está mal>

## 4. Verificación

### 4.1 Builds

- Comandos ejecutados y resultado real (no "debería funcionar").
- Gate: `<suite unitaria, si «Suites» la declara>` · `<comando>` → <suite>: corrió <N>/<M> · <tarea>: corrió <N>/<M> (sin filtro: cambia el build, si la rama toca «Sin filtro») · <tarea>: saltada (<porqué de la herramienta>) · <duración> · configuración: <la del gate | lo que se añadió> · sobre <sha | el commit de cierre, si el cierre junta ese sha> *(sin «Presupuesto E2E» o con `pendiente`, si pasa de 10 min, apúntalo en 4.3 como deuda del proyecto, con la duración)*
- Entorno de la suite: `<comando>` · <comprobación> → <resultado>, levantado en esta sesión · o `no aplica` *(solo con E2E)*
- E2E: <duración> de <Presupuesto E2E> *(solo con E2E; si lo pasa, apúntalo en 4.3 como deuda del proyecto)*
- Tanda: <la línea `Tanda:` que diste antes de lanzarla>, <minutos> reales *(si hubo tanda)*

### 4.2 Smoke / tests

> Distinguir siempre lo **verificado por el agente** (con evidencia) de lo **reportado por el usuario**.
> Una fila por THEN de la spec. Evidencia: `suite` · `ejecución real` · `no probado`. Un THEN que se ve en una
> interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado
> con `ejecución real`; un THEN de fallo se provoca con la entrada que falla.

- Validado por el dev-lead: <fecha> · <qué probó> **o** Validación diferida: <fecha> · «<frase literal>» ·
  disparador: <feature, release o uso con dueño> **o**, con `validation.mode: field` en `sdd-kit.json`,
  Validación en campo: <fecha> · <verificación del agente, p. ej. «suite 412/412 · smoke 5/5 THEN con
  ejecución real · revisión final Spec y Código sobre a1b2c3d, re-revisión limpia»> *(obligatorio: sin una de las tres no hay
  cierre; si validó sobre lo reportado por el agente, dilo)*
  *(la frase del dev-lead no se corrige, erratas incluidas; si el proyecto pasa un corrector sobre los `.md`,
  excluye en este fichero, al escribirlo y no después del lint, todas las palabras de la frase, no solo las que
  te parezcan erratas: en cspell, `<!-- cspell:ignore <palabras> -->`)*

| THEN | Evidencia | Resultado |
| --- | --- | --- |

### 4.3 Residuales / deuda generada

- Ítems fuera de scope que pasan a otra spec, al backlog o a la tabla de deuda del roadmap.
- Suite que pasa de su presupuesto (o, sin presupuesto, de 10 min): <duración> — deuda del proyecto *(omitir si no pasa)*.

## 5. Aprendizajes

> Cada punto indica a qué doc vivo o skill se ha volcado (constitution / architecture / tech-stack / skill X). Un aprendizaje sin destino se pierde.

- <aprendizaje> → <destino>

## 6. Adendas

> Lo que cambia después del cierre: validación tardía, integración con otra feature. El cuerpo de arriba
> (secciones 1-5) no se reescribe.

- <fecha> — <qué cambia> — <quién lo dice>
