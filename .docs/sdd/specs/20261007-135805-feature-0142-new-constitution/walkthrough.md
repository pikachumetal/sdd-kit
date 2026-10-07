---
id: 20261007-135805-feature-0142-new-constitution
feature: 0142
title: Walkthrough — Constitution nueva del kit para la 3.0.0, con ADR
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-07
---

# Walkthrough — Constitution nueva del kit para la 3.0.0, con ADR

## 1. Cambios realizados

- **ADR** (`d55fa871`): diez ADR en `.docs/sdd/decisions/` (0001 documentos acotados y ADR · 0002 pruebas por batería · 0003 la forma sigue al fallo · 0004 skills en inglés · 0005 convenciones de artefactos y ramas · 0006 política de modelos y método · 0007 versionado y migraciones · 0008 fuente única de plantillas · 0009 fork en vez de vestir superpowers · 0010 calidad del código ejecutable), con la historia que salió de la constitution.
- **Constitution** (`b632fe97`): preámbulo de cinco principios y once artículos, cada uno con su regla y una línea `*Por qué*:` que enlaza su ADR; de 2.766 a 2.109 palabras, tope a 2.200. Art. I pasa a batería en entrada, propose, verify y archive y humo en todas, con transición; Art. V vigila las fuentes de `THIRD_PARTY_NOTICES.md`; Art. IX permite el fork; Art. XI añade las ADR. Los matices de campaña bajan a `tech-stack.md` §Baterías (la previsión que lista cada paso se queda en Art. I, porque la comprueba la lente técnica de la review de spec), y §A/B pasa a puntual.
- **`CLAUDE.md` y `architecture.md`** (`1e25cfb1`): `CLAUDE.md` enlaza la constitution y deja solo las reglas de la sesión (cuatro, renumeradas), con `decisions/` en el índice; `architecture.md` registra `decisions/` en el árbol y en la tabla de documentos y retira el párrafo del estado del arte de superpowers 6.3.0; `ControlProfiles.Tests.ps1` busca la regla de delegate por su texto.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2–3h
- Esfuerzo real: 0,8h — reloj del hilo por las marcas de los commits y de la carpeta de la spec: ~0,4h de contexto, spec y plan (15:45–16:18) y ~0,4h de implementación, revisión final y pasada de fix (16:18–16:40)
- Desviación: −1,7h (−68 % sobre el mínimo del rango)
- Causa de la desviación: la estimación contó diez ADR como redacción secuencial en horas; salieron de la historia que ya estaba en la constitution, sin campaña de sujetos, y la revisión final corrió en paralelo a los borradores del cierre (el mismo sesgo del segundo aviso de `estimation.md`).
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 15.242.989 — claude-opus-5-5 15.242.989
- Tokens de subagentes: 5.271.684 en 1 despacho — Revisión final feature 0142 claude-opus-5-5 5.271.684 / 6 min
- Coste de la sesión: 9,39 $ (hilo 6,86 $ + subagentes 2,53 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La ADR 0001 se corrigió en la Task 2: decía que la constitution bajaba a menos de la mitad, y mide ~2.100 palabras (el Art. IV, una cuarta parte, conserva su normativa).

### Decisiones tomadas sin el dev-lead

- Sin TDD por task — la spec aprobada (decisión 11) no crea tests; cada task verificó con su comando de forma y la suite Pester existente — coste si está mal: formato de ADR sin red automática hasta la 0143.
- La ADR 0001 decía «menos de la mitad»; corregida a ~2.000 palabras y «una cuarta parte» dentro de la rama — coste si está mal: ninguno, la ADR aún no se había integrado.
- Se retira de Art. V «los usuarios actualizan con `/plugin marketplace update`» — es instrucción de uso y ya está en `.docs/workflow/usage-guide.md` — coste si está mal: una línea.
- Se añade a Art. V que una versión nueva de una fuente que cambia una skill que el kit aún invoca se vuelve a probar antes de cerrar, para no perder la regla vieja de re-testar el mapeo con superpowers — coste si está mal: una frase.
- `tech-stack.md` citaba «regla 2 del `CLAUDE.md`»; pasa a citarla por su nombre porque las reglas se renumeran — coste si está mal: una cita.
- La intro de la tabla de `architecture.md` y el árbol nombran tres tipos (estado, evento, ADR) y «reglas de la sesión» — coste si está mal: dos frases.
- Revisión final: cinco Minor recalificados a Important por efecto (datos y fechas de ADR que dejan de poder editarse, superpowers fuera de la revisión de fuentes de Art. V, tres descripciones que contradecían el Art. I nuevo, niveles de encabezado de las ADR que leerá la CLI) y arreglados en la pasada de fix — coste si está mal: ~15 líneas de texto.
- Revisión final, Minor 7: Art. XI sigue mandando la historia de cada regla a una ADR, sin el filtro de la propuesta («difícil de deshacer, sorprende, alternativa real»), porque es la frase literal del dev-lead para esta feature; el filtro es para las ADR que ofrezcan los cierres (0149) — coste si está mal: ADR de más hasta la 0149.
- Constitution: el tope pasa a 2.200 (mide 2.109 tras devolver cláusulas de Art. I y XI que la revisión encontró perdidas) — coste si está mal: 100 palabras de margen.

**Deferred minors**

- Art. V ya no describe la forma de una migración con pasos; la cubre `skills/sdd-init-brownfield/references/migrations/README.md`.

## 4. Verificación

### 4.1 Builds

- Sin build: cambio de documentación.
- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -ExcludeTagFilter Slow -CI -Output Minimal"` → 960 pasan, 0 fallan, 10 omitidos · 28 s

### 4.2 Smoke / tests

- Validación en campo: 2026-10-07 · suite 960/960 · smoke 6/6 criterios del Approach (4 con ejecución real, 2 con suite) · revisión final opus effort high sobre 1e25cfb1, con arreglos, y pasada de fix da9a7ce6

| Criterio | Evidencia | Resultado |
| --- | --- | --- |
| Diez ADR con nombre `NNNN-<slug>.md`, frontmatter `status`/`date`/`rutas` y las cinco secciones en orden | ejecución real (`grep` de forma sobre `decisions/*.md`) | 10/10 |
| La constitution trae cinco principios, once artículos y once líneas `*Por qué*:`, y sus enlaces a `decisions/` resuelven | ejecución real (`grep` + `test -f`, también los de `tech-stack.md`) | ok |
| Los nueve tests que fijan literales de la constitution pasan sin tocar sus aserciones | suite | ok |
| Topes: constitution ≤ 2.200 (mide 2.109), `architecture.md` ≤ 1.900 (1.896), `tech-stack.md` ≤ 18.700 (18.691) | suite (`WordBudget.Tests.ps1`) | ok |
| `CLAUDE.md` no repite reglas de la constitution | ejecución real (`grep` de las reglas viejas: sin coincidencias) | ok |
| Cada regla vieja acaba en la constitution, en `tech-stack.md` o retirada en el Approach | ejecución real (comparación frase a frase en la Task 2 y revisión final contra `28f27420`) | 4 cláusulas perdidas encontradas por la revisión y devueltas en la pasada de fix |

### 4.3 Residuales / deuda generada

- Ninguna fila nueva: la comprobación automática de la forma de las ADR llega con la CLI de la 0143 (decisión 11 de la spec).

## 5. Aprendizajes

- Nueve tests Pester fijan frases literales de la constitution: compactarla obliga a conservar esas frases, y la constitution «corta» queda en ~2.000 palabras porque el Art. IV sigue siendo normativo. Al portar la suite a Node (0143), conviene decidir si esos tests siguen fijando prosa o pasan a comprobar la forma → ya es requisito de la 0143 («tests deterministas skill ↔ CLI» en la propuesta 0131); sin fila nueva.
- La comparación frase a frase de la constitution vieja dejó pasar cláusulas que van tras un punto y coma o al final de un párrafo; la encontró la revisión final → al reescribir un documento normativo, comparar por cláusula; para la 0152 (coherencia de todos los documentos), ya en su alcance.

## 6. Adendas

- (ninguna)
