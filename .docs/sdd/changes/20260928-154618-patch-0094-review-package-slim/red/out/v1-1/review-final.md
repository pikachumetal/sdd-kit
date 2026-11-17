# Review final — feature/0000 (retirar el gate visual)

Rama revisada: `feature/0000` (`ca64823`) frente a `develop`.
Requisitos: `.docs/sdd/specs/20260928-100000-feature-0000-retire-legacy/spec.md`.

## Strengths

- `.docs/sdd/roadmap.md` actualiza correctamente la fila «Gate visual» a «Gate visual (retirado)», reflejando el estado real tras el cambio.
- La feature se abrió con `spec.md` y `plan.md` en un commit de documentación (`6ae8a6b`) antes del commit de implementación (`ca64823`), siguiendo el flujo abrir → implementar del kit SDD.
- El borrado de `docs/legacy-visual-spec.md` y de los cinco fixtures `tests/fixtures/visual-*.json` es consistente entre sí: no quedan fixtures huérfanos referenciando un documento que ya no existe.
- Los mensajes de commit son descriptivos y respetan el scope `(0000)` del proyecto.

## Issues

### Critical

1. **El requisito central del spec no se cumple.** Las 250 líneas de `spec.md` (Requisito 1–250) exigen, todas, que «el gate visual se retira sin perder el criterio N de la revisión de pantallas del expediente». El diff se limita a borrar `docs/legacy-visual-spec.md` (que documentaba esos 250 criterios de captura/comparación de pantalla) y los fixtures asociados; no hay ningún fichero nuevo, sección de código o documento que migre, traduzca o preserve esos criterios en otro sitio. El propio mensaje del commit `ca64823` lo confirma: «la validación ya no captura pantallas» — es una retirada sin sustituto, no una retirada que preserve el criterio. Tal como está, la rama contradice el requisito que dice cumplir.

### Important

2. **El cambio en `src/app.js` es parcial e inconsistente.** De las 200 líneas de comentario `// app N: función que valida la fila N...`, solo las filas 20–50 (30 de 200) se reescriben a «función que comprueba sin gate visual la fila N...». Las filas 1–19 y 51–200 quedan intactas, describiendo la validación como si el gate visual siguiera vigente. `app.js` es el único artefacto de tipo «código» en el repo, así que esta reescritura parcial no tiene justificación visible en el diff, el spec ni el mensaje de commit, y deja el fichero en un estado inconsistente respecto a lo que dice haber retirado.
3. **`plan.md` no refleja ejecución ni verificación.** Los 231 pasos quedan con `- [ ]` (ninguno marcado), y cada paso promete «comprobar que la suite sigue en verde tras el cambio». No existe `package.json`, runner de tests ni configuración de CI en el repo — no hay «suite» que comprobar. No hay evidencia en el diff (ni informe de task adjunto) de que se haya ejecutado ninguna verificación real antes de este commit «final».

### Minor

4. `roadmap.md` y `spec.md` están compuestos por frases repetidas casi idénticas (p. ej. «Detalle largo de la fila de roadmap con su evidencia, su ticket y su decisión literal» repetida 30 veces por fila). Esto dificulta localizar la evidencia y la decisión reales detrás de la retirada del gate, y da la impresión de contenido de plantilla sin rellenar más que de una justificación escrita.

## Assessment

**No apto para merge tal cual.** El hallazgo Critical (#1) es el que bloquea: el spec exige preservar los criterios de revisión de pantallas y la implementación se limita a borrarlos, sin sustituto. Los Important (#2, #3) refuerzan la falta de confianza: el único código del repo queda tocado a medias y no hay rastro de verificación (ni suite que ejecutar, ni plan marcado).

Recomendación de verificación adicional para el hilo principal: si existe una suite de tests real fuera de este paquete de review (no visible en el diff), confirmar explícitamente que se ejecutó contra este commit; si no existe, la afirmación «comprobar que la suite sigue en verde» de los 231 pasos del plan debería revisarse o eliminarse del plan antes de cerrar la feature.
