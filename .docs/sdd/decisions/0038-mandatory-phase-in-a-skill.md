---
status: accepted
date: 2026-11-19
rutas:
  - skills/sdd-spec-writing/**
  - skills/sdd-spec-approval/**
  - skills/sdd-spec-review/**
  - skills/sdd-plan-writing/**
---

# Una fase obligatoria va en una skill que se carga entera; las referencias son solo de consulta

## Contexto y problema

Desde la 3.0.0, `sdd-propose` escribía la spec y el plan siguiendo referencias que su paso 4 mandaba leer «First thing in this step». En las 15 sesiones reales de feature de la 3.x, 14 leyeron `references/spec-writing.md` y 5 no invocaron `sdd-grilling`; en la 0633 la sesión dio su montón por vacío y mandó al ✋ cuatro decisiones del dev-lead (ticket de la feature 0633 de document-manager, §1). La regla se leía y no se aplicaba: una referencia se consulta cuando el agente cree que toca, y una fase obligatoria no admite ese juicio. `architecture.md` decía lo contrario («la unidad de descomposición de una skill es el fichero auxiliar, no otra skill»), con mediciones que ya apuntaban aquí: en la 0013, 0 de 2 sujetos leyeron el auxiliar que llevaba la regla, y 3 de 3 la siguieron al subirla al `SKILL.md`.

## Opciones consideradas

- Seguir con referencias y reforzar el «First thing in this step: read»: no cambia lo que falló, porque 14 de 15 ya las leían.
- Una skill por fase obligatoria, invocada con `Skill` por la anterior, que se carga entera y deja rastro en el transcript (elegida).

## Decisión

Una fase obligatoria del flujo va en su propia skill, que la anterior invoca con `Skill`: `sdd-spec-writing` (la entrevista hasta `spec.md`), `sdd-spec-approval` (el repaso, la review y el gate), `sdd-spec-review` (la rúbrica) y `sdd-plan-writing` (el plan). Un fichero de `references/` es de consulta: un brief que se pega a un subagente, una tabla, un árbol; nunca un paso que hay que seguir. Una skill de fase no es puerta de entrada: su `description` dice de dónde se invoca. Las ADR 0024, 0028, 0029 y 0035, cuyas `rutas` nombraban las referencias movidas, las sustituyen la 0039, la 0040, la 0041 y la 0042.

### Consecuencias

- Cada fase deja su invocación en el transcript: si no aparece, falta la fase (dev-lead, 2026-11-19: «si no los veo invocados se que falta algo»).
- Cada skill nueva suma su `description` a la lista cargada en todas las sesiones, y su `SKILL.md` tiene que caber en 20.000 bytes: una fase que no cabe se parte en dos, como la spec (enmienda 29 de la feature 0359).
- Las demás referencias con «First thing in this step: read» (`patch-lane.md`, `config-lane.md`, las de `sdd-implement` y `sdd-archive`) quedan para otra fila.

### Confirmación

La batería de `sdd-propose`: las filas de `tools:` que piden cada invocación (`SW1`, `SA1`, `SA2`, `RV-S`, `PW`), y la prueba de campo, el recuento de invocaciones sobre los transcripts de las sesiones de feature tras la release.
