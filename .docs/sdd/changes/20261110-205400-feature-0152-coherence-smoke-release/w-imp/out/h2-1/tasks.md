---
id: 20261008-100000-feature-0010-cancel-reason
title: Tasks — Motivo al cancelar
spec: ./spec.md
plan: ./plan.md
created: 2026-11-12
---

# Tasks — Motivo al cancelar (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0010-cancel-reason`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Cancelar con motivo | done | b49c69d | revisión limpia (sin Important); Minors diferidos (ver ledger) |
| 2 | Listado de canceladas | done | — | 1 ronda de fix (test aislado), re-revisión limpia |

## Verificación por task

- [x] Task 1 — `node --test test/cancel.test.js`
- [x] Task 2 — `node --test test/cancel.test.js`

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Setup: Ruling: trabajo en la rama feature/0010-cancel-reason sin worktree nuevo — ya aísla de main y el usuario pidió implementar aquí — si falla, se crea un worktree después.
Setup: Ruling: el plan no fija Modelo/effort por task; uso sonnet + sdd-kit:effort-medium (prosa sin código en el plan, 1 fichero de src) — si falla, subo de nivel en el fix-loop.
Setup: Ruling: tasks.md se escribe sin commitear y entra en el commit de la Task 1 (la apertura ya está commiteada).
Preflight: Ruling: sin --motivo o motivo fuera de la lista se valida ANTES de buscar la reserva (la spec dice que sin --motivo responde error y no condiciona a que exista reserva; así los tests no dependen del orden) — cuesta ajustar un test si Laura prefiere «sin reserva» primero.
Preflight: Ruling: el test de `canceladas` depende del estado en memoria que deja el test de cancelar con éxito (no hay reset ni segunda reserva y la spec no pide uno); se declara en el propio test — cuesta un reset exportado si se quiere aislar.
Task 1: Ruling: revisión Approved, 0 Critical/Important, 3 Minor — el `=[` lo arreglé en el hilo antes de juntar; el CRLF del test NO quedó arreglado en el blob (ver minor diferido de Final) (diff vs base solo con cambios reales, 4/4 verde); el 3º (nada afirma que se guarde reason) lo cubre el test de canceladas de Task 2 — cuesta nada si falla.
Task 2: Ruling: el test es del hilo; lo corrijo diseñando el texto (import con query string = instancia con estado propio, verificado en frío) pero lo aplica un implementador nuevo (fix-loop: el hilo no commitea fixes) — sin código de producción nuevo.
Task 2: minor (deferred): `canceladas` sin canceladas devuelve cadena vacía (console.log imprime línea en blanco) — la spec no pide ese caso
Task 2: minor (deferred): una reserva cancelled sin reason saldría «— undefined»; cancelBooking siempre valida el motivo
Final: Ruling: Eje Arquitectura no — el plan no lo declara y el diff no cruza ninguna señal (la spec cita «datos», pero es un campo más en un array en memoria) — si falla, se pierde una lectura de fronteras sobre 2 ficheros
Final: Ruling: persistencia entre ejecuciones del CLI (cada proceso empieza de cero; `canceladas` en otro proceso sale vacío) — el estado en memoria ya existía en la base y la 0014 «Motivo guardado» es esa feature — si falla, el motivo no sirve por CLI hasta la 0014 (pedir confirmación al dev-lead)
Final: Ruling: mayúsculas/espacios en el motivo se rechazan — la lista es cerrada por decisión del dev-lead — coste: un motivo escrito distinto da error
Final: Ruling: `--motivo` antes de sala y día o sin valor — la spec fija `cancelar <sala> <día> --motivo <motivo>`; sin valor da «motivo no válido» — coste: mensaje poco claro con argumentos desordenados
Final: Ruling: orden de errores en `cancelar Sur mar` sin motivo («motivo no válido» antes que «sin reserva») — ya ruling del preflight, coherente con la spec — coste: un test si el dev-lead prefiere el otro
Final: Ruling: los dos tests antiguos de cancelar cambian — el AND de la spec («sin --motivo responde error») los obliga; los escribí yo en el hilo — no son RED modificados por el implementador — coste: ninguno
Final: Ruling: fronteras módulo (parseo y estado en app.js) — eje Arquitectura no sale (ruling anterior) — coste: lectura de fronteras sobre 2 ficheros
Final: Ruling: `canceladas` y las anuladas — fuera de alcance (0011), `voided` no se lista — coste: la 0011 decide si las muestra
Final: Ruling: el import con query re-ejecuta el top-level de process.argv — inocuo bajo `node --test` (comprobado: el test aislado pasa) — coste: ninguno
Final: minor (deferred): `canceladas` sin canceladas imprime línea en blanco; el eje Spec recomienda un mensaje antes del merge, pero el texto no lo fija la spec (lo valida el dev-lead)
Final: minor (deferred): ningún test fija que las anuladas no salgan de `canceladas` ni el formato con varias canceladas
Final: minor (deferred): test/cancel.test.js pasa de CRLF a LF en el blob y el diff lo marca entero
Final: minor (deferred): el test «cancelar una reserva activa con motivo» depende de que sea el primero en cancelar Norte lun (usar import aislado como el de canceladas)
Final: minor (deferred): `cancelar --motivo otro Norte lun` toma la sala «--motivo»; `reasonFrom` está entre funciones de dominio
Final: minor (deferred, spec): el primer escenario es ADDED pero cambia una salida existente (sería MODIFIED); decisiones numeradas 1 y 3; la decisión 3 cita «MODIFIED» — corregir al archivar

## Revisión

Revisión final: Spec opus+high, sí (0 Critical, 0 Important, 4 Minor) · Código sonnet+high, sí (0 Critical, 0 Important, 7 Minor) · Arquitectura no (plan), sobre 22e1637
