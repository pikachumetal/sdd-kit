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

- Nuevas: `reservas` — el repo aún no tiene su fichero en `capabilities/`; esta feature lo estrena con la regla de anular.
- Modificadas: (ninguna)

## Decisiones que he tomado yo — valida estas

1. Los responsables viven en `data/responsables.json` (`{"Norte": "Ana", "Sur": "Luis"}`), un responsable por sala, nombres comparados tal cual («ana» no es «Ana»). Sin capacidad propia: el fichero es un dato de `reservas`; gestionarlos (alta, baja, consulta) es de la fila 0009 «Responsables de sala», que no se toca aquí.
2. Quien ejecuta el comando se identifica con `--como <nombre>`. No autentica: cualquiera puede escribir `--como Ana`. Riesgo aceptado mientras la herramienta sea de un solo usuario.
3. `anular` es solo del responsable (PRODUCT: Anulación = la hace el responsable; Cancelación = la hace quien reservó, con `cancelar`). Quien reservó y no es responsable recibe el mismo rechazo que cualquiera (`cancelar` sigue siendo su vía, sin reglas por rol). Por eso las reservas **no** guardan `person` y `reservar` no cambia.
4. `reservas` va como capacidad nueva con un ADDED porque no hay base en `capabilities/` (el merge de la copia rechazó el MODIFIED); el resto del comportamiento de reservas no se documenta aquí. Cuando se documente, esta regla pasa a ser un requisito de esa base. Cambia un comportamiento vigente: hoy anula cualquiera, y eso deja de valer.
5. Orden de comprobaciones de `anular`: reserva existente → `--como` presente → fichero de responsables presente → sala con responsable → quien anula es el responsable. El rechazo nombra al responsable; no se oculta (un solo usuario).
6. Nombres en castellano (constitución 4, PRODUCT): capacidad `reservas`, fichero `responsables.json`.
7. PRODUCT dice «no hay más usuarios», pero la terminología ya habla del responsable de sala: está desactualizado. No lo toco aquí; queda para el dev-lead.
8. `responsables.json` mal formado: no se valida; `anular` falla con la excepción de JSON. Crash aceptado y explícito. El formato lo hereda la fila 0009.

### Hallazgos de la review

- **Aceptado** (Crítico) — `anular` por quien reservó contradecía el Scope, PRODUCT y las 24 h de la cancelación → decisión 3: `anular` solo del responsable; se quita la excepción de quien reservó.
- **Aceptado** (Crítico) — `person` y su relleno al reservar eran alcance oculto y sin datos para reservas antiguas → desaparece `person` con la decisión 3; `reservar` no cambia.
- **Aceptado** (Importante) — ADDED como rodeo de un MODIFIED → decisión 4 explica que no hay base y que pasará a MODIFIED al documentarla.
- **Aceptado** (Importante) — escenarios que faltaban → añadidos: sala sin responsable, fichero ausente, reserva inexistente, sin `--como`. Fichero mal formado: ver «No entra».
- **Aceptado** (Importante) — `room-managers` sin comportamiento observable → capacidad retirada; el fichero es dato de `reservas` (decisión 1). También evita pisar la fila 0009.
- **Aceptado** (Importante) — `--como` no autentica y PRODUCT dice un solo usuario → decisiones 2 y 7.
- **Aceptado** (Importante) — cinco reglas → sección «Reglas de la capacidad» y nombres en castellano (decisión 6).
- **Aceptado** (Importante) — contratos no declarados → Scope: los mensajes de `anular` y el formato de `<día>` no cambian; el único mensaje nuevo está en los escenarios.
- **Aceptado** (Menor) — orden de comprobaciones y nombre del responsable en el rechazo → decisión 5.
- **Rechazado** (Menor) — cambiar el aprobador «Laura» → el dev-lead lo fijó al abrir la feature; no es contenido de la spec.

### Segunda ronda

- **Aceptado** (Crítico) — `--como` obligatorio cambia el contrato de `anular` → Scope lo declara; `git grep anular` en `test/` no da ningún test que lo use, así que no hay tests que migrar.
- **Aceptado** (Importante) — decisión 3 y escenario de quien reservó decían cosas distintas → decisión 3 sin la remisión; se quita el escenario `--como Pedro` y «de Pedro» del GIVEN (sin `person` no probaban nada distinto de Luis).
- **Aceptado** (Importante) — el orden de la decisión 5 no se probaba → escenario «sin reserva» antes que «sin `--como`».
- **Aceptado** (Importante) — ADDED sobre un `anular` vigente → decisión 4 dice que sustituye el «anula cualquiera» actual.
- **Aceptado** (Importante) — JSON mal formado indefinido → decisión 8, crash aceptado.
- **Aceptado** (Importante) — un mismo nombre puede ser responsable de varias salas; `cancelar` no tiene reglas por rol → Reglas y decisión 3.
- **Aceptado** (Menor) — «Avisos: no aplica» → lista los rechazos.
- **Rechazado** (Importante) — separar el delta en un requisito por regla → es una sola regla con sus casos; el orden queda probado por los escenarios añadidos.
- **Rechazado** (Menor) — dueño de la contradicción con PRODUCT → ya es la decisión 7, para el dev-lead.
- **Rechazado** (Menor) — nombres de ejemplo → son inventados; «Laura» lo fijó el dev-lead.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anularlas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>` (`src/app.js`, `voidBooking` y `run`); `data/responsables.json` (carpeta `data/` nueva); tests en el nuevo `test/void.test.js`. Los mensajes ya existentes de `anular` («anulada …», «sin reserva …») y el formato de `<día>` no cambian; `--como` pasa a ser obligatorio en `anular` (contrato nuevo); ningún test actual llama a `anular`.
- No entra: `cancelar` (sigue igual), `reservar`, gestionar responsables (fila 0009), validar un `responsables.json` mal formado.

## Approach

`anular` aplica en este orden las comprobaciones de la decisión 5 leyendo `data/responsables.json`.

## Reglas de la capacidad

- Dónde vive el dato: `data/responsables.json`.
- Idioma de los nombres: castellano.
- Límites: un responsable por sala; un mismo nombre puede serlo de varias.
- Avisos: los rechazos de `anular`, con el texto exacto del Delta.
- Conflicto: coincidencia exacta del nombre; sin coincidencia, rechazo; las comprobaciones siguen el orden de la decisión 5.

## Delta de comportamiento

### Capacidad: `reservas`

**ADDED — Solo el responsable de la sala anula sus reservas**
- GIVEN `data/responsables.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun»
- AND `anular Norte lun` responde «indica quién anula con --como» y la reserva sigue activa
- AND `anular Norte mar --como Luis` responde «sin reserva Norte mar»
- AND `anular Norte mar` (sin `--como`) responde «sin reserva Norte mar»
- AND con `{"Sur": "Luis"}`, `anular Norte lun --como Ana` responde «Norte no tiene responsable» y la reserva sigue activa
- AND sin `data/responsables.json`, `anular Norte lun --como Ana` responde «no hay responsables definidos» y la reserva sigue activa

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
