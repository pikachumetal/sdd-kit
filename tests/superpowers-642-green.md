# Evidencia GREEN — compatibilidad con superpowers 6.4.2 (patch 0082, 2026-09-27)

Mismo escenario que el RED ([`superpowers-642-red.md`](superpowers-642-red.md)): la spec de la 0012 aprobada y «Escribe el plan.md y para ahí». Mismo lanzador ([`subject.sh`](../.docs/sdd/specs/20260927-105403-patch-0082-superpowers-obra-642/red/subject.sh)). El kit es una copia del working tree con la plantilla de cada ronda, y superpowers 6.4.2 está instalado. Criterios: (a) ningún cuerpo que la firma y los tests ya determinan, y (b) los asserts de cada test como código.

## Ronda 1 — Step 1 alineado, sin «como código» ni contraejemplo

El Step 1 pide la firma, el fichero y los valores de la spec, y para cada test «su nombre y sus asserts con esos valores». El cuerpo, solo para un algoritmo que no queda determinado. Salida en `green/out/`.

| Sujeto | Modelo | Coste | (a) | (b) | Nota |
| --- | --- | --- | --- | --- | --- |
| `h-1` | Sonnet | 1,29 $ | ❌ | ✅ | El Step 5 copia el cuerpo entero de `MapGet` (17 líneas: `TryParse`, 400 y paginación), que ya fijan la firma y cinco tests |
| `h-2` | Sonnet | 0,90 $ | ✅ | ❌ | Tests en prosa («siembra… pide…»), sin asserts como código |

Sin mejora frente al RED (1/2 y 1/2). Solo alinear el texto no cambia la conducta.

## Ronda 2 — refuerzo

Al Step 1 se le añade «sus asserts como código», literal de la 6.4.2. Tras los pasos va un bloque de ayuda con el contraejemplo medido: el cuerpo del endpoint que copiaron 2 de 4 planes, y lo que tocaba (la firma, los valores y los tests con sus asserts como código). Salida en `green2/out/` (Sonnet) y `green2-opus/out/` (Opus).

| Sujeto | Modelo | Coste | (a) | (b) | Nota |
| --- | --- | --- | --- | --- | --- |
| `green2/h-1` | Sonnet | 1,17 $ | ✅ | ✅ | Solo tests en bloques de código; los pasos de código llevan la firma y los valores |
| `green2/h-2` | Sonnet | 1,01 $ | ✅ | ✅ | La firma de `MapGet` y el enfoque en una línea (`Enum.TryParse`, 400, `.Where`), sin cuerpo; asserts inline como código |
| `green2-opus/h-1` | Opus | 1,45 $ | ✅ | ✅ | Asserts como código, `[Theory]` para los valores inválidos |
| `green2-opus/h-2` | Opus | 1,29 $ | ✅ | ✅ | Igual |

**4/4 en los dos criterios**, frente a 3/4 y 2/4 en el RED con los dos modelos juntos.

## Lectura

- El refuerzo que funciona es el contraejemplo con el caso medido, más la palabra «como código». Repetir la regla de superpowers (ronda 1) no bastó.
- **Opus frente a Sonnet**: sin refuerzo, Opus evita los cuerpos (2/2 frente a 1/2) pero no escribe mejor los asserts (1/2 los dos). Con el refuerzo, los dos quedan en 2/2. Para escribir el plan con esta plantilla, estos datos no justifican recomendar Opus. El coste por sujeto salió parecido (Opus 1,09–1,45 $, Sonnet 0,90–1,41 $). Con n=2 por celda es una señal, no una medida.
- Campaña entera: 10 sujetos, 12,03 $ (techo de 10 sujetos y 18 $, ampliado por el dev-lead desde 4 y 6 $).

## Cómo lo hacen otros

Consulta del 2026-09-27, sin sujetos:

- **GitHub Spec Kit**: `tasks-template.md` pide «exact file paths in descriptions» y no pide firmas, cuerpos ni asserts. `plan-template.md` no prohíbe ni pide código.
- **OpenSpec** (`schemas/spec-driven/schema.yaml`): el diseño dice «Focus on architecture and approach, not line-by-line implementation». Las tasks son casillas con su verificación (conducta observable, tests o comandos), sin código.
- **Kiro**: su documentación de specs y de buenas prácticas no dice qué nivel de detalle llevan `design.md` y `tasks.md`.

Ninguno mide si su plantilla se sigue. Coinciden con la 6.4.2 en no poner cuerpos. Superpowers va más allá con la firma exacta y los asserts como código, y en eso coincide con este patch.
