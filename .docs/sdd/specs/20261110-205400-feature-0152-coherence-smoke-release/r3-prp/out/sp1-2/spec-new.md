---
id: 20261111-200319-feature-0012-retire-void
feature: 0012
title: Retirar el comando anular
mode: full
profile: delegate
status: draft
created: 2026-11-11
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Retirar el comando anular

🦆 Hoy `salas anular Norte lun` anula la reserva de Norte del lunes y responde `anulada Norte lun`. Tras este cambio ese comando ya no existe: escribirlo no toca ninguna reserva (responde `salas`, como cualquier comando desconocido). Quien quiera quitar una reserva usa `cancelar Norte lun`, que sigue igual. La guía y el README dejan de nombrar `anular`, y el requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva»: ojo, sin «propia» la capacidad deja de decir que cada persona solo cancela lo suyo (hoy el código tampoco lo comprueba).

Validación: dev-lead — cambia lo que la persona puede hacer en la terminal (un comando desaparece).

## Capacidades

- Modificadas: `bookings` — el requisito de anular se sustituye por uno que dice que `anular` ya no existe, y el de cancelar pierde «propia» en su título.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED`/`REMOVED` (dos requisitos de `bookings`), visibilidad o permiso (quitar «propia») · tamaño: ~30 líneas en 6 ficheros
- Dominio (opus): si quitar «propia» del título amplía quién puede cancelar, y qué pasa con el responsable de sala y con la fila 0011 (señal: REMOVED + permiso)
- Técnica (sonnet): si cada THEN tiene su prueba y si queda alguna referencia a `voidBooking`, `voided` o `anular` fuera de lo listado en «Lo que se retira» (señal: REMOVED)
- Mínimo razonable: solo técnica — deja sin mirar el complemento de permisos (quién puede cancelar tras quitar «propia») y la contradicción con la 0011

1. Enfoque: borrar `voidBooking` y su rama en `run`, frente a dejar un aviso de «comando retirado» o un alias de `cancelar` (ver Approach).
2. `anular Norte lun` responde `salas`: es la salida final de `run` en `src/app.js` para cualquier comando que no reconoce (`return 'salas'`, comprobado). No añado «comando desconocido» ni aviso de retirada, y ningún THEN promete ese texto: el escenario nuevo solo exige que la reserva siga activa.
3. El estado `voided` desaparece del código; las reservas viven en memoria, así que no hay datos que migrar.
4. **Permiso, a confirmar en el gate.** Quitar «propia» del título hace que la capacidad deje de limitar la cancelación a quien reservó. Hoy el código tampoco lo limita (`findBooking(room, day)` no mira dueño; las reservas no guardan quién las hizo), así que no cambia ningún comportamiento y no añado comprobación de dueño. Lo recojo como renombrado literal del dev-lead («pasa a llamarse «Cancelar una reserva»»). Si lo que se quería es que cualquiera pueda cancelar, queda dicho aquí; si se quería conservar «propia», se vuelve atrás y la falta de comprobación pasa a ser un bug aparte.
5. Se añade el requisito «El comando anular ya ha sido retirado» (escenario: la reserva sigue activa) para que la retirada tenga un THEN y una prueba detrás; sustituye a «Anular una reserva».
6. Renombrar el requisito de cancelar se hace como `REMOVED` del título viejo + `ADDED` del nuevo (regla de la plantilla); los escenarios se copian sin cambio.
7. PRODUCT.md: quito el término **Anulación** (el concepto desaparece). **Cancelación** dice «la reserva que anula el propio cliente antes de 24 h»: usa «anula» como verbo y promete «propio cliente» y «antes de 24 h», que ningún requisito recoge. Lo dejo sin tocar y **pendiente de ti en el gate**: (a) reescribirlo como «la reserva que se cancela», (b) dejarlo. Recomiendo (a).
8. El propósito de `bookings` pasa de «Reservar, cancelar y anular salas desde la línea de comandos.» a «Reservar y cancelar salas desde la línea de comandos.»: `sdd capability merge` no toca el propósito, lo edito a mano al cerrar.
9. **Fila 0011 del roadmap** («Anular reservas de otros: solo el responsable de cada sala anula reservas de otras personas»): reintroduce lo que esta spec retira. No la toco: es planificación y va por `sdd-roadmap`. **Pendiente de ti antes de implementar**: (a) reformularla como feature que reintroduce el concepto con otro comando, tras la 0012 (recomendada), (b) retirarla, (c) dejarla como está. Tras esta spec el rol de responsable de sala no tiene función en el producto hasta que la 0011 se decida.
10. Reglas de la capacidad: no cambian (sin datos, nombres, límites ni condición de conflicto nuevos; avisos: ninguno al usar `anular`, decisión 2).
11. CHANGELOG.md no se edita aquí: lo escribe el corte de `sdd-end-release`; su línea 0.3.0 «Cancelar una reserva propia» es historia y se queda. En el cierre, `ROADMAP.md:9` (fila 0012) pasa a ✅.
12. Tope de `docs/guia.md`: 42 palabras medidas con el criterio del test (`split(/\s+/).filter(Boolean)`), 28 tras quitar la línea; el tope de 60 no cambia. El README no tiene tope.
13. Un test nuevo falla si `docs/guia.md` o `README.md` contienen `anular`: el gate de cierre (`node --test`) debe detectarlo, no solo un `git grep`.
- Política de modelos: revisores de la spec: dominio opus (toca quién puede cancelar) y técnico sonnet, en paralelo; segunda ronda un revisor sonnet con los siete puntos · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.
- Delta probado sobre una copia de `.docs/sdd`: `sdd capability merge` → quitado «Cancelar una reserva propia», añadido «Cancelar una reserva», quitado «Anular una reserva», añadido «El comando anular ya ha sido retirado»; `sdd capability check` tras el merge → válido.

### Hallazgos de la review

- **Aceptado** — (Crítico, dominio) quitar «propia» amplía el permiso sin declararlo → decisión 4: el permiso queda declarado y a confirmar en el gate.
- **Aceptado** — (Crítico, dominio) la fila 0011 choca con la retirada → decisión 9, pendiente del dev-lead antes de implementar.
- **Aceptado** — (Crítico, dominio) sin escenario ni complemento del responsable → decisiones 5 (escenario nuevo) y 9 (el rol queda sin función).
- **Aceptado** — (Importante, ambos) falta un THEN que respalde «`anular` no hace nada» → decisión 5 y «Delta».
- **Aceptado** — (Importante, dominio) el criterio del Intent no se cumple con las excepciones → Intent acotado a rutas.
- **Aceptado** — (Importante, técnico) la guía sin `anular` solo se comprobaba con `git grep` → decisión 13, test nuevo.
- **Aceptado** — (Importante, técnico) aserciones vagas y salida `salas` sin verificar → «Dónde se prueba» precisa; decisión 2 cita `src/app.js`.
- **Aceptado** — (Importante, técnico) medida del tope y README → decisión 12.
- **Aceptado** — (Importante, ambos) «Cancelación» queda a medias → decisión 7, pendiente en el gate con recomendación.
- **Aceptado** — (Menor) propósito exacto, ROADMAP ✅ en el Scope, `git grep` ampliado a `voidBooking|voided|anular` → decisiones 8 y 11, Scope y «Dónde se prueba».
- **Rechazado** — (Menor, dominio) «dev-lead» no encaja con PRODUCT.md → es el papel que nombra el kit y quien aprueba; las aprobaciones se rellenan al aprobar.
- **Rechazado** — (Importante, dominio) escribir las cinco reglas por nombre → ninguna cambia; queda dicho en la decisión 10.

Segunda ronda (un revisor sonnet; sin tercera ronda):

- **Rechazado** — (Crítico) ningún requisito fija quién puede cancelar → fijarlo sería inventar una regla que nadie decidió; la decisión 4 lo deja al gate y, según tu respuesta, se añade el AND o se vuelve a «propia».
- **Rechazado** — (Crítico) el escenario de `anular` pasaría con un alias de `cancelar` → con un alias la reserva quedaría cancelada y el `cancelar` posterior diría `sin reserva`; además la prueba exige que la respuesta no sea `anulada…` ni `cancelada…`.
- **Aceptado** — (Importante) decisiones 4, 7 y 9 sin resolver al aprobar → van como preguntas del gate, con recomendación, no se dan por aprobadas con un «apruebo» suelto.
- **Aceptado** — (Importante) el grep esperado y el test nuevo contra el bucle de topes → «Dónde se prueba» precisa el resultado esperado y pide un test aparte.
- **Rechazado** — (Importante) criterio de éxito y «Cancelación» → depende de la decisión 7; el Intent ya acota sus rutas.
- **Rechazado** — (Menor) renombrado con `MODIFIED`, recuento de puntos, números de línea → la plantilla fija `REMOVED` + `ADDED` para renombrar; los números son del estado actual y se comprueban al implementar.

### Decisiones tomadas con el dev-lead

- Se retira el comando `anular` — «se retira el comando anular»
- El requisito «Cancelar una reserva propia» pasa a llamarse «Cancelar una reserva» — «pasa a llamarse «Cancelar una reserva»»
- La guía `docs/guia.md` se actualiza — «la guía docs/guia.md se actualiza»
- Perfil delegate — «Perfil delegate»

## Intent

Hoy `anular` existe, pero la fila 0012 del roadmap decidió retirarlo y la guía ya lo anuncia como «lo retira la 0012». Éxito: `anular` no toca ninguna reserva, `cancelar` sigue cancelando, y `src/`, `docs/guia.md` y `README.md` no lo nombran; la capacidad `bookings` solo lo nombra en el requisito que dice que ya no existe. Fracaso aunque «funcione»: dejar el código muerto `voidBooking`, o una guía o un README que aún lo anuncien.

## Scope

- Entra: quitar `voidBooking` y la rama `anular` de `src/app.js`; actualizar `docs/guia.md` y `README.md`; el delta de `bookings` y su propósito; quitar «Anulación» de PRODUCT.md; un test nuevo en `test/` que falla si la guía o el README nombran `anular`; marcar la fila 0012 como ✅ en el cierre.
- No entra: redefinir «Cancelación» en PRODUCT.md (decisión 7); tocar la fila 0011 (decisión 9); añadir comprobación de dueño al cancelar; editar CHANGELOG.md; un mensaje de «comando desconocido».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Comando `anular` | `src/app.js:31`; `docs/guia.md:8`; `README.md:5` | Scope: se borra la rama, la línea de la guía y la mención del README |
| `voidBooking` y estado `voided` | `src/app.js:20-25` | Scope y decisión 3: se borran |
| Requisito «Anular una reserva» | `.docs/sdd/capabilities/bookings.md:16-20` | delta, `REMOVED` + `ADDED` del requisito «El comando anular ya ha sido retirado» (decisión 5) |
| Requisito «Cancelar una reserva propia» | `.docs/sdd/capabilities/bookings.md:9-14`; `CHANGELOG.md:20` | delta, `REMOVED` + `ADDED` «Cancelar una reserva»; el CHANGELOG es historia (decisión 11) |
| Propósito «…cancelar y anular salas…» | `.docs/sdd/capabilities/bookings.md:5` | decisión 8: se edita a mano |
| Término «Anulación» y verbo «anula» en «Cancelación» | `PRODUCT.md:13-14` | decisión 7: se quita «Anulación»; «Cancelación» pendiente |
| Fila «Anular reservas de otros» | `ROADMAP.md:8` | decisión 9: pendiente del dev-lead, va por `sdd-roadmap` |
| «lo retira la 0012» | `docs/guia.md:8` | desaparece con la línea |

- Filas que implementa: 0012 → `docs/guia.md:8` («lo retira la 0012», desaparece con la línea); `ROADMAP.md:9` pasa a ✅ en el cierre (Scope).

## Approach

- A. Borrar la función y la rama del comando — lo más pequeño; `anular` cae en la salida de cualquier comando desconocido.
- B. Dejar `anular` con un aviso «comando retirado» — añade un texto y un caso que nadie pidió, y la fila dice que el comando «desaparece».
- C. Hacer de `anular` un alias de `cancelar` — cambia el significado de un comando retirado y contradice la fila.
- Elegido: A — lo pide la fila 0012 («el comando anular desaparece») y el dev-lead: «se retira el comando anular».

## Dónde se prueba

- `anular` ya no toca nada: por `run`, como `test/cancel.test.js`; con la reserva activa de Norte el lunes, `run('anular', ['Norte', 'lun'])` no devuelve `anulada Norte lun` y después `run('cancelar', ['Norte', 'lun'])` responde `cancelada Norte lun` (no `sin reserva Norte lun`).
- La respuesta de `anular` no es ni `anulada…` ni `cancelada…`: así un alias de `cancelar` o el comando vivo fallarían la prueba.
- La guía y el README no nombran `anular`: un test aparte, nuevo, en `test/` (no toca el bucle de topes de `test/words.test.js`, que sigue aplicando 60 palabras solo a la guía) que lee `docs/guia.md` y `README.md` y falla si alguno contiene `anular`.
- Comprobación manual de cierre: `git grep -n -E "voidBooking|voided|anular" -- src docs README.md .docs/sdd/capabilities` solo debe dar el título y el WHEN del requisito nuevo de la capacidad; que `anular` aparezca en `test/` es esperado.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### REMOVED — Cancelar una reserva propia

- motivo: renombrado, sin «propia» en el título (el requisito nuevo va justo debajo con los mismos escenarios)

#### ADDED — Cancelar una reserva

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `cancelar Norte lun`
- THEN la reserva queda cancelada y responde `cancelada Norte lun`
- AND sin reserva ese día responde `sin reserva Norte lun`

#### REMOVED — Anular una reserva

- motivo: el dev-lead retira el comando `anular` (fila 0012)

#### ADDED — El comando anular ya ha sido retirado

- GIVEN una reserva activa de Norte el lunes
- WHEN la persona ejecuta `anular Norte lun`
- THEN la reserva sigue activa y `cancelar Norte lun` responde `cancelada Norte lun`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/guia.md` | 42 / 60 | 18 | sin cambio (28 tras quitar la línea, medido con `split(/\s+/).filter(Boolean)`) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
