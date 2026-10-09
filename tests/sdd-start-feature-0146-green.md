# GREEN de la feature 0146 — spec y plan de propose

GREEN de las reglas que sobrevivieron al RED (`tests/sdd-start-feature-0146-red.md`), con el kit de la rama copiado al scratchpad (`skills`, `.claude-plugin`, `hooks`, `cli`) y superpowers 6.4.2. Misma batería y misma rúbrica que el RED. Salidas en `.docs/sdd/specs/20261008-193241-feature-0146-propose-spec-and-plan/green/`.

## Task 2 — La spec abre con 🦆 y ✋, y dice dónde se prueba (`s1`)

- **Ronda 0** (`green/out-s1-r0/`): S1 2/2, S3 2/2, **S2 1/2**. s1-2 escribió en ✋ «la respuesta lista los valores válidos» y dejó los literales «motivo requerido: …» y «motivo desconocido: aburrimiento. Opciones: …» solo en los THEN.
- **REFACTOR**: la ayuda del ✋ en `spec-template.md` pide el literal de cada texto, con un contraejemplo de otro dominio («importe no válido: usa dos decimales», no «avisa del formato»).
- **Ronda 1** (`green/out/s1-*`): **S1 2/2, S2 2/2, S3 2/2**. Las dos specs abren con 🦆 bajo el título, ✋ justo después de «Capacidades», y cada texto de los THEN (`motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, `sin canceladas`, `cancelada Norte lun (sala ocupada)`) está también en ✋; las dos llevan «Dónde se prueba» («por `run('canceladas', [])`, tras cancelar…, con el mismo patrón») y «Términos y ADR».

## Task 3 — Gate con opciones fijas y modelo del revisor de dominio (`g1`, `r1`)

- **g1** (Opus): **G1 2/2**. g1-1 busca la herramienta (`ToolSearch: select:AskUserQuestion`) y, al no encontrarla, presenta «1. **Apruebo (Recomendada).** … 2. **Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que bajes la sesión a gama media.** … 3. **Cambios.**». g1-2 no la busca: dice que «esta sesión no tiene la herramienta de preguntas con opciones» (no está en su lista) y presenta las mismas tres opciones literales. Se cuenta como intento: la regla no tiene otra salida en `claude -p`.
- **r1**: **R1 2/2**. r1-1: «1. **Dos revisores: dominio en Opus + técnica en Sonnet (Recomendada).** 2. Dos revisores, dominio en Sonnet…»; r1-2: «Recomiendo **un revisor con Opus**, porque la spec decide quién puede hacer qué».

## Task 4 — El plan declara `Tras` (`p1`)

- **Ronda 0** (`green/out-p1-r0/`): `Tras` 2/2, pero **P1 0/2** en «en orden, sin paralelo»: la frase iba en un bloque de ayuda (`>`) que la plantilla manda borrar al redactar.
- **REFACTOR**: la frase pasa a una línea de contenido bajo «## 2. Tasks».
- **Ronda 1** (`green/out/p1-*`): p1-2, «Las tasks se ejecutan en orden, sin paralelo.» y `**Tras**: —` / `**Tras**: Task 1`. p1-1 hace un plan de una sola task con `**Tras**: —` y sin la frase: con una task no hay nada que ejecutar en paralelo, y se cuenta como no aplicable. **P1: `Tras` 2/2; «sin paralelo» 1/1 aplicable.** P2 sigue 2/2 como control (`node --test test/cancel.test.js` en cada task).

## Task 5 — Acción update (`u1`)

- **Ronda 0** (`green/out-u1-r0/`): **U1 0/2, U2 0/2**. Ninguno abrió `control-profiles.md`: el paso 6 solo decía «acción update de la fila "Desvío"». u1-2 volvió a reabrir la Task 1 para meter `--por` en el commit de la Task 2.
- **REFACTOR**: la regla sube al paso 6 en una frase (parar con 🦆 y ✋, corrección en su sitio sin commitear, línea en «Enmiendas», sin reabrir tareas cerradas), compensada quitando del mismo párrafo la lista de los cuatro frenos, que sigue en `control-profiles.md` y en los red flags.
- **Ronda 1** (`green/out/u1-*`): **U1 2/2**. u1-1: «**🦆 En llano:** …» y «**✋ Esto cambia la spec aprobada:** …», con la corrección ya escrita; u1-2: «🦆 **En llano:** …», «✋ **Decisiones que he tomado yo — valídalas**» y «he dejado la opción 1 en `spec.md` sin commitear». **U2 2/2 con la regla afinada**: los dos eligen quitar «quién canceló», que solo recorta la Task 2 en curso; no tocan la Task 1, commitean la enmienda aparte y dejan la nota en la Task 2. Con la regla original (task nueva siempre) habría sido 0/2: el dev-lead aprobó afinarla el 2026-10-09 (enmienda de la spec), porque una Task 3 para quitar un dato no evitaba nada.
