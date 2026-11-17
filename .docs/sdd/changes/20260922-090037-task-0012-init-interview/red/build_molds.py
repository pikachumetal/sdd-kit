# Construye los tres moldes del RED previo de la task 0012 (sin .git: el lanzador lo crea por run).
import pathlib, sys

ROOT = pathlib.Path(__file__).parent / "molds"
P = "<!-- sdd-template: pending -->"

E1 = {
    "README.md": "# reservas\n\nAplicación Angular + .NET instanciada desde el template `angular-dotnet`.\n\n- `frontend/`: Angular 20\n- `backend/`: ASP.NET Core 9 + EF Core + PostgreSQL\n\nArranque: `moon run :dev`.\n",
    "CLAUDE.md": "# reservas — guía para Claude\n\nDocumentación de anclaje en `.docs/sdd/`.\n\n## Reglas operativas\n\n- Todas las tareas se lanzan con moon: `moon run frontend:dev`, `moon run backend:dev`, `moon run :test`.\n- Nunca `npm install` dentro de `frontend/`: `moon run frontend:install`.\n- El entorno de un worktree se prepara con `moon run :env-setup` (ver `.docs/sdd/environments.md`).\n- Auth: JWT emitido por el backend; nunca guardar el token en `localStorage`.\n- Migraciones EF Core solo con `moon run backend:migrate`.\n- Ramas: `feature/<id>` desde `develop`, `hotfix/<id>` desde `main`.\n",
    "frontend/package.json": '{\n  "name": "reservas-frontend",\n  "private": true,\n  "dependencies": { "@angular/core": "^20.1.0", "@angular/router": "^20.1.0" }\n}\n',
    "frontend/src/main.ts": "import { bootstrapApplication } from '@angular/platform-browser';\nimport { AppComponent } from './app/app.component';\n\nbootstrapApplication(AppComponent);\n",
    "frontend/src/app/app.component.ts": "import { Component } from '@angular/core';\n\n@Component({ selector: 'app-root', template: '<h1>Reservas</h1>' })\nexport class AppComponent {}\n",
    "backend/Reservas.Api.csproj": '<Project Sdk="Microsoft.NET.Sdk.Web">\n  <PropertyGroup><TargetFramework>net9.0</TargetFramework></PropertyGroup>\n  <ItemGroup><PackageReference Include="Npgsql.EntityFrameworkCore.PostgreSQL" Version="9.0.4" /></ItemGroup>\n</Project>\n',
    "backend/Program.cs": "var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\napp.MapGet(\"/health\", () => \"ok\");\napp.Run();\n",
    "moon.yml": "tasks:\n  dev:\n    command: noop\n",
    ".docs/sdd/mission.md": f"# Misión — reservas\n\n## Por qué existe\n\n{P}\n\n## Usuarios y roles\n\n{P}\n\n## Módulos\n\n{P}\n\n## Dominio (lenguaje del equipo)\n\n{P}\n",
    ".docs/sdd/constitution.md": f"# Constitution — reservas\n\n## Art. I — Stack cerrado\n\nAngular 20 + ASP.NET Core 9 + PostgreSQL 16. Cambiar una pieza del stack es una decisión de arquitectura con spec propia.\n\n## Art. II — Migraciones\n\nEF Core, una migración por cambio de modelo, nunca editar una migración ya aplicada.\n\n## Art. III — Commits\n\nConventional Commits; tipo y scope en inglés, cuerpo en castellano.\n\n## Art. IV — Tests\n\nTodo endpoint nuevo lleva test de integración con Testcontainers.\n\n## Art. V — Seguridad\n\nSecretos solo en variables de entorno; nunca en el repo.\n\n## Artículos de producto\n\n{P}\n\n## Reglas de producto\n\n{P}\n",
    ".docs/sdd/tech-stack.md": "# Tech stack — reservas\n\n| Capa | Tecnología | Versión |\n| --- | --- | --- |\n| Frontend | Angular (standalone, signals) | 20.1 |\n| Backend | ASP.NET Core minimal APIs | 9.0 |\n| Datos | PostgreSQL + EF Core (Npgsql) | 16 / 9.0 |\n| Build | moon | 1.39 |\n| Tests | Vitest · xUnit + Testcontainers | — |\n",
    ".docs/sdd/architecture.md": "# Arquitectura — reservas\n\nMonorepo moon con dos proyectos: `frontend/` (SPA Angular) y `backend/` (API REST). El frontend habla con el backend por `/api`, con proxy en desarrollo. El backend sigue vertical slices: una carpeta por feature con endpoint, handler y tests.\n",
    ".docs/sdd/environments.md": "# Entornos por worktree — reservas\n\nCada worktree levanta su PostgreSQL en Docker con puerto derivado del nombre de la rama.\n\n- `moon run :env-setup` crea la BD y escribe `.sdd-env.json`.\n- `moon run :env-clean` la borra.\n- `moon run :env-preflight` comprueba Docker y puertos.\n",
    ".docs/sdd/estimation.md": "# Estimación — reservas\n\nMétodo: reference-class por tamaño (S/M/L/XL) y factor de calibración que se ajusta con el `estimation-log`.\n\n## Notas de calibración de este proyecto\n\n(vacío)\n",
    ".docs/sdd/roadmap.md": f"# Roadmap — reservas\n\n## Próximo\n\n{P}\n\n## Módulos\n\n{P}\n\n## Deuda técnica\n\n| Ítem | Impacto | Destino |\n| --- | --- | --- |\n\n## Patches\n\n| Fecha | Id | Patch | Estado |\n| --- | --- | --- | --- |\n",
    ".docs/sdd/changelog.md": "# Changelog\n\n## [Unreleased]\n",
    ".docs/sdd/estimation-log.md": "",
    ".docs/sdd/sdd-kit.json": '{"version": "1.1.0", "channel": "plugin", "updated": "2026-09-20", "ids": {"mode": "sequence"}}\n',
    ".docs/sdd/capabilities/.gitkeep": "",
    ".docs/sdd/specs/.gitkeep": "",
}

