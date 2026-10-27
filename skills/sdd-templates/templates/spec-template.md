---
id: <yyyyMMdd-HHmmss>-feature-<id>-<slug>
feature: <id>         # id del gestor de tickets (0000 si no hay) · id de la secuencia del proyecto (ids.mode en sdd-kit.json)
parent: <id>          # solo si esta feature nace de partir otra; la relación no va en el id (nunca sufijos 0006a)
proposal: <id>        # solo si esta feature sale del reparto de una propuesta (specs/<ts>-proposal-<id>-<slug>/)
title: <título corto descriptivo>
mode: full            # full | lite — lo lee sdd-archive; sin campo = full
profile: <pair|delegate|unattended>   # opcional; omitido = hereda de la release o del proyecto
status: draft
created: <YYYY-MM-DD>
author: <autor>
approvers:
  - name: TBD
    approved_at: null
---

# Spec — <título>

🦆 <qué cambia para quien usa el producto, con un ejemplo con datos, y después cómo>

> El párrafo 🦆 lo escribe `sdd-rubber-duck` en modo corto al presentar la spec: cinco frases como mucho, sin rutas ni jerga.

> **Estado**: draft / in-review / approved / implementing / done / superseded / cancelled.
> **Siguiente paso**: modo full → `plan.md`, siguiendo `plan-writing.md` de `sdd-propose`; modo lite → implementación directa.
> **Modo lite** = rellenar el bloque «Estimación y esfuerzo» de esta misma plantilla; no existe ni se crea un `spec-lite-template.md` (Art. VIII).
> **Regla de contenido**: si la implementación puede cambiar sin cambiar el comportamiento observable, no va en la spec — va en `plan.md` (datos, UX, riesgos, rollout, restricciones).
> **Regla de reparto**: el comportamiento observable (tiempos, límites, cuotas, avisos, respuestas, estados) vive solo en `capabilities/`. `tech-stack.md`, `architecture.md` y `environments.md` dicen dónde está la pieza técnica y enlazan la capacidad; no copian el valor.
> Borra los bloques de ayuda (`>`) al redactar.

## Capacidades

> Se escribe con la salida de `sdd capability index`, que ejecuta el paso 1 de `sdd-start-feature`, con el nombre exacto que da el índice. Una línea por capacidad; cada una tiene su subsección `### Capacidad:` en el delta, y ninguna subsección del delta falta aquí. Una capacidad nueva va en «Nuevas» y también en «Decisiones que he tomado yo». Si el cambio no toca comportamiento observable, deja solo «Ninguna, porque <refactor | herramientas | docs>» y no escribas delta. Lo comprueba `sdd capability check` al cerrar.

- Nuevas: `<nombre>` — <qué cubre>
- Modificadas: `<nombre>` — <qué requisito cambia>

## ✋ Decisiones que he tomado yo — valida estas

> Una línea por decisión tomada sin el usuario: es lo único que el dev-lead necesita leer para aprobar. **Exhaustiva**: cada valor de la spec sale de la entrevista, del roadmap o de ti, y los tuyos están todos aquí —un texto de respuesta o de aviso, un tope, un orden, un nombre de comando que nadie dijo—, aunque también aparezcan en un THEN. Un texto va con su literal: «importe no válido: usa dos decimales», no «avisa del formato». Si esta spec crea una capacidad nueva en `capabilities/`, se declara aquí. El **bloque que abre** este apartado es la propuesta de review: nivel, señales contadas, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir (modo full; forma exacta en `sdd-start-feature/references/review-spec.md`). Si hubo review, cierra el bloque con `### Hallazgos de la review` (aceptado → cambio, rechazado → motivo).

1. <decisión> — <por qué>
- Política de modelos (solo en `delegate`): <revisores de la spec con modelo, o ninguno> · <ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan> · <otros despachos en paralelo: sujetos, por tandas> · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

> Solo si alguna decisión no la tomaste tú sola: una aprobación delegada, un cambio de perfil, una respuesta que resolvió una ambigüedad. Una línea por decisión, con la frase literal del dev-lead.

- <decisión> — «<frase literal>»

## Intent

> 3-5 líneas: qué pasa hoy, por qué importa, qué se quiere que sea distinto y qué es el éxito, medible donde se pueda (lo que la haría fracasar aunque funcione técnicamente). Si nadie lo dijo, tu suposición va a ✋.

<texto>

## Scope

> Entra / No entra — listas cortas, no prosa.

- Entra: <…>
- No entra: <…>

## Lo que se retira o cambia de forma

> Obligatoria: no se borra con los bloques de ayuda. Lo rellena el repaso de coherencia de `sdd-propose`. Una fila por cosa que la spec retira o cuya forma o sitio cambia —un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija—, con cada sitio de `capabilities/` y `skills/` (y de los documentos) que la nombra, y su destino: el delta (`MODIFIED` o `REMOVED`), el Scope o una decisión con su motivo. P. ej. «etiqueta `- Real:` → `- Esfuerzo real:` · `patch-template.md` y dos requisitos de `estimation` · delta, `MODIFIED`».

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| <qué se retira o cambia de forma> | <fichero:línea, por sitio> | <delta · Scope · decisión N, con su motivo> |

- Filas que implementa: <id de cada fila que la spec salda o implementa> → <ficheros que la nombran («la define la 0009» en `docs/config.md`) y su destino> | nada: comprobado con `<búsqueda>`

## Approach

> Qué enfoque se toma, no cómo se implementa — el cómo es contenido de `plan.md`.

<texto>

## Dónde se prueba

