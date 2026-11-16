---
id: 20261031-203301-feature-0129-capabilities-in-the-field
feature: 0129
title: Walkthrough — Capacidades en campo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-31
---

# Walkthrough — Capacidades en campo

## 1. Cambios realizados

- **Marca** (2d67d630): `sdd capability index` omite un documento «No es una capacidad.»; `isNotCapability` pasa a `sections.ts`. `capability-template.md` documenta la marca. `v1.0.0.md` la escribe, `v2.0.0.md` paso 7 la salta y `v3.0.0.md` «Verificación» la propone sin escribirla. La línea en blanco tras el título no se exige: test de control, sin normalización.
- **Aviso** (f792b94c): `sdd capability check` avisa por encima de 500 caracteres, con salida sin cambiar, y `warnings` en el JSON. Con `--artifact`, solo de las capacidades del delta. La plantilla pide un comportamiento por requisito.
- **Retirada** (2ddf4383): `sdd capability merge` para antes de vaciar una capacidad; con `- Retiradas:` y motivo, borra el fichero. `check` acepta el fichero borrado. Plantillas y filas de deuda.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 0,63 h — reloj de la sesión 0,68 h desde 2026-10-31T20:30Z, sin 3 min de espera al dev-lead (1 espera)
- Desviación: -1,37 h (-69 %)
- Causa de la desviación: la estimación suponía la normalización de la migración y dos rondas de sujetos largas; la línea en blanco fue frente limpio y los sujetos, de un solo documento.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 17.287.923 — claude-opus-5-5 17.287.923
- Tokens de subagentes: 3.100.936 en 3 despachos — Final review — Code axis claude-sonnet-5-5 714.672 / 2 min; Re-review final fix pass claude-opus-5-5 622.374 / 2 min; Final review — Spec axis claude-opus-5-5 1.763.890 / 5 min
- Coste de la sesión: 11,85 $ (hilo 8,65 $ + subagentes 3,20 $)
- Coste de sujetos: 0,77 $ en 6 sujetos sonnet — RED y GREEN de migración y plantilla 0,77 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Enmienda: `v1.0.0.md` entra en el Scope, porque su nota de `legacy.md` no era la marca.
- Enmienda de la revisión final: `- Retiradas:` sin motivo falla.
- Los tests `check` de retirada viven en `merge.test.ts`, no en `check.test.ts`.

### Decisiones tomadas sin el dev-lead

- Las de `## Rulings` de [tasks.md](tasks.md), once líneas con su coste.
- `sdd-kit.json` fija `review.minors: fix`: los Minor entraron en la pasada de fix.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run cli:typecheck cli:test` → cli:typecheck: corrió · cli:test: corrió 1697/1709, 12 saltados por el propio test · sobre el commit de cierre. La pasada del gate declarado corre sobre el merge de sincronización, porque hay otra rama abierta: su línea `Gate:` va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-31 · suite de la CLI 1697 en verde · smoke 4/4 de los criterios de hecho con ejecución real · revisión final Spec y Código sobre 2ddf4383, re-revisión con los hallazgos atendidos

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un `capabilities/` con un documento marcado pasa `check` | ejecución real | `Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md`, salida 0 |
| El índice no lista lo marcado; solo marcado da `Sin capacidades` | ejecución real, suite | solo la línea de `bookings` |
| Marcado con escenarios sigue fallando | suite | test existente |
| Requisito de 501 da aviso y salida 0; 500 no avisa | ejecución real, suite | aviso literal, salida 0 |
| Fallo y aviso salen en orden, con salida 1 | suite | verde |
| `--artifact` solo avisa del delta | suite | verde |
| Marcado y puntero no avisan | suite | verde; la guarda se probó quitándola |
| `warnings` en el JSON | suite | verde |
| La plantilla pide un comportamiento por requisito y no recortar bajo `MODIFIED` | ejecución real (sujeto) | `green/plain`; el RED ya lo hacía |
| `REMOVED` que vacía, sin marcador, para sin cambiar ficheros | ejecución real | salida 1, fichero idéntico |
| Con `- Retiradas:` borra y `check` no falla | ejecución real | fichero borrado, `check` salida 0 |
| Le quedan requisitos, o sin motivo: para | suite | verde |
| Repetida con el fichero borrado: `ya estaba borrado` | ejecución real | salida 0 |
| Capacidad ya vacía: no para | suite | verde |
| Sin línea en blanco tras el título: pasa | suite | verde |
| Paso 7 no toca lo marcado | ejecución real (sujeto) | `red/marked`, sin diferencia antes y después del cambio |
| La verificación de la 3.0.0 propone la marca sin escribirla | ejecución real (sujeto) | `green/legacy`; `red/legacy` no la proponía |

### 4.3 Residuales / deuda generada

- 291 de 503 requisitos de este repo dan aviso (45 en las capacidades de esta spec): ruido aceptado en la decisión 1; palanca, subir el umbral.
- Filas «Esperar 2.º ticket» de la decisión 10.

## 5. Aprendizajes

- Un `MODIFIED` no puede copiar un requisito vivo con `<nombre>` entre comillas invertidas anidadas: `merge` lo lee como hueco → ticket de campo.
- Un molde de migración con un fichero vecino ya marcado enseña la respuesta al sujeto → ticket de campo.

## 6. Adendas
