# Batería de regresión — `sdd-roadmap`

Cómo entra el trabajo en el roadmap antes de hacerlo. Nace en la feature 0161 como humo (Art. I: una edición de una skill de la 2.3.x sin batería lleva humo) y mide lo que la 0161 le añade: cada fila que escribe prevé sus tasks y ninguna pasa el umbral de partir, el cierre da el prompt de arranque de la fila que va primero, y «dame el prompt de la <id>» lo da sin escribir nada.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-roadmap`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 30 turnos como máximo. Dos moldes sobre el de `tests/batteries/using-sdd/mold-salas`, con `control.profile: delegate` y `merge.push: true` en el marcador: `salas`, tal cual, y `salas-0013`, con la fila pendiente 0013 «Aviso semanal a los responsables» (`proposal: 0010`, tras 0012) y la propuesta 0010 (`proposal-0010.md`), cuya enmienda cambia el aviso de las 9:00 a las 8:00.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y el `roadmap.md` que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| m1 | prompt | dame el prompt de la 0013 | salas-0013 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161; enmienda de la propuesta 0131 del 2026-10-08: el prompt de arranque con forma fija |
| m2 | size | El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Decide tú los detalles. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161 (dev-lead, 2026-10-10): en la 0131, tres de once filas se partieron al arrancar |
| m3 | size | El cliente quiere usuarios con login, que el responsable de sala tenga su rol, que cada reserva guarde quién la hizo y migrar las reservas de ahora a un usuario genérico. Decide tú los detalles. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161: un reparto con una fila que pasa el umbral (el x1 de la batería de `sdd-propose`, ya llevado al roadmap) |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| M1 Prompt de una fila | m1 | el prompt no tiene esta forma: título «0013 — Aviso semanal a los responsables»; `Base: develop`; la rama `feature/0013-<slug>` sola en su bloque; el carril; un segundo bloque que arranca la 0013 con `sdd-propose`, nombra la propuesta 0010 y lleva el aviso a las 8:00 de la enmienda, «Perfil delegate» y «Al fusionar, `sdd merge --push`»; o escribe en el roadmap, reserva, publica o commitea |
| M2 Filas dimensionadas | m2, m3 | alguna fila propuesta no dice sus tasks previstas, o alguna pasa el umbral (más de 5, o 4-5 en superficies distintas o con migración); o el mensaje final no da el prompt de arranque de la primera fila y la frase «si prefieres hacerlo en esta sesión, di "arráncalo"» |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Las reglas que añade la 0161 a `skills/sdd-roadmap/SKILL.md`, de dónde viene cada una y qué escenario la cubre. Las anteriores tienen su evidencia en `tests/sdd-roadmap-red.md` y `-green.md`.

| Regla | Origen | Escenarios |
| --- | --- | --- |
