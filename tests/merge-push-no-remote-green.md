# GREEN: `-Push` sin remoto en el cierre (patch 0112)

Mismo caso que [el RED](merge-push-no-remote-red.md): cierre de un patch con perfil `delegate`, `merge.push: true` y sin remoto. Es el patch 0013 del molde salas de la task 0067, ya validado en la petición. El kit es el de la rama con el fix sin commitear, con el script que ya no falla y la receta recortada. Sujetos Sonnet headless, 0,73 $ en total. El lanzador y las salidas están en [`green/`](../.docs/sdd/specs/20260929-170203-patch-0112-merge-push-no-remote/green/).

El THEN es que el sujeto pasa `-Push` y fusiona en una sola ejecución del script, que no hace `git push` a mano y que su línea de terminado cita `push: no hecho: sin remoto`.

| Sujeto | Llamadas al script | `-Push` | `git push` a mano | `develop` | Línea de terminado |
| --- | --- | --- | --- | --- | --- |
| [n1-1](../.docs/sdd/specs/20260929-170203-patch-0112-merge-push-no-remote/green/out/n1-1.tools.txt) | 1 | sí | no | fusionado (`008472b`) | «**Terminado.** feature/0013 fusionada en develop (008472b) · push: no hecho: sin remoto» |
| [n1-2](../.docs/sdd/specs/20260929-170203-patch-0112-merge-push-no-remote/green/out/n1-2.tools.txt) | 1 | sí | no | fusionado (`7e90968`) | «**Terminado.** feature/0013 fusionada en develop (7e90968) · push: no hecho: sin remoto · […]» |

**Pasa 2/2**. En el RED, 0/3 cierres fusionaron a la primera: los tres necesitaron relanzar el script. Ningún sujeto miró el remoto para decidir `-Push`, y la receta ya no se lo pide. La línea `push: no hecho: sin remoto` sale del script y los dos la citan.

Una nota que no se mide aquí: n1-2 alarga su línea de terminado para explicar que no hay worktree enlazado que borrar. Esa cláusula no la toca este patch.

## Veredicto

GREEN.
