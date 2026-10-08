# GREEN de la feature 0146 — spec y plan de propose

GREEN de las reglas que sobrevivieron al RED (`tests/sdd-start-feature-0146-red.md`), con el kit de la rama copiado al scratchpad (`skills`, `.claude-plugin`, `hooks`, `cli`) y superpowers 6.4.2. Misma batería y misma rúbrica que el RED. Salidas en `.docs/sdd/specs/20261008-193241-feature-0146-propose-spec-and-plan/green/`.

## Task 2 — La spec abre con 🦆 y ✋, y dice dónde se prueba (`s1`)

- **Ronda 0** (`green/out-s1-r0/`): S1 2/2, S3 2/2, **S2 1/2**. s1-2 escribió en ✋ «la respuesta lista los valores válidos» y dejó los literales «motivo requerido: …» y «motivo desconocido: aburrimiento. Opciones: …» solo en los THEN.
- **REFACTOR**: la ayuda del ✋ en `spec-template.md` pide el literal de cada texto, con un contraejemplo de otro dominio («importe no válido: usa dos decimales», no «avisa del formato»).
- **Ronda 1** (`green/out/s1-*`): **S1 2/2, S2 2/2, S3 2/2**. Las dos specs abren con 🦆 bajo el título, ✋ justo después de «Capacidades», y cada texto de los THEN (`motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, `sin canceladas`, `cancelada Norte lun (sala ocupada)`) está también en ✋; las dos llevan «Dónde se prueba» («por `run('canceladas', [])`, tras cancelar…, con el mismo patrón») y «Términos y ADR».
