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

🦆 Hoy cualquiera puede anular cualquier reserva. Con este cambio, solo el responsable de cada sala la anula: Ana en Norte y Luis en Sur. Quien anula dice su nombre; si no es el responsable de esa sala, no se anula nada y el programa le dice quién sí puede. El dueño de una reserva, como Pedro, sigue cancelándola con «cancelar», que no cambia. Los responsables salen de un fichero nuevo, y si falta o está mal escrito, no se anula nada.

## Capacidades

- Nuevas: `responsables-de-sala`, `reservas`

`responsables-de-sala` dice quién es responsable de cada sala. `reservas` no tiene fichero en `capabilities/`: nace **parcial**, solo con el requisito de anular; reservar y cancelar quedan fuera y se documentarán cuando se toquen.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`responsables-de-sala`, `reservas`), contrato público (flag `--como` de `anular` y formato de `data/managers.json`), cambio de comportamiento existente (hoy cualquiera anula; MODIFIED en sustancia aunque el delta use ADDED), datos (`data/managers.json`, dueño de la reserva), reglas de visibilidad (quién no puede anular) · tamaño: ~60 líneas en 5 ficheros
- Dominio (opus): qué pasa cuando anula quien no es responsable pero es dueño de la reserva, y sin `--como` (señal: reglas de visibilidad)
- Técnica (sonnet): si `data/managers.json` y la firma `voidBooking(room, day)` de `src/app.js` cubren el dueño de la reserva, que hoy no se guarda (señal: contrato público + datos)
- Mínimo razonable: solo dominio — deja sin mirar el formato del fichero de responsables y el dato del dueño, que hoy no existe

