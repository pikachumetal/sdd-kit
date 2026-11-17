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

🦆 Hoy, al cerrar una feature, salen dos mensajes: uno dice qué se cierra y corre el gate, y otro cuenta los commits y lista las filas del roadmap. Tras el cambio sale uno solo: «Se cierra: Retirar la skill aviso-cierre», luego el gate, luego «3 commits» y «fila 0030». Para quien cierra, el gate sigue corriendo una sola vez y en el mismo orden relativo. Por dentro, la skill `aviso-cierre` se borra y sus dos pasos pasan a ser los dos primeros de `resumen-cierre`.

Validación: agente — es un cambio en textos de skills sin pantalla; el gate (`node --test && node scripts/lint.mjs`) y la lectura de la salida de `resumen-cierre` lo cubren.

## Capacidades

- Modificadas: `closing` — el aviso de cierre y el resumen son un solo mensaje que da `resumen-cierre`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (dos requisitos de `closing`) · tamaño: ~15 líneas en 3 ficheros
- Dominio: no hace falta; el delta toca dos requisitos de `closing` y no introduce roles ni reglas nuevas (señal: `MODIFIED`)
- Técnica: no hace falta; no hay contrato público, datos ni dependencias
- Mínimo razonable: ninguna — deja sin mirar que alguna referencia a un paso numerado de `resumen-cierre` se me haya escapado (la búsqueda de «paso N» en `capabilities/` ya está hecha y vive en la tabla de abajo)

1. **El gate se muda, no se pierde.** El Intent decía que las dos skills «dicen casi lo mismo», pero `aviso-cierre` tiene un segundo paso, «Corre el gate», que `resumen-cierre` no tiene y del que cuelgan dos requisitos de `quality-gate` («llega el paso 2»). Lo paso a `resumen-cierre` como paso 2, para que «el paso 2» de `quality-gate` siga siendo el gate sin tocar esa capacidad. La alternativa, dejar el gate fuera, deja esos dos requisitos sin nada que los ejecute.
2. **Orden nuevo de `resumen-cierre`:** 1 Di qué se cierra · 2 Corre el gate · 3 Cuenta los commits de la rama · 4 Lista las filas del roadmap que salda. Es lo que implica «abre con lo que se cierra» y «el resumen va al final» (los pasos viejos 1 y 2 pasan a 3 y 4).
3. **Requisito `El resumen va al final`** pasa a `MODIFIED` por la renumeración (pasos 3 y 4); el título no cambia.
4. **Texto de «qué se cierra»:** la línea de `resumen-cierre` conserva el literal de `aviso-cierre`, «Di qué se cierra.». No invento otro.
5. **Descripción de `resumen-cierre`** pasa de «Usar al acabar el cierre de una feature.» a «Usar al cerrar una feature.» (la de `aviso-cierre`), porque ahora corre desde el principio del cierre y no al acabarlo.
6. **La fila 0030 de `roadmap.md`** la mueve el cierre de la feature, no esta spec. La búsqueda inicial («nada») era falsa: ver la tabla.
7. **Validación `agente`**, no dev-lead (ver arriba): nada que una persona observe y el agente no mida.
8. Resultado de `capability merge` sobre una copia en carpeta temporal: `closing.md: sustituido «Quien cierra sabe qué se cierra»` y `closing.md: sustituido «El resumen va al final»`, sin rechazos. El `capabilities/` del repo no cambia hasta el cierre.
- Política de modelos: ninguno (sin revisores de la spec) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- (ninguna: el perfil `delegate` viene de `sdd-kit.json` y la spec aún no está aprobada por delegación)

## Intent

Al cerrar una feature se lanzan dos skills y nadie lee la segunda; quien cierra quiere un solo mensaje. Las dos no dicen lo mismo: `aviso-cierre` dice qué se cierra y corre el gate, `resumen-cierre` cuenta commits y filas. Éxito: al cerrar sale un solo mensaje que cubre las cuatro cosas, el gate corre una sola vez y ninguna capacidad nombra ya `aviso-cierre`. Fracaso aunque «funcione»: que el gate deje de correr, o que `quality-gate` apunte a un paso que ya no es el gate.

## Scope

- Entra: se borra `skills/aviso-cierre/`.
- Entra: `skills/resumen-cierre/SKILL.md` pasa a tener cuatro pasos (decisión 2) y la descripción de la decisión 5.
- Entra: `.docs/sdd/capabilities/closing.md` por el delta (dos `MODIFIED`).
- No entra: cambiar `aviso-apertura` ni su «paso 2» citado en `closing`.
- No entra: tocar `quality-gate`; su «paso 2» sigue siendo el gate (decisión 1).
- No entra: mover la fila 0030 del roadmap (la mueve el cierre).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | Scope: se borra |
| `aviso-cierre` como quien dice qué se cierra | `capabilities/closing.md:13` | delta: `MODIFIED` «Quien cierra sabe qué se cierra» |
| su paso 1 «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | decisión 2: paso 1 de `resumen-cierre` |
| su paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md` | decisión 1: paso 2 de `resumen-cierre` |
| «paso 1 cuenta los commits» y «paso 2 lista las filas» (pasan a 3 y 4) | `capabilities/closing.md:25-26` | delta: `MODIFIED` «El resumen va al final» |
| «llega el paso 2» y «el paso 2 con un test en rojo» | `capabilities/quality-gate.md:18,22` | se quedan: el paso 2 sigue siendo el gate (decisión 1) |
| «el paso 2 de `aviso-apertura`» | `capabilities/closing.md:18` | se queda: es otra skill |
| descripción de `resumen-cierre` | `skills/resumen-cierre/SKILL.md:3` | decisión 5 |
| fila 0030 | `roadmap.md:9` | la mueve el cierre (decisión 6) |

- Filas que implementa: 0030 → `.docs/sdd/roadmap.md:9`, destino arriba. Comprobado con `grep -rniE "aviso-cierre|0030" . --exclude-dir=.git`: ni `README.md`, ni `PRODUCT.md`, ni `package.json`, ni `scripts/`, ni `src/`, ni `test/` la nombran.

## Approach

`resumen-cierre` pasa a ser el único mensaje de cierre y abre con lo que se cierra: «Di qué se cierra.», «Corre el gate.», y después sus dos pasos de hoy, renumerados. La capacidad `closing` dice lo mismo con los pasos nuevos. Cómo se redacta cada línea queda para el plan.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre` (cuatro pasos, en ese orden), como se probaba antes con `aviso-cierre`.
- que ninguna capacidad ni skill nombre `aviso-cierre`: con `grep -rn aviso-cierre skills .docs/sdd/capabilities`, que debe salir vacío.
- que el gate sigue corriendo una vez: `node --test && node scripts/lint.mjs` en verde.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 3 cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
