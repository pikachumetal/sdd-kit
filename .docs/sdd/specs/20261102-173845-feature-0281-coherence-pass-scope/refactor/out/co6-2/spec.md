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

🦆 Hoy, al cerrar una feature, salen dos mensajes: uno dice qué se cierra y corre el gate, y otro cuenta los commits y lista las filas del roadmap. Tras este cambio sale uno solo: primero dice qué se cierra, luego corre el gate, luego cuenta los commits y lista las filas, por ejemplo «Se cierra la 0030 · gate en verde · 4 commits · saldada la fila 0030». El primer mensaje desaparece y sus dos pasos se pasan al segundo, sin perder el gate. Las reglas de cierre que citaban los pasos por número se renumeran.

## Capacidades

- Modificadas: `closing` — el aviso de cierre y el resumen son un solo mensaje, el de `resumen-cierre`.
- Modificadas: `quality-gate` — el paso del gate pasa a ser el paso 2 de `resumen-cierre`.

## Decisiones que he tomado yo — valida estas

Review de spec: ninguna — señales: `MODIFIED` (3 requisitos en 2 capacidades) · tamaño: ~15 líneas en 5 ficheros. Con una sola señal no se propone review.

Política de modelos: ninguna review de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Prueba del delta en una copia de `.docs/sdd` fuera del repo (`sdd capability merge`): sustituidos 4 requisitos — `closing`: «Quien cierra sabe qué se cierra», «El resumen va al final»; `quality-gate`: «El gate corre una sola vez», «Un gate en rojo para el cierre». Sin rechazos; las capacidades del repo no cambian.

1. `resumen-cierre` gana una línea con lo que se cierra (tu decisión del arranque).
2. **El gate no se pierde.** `aviso-cierre` tenía como paso 2 «Corre el gate», y `quality-gate` lo cita como «el paso 2», sin nombrar la skill. Si solo se borra la skill, el cierre deja de correr el gate. Lo paso a `resumen-cierre`.
3. **Orden de `resumen-cierre`:** 1 di qué se cierra · 2 corre el gate · 3 cuenta los commits · 4 lista las filas. Alternativa que descarto: añadir los dos pasos al final y no renumerar nada. Un gate después del resumen ya no es el gate «del cierre» y su rojo no pararía nada.
4. Por el nuevo orden, `El resumen va al final` pasa de «paso 1 / paso 2» a «paso 3 / paso 4», y los dos requisitos de `quality-gate` nombran `resumen-cierre`.
5. La fila 0030 del roadmap la salda `sdd-archive` al cerrar; esta feature no la toca.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Al juntarlos no puede perderse nada de lo que hacía la skill que se retira: ni decir qué se cierra, ni correr el gate.

## Scope

- Entra:
  - se retira `skills/aviso-cierre/`;
  - `skills/resumen-cierre/SKILL.md` gana los pasos 1 (qué se cierra) y 2 (corre el gate), y los dos que tenía pasan a 3 y 4;
  - `.docs/sdd/capabilities/closing.md`: dos requisitos `MODIFIED`;
  - `.docs/sdd/capabilities/quality-gate.md`: dos requisitos `MODIFIED`.
- No entra: cambiar `aviso-apertura`; la fila 0030 del roadmap (la salda `sdd-archive`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| su paso 1 «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | paso 1 de `resumen-cierre` |
| su paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md` | paso 2 de `resumen-cierre` |
| `aviso-cierre` en el requisito «Quien cierra sabe qué se cierra» | `capabilities/closing.md` | `MODIFIED`: dice `resumen-cierre` |
| «paso 1» y «paso 2» de `resumen-cierre` | `capabilities/closing.md`, requisito «El resumen va al final» | `MODIFIED`: pasan a «paso 3» y «paso 4» |
| «el paso 2» (sin nombrar skill) | `capabilities/quality-gate.md`, requisitos «El gate corre una sola vez» y «Un gate en rojo para el cierre» | `MODIFIED`: «el paso 2 de `resumen-cierre`» |
| «paso 2 de `aviso-apertura`» | `capabilities/closing.md`, requisito «La apertura avisa de la rama» | sin cambio: es la apertura |
| fila 0030 | `roadmap.md` | la salda `sdd-archive` |

- Filas que implementa: 0030 → `roadmap.md`, fila 0030 («Retirar la skill aviso-cierre»), comprobado con `grep -rn 0030 .docs README.md`. Sin más hits en `README.md`, `PRODUCT.md`, `scripts/`, `src/` ni `test/`.

## Approach

`resumen-cierre` abre con lo que se cierra y corre el gate; sus dos pasos de ahora siguen detrás, renumerados. El resto de la skill sigue igual.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`, con sus cuatro pasos en ese orden.
- el gate: un cierre con un test en rojo para en el paso 2, antes de contar commits.

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

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 2 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 2 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
