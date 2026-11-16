---
id: 20261021-150038-feature-0024-remember-status-filter
feature: 0024
title: Recordar el filtro de estado de la lista de facturas
mode: full
profile: delegate
status: approved
created: 2026-10-21
author: Fixture
approvers:
  - name: Fixture
    approved_at: 2026-10-21
---

# Spec — Recordar el filtro de estado de la lista de facturas

🦆 Hoy, si eliges «cobrada» en la lista de facturas, sales a otra pantalla y vuelves, el filtro vuelve a «todas» y hay que elegirlo otra vez. Con esto, al volver ves «cobrada» tal como lo dejaste: `F-015 · Sur SA · 80 € · cobrada` sigue siendo lo único que se lista. El estado se guarda en el navegador de cada persona, así que también sobrevive a recargar la página. Por dentro, el selector «Estado» lee y escribe un valor en `localStorage`.

## Capacidades

- Nuevas: `invoice-list` — lo que muestra la lista de facturas y cómo se filtra por estado.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~15 líneas en 2 ficheros
- Mínimo razonable: ninguna — no deja nada sin cubrir que una lectura de la spec no vea; el repaso de coherencia lo hace quien la escribe.

1. Capacidad nueva `invoice-list` — `capabilities/` está vacío y el filtro por estado ya existía sin spec; su comportamiento actual (filtrar por estado, empezar en «todas») entra como `ADDED` junto al nuevo.
2. «Volver a la pantalla» incluye salir a otra pantalla de la aplicación y volver, y recargar la página — la lista es un componente que se desmonta al salir; guardar en el navegador cubre las dos cosas con el mismo mecanismo.
3. El estado se guarda en el navegador de cada persona (`localStorage`, clave `hojas.facturas.estado`), no en el servidor ni por usuario — es lo más pequeño que cumple la fila; el servidor no se toca (`server/api.js` fuera de alcance). Consecuencia: otro navegador u otro equipo de la misma persona empieza en «todas».
4. Se guarda cada elección, también «todas» — así volver a «todas» se recuerda igual que cualquier otro estado.
5. Un valor guardado que no es uno de los cuatro estados (`todas`, `borrador`, `emitida`, `cobrada`) se ignora y la lista empieza en «todas» — por si la clave se corrompe o los estados cambian en el futuro.
6. Si el navegador no deja leer o escribir el almacenamiento (modo privado, cuota), la lista funciona igual que hoy: filtra, pero no recuerda, sin mensaje de error — el filtro es una comodidad, no debe romper la pantalla.
7. Solo se recuerda el estado: no hay otros filtros que recordar, y no se añade botón para «olvidar» — no entra en la fila.
8. Pruebas: una prueba de componente (la costura existente de `InvoiceList.test.tsx`) cubre los cuatro escenarios; no se añade E2E nuevo — el gate de cierre ya corre los 14 min de la suite y el comportamiento se ve entero en el componente.
9. Aprobador de la spec: `Fixture` (`git config user.name`).
10. Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` acepta el delta (5 requisitos `ADDED` en `invoice-list.md`, sin rechazos); `capabilities/` del repo no cambia.
- Política de modelos: ninguna review de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, sin preguntas de entrevista — «apruebo la spec por delegación, nos vemos en la validación» (2026-10-21)

## Intent

Hoy el filtro «Estado» de la lista de facturas empieza siempre en «todas»: quien trabaja las cobradas, sale a una factura y vuelve, tiene que elegirlo de nuevo cada vez. La gestoría la usan cinco personas varias veces al día. Éxito: al volver a la lista, el filtro está como se dejó, sin ninguna acción. Fracaso aunque funcione: que un valor guardado raro o un navegador sin almacenamiento deje la lista en blanco o con un error.

## Scope

- Entra: guardar el último estado elegido en el navegador al cambiar el selector; leerlo al mostrar la lista; ignorar valores no válidos; seguir funcionando sin almacenamiento.
- No entra: guardar en el servidor o por usuario; recordar otros filtros u orden; botón de restablecer; cambiar los estados disponibles o el texto de la lista.

## Lo que se retira o cambia de forma

No se retira nada ni cambia de forma ningún literal visible: el selector «Estado» y las líneas de factura quedan como están.

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | — | — |

- Filas que implementa: 0024 → `.docs/sdd/roadmap.md` (la nombra; pasa a hecha en el cierre) | otros ficheros: nada, comprobado con `grep -rn "0024" .` fuera de `.docs/sdd/specs/`

## Approach

El valor del selector «Estado» se guarda en el navegador cada vez que cambia, y la lista lo lee al montarse para fijar el filtro inicial. Qué función o hook lo hace es cosa del plan.

## Dónde se prueba

- Recordar el estado al volver, valor no válido y sin almacenamiento: prueba de componente en `src/invoices/InvoiceList.test.tsx`, desmontando y volviendo a montar `InvoiceList` como el filtro actual; sin E2E nuevo (decisión 8).
- Empezar en «todas» sin nada guardado: la misma prueba de componente.

## Términos y ADR

- Términos resueltos: Estado — el de la factura (borrador, emitida, cobrada) más «todas» en el filtro; se evita «status» en el texto.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `invoice-list`

**ADDED — La lista filtra por estado**
- GIVEN las facturas `F-014 · Norte SL · 120 € · emitida` y `F-015 · Sur SA · 80 € · cobrada`
- WHEN se elige «cobrada» en el selector «Estado»
- THEN solo se lista `F-015`, y `F-014` no aparece

**ADDED — El filtro empieza en «todas» sin estado guardado**
- GIVEN que no hay ningún estado guardado en el navegador
- WHEN se muestra la lista de facturas
- THEN el selector «Estado» marca «todas» y se listan `F-014` y `F-015`

**ADDED — La lista recuerda el último estado elegido**
- GIVEN que se eligió «cobrada» en el selector «Estado»
- WHEN se sale de la lista y se vuelve a ella, o se recarga la página
- THEN el selector marca «cobrada» y solo se lista `F-015`
- AND elegir «todas» y volver también se recuerda: el selector marca «todas» y se listan las dos

**ADDED — Un estado guardado no válido se ignora**
- GIVEN que el navegador tiene guardado el valor `anulada`, que no es un estado
- WHEN se muestra la lista de facturas
- THEN el selector marca «todas» y se listan `F-014` y `F-015`, sin error

**ADDED — Sin almacenamiento, la lista filtra sin recordar**
- GIVEN un navegador que no deja leer ni escribir el almacenamiento
- WHEN se elige «emitida» en el selector «Estado»
- THEN solo se lista `F-014`, sin error
- AND al volver a la lista el selector marca «todas»

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-10-21 | aprobada: «apruebo la spec por delegación, nos vemos en la validación» |
