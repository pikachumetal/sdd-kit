---
id: 20261021-134228-feature-0024-remember-status-filter
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

🦆 Hoy, si en `/facturas` eliges el estado «cobrada», sales a otra pantalla y vuelves, el filtro vuelve a «todas». Con este cambio vuelves y sigues viendo «cobrada». El navegador guarda el último estado elegido y la lista lo recupera al montarse; si lo guardado ya no es un estado válido, la lista arranca en «todas».

## Capacidades

- Nuevas: `invoice-list` — la lista de facturas y su filtro de estado (hoy sin capacidad escrita)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: capacidad nueva (1 de 8) · tamaño: ~15 líneas en 2 ficheros
- Mínimo razonable: ninguna — no deja nada sin mirar que la pasada de coherencia no cubra a este tamaño

1. Capacidad nueva `invoice-list` — el proyecto no tiene `capabilities/` y el comportamiento de la lista no está escrito en ningún sitio.
2. «Recordar» es por navegador (almacenamiento local del navegador), no por usuario en el servidor: sobrevive a salir y volver a la pantalla y también a recargar la página — el roadmap solo dice «al volver a la pantalla»; no toca API ni base de datos.
3. Se recuerda también la elección «todas» (es un estado elegible del selector).
4. Un valor guardado que no sea `todas`, `borrador`, `emitida` o `cobrada` se ignora y la lista arranca en «todas», sin aviso.
5. No hay botón para olvidar el filtro: elegir «todas» es el modo de quitarlo.
6. Sin review de la spec (0 señales relevantes, delta de ~15 líneas).
7. Prueba del delta en copia de `.docs/sdd` (`sdd capability merge`): 4 requisitos añadidos a `invoice-list.md`, sin rechazos; el repo no cambia.
8. Política de modelos: ninguna review · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, sin preguntas de entrevista — «Apruebo la spec por delegación, nos vemos en la validación: no me preguntes nada, escribe la spec y para antes del plan» (2026-10-21)
- Parar antes del plan — misma frase.

## Intent

Hoy el filtro de estado de `/facturas` se reinicia a «todas» cada vez que la pantalla se vuelve a montar. Quien en administración trabaja un rato solo con facturas «emitida» tiene que volver a elegirlo cada vez que sale a una hoja y vuelve. Éxito: tras elegir un estado, salir y volver, la lista muestra ese estado sin tocar nada. Fracaso aunque «funcione»: que un valor guardado raro deje la lista vacía o rota.

## Scope

- Entra: guardar el estado elegido al cambiar el selector; leerlo al montar la lista; ignorar valores no válidos.
- No entra: recordar otros filtros u ordenaciones; guardarlo en el servidor o por usuario; cambiar el aspecto del selector; botón de «olvidar».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Estado inicial fijo `'todas'` de la lista | `src/invoices/InvoiceList.tsx:7` | Delta, `ADDED` (el inicial pasa a ser el último elegido; «todas» sigue siendo el valor sin nada guardado) |

- Filas que implementa: 0024 → solo la fila del roadmap (`.docs/sdd/roadmap.md:7`), que cierra el archivo | nada más: comprobado con `grep -rn "0024"` y `grep -rn "localStorage"` fuera de `node_modules`

## Approach

La lista guarda en el almacenamiento local del navegador el estado cada vez que el usuario lo cambia, y lo lee como estado inicial al montarse, validándolo contra los cuatro estados conocidos. El detalle (clave, momento exacto de lectura) es del plan.

## Dónde se prueba

- Recordar el estado al volver, valor no válido y sin nada guardado: test de componente en `src/invoices/InvoiceList.test.tsx`, desmontando y volviendo a montar `InvoiceList`, como el test `filtra por estado` actual.
- El E2E existente (`e2e/0018-invoice-status.spec.ts`) no cambia: el gate de cierre lo ejecuta entero y debe seguir en verde (arranca sin nada guardado).

## Términos y ADR

- Términos resueltos: **estado** — el estado de una factura (borrador, emitida, cobrada); «todas» es la ausencia de filtro. Se evita «status» en texto de interfaz y documentos.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `invoice-list`

**ADDED — La lista recuerda el último estado elegido**
- GIVEN la lista de facturas con F-014 (Norte SL, emitida) y F-015 (Sur SA, cobrada) y nada guardado
- WHEN el usuario elige el estado «cobrada», sale de `/facturas` y vuelve
- THEN el selector muestra «cobrada» y la lista enseña solo F-015

**ADDED — Sin estado guardado la lista muestra todas**
- GIVEN la misma lista y nada guardado en el navegador
- WHEN se abre `/facturas`
- THEN el selector muestra «todas» y la lista enseña F-014 y F-015

**ADDED — Un estado guardado no válido se ignora**
- GIVEN el navegador tiene guardado el valor `anulada`
- WHEN se abre `/facturas`
- THEN el selector muestra «todas» y la lista enseña F-014 y F-015

**ADDED — Elegir «todas» también se recuerda**
- GIVEN el usuario eligió antes «cobrada» y lo recordó
- WHEN elige «todas», sale y vuelve
- THEN el selector muestra «todas» y la lista enseña F-014 y F-015

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-10-21 | aprobada: «Apruebo la spec por delegación, nos vemos en la validación» |
