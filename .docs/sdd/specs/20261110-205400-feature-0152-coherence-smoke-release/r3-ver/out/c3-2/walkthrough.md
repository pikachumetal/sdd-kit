---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Walkthrough — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-11
---

# Walkthrough — Motivo al cancelar

## 1. Cambios realizados

- `cancelar <sala> <día> --motivo <motivo>` con la lista cerrada (cambio de planes, sala ocupada, otro): `src/app.js`, `test/cancel.test.js` (b968807).
- Comando `canceladas`, que enseña sala, día y motivo (51453e8).
- `canceladas` sin canceladas responde «sin canceladas», con su test (commit de cierre).
- Capacidad `bookings` creada en `.docs/sdd/capabilities/bookings.md` por la fusión del delta.

## 3. Desviaciones del plan

- Ninguna sobre el plan. Sí hay una enmienda de spec: el caso «sin canceladas» (ver Decisiones).

### Decisiones tomadas sin el dev-lead

- `canceladas` vacío responde «sin canceladas» (commit posterior a la última task): lo añadí yo con la implementación y la spec no lo decía; ahora está en «Enmiendas» y en la escena del listado — coste si está mal: cambiar una cadena y su test.
- `bookings` declarada «Nuevas» en vez de «Modificadas»: no había fichero en `capabilities/` que modificar — coste si está mal: renombrar o partir el fichero.
- `.gitattributes` con `* -text`: evita que `core.autocrlf` reescriba los finales de línea al commitear — coste si está mal: borrar el fichero.
- `sin revisar`: ninguno. La re-revisión cubrió el rango posterior a 51453e8; el fix del cierre lo revisé en el hilo (test y CRLF, ver `tasks.md`).

## 4. Verificación

### 4.1 Builds

- `node --test` entero: 6/6 en verde, ejecutado por mí sobre el commit de cierre.
- Gate: `node --test` → 6/6 · sobre el commit de cierre

### 4.2 Smoke / tests

- Validado: 2026-11-11 · «probé cancelar con motivo y sale en canceladas»
- Esa frase no cubre el caso «sin canceladas» ni el motivo inválido: los probé yo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)» | ejecución real (CLI) | ok — verificado por el agente |
| motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» | ejecución real (CLI, `--motivo "me aburro"`) | ok — verificado por el agente |
| sin `--motivo` responde lo mismo | ejecución real (CLI) | ok — verificado por el agente; sin test que lo fije |
| `canceladas` tras cancelar responde «Norte lun — sala ocupada» | ejecución real en un solo proceso (`run` importado) y suite | ok — verificado por el agente; el dev-lead lo reporta probado |
| `canceladas` sin canceladas responde «sin canceladas» | ejecución real (CLI) y suite (RED→GREEN) | ok — verificado por el agente |

### 4.3 Residuales / deuda generada

- Desde la CLI, `canceladas` nunca enseña una cancelación: las reservas viven en memoria y cada ejecución arranca de cero. Lo cubre la fila 0014 «Motivo guardado» del roadmap.
- Falta un test para «sin `--motivo`» (escena de la spec, ya en el código): deuda en «Por triar».
- Revisión final: Spec y Código limpias sobre 51453e8; re-revisión única del rango posterior a 51453e8 con 1 Important (sin test, arreglado) y 5 Minor (ver `tasks.md`).

## 5. Aprendizajes

- Con `core.autocrlf=true` un commit de código CRLF pasa a LF entero sin avisar → `.gitattributes`.
- La spec daba por hecha una capacidad inexistente; `sdd capability merge` lo detecta al cerrar, no al aprobar → sin cambio, ya lo caza el validador.

Retro: error que cazaría un chequeo → un `.gitattributes` con `* -text` (.gitattributes)

## 6. Adendas

- (ninguna)
