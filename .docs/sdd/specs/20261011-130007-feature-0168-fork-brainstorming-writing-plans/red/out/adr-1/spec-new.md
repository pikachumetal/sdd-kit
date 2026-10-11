---
id: 20261011-132124-feature-0012-reservas-persistentes
feature: 0012
title: Las reservas sobreviven al cierre de la terminal
mode: full
profile: delegate
status: draft
created: 2026-10-11
author: <git-user>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven al cierre de la terminal

🦆 Hoy, si reservas Norte el lunes de 10:00 a 12:00, cancelas la reserva y cierras la terminal, al abrirla otra vez la reserva vuelve a estar activa y la cancelación se ha perdido. Con este cambio, la sala cancelada seguirá cancelada al volver, y `libres 10:00-12:00` ya no la contará como ocupada. Las reservas se guardarán en un fichero propio del usuario, que se lee al arrancar cada comando y se escribe cuando un comando las cambia. Esto sustituye una decisión que ya estaba tomada («las reservas viven en memoria», decisión 0003), y por eso va marcada abajo.

> **Estado**: draft.
> **Siguiente paso**: aprobar la spec → `plan.md` con `superpowers:writing-plans`.

## Capacidades

`sdd capability index` no lista ninguna capacidad: `capabilities/` no existe todavía.

