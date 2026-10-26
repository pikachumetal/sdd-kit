---
status: accepted
date: 2026-10-26
rutas:
  - tests/**
  - cli/test/kit/**
---

# Las skills no se prueban por sus frases

## Contexto y problema

El repo probaba las skills con 67 ficheros Pester (969 `It`). De sus aserciones, 1139 líneas comprobaban que una frase literal seguía escrita en un `SKILL.md` o una plantilla: no probaban cómo se comporta el agente, que es lo que prueban las baterías RED/GREEN (Art. I), y cada edición de una skill arrastraba la de su test. La ADR 0011 los dejó «hasta la 0152», y la 0045 ya preguntaba qué protegía cada uno. El dev-lead, 2026-10-26: «se que no sirven de nada y testean FRASES».

## Opciones consideradas

- Portar las frases a Vitest: cambia el lenguaje y deja el problema; cada edición de skill sigue tocando un test.
- Quedarse solo con las frases de contrato, las que otra skill o un script lee literal (criterio de la 0045): el contrato con código ya lo prueba el código, y el que lee un agente es una frase más.
- Portar toda la estructura (secciones, número de campos, H1): un test que cuenta los encabezados de una plantilla falla igual cuando la plantilla cambia a propósito.
- Portar solo lo que rompe algo de verdad, más lo que fija una regla escrita.

## Decisión

La última. Pasa a `cli/test/kit/`, en Vitest, lo que rompe algo de verdad: que Claude Code cargue las skills y los agentes, que los enlaces y las skills invocadas existan, que no se publique el nombre de un proyecto real, que ninguna ruta llegue a 140 caracteres y que la cabecera de release de `sdd roadmap check` sea la de su plantilla. Pasa también lo que fija una regla escrita: los topes de palabras con su margen, la paridad migración–init, el marcador de revisión de `.docs/workflow/` y el `NOTICE` de las skills adaptadas. Lo demás se borra. Un nombre retirado no se vigila con una lista que crece con cada renombrado: lo cubre un test genérico, toda skill invocada existe, y la retirada se comprueba una vez, como smoke.

### Consecuencias

- Sustituye la consecuencia de la [ADR 0011](0011-node-cli.md) «los Pester que quedan (frases y anatomía de skills) siguen hasta la 0152». La 0011 sigue vigente en lo demás y no se edita. Los Pester que quedan son de conducta, hasta la 0227.
- La «Confirmación» de las ADR 0001, 0002, 0005-0008, 0010, 0012 y 0014-0016 cita Pester de frase que ya no existen. Su prueba es la batería RED/GREEN de la skill que aplica la regla.
- Editar una frase de una skill no toca ningún test. Cambiar la forma de una plantilla tampoco.
- `cli/moon.yml` lee como inputs de los tests de la CLI `.docs/`, `tests/`, `agents/`, `.claude-plugin/` y `README.md`: el gate corre la CLI también en un cambio que solo toca documentos.

### Confirmación

`cli/test/kit/`, en el `cli:test` del pre-commit.
