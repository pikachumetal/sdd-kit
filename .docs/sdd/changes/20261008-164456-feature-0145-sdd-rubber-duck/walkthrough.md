---
id: 20261008-164456-feature-0145-sdd-rubber-duck
feature: 0145
title: Walkthrough — sdd-rubber-duck, explicar en llano en modo corto y modo largo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-08
---

# Walkthrough — `sdd-rubber-duck`

## 1. Cambios realizados

- **Skill nueva** `skills/sdd-rubber-duck/SKILL.md`, en inglés, con su `NOTICE`. Es una adaptación MIT de `teach` y `wait-what` de mattpocock/skills 1.2.3, con su viñeta en `THIRD_PARTY_NOTICES.md` (`2feb97a1`, recortada en el commit de cierre).
  - **Sección común «Words»**: el glosario de `PRODUCT.md` sin las palabras de _Evitar_; sin rutas, identificadores ni jerga del kit; el término técnico, explicado por su efecto en la misma frase.
  - **Modo corto**: un párrafo con 🦆, de cinco frases como mucho; primero qué y después cómo; sin preguntas, y lo pendiente va tras el párrafo.
  - **Modo largo**: lee el camino real en el código, sigue un ejemplo con datos por pasos numerados, deja las rutas solo en «Dónde mirar» y termina ofreciendo resolver dudas.
- **Batería** `tests/batteries/sdd-rubber-duck/`: el molde `exportes` (reservas con una exportación al calendario en cinco ficheros, `PRODUCT.md` con glosario, un test en rojo y una spec en borrador), `battery.md` con la rúbrica R1–R7, C1 y C2 y la procedencia de cada regla, y `subject.sh` (`5a9f3f8b`).
- **Evidencia**: `tests/sdd-rubber-duck-red.md` y `tests/sdd-rubber-duck-green.md`, con las salidas de los sujetos en `red/`, `green/` y `refactor/`.
- **Listas y topes**: el tope de 500 palabras en `tests/WordBudget.Tests.ps1`, una fila en el catálogo del `README.md`, una línea en el árbol de `architecture.md` y las «16 skills» de `CLAUDE.md`.
- **Capacidades**: `explaining` (nueva, tres requisitos) y un requisito nuevo en `routing`, fusionados en el cierre.
- **Fuera de la feature**: el commit `581ebdcf` (migración del marcador a v2.3.3) cayó en esta rama antes de arrancarla.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 1,1h — reloj del hilo, aproximado con las marcas de los commits: 18:52 la apertura, 19:40 la pasada de fix y ~20 min de cierre. Spec y plan, ~0,3 h más (desde 18:36).
- Desviación: -1,9h (-63 %)
- Causa de la desviación: la estimación contó la campaña como redacción secuencial, ~10 min por fichero de evidencia más un molde de diez ficheros. En la práctica los sujetos corrieron en paralelo en 3–6 min por tanda, y el molde salió en una pasada. Es el sesgo que ya describe `estimation.md` («se estima como redacción»): esta vez la redacción también fue corta, porque los escenarios eran de un turno.
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 31.336.353 — claude-opus-5-5 31.336.353
- Tokens de subagentes: 2.421.965 en 1 despacho — Revisión final rama 0145 claude-opus-5-5 2.421.965 / 15 min
- Coste de la sesión: 13,15 $ (hilo 11,36 $ + subagentes 1,79 $)
- Coste de sujetos: 2,23 $ en 18 sujetos sonnet — RED 0,71 $; GREEN 0,87 $; REFACTOR 0,27 $; controles de la pasada de fix 0,37 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **El molde no acepta `--sala`**: el plan pedía que `cli.js` lo aceptara, y eso contradecía que la feature 0013 del molde siguiera en borrador. La revisión final lo dio por bueno como fallo del plan.
- **El RED se lanzó dos veces**: en el primer intento la guarda de `subject_init` no arrancó ningún sujeto (ver rulings), con coste 0 $.
- **Tras la revisión final se recortaron cuatro reglas** del `SKILL.md`. El plan cortaba el RED por fila de la rúbrica, y el Art. I lo pide por regla.

### Decisiones tomadas sin el dev-lead

