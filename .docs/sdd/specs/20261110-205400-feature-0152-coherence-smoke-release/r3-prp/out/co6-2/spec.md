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

🦆 Hoy, al cerrar una feature, salen dos mensajes: `aviso-cierre` dice «qué se cierra» y «corre el gate», y `resumen-cierre` cuenta los commits y las filas que salda. Después de esta feature queda un solo mensaje, el de `resumen-cierre`, con tres datos en una línea (ejemplo ilustrativo, no es un formato fijado): `3 commits · salda: nada · cierra: Retirar la skill aviso-cierre`. La skill `aviso-cierre` desaparece del repo. Por dentro: se borra `skills/aviso-cierre/`, se añade un paso 3 a `resumen-cierre` y se corrige el requisito de `closing` que nombraba a la skill retirada.

Validación: dev-lead — es el texto que lee quien cierra una feature; el agente no puede juzgar si un solo mensaje le basta.

## Capacidades

- Modificadas: `closing` — «Quien cierra sabe qué se cierra» pasa de `aviso-cierre` a `resumen-cierre`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (un requisito de `closing`), contrato público: no · tamaño: ~15 líneas en 3 ficheros
- Dominio (sonnet): si quitar «Corre el gate» de la skill retirada deja a quien cierra sin esa orden en algún sitio, y si el paso 3 de `resumen-cierre` cumple el THEN de «Quien cierra sabe qué se cierra» (señal: MODIFIED)
- Técnica (sonnet): si `capabilities/closing.md` y `skills/` siguen coherentes tras el cambio —los «paso 1» y «paso 2» de «El resumen va al final» no se mueven— y si queda algún nombre `aviso-cierre` vivo (señal: MODIFIED)
- Mínimo razonable: un revisor con los siete puntos — deja sin separar la mirada de dominio de la de coherencia técnica entre skill y capacidad

1. Enfoque: el paso nuevo va **al final** de `resumen-cierre` como paso 3, frente a ponerlo primero (renumera los pasos 1 y 2 y obliga a un segundo `MODIFIED` de «El resumen va al final») o dejarlo como línea sin número (rompe el formato de pasos de las skills) — ver Approach.
2. El texto del paso 3 es `3. Di qué se cierra.`, igual que el paso 1 que tenía `aviso-cierre`: nadie dijo otro. El ejemplo de la 🦆 es ilustrativo: ni formato ni orden fijados.
3. **Se retira también «Corre el gate»** (paso 2 de `aviso-cierre`), sin sustituto en ninguna skill: el gate de cierre lo fija `operations.md` (`node --test && node scripts/lint.mjs`; la constitución, art. 2, exige `node --test` entero en verde) y lo corre `sdd-archive` en su paso 1 (bullet «The suite» de su `SKILL.md`, del kit, no del repo: no se puede comprobar desde aquí); mantenerlo en una skill propia duplicaba la orden. Si prefieres que `resumen-cierre` la conserve, dilo y entra como paso 4.
4. «Di qué se cierra» pasa a decirse **al final**, como cierre del resumen y no al arrancar el cierre: es el precio del enfoque A, y por eso la `description` de `resumen-cierre` («Usar al acabar el cierre de una feature.») no cambia.
5. Se mantienen los pasos 1 y 2 con su número: «El resumen va al final» no cambia ni una línea; sigue describiendo solo los pasos 1 y 2, y el paso 3 vive en «Quien cierra sabe qué se cierra» (reparto a propósito: cada requisito, un comportamiento).
6. No se añade ningún test nuevo —excepción al art. 2 de la constitución («tests antes que código»), justificada porque el cambio es solo de texto de skills y `node --test` no las lee—: la comprobación son comandos `git grep` y `test` (ver «Dónde se prueba»); el gate de cierre sigue siendo el de `operations.md`, sin cambios.
7. `aviso-cierre` se borra sin alias ni nota de retirada, y sin entrada en `CHANGELOG.md` (son skills de trabajo, no producto: el changelog cuenta lo que hace la CLI de reservas): quien la tenga referenciada fuera del repo (prompts, hooks) se queda con un nombre muerto.
8. `§Frontend`: no aplica, no cambia nada que se vea en pantalla (CLI sin interfaz). Ninguna capacidad nueva, ninguna ADR, ningún término resuelto.
9. Delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: `closing.md: sustituido «Quien cierra sabe qué se cierra»`, sin rechazos; «La apertura avisa de la rama» y «El resumen va al final» quedan intactos. `capabilities/` del repo sin tocar.
- Política de modelos: dos revisores de la spec, dominio y técnica, ambos sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Primera ronda (dos revisores) y segunda (uno, por el Crítico aceptado):

