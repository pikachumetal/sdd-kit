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

🦆 Hoy cualquiera puede anular cualquier reserva: `anular Norte lun` responde `anulada Norte lun` sin preguntar quién eres. Con esta feature, `anular Norte lun --como responsable` sigue anulando y `anular Norte lun --como cliente` responde `solo el responsable de sala puede anular` y deja la reserva activa. Además, el listado nuevo `anuladas --como responsable` enseña `Norte lun — anulada por responsable`, y con `--como cliente` solo `Norte lun — anulada`, sin quién. Por dentro, `voidBooking` en `src/app.js` recibe el rol y guarda quién anuló.

Validación: dev-lead — lo que usa una persona (la salida de `anular` y `anuladas`); el agente no se concede el atajo. «Cliente» y «responsable» son un valor de `--como`, no personas: la app no tiene usuarios.

## Capacidades

- Nuevas: `bookings` — las reservas de salas; arranca con anular una reserva y ver las anuladas (hoy ninguna capacidad las describe: `capabilities/` no existe).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED, reglas de visibilidad o permiso, datos (quién anula), contrato público (la salida de `anular`) · tamaño: ~60 líneas en 3 ficheros
- Dominio (opus): que el cliente no pueda anular ni ver quién anuló (señal: permiso)
- Técnica (sonnet): que `anuladas` no rompa el formato de salida actual (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir la segunda lente en paralelo
```

1. El rol sale de `--como <cliente|responsable>`: la app no tiene usuarios.
2. El cliente ve en `anuladas` la reserva anulada sin quién la anuló: `Norte lun — anulada`.
3. `bookings` es una capacidad nueva, en inglés kebab-case: ninguna capacidad existente describe las reservas, y `anular` ya existe en el código sin rol. El delta pasa de `MODIFIED` a `ADDED` porque no hay requisito vivo que sustituir.
4. Las reservas no tienen dueño (`{ room, day, slot, status }`), así que «de otros» no se puede distinguir de «de uno mismo»: el cliente no anula ninguna, ni la suya. Es más estricto que la fila 0011 del roadmap («solo el responsable anula reservas de otras personas»); si quieres que el cliente anule las suyas, hace falta un dueño y es otra feature.
5. Sin `--como`, el rol es cliente (lo seguro): `anular Norte lun` responde `solo el responsable de sala puede anular`. Rompe a quien hoy anula sin rol: es el cambio buscado.
6. Un `--como` con otro valor responde `rol no válido: usa cliente o responsable` y no cambia nada.
7. `anuladas` sin ninguna anulada responde `sin reservas anuladas`.
8. «Responsable de sala» es un rol global, no uno por sala: el roadmap dice «de cada sala», pero la app no tiene qué sala lleva quién.
9. `anuladas` es un comando nuevo con ese nombre; guarda el rol (`responsable`), no una identidad, y lo muestra como `anulada por responsable` con raya larga `—`, que es contrato de salida.
10. `anuladas` sin `--como` es cliente, y con un rol inválido responde `rol no válido: usa cliente o responsable`, igual que `anular`; el orden de comprobación es rol primero, reserva después.
11. Una reserva que no existe, ya anulada o cancelada responde `sin reserva <sala> <día>`, como hoy (`anular` solo ve reservas activas). `anuladas` las lista por orden de anulación. No hay reservas anuladas previas sin rol: viven en memoria.
12. Rompe el contrato actual: `anular Norte lun` sin rol respondía `anulada Norte lun` y ahora responde `solo el responsable de sala puede anular`. Es el cambio buscado, y al aprobar la spec lo apruebas expresamente.
- Política de modelos: revisores de la spec — dominio opus y técnica sonnet, ya ejecutados, y una segunda ronda con un revisor sonnet por el Crítico aceptado · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico · Delta, «Anular una reserva» · con `--como cliente`, `anuladas` enseñaba quién anuló, y la spec decía que el cliente no lo ve · AND nuevo: con `--como cliente`, `anuladas` lista `Norte lun — anulada`, y decisión 2.
- **Aceptado** — Importante · Scope · `anuladas` no estaba en «Dónde se prueba» · línea añadida.
- **Rechazado** — Menor · Approach · pedir un fichero de roles → la app no tiene usuarios (decisión 1).

### Hallazgos de la segunda ronda (un revisor sonnet, por el Crítico aceptado)

- **Aceptado** — Crítico · Delta y retiradas · `anular` sin rol pasa a rechazarse y quedaba oculto como `ADDED` → decisión 12 (cambio incompatible, aprobado expresamente al aprobar), fila de retiradas con la salida antigua, y el escenario de `anular` sin `--como`.
- **Aceptado** — Importante · «Anular una reserva» · «sigue activa» no era observable → el AND comprueba con `anuladas`.
- **Aceptado** — Importante · casos no cubiertos y orden · reserva inexistente, ya anulada, rol inválido con reserva inexistente → escenarios y decisiones 10 y 11.
- **Aceptado** — Importante · «Ver las reservas anuladas» · orden, `anuladas` sin rol o con rol inválido → escenarios y decisiones 9, 10 y 11.
- **Aceptado** — Importante · ✋ · decisiones sin listar (nombre del comando, rol guardado, raya larga, anuladas previas) → decisiones 9 a 11.
- **Aceptado** — Importante · 5 bis · faltaba «Reglas de la capacidad» → sección añadida, con las cinco reglas.
- **Rechazado** — Menor · Decisión 3 · cambiar `bookings` a `reservas` → el slug es un nombre de fichero y va en inglés kebab-case (`spec-template.md`); el castellano de la constitución rige la interfaz.
- **Aceptado** — Menor · Validación · «cliente» y «responsable» no son personas → aclarado.
- **Rechazado** — Menor · bloque de review y política de modelos → la forma del bloque la fija `review-spec.md`.
- **Aceptado** — Menor · números de línea → nombres de función y fecha del `grep`.

### Hallazgos del repaso de coherencia

- `capability merge` rechazaba el delta (`bookings` sin fichero y sin declarar en «Nuevas») → capacidad declarada nueva y delta en `ADDED` (decisión 3).
- Fusión de prueba en una copia de `.docs/sdd` (`sdd capability merge`): salió bien, `bookings.md` con «Anular una reserva», «Ver las reservas anuladas» y las cinco reglas; `capabilities/` del repo sin tocar.
- El GIVEN decía «de Ana», pero las reservas no tienen dueño → quitado (decisión 4).
- La spec no decía qué pasa sin `--como`, con un rol inválido ni con `anuladas` vacío → decisiones 5, 6 y 7.

## Intent

Hoy cualquiera anula cualquier reserva. El responsable de sala debe poder anular las de otros, y el cliente no. Éxito: `anular` con `--como cliente` nunca cambia una reserva, y el cliente no averigua quién anuló.

## Scope

- Entra: `anular` con `--como`, el listado nuevo `anuladas` y guardar quién anuló. Archivos: `src/app.js` (`voidBooking` y `run`) y `test/anular.test.js` (nuevo).
- No entra: `cancelar`, un dueño por reserva, un responsable por sala, `README.md` y `PRODUCT.md` (no nombran `anular`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `anular` sin rol, que hoy responde `anulada Norte lun` a cualquiera | `voidBooking` y `run` en `src/app.js` | delta, `ADDED` «Anular una reserva»; decisiones 5 y 12 (cambio incompatible) |
| Estado `voided` de la reserva | `voidBooking` en `src/app.js` | Scope: se guarda también quién anuló |

- Filas que implementa: 0011 → la fila 0011 de `.docs/sdd/roadmap.md` («solo el responsable de cada sala…») y su destino: decisiones 4 y 8, que lo precisan.
- Comprobado el 2026-11-05 con `grep -rniE "anular|anulad|void"`: solo aparece en `src/app.js` y en el roadmap.

## Approach

El rol llega por `--como`; sin él, cliente. `voidBooking` comprueba el rol antes de tocar la reserva y guarda quién anuló. `anuladas` lista las reservas anuladas y enseña quién anuló solo al responsable.

## Dónde se prueba

- Anular: por `run('anular', …)`, en `test/anular.test.js`, como `test/cancel.test.js`.
- El listado `anuladas`: por `run('anuladas', …)`, en `test/anular.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Anular una reserva

- GIVEN la reserva activa de Norte del lun
- WHEN `anular Norte lun --como responsable`
- THEN responde `anulada Norte lun` y la reserva queda anulada
- AND con `--como cliente` responde `solo el responsable de sala puede anular`, y `anuladas --como responsable` responde `sin reservas anuladas`
- AND sin `--como` responde `solo el responsable de sala puede anular` y la reserva sigue activa
- AND con `--como jefe` responde `rol no válido: usa cliente o responsable` y la reserva sigue activa, aunque la reserva no exista
- AND `anular Sur mar --como responsable`, sin reserva, responde `sin reserva Sur mar`; anular otra vez la ya anulada responde `sin reserva Norte lun`

#### ADDED — Ver las reservas anuladas

- GIVEN la reserva de Norte del lun anulada por el responsable
- WHEN `anuladas --como responsable`
- THEN lista `Norte lun — anulada por responsable`
- AND `anuladas --como cliente` lista `Norte lun — anulada`
- AND sin ninguna anulada responde `sin reservas anuladas`
- AND `anuladas` sin `--como` lista como cliente, y `anuladas --como jefe` responde `rol no válido: usa cliente o responsable`
- AND con Norte lun y Sur mar anuladas, en ese orden, `anuladas --como responsable` lista `Norte lun — anulada por responsable` y luego `Sur mar — anulada por responsable`, una por línea

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: en memoria, como las reservas (`operations.md`); quién anuló es un campo más de la reserva.
- **Idioma de los nombres**: castellano en la interfaz (constitución, art. 4: `anular`, `anuladas`, `cliente`, `responsable`); el slug `bookings` va en inglés porque es un nombre de fichero.
- **Límites**: no aplica.
- **Avisos**: los literales de los escenarios.
- **Regla ante conflicto**: rol primero, reserva después; sin rol, cliente.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
