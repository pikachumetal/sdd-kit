# Deuda técnica — salas

## Por triar

| Ítem | Origen | Fecha |
| --- | --- | --- |
| Sin validación del formato de franja horaria | roadmap 2.x | 2026-09-18 |
| `test/ids.test.js` rojo la primera vez que corre en un repo (`TypeError [Error]: Cannot read properties of undefined (reading 'trim')`, línea 12): lee `ids-store` del directorio común de git, que solo existe tras la primera ejecución. Verde en la rama y en `develop` (4dd6aa1) al repetir. Remedio: que el test cree su propio estado; chequeo propuesto: correr cada fichero aislado | feature 0010, cierre | 2026-11-12 |
| `test/cancel.test.js`: `canceladas` depende de la cancelación del primer test (ruling de la Task 2); falla si corre solo o en otro orden | feature 0010, cierre | 2026-11-12 |

## En espera

| Ítem | Causa | Origen | Impacto | Falta | Fecha |
| --- | --- | --- | --- | --- | --- |

## Lista

| Ítem | Causa | Origen | Impacto | Evidencia | Remedio temporal | Arreglo | Destino |
| --- | --- | --- | --- | --- | --- | --- | --- |
