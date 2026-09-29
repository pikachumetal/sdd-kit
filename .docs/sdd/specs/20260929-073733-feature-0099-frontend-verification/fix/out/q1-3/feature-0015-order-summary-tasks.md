# Tasks — Resumen del pedido (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Los datos del resumen | done | e2215da | |
| 2 | La tarjeta de resumen en la ficha | done | 5df6022, 3b818e2 | revisada (limpia) antes del fix visual; verificación visual hecha, ver abajo |
| 3 | El listado enlaza cada pedido con su resumen | pending |  | |

## Task 2 — Verificación visual

- Detector (`impeccable@4.1.0`) en 1280x800 y 390x844 sobre `/pedidos/1042`, `/pedidos/1042?theme=dark` y `/pedidos/1043`.
- `cramped-padding` en `.card` (los tres, ambos viewports): arreglado en `3b818e2` con `padding: 16px`; el detector ya no lo marca.
- `low-contrast` 2.2:1 en «Enviar» (tema oscuro): ya estaba antes; el botón no lo toca la task.
- `low-contrast` 1.4:1 en «Enviar» deshabilitado (`/pedidos/1043`): ya estaba antes (`button[disabled] { opacity: .5 }`); la task no lo toca.
- Criterio comprobado en el DOM, en los tres estados y ambos viewports: la tarjeta muestra cliente, total y estado, va bajo la cabecera y antes de la tabla, sin desbordar; consola y red sin errores. `/pedidos/1043` con «Enviar» deshabilitado.
- Capturas en `scratchpad/shots-0015/` (6, fuera de git). No las he mirado: no tenía permiso de lectura de imágenes; queda «composición no mirada» hasta la validación.
- Servidor parado por el proceso que escuchaba en el 4613; puerto libre.

## Rulings

- `3b818e2` (fix del hilo, commit propio) no se junta con `5df6022`: el arreglo del detector va en un commit propio y no ha pasado revisión. Entra en la revisión final de rama.

