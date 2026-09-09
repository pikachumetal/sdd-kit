# Migraciones del kit — procedimiento

Un proyecto ya inicializado (`.docs/sdd/` existe) no se re-inicializa: se migra. Cada fichero `vX.Y.Z.md` de esta carpeta recoge los cambios estructurales que esa versión del kit pide al proyecto, como pasos-predicado que se pueden verificar.

1. **Desde dónde**: lee `.docs/sdd/sdd-kit.json`. Si no existe, el proyecto es anterior a v0.2.0: se aplican todas.
2. **Hasta dónde**: la mayor versión que tenga fichero en esta carpeta (el canal `npx skills add` no instala `plugin.json`; esta carpeta es la verdad). Orden: por nombre de fichero (válido mientras las versiones sean de un dígito por segmento; cuando exista `v0.10.0`, ordenar por SemVer).
3. **Cómo**: aplica cada fichero en orden, paso a paso. Cada paso empieza por un predicado: si no se cumple, se salta y se dice. Los pasos marcados **gate** se presentan al dev-lead antes de ejecutarse (un rename masivo, un borrado, un diff de `estimation-log.md`); si el dev-lead no está, se dejan como pendientes explícitos, nunca se hacen por su cuenta.
4. **Qué NO es migrar**: regenerar documentos de anclaje, volcar `funcional/`, trocear `funcional.md`, tocar specs o walkthroughs históricos, borrar scripts del proyecto que no sean del kit.
5. **Al terminar**: escribe `.docs/sdd/sdd-kit.json` con la versión aplicada, el canal (`plugin` si el kit llegó por `/plugin install`, `cli` si por `npx skills add`) y la fecha; ejecuta la sección «Verificación» de cada fichero aplicado; un commit por versión migrada (`chore(sdd): migrar al kit vX.Y.Z`).