- **Aceptado** — Crítico: el `AND no existe la skill` dejaba un `aviso-cierre` vivo en `closing.md` y hacía inalcanzable el grep del Intent → quitado del delta; el grep excluye `ROADMAP.md` y se corre tras el archivo.
- **Aceptado** — la cita del gate atribuía el lint a la constitución → corregida en la decisión 3, y marcada como no comprobable desde el repo la cita a `sdd-archive`.
- **Aceptado** — «tres líneas» frente a un ejemplo de una línea → «tres datos en una línea», ejemplo ilustrativo (decisión 2); el ejemplo usa «salda: nada», como la fila 0030.
- **Aceptado** — comprobación a ojo del paso 3 → `git grep` con salida esperada en «Dónde se prueba».
- **Aceptado** — `aviso-cierre` sin redirección y excepción al art. 2 sin declarar → decisiones 7 y 6.
- **Aceptado** — requisito «El resumen va al final» ya no describe toda la skill → decisión 5. Desfase de momento («qué se cierra» al final) → decisión 4.
- **Aceptado** — el pathspec no excluía `changes/`, `closing.md` en el Scope sin tarea, forma `aviso cierre` sin comando → arreglados en Intent, Scope y «Filas que implementa».
- **Rechazado** — nombre de la aprobadora («Laura») frente a PRODUCT.md: viene del frontmatter que dejó el dev-lead, no es un ejemplo; el gate lo valida quien aprueba.
- **Rechazado** — señal «contrato público: no» y entrada de CHANGELOG: las skills son de trabajo, no un contrato de la CLI (decisión 7).
- **Rechazado** — THEN observable con el título de la feature: es texto de una skill, el requisito vigente ya decía «dice qué se cierra» y se verifica leyendo el paso 3.
- **Rechazado** — contradicción «dos revisores» / «mínimo razonable»: es la forma del bloque de review; el mínimo dice lo que quedaría sin cubrir.
- **Rechazado** — sacar 8 y 9 de las decisiones y quitar «bis»: la plantilla pide ✋ exhaustiva; renumeradas sin «bis».
- **Rechazado** — encabezado `(antes: …)` posiblemente distinto del vivo: la fusión de la copia lo sustituyó sin rechazo (decisión 9).

### Decisiones tomadas con el dev-lead

- Retirar la skill `aviso-cierre` y que `resumen-cierre` diga también qué se cierra — fila 0030 del roadmap y petición inicial.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: al cerrar, el único mensaje es el de `resumen-cierre`, con commits, filas que salda y qué se cierra; y, tras el archivo de la feature, `git grep -n "aviso-cierre" -- . ':!.docs/sdd/specs' ':!ROADMAP.md'` no da ningún resultado (`.docs/sdd/specs/` es evidencia, y `.docs/sdd/changes/` aún no existe; `ROADMAP.md` conserva el título de la fila 0030). Fracaso aunque «funcione»: que se pierda en silencio una orden que `aviso-cierre` daba (el gate) sin que nadie lo haya decidido: por eso es la decisión 3.

## Scope

- Entra: se borra `skills/aviso-cierre/` entera; `skills/resumen-cierre/SKILL.md` gana el paso 3 «Di qué se cierra.»; `.docs/sdd/capabilities/closing.md`: el requisito «Quien cierra sabe qué se cierra» nombra `resumen-cierre` (lo aplica la fusión de `sdd-archive`, no se edita a mano: no hay tarea del plan que lo toque).
- No entra: cambiar `aviso-apertura`; tocar «La apertura avisa de la rama» ni «El resumen va al final»; mover el gate a otra skill; editar `ROADMAP.md` (la fila 0030 la pasa a hecha `sdd-archive`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (carpeta y `name: aviso-cierre`) | `skills/aviso-cierre/SKILL.md:2` y `:6` | Scope: se borra la carpeta |
| su paso 1 «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | pasa a paso 3 de `resumen-cierre` · delta `MODIFIED` |
| su paso 2 «Corre el gate.» | `skills/aviso-cierre/SKILL.md:9` | se retira sin sustituto · decisión 3 |
| el THEN «`aviso-cierre` dice qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | delta `MODIFIED` |
| los pasos 1 y 2 de `resumen-cierre` | `.docs/sdd/capabilities/closing.md:25-26`, `skills/resumen-cierre/SKILL.md:8-9` | no cambian de número · decisión 5 |
| la fila 0030 | `ROADMAP.md:9` | la pasa a hecha `sdd-archive` · fuera del Scope |

- Filas que implementa: 0030 → `ROADMAP.md:9` es su fila, y ningún otro fichero la nombra → destino: la cierra `sdd-archive`. Comprobado con `git grep -niE "0030|aviso-cierre" -- . ':!.docs/sdd/specs'`: tres ficheros (`closing.md`, `ROADMAP.md`, `skills/aviso-cierre/SKILL.md`), todos en la tabla. Sin hallazgos en `README.md`, `src/`, `test/`, `scripts/`, `CHANGELOG.md`. Otras formas del literal: `git grep -niE "aviso[ _-]?cierre" -- . ':!.docs/sdd/specs'` da los mismos hits.

## Approach

- A. Paso 3 al final de `resumen-cierre` — no renumera: los «paso 1» y «paso 2» de «El resumen va al final» siguen verdaderos; cuesta que «qué se cierra» salga el último, como cierre del resumen.
- B. Paso 1 nuevo, al principio — lee mejor («qué se cierra» abre), pero renumera y obliga a un segundo `MODIFIED` que reescribe los «paso 1» y «paso 2» de una capacidad que no tenía por qué tocarse.
- C. Línea sin número encima de los pasos — no toca la numeración, pero rompe el formato de pasos de las skills del proyecto.
- Elegido: A — es el único que cambia un requisito y no dos.

`aviso-cierre` se borra sin dejar redirección (decisión 7): la carpeta y su `name` son su única presencia.

## Dónde se prueba

- Skill retirada: `test ! -e skills/aviso-cierre` y `git grep -n "aviso-cierre" -- . ':!.docs/sdd/specs' ':!ROADMAP.md'`. Implementada la feature y antes del archivo, el único resultado esperado es `.docs/sdd/capabilities/closing.md:13` (lo sustituye la fusión del archivo); tras él, ninguno. Comandos, sin test nuevo (decisión 6).
- Mensaje de cierre: `git grep -nE "^[0-9]+. " skills/resumen-cierre/SKILL.md` da tres líneas, `1.`, `2.` y `3. Di qué se cierra.`, en ese orden. Es una comprobación de texto: la skill no tiene salida que ejecutar.
- Que nada se rompe: `node --test && node scripts/lint.mjs`, el gate de `operations.md`, sin cambios.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra (antes: "`aviso-cierre` dice qué se cierra")

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra en su paso 3

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
