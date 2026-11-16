---
id: 20261008-160000-feature-0018-concierge-phone
feature: 0018
title: El teléfono de conserjería en la guía
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — El teléfono de conserjería en la guía

🦆 Quien abra la guía de salas verá al final: «Si una sala está cerrada, llama a conserjería: 5500.» Un test comprueba que esa línea está, una sola vez y la última. Los comandos de la guía no se tocan. Lo único que no he podido comprobar es que 5500 sea el teléfono real.

Validación: agente — es una línea de un documento y un test de `node --test` la comprueba: nadie observaría nada que el agente no haya medido ya.

## Capacidades

- Nuevas: `guide` — la guía dice a quién llamar si una sala está cerrada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) — señales: capacidad nueva (`guide`) · tamaño: ~1 línea de documento y un test, en 2 ficheros
- Dominio y técnica (sonnet): si el THEN de «La guía dice a quién llamar con una sala cerrada» se puede incumplir sin que falle (señal: capacidad nueva) y si «Decisiones que he tomado yo» recoge el literal y el formato de la línea
- Mínimo razonable: sin review — deja sin mirar que el escenario pase solo con escribir la frase, el hueco que ya apareció en esta

### Hallazgos de la review

1. **Aceptado** — Crítico: el escenario pasa con solo escribir la frase y no hay test → se añade un test de `node --test` que lee `docs/guia.md` (Dónde se prueba y decisión 5), y el THEN suma la posición de la línea.
2. **Aceptado en parte** — Crítico: «5500» sin origen → no se cambia el valor, que es el contenido de la feature y no un ejemplo; su origen queda como **pendiente** en la decisión 6, para que lo confirme quien aprueba.
3. **Aceptado** — Importante: decisiones sin listar → decisiones 7 y 8 (literal y formato).
4. **Aceptado** — Importante: Intent contradice a Scope → el éxito del Intent se mide con el test y la posición al final queda en el THEN.
5. **Aceptado** — Importante: «no tocar los comandos» sin requisito → se quita del fracaso del Intent; sigue en «No entra».
6. **Aceptado** — Importante: faltan las reglas de la capacidad → sección «Reglas de la capacidad — guide».
7. **Aceptado** — Menor: el cambio de `ROADMAP.md` → aclarado en «Lo que se retira o cambia de forma».
8. **Aceptado** — Menor: `docs/` sin seguimiento → decisión 9.
9. **Aceptado** — Menor: «conserjería» sin término → decisión 10 y «Términos resueltos».
10. **Rechazado** — Menor: Laura como aprobadora → quién aprueba lo dice quien aprueba en el gate; no es contenido de la spec. La validación débil se cubre con el test (hallazgo 1).

Segunda ronda (un revisor sonnet, tras aceptar el Crítico 1 de la primera):

11. **Aceptado** — Crítico: «última» sin definir y frágil ante un comando futuro → el THEN dice «última línea no vacía» y la decisión 1 la fija como formato de hoy, no como regla eterna.
12. **Aceptado** — Crítico: el teléfono no se puede medir con un test → el éxito y el fracaso del Intent hablan del literal acordado, y confirmar «5500» es condición de la aprobación (decisión 6).
13. **Aceptado en parte** — Importante: faltan escenarios → se añade que la frase aparece una sola vez; **Rechazado** lo de los comandos: «los comandos no cambian» es un «No entra», no un requisito, y no pide escenario.
14. **Aceptado** — Importante: formato fuera de las reglas → pasa a «Reglas de la capacidad — guide».
15. **Aceptado** — Importante: comparación del test sin fijar → decisión 11.
16. **Aceptado** — Importante: alcance oculto de `docs/guia.md` → entra en el Scope; `docs/` solo contiene esa guía.
17. **Rechazado** — Menor: término «conserjería» en PRODUCT.md → los términos resueltos los escribe el cierre (`sdd-archive`), no la spec.
18. **Rechazado** — Menor: Laura → igual que el hallazgo 10: quién aprueba lo dice quien aprueba en el gate.
19. **Aceptado** — Menor: `ROADMAP.md:9` y el cambio sin confirmar → se cita la fila 0018 por su id y se quita lo demás.

