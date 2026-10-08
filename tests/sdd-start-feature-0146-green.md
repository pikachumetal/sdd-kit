# GREEN de la feature 0146 — spec y plan de propose

GREEN de las reglas que sobrevivieron al RED (`tests/sdd-start-feature-0146-red.md`), con el kit de la rama copiado al scratchpad (`skills`, `.claude-plugin`, `hooks`, `cli`) y superpowers 6.4.2. Misma batería y misma rúbrica que el RED. Salidas en `.docs/sdd/specs/20261008-193241-feature-0146-propose-spec-and-plan/green/`.

## Task 2 — La spec abre con 🦆 y ✋, y dice dónde se prueba (`s1`)

- **Ronda 0** (`green/out-s1-r0/`): S1 2/2, S3 2/2, **S2 1/2**. s1-2 escribió en ✋ «la respuesta lista los valores válidos» y dejó los literales «motivo requerido: …» y «motivo desconocido: aburrimiento. Opciones: …» solo en los THEN.
- **REFACTOR**: la ayuda del ✋ en `spec-template.md` pide el literal de cada texto, con un contraejemplo de otro dominio («importe no válido: usa dos decimales», no «avisa del formato»).
- **Ronda 1** (`green/out/s1-*`): **S1 2/2, S2 2/2, S3 2/2**. Las dos specs abren con 🦆 bajo el título, ✋ justo después de «Capacidades», y cada texto de los THEN (`motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, `sin canceladas`, `cancelada Norte lun (sala ocupada)`) está también en ✋; las dos llevan «Dónde se prueba» («por `run('canceladas', [])`, tras cancelar…, con el mismo patrón») y «Términos y ADR».

## Task 3 — Gate con opciones fijas y modelo del revisor de dominio (`g1`, `r1`)

- **g1** (Opus): **G1 2/2**. g1-1 busca la herramienta (`ToolSearch: select:AskUserQuestion`) y, al no encontrarla, presenta «1. **Apruebo (Recomendada).** … 2. **Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que bajes la sesión a gama media.** … 3. **Cambios.**». g1-2 no la busca: dice que «esta sesión no tiene la herramienta de preguntas con opciones» (no está en su lista) y presenta las mismas tres opciones literales. Se cuenta como intento: la regla no tiene otra salida en `claude -p`.
- **r1**: **R1 2/2**. r1-1: «1. **Dos revisores: dominio en Opus + técnica en Sonnet (Recomendada).** 2. Dos revisores, dominio en Sonnet…»; r1-2: «Recomiendo **un revisor con Opus**, porque la spec decide quién puede hacer qué».
