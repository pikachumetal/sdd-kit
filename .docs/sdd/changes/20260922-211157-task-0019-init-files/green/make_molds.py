# Genera los moldes de la GREEN de la task 0019 en green/molds/.
import json, pathlib, shutil

BASE = pathlib.Path(__file__).parent / "molds"

MISSION = """# Misión — invoicer

## Por qué existe

Emitir facturas a los clientes de un taller y saber qué está pendiente de cobro.

## Usuarios

- Administración: emite facturas y registra cobros.

## Dominio

- **Factura**: importe que se reclama a un cliente.
"""

CONSTITUTION = """# Constitution — invoicer

## Principios

1. Todo importe se guarda en céntimos enteros.

## Convenciones

- **Idioma**: interfaz y docs en castellano; código y nombres de fichero en inglés.
- **Ramas**: `main` estable, `develop` de integración, `feature/<id>` desde `develop`.
- **Commits**: Conventional Commits, cuerpo en castellano.

## Reglas de producto

- **Dónde viven los datos**: SQLite local.
- **Idioma de los nombres**: API y claves en inglés.
- **Límites**: pendiente.
- **Avisos**: pendiente.
- **Regla ante conflicto**: pendiente.
"""

TECH_STACK = """# Tech stack — invoicer

- Node.js 22, CommonJS.
- Tests: `node --test`.
"""

TECH_STACK_WITH_MEMORY = TECH_STACK + """
## Política de modelos

- Implementadores en Sonnet; Opus solo para revisar la spec.

## Comandos

- La suite se lanza con `npm test`.
"""

ARCHITECTURE = """# Architecture — invoicer

- `src/`: un módulo por agregado.
"""

ROADMAP = """# Roadmap — invoicer

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| 0001 | Emitir factura | ⏳ |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas
"""

ANCHORS = {"mission.md": MISSION, "constitution.md": CONSTITUTION, "tech-stack.md": TECH_STACK,
           "architecture.md": ARCHITECTURE, "roadmap.md": ROADMAP}

CODE = {"package.json": '{ "name": "invoicer", "version": "0.1.0", "private": true, "scripts": { "test": "node --test" } }\n',
        "src/invoice.js": "function total(lines) {\n  return lines.reduce((sum, line) => sum + line.cents, 0);\n}\n\nmodule.exports = { total };\n",
        "README.md": "# invoicer\n\nFacturación del taller.\n"}

MEMORY = {
    "MEMORY.md": "- [Política de modelos](model-policy.md) — implementadores en Sonnet, Opus solo para revisar la spec\n"
                 "- [Comando de tests](test-command.md) — la suite se lanza con npm test\n"
                 "- [Ventana de despliegue](deploy-window.md) — solo martes y jueves por la tarde\n",
    "model-policy.md": "Los implementadores van en Sonnet; Opus solo para revisar la spec.\n",
    "test-command.md": "La suite se lanza con `npm test`.\n",
    "deploy-window.md": "Los despliegues solo se hacen martes y jueves por la tarde: el cliente congela su entorno el resto de la semana.\n",
}


def write(root, files):
    for rel, content in files.items():
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8", newline="\n")


def greenfield(name, settings=None):
    root = BASE / name
    write(root, {f".docs/sdd/{k}": v for k, v in ANCHORS.items()})
    if settings is not None:
        write(root, {".claude/settings.json": json.dumps(settings) + "\n"})


def brownfield():
    root = BASE / "g2-bf"
    write(root, CODE)
    write(root, {f"approved/{k}": v for k, v in ANCHORS.items()})
    write(root, {".gitignore": "node_modules/\n",
                 ".claude/settings.json": json.dumps({"permissions": {"allow": ["Bash(npm test)"]}}) + "\n"})


def migration():
    root = BASE / "g4-mig"
    kit = {"version": "1.1.0", "channel": "plugin", "updated": "2026-09-10", "ids": {"mode": "sequence"},
           "control": {"profile": "delegate", "maxParallelAgents": 3,
                       "silence": {"betweenStepsMinutes": 8, "longCommandMinutes": 20}},
           "merge": {"into": "develop", "noFf": True, "removeWorktree": False}}
    anchors = dict(ANCHORS, **{"tech-stack.md": TECH_STACK_WITH_MEMORY})
    write(root, CODE)
    write(root, {f".docs/sdd/{k}": v for k, v in anchors.items()})
    write(root, {".docs/sdd/sdd-kit.json": json.dumps(kit) + "\n", ".gitignore": "node_modules/\n"})
    write(root, {f"memory/{k}": v for k, v in MEMORY.items()})


def release():
    root = BASE / "g6-rel"
    template = (pathlib.Path(__file__).parents[5] / "skills/sdd-templates/templates/roadmap-template.md").read_text(encoding="utf-8")
    roadmap = template.replace("<proyecto>", "invoicer")
    kit = {"version": "1.2.0", "channel": "plugin", "updated": "2026-09-22", "ids": {"mode": "sequence"},
           "release": {"hasRecipient": False}, "control": {"profile": "delegate"}}
    write(root, CODE)
    write(root, {f".docs/sdd/{k}": v for k, v in dict(ANCHORS, **{"roadmap.md": roadmap}).items()})
    write(root, {".docs/sdd/sdd-kit.json": json.dumps(kit) + "\n"})


def main():
    shutil.rmtree(BASE, ignore_errors=True)
    greenfield("g1-gf")
    brownfield()
    greenfield("g3-true", {"autoMemoryEnabled": True})
    migration()
    write(BASE / "g5-q21", {"README.md": "# invoicer\n"})
    release()
    print(sorted(p.name for p in BASE.iterdir()))


if __name__ == "__main__":
    main()
