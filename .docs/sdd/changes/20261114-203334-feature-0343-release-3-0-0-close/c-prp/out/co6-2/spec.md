---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (un requisito de `closing`) · tamaño: ~20 líneas en 3 ficheros
- Dominio (sonnet): si el MODIFIED de «Quien cierra sabe qué se cierra» choca con «El resumen va al final» y si el gate de cierre queda sin dueño (señal: MODIFIED)
- Técnica (sonnet): si los THEN y «Dónde se prueba» son comprobables y si queda alguna referencia a `aviso-cierre` (señal: MODIFIED)
- Mínimo razonable: solo técnica — deja sin mirar el choque con los requisitos de `closing` y de `quality-gate` que citan pasos

1. `resumen-cierre` gana un paso nuevo que dice qué se cierra (`aviso-cierre` lo decía en su paso 1). Su número depende de ✋ 3.
2. Enfoque: mover el «Di qué se cierra» a `resumen-cierre` y borrar `skills/aviso-cierre/`, frente a borrarla sin más (se pierde el aviso que pide `closing`) o a dejar `aviso-cierre` y vaciar `resumen-cierre` (no retira nada). Ver Approach.
3. **PENDIENTE — BLOQUEA LA APROBACIÓN.** El paso 2 de `aviso-cierre` era «Corre el gate». Retirarla deja sin sitio el gate de cierre que exigen la constitución (art. 2), `operations.md:11` y los dos requisitos de `quality-gate` («cuando llega el paso 2»). Opciones: **A (recomendada)** `resumen-cierre` gana el gate como paso 3 y «qué se cierra» pasa a paso 4, y `quality-gate` pasa a `MODIFIED` para citar `resumen-cierre`; **B** el gate se pide en otro sitio que decides tú. La spec no lo decide: lo decide el dev-lead, y con su respuesta se reescribe el Scope, el delta y la tabla.
4. Alcance decidido por mí: `aviso-apertura` no cambia (no cita `aviso-cierre`); `operations.md` y la constitución no se tocan (nombran el gate, no la skill); `skills/aviso-cierre/` solo contiene `SKILL.md`, se borra la carpeta entera; el proyecto no registra las skills en ningún manifiesto (`package.json` solo tiene `type` y `engines`).
5. «El resumen va al final» sigue intacto mientras los pasos 1 y 2 de `resumen-cierre` no cambien de orden; si ✋ 3 los mueve, entra como `MODIFIED`.
6. Política de modelos: revisores de la spec dominio sonnet + técnica sonnet (no toca roles ni reglas de negocio; se reevalúa tras ✋ 3) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte.
7. Coherencia: el merge del delta sobre una copia de `.docs/sdd` da «closing.md: sustituido «Quien cierra sabe qué se cierra»». Sin medir: `node --test && node scripts/lint.mjs` antes y después del cambio.

### Hallazgos de la review

- **Aceptado** — Crítico (los dos revisores): el gate queda sin dueño y `quality-gate` cuelga → ✋ 3 lo marca como bloqueante con opción recomendada; no la escribo en el delta hasta que el dev-lead responda.
- **Aceptado** — Crítico: el THEN pasa con cualquier frase y el AND es una comprobación de ficheros → el THEN dice que `resumen-cierre` incluye un paso que dice qué se cierra; el borrado pasa a Scope y a «Dónde se prueba».
- **Aceptado** — Crítico: «Dónde se prueba» era a ojo → ahora lleva comandos con resultado esperado.
- **Aceptado** — Importante: números de paso dados por decididos → quitados hasta ✋ 3.
- **Aceptado** — Importante: «El resumen va al final» y el título → ✋ 5.
- **Aceptado** — Importante: decisiones de alcance en el cuerpo → ✋ 4; `aviso-apertura`, `operations.md` y la constitución quedan en «No entra» con razón.
- **Aceptado** — Importante: referencias fuera de `skills/` → `git grep` en todo el repo y ausencia de manifiesto, en ✋ 4 y en la batería.
- **Aceptado** — Menor: fila del gate marcada como bloqueante; política de modelos a reevaluar tras ✋ 3.
- **Rechazado** — Importante/Menor: «`lint.mjs` no respalda nada» → `operations.md:11` fija `node --test && node scripts/lint.mjs` como gate de cierre; el lint solo mira tabuladores de `src/app.js`, no referencias a skills, y no se usa para eso.
- **Rechazado** — Menor: sustituir «Laura» por un rol → el aprobador viene del arranque de la spec y no es mío cambiarlo; lo señalo en el gate.
- Segunda vuelta de review: pendiente. Hay un Crítico aceptado, pero la corrección depende de ✋ 3; un revisor releerá la spec ya reescrita con la respuesta del dev-lead.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` dice también qué se cierra; `.docs/sdd/capabilities/closing.md` (el requisito cita `aviso-cierre`).
- No entra: cambiar `aviso-apertura`; tocar `operations.md` y la constitución; `quality-gate.md`, hasta que se decida el destino del gate (✋ 3).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| «Di qué se cierra» (paso 1 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:8` | pasa a `resumen-cierre`, paso nuevo |
| «Corre el gate» (paso 2 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:9`; `quality-gate.md:18` y `:23` («el paso 2»); `operations.md:11`; constitución art. 2 | **PENDIENTE, BLOQUEA LA APROBACIÓN** (✋ 3) |
| `aviso-cierre` en «Quien cierra sabe qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | lo sustituye el delta MODIFIED |
| fila 0030 | `ROADMAP.md:9` | la cierra `sdd-archive`; `README.md`, `CHANGELOG.md` y `PRODUCT.md` no la citan |

- Filas que implementa: 0030 (`Salda: nada`), comprobado con `git grep -niE "aviso-cierre|0030"` en todo el repo salvo esta carpeta.

## Approach

`resumen-cierre` acaba con un paso nuevo que dice lo que se cierra; los pasos 1 y 2 siguen igual (los fija el requisito «El resumen va al final»). Se borra `skills/aviso-cierre/`. El gate queda por decidir (✋ 3).

## Dónde se prueba

| Comprobación | Comando | Esperado |
| --- | --- | --- |
| la skill ya no existe | `test ! -e skills/aviso-cierre` | sale con 0 |
| nada la cita | `git grep -n "aviso-cierre" -- . ':!.docs/sdd/specs/20261008-150000-feature-0030-retire-close-notice'` | sin salida |
| `resumen-cierre` dice qué se cierra | `grep -n "se cierra" skills/resumen-cierre/SKILL.md` | una línea de paso |
| el gate de cierre del proyecto | `node --test && node scripts/lint.mjs` | verde, igual que antes |

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` incluye un paso que dice qué se cierra

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