STATUSLINE_JS = """#!/usr/bin/env node
// Statusline para Claude Code: lee el JSON de sesión por stdin y pinta una línea.
const { readFileSync } = require('node:fs');
const { formatModel, formatCost } = require('./lib/format');
const { gitBranch } = require('./lib/git');

function main() {
  const input = JSON.parse(readFileSync(0, 'utf8'));
  const parts = [
    formatModel(input.model),
    gitBranch(input.workspace?.current_dir),
    formatCost(input.cost?.total_cost_usd),
  ].filter(Boolean);
  process.stdout.write(parts.join(' | '));
}

main();
"""

E2 = {
    "statusline.js": STATUSLINE_JS,
    "lib/format.js": "function formatModel(model) {\n  return model?.display_name ?? '?';\n}\n\nfunction formatCost(usd) {\n  if (usd == null) return '';\n  return `$${usd.toFixed(2)}`;\n}\n\nmodule.exports = { formatModel, formatCost };\n",
    "lib/git.js": "const { execSync } = require('node:child_process');\n\nfunction gitBranch(dir) {\n  try {\n    return execSync('git branch --show-current', { cwd: dir, encoding: 'utf8' }).trim();\n  } catch {\n    return '';\n  }\n}\n\nmodule.exports = { gitBranch };\n",
    "test/format.test.js": "const test = require('node:test');\nconst assert = require('node:assert');\nconst { formatCost } = require('../lib/format');\n\ntest('formatCost con dos decimales', () => {\n  assert.strictEqual(formatCost(1.5), '$1.50');\n});\n",
    "README.md": "# statusline\n\nStatusline para Claude Code. Sin dependencias: Node 22.\n\n```\nnode --test\n```\n",
    ".gitignore": "node_modules/\n",
}

E3 = {
    "README.md": "# salas\n\nProyecto nuevo: app interna para reservar salas de reuniones de la oficina.\n",
}

def write(name, files):
    base = ROOT / name
    for rel, content in files.items():
        p = base / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8", newline="\n")

for name, files in {"e1-template": E1, "e2-code": E2, "e3-absent": E3}.items():
    write(name, files)
print("moldes listos en", ROOT)