- Nuevas: `bookings` — el ciclo de vida de una reserva y dónde se guarda. Hoy nace con este único requisito; los comportamientos ya construidos (cancelar, anular, libres, semanal) no están en ninguna capacidad y no los migra esta feature.
- Modificadas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: capacidad nueva, dato persistente nuevo (2 de 8; el umbral es 4) · tamaño: ~60 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin mirar a un segundo lector sobre las reglas de conflicto entre dos terminales; hecho el pase de coherencia en el hilo
```

1. **Esta feature sustituye la decisión 0003 («las reservas viven en memoria»).** Esa decisión dejaba abiertas tres preguntas —dónde vive el fichero, qué pasa con dos terminales a la vez y cómo se migra el formato— y decía «nadie lo ha pedido». Ahora sí lo has pedido. Al cerrar se escribe la ADR 0004 y la 0003 pasa a `superseded by 0004`; su «Confirmación» (que `src/` no importe `node:fs`) deja de cumplirse a propósito.
2. **Se guarda en un fichero JSON**, sin base de datos ni dependencias (Node 22 ya lo trae). SQLite descartada: `tech-stack.md` dice «sin dependencias externas» y para una persona no compensa.
3. **El fichero es `reservas.json` en la carpeta `.salas` del directorio personal** (`~/.salas/reservas.json`), no en la carpeta desde donde se lanza. Motivo: «cerrar y volver a abrir la terminal» no garantiza el mismo directorio, y con una ruta por directorio las reservas parecerían perdidas.
4. **La variable de entorno `SALAS_DATOS` cambia esa ruta.** Hace falta para que las pruebas no escriban en tu directorio personal.
5. **Primer arranque sin fichero**: empieza con la reserva de ejemplo que hoy está cableada (Norte, lun, 10:00-12:00, activa), para no cambiar lo que `libres` responde hoy. No crea el fichero hasta que un comando cambia algo.
6. **Qué comandos escriben**: solo los que cambian una reserva (`cancelar`, `anular`). `libres` solo lee.
7. **Dos terminales a la vez**: no se protege con cerrojos. Cada comando lee el fichero entero, cambia y lo reescribe; gana el último que escribe. La escritura es atómica (fichero temporal y renombrado) para que un corte nunca deje el fichero a medias. Es consecuencia de usarlo una sola persona (misión); si algún día no es así, es otra ADR.
8. **Fichero ilegible o con un formato roto**: el comando falla con `no se pueden leer las reservas de <ruta>: <motivo>` y no lo sobrescribe. Mejor parar que perder reservas.
9. **Formato del fichero**: `{ "version": 1, "reservas": [ { "room", "day", "slot", "status" } ] }`, con los mismos nombres de campo que hoy en memoria. El `version` deja migrar sin adivinar. No es un contrato con nadie más.
10. **`reservar` no cambia**: hoy responde «reserva semanal creada» sin crear nada en la lista (así está en el código y en su test). No lo arreglo aquí: persistir una lista que `reservar` no alimenta no la cambia. Si quieres que `reservar` cree de verdad, es otra feature. **Pregunta para ti**: ¿lo apunto en el roadmap?
11. **Nombre de la capacidad**: `bookings` (slug en inglés), como pide el kit.

### Decisiones tomadas con el dev-lead

Ninguna: la petición fue «que las reservas sobrevivan a cerrar y volver a abrir la terminal», con el perfil `delegate`, y pidió escribir la spec sin entrevista previa. Las decisiones de arriba son todas mías.

## Intent

Hoy el proceso empieza siempre con la lista cableada y todo cambio muere con él: una cancelación o una anulación se pierde al cerrar la terminal. Para una herramienta cuyo propósito es reservar salas, que la reserva no dure es un fallo de producto, no una limitación aceptable. Se quiere que lo que el comando cambia siga ahí en el siguiente arranque.

## Scope

- Entra: guardar las reservas en un fichero personal del usuario; leerlas al arrancar; escribirlas tras `cancelar` y `anular`; error claro con un fichero roto; ruta configurable por `SALAS_DATOS`; la ADR 0004 y el cambio de estado de la 0003 al cierre.
- Entra: actualizar el texto que dice «las reservas viven en memoria» en `.docs/sdd/operations.md` (§Testing, «Motor de producción»), y `PRODUCT.md`/`README.md` si lo dicen (se comprueba en el plan).
- No entra: que `reservar` cree reservas (decisión 10); cerrojos entre terminales (decisión 7); migrar los comportamientos ya construidos a `capabilities/`; base de datos; exportar a `.ics` (B1); avisos por correo (1).

## Approach

Al arrancar un comando se carga la lista desde el fichero (o la de ejemplo si no existe) y los comandos trabajan sobre ella como hasta ahora. Los dos comandos que cambian una reserva la guardan al terminar. La lectura y la escritura se aíslan en un solo sitio, para que el resto de `src/app.js` no sepa de ficheros. El cómo, en `plan.md`.

## Dónde se prueba

- Persistencia entre ejecuciones: lanzando `node src/app.js` dos veces como proceso real, con `SALAS_DATOS` apuntando a un directorio temporal; es lo único que reproduce «cerrar y abrir» (la importación de `run` comparte memoria entre pruebas y no lo demostraría).
- Fichero roto y primer arranque: por `run`, como `test/cancel.test.js`, con `SALAS_DATOS` temporal.
- Aislamiento: las pruebas existentes (`app.test.js`, `cancel.test.js`) pasan a usar `SALAS_DATOS` temporal; sin eso escribirían en `~/.salas` de quien las ejecute. Es un desvío si el plan lo deja fuera.

## Términos y ADR

- Términos resueltos: **Reserva** y **Cancelación** ya están en `PRODUCT.md`; no se introduce ninguno nuevo. En código se mantiene `room`, `day`, `slot` (nombres existentes).
- ADR candidatas: **«Las reservas se guardan en un fichero JSON personal»** — alternativa descartada: SQLite; y deja `superseded by 0004` a la 0003 (en memoria, que no guardaba nada).

## Delta de comportamiento

### Capacidad: `bookings`

**ADDED — Las reservas sobreviven al cierre de la terminal**
- GIVEN una reserva activa Norte lun 10:00-12:00 y un comando `cancelar Norte lun` ya ejecutado y terminado
- WHEN se abre una terminal nueva y se ejecuta `libres 10:00-12:00`
- THEN responde `Norte, Sur` (la cancelación sigue vigente y la sala vuelve a estar libre)

**ADDED — Primer arranque con la reserva de ejemplo**
- GIVEN que no existe el fichero de reservas
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur` (Norte está ocupada por la reserva de ejemplo) y el fichero sigue sin existir

**ADDED — Una anulación también se conserva**
- GIVEN una reserva activa Norte lun y `anular Norte lun` ya ejecutado
- WHEN se abre una terminal nueva y se ejecuta `anular Norte lun`
- THEN responde `sin reserva Norte lun`

**ADDED — Un fichero roto no se sobrescribe**
- GIVEN que el fichero de reservas contiene `no es json`
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `no se pueden leer las reservas de <ruta>: <motivo>`, el comando termina con error y el contenido del fichero sigue siendo `no es json`

**Reglas de la capacidad**
- **Dónde viven los datos**: un fichero JSON, `reservas.json` en `.salas` del directorio personal, o la ruta de `SALAS_DATOS`.
- **Idioma de los nombres**: campos `room`, `day`, `slot`, `status`, como hoy; mensajes en castellano (constitución, art. 4).
- **Límites**: no declarado; una sola persona, sin tope de reservas.
- **Avisos**: `no se pueden leer las reservas de <ruta>: <motivo>`.
- **Regla ante conflicto**: dos terminales a la vez: gana la última que escribe.

## Enmiendas

_Ninguna._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
