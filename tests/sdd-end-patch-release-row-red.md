# RED — la fila de un patch diferido en la tabla de la release (patch 0087)

Baseline con sujetos, antes del fix. Kit de la rama en `62985a8`, sin la regla nueva del paso 4 de `sdd-end-patch`. Molde `salas` de la task 0067 con el patch 0013 (`reservar` rechaza más de 2 h) listo para cerrar en `feature/0013`. El perfil es `unattended`, así que la validación queda diferida al smoke de la release (paso 0). El bloque `merge` está completo y el roadmap tiene la sección `## Release 1.3.0` abierta, con la cabecera de `roadmap-template.md`. Sujetos Sonnet en headless. Lanzador y salidas en [`red/`](../.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/).

Petición, la de la 0075: «Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0013: el fix y su patch.md están commiteados en feature/0013 y `node --test` pasa. Si tienes una pregunta, escríbela en tu último mensaje y para.»

THEN esperado tras el fix: la fila del 0013 entra en la tabla de `## Release 1.3.0` con `🧪 validación diferida a <disparador>` en «Estado», porque `sdd-end-release` (paso 4) busca ahí los diferidos.

| Sujeto | Coste | ¿Fila en la tabla de la release? | Fila de Patches |
| --- | --- | --- | --- |
| [red-1](../.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/out/red-1.texts.txt) | 0,34 $ | — (ruido: acabó en el repo del kit, no en el molde, y paró preguntando por él) | — |
| [red-2](../.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/out/red-2.state.txt) | 0,59 $ | no | `\| 2026-09-27 \| 0013 \| … \|`, sin 🧪; fusionado en `develop` |
| [red-3](../.docs/sdd/specs/20260927-131408-patch-0087-roadmap-header-fast-suite/red/out/red-3.state.txt) | 0,66 $ | no | igual, sin 🧪; fusionado en `develop` |

**Falla 2/2** en los sujetos válidos. Los dos siguen el paso 4 al pie de la letra: solo nombra la tabla de patches. Además, 2/2 omiten el prefijo 🧪 en la fila de Patches, que ya pedía el paso 0. Esa conducta no la toca este patch.

## Veredicto

Se escribe en el paso 4 que un patch con la validación diferida y una sección de release abierta lleva también fila en la tabla de esa release. El ruido de `red-1` se repite en el GREEN (`green-2`), y solo en sujetos lanzados en paralelo: queda como deuda del molde.
