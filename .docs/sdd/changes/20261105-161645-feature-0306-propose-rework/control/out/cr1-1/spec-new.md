---
id: 20261106-093957-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra: al cerrar la 0005 nadie supo que seguían abiertas otras filas del roadmap, y el dev-lead tuvo que parar a preguntarlo. Con el cambio, el aviso añade lo pendiente, por ejemplo «Se cierra: 0005 · Pendiente: 0010, 0011 y 1», o «Pendiente: nada» si no queda ninguna fila abierta. Por dentro es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`, y como es una edición de skill va con su prueba con sujetos (RED antes, GREEN después). El RED aún no se ha medido: si el aviso ya dijera lo pendiente, el cambio no entra.

Validación: dev-lead — el aviso lo lee una persona y su texto es lo que cambia; una medida del agente sobre sujetos no sustituye leerlo.

## Capacidades

- Ninguna, porque herramientas (es el texto de una skill del proyecto; `sdd capability index` dice «Sin capacidades»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de las ocho (sin capacidad, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad; el área la he leído entera) · tamaño: ~1 línea de la skill + esta spec, en 2 ficheros
- Único (sonnet): si el Scope y «Dónde se prueba» dicen lo mismo que la decisión 1 sobre qué cuenta como «pendiente», y si el «Entra, si el RED lo exhibe» deja claro qué pasa con un RED limpio (señal: spec de una sola decisión, sin capacidad)
- Mínimo razonable: sin review — deja sin cubrir una contradicción entre la decisión 1 y los casos de «Dónde se prueba», el tipo de hueco que solo aparece cuando el sujeto del RED ya ha costado dinero

1. **Qué cuenta como «pendiente»**: las filas de las tablas de release de `.docs/sdd/roadmap.md` (hoy «Próximo») cuyo estado es ⏳, 🔄 en curso, ⏸️ aparcada o 🧪 validación diferida (lista cerrada: ✅ y cualquier otro estado no cuentan), salvo la fila de la feature que se cierra. El Backlog, la Deuda técnica y los Patches no cuentan: no son trabajo comprometido. — El ticket dice «quedaba una fila abierta»; esa es la lectura más literal y la que una persona puede comprobar mirando el roadmap.
2. **La fuente se nombra en la skill**: el paso 1 dice dónde se mira (`.docs/sdd/roadmap.md`) en vez de pedir «lo pendiente» a secas. — Sin fuente, un sujeto inventa qué es pendiente (la deuda, los tests, el backlog); cuesta unas palabras más.
3. **Texto propuesto del paso 1** (literal, sustituye a «Di qué se cierra.»): «Di qué se cierra y qué queda pendiente: las filas de `.docs/sdd/roadmap.md` en ⏳, 🔄, ⏸️ o 🧪, salvo la que se cierra, con su id; si no queda ninguna, di «Pendiente: nada».» — Es la forma mínima que cumple lo que dijo el dev-lead («también qué queda pendiente») con los puntos 1 y 2.
4. **Forma del aviso**: una línea, `Se cierra: <id> · Pendiente: <ids separados por comas y «y» antes del último>` (p. ej. `Pendiente: 0010, 0011 y 0012`). Los ejemplos son míos; la skill no impone la forma, solo el contenido (qué se cierra y los ids pendientes); la única literal exigida es «Pendiente: nada». — Impone lo que el ticket echó en falta y deja el resto al sujeto.
5. **El paso 2 («Corre el gate.») y la `description` no cambian.** — El ticket solo habla del aviso.
6. **Enfoques** (en `delegate` no se pregunta cuál): A, una frase en el paso 1 sin fuente («…y qué queda pendiente»); B, una frase en el paso 1 que nombra la fuente y el criterio (elegida); C, un paso nuevo entre 1 y 2 para lo pendiente. C queda fuera: el dev-lead decidió que va en el paso 1. A es más corta pero deja al sujeto decidir qué es «pendiente», que es justo lo que el aviso debe fijar; la elijo B y es la decisión central.
7. **Batería**: el RED y el GREEN usan `tests/batteries/aviso-cierre/battery.md` (c1 y c2, n = 2 cada una, 4 sujetos Sonnet). `battery.md` solo trae los ids, sin casos: la primera tarea del plan escribe en esa batería los casos de «Dónde se prueba» —c1 los dos con filas abiertas, c2 el de nada pendiente— y qué mira cada sujeto, antes del RED. Un RED limpio es que los 4 sujetos pasen todas las comprobaciones. — No he podido leer los casos de c1 y c2 porque no están escritos; si ya existen en otro sitio, dímelo.
8. **Previsión de coste y de minutos** (art. 5 de la constitution): ~8,40 $ y ~30 min en total, tope del que no se pasa sin parar y decidir; con un RED limpio solo se gastan 2,80 $ y el cambio no entra. Los minutos son estimación mía, no medida: 3 tandas de 4 sujetos en paralelo a ~5 min (15 min) más ~15 min de escribir los casos y el cambio. Si los casos exigen más de 4 sujetos, la previsión se rehace y se para.
9. **No hay tabla de topes de palabras**: el proyecto no tiene ningún test que limite en palabras `skills/aviso-cierre/SKILL.md` (`git grep -n "word\|palabras" -- test scripts src` sin resultados).
10. **Sin fila de roadmap propia**: la 0028 se reserva con `sdd id claim` (sin remoto: «la 0028 vale (contador local)») y no tiene fila en `roadmap.md`; el origen es el ticket de campo `20260914-aviso.md` §1. Si quieres fila, la añade `sdd-roadmap`.
### Hallazgos de la review

- **Aceptado** — Importante: casos sin asignar a c1/c2 y RED limpio sin definir → c1 y c2 asignados, RED limpio = 4 sujetos sin fallo (dec. 7, «Dónde se prueba»)
- **Aceptado** — Importante: «se cierra la 0028» sin fila y id «1» ambiguo → el caso cierra la 0009, ids de cuatro cifras, roadmap de la batería
- **Aceptado** — Importante: «no los nombra» no verificable → criterio: el texto tras «Pendiente:» no contiene la deuda ni B1
- **Aceptado** — Importante: ⏸️ y 🧪 sin caso → entran en el roadmap de c1
- **Aceptado** — Importante: «no es ✅» contradice la enumeración → lista cerrada ⏳ 🔄 ⏸️ 🧪, sin la fila que se cierra (dec. 1 y 3)
- **Aceptado** — Importante: coste con RED limpio y número de sujetos → dicho en dec. 8 y en la previsión (2 casos × n=2 = 4 sujetos)
- **Aceptado** — Importante: previsión depende de casos sin escribir → provisional si los casos exigen más de 4 sujetos (dec. 8)
- **Aceptado** — Menor: minutos sin desglose → desglosados y marcados como estimación
- **Aceptado** — Menor: formato del ejemplo → `Pendiente: 0010, 0011 y 0012`; solo «Pendiente: nada» es literal (dec. 4)
- **Aceptado** — Menor: «RED sin medir» no es decisión → movido a Intent. El ticket sí existe (`field-reports/20260914-aviso.md`, leído)
- Sin Crítico y sin reescribir la decisión central: no hay segunda ronda.

- Política de modelos: revisor de la spec, uno en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin código) · sujetos del RED y del GREEN: Sonnet, 4 por tanda en paralelo (hasta `control.maxParallelAgents`) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»

## Intent

Al cerrar una feature, `aviso-cierre` dice qué se cierra y nada más. En el cierre de la 0005 la persona no supo que quedaba una fila abierta, y eso costó una parada del dev-lead (`.docs/sdd/field-reports/20260914-aviso.md` §1). El RED aún no se ha medido (dicho por el dev-lead). Se quiere que el aviso diga también qué queda pendiente, para que nadie tenga que preguntarlo. Éxito: tras el cambio, un sujeto que cierra una feature con filas abiertas en el roadmap nombra sus ids en el aviso, y con ninguna dice «Pendiente: nada». Fracaso, aunque técnicamente cumpla: un aviso que lista como pendiente cosas que no son filas del roadmap (deuda, backlog) o que se inventa ids.

## Scope

- Entra, si el RED lo exhibe: el paso 1 de `skills/aviso-cierre/SKILL.md` con el texto de la decisión 3, y el caso de la batería que lo mide (decisión 7). Todo el cambio va marcado porque el ticket de campo es un relato, no una medida: con un RED limpio a n = 4 (c1 y c2) el cambio no entra y sale con un ruling; con menos sujetos sería una desviación.
- No entra: el paso 2 («Corre el gate.»), la `description` de la skill, el roadmap, otras skills, y cualquier cambio en el gate.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1 «Di qué se cierra.» → texto de la decisión 3 | `skills/aviso-cierre/SKILL.md:8` | Scope (entra, si el RED lo exhibe) |
| Coste de un sujeto de `aviso-cierre` (~0,70 $) | `.docs/sdd/tech-stack.md:6` | Se usa tal cual en la previsión; no cambia |
| Casos c1 y c2 de la batería | `tests/batteries/aviso-cierre/battery.md` | Scope: decisión 7 |

- Filas que implementa: ninguna: comprobado con `git grep -niE "aviso-cierre|di qué se cierra|queda pendiente|qué queda|0028|close-notice" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports' ':!tests/*.md'`, cuyos únicos resultados son `tech-stack.md:6` y la propia skill.
- El caso real del ticket (cerrar la 0005 con una fila abierta) no se puede reproducir tal cual: el roadmap de hoy ya no tiene la fila 0005. Su equivalente de hoy es «Próximo» con 0010, 0011 y 1 en ⏳; «Dónde se prueba» usa un roadmap de la batería con ids de cuatro cifras. Con sujetos, `sin medir`.

## Approach

Una sola edición: el paso 1 de la skill nombra qué se cierra y qué queda pendiente, y de dónde sale lo pendiente (decisiones 1–3). Se prueba con la batería de la skill, RED antes y GREEN después, sin tocar nada más.

## Dónde se prueba

Con sujetos Sonnet sobre la batería `aviso-cierre`, como el patch 0006; el roadmap de cada caso lo da la batería, no el roadmap real.

- c1, filas abiertas (n = 2): roadmap con 0009 en 🔄 (la que se cierra), 0010 en ⏳, 0011 en ⏸️ aparcada y 0012 en 🧪 → el texto tras «Pendiente:» nombra `0010`, `0011` y `0012` y no nombra `0009`.
- c1, el aviso no inventa (mismos sujetos): el mismo roadmap, con la deuda técnica «Sin validación del formato de franja horaria» y el backlog B1 → el texto tras «Pendiente:» no contiene la deuda ni B1.
- c2, nada pendiente (n = 2): roadmap con 0009 en 🔄 y el resto en ✅ → el aviso dice «Pendiente: nada».

## Términos y ADR

- Términos resueltos: pendiente — fila de una tabla de release del roadmap en ⏳, 🔄, ⏸️ o 🧪, salvo la que se cierra (decisión 1).
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: sin capacidades (`sdd capability index`: «Sin capacidades»). No hay delta que fusionar, así que no se ha probado la fusión en una copia.

## Previsión de coste

Cada cifra usa el precio por sujeto de `tech-stack.md` (~0,70 $) y los sujetos de la batería `aviso-cierre` (c1 n=2 + c2 n=2 = 4).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (c1, c2) | 2,80 |
| GREEN | 4 (c1, c2) | 2,80 |
| Una tanda de REFACTOR | 4 (c1, c2) | 2,80 |
| Controles | 0: la spec no pide control aparte | 0 |
| Medición tras la revisión final | 0: no hay edición de skill tras la review salvo que la review pida una | 0 |
| Suma | | 8,40 |

Minutos: ~30 min en total (decisión 8). Si la prueba supera 8,40 $ o 30 min, se para y decide el dev-lead.

## Enmiendas

_Ninguna todavía._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
