---
id: 20261021-150309-feature-0024-remember-status-filter
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

🦆 Hoy, si en `/facturas` eliges el estado «cobrada» y te vas a otra pantalla, al volver la lista aparece con «todas» y hay que elegirlo otra vez. Con este cambio, al volver sigue en «cobrada» y solo se ven las facturas cobradas, por ejemplo F-015 y no F-014. El estado elegido se guarda en el navegador de cada persona, así que también sobrevive a recargar la página. Por dentro, el desplegable «Estado» lee su valor inicial de ese almacén y lo escribe al cambiar.

## Capacidades

- Nuevas: `invoice-list` — la lista de facturas: filtro por estado y su memoria entre visitas.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: datos (un valor persistente nuevo en el navegador) · tamaño: ~25 líneas en 2 ficheros
- Mínimo razonable: ninguna — la spec no tiene contrato público, ni `MODIFIED`, ni reglas de visibilidad, y todo el código que toca está leído. Con 1 señal la rúbrica no propone review. Hice yo el repaso de coherencia.

1. «Recordar al volver a la pantalla» lo entiendo como memoria que **sobrevive a cerrar y reabrir la pestaña y a recargar**, no solo a navegar dentro de la sesión. Guardo en `localStorage` del navegador, no en la base de datos ni en el API. El motivo es que el equipo (5 personas, cada una con su navegador) usa el filtro como preferencia de trabajo, y no hay que cambiar el servidor. Consecuencia: la memoria es por navegador, no por usuario ni entre equipos.
2. Clave de almacenamiento: `hojas.facturas.estado`. Guarda el valor tal cual del desplegable (`todas`, `borrador`, `emitida`, `cobrada`).
3. Se guarda también «todas» si es lo último que se eligió, para que «recordar el último» sea literal.
4. Un valor guardado que no es uno de los cuatro estados (clave manipulada o un estado que ya no existe) se ignora y la lista arranca en «todas». No hay aviso.
5. Si el navegador no deja leer o escribir el almacén (modo privado restrictivo, cuota llena), la lista funciona igual: arranca en «todas» y el filtro sigue operando en esa visita. No hay aviso.
6. Alcance: solo el filtro de estado de `InvoiceList`. No hay botón de «limpiar» ni cambio de textos de la interfaz.
7. La capacidad nueva se llama `invoice-list`. Hoy no hay ninguna en `capabilities/`, así que el delta solo escribe el requisito nuevo. El filtro que ya existe (elegir un estado muestra solo esas facturas) queda sin documentar en la capacidad, porque no lo cambia esta feature.
8. Se prueba con un test de componente (remontando el componente), sin test E2E nuevo. Ver «Dónde se prueba».
9. Prueba del delta con `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal: sin rechazos. Salida: `invoice-list.md: añadido` ×4 requisitos y `regla … añadida` ×5. `capabilities/` del repo no se toca.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Spec aprobada por delegación, sin entrevista ni preguntas — «apruebo la spec por delegación, nos vemos en la validación: no me preguntes nada, escribe la spec y para antes del plan.» (2026-10-21)
- La parada antes del plan es del dev-lead: el plan y la implementación esperan a que lo diga.

## Intent

Hoy el filtro de estado de `/facturas` se reinicia a «todas» cada vez que se entra en la pantalla. Quien trabaja con las facturas «emitida» o «cobrada» lo vuelve a elegir en cada visita. Se quiere que la pantalla recuerde el último estado elegido. Éxito: al volver a `/facturas` el desplegable «Estado» muestra el último valor elegido y la lista ya está filtrada por él, sin ninguna acción. Fracaso aunque funcione: que una lista filtrada sorprenda a quien no recuerda haberla filtrado. Por eso el desplegable muestra siempre el valor activo.

## Scope

- Entra: guardar el estado elegido al cambiarlo. Leerlo al abrir la lista, validándolo contra los cuatro estados. Funcionar sin almacén.
- No entra: guardar en servidor o por usuario. Recordar otros filtros, orden o búsqueda. Botón de restablecer. Cambiar textos o estilos. Tocar la hoja, el API o `server/api.js`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0024 → solo `.docs/sdd/roadmap.md:7`, que el cierre pasa de ⏳ a hecha. No aparece en `capabilities/` ni en documentos del proyecto (búsqueda de `0024`, `localStorage` y `sessionStorage` en el repo).

## Approach

El estado del desplegable de `InvoiceList` toma su valor inicial del almacén del navegador, con la validación de la decisión 4. Cada cambio del desplegable lo escribe en el almacén. Lectura y escritura toleran un almacén que falla (decisión 5). El cómo, en `plan.md`.

## Dónde se prueba

- Recordar el estado al volver: test de componente en `src/invoices/InvoiceList.test.tsx`, como el de `filtra por estado`. Se elige «cobrada», se desmonta, se vuelve a montar y se comprueba el desplegable y la lista.
- Valor guardado no válido y almacén que falla: el mismo fichero, con un almacén preparado con ese valor y con uno que lanza al leer y al escribir.
- La pantalla real, con una captura de `/facturas` al volver: en la validación manual.

## Términos y ADR

- Términos resueltos: ninguno (se usa «estado» y «factura», como `PRODUCT.md`)
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `invoice-list`

**ADDED — La lista recuerda el último estado elegido**
- GIVEN las facturas F-014 (emitida) y F-015 (cobrada), y la lista abierta en «todas»
- WHEN se elige «cobrada» en «Estado» y se sale de la pantalla y se vuelve a `/facturas`
- THEN «Estado» muestra «cobrada» y la lista muestra F-015 y no F-014
- AND recargar la página con «cobrada» elegido deja el mismo resultado

**ADDED — Elegir «todas» también se recuerda**
- GIVEN «cobrada» recordado
- WHEN se elige «todas» y se vuelve a la pantalla
- THEN «Estado» muestra «todas» y la lista muestra F-014 y F-015

**ADDED — Un estado guardado que no existe se ignora**
- GIVEN el valor guardado es `anulada`, que no es ningún estado
- WHEN se abre la lista
- THEN «Estado» muestra «todas» y la lista muestra F-014 y F-015, sin error

**ADDED — Sin almacén la lista funciona igual**
- GIVEN el navegador no deja leer ni escribir el almacén
- WHEN se abre la lista y se elige «emitida»
- THEN la lista muestra F-014 y no F-015, sin error
- AND al volver a la pantalla «Estado» muestra «todas»

**Reglas de la capacidad**
- **Dónde viven los datos**: en `localStorage` del navegador, clave `hojas.facturas.estado`; no en servidor.
- **Idioma de los nombres**: los valores guardados son los de la interfaz (`todas`, `borrador`, `emitida`, `cobrada`).
- **Límites**: no aplica.
- **Avisos**: ninguno.
- **Regla ante conflicto**: un valor guardado no válido pierde y arranca en `todas`.

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-10-21 | aprobada: «apruebo la spec por delegación, nos vemos en la validación: no me preguntes nada, escribe la spec y para antes del plan.» |