> Una línea por comportamiento: dónde se prueba y como qué prueba existente, en la costura existente más alta, y cuantas menos costuras mejor. Cambiarla durante la implementación es un desvío.

- <comportamiento>: <superficie y patrón> — p. ej. «cancelar reserva: por el endpoint, como los tests de reservas actuales; la pantalla, con una captura»

## Términos y ADR

> Términos que la entrevista resolvió (el canónico y el que se evita) y ADR candidatas: solo una decisión difícil de deshacer, que sorprendería sin contexto y con una alternativa real. Las escribe el cierre.

- Términos resueltos: <término — definición> | ninguno
- ADR candidatas: <decisión — alternativa descartada> | ninguna

## Delta de comportamiento

> Una subsección por capacidad tocada. El título de cada requisito es la clave de fusión de `sdd-archive`: estable, no cambia salvo que la spec lo renombre explícitamente. Una capacidad es un sustantivo del dominio, nunca un ticket. Su slug es un nombre de fichero: va en inglés kebab-case aunque el contenido vaya en castellano (`invoicing`, no `facturacion`), y lo aprueba el dev-lead.
>
> Un escenario de una regla de negocio lleva datos concretos de entrada y de salida, no una frase abstracta: «GIVEN bolsa FR, IT, PT · WHEN oferta en DE · THEN no cubre», no «una oferta fuera de la bolsa no cubre». La regla mal entendida se ve en la spec, no al validar.

### Capacidad: `<nombre>`

**ADDED — <título estable>**
- GIVEN <precondición>
- WHEN <acción>
- THEN <resultado observable>
- AND <opcional>
- Se valida en: <omite la línea si se ve desde la rama · `worktree con la base al día` · `validación post-merge con fecha`> *(solo si el THEN depende de la rama de integración, del historial de git, del remoto o de un entorno que la rama no reproduce: desde la rama de la feature no se puede observar, y el dev-lead no puede validarlo ahí)*

**MODIFIED — <título estable>** (antes: "<la cláusula que cambia>" — opcional)

> Copia el bloque entero del requisito vigente con los cambios: al fusionar lo sustituye, y `sdd capability merge` rechaza perder una línea del vivo que no esté aquí. Una línea que quitas va como `- REMOVED <línea>` (`- REMOVED AND el aviso sale por correo`). El título es la clave de fusión: un renombrado es `REMOVED` del título viejo + `ADDED` del nuevo.

- GIVEN <contexto>
- WHEN <acción>
- THEN <resultado actualizado>

**REMOVED — <título estable>**
- motivo: <por qué deja de aplicar>

**Reglas de la capacidad** *(solo si este delta introduce datos, nombres, topes, avisos o una condición de conflicto nuevos; solo las entradas que cambian, cada una con su valor completo —el vigente más el cambio—: al fusionar sustituye entera a la vigente, y lo que no esté en la entrada desaparece (con **Avisos**: A y B vigentes y una feature que añade C, se escribe A, B y C, no «además de los vigentes, C»); el nombre es la clave de fusión; el valor sale de las «Reglas de producto» de la constitution o de la capacidad, no se inventa)*
- **Dónde viven los datos** / **Idioma de los nombres** / **Límites** / **Avisos** / **Regla ante conflicto**: <valor | no aplica>

### Estimación y esfuerzo *(solo modo lite — OBLIGATORIO si existe `.docs/sdd/estimation.md`)*

> En modo full este bloque vive en `plan.md`. En lite no hay plan, así que vive aquí: sin él, el `estimation-log` pierde justo las tareas pequeñas, que son las que mejor lo calibran.

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Esfuerzo spec: <Xh>
- Estimación de implementación: <Yh>
- Base de la estimación: <complejidad, incertidumbres, referencia del estimation-log>
- Confianza: alta / media / baja

## Topes de palabras *(solo si el proyecto pone topes a lo que la spec edita: un test limita en palabras un fichero que edita, como `tests/WordBudget.Tests.ps1`)*

> Si se cumple, es obligatoria y no se borra con los bloques de ayuda: una fila por fichero con tope que la spec edita, también si la edición lo acorta; un margen dicho en una decisión o en «Dónde se prueba» no es la tabla. Si ningún test limita lo que edita, borra la sección. Mide cada uno antes de presentarla, con el conteo del test que lo fija. El tope propuesto es lo medido más lo previsto más un 2 % (mínimo 20 palabras) para la pasada de fix de la revisión final, y lo aprueba el dev-lead en el gate. El de una skill que funde otras parte de la suma medida de las fuentes, menos lo común, más ese margen. Lo que se recorte para caber es una edición de skill: si quita una instrucción, lleva su RED.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| <skill o documento> | <palabras / tope> | <tope − medido> | <medido + previsto + 2 % · sin cambio> |

## Enmiendas

> Un cambio a la spec aprobada durante la ejecución: un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba». Se corrige en su sitio del cuerpo (acción update) y aquí queda su línea, con la task que lo implementa. Una entrada por cambio, más reciente arriba.

- <fecha> — <qué cambia> — <por qué> — aprobada: «<frase>» | sin aprobar (unattended, o aplica literal una decisión tomada con el dev-lead)

## Aprobaciones

> Fila normal: aprobación de la spec o del plan, con el nombre de quien aprueba (`git config user.name`). Con una opción de la pregunta del gate, Estado `aprobada (opción «<etiqueta sin el sufijo «(Recomendada)»>»)`; si el usuario escribe su respuesta, `aprobada: «<su frase literal>»`. Fila de cambio de perfil a media feature: Estado `perfil → <perfil>: «<frase literal>»`, con la fecha en que el dev-lead lo dijo.

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
