---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

🦆 Hoy, al cerrar una feature, hay dos skills que dicen «qué se cierra»: `aviso-cierre` y `resumen-cierre`. Quitamos la primera y la segunda empieza por esa frase. Ejemplo: al cerrar la 0030, `resumen-cierre` abre con «Se cierra: Retirar la skill aviso-cierre», y después cuenta los commits y lista las filas del roadmap. Efecto colateral que tienes que mirar: `aviso-cierre` también decía «corre el gate», y eso se pierde.

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`.

## Decisiones que he tomado yo — valida estas

1. `resumen-cierre` gana una línea con lo que se cierra, **sin numerar y antes del paso 1**: así los pasos 1 y 2 siguen siendo los que fija el requisito «El resumen va al final» de `closing`, y no hace falta tocarlo.
2. El paso 2 de `aviso-cierre` («Corre el gate») **desaparece con la skill**: `resumen-cierre` no lo hereda. Lo he decidido yo; si quieres que el cierre siga diciendo que se corra el gate, dímelo y pasa al Approach y a un escenario.
3. Review de spec: ninguna. Señales: `MODIFIED` (1 requisito de `closing`); sin contrato público, datos, capacidad nueva, dependencia ni reglas de visibilidad · tamaño: ~6 líneas en 3 ficheros (`skills/aviso-cierre/` se borra, `resumen-cierre/SKILL.md` +1, `closing.md` 1 línea). Con una señal la rúbrica no recomienda revisor; la pasada de coherencia la hice yo (abajo).
4. Corregido en la pasada de coherencia: la tabla de «Lo que se retira» estaba vacía y decía que 0030 no aparece en ningún sitio, pero aparece en `roadmap.md` (fila 0030). Ahora lista cada hallazgo con su destino.

Resultado de `capability merge` sobre una copia en temp: «closing.md: sustituido «Quien cierra sabe qué se cierra»» (exit 0). `capabilities/` del repo sin tocar.
Política de modelos: sin review de spec no hay revisor; en la implementación la sesión usa el modelo que tenga, y con una sola task no se ofrece bajar de gama.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` dice también qué se cierra; `capabilities/closing.md` pasa su requisito a `resumen-cierre` (al archivar).
- No entra: cambiar `aviso-apertura`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta `skills/aviso-cierre/` |
| su paso 1, «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | pasa a `resumen-cierre` como línea inicial sin numerar |
| su paso 2, «Corre el gate» | `skills/aviso-cierre/SKILL.md` | se retira sin sustituto (decisión 2 de ✋) |
| `aviso-cierre` en el THEN de «Quien cierra sabe qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | lo cambia el `MODIFIED` de esta spec a `resumen-cierre` |
| pasos 1 y 2 de `resumen-cierre` | requisito «El resumen va al final» de `closing` | no cambian: la línea nueva no va numerada |
| otras apariciones del nombre | README.md, PRODUCT.md, scripts/, test/ | ninguna (`grep -rn aviso-cierre .` sin `.git`) |

- Filas que implementa: la 0030 de `.docs/sdd/roadmap.md` (línea 9, ⏳). Destino: `sdd-archive` la salda al cerrar. Comprobado con `grep -rn 0030 .`: no aparece en README.md ni en el código.

## Approach

`resumen-cierre` abre con una línea sin numerar que dice qué se cierra; sus pasos 1 y 2 siguen igual.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
