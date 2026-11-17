---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

🦆 Hoy, al cerrar una feature, salen dos mensajes: `aviso-cierre` dice «qué se cierra» y corre el gate, y `resumen-cierre` cuenta commits y filas del roadmap. Tras el cambio sale uno solo, el de `resumen-cierre`, que empieza por «Se cierra la 0030: Retirar la skill aviso-cierre», corre el gate, y sigue con los commits y las filas. La skill `aviso-cierre` desaparece.

Validación: dev-lead — es el texto de una skill que lee una persona; se valida leyendo la salida de `resumen-cierre` en un cierre real.

## Capacidades

- Modificadas: `closing` — el aviso de qué se cierra lo da `resumen-cierre`, y los pasos del resumen se renumeran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (dos requisitos de `closing`) · tamaño: ~15 líneas en 3 ficheros (`skills/resumen-cierre/SKILL.md`, `closing.md`, y el borrado de `skills/aviso-cierre/`)
- Mínimo razonable: ninguna — deja sin mirar si el gate sigue corriendo antes del resumen, que ya vigilo en la pasada de coherencia.

1. **El gate se muda a `resumen-cierre`, no se pierde.** `aviso-cierre` no solo avisaba: su paso 2 era «Corre el gate», y los requisitos «El gate corre una sola vez» y «Un gate en rojo para el cierre» dependen de ese «paso 2». Retirar la skill sin más dejaba el cierre sin gate. Alternativa descartada: quitar el gate del cierre (rompería esos dos requisitos y la constitución, art. 2).
2. **Orden de `resumen-cierre`:** 1. Di qué se cierra · 2. Corre el gate · 3. Cuenta los commits de la rama · 4. Lista las filas del roadmap que salda. El gate queda en el paso 2, como estaba, así que esos dos requisitos siguen valiendo sin tocarlos. Alternativa: «qué se cierra» al final (descartada: tu Approach dice que abre).
3. **Literal del aviso:** `Se cierra la <id>: <título>`, p. ej. «Se cierra la 0030: Retirar la skill aviso-cierre». Nadie dio el texto; es mío.
4. **La `description` de `resumen-cierre` pasa de «Usar al acabar el cierre de una feature.» a «Usar al cerrar una feature.»**, porque ya no corre al acabar, sino al empezar el cierre.
5. **«El resumen va al final» se modifica:** sus pasos pasan de 1 y 2 a 3 y 4. Conservo el título, que es la clave de fusión.
6. **La fila 0030 del roadmap** la mueve `sdd-archive` al cerrar, no esta spec.
- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Fusión del delta (copia temporal de `.docs/sdd`): `closing.md: sustituido «Quien cierra sabe qué se cierra»` y `closing.md: sustituido «El resumen va al final»` (sin rechazos; el `capabilities/` del repo no cambia)

### Decisiones tomadas con el dev-lead

- La spec no se aprueba por delegación todavía: espera tu «apruebo».

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: un cierre da un único mensaje, empieza por qué se cierra, y el gate sigue corriendo una vez. Fracaso aunque «funcione»: que el cierre quede sin gate, o que `closing.md` siga nombrando una skill que no existe.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` abre con qué se cierra, corre el gate y renumera sus pasos (decisiones 1, 2 y 4); `capabilities/closing.md` recoge los dos requisitos modificados al archivar.
- No entra: cambiar `aviso-apertura`; la fila 0030 del roadmap (la mueve el archivo); los requisitos «El gate corre una sola vez», «Un gate en rojo para el cierre» y «La apertura avisa de la rama», que no cambian.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` (la carpeta entera) | Scope: se borra |
| el nombre `aviso-cierre` en un THEN | `.docs/sdd/capabilities/closing.md:13` | delta, `MODIFIED` «Quien cierra sabe qué se cierra» |
| su paso «Corre el gate» | `skills/aviso-cierre/SKILL.md:9` (paso 2); lo nombran sin decir la skill `closing.md` («llega el paso 2», «el paso 2 con un test en rojo») | decisiones 1 y 2: pasa al paso 2 de `resumen-cierre`; esos requisitos no cambian |
| los pasos 1 y 2 de `resumen-cierre` | `skills/resumen-cierre/SKILL.md:8-9`; `closing.md` («paso 1 cuenta los commits», «paso 2 lista las filas») | delta, `MODIFIED` «El resumen va al final»: pasan a 3 y 4 |
| la `description` de `resumen-cierre` | `skills/resumen-cierre/SKILL.md:3` | decisión 4 |
| la fila 0030 | `.docs/sdd/roadmap.md:9` | decisión 6: la mueve `sdd-archive` |

- Filas que implementa: 0030 → `roadmap.md:9` (la salda `sdd-archive`); ningún otro fichero la nombra: comprobado con `grep -rniE "aviso-cierre|0030" --exclude-dir=.git .` (solo `closing.md`, `roadmap.md` y la propia skill)

## Approach

`resumen-cierre` abre con lo que se cierra; corre el gate en su paso 2, donde lo corría `aviso-cierre`; el resto de la skill sigue igual, con los pasos renumerados.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`, que empieza por «Se cierra la <id>: <título>».
- el gate: sigue siendo el paso 2; se comprueba que `skills/` ya no contiene `aviso-cierre` y que `resumen-cierre` lo trae en ese paso (`grep` sobre los dos ficheros).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra (antes: "`aviso-cierre` dice qué se cierra")

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 3 cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