- Task 1: `subject_init` abortaba en el RED porque la skill esperada no existe en el kit de la base. En el RED, la guarda comprueba `using-sdd`; fuera de él, la skill esperada. Coste si está mal: un RED que no detecta un kit vacío de skills nuevas.
- Task 2: con la línea nueva del árbol, `architecture.md` pasaba de 1.900 a 1.916 palabras. Acorté las líneas de `sdd-grilling` y `sdd-rubber-duck` a «(+ NOTICE: preguntar|explicar)» en vez de subir el tope, que es decisión del dev-lead. Coste si está mal: el árbol ya no dice que esas dos skills van en inglés (lo dice el Art. III).
- Final: subí los Minor 3 y 4 de la revisión final (R4 de l1-2 sin F; un «Resultado» que atribuía todo a la skill final) al Important 1, porque son errores de la evidencia que lee quien edita la skill. Coste si está mal: dos frases de evidencia corregidas de más.
- Final: recorté «frases cortas en voz activa», «ids», «si no cambia nada, dilo en una frase» y «de 3 a 9 pasos». No tenían un fallo del RED detrás, y el THEN de 3 a 9 pasos queda como control de R4. Coste si está mal: un 🦆 de un refactor podría inventar un efecto. Si aparece en campo, vuelve con su escenario.
- Deferred minors (de la revisión final):
  - el ejemplo «decide cómo se escribe la hora» del modo corto puede hacer que la 0146 pida la decisión dos veces;
  - «Dónde mirar» va literal en castellano;
  - `${ASK,}` de `subject.sh` necesita bash 4;
  - la `description` se solapa con el «¿cómo funciona…?» de `sdd-consult`, y falta un c2 de enrutado;
  - `tasks.md` seguía en pending, y se puso al día en el cierre.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester tests/WordBudget.Tests.ps1,tests/Skills.Tests.ps1,tests/PathLength.Tests.ps1,tests/SubjectOutputPrivacy.Tests.ps1 -CI` → 210 en verde y 14 saltados.
- Suite completa: `moon run :test`, que lanza el pre-commit en cada commit (`roadmap check`, typecheck, 708 tests de Vitest de la CLI y 955 de Pester) → en verde en el commit de cierre · ~30 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-08 · suite 708 + 955 en verde · smoke 4/4 THEN con ejecución real (18 sujetos headless) · revisión final opus con fixes sobre 2feb97a1, pasada de fix juntada en el cierre, con controles en verde

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| 🦆 de una spec: un párrafo de ≤ 5 frases, primero qué con un ejemplo con datos, sin `src/export/filter.js`, `bookingsBySlot` ni «slot», sin preguntas | ejecución real: s1-1, s1-2 y s1-4 | pasa (s1-4, con la skill final: cinco frases, el ejemplo del 2 y el 19 de marzo) |
| 🦆 de un bloqueo: qué le pasa al socio (10:00 → 08:00) antes que la causa, con UTC explicado en la misma frase | ejecución real: s2-1, s2-3 y s2-4 | pasa (s2-2 falló R3 antes del REFACTOR) |
| Explicación larga: de 3 a 9 pasos respaldados por el código, ejemplo de marzo, palabras del glosario, rutas solo en «Dónde mirar», termina ofreciendo resolver dudas | ejecución real: l1-1, l1-3 y l1-4 | pasa (l1-2 falló R1 y R4 antes del REFACTOR) |
| Routing: «Explícame cómo viaja una exportación…» entra por `sdd-rubber-duck`; «¿cómo está montado…? No lo pillo.» sigue en `sdd-consult` | ejecución real: l1 4 de 4 y c1 1 de 1 | pasa |

### 4.3 Residuales / deuda generada

- La conexión del 🦆 en las paradas es de la 0146, y con ella tres hallazgos de la revisión final: el contrato de preguntas del modo corto, el título «Dónde mirar» en el idioma del usuario y un escenario c2 de enrutado contra `sdd-consult`. Van a una fila de deuda del roadmap con destino «Actuar en la 0146».
- `${ASK,}` en `subject.sh` (bash 4): sin fila, porque el equipo lanza las baterías desde Git Bash en Windows (bash 5).

## 5. Aprendizajes

- La guarda de `subject_init` impide el RED de una skill nueva: el escenario espera una skill que el kit de la base no tiene. La batería pasa en el RED la guarda de una skill que sí está (`using-sdd`) → `tech-stack.md`, «Baterías por skill».
- El RED de una skill se lee por regla del `SKILL.md`, no por fila de la rúbrica. Una fila puede fallar por una parte mientras la regla vecina que se escribe con ella no tiene fallo detrás: cuatro reglas pasaron así hasta la revisión final → `tech-stack.md`, «Baterías por skill».

## 6. Adendas
