---
id: 20261008-110000-feature-0011-void-others
feature: 0011
title: Anular reservas de otros
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Anular reservas de otros

## Capacidades

- Nuevas: `reservas` — cómo se anula una reserva (hoy no hay `capabilities/`; esta feature abre la capacidad con el único requisito que toca).
- Modificadas: ninguna.
- Dependencia: la capacidad de responsables de sala y su fichero, que define la 0009. Esta feature **no la define**: la consume. El permiso de anular es de la 0011, no de la 0009.

## Decisiones que he tomado yo — valida estas

1. **La 0011 va después de la 0009.** El borrador inicial creaba aquí los responsables y `data/managers.json`; pero la 0009 («Responsables de sala», pendiente) y `docs/config.md` ya le asignan esa capacidad y su fichero. Recomendado: la 0011 espera a la 0009 (fila `Tras: 0009` del ROADMAP, que se cambia en el plan) y usa el contrato que ella defina. Alternativa: absorber la 0009 aquí (feature más grande; habría que cerrar esa fila). Sin la 0009 construida, los tests de esta spec no tienen de dónde leer responsables: el plan de la 0011 no arranca la Task 1 hasta que la 0009 tenga su contrato (fichero, formato, cómo se consulta).
2. **Solo el responsable de la sala ejecuta `anular`**, sea de quien sea la reserva, incluida la suya. `PRODUCT.md` dice que la reserva va «a nombre de quien la pide», pero el código no guarda ese nombre (`src/app.js`) y no hay identidad que comparar; añadir propietario a la reserva sería otra feature. Cancelar la propia sigue siendo `cancelar` (Cancelación ≠ Anulación en `PRODUCT.md`).
3. **`--como <nombre>`** identifica a quien ejecuta (sin login, `operations.md`). Es una declaración, no una autenticación: cualquiera puede escribir el nombre del responsable. Aceptable en una herramienta de un solo usuario; queda dicho. Solo `anular` lo admite.
4. **Cambio incompatible**: `anular Norte lun` sin `--como` pasa a rechazarse. Es el cambio pedido; hoy no hay más usuarios del comando.
5. **Las cinco reglas de los datos nuevos:** dónde vive el responsable → lo fija la 0009 · idioma de los textos → castellano (constitución 4) · límites → el nombre se compara exacto, sensible a mayúsculas; `--como` sin valor cuenta como falta · avisos → el rechazo nombra al responsable, visible para cualquiera (una sola persona usa la herramienta) · conflicto → una sala, un responsable (0009); varios responsables, no aplica; una sala puede no tener ninguno.
6. **Orden de comprobaciones**: falta `--como` → sala sin responsable → no es el responsable → no hay reserva activa (`sin reserva …`, como hoy) → anula. Así un rechazo por permiso no revela si la reserva existe.
7. **Salida y forma de probarlo**: los rechazos son texto devuelto por `run`, como el resto de la app (sin código de salida nuevo). Los tests llaman a `run` en el mismo proceso (`run` devuelve el texto como cadena; solo el arranque lo imprime), porque las reservas viven en memoria; el estado se observa con `libres 10:00-12:00` (Norte sigue ocupada mientras la reserva está activa, y libre una vez anulada). Cómo se siembran reservas y responsables lo decide el plan.
8. **`bookings` → `reservas`**: id de capacidad en castellano (constitución 4; `PRODUCT.md` manda evitar «booking»). `anular` ya existía sin control (`voidBooking`): se le añade el control.
9. **Riesgos aceptados, para que Laura los vea**: (c) el rechazo nombra al responsable y, como `--como` es solo una declaración, le dice a quien quiera saltarse el control qué nombre escribir; aceptado por ser una sola persona la que usa la herramienta; (a) `cancelar` no comprueba de quién es la reserva, así que el control se puede esquivar con él; queda fuera (su motivo y reglas son de la 0010); (b) `PRODUCT.md` define la reserva con franja, pero `anular` y `findBooking` identifican por sala y día, como hoy; no se cambia aquí.

Política de modelos: delegate — la sesión implementa en Native; sin tasks que exijan otro modelo.

Resultado del merge del delta sobre una copia de `.docs/sdd`: añade `reservas.md` con los ocho requisitos, sin rechazos (repetido tras los cambios de las dos rondas de review).

### Hallazgos de la review

