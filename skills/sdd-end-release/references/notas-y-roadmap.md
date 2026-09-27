# Release notes y colapso del roadmap — detalle

## Paso 3 — Release notes y comunicación

3. **Release notes y comunicación** *(solo con `release.hasRecipient: true`)* — `.docs/sdd/releases/vX.Y.Z/release-notes.md`,
   calcando `release-notes-template.md` del skill `sdd-templates`, destiladas del changelog sellado en
   **outcome para el usuario**, no entregable de ingeniería. **Prohibido**: IDs de feature, scopes de commit,
   jerga técnica. El email de entrega se deriva de las release notes y vive como borrador en la misma
   carpeta. Sin destinatario, no hay release notes ni email: el paso se omite y basta el changelog sellado.

## Paso 4 — Colapsar el roadmap

4. **Colapsar el roadmap** — ANTES de sustituir nada, enumera los pendientes vivos de la sección de la
   release y reubícalos (siguiente release / backlog); DESPUÉS colapsa la sección a resumen + enlaces:
   changelog siempre, release notes solo con destinatario, retro solo si existe. Añade también la línea de
   smoke de la release: **smoke** = lo que se ejecuta sobre la rama integrada antes del cierre para
   comprobar que lo entregado funciona (la suite más un uso real: arrancar, instalar, invocar);
   **hallazgo** = defecto del comportamiento entregado que detecta ese smoke, se corrija o no dentro de la
   release — lo que ya salió en el walkthrough de una feature no cuenta. La línea es `smoke: <fecha> · <N>
   hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, o `smoke: pendiente` si no se ejecutó: el
   número no se inventa (el patrón «release pequeña, smoke por tramo» se lee así sin abrir las actas: en
   los retos del equipo, una release grande con smoke único dio 9 hallazgos; tres cortas, 3 · 0 · 0).
   Edición determinista: localizar sección exacta → sustituir.
