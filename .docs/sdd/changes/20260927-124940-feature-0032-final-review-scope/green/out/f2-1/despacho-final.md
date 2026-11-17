# Despacho del revisor final — feature 0012

Estado: preparado, **sin despachar**. Estos son los parámetros exactos con los que se lanzaría el `Agent` cuando el usuario lo confirme.

## Paquete de review

- Rama: `feature/0012`, integración `develop` (`merge.into` de `sdd-kit.json`).
- Base de cálculo: `git merge-base HEAD develop origin/develop` → `6fa9ad4884c58d9f92bdbe107a0d259a6d152e16` (incluye ya `feat(0013): listado de salas`, que llegó a `feature/0012` por el merge de sincronización `1339db4` y NO es de esta feature).
- Commits en el rango de la feature: `1f18ad4`, `5bb703b`, `ff079f8`, `1339db4` (merge), `3a0dd40`.
- Ficheros en el diff acotado (excluye `.docs/sdd/specs/**/red/**` y `**/green/**`): `.docs/sdd/specs/20260927-100000-feature-0012-franja/spec.md`, `src/slots.js`, `tests/free-format.test.js`, `tests/slot-format.test.js` (60 líneas insertadas).
- Paquete generado en: `<home>\AppData\Local\Temp\claude\sdd-workspace\feature-0012\review-final-3a0dd40.diff` (ruta Windows; POSIX: `/tmp/claude/sdd-workspace/feature-0012/review-final-3a0dd40.diff`).

## Parámetros de despacho

```
subagent_type: sdd-kit:effort-high
model: opus
```

(`sdd-kit:effort-high` está disponible en esta sesión — no hace falta la frase de respaldo de effort.)

## Prompt completo

````markdown
## Restricciones de código

## Art. II — Tests

Suite: `node --test`. Todo verde antes de fusionar.

Incumplir una de estas restricciones es **Important**, aunque la plantilla de abajo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

## Cómo revisar

Lee el paquete de review `<home>\AppData\Local\Temp\claude\sdd-workspace\feature-0012\review-final-3a0dd40.diff`: tiene los commits, el resumen y el diff completo de la rama. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.

---

<plantilla de superpowers `code-reviewer.md` a partir de aquí>
````

Nota: el bloque `## Restricciones de código` copia literalmente el Art. II de `.docs/sdd/constitution.md` (el único artículo de este proyecto que es una restricción de código — el Art. I, de commits, es «De proceso»: atribución/formato de commit, y no viaja al revisor). La plantilla `code-reviewer.md` de `superpowers` no está presente como fichero en este workspace (no se ha podido leer su contenido literal aquí); quien despache debe adjuntarla tal cual — sin resumirla ni reescribirla — a continuación de la cabecera de arriba, tal como exige `encargo-revision.md`.