Review de spec propuesta: dos revisores — señales: capacidad nueva (`reservas`), contrato público (flag `--como` del CLI), reglas de permiso (responsable frente al resto) · tamaño: ~30 líneas en 2 ficheros
- Dominio (opus): premisa del propietario, franja y `cancelar` frente a `PRODUCT.md` (señal: reglas de permiso)
- Técnica (sonnet): que cada escenario sea ejecutable y observable sin la 0009 construida (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar quién queda sin poder hacer qué, el hueco que no se ve hasta que alguien accede a lo que no debía

- **Aceptado** (Crítico, técnica) — escenarios sin fixture porque la 0009 no existe → decisión 1 (dependencia bloqueante, `Tras: 0009`) y decisión 7 (siembra decidida en el plan).
- **Aceptado** (Crítico, técnica) — un escenario mezclaba rechazo y éxito → separados en dos.
- **Aceptado** (Importante, técnica) — «sigue activa»/«queda anulada» sin observable → decisión 7 (`libres`).
- **Aceptado** (Importante, técnica) — GIVEN sin preparación → los GIVEN dicen qué hay sembrado.
- **Aceptado** (Importante, técnica) — canal y código de salida → decisión 7.
- **Aceptado** (Importante, técnica) — casos sin escenario → `--como` sin valor, mayúsculas (decisión 5), reserva inexistente y orden de comprobaciones (decisión 6).
- **Aceptado** (Importante, técnica) — Intent distinto de la regla → Intent reescrito.
- **Aceptado** (Importante, técnica) — orden de comprobaciones sin decisión → decisión 6.
- **Aceptado** (Menor, técnica) — cambio incompatible del CLI → decisión 4.
- **Aceptado** (Menor, técnica) — merge sin evidencia → línea del merge arriba.
- **Aceptado** (Crítico, dominio) — premisa «no guardan quién» contra `PRODUCT.md` → decisión 2 reescrita.
- **Aceptado con matiz** (Crítico, dominio) — franja ausente en `anular` → no se cambia; riesgo aceptado 9b, porque añadirla es otra decisión de producto y el comando de hoy ya va por sala y día.
- **Aceptado con matiz** (Importante, dominio) — `cancelar` esquiva el control → riesgo aceptado 9a, no se mete en el Scope (es de la 0010).
- **Aceptado** (Importante, dominio) — ids en inglés → `reservas`; el de responsables lo fija la 0009.
- **Aceptado** (Importante, dominio) — solape con la 0009 y fila del ROADMAP → Scope y decisión 1.
- **Aceptado** (Importante, dominio) — las cinco reglas → decisión 5.
- **Segunda ronda (sin tercera):**
  - **Aceptado** (Crítico) — la 0009 sin contrato → decisión 1: el plan no arranca la Task 1 hasta que exista.
  - **Aceptado** (Crítico) — escenario de sala sin responsable → con franja y observable `libres`; una sala puede no tener responsable (decisión 5).
  - **Aceptado** (Importante) — escenario agrupado → separado en dos.
  - **Aceptado** (Importante) — rechazo por permiso sin revelar la reserva → escenario añadido.
  - **Aceptado** (Importante) — mayúsculas sin escenario → escenario `--como ana` añadido.
  - **Aceptado** (Importante) — el rechazo da el nombre a un impostor → riesgo 9c.
  - **Rechazado** (Importante) — título «de otros» frente a la regla → es el nombre de la fila del cliente; la decisión 2 dice lo que se implementa.
  - **Aceptado** (Menor) — usos y documentación → Scope.
  - **Aceptado** (Menor) — `run` devuelve cadena → decisión 7.
  - **Aceptado** (Menor) — recuento del merge → corregido.
- **Rechazado** (Importante, dominio) — escenario del responsable de otra sala → la regla es una comparación de nombre; «Luis» ya lo cubre y las dos salas del producto no dan para más fixtures.
- **Aceptado** (Importante, dominio) — reserva inexistente → decisión 6.
- **Aceptado** (Menor, dominio) — el rechazo nombra al responsable → decisión 5, avisos.
- **Rechazado** (Menor, dominio) — `PRODUCT.md` pasa a varios usuarios → su terminología ya define la Anulación por el responsable; el propósito no cambia.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular reservas de ella, de quien sean.

## Scope

- Entra: `anular Norte lun --como Ana` (sala, día, quién anula) en `src/app.js` (`run` y `voidBooking`); test nuevo `test/anular.test.js`; en `ROADMAP.md`, la fila 0011 con `Tras: 0009`.
- No entra: texto de uso o ayuda del CLI (no hay ninguno hoy); `docs/config.md` y `operations.md` (los responsables son de la 0009); `cancelar` (sigue igual); el fichero y la capacidad de responsables (0009); `CHANGELOG.md` (lo toca el corte de la release).

## Approach

`anular` pide a la capacidad de responsables (0009) el de la sala y rechaza si `--como` no coincide, en el orden de la decisión 6.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Solo el responsable de la sala anula una reserva**
- GIVEN la reserva activa de Norte del lunes de 10:00-12:00 y Ana como responsable de Norte
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y `libres 10:00-12:00` sigue sin ofrecer Norte

**ADDED — El responsable anula la reserva de su sala**
- GIVEN la reserva activa de Norte del lunes de 10:00-12:00 y Ana como responsable de Norte
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y `libres 10:00-12:00` ofrece Norte

**ADDED — Anular exige decir quién anula**
- GIVEN la reserva activa de Norte del lunes de 10:00-12:00
- WHEN `anular Norte lun` sin `--como`
- THEN responde «falta --como y el nombre» y `libres 10:00-12:00` sigue sin ofrecer Norte

**ADDED — Un `--como` vacío cuenta como falta**
- GIVEN la reserva activa de Norte del lunes de 10:00-12:00
- WHEN `anular Norte lun --como` (fin de argumentos) o `anular Norte lun --como ""`
- THEN responde «falta --como y el nombre» y `libres 10:00-12:00` sigue sin ofrecer Norte

**ADDED — El nombre se compara exacto**
- GIVEN la reserva activa de Norte del lunes de 10:00-12:00 y Ana como responsable de Norte
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y `libres 10:00-12:00` sigue sin ofrecer Norte

**ADDED — Una sala sin responsable no se anula**
- GIVEN una reserva activa de Sur del lunes de 10:00-12:00 y unos responsables en los que Sur no figura (solo Norte, de Ana)
- WHEN `anular Sur lun --como Ana`
- THEN responde «Sur no tiene responsable» y `libres 10:00-12:00` sigue sin ofrecer Sur

**ADDED — Un rechazo por permiso no revela si hay reserva**
- GIVEN Ana como responsable de Norte y ninguna reserva activa de Norte el martes
- WHEN `anular Norte mar --como Luis`
- THEN responde «solo Ana anula reservas de Norte», no «sin reserva Norte mar»

**ADDED — Sin reserva activa no hay nada que anular**
- GIVEN Ana como responsable de Norte y ninguna reserva activa de Norte el martes
- WHEN `anular Norte mar --como Ana`
- THEN responde «sin reserva Norte mar»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
