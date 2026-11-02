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

🦆 Hoy, al cerrar una feature, salen dos skills: `aviso-cierre` ("di qué se cierra" y "corre el gate") y `resumen-cierre` (commits y filas del roadmap). Al retirar la primera, `resumen-cierre` pasa a decir qué se cierra y a correr el gate, y así queda un solo mensaje: «Cierras la 0030 · gate en verde · 4 commits · salda la fila 0030».

Validación: dev-lead — es una skill que usa una persona al cerrar; el agente no puede juzgar si el mensaje único se entiende.

## Capacidades

- Modificadas: `closing` — `resumen-cierre` dice qué se cierra (en vez de `aviso-cierre`) y lleva el gate; sus pasos se renumeran.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (dos requisitos de `closing`) · tamaño: ~12 líneas en 3 ficheros
- Mínimo razonable: ninguna — nada que descartar; deja sin mirar solo que la renumeración no contradiga otro requisito, y eso lo cubre la pasada de coherencia (abajo).

1. `resumen-cierre` pasa a tener cuatro pasos: 1. «Di qué se cierra» · 2. «Corre el gate» · 3. «Cuenta los commits de la rama» · 4. «Lista las filas del roadmap que salda». — la petición dice que `resumen-cierre` «gana una línea con lo que se cierra»; yo he añadido que también hereda el gate, porque `aviso-cierre` lo corría en su paso 2 y retirarla lo dejaría sin dueño. Dejarlo en una línea (solo «qué se cierra») es la alternativa: entonces nadie corre el gate al cerrar y hay que decir dónde vive.
2. El gate conserva el **paso 2** — porque `closing` ya dice «llega el paso 2» en «El gate corre una sola vez» y «Un gate en rojo para el cierre»; con «qué se cierra» en el paso 1 y el gate en el 2, esos dos requisitos siguen siendo ciertos sin tocarlos.
3. Esto obliga a un segundo `MODIFIED`: «El resumen va al final» pasa de «paso 1 / paso 2» a «paso 3 / paso 4». — consecuencia de la decisión 1.
4. La `description` de `resumen-cierre` (hoy «Usar al acabar el cierre de una feature») cambia a «Usar al cerrar una feature», porque ya no es solo el resumen del final. — su literal habría contradicho el paso 1; es texto de la skill, no de la capacidad.
5. No toco el gate en sí (`node --test && node scripts/lint.mjs`): solo cambia qué skill lo corre.
- Política de modelos: ninguno (sin revisores de la spec) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Resultado de `capability merge` sobre una copia de `.docs/sdd`: salió bien (exit 0) — `closing.md: sustituido «Quien cierra sabe qué se cierra»` y `closing.md: sustituido «El resumen va al final»`; el resto de requisitos queda intacto. El `capabilities/` del repo no se tocó.

### Decisiones tomadas con el dev-lead

- Se retira `aviso-cierre` — roadmap 0030, «Retirar la skill aviso-cierre».

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: tras el cambio existe una sola skill de cierre, `resumen-cierre`, y en ella aparecen, en orden, qué se cierra, el gate, los commits y las filas saldadas; ningún texto del proyecto nombra `aviso-cierre`. Sería un fracaso que el cierre dejara de correr el gate.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` se reescribe con los cuatro pasos de la decisión 1 y la `description` de la decisión 4 (los dos pasos nuevos vienen de `aviso-cierre`, los dos viejos se renumeran).
- Entra: `.docs/sdd/capabilities/closing.md` (lo cambia la fusión del delta al archivar, no a mano).
- Entra: marcar la fila 0030 del roadmap como saldada (lo hace el cierre).
- No entra: cambiar `aviso-apertura`.
- No entra, y por qué: `README.md`, `PRODUCT.md`, `scripts/lint.mjs`, `package.json` y `test/` — la búsqueda de `aviso-cierre` no los nombra.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` (todo el fichero) | Scope: se borra la carpeta |
| «Di qué se cierra» (paso 1 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:8`; `capabilities/closing.md:13` | delta, `MODIFIED` «Quien cierra sabe qué se cierra»; decisión 1 |
| «Corre el gate» (paso 2 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:9`; `closing.md:15-25` («El gate corre una sola vez», «Un gate en rojo para el cierre», ambos «el paso 2») | decisión 1 y 2: pasa al paso 2 de `resumen-cierre`; los dos requisitos no cambian |
| pasos 1 y 2 de `resumen-cierre` (pasan a 3 y 4) | `skills/resumen-cierre/SKILL.md:8-9`; `closing.md:33-38` («El resumen va al final») | delta, `MODIFIED` «El resumen va al final»; decisión 3 |
| `description` de `resumen-cierre` | `skills/resumen-cierre/SKILL.md:3` | decisión 4 |

- Filas que implementa: 0030 → `.docs/sdd/roadmap.md:9` (su propia fila, se salda al cerrar); ningún otro fichero la nombra: comprobado con `grep -rniE "aviso-cierre|0030" --exclude-dir=.git .` (README, PRODUCT y `.docs` salvo la fila y esta spec, sin resultados).

## Approach

`resumen-cierre` abre con lo que se cierra y corre el gate antes de contar commits y filas; `aviso-cierre` desaparece. El resto de la skill sigue igual.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`: debe decir qué se cierra, correr el gate y luego dar commits y filas.
- que no queda referencia: `grep -rn aviso-cierre --exclude-dir=.git --exclude-dir=specs .` sin resultados.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra, en su paso 1

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
