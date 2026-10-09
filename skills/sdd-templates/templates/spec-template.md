---
id: <yyyyMMdd-HHmmss>-feature-<id>-<slug>
feature: <id>         # id del gestor de tickets (0000 si no hay) · id de la secuencia del proyecto (ids.mode en sdd-kit.json)
parent: <id>          # solo si esta feature nace de partir otra; la relación no va en el id (nunca sufijos 0006a)
proposal: <id>        # solo si esta feature sale del reparto de una propuesta (specs/<ts>-proposal-<id>-<slug>/)
title: <título corto descriptivo>
mode: full            # full | lite — lo lee sdd-end-feature; sin campo = full
profile: <pair|delegate|unattended>   # opcional; omitido = hereda de la release o del proyecto
status: draft
created: <YYYY-MM-DD>
author: <autor>
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — <título>

🦆 <qué cambia para quien usa el producto, con un ejemplo con datos, y después cómo>

> El párrafo 🦆 lo escribe `sdd-rubber-duck` en modo corto al presentar la spec: cinco frases como mucho, sin rutas ni jerga.

> **Estado**: draft / in-review / approved / implementing / done / superseded / cancelled.
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`; modo lite → implementación directa.
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

### Decisiones tomadas con el dev-lead

> Solo si alguna decisión no la tomaste tú sola: una aprobación delegada, un cambio de perfil, una respuesta que resolvió una ambigüedad. Una línea por decisión, con la frase literal del dev-lead.

- <decisión> — «<frase literal>»

## Intent

> 3-5 líneas: qué pasa hoy, por qué importa, qué se quiere que sea distinto.

<texto>

## Scope

> Entra / No entra — listas cortas, no prosa.

- Entra: <…>
- No entra: <…>

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

> Una subsección por capacidad tocada. El título de cada requisito es la clave de fusión de `sdd-end-feature`: estable, no cambia salvo que la spec lo renombre explícitamente. Una capacidad es un sustantivo del dominio, nunca un ticket. Su slug es un nombre de fichero: va en inglés kebab-case aunque el contenido vaya en castellano (`invoicing`, no `facturacion`), y lo aprueba el dev-lead.
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

> Copia el bloque entero del requisito vigente con los cambios: al fusionar sustituye al anterior, y lo que no esté aquí desaparece.

- GIVEN <contexto>
- WHEN <acción>
- THEN <resultado actualizado>

**REMOVED — <título estable>**
- motivo: <por qué deja de aplicar>

**Reglas de la capacidad** *(solo si este delta introduce datos, nombres, topes, avisos o una condición de conflicto nuevos; solo las entradas que cambian, cada una con su valor completo —el vigente más el cambio—: al fusionar sustituye entera a la vigente, y lo que no esté aquí desaparece (con **Avisos**: A y B vigentes y una feature que añade C, se escribe A, B y C, no «además de los vigentes, C»); el nombre es la clave de fusión; el valor sale de las «Reglas de producto» de la constitution o de la capacidad, no se inventa)*
- **Dónde viven los datos** / **Idioma de los nombres** / **Límites** / **Avisos** / **Regla ante conflicto**: <valor | no aplica>

### Estimación y esfuerzo *(solo modo lite — OBLIGATORIO si existe `.docs/sdd/estimation.md`)*

> En modo full este bloque vive en `plan.md`. En lite no hay plan, así que vive aquí: sin él, el `estimation-log` pierde justo las tareas pequeñas, que son las que mejor lo calibran.

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Esfuerzo spec: <Xh>
- Estimación de implementación: <Yh>
- Base de la estimación: <complejidad, incertidumbres, referencia del estimation-log>
- Confianza: alta / media / baja

## Enmiendas

> Un cambio a la spec aprobada durante la ejecución: un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba». Se corrige en su sitio del cuerpo (acción update) y aquí queda su línea, con la task que lo implementa. Una entrada por cambio, más reciente arriba.

- <fecha> — <qué cambia> — <por qué> — aprobada: «<frase>» | sin aprobar (unattended)

## Aprobaciones

> Fila normal: aprobación de la spec o del plan. Fila de cambio de perfil a media feature: Estado `perfil → <perfil>: «<frase literal>»`, con la fecha en que el dev-lead lo dijo.

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
