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

- Nuevas: `responsables-de-sala` — quién es responsable de cada sala.
- Nuevas: `reservas` — hoy no tiene fichero en `capabilities/`: nace con el comportamiento de anular.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`responsables-de-sala`, `reservas`), contrato público (`anular` exige `--como`), MODIFIED en el fondo (cambia el comportamiento vivo de `anular`), datos (`data/managers.json`), reglas de permiso (solo el responsable anula) · tamaño: ~20 líneas en 3 ficheros
- Dominio (opus): si «solo el responsable anula» deja dicho lo que NO puede hacer cada quien y qué pasa con la anulación abierta de hoy (señal: reglas de permiso + MODIFIED en el fondo)
- Técnica (sonnet): si los escenarios de `--como` y de `data/managers.json` se pueden probar sin escribir a mano el literal (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar el complemento del rol (lo que el responsable no puede hacer), el hueco que no se ve hasta que alguien anula lo que no debía
Política de modelos: revisores de la spec: dominio opus, técnica sonnet, segunda ronda sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`
Fusión del delta sobre una copia de `.docs/sdd`: añadidos 10 requisitos y 10 reglas en `responsables-de-sala` y `reservas`, sin rechazos.

1. Capacidad nueva `responsables-de-sala`, con los responsables en `data/managers.json` (`{"Norte": "Ana", "Sur": "Luis"}`), a mano; no hay comando para consultarlos ni editarlos. Ana y Luis son nombres inventados: el fichero entra al repo solo con esos ejemplos, y los responsables reales los pone el dev-lead a mano al desplegar.
2. Quien ejecuta el comando se identifica con `--como <nombre>`; la comparación distingue mayúsculas (`ana` no es `Ana`). Forma admitida: `--como <nombre>` en cualquier posición tras el comando, un solo valor; `--como=Ana` no se admite. Sin la opción, sin valor, con valor vacío o que empieza por `--`, `anular` se rechaza.
3. `reservas` entra como capacidad nueva (no hay fichero que modificar). Antes: `anular <sala> <día>` anulaba a cualquiera y respondía «anulada <sala> <día>». Después: solo lo hace el responsable de la sala, sin mirar de quién es la reserva; la respuesta de éxito no cambia. Supuesto, no verificado por la spec: las reservas no guardan quién las hizo (`src/app.js`); por eso no se distingue «de otros». Quien quiera soltar la suya usa `cancelar`, sin cambios; el plazo de 24 h de la Cancelación en PRODUCT.md queda fuera del Scope. `reservas` nace incompleta a propósito: reservar y cancelar no se documentan aquí.
4. Orden de validación, y por tanto qué mensaje gana cuando fallan dos cosas: `--como`, fichero de responsables, sala con responsable, quién es, reserva. Quien no es responsable no averigua si hay reserva.
5. Fallo cerrado: fichero ausente o ilegible, o sala sin responsable, no anulan nada.
6. Los mensajes son los literales de los escenarios.
7. La identidad de `--como` no se verifica: cualquiera puede escribir `--como Ana`. Límite aceptado: la herramienta es de confianza dentro de una oficina; la spec no promete autenticación.
8. Un responsable por sala. El fichero se lee en cada invocación desde `data/managers.json` junto a `src/`, sin depender del directorio de trabajo; `run` admite una ruta alternativa como parámetro opcional, para los tests. Se añade `data/` a la estructura de `architecture.md`.
9. Los rechazos salen por el mismo canal y con el mismo código de salida que el resto de mensajes de la herramienta (todo por salida estándar, código 0): no se cambia la convención.
10. Sin cambios en `cancelar`: el responsable no tiene ningún permiso especial en él.
11. **Para ti, Laura**: `PRODUCT.md` dice «No hay más usuarios», y esta feature supone varias personas con rol de responsable (la Terminología ya define la Anulación como la del responsable). Además define la Reserva «a nombre de quien la pide» y yo he comprobado que `src/app.js` guarda solo sala, día, franja y estado, sin nombre. No edito `PRODUCT.md` aquí: dime si lo enmiendas aparte o lo incluyo en el Scope.
12. **Para ti, Laura**: sala y día identifican una sola reserva, como ya hace `cancelar` (la franja existe en los datos pero ningún comando la usa). Si una sala puede tener varias franjas el mismo día, `anular` es ambiguo y hay que reabrir esto.

### Hallazgos de la review

Ronda 1:

- **Aceptado** — Crítico, dominio: falta «Reglas de la capacidad» → añadidas las cinco reglas en las dos capacidades.
- **Aceptado** — Crítico, dominio: `bookings` y `room-managers` usan términos que PRODUCT.md manda evitar y rompen la regla 4 → renombradas a `reservas` y `responsables-de-sala`.
- **Aceptado, elevado al gate** — Crítico, dominio: el Purpose de PRODUCT.md dice un solo usuario → decisión 11; no la resuelvo yo porque `PRODUCT.md` es del dev-lead.
- **Rechazado** — Importante, dominio: incluir la franja en `anular` → `cancelar` y `anular` identifican hoy por sala y día, y una sala tiene una reserva por día en el código; cambiarlo es otra feature.
- **Aceptado** — Importante, dominio y técnica: es un cambio de comportamiento vivo → decisión 3 (antes/después).
- **Aceptado** — Importante, dominio y técnica: cómo se consulta y edita el fichero → decisión 1; el escenario de `responsables-de-sala` pasa por `anular`.
- **Aceptado** — Importante, dominio: complemento del rol → escenarios de reserva ya anulada y decisión 10. **Rechazado** lo de «día pasado»: los días son `lun`, `mar`…, sin fecha.
- **Aceptado** — Importante, dominio y técnica: identidad no verificada → decisión 7.
- **Aceptado** — Importante, dominio y técnica: un responsable, mayúsculas, fichero malformado → decisiones 2, 5 y 8, y escenarios.
- **Aceptado** — Menor, dominio: marcador `<sala>` y nombres → sala `Este` concreta, nombres declarados inventados.
- **Aceptado** — Crítico, técnica: `managers.json` ausente o malformado → decisión 5 y escenario.
- **Aceptado** — Importante, técnica: `--como` vacío, orden de validación, sala desconocida → decisión 4 y escenarios.
- **Aceptado** — Importante, técnica: decisiones faltantes y ruta del fichero → decisiones 2, 6, 7, 8.
- **Rechazado** — Importante, técnica: código de salida y canal → decisión 9: todo el CLI imprime por salida estándar con código 0.
- **Rechazado** — Menor, técnica: fusionar `responsables-de-sala` en `reservas` → el fichero de responsables tiene reglas y límites propios, y un consumidor distinto en el futuro.


Ronda 2 (sin Críticos):

- **Aceptado** — Importante: reserva a nombre de quién y una reserva por sala y día sin verificar → comprobado en `src/app.js`; decisiones 11 y 12 para que Laura las valide.
- **Aceptado** — Importante: `Este` inalcanzable y escenario en la capacidad equivocada → GIVEN con `managers.json` sin Sur, y el escenario pasa a `responsables-de-sala`.
- **Aceptado** — Importante: orden de validación sin prueba → dos escenarios nuevos en `reservas`.
- **Aceptado** — Importante: fichero ilegible en un solo escenario → tres, con literales.
- **Aceptado** — Importante: Scope sin el parámetro de `run` ni los tests → añadidos; no hay texto de uso que tocar.
- **Aceptado** — Importante: datos de ejemplo como dato vivo → decisión 1.
- **Aceptado** — Menor: anulada y cancelada separadas, con `managers.json` en el GIVEN; el literal «sin reserva <sala> <día>» ya existe en `src/app.js`.
- **Aceptado** — Menor: forma de `--como` → decisión 2. `reservas` incompleta y plazo de 24 h → decisión 3.

## Intent

Hoy cualquiera anula cualquier reserva. Solo el responsable de cada sala debe poder anularlas.

## Scope

- Entra: `anular <sala> <día> --como <nombre>`; `data/managers.json` con ejemplos inventados; el parámetro opcional de ruta de `run`; los tests; una línea de `data/` en `architecture.md`.
- No entra: `cancelar`, que sigue igual; un comando para consultar o editar responsables; verificar la identidad; `PRODUCT.md` (decisión 11).

## Approach

`anular` valida en el orden de la decisión 4: lee `data/managers.json` y rechaza a quien no es responsable de la sala.

## Delta de comportamiento

### Capacidad: `responsables-de-sala`

**ADDED — El responsable de una sala es el que figura en el fichero**
- GIVEN `data/managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva activa de Sur del martes
- WHEN `anular Sur mar --como Luis`
- THEN responde «anulada Sur mar»
- AND `anular Sur mar --como luis` responde «solo Luis anula reservas de Sur»

**ADDED — Sin fichero no se anula**
- GIVEN `data/managers.json` ausente y la reserva activa de Norte del lunes
- WHEN `anular Norte lun --como Ana`
- THEN responde «no se puede leer data/managers.json» y la reserva sigue activa

**ADDED — Un fichero roto no se anula**
- GIVEN la reserva activa de Norte del lunes y `data/managers.json` con el contenido `{` , o `{"Norte": ["Ana","Luis"]}`, o `{"Norte": ""}`
- WHEN `anular Norte lun --como Ana`
- THEN en los tres casos responde «no se puede leer data/managers.json» y la reserva sigue activa

**ADDED — Una sala sin responsable no se anula**
- GIVEN `data/managers.json` con `{"Norte": "Ana"}` y la reserva activa de Sur del martes
- WHEN `anular Sur mar --como Ana`
- THEN responde «la sala Sur no tiene responsable» y la reserva sigue activa

#### Reglas de la capacidad — responsables-de-sala

- **Dónde viven los datos**: `data/managers.json`, editado a mano.
- **Idioma de los nombres**: los nombres de las salas son los de PRODUCT.md (Norte, Sur); los de las personas, los que se quiera, distinguiendo mayúsculas.
- **Límites**: un responsable por sala.
- **Avisos**: «no se puede leer data/managers.json», «la sala <sala> no tiene responsable».
- **Regla ante conflicto**: fichero ilegible o sala sin responsable → no se anula nada.

### Capacidad: `reservas`

**ADDED — Solo el responsable de la sala anula una reserva**
- GIVEN la reserva activa de Norte del lunes y `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}`
- WHEN `anular Norte lun --como Luis`
- THEN responde «solo Ana anula reservas de Norte» y la reserva sigue activa
- AND `anular Norte lun --como Ana` responde «anulada Norte lun» y la reserva queda anulada

**ADDED — Anular exige identificarse**
- GIVEN la reserva activa de Norte del lunes
- WHEN `anular Norte lun` sin `--como`, o con `--como` sin valor
- THEN responde «indica quién anula con --como» y la reserva sigue activa

**ADDED — Quien no es responsable no averigua si hay reserva**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y ninguna reserva activa de Norte el martes
- WHEN `anular Norte mar --como Luis`
- THEN responde «solo Ana anula reservas de Norte»

**ADDED — Sin identificarse gana sobre un fichero ausente**
- GIVEN `data/managers.json` ausente
- WHEN `anular Norte lun` sin `--como`
- THEN responde «indica quién anula con --como»

**ADDED — Una reserva ya anulada no se anula**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes ya anulada por Ana
- WHEN `anular Norte lun --como Ana`
- THEN responde «sin reserva Norte lun»

**ADDED — Una reserva cancelada no se anula**
- GIVEN `managers.json` con `{"Norte": "Ana", "Sur": "Luis"}` y la reserva de Norte del lunes cancelada con `cancelar`
- WHEN `anular Norte lun --como Ana`
- THEN responde «sin reserva Norte lun»

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: no aplica: esta feature no añade datos a las reservas.
- **Idioma de los nombres**: castellano, como PRODUCT.md.
- **Límites**: no aplica.
- **Avisos**: «solo <responsable> anula reservas de <sala>», «indica quién anula con --como», «sin reserva <sala> <día>».
- **Regla ante conflicto**: se valida en este orden y gana el primer fallo: `--como`, fichero de responsables, sala con responsable, quién es, reserva.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
