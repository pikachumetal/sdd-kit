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

🦆 Hoy, al cerrar una feature, salen dos mensajes: el de `aviso-cierre` (qué se cierra, y corre el gate) y el de `resumen-cierre` (commits y filas del roadmap). Queda uno solo: `resumen-cierre`, que cuenta commits, lista filas, dice qué se cierra y corre el gate. Quien cierra ve lo mismo que antes, en un solo sitio, y el gate no se pierde.

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`; `quality-gate` — el gate corre en el paso 4 de `resumen-cierre`, no en el paso 2 de `aviso-cierre`.

## Decisiones que he tomado yo — valida estas

Prueba del delta (`sdd capability merge` sobre una copia en temp): sustituye «Quien cierra sabe qué se cierra» (`closing`), «El gate corre una sola vez» y «Un gate en rojo para el cierre» (`quality-gate`); sin rechazos.

Política de modelos: la de `delegate` del proyecto; ejecución `native`, sin review de spec.

Review de spec: ninguna — señales: `MODIFIED` (dos capacidades), nada más · tamaño: ~20 líneas en 5 ficheros. Mínimo razonable: es ya el mínimo.

1. `resumen-cierre` gana un paso 3, «Di qué se cierra», al final y no al principio: así no se renumeran sus pasos 1 y 2, que el requisito «El resumen va al final» de `closing` ya fija. Alternativa: abrir con él y modificar ese requisito. (El borrador decía «abre con»; lo he cambiado por esto.)
2. `aviso-cierre` también hace «Corre el gate» (paso 2), y `quality-gate` lo exige en dos requisitos («paso 2»). Retirar la skill sin moverlo quitaría el gate del cierre: pasa a `resumen-cierre` como paso 4, con el mismo comportamiento. Alternativa: quitar el gate de las skills, que elimina un comportamiento y no lo hago sin que lo decidas.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` gana el paso 3 (qué se cierra) y el paso 4 (corre el gate); al archivar se actualizan `capabilities/closing.md` y `capabilities/quality-gate.md`.
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| `aviso-cierre` como quien dice qué se cierra | `capabilities/closing.md:13` | MODIFIED: lo dice `resumen-cierre` |
| el paso 2 «Corre el gate» de `aviso-cierre` | `skills/aviso-cierre/SKILL.md:9`; `capabilities/quality-gate.md:18` y `:23` («paso 2») | pasa al paso 4 de `resumen-cierre`; MODIFIED en `quality-gate` |

- Filas que implementa: 0030 (`roadmap.md:9`) → la salda el cierre; `grep -rn 0030` no halla más en `.docs`, `README.md`, `skills/` ni `src/`

## Approach

`resumen-cierre` conserva sus pasos 1 y 2 y gana el paso 3 («Di qué se cierra») y el paso 4 («Corre el gate»); se borra `skills/aviso-cierre/`.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`.
- el gate: `node --test && node scripts/lint.mjs` (gate de cierre de `operations.md`), y que `skills/resumen-cierre/SKILL.md` tenga el paso 4.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra en su paso 3

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 4 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 4 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
