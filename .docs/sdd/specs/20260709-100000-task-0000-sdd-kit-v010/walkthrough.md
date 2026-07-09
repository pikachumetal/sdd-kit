# Walkthrough — Kit SDD v0.1.0

## 1. Cambios realizados

- 7 skills de proceso validadas: `sdd-init-greenfield`, `sdd-init-brownfield`, `sdd-start-task`, `sdd-end-task`, `sdd-start-hotfix`, `sdd-end-hotfix`, `add-to-changelog` — commits `f7cdabc`, `362b011`, `3c0f18f`, `7331bd0`.
- `sdd-templates` con las 7 plantillas canónicas — commit `5c9546d`.
- Manifests de plugin + README con instalación dual.
- Andamiaje SDD del propio repo (`.docs/sdd/` + `CLAUDE.md` de punteros + documentos de flujo en `.docs/flux/`) — este commit.

## 2. Tiempo: estimado vs real

- Tipo: infra/tooling
- Estimación: — (sin plan formal previo; ver nota de la spec retroactiva)
- Esfuerzo real: ~4,5 h (aproximado — incluye análisis comparativo de 3 repos, 8 baselines RED, 7 verificaciones GREEN y redacción)
- Desviación: N/A (sin estimación previa)

## 3. Desviaciones del plan

- `sdd-end-hotfix` necesitó un segundo baseline (RED v2 con fixture git rica): la primera fixture no ofrecía superficie de fallo. Aprendizaje metodológico registrado abajo.
- `add-to-changelog` cambió de forma prevista (disciplina) a receta/contrato tras observar que el baseline fallaba la forma, no la disciplina.
- Las plantillas se distribuyeron como skill (`sdd-templates`) en vez de carpeta suelta, para que el CLI de skills las instale.

## 4. Verificación

- 7/7 skills con GREEN al primer intento contra los fallos documentados del RED — evidencia completa en [`tests/`](../../../../tests/).
- Instalación real verificada: `/plugin marketplace add D:\code\git\sdd-kit` + `/plugin install` en la máquina del usuario — las skills aparecen como `sdd-kit:*` (2026-07-09).
- Pendiente (roadmap): estreno funcional en un proyecto real — la instalación está verificada; el uso en tareas reales aún no.

## 5. Aprendizajes

- **Un RED sin superficie de fallo no es evidencia**: si la fixture no permite fallar (sin git, sin changelog), el baseline "pasa" sin demostrar nada → repetir con fixture rica antes de concluir. → Volcado a `architecture.md` (anatomía de la evidencia).
- **La forma sigue al fallo** funciona en la práctica: la receta de `add-to-changelog` produjo convergencia exacta donde las prohibiciones habrían fallado. → Art. II de la constitution.
- **La contaminación del entorno de test** (CLAUDE.md global y superpowers del tester protegen a los baselines) hay que anotarla en la evidencia: la disciplina debe venir de la skill, no de la config personal. → Anotado en los tests RED correspondientes.
- **La gravedad natural sin skill es el monolito** (`/init` + todo en CLAUDE.md) — confirmación empírica del argumento central de los documentos de flujo. → Citado en el RED de las init.