1. Capacidad nueva `responsables-de-sala`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`, un responsable por sala; una persona puede serlo de varias). El cambio crea el fichero.
2. Quien ejecuta `anular` se identifica con `--como NOMBRE`: **obligatorio**, comparación exacta (distingue mayúsculas). `--como` declara, no autentica: cualquiera puede escribir el nombre de otro. Es un límite aceptado, no una protección.
3. `reservas` nace como capacidad nueva y **parcial** porque `capabilities/` no existe: la pasada de coherencia probó el delta en una copia y `sdd capability merge` rechazó el `MODIFIED`; con `ADDED` y la capacidad en «Nuevas», el merge sale limpio.
4. Política de modelos: perfil `delegate`, ejecución Native; la review de spec lleva dominio en Opus (hay rol de responsable) y técnica en Sonnet, y una segunda ronda de un revisor Sonnet con los siete puntos, porque se aceptaron Críticos.
5. **El dueño no anula, cancela.** `anular` lo ejecuta solo el responsable de la sala; el dueño de la reserva sigue usando `cancelar`, que no cambia. Si el dueño lanza `anular` sobre su reserva, se le rechaza como a cualquiera que no es responsable.
6. La reserva guarda su dueño (`owner`). La reserva de ejemplo de hoy pasa a tener dueño Pedro. Una reserva sin dueño la anula igualmente solo el responsable.
7. Sala sin responsable: nadie la anula (rechazo). Fichero de responsables ausente, con JSON inválido o con forma incorrecta (un valor que no es texto): error explícito y la reserva sigue activa.
8. El nombre del responsable en el mensaje de rechazo es público: es una oficina pequeña y a quien rechazan le sirve saber a quién pedírselo.
9. Se actualiza «Product Purpose» de `PRODUCT.md`: deja de decir que lo usa una sola persona. Los códigos de salida no cambian: un rechazo de `anular` imprime su mensaje y termina con código 0, como hoy `cancelar` con «sin reserva». Es un límite aceptado: un script no distingue una anulación fallida.
10. Los identificadores de capacidad van en castellano (PRODUCT.md manda evitar «booking» y «room» en la documentación); el código sigue con sus nombres actuales.
11. `voidBooking(room, day)` pasa a `voidBooking(room, day, who, managers)`; su único llamador es `run` en `src/app.js`. `managers` se inyecta para que los tests no dependan del fichero; `run` lo lee de `data/managers.json`, resuelto desde la raíz del repo, no desde el directorio de trabajo.
12. Las cinco reglas de «Reglas de la capacidad» son decisiones mías, no valores de la constitución: esta solo fija el idioma (punto 4); datos, límites, avisos y conflicto salen de esta spec.

### Hallazgos de la review

- **Aceptado** (técnica 1, dominio 2) — las reservas no guardan dueño → decisión 6, Scope y requisito de `reservas`.
- **Aceptado** (técnica 2, dominio 3) — faltan sin `--como`, sala sin responsable, responsable de otra sala → escenarios añadidos.
- **Aceptado** (dominio 1, técnica 4) — ambigüedad entre dueño y cancelación → decisión 5 y escenario.
- **Aceptado** (técnica 3) — el WHEN de `responsables-de-sala` no nombraba operación → `responsableDe(sala)`.
- **Aceptado** (técnica 5, 6) — contrato de `--como` y de `managers.json` → decisiones 1, 2, 7, 11.
- **Aceptado** (técnica 7) — `reservas` parcial → declarado en Capacidades.
- **Aceptado** (dominio 4, 5) — «Reglas de la capacidad» añadidas, sala sin responsable resuelta.
- **Aceptado** (técnica 9, dominio 6) — nombres en castellano → decisión 10.
- **Aceptado** (dominio 7) — Product Purpose y límite de `--como` → decisiones 2 y 9.
- **Aceptado** (dominio 8, 9) — nombre público declarado (8); escenario de cancelación propia añadido.
- **Aceptado** (técnica 8) — firma de `voidBooking` y llamadores → decisión 11. El tamaño del bloque de review se corrigió.
- Segunda ronda (un revisor Sonnet, sin tercera):
  - **Aceptado** (1, Crítico) — un requisito con cuatro comportamientos → separado en escenarios independientes.
  - **Aceptado** (2, Crítico) — «El dueño cancela» era ADDED sobre una operación fuera del Scope → sale del delta y queda como test de regresión en el Scope.
  - **Aceptado** (3, Crítico) — `owner` sin comportamiento verificable → requisito «La reserva guarda su dueño» con escenario con y sin dueño.
  - **Rechazado** (4) — ADDED para que pase el merge → no hay fichero de `reservas` que modificar, así que un `MODIFIED` no existe; registrar antes el baseline de reservar y cancelar amplía el alcance. Queda declarado en la decisión 3 y en el rótulo del requisito.
  - **Aceptado** (5) — reglas que no vienen de la constitución → decisión 12.
  - **Aceptado** (6) — códigos de salida → decisión 9 lo declara como límite aceptado.
  - **Aceptado** (7) — fichero ausente e inválido → dos escenarios; forma incorrecta cuenta como inválido.
  - **Aceptado** (8) — firma y ruta → Scope y escenario desde otro directorio.
  - **Aceptado** (9) — mayúsculas y `--como` vacío → escenarios añadidos.
  - **Aceptado** (10) — política de revisores unificada en la decisión 4.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anular reservas; el dueño de una reserva la cancela con `cancelar`, como hasta ahora.

## Scope

- Entra: `anular SALA DIA --como NOMBRE`; `data/managers.json` (nuevo); el dato `owner` en la reserva; `responsableDe(sala)`; actualizar «Product Purpose» de `PRODUCT.md`.
- Entra también: la firma `voidBooking(room, day, who, managers)` y que `data/managers.json` se resuelva desde la raíz del repo.
- Regresión (no es delta): `cancelar Norte lun` sigue respondiendo «cancelada Norte lun» con la reserva que ahora lleva dueño.
- No entra: cambiar `cancelar` (sigue sin identidad), `reservar` (no guarda dueño todavía: sigue siendo el stub de hoy), autenticar de verdad a quien usa `--como`.

## Approach

`anular` exige `--como`, lee los responsables (inyectados en los tests, de `data/managers.json` en `run`) y solo anula si `--como` es el responsable de la sala.

## Reglas de la capacidad

Para `responsables-de-sala` y `reservas`:

- **Dónde viven los datos:** responsables en `data/managers.json`; el dueño en la reserva (`owner`).
- **Idioma de los nombres:** castellano en capacidades y mensajes (constitución, punto 4).
- **Límites:** un responsable por sala; una persona puede serlo de varias salas.
- **Avisos:** los rechazos dicen el motivo y la reserva queda como estaba.
- **Regla ante conflicto:** sala sin responsable → nadie anula; fichero ausente o inválido → error y nada se anula.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — Cada sala tiene un responsable**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN se llama a `responsableDe('Norte')`
- THEN devuelve «Ana»
- AND `responsableDe('Este')` devuelve «sin responsable»

**ADDED — Sin fichero de responsables no se anula nada**
- GIVEN que `data/managers.json` no existe
- WHEN `anular Norte lun --como Ana`
- THEN responde «no se puede leer data/managers.json» y la reserva sigue activa

**ADDED — Un fichero de responsables inválido no anula nada**
- GIVEN `data/managers.json` con JSON inválido, o con un valor que no es texto
- WHEN `anular Norte lun --como Ana`
- THEN responde «data/managers.json no es válido» y la reserva sigue activa

### Capacidad: `reservas`

**ADDED — La reserva guarda su dueño**
- GIVEN la reserva de Norte del lunes, con dueño Pedro, y una reserva de Sur del martes sin dueño
- WHEN se consulta el dueño de cada una
- THEN la de Norte tiene dueño Pedro y la de Sur no tiene dueño

**ADDED — Anular una reserva** (cambia en la práctica el comportamiento actual del código, sin requisito previo en `capabilities/`)
- GIVEN la reserva de Norte del lunes, con dueño Pedro, y responsables `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Ana`
- THEN responde «anulada Norte lun» y la reserva queda anulada

**ADDED — Solo el responsable anula**
- GIVEN la reserva de Norte del lunes, con dueño Pedro, y responsables `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — El dueño no anula su reserva**
- GIVEN la reserva de Norte del lunes, con dueño Pedro, y responsables `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Pedro`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — La identidad distingue mayúsculas**
- GIVEN la reserva de Norte del lunes y responsables `{"Norte": "Ana"}`
- WHEN `anular Norte lun --como ana`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa

**ADDED — Anular exige identificarse**
- GIVEN la reserva de Norte del lunes
- WHEN `anular Norte lun` sin `--como`, o con `--como` sin nombre
- THEN responde «anular necesita --como y un nombre» y la reserva sigue activa

**ADDED — Sala sin responsable**
- GIVEN una reserva de Este del martes y ningún responsable de Este
- WHEN `anular Este mar --como Ana`
- THEN responde «Este no tiene responsable» y la reserva sigue activa

**ADDED — Los responsables se leen desde la raíz del repo**
- GIVEN `data/managers.json` en la raíz del repo y la reserva de Norte del lunes
- WHEN `anular Norte lun --como Ana` se ejecuta desde otro directorio de trabajo
- THEN responde «anulada Norte lun»

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
