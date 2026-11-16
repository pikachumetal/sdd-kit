---
kit_version: 2.3.4
lane: feature
id: 20261102-170737-feature-0280-campaign-subject-cap
task: 0280
mode: lite
date: 2026-11-02
---

# Ticket para el kit — feature 0280: el techo de sujetos sale de la spec, pero 6 de 16 previsiones no llevan el número

## Contexto

- Carril y modo: feature lite
- Skills del kit usadas: `using-sdd`, `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `sdd-feedback`
- Proyecto: el propio kit, lanzador de pruebas en Node con Vitest
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 y Sonnet 5.5
- Coste en reloj: 0,36 h frente a 1,2 h estimadas
- Coste en tokens: 6.174.279 del hilo y 1.591.365 de subagentes; 6,32 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La plantilla no pide el número de sujetos en la fila `Suma`, y sin él el techo no se aplica

- **Qué pasó**: el lanzador ya para en el número de `Suma`, pero 6 de 16 specs con previsión no lo llevan: 5 dejan vacía la columna de sujetos y 1 la llena de prosa. Sus filas tampoco se suman, porque son prosa («`c1` × 2, `m6` × 2»). En esas specs el techo sigue siendo el `SUBJECT_CAP` a mano, con un aviso. No se tocó la plantilla: aclararla lleva sujetos por el Art. I, y esta feature iba sin ellos.
- **Fuente**: recuento con `awk` de las filas `Suma` de `.docs/sdd/specs/*/spec.md` → `num 10 vacia 5 prosa 1`; `skills/sdd-templates/templates/spec-template.md:149`, «el total es la suma de las filas».
- **Dónde en el kit**: `skills/sdd-templates/templates/spec-template.md`, «Previsión de coste».
- **Por qué el kit no lo evitó**: el bloque de ayuda pide el total sin decir que la celda de sujetos lleve un número, y solo se ve en la columna de dólares.
- **Coste**: ninguno aún; es un hueco del saldo de la deuda. El riesgo es el caso de la 0151, 63 sujetos frente a 45, en las specs sin número.
- **Propuesta**: añadir a la ayuda de esa sección que `Suma` lleva en la columna de sujetos un número, que es el techo del lanzador, sustituyendo otra frase para no crecer.
- **Verificada**: sí — `forecastSubjects` sobre las 16 specs, comprobado por el eje Spec de la revisión final
- **Criterio de aceptación**: GIVEN una feature que edita una skill con batería WHEN un sujeto escribe la spec desde la plantilla THEN la fila `Suma` lleva un número en la columna de sujetos.

## Lo que hice por iniciativa propia

- Smoke con `run.mjs` y `battery.mjs run` reales sobre un sujeto de juguete, sin `claude -p` ni coste: dio la evidencia de `ejecución real` de los mensajes del lanzador. Funcionó.

## Funcionó, no tocar

- El hook de la 0287 denegó mi heredoc de un `.mjs` y nombró `Write`; el segundo intento salió a la primera.

## Menores

- La re-revisión única salió por una pasada de fix con 4 retoques menores, solo uno en una línea de código y sin cambio de conducta: 192.227 tokens en Opus, ~0,46 $ — `skills/sdd-verify/SKILL.md`, «The single re-review».
- El workspace de un lite es `.temp/sdd/spec`, sin el id de la feature, porque se deriva del nombre del fichero — `cli/`, verbo `sdd workspace`; `skills/sdd-implement/SKILL.md`, Setup, paso 2.
