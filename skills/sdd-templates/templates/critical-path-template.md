# Camino crítico — <proyecto>

> Los tests que se quedan en la base cuando `operations.md` §Testing declara «Camino crítico». Solo la edita una persona: la sesión propone una fila en el ✋ de la spec o en §4 de `patch.md`, y la persona la pega en la rama durante la validación. Un test por camino, en el nivel más bajo que lo ve. Criterios:
>
> - **A**: si se rompe, la aplicación deja de funcionar, alguien ve datos que no debe, alguien hace lo que su permiso no le deja o se pierde lo guardado.
> - **B**: se ha roto dos veces o más, y este test caza esas roturas.
> - **C**: el camino feliz de una funcionalidad clave que elige una persona: «que funciona», sin bordes ni errores; uno por funcionalidad.
> - **Arnés**: los tests que impiden que la suite dé verdes falsos.
>
> «Test» es el id como lo lista su runner (`Namespace.Clase.Método`; `fichero › describe › título`). Borra los bloques de ayuda (`>`) al redactar.

| Nivel | Camino | Crit. | Test | Evidencia |
| --- | --- | --- | --- | --- |
| <integración \| E2E \| …> | <el camino, en palabras del usuario> | <A \| B \| C \| Arnés> | <id del test> | <por qué cumple el criterio: la rotura, el incidente> |
