---
id: 20261007-135805-feature-0142-new-constitution
feature: 0142
proposal: 0131
title: Constitution nueva del kit para la 3.0.0, con ADR
mode: full
status: approved
created: 2026-10-07
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-07
---

# Spec — Constitution nueva del kit para la 3.0.0, con ADR

## Capacidades

- Ninguna, porque docs: la constitution, las ADR y `CLAUDE.md` son documentos del propio repo; ninguna skill cambia y ningún proyecto consumidor ve la diferencia.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (el formato de las ADR lo leerá el índice de la CLI de la 0143) · tamaño: ~400 líneas en ~16 ficheros
- Técnica: si el frontmatter de las ADR (status, date, rutas) basta para el índice que cruza `rutas` con los ficheros de un cambio (señal: contrato público)
- Mínimo razonable: ninguna — deja sin mirar que una regla vigente se pierda al compactar; lo cubren la tabla «regla → destino» del Approach y los tests de literales
```

1. **Numeración intacta, I a XI.** Las skills y nueve tests Pester citan «Art. IV», «Art. X»…; renumerar rompería las citas sin ganar nada.
2. **Forma de cada artículo**: la regla (frase o lista corta) y una línea `*Por qué*:` con una frase, más el enlace a su ADR si la hay. Art. VI y VII no tienen historia: sin ADR.
3. **Art. IV conserva su contenido normativo** y solo pierde la historia: las convenciones (naming, ids, merge, historia de commits, método de ejecución, política de modelos, nivel de verificación) las aplican las skills hoy, y cambiarlas es de la 0144 y la 0147. Se mantienen los literales que fijan los tests (`hereda el de la sesión`, `que elige para cada plan el handoff de `writing-plans` con `execution: auto` en `sdd-kit.json``, `va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto`, `La sesión que ejecuta en Native es el implementador`, `Bajar solo el effort de Opus no es gama media`, `el cierre de feature y el de patch`, `commit-milestones.md`, `sequence`, `tracker`) y en Art. X `una unidad` y `Minor` en la misma línea.
4. **Art. I nuevo, con transición**: batería completa en las skills de entrada, propose, verify y archive; humo (1-2 escenarios, n = 1) en todas; antes de cada release, las dos; A/B solo ante una duda concreta; cada fallo de campo pasa a escenario. Mientras no existan las skills de propose, verify y archive (0146-0149), la skill que las escribe nace con su batería, y una edición de una skill de la 2.3.x lleva el tramo de su batería si la tiene y, si no, humo. Se quedan, compactadas: test que falla antes de la guidance nueva, previsión de coste con techo que para, «una pieza entra, otra sale» con los topes de `WordBudget.Tests.ps1`, y renombrar o fusionar una skill es editarla.
5. **Salen de Art. I como reglas** el A/B obligatorio en todo recorte (pasa a puntual, decisión del lienzo) y los cuatro matices de campaña (fuente incidental, el recorte quita la guía y no la medición, el GREEN mide lo que el RED cumplía, la previsión lista cada paso que el agente ejecuta): bajan a `tech-stack.md` §Baterías como método, y su historia a la ADR de pruebas.
6. **Art. V** cambia «revisa la compatibilidad con la versión de superpowers» por «revisa las versiones nuevas de sus fuentes (`THIRD_PARTY_NOTICES.md`) y apunta en deuda lo que convenga traer»: superpowers es una fuente más mientras siga instalado. `sdd sources check` llega con la CLI (0143); el artículo no lo nombra.
7. **Art. IX** permite el fork de superpowers, OpenSpec, mattpocock/skills, Wondel, MADR y skill-creator con aviso en `THIRD_PARTY_NOTICES.md` (fuente, versión y licencia). Transición: hasta que la 0147 retire superpowers, el kit sigue invocando las skills suyas que aún no ha copiado. No afirmo la licencia de ninguna fuente en la constitution: la dice el aviso al copiarla.
8. **ADR**: carpeta `.docs/sdd/decisions/`, secuencia propia desde `0001` con slug en inglés (`0002-skill-testing-by-battery.md`), frontmatter `status` (`proposed | accepted | rejected | deprecated | superseded by NNNN`, los de MADR), `date` (la de la última decisión que la formó) y `rutas` (globs del repo), y secciones de MADR 4.0.0 mínima en castellano: «Contexto y problema», «Opciones consideradas», «Decisión», «Consecuencias» y «Confirmación». Inmutables: solo cambia `status` al sustituirlas.
9. **Diez ADR iniciales**, una por regla con historia: 0001 documentos acotados y ADR (Art. XI) · 0002 pruebas de skills por batería (Art. I) · 0003 la forma sigue al fallo (Art. II) · 0004 skills en inglés (Art. III) · 0005 convenciones de artefactos y ramas (Art. IV) · 0006 política de modelos y método de ejecución (Art. IV) · 0007 versionado y migraciones (Art. V) · 0008 fuente única de plantillas (Art. VIII) · 0009 fork en vez de vestir superpowers (Art. IX) · 0010 calidad del código ejecutable (Art. X).
10. **Sin plantilla de ADR en `sdd-templates`** en esta feature: añadirla edita una skill y pide su prueba (Art. I); la forma la fija la ADR 0001 y la plantilla llega con las plantillas de la 0144. Las diez ADR son del repo del kit, no de un proyecto.
11. **Sin test nuevo**: la comprobación mecánica de las ADR (nombre, frontmatter, secciones, que un `superseded by` apunta a una ADR que existe, enlaces de la constitution a `decisions/`) la hace la CLI de la 0143 al construir el índice, en Node con `node:test`; un test Pester hoy se tiraría en la feature siguiente. En la 0142 se verifica a mano en el smoke, una fila por ADR, y los nueve tests Pester que fijan literales de la constitution siguen corriendo hasta que la 0143 los porte.
12. **Topes de palabras**: `constitution.md` baja al medido redondeado a la centena superior. `architecture.md` (1.900 de 1.900) y `tech-stack.md` (18.668 de 18.700) no suben: la fila de `decisions/` y los cuatro matices de campaña entran condensando texto viejo del mismo documento (en `architecture.md`, el párrafo del estado del arte de superpowers 6.3.0, que el fork deja viejo).
13. **`CLAUDE.md` enlaza en vez de repetir**: salen las reglas críticas 1, 3, 4 y 7 (Art. I, III, V y VIII) y la frase de Art. VII de la regla 2; quedan las que solo son de la sesión (arranque con el script y skills del working tree, sin memoria automática, perfil delegate, prompts con rama). El índice añade `decisions/`.
14. **`THIRD_PARTY_NOTICES.md`** no cambia: hoy solo hay una pieza copiada (`sdd-grilling`) y ya tiene aviso; la versión de cada fuente la pide `sdd sources check` (0143).
15. **Repaso de coherencia**: corregí «tres matices» a «cuatro» en las decisiones 5 y 12 y en el Scope, para que cuadren con la tabla del Approach (la previsión que lista cada paso también baja a método).

### Decisiones tomadas con el dev-lead

- Sin test nuevo de las ADR: lo hace la CLI de la 0143 en `node:test` — «entiendo que ahora usaremos uno para node no?» (2026-10-07).
- Arranque en full con perfil delegate, parada en la aprobación de la spec — «Full + delegate (Recomendada)» (2026-10-07).
- Los cinco principios como preámbulo; un artículo = una regla con su porqué en una frase; la historia a ADR (MADR 4.0.0 mínima + status, date, Confirmation y rutas, en `.docs/sdd/decisions/`); Art. IX permite el fork; Art. I según la regla de pruebas de la propuesta; Art. XI con ADR para las decisiones y documentos de estado que se reescriben; `CLAUDE.md` enlaza la constitution — prompt de arranque de la 0142, decisiones del lienzo 0131 (2026-10-07).

## Intent

La constitution del kit mide 2.766 palabras y la mitad es historia (tasks, tickets, fechas, mediciones) que ninguna sesión necesita para cumplir la regla. `CLAUDE.md` repite cuatro de sus artículos. Art. IX obliga a vestir superpowers en vez de copiarlo, y Art. I exige una campaña RED/GREEN completa por edición. La 3.0.0 cambia las dos reglas y necesita un sitio para el porqué que no crezca con cada regla: las ADR.

## Scope

- Entra: `.docs/sdd/constitution.md` reescrita; `.docs/sdd/decisions/0001…0010`; tope de la constitution en `tests/WordBudget.Tests.ps1`; `CLAUDE.md`; `.docs/sdd/architecture.md` (árbol y fila de `decisions/` en la tabla de documentos); `.docs/sdd/tech-stack.md` §Baterías (los cuatro matices de campaña).
- No entra: un test de las ADR (lo hace la CLI de la 0143); la plantilla de constitution de los proyectos y la de ADR (0144); mover la constitution a `steering/` (0144); la CLI y `sdd sources check` (0143); quitar superpowers (0147); `mission.md`; ninguna skill.
- Retira: ~1.300 palabras de historia de la constitution (pasan a ADR, que solo lee quien toca sus `rutas`) y las cuatro reglas que `CLAUDE.md` duplicaba.

## Approach

Se escriben primero las diez ADR, con la historia que hoy está en la constitution; después la constitution, artículo a artículo, con la regla y su porqué; al final los documentos que la citan. Cada regla vigente acaba en uno de tres sitios:

| Regla vigente | Destino |
| --- | --- |
| Normativa de cada artículo | El artículo, compactado |
| Fechas, tasks, tickets y mediciones | La ADR del artículo, en «Contexto y problema» |
| A/B obligatorio en recortes | Retirada: A/B puntual (lienzo 0131); historia en ADR 0002 |
| Fuente incidental · recorte quita la guía · GREEN mide lo que el RED cumplía · previsión lista cada paso | `tech-stack.md` §Baterías como método; historia en ADR 0002 |
| Compatibilidad con superpowers en cada release | Art. V: vigilancia de fuentes |
| «Adoptar al máximo · aportar · extender ante hueco» (Art. IX) | Sustituida por el fork; historia en ADR 0009 |
| Reglas 1, 3, 4 y 7 de `CLAUDE.md` | El enlace a la constitution |

Se comprueba con la suite Pester completa (`WordBudget.Tests.ps1` y los nueve tests que fijan literales de la constitution, sin tocar sus aserciones) y con un smoke a mano de las diez ADR y de los once artículos.

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-07 | aprobada: «Apruebo» |
