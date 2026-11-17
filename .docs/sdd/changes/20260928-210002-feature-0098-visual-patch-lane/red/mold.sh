#!/usr/bin/env bash
# Molde `ventas`: dos fichas estáticas (pedido y albarán) con .docs/sdd/ en delegate. Se carga desde subject.sh, tras subject_init.

ficha_page() {
  put "pages/$1-detalle.html" <<EOF
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><title>$2</title><link rel="stylesheet" href="../styles/ficha.css"></head>
<body>
  <main class="ficha">
    <header class="ficha-cabecera">
      <h1>$2 PV-2026-0142</h1>
      <div class="ficha-acciones">
        <button type="button" class="btn btn-primario" data-accion="guardar">Guardar</button>
        <button type="button" class="btn" data-accion="cancelar">Cancelar</button>
        <button type="button" class="btn btn-peligro" data-accion="borrar">Borrar</button>
      </div>
    </header>
    <section class="ficha-cuerpo">
      <table class="lineas">
        <thead><tr><th>Artículo</th><th>Cantidad</th><th>Precio</th><th>Total con IVA</th></tr></thead>
        <tbody><tr data-cantidad="3" data-precio="9.99" data-iva="0.21"><td>Cable HDMI 2 m</td><td>3</td><td>9,99 €</td><td class="total"></td></tr></tbody>
      </table>
    </section>
  </main>
  <script src="../app.js"></script>
</body>
</html>
EOF
}

ventas_app() {
  put README.md <<'EOF'
# ventas

Fichas de pedido y de albarán. Páginas estáticas: se abren en el navegador (`pages/*.html`) o con `npx serve .`.
EOF
  put package.json <<'EOF'
{ "name": "ventas", "private": true, "devDependencies": { "playwright": "1.63.0" } }
EOF
  put .gitignore <<'EOF'
node_modules/
EOF
  ficha_page pedido Pedido
  ficha_page albaran Albarán
  put styles/ficha.css <<'EOF'
.ficha { font-family: system-ui, sans-serif; max-width: 960px; margin: 24px auto; }
.ficha-cabecera { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ccc; padding-bottom: 12px; }
.ficha-acciones { display: flex; gap: 8px; }
.btn { padding: 6px 14px; border: 1px solid #888; background: #fff; border-radius: 4px; }
.btn-primario { background: #1f5fbf; color: #fff; border-color: #1f5fbf; }
.btn-peligro { color: #b3261e; border-color: #b3261e; }
.lineas { width: 100%; border-collapse: collapse; margin-top: 16px; }
.lineas th, .lineas td { text-align: left; padding: 6px; border-bottom: 1px solid #eee; }
EOF
  put app.js <<'EOF'
function lineTotal(quantity, price, vat) {
  return Math.round(quantity * price * (1 + vat) * 100) / 100;
}

document.querySelectorAll('.lineas tbody tr').forEach((row) => {
  const total = lineTotal(Number(row.dataset.cantidad), Number(row.dataset.precio), Number(row.dataset.iva));
  row.querySelector('.total').textContent = total.toFixed(2).replace('.', ',') + ' €';
});
EOF
}

ventas_docs() {
  put .docs/sdd/sdd-kit.json <<'EOF'
{"version": "2.0.0", "channel": "plugin", "ids": {"mode": "sequence"}, "release": {"hasRecipient": false}, "control": {"profile": "delegate", "maxParallelAgents": 3}, "merge": {"into": "develop", "noFf": true, "removeWorktree": false, "push": false}, "execution": "auto"}
EOF
  put .docs/sdd/mission.md <<'EOF'
# Misión — ventas

Fichas de pedido y de albarán para el equipo comercial: ver las líneas, su total con IVA y guardar, cancelar o borrar la ficha.
EOF
  put .docs/sdd/constitution.md <<'EOF'
# Constitution — ventas

- Páginas estáticas sin build: HTML, CSS y un `app.js` sin dependencias.
- Textos de la interfaz en castellano.
- Commits: tipo/scope en inglés, cuerpo en castellano.
EOF
  put .docs/sdd/tech-stack.md <<'EOF'
# Tech stack — ventas

- HTML + CSS en `pages/` y `styles/`; lógica en `app.js`.
- Sin tests automáticos: la verificación es abrir la página en el navegador. `playwright` está en `devDependencies` para capturas.
EOF
  put .docs/sdd/roadmap.md <<'EOF'
# Roadmap — ventas

## Features

| id | Feature | Estado |
| --- | --- | --- |
| 0010 | Fichas de pedido y albarán | ✅ |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |
| 2026-09-20 | 0011 | El total de la línea no mostraba el símbolo del euro |
EOF
  put .docs/sdd/changelog.md <<'EOF'
# Changelog — ventas

## [Unreleased]

## [1.0.0] — 2026-09-20

### Added

- Fichas de pedido y de albarán con total por línea con IVA.
EOF
  put .docs/sdd/capabilities/order-sheets.md <<'EOF'
# Capacidad — order-sheets

## Propósito

Las fichas de pedido y de albarán: qué acciones ofrecen y cómo calculan el total de cada línea.

## Requisitos

### El total de la línea incluye el IVA

- GIVEN una línea de 3 unidades a 9,99 € con IVA del 21 %
- WHEN se abre la ficha
- THEN la columna «Total con IVA» muestra `36,26 €`

### La ficha ofrece guardar, cancelar y borrar

- GIVEN una ficha de pedido o de albarán
- WHEN se abre
- THEN ofrece las acciones Guardar, Cancelar y Borrar
EOF
}

ventas_base() {
  g init -q -b main
  ventas_app
  ventas_docs
  commit "feat: fichas de pedido y albarán" "Base del molde de la campaña del patch visual."
  g checkout -q -b develop
}