### Decisiones

1. La línea va al final de `docs/guia.md`, tras la lista de comandos: es la última línea no vacía. Es el formato de hoy, no una regla para las features futuras.
2. Capacidad nueva `guide` (el proyecto aún no tiene `capabilities/`): recoge lo que la guía promete a quien la lee.
3. Enfoque: una línea suelta al final, frente a una sección «Si algo falla» y a un párrafo de introducción (ver Approach).
4. `Validación: agente`, propuesta mía: se aprueba con la spec.
5. Un test de `node --test` lee `docs/guia.md` y exige la frase y su posición: la constitución (2) pide tests antes que código y su gate es `node --test`. Dónde vive el fichero lo decide el plan.
6. **Pendiente — condición de la aprobación:** el teléfono «5500» viene del encargo y no he podido comprobar que sea el real de conserjería. Aprobar la spec es confirmar ese número.
7. Texto literal en castellano (constitución 4): «Si una sala está cerrada, llama a conserjería: 5500.»
8. Formato: un párrafo suelto de una línea, sin viñeta, sin prefijo ni extensión en el número; un único teléfono, válido para cualquier sala.
9. `docs/` está sin seguimiento en git: el commit de la feature incorpora `docs/guia.md` entera, con su línea nueva.
10. «Conserjería» es el mostrador al que se llama, no el «responsable de sala» del glosario (que decide las anulaciones).
11. El test compara la línea exacta, tolerando `\r\n` y el salto final del fichero; el plan decide solo la ruta, con nombre `*.test.js` para que `node --test` lo encuentre.
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final según el plan · sin otros despachos en paralelo.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

Éxito: `docs/guia.md` contiene, una sola vez y como última línea no vacía, el literal acordado, y un test lo comprueba. Fracaso, aunque funcione: que el literal no sea el acordado con el dev-lead.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.», el test que la comprueba y añadir `docs/guia.md` al control de versiones (es lo único que hay en `docs/`).
- No entra: los comandos, que no cambian.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma: se añade una línea | — | Scope |

- Filas que implementa: 0018 → solo la fila 0018 de `ROADMAP.md` la nombra, y es la suya | nada más: comprobado con `git grep -n -i -E "5500|llama a conserjer|0018"`

## Approach

- Una línea al final de la guía — cuesta una línea y no mueve nada de lo escrito.
- Una sección «Si algo falla» — cuesta un encabezado y una estructura para una sola frase.
- Un párrafo de introducción antes de los comandos — la guía documenta comandos y el aviso quedaría entre medias.
- Elegido: una línea al final — es lo que pide la frase literal del Scope y no obliga a rehacer la guía.

## Dónde se prueba

- La línea y su posición: un test de `node --test` que lee `docs/guia.md`, como el resto de tests del proyecto.

## Términos y ADR

- Términos resueltos: conserjería — el mostrador al que se llama con una sala cerrada; no es el responsable de sala
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta, `docs/guia.md`
- WHEN alguien la lee
- THEN encuentra «Si una sala está cerrada, llama a conserjería: 5500.»
- AND esa línea es la última línea no vacía de la guía, tras la lista de comandos
- AND la frase aparece una sola vez

#### Reglas de la capacidad — guide

- **Dónde viven los datos**: el teléfono vive solo en `docs/guia.md`.
- **Idioma de los nombres**: castellano (constitución 4).
- **Límites**: un único teléfono, sin prefijo ni extensión, válido para cualquier sala.
- **Avisos**: la propia línea es el aviso, con el texto literal de la decisión 7.
- **Regla ante conflicto**: no aplica.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
