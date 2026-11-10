---
id: 20261110-111746-feature-0014-notice-room
feature: 0014
title: Teléfono de conserjería en la plantilla del aviso
mode: full
status: draft
created: 2026-11-10
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Teléfono de conserjería en la plantilla del aviso

🦆 Hoy el aviso de sala dice solo «Aviso de sala: {sala} el {dia}.». Con este cambio, quien lo recibe verá debajo una segunda línea, «Conserjería: 5500», para saber a qué teléfono llamar. Por ejemplo (ilustrativo: hoy nada rellena la plantilla), el texto de la plantilla tendrá dos líneas: «Aviso de sala: {sala} el {dia}.» y «Conserjería: 5500». Por dentro solo se toca `docs/plantillas/aviso.md` (una línea) y se añade un test que comprueba las dos líneas; el conjunto de plantillas pasa de 52 a 54 palabras y sigue bajo su tope de 60.

Validación: agente — es un documento de texto fijo y lo mide un test; un humano no observaría nada que el test no compruebe ya.

## Capacidades

- Ninguna, porque docs (una plantilla de texto; el proyecto no tiene `capabilities/`: `sdd capability index` dice «Sin capacidades»). No hay delta que fusionar.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet, siete puntos) — señales: ninguna contada (sin capacidad nueva, sin contrato público, sin `MODIFIED`/`REMOVED`, sin datos ni dependencias, sin reglas de visibilidad; el área —una plantilla y su test de palabras— la he leído entera) · tamaño: ~3 líneas en 2 ficheros
- Técnica (sonnet, con los siete puntos por ser un solo revisor): si el tope de 60 palabras de `test/words.test.js` se mantiene con la línea nueva (52 + 2 = 54) y si el test nuevo no depende del final de línea (señal: tope de palabras)
- Mínimo razonable: sin revisor — deja sin mirar que la spec no se contradiga con el tope de palabras ni con el final de línea del fichero

1. **Posición**: la línea nueva va **al final**, debajo de «Aviso de sala: {sala} el {dia}.»; «añade una línea» no decía dónde — un aviso se lee de arriba abajo y el teléfono es lo último que se necesita.
2. **Literal exacto**: `Conserjería: 5500`, con tilde en «Conserjería», sin punto final (el literal del dev-lead no lo lleva; la primera línea sí lo lleva porque ya lo tenía).
3. **Final de línea**: el fichero hoy acaba en salto de línea (LF); la línea nueva también lo hace, así que el fichero sigue acabando en salto de línea. El test comprueba que el contenido acaba en salto de línea y parte por `/\r?\n/` filtrando las líneas vacías (`.filter(Boolean)`), para no depender del LF/CRLF que ponga `core.autocrlf=true` al hacer checkout en Windows.
4. **Test nuevo** en `test/plantillas.test.js` (módulo ESM con `import`, como `words.test.js`; no tocar `words.test.js`): lee `docs/plantillas/aviso.md` con `readFileSync`, como ya hace `words.test.js`, y comprueba las dos líneas.
5. **Tope de palabras sin cambio** (60): medido 52 (`recibo.md` 46 + `aviso.md` 6), previsto +2 = 54, margen 6. No propongo subirlo porque cabe.
6. **Validación `agente`**: es un texto fijo comprobado por test; lo propongo yo, no lo ha pedido el dev-lead, y se aprueba con la spec.
7. **Enfoque**: A (elegido), frente a B y C (ver Approach).
8. **Id/slug**: el id 0014 es el de la rama `feature/0014-notice-room`; no tiene fila en el roadmap y no la he creado (no me la pidieron).
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (una sola task) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

1. **Aceptado** — el THEN «son 54» no lo comprueba ningún test → el escenario dice «≤ 60» y deja el 54 como medición de la spec.
2. **Aceptado** — el final de línea afirmado no tenía escenario → escenario y aserción nuevos («acaba en salto de línea»).
3. **Aceptado** — falta filtrar vacías en la decisión 3 → escrito `.filter(Boolean)`.
4. **Aceptado** — el ejemplo «Norte el lun» presupone un render que no existe → ejemplo reformulado como ilustrativo, con el texto de la plantilla.
5. **Rechazado** — «Mínimo razonable: sin revisor» contradice la línea del revisor → la forma de la línea es la del rubric: el mínimo es la opción más baja defendible, no lo que se despachó.
6. **Aceptado** — el fichero del test no estaba en Scope ni su estilo ESM → citado en Scope y en la decisión 4.

