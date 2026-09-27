# RED — `sdd-init-greenfield` sobre un proyecto instanciado desde el template (feature 0089)

Baseline con el kit de `develop` tras la 0091 (`d4d7586`), `sdd-init-greenfield` sin cambios. Medido **antes de escribir la spec**: la spec lleva solo lo que falla.

## Método

- **Molde**: `templates/angular-dotnet/` de `sdd-project-template`, rama `develop` (`6b3a937`), sin la carpeta de la skill `init-template`. Trae `tech-stack.md`, `architecture.md` y `environments.md` completos, `<!-- sdd-template: pending -->` en `mission.md` (5 secciones), `roadmap.md` (3) y `constitution.md` (2), y `sdd-kit.json` con `"version": "1.1.0"` sin más claves. Git con `main` y `develop`, en `develop`.
- **Petición**: «Acabo de crear este proyecto desde nuestro template. Inicializa la documentación SDD con sdd-init-greenfield. Mis respuestas a la entrevista están en brief.md: tómalas como mías.» [`brief.md`](../.docs/sdd/specs/20260927-165923-feature-0089-greenfield-init-template/red/brief.md) responde las preguntas de producto, changelog, gestor, claves del kit y proyecto de referencia; **no** dice qué queda fuera de alcance ni fija términos del dominio.
- **Respuesta fija** a cada turno, sin simulador: «Si me preguntas algo que no está en brief.md: no sé. Si me presentas un documento: ok, aprobado. Sigue.» Hasta 14 turnos.
- Sujetos Sonnet (`claude -p`, kit en copia limpia con `--plugin-dir`, plugin instalado deshabilitado). Lanzador y salidas en [`red/`](../.docs/sdd/specs/20260927-165923-feature-0089-greenfield-init-template/red/).
- **Dos tandas**. En la primera (`*-intento1`) el commit del molde falló por rutas largas (`core.longpaths`) y los dos sujetos pararon al pedir permiso para `.claude/settings.json`; lo que escribieron antes de parar vale como medición. La segunda corrige el molde; `.claude/` sigue bloqueado en headless aunque se permita `Edit(.claude/**)`.

## Resultados por frente

| Frente | t1-a-intento1 | t1-b-intento1 | t1-a | t1-b | Veredicto |
| --- | --- | --- | --- | --- | --- |
| No pregunta stack, ramas ni worktrees | ✅ | ✅ | ✅ | ✅ | pasa |
| `tech-stack.md`, `architecture.md` y `environments.md` sin cambios | ✅ | ✅ | ✅ | ✅ | pasa |
| `sdd-kit.json` conserva `"version": "1.1.0"` y gana `ids` y las claves | — | ✅ | — | ✅ | pasa (2/2 de los que llegaron) |
| No inventa fuera de alcance ni términos del dominio | ❌ los dos | ❌ los dos | ❌ los dos | ❌ glosario | **falla** (4/4 inventan algo) |
| Forma de los documentos marcados | tablas del template | tablas del template | **reestructura** a la plantilla del kit | tablas del template | **incoherente** |
| Aprueba documento a documento | ✅ solo mission | ❌ los cuatro juntos | ❌ escribe tres sin presentar | ❌ escribe todo sin presentar | no atribuible (ver caveats) |

Literales:

- t1-a-intento1, mission §4: «Pagos o facturación por sala. Recursos distintos de salas (proyectores, plazas de parking...). Integración con calendarios externos (Outlook, Google Calendar).»
- t1-b-intento1: «**4. Fuera de alcance** (propuesto, dime si falta o sobra algo) Facturación o coste de salas; integración con calendarios externos…»
- t1-a, mission «Qué es y qué no es»: «**No es** _(asunción a confirmar)_: no gestiona otros recursos de oficina (proyectores, plazas de parking, catering); una sola oficina, sin multi-sede en esta versión.»
- t1-b: deja «Fuera de alcance» con el marcador («brief no lo respondió»), pero inventa el glosario: «**Sala**: recurso reservable de la oficina, dado de alta por un administrador de oficina.»
- Forma: t1-b conserva `| Id | Task | Estado |` y los Patches como `| Id | Descripción | Estado |`; t1-a reescribe mission y roadmap con las secciones de `mission-template.md` y `roadmap-template.md` (`| Fecha | Id | Descripción |`).

## Lectura

- **Causa del fallo de invención**: la lista del paso 1 no tiene ninguna pregunta que vaya a «Qué es y qué no es» ni a «Dominio» de `mission-template.md`, ni a «Fuera de alcance» y «Glosario» del template; `init-template` sí las pregunta (sus 4 y 5). Entra en la spec: dos filas nuevas.
- **Causa de la forma incoherente**: el template no calca `sdd-templates` (mission numerada, tablas de roadmap propias, reglas de producto en tabla), y el sujeto elige entre respetar el documento o la plantilla. Se arregla en el template (Art. VIII), no con guía en el kit.
- **Pasa sin guía**: lo del modo sobre template que ya midió la 0012 (no pregunta lo técnico, no toca los técnicos) y la versión de `sdd-kit.json`. No se escribe guía.

## Caveats

- **Respuestas de golpe**: la petición daba todas las respuestas y «tómalas como mías», que empuja a escribir sin presentar. El RED de la 0012, con las respuestas turno a turno, pasó el gate por documento 2/2. No se atribuye a la skill.
- **`.claude/settings.json`** no se pudo medir en headless.
- Coste: 5,22 $ (1,32 + 1,78 en la primera tanda; 0,91 + 1,21 en la segunda).
