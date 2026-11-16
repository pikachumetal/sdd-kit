---
id: 20261103-162611-feature-0303-adr-three-rules
feature: 0303
title: Walkthrough — ADR de las tres reglas del dev-lead para el texto del kit
spec: ./spec.md
status: done
created: 2026-11-03
---

# Walkthrough — ADR de las tres reglas del dev-lead para el texto del kit

## 1. Cambios realizados

- **ADR nueva** (`6c6c40d2`): `.docs/sdd/decisions/0022-three-rules-for-kit-text.md`, con las tres reglas literales del dev-lead (2026-11-03), lo que significa cada una al escribir y al arreglar, y su contexto medido: `e7ddf254` (la 0013 aplicada como «devolver el texto» pegó K1 en `sdd-implement/SKILL.md:18`), el ticket de la 0175 §1, `fork-audit.md` de la 0296 y el research de la 0299 (§2.2 y §2.3). Sustituye entera a la 0013 y la consecuencia de la 0019 «Editar una frase de una skill no toca ningún test. Cambiar la forma de una plantilla tampoco.».
- **ADR 0013** (`6c6c40d2`): solo `status: superseded by 0022`.
- **ADR 0019**: sin tocar; la sustitución parcial la declara la 0022 en sus Consecuencias, como la 0019 hizo con la 0011 y la 0015 con la 0006.
- **Constitution, Art. IX** (`6c6c40d2`): la frase de la 0013 se sustituye por las tres reglas; el *Por qué* suma el de la ADR nueva y enlaza la 0022 en el sitio de la 0013.
- **`tech-stack.md`** (`6c6c40d2`): la frase de la revisión de fuentes que citaba «los tres motivos de la ADR 0013» dice la regla 2 y enlaza la 0022.
- **Spec** (`7bcec95b`): apertura.
- **`tech-stack.md`**, en el cierre: el enlace `[task-ids](capabilities/task-ids.md)`, roto desde antes de la rama, pasa a `capabilities/feature-ids.md` (retro).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 0,5 h
- Esfuerzo real: 0,32 h — reloj de la sesión 0,48 h desde 2026-11-03T16:22Z, sin 9 min de espera al dev-lead (2 esperas)
- Desviación: −0,18 h (−36 %)
- Causa de la desviación: ninguna espera la explica (Esperas y huecos: 16:28Z 3 min; 16:35Z 7 min, ya descontadas); la estimación separaba spec e implementación, y la ADR salió del Approach casi literal
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, implementación y cierre)
- Tokens del hilo: 12.133.244 — claude-opus-5-5 12.133.244
- Tokens de subagentes: 3.255.592 en 2 despachos — Final review — Code axis claude-sonnet-5-5 973.784 / 2 min; Final review — Spec axis claude-opus-5-5 2.281.808 / 4 min
- Coste de la sesión: 7,60 $ (hilo 5,71 $ + subagentes 1,89 $)
- Coste de sujetos: no aplica
- Review de spec: no (carril lite)

## 3. Desviaciones del plan

- La reescritura de la frase del Art. IX, fuera del alcance literal del prompt, ya iba en la spec (decisión 9) y se aprobó con ella.
- Enmienda de la pasada de fix (juntada en el cierre, `sin aprobar`: aplica literal la regla 2 y «para todo el kit» de «Decisiones tomadas con el dev-lead»): la regla 2 de la 0022 dice que un añadido que deja falsa una absoluta de la fuente es una sustitución, en vez de «lo propio del kit va en sustituciones o fuera de la copia»; «trae algo de otro kit» pasa a ser otra fuente; y la Confirmación de la regla 3 cubre toda skill del diff, no solo las copias. Decisiones 5 y 8 de la spec y su «Enmiendas».

### Decisiones tomadas sin el dev-lead

- El escenario de `capabilities/verification.md:63` sigue nombrando la 0013 — la decisión 10 aprobada: su GIVEN fija su estado y prueba el mecanismo — si está mal, un lector ve de ejemplo una ADR sustituida; se cambia en la próxima feature que toque `verification`.
- El Art. IX no recoge la segunda mitad de la regla 3 («una regla vive en el paso donde se decide») — el artículo resume y enlaza la ADR, y la constitution está a 4 palabras de su tope — si está mal, quien lea solo la constitution no la ve; la aplica la 0304.
- La 0019 queda `accepted` sin puntero a la 0022 — ADR inmutable (Art. XI), precedente de la 0011 y la 0006 — si está mal, quien toque `cli/test/kit/` no ve la consecuencia nueva con `decision index`; lo recoge la spec de la 0304.

## 4. Verificación

### 4.1 Builds

- `node cli/bin/sdd.js decision check --path .docs/sdd` → «Decisiones válidas», exit 0.
- `node cli/bin/sdd.js decision index --path .docs/sdd --files skills/sdd-tdd/SKILL.md` → antes, la 0013 (`accepted`) y ninguna 0022; después, la 0022 (`accepted`) y ninguna 0013.
- Enlaces de la ADR, la constitution y `tech-stack.md`: todos resuelven. `tech-stack.md` traía roto desde antes de la rama `[task-ids](capabilities/task-ids.md)`; se corrige en el cierre a `feature-ids` (retro, §5).
- Palabras: constitution 2.232 (tope 2.236); `tech-stack.md` 22.088 (tope con margen 24.579).
- Revisión final: Spec opus+high, With fixes (3 Minor) · Código sonnet+high, With fixes (1 Important, 5 Minor) · Arquitectura no (lite, sin señales), sobre `6c6c40d2`
- Pasada de fix: juntada en el cierre, 5 hallazgos arreglados (redacción, sin test que los reproduzca; `decision check` verde, `cli:test` 2081/2081 con 12 saltados), 3 con ruling; 6 líneas de `.docs/`, revisado en el hilo, sin re-revisión
- Gate: no corre: la rama solo toca `.docs/` («Running a gate» de `sdd-verify`, punto 1). Además, `moon run cli:test` (el pre-commit y la pasada de fix) → cli:test: corrió 2081/2093 (12 saltados), sobre el commit de cierre

### 4.2 Smoke / tests

- Validación en campo: 2026-11-03 · `decision check` → «Decisiones válidas» · `decision index --files skills/sdd-tdd/SKILL.md` → la 0022 y no la 0013 · enlaces de la ADR, la constitution y `tech-stack.md` resueltos · revisión final Spec y Código sobre `6c6c40d2`, pasada de fix juntada en el cierre y revisada en el hilo, sin re-revisión

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La 0022 vale para `sdd decision check` | ejecución real | «Decisiones válidas» |
| La 0022 gobierna `skills/**` y la 0013 ya no | ejecución real | `decision index --files` da la 0022, no la 0013 |
| La constitution y `tech-stack.md` enlazan la 0022 | ejecución real | enlaces resueltos |

### 4.3 Residuales / deuda generada

- Ninguna.

## 5. Aprendizajes

- Ninguno que vaya a un documento vivo: la regla aprendida es la propia ADR 0022, y la forma de una sustitución parcial ya la fijan sus precedentes (0019 sobre 0011, 0015 sobre 0006). Que `decision index` no avise de una sustitución parcial lo recoge la spec de la 0304 (ruling de la revisión final) → ninguno: la ADR 0022 es el documento de esta regla

Retro: documento o skill desmentido → enlace `capabilities/task-ids.md` corregido a `capabilities/feature-ids.md` (`.docs/sdd/tech-stack.md`)

## 6. Adendas