### Decisiones tomadas con el dev-lead

- La plantilla `docs/plantillas/aviso.md` añade una línea con el teléfono de conserjería: «Conserjería: 5500» — «docs/plantillas/aviso.md añade una línea con el teléfono de conserjería, «Conserjería: 5500»»

## Intent

Hoy el aviso de sala (`docs/plantillas/aviso.md`) es una sola línea: «Aviso de sala: {sala} el {dia}.». Quien lo recibe no tiene a mano a quién llamar si algo falla con la sala. Se quiere que el aviso incluya el teléfono de conserjería. Éxito: el fichero tiene exactamente dos líneas, la segunda es `Conserjería: 5500`, y `node --test` entero sigue en verde, con el conjunto de plantillas ≤ 60 palabras. Fracasaría, aunque «funcione», si la línea nueva rompiera el tope de palabras de `docs/plantillas` o cambiara la primera línea.

## Scope

- Entra: añadir al final de `docs/plantillas/aviso.md` la línea `Conserjería: 5500`; un test nuevo, `test/plantillas.test.js`, que la comprueba.
- No entra: cambiar la línea existente «Aviso de sala: {sala} el {dia}.»; tocar `docs/plantillas/recibo.md`; tocar el tope de `test/words.test.js`; tocar `src/app.js` (no usa la plantilla); parametrizar el teléfono (queda fijo en la plantilla); una fila de roadmap.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La plantilla del aviso pasa de una línea a dos (se añade una línea fija) | `docs/plantillas/aviso.md:1`; nadie más la nombra: `git grep -n "aviso\|Aviso"` fuera de `specs/` solo da `aviso.md:1` y la fila 1 del roadmap («Avisos por correo antes de la reserva», otra cosa) | Scope y decisión 1 |
| Conjunto `docs/plantillas` cuenta 2 palabras más (52 → 54) | `test/words.test.js:5-8` (tope 60) | Decisión 5: sin cambio de tope, medido con `node -e` sobre el fichero actual |

- Filas que implementa: 0014 → nada: comprobado con `git grep -n "0014\|conserjer\|Conserjer\|5500" -- . ':!.docs/sdd/specs'` (sin resultados: no hay fila ni otro fichero que la nombre).

## Approach

- **A. Una línea fija al final del fichero** — cuesta una línea y un test; el teléfono queda en el texto de la plantilla.
- **B. Parametrizar el teléfono (`{conserjeria}`)** — cuesta una variable que nadie rellena hoy (`src/app.js` no usa la plantilla) y un sitio donde definirla.
- **C. Línea fija al principio** — mismo coste que A, pero el teléfono antecede al aviso.
- Elegido: **A** — lo decidió el dev-lead en cuanto al qué («añade una línea con el teléfono… «Conserjería: 5500»», literal fijo) y la posición es mía (decisión 1). B añade complejidad sin necesidad; C pone el dato accesorio antes del principal.

El fichero final es:

```text
Aviso de sala: {sala} el {dia}.
Conserjería: 5500
```

(con salto de línea tras cada línea).

## Dónde se prueba

- Contenido del aviso: `test/plantillas.test.js` nuevo, leyendo `docs/plantillas/aviso.md` como hace `test/words.test.js`; RED hoy: el fichero tiene una sola línea.
- Tope de palabras: el test existente `test/words.test.js`, sin tocarlo (debe seguir en verde: ≤ 60).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio es de documentos (ver «Capacidades»).

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `docs/plantillas/` (conjunto, `test/words.test.js`) | 52 / 60 | 8 | medido + previsto (+2, borrador `Conserjería: 5500`) = 54, margen 6 · sin cambio (60) |

Escenarios:

- GIVEN `docs/plantillas/aviso.md` tras el cambio · WHEN se lee y se parte por `/\r?\n/` sin las vacías · THEN son dos líneas: `Aviso de sala: {sala} el {dia}.` y `Conserjería: 5500`
- GIVEN `docs/plantillas/aviso.md` tras el cambio · WHEN se lee el contenido en bruto · THEN acaba en salto de línea
- GIVEN todo `docs/plantillas/` tras el cambio · WHEN se cuentan las palabras como en `test/words.test.js` · THEN son ≤ 60 (la medición de 54 es de la spec, no del test)

## Enmiendas

_Sin enmiendas._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
