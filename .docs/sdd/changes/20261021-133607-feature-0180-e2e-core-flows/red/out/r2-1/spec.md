---
id: 20261021-134038-feature-0024-remember-status-filter
feature: 0024
title: Recordar el filtro de estado de la lista de facturas
mode: full
profile: delegate
status: approved
created: 2026-10-21
author: <git-user>
approvers:
  - name: <git-user>
    approved_at: 2026-10-21
---

# Spec — Recordar el filtro de estado de la lista de facturas

🦆 Hoy, si en la lista de facturas eliges «cobrada» y sales de la pantalla, al volver aparece «todas» y hay que elegir otra vez. Con este cambio, al volver (o al recargar) la lista sigue en «cobrada», con solo F-015 a la vista. El estado se guarda en el navegador de cada persona, sin tocar el servidor ni la base de datos.

> **Estado**: approved por delegación.
> **Siguiente paso**: `plan.md`, siguiendo `plan-writing.md` de `sdd-propose` (el usuario pidió parar antes del plan).

## Capacidades

- Nuevas: `invoices` — la lista de facturas y su filtro de estado.
- Modificadas: ninguna (`sdd capability index` no devuelve capacidades).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~15 líneas en 2 ficheros
- Mínimo razonable: ninguna; no deja nada relevante sin cubrir: sin datos en el servidor, sin contrato público, sin `MODIFIED`.

1. Nueva capacidad `invoices` (slug en inglés, kebab-case) — no existe ninguna en `capabilities/`; el filtro es comportamiento observable de la lista de facturas.
2. «Recordar» = guardar en el navegador (`localStorage`, clave `invoices.statusFilter`), por navegador y no por usuario — es lo mínimo que cumple «al volver a la pantalla»; no exige API, esquema ni migración. Si dos personas comparten navegador, comparten el último filtro.
3. También sobrevive a recargar la página y a cerrar y abrir el navegador — consecuencia de usar `localStorage`; nadie pidió lo contrario.
4. «todas» también se recuerda: elegir «todas» sustituye al filtro anterior — así el último estado elegido es siempre el que se ve.
5. Sin valor guardado, o con un valor que no es `todas`, `borrador`, `emitida` ni `cobrada`, la lista abre en «todas» — es el comportamiento de hoy y evita una lista vacía por un valor viejo.
6. Si el navegador no deja leer o escribir el almacenamiento, la lista funciona como hoy (abre en «todas», el filtro se aplica durante la sesión) y no muestra ningún error — el filtro es una comodidad, no puede romper la pantalla.
7. No se muestra aviso ni texto nuevo en la interfaz — nadie pidió indicar que el filtro está recordado.
8. Dónde se prueba: solo con el test de componente de `InvoiceList` (desmontar y volver a montar), sin E2E nuevo — una sola costura, y la suite E2E ya tarda ~14 min.
9. Review de la spec: ninguna (0–3 señales, spec aprobada por delegación).
- Prueba del delta (`sdd capability merge` sobre una copia de `.docs/sdd`): `invoices.md`: 3 requisitos añadidos y 5 reglas añadidas, sin rechazos.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Aprobar la spec por delegación y validar después — «apruebo la spec por delegación, nos vemos en la validación: no me preguntes nada, escribe la spec y para antes del plan» (2026-10-21).
- Parar tras la spec, antes del plan — misma frase.

## Intent

Hoy la lista de facturas abre siempre en «todas». Quien trabaja un estado (p. ej. las «emitida» pendientes de cobro) lo vuelve a elegir cada vez que entra en la pantalla. Se quiere que la lista recuerde el último estado elegido y lo aplique al volver. Éxito: tras elegir «cobrada» y volver a la lista, el selector muestra «cobrada» y solo se ven las facturas cobradas, sin ningún clic. Fracaso aunque funcione: que un valor guardado antiguo o inválido deje la lista vacía o rota, o que cambie el comportamiento de quien nunca ha filtrado.

## Scope

- Entra: guardar el estado elegido en la lista de facturas; aplicarlo al abrir la lista; tolerar valor ausente, inválido o almacenamiento no disponible.
- No entra: guardarlo en el servidor o por usuario; recordar otros filtros u ordenaciones; un botón o aviso de «limpiar filtro»; cambios en `server/api.js`, en la hoja (`src/sheet/`) o en el E2E.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Estado inicial fijo «todas» de la lista | `src/invoices/InvoiceList.tsx:8` (`useState('todas')`) | Scope: se sustituye por el estado recordado, con «todas» por defecto |

- Filas que implementa: 0024 → `.docs/sdd/roadmap.md` (la fila pasa de ⏳ a 🔨 al arrancar la implementación; ningún otro fichero la nombra) | comprobado con búsqueda de `0024` y `todas` en `.docs/`, `src/`, `e2e/`, `README.md` y `PRODUCT.md`.

## Approach

La lista lee el estado guardado al montarse y lo escribe cada vez que quien la usa cambia el selector. Un fallo de lectura o un valor no reconocido cae en «todas». Sin cambios de servidor ni de datos.

## Dónde se prueba

- Recordar al volver: test de componente en `src/invoices/InvoiceList.test.tsx`, como el de «filtra por estado» (elegir «cobrada», desmontar, volver a montar, comprobar el selector y las facturas visibles).
- Valor ausente o inválido y almacenamiento no disponible: mismo fichero, mismo patrón.
- E2E: sin cambios (decisión 8).

## Términos y ADR

- Términos resueltos: filtro de estado — el selector «Estado» de la lista de facturas (valores `todas`, `borrador`, `emitida`, `cobrada`).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `invoices`

**ADDED — La lista recuerda el último estado elegido**
- GIVEN la lista de facturas con F-014 (emitida) y F-015 (cobrada), y quien la usa elige «cobrada»
- WHEN sale de la pantalla y vuelve a la lista (o recarga la página)
- THEN el selector «Estado» muestra «cobrada» y solo se ve F-015
- AND si elige «todas» y vuelve, el selector queda en «todas» con F-014 y F-015 a la vista

**ADDED — Sin estado recordado válido, la lista abre en «todas»**
- GIVEN no hay estado guardado, o el guardado es «anulada» (no es un estado de la lista)
- WHEN se abre la lista
- THEN el selector muestra «todas» y se ven F-014 y F-015

**ADDED — Sin almacenamiento, la lista sigue funcionando**
- GIVEN el navegador no permite leer ni escribir el almacenamiento
- WHEN se abre la lista y se elige «cobrada»
- THEN no hay ningún error visible, la lista se filtra a F-015 y, al volver, abre en «todas»

**Reglas de la capacidad**
- **Dónde viven los datos**: en el navegador de cada persona, clave `invoices.statusFilter`; no en el servidor.
- **Idioma de los nombres**: los valores guardados son los de la interfaz (`todas`, `borrador`, `emitida`, `cobrada`).
- **Límites**: no aplica.
- **Avisos**: ninguno.
- **Regla ante conflicto**: un valor guardado que no sea un estado válido se ignora y se usa «todas».

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| <git-user> | 2026-10-21 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
