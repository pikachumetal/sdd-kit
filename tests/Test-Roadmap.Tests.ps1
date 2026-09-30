BeforeAll {
  $script:Validator = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Test-Roadmap.ps1'
  $script:Template = Join-Path $PSScriptRoot '../skills/sdd-templates/templates/roadmap-template.md'
  $script:BrokenFixture = Join-Path $PSScriptRoot 'fixtures/roadmap-structure/roadmap-0fc231e-parent.md'
  $script:Roots = [System.Collections.Generic.List[string]]::new()
  $script:ProseRule = 'fuera de «Releases cerradas» el roadmap solo lleva tablas'
  $script:ValidLines = @(
    '# Roadmap — salas'
    ''
    '## Próximo'
    ''
    '| # | Ítem | Estado |'
    '| --- | --- | --- |'
    '| 3 | Piloto en la oficina de Lugo | ⏳ |'
    ''
    '## Release 1.3'
    ''
    '| id | Feature | Origen | Ficheros que toca | Estado |'
    '| --- | --- | --- | --- | --- |'
    '| 0022 | **Festivos locales** | piloto de Lugo | `src/holidays.js` | ⏳ |'
    '| 0024 | **Recurrente mensual** — tras 0021 | dev-lead | `src/recurrence.js` | 🔄 |'
    ''
    '## Backlog'
    ''
    '| # | Ítem | Origen |'
    '| --- | --- | --- |'
    '| B1 | Reservar con un código QR | oficina de Vigo |'
    ''
    '## Deuda técnica'
    ''
    '| Ítem | Impacto | Destino |'
    '| --- | --- | --- |'
    '| **[Feature 0030, 2026-09-25: saldada — [walkthrough](specs/x/walkthrough.md)]** El correo no reintenta | medio | patch |'
    '| Los tests dependen de la fecha del sistema | medio | versión siguiente |'
    ''
    '## Patches'
    ''
    '| Fecha | Id | Descripción |'
    '| --- | --- | --- |'
    '| 2026-09-22 | 0023 | El aviso no salía en festivo — [patch](specs/y/patch.md) |'
    ''
    '## Releases cerradas'
    ''
    '### v1.2.0 — 2026-09-20'
    ''
    'Aviso por correo al liberar una sala (0021) y el patch 0020, con 3 oficinas. [Changelog](changelog.md).'
    ''
    'validaciones pendientes: 0021'
    ''
    'smoke: pendiente'
    ''
    '### v1.1.0 — 2026-09-05'
    ''
    'Recurrencia semanal (0019).'
  )

  function Get-ValidLines {
    $lines = [System.Collections.Generic.List[string]]::new()
    $lines.AddRange([string[]]$script:ValidLines)
    return , $lines
  }

  function New-SddFolder {
    $root = Join-Path ([System.IO.Path]::GetTempPath()) "roadmap-$([guid]::NewGuid().ToString('N'))"
    $script:Roots.Add($root)
    New-Item -ItemType Directory -Force -Path $root | Out-Null
    return $root
  }

  function New-Roadmap([string[]]$Lines, [string]$Eol = "`n") {
    $sdd = New-SddFolder
    [System.IO.File]::WriteAllText((Join-Path $sdd 'roadmap.md'), ($Lines -join $Eol) + $Eol, [System.Text.UTF8Encoding]::new($false))
    return $sdd
  }

  function Invoke-Roadmap([string]$Sdd) {
    $output = & $script:Validator -Path $Sdd
    return [pscustomobject]@{ Lines = @($output); Code = $LASTEXITCODE }
  }

  function Test-Lines([string[]]$Lines) {
    return Invoke-Roadmap (New-Roadmap $Lines)
  }
}

AfterAll {
  foreach ($root in $script:Roots) { Remove-Item -Recurse -Force $root -ErrorAction SilentlyContinue }
}

Describe 'Test-Roadmap.ps1: secciones' {
  It 'un roadmap válido pasa' {
    $result = Test-Lines (Get-ValidLines)
    $result.Lines | Should -Be @('Roadmap válido')
    $result.Code | Should -Be 0
  }

  It 'pasa sin sección de release y con dos releases seguidas' {
    $without = Get-ValidLines
    $without.RemoveRange(8, 7)
    (Test-Lines $without).Code | Should -Be 0

    $two = Get-ValidLines
    $two.InsertRange(15, [string[]]@('## Release 1.4', '', '| id | Feature | Origen | Ficheros que toca | Estado |', '| --- | --- | --- | --- | --- |', ''))
    (Test-Lines $two).Code | Should -Be 0
  }

  It 'rechaza una sección fuera de la plantilla' {
    $lines = Get-ValidLines
    $lines[8] = '## Versión siguiente'
    $lines.InsertRange(28, [string[]]@('## Decisiones tomadas', ''))
    $result = Test-Lines $lines
    $result.Lines | Should -Contain 'roadmap.md: línea 9: sección «Versión siguiente» fuera de la plantilla'
    $result.Lines | Should -Contain 'roadmap.md: línea 29: sección «Decisiones tomadas» fuera de la plantilla'
    $result.Code | Should -Be 1
  }

  It 'rechaza que falte una sección' {
    $lines = Get-ValidLines
    $lines.RemoveRange(28, 6)
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: falta la sección «Patches»')
    $result.Code | Should -Be 1
  }

  It 'rechaza el orden alterado' {
    $lines = Get-ValidLines
    $backlog = $lines.GetRange(15, 6)
    $lines.RemoveRange(15, 6)
    $lines.InsertRange(2, $backlog)
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 9: «Próximo» va antes que «Backlog»')
    $result.Code | Should -Be 1
  }

  It 'rechaza una release repetida' {
    $lines = Get-ValidLines
    $lines.InsertRange(15, [string[]]@('## Release 1.3', '', '| id | Feature | Origen | Ficheros que toca | Estado |', '| --- | --- | --- | --- | --- |', ''))
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 16: sección «Release 1.3» repetida')
    $result.Code | Should -Be 1
  }

  It 'rechaza una release sin versión: <_>' -ForEach @('Release próxima', 'Release') {
    $lines = Get-ValidLines
    $lines[8] = "## $_"
    $result = Test-Lines $lines
    $result.Lines | Should -Contain "roadmap.md: línea 9: «$_» no lleva versión: «## Release <versión>»"
    $result.Code | Should -Be 1
  }

  It 'rechaza una subsección fuera de Releases cerradas' {
    $lines = Get-ValidLines
    $lines.InsertRange(14, [string[]]@('', '### Validación diferida'))
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 16: subsección «Validación diferida» fuera de «Releases cerradas»')
    $result.Code | Should -Be 1
  }
}

Describe 'Test-Roadmap.ps1: prosa' {
  It 'rechaza la prosa fuera de Releases cerradas' {
    $lines = Get-ValidLines
    $lines.Insert(30, '> nota')
    $lines.Insert(16, 'Criterio de orden (dev-lead, 2026-09-21): primero lo que ven los usuarios')
    $result = Test-Lines $lines
    $result.Lines | Should -Be @(
      "roadmap.md: línea 17: prosa en «Backlog»; $script:ProseRule"
      "roadmap.md: línea 32: prosa en «Patches»; $script:ProseRule"
    )
    $result.Code | Should -Be 1
  }

  It 'admite una línea de estado en una release y rechaza la segunda' {
    $one = Get-ValidLines
    $one.InsertRange(10, [string[]]@('en preparación', ''))
    (Test-Lines $one).Code | Should -Be 0

    $two = Get-ValidLines
    $two.InsertRange(10, [string[]]@('en preparación', 'comprometida con el cliente', ''))
    $result = Test-Lines $two
    $result.Lines | Should -Be @("roadmap.md: línea 12: prosa en «Release 1.3»; $script:ProseRule")
    $result.Code | Should -Be 1
  }

  It 'rechaza una release cerrada cuyo título no es versión y fecha: <_>' -ForEach @('v1.2.0 - 2026-09-20', 'v1.2.0 — 20 de septiembre', 'Notas') {
    $lines = Get-ValidLines
    $lines[36] = "### $_"
    $result = Test-Lines $lines
    $result.Lines | Should -Contain "roadmap.md: línea 37: «$_» no es «### v<versión> — <AAAA-MM-DD>»"
    $result.Code | Should -Be 1
  }

  It 'no valida tablas bajo Releases cerradas' {
    $lines = Get-ValidLines
    $lines.InsertRange(40, [string[]]@('| Id | Qué | Disparador |', '| --- | --- | --- |', '| 0021 | Aviso | 🧪 al primer correo |', ''))
    (Test-Lines $lines).Code | Should -Be 0
  }
}

Describe 'Test-Roadmap.ps1: tablas' {
  It 'rechaza una cabecera de release distinta' {
    $lines = Get-ValidLines
    $lines[10] = '| id | Task | Tamaño | Estado |'
    $lines[11] = '| --- | --- | --- | --- |'
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 11: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»')
    $result.Code | Should -Be 1
  }

  It 'rechaza el estado «<_>»' -ForEach @('pendiente', '❌ descartado') {
    $lines = Get-ValidLines
    $lines[6] = "| 3 | Piloto en la oficina de Lugo | $_ |"
    $result = Test-Lines $lines
    $result.Lines | Should -Be @("roadmap.md: línea 7: estado «$_» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …")
    $result.Code | Should -Be 1
  }

  It 'admite el estado «<_>»' -ForEach @('✅ [walkthrough](x.md)', '⏸️ aparcada: descartada por el cliente, 2026-09-01', '🧪 validación diferida al primer correo real') {
    $lines = Get-ValidLines
    $lines[6] = "| 3 | Piloto en la oficina de Lugo | $_ |"
    (Test-Lines $lines).Code | Should -Be 0
  }

  It 'no cuenta la barra escapada como celda' {
    $lines = Get-ValidLines
    $lines[6] = '| 3 | Piloto en la oficina de Lugo | pendiente \| ⏳ |'
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 7: estado «pendiente \| ⏳» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …')
  }

  It 'conserva los mensajes de estructura' {
    $sdd = New-SddFolder
    Copy-Item -LiteralPath $script:BrokenFixture -Destination (Join-Path $sdd 'roadmap.md')
    $result = Invoke-Roadmap $sdd
    foreach ($expected in @(
        'línea 1: no empieza por «# Roadmap»'
        'línea 1: fila fuera de una tabla con cabecera y separador'
        'línea 2: fila fuera de una tabla con cabecera y separador'
        'línea 7: fila fuera de una tabla con cabecera y separador'
        'línea 8: la cabecera tiene 1 celdas y el separador 3'
        'línea 21: fila vacía'
        'línea 22: fila vacía'
      )) {
      $result.Lines | Should -Contain "roadmap.md: $expected"
    }
    $result.Code | Should -Be 1
  }
}

Describe 'Test-Roadmap.ps1: filas que salen en el corte' {
  It 'rechaza una fila saldada no posterior a la última release' {
    $lines = Get-ValidLines
    $lines[19] = '| B2 | **[Task 0012, 2026-09-20: saldada — [walkthrough](w.md)]** Exportar a CSV | contabilidad |'
    $lines[25] = '| **[Patch 0018, 2026-09-10: saldada — [patch](p.md)]** Bloqueo de SQLite | alto | patch |'
    $result = Test-Lines $lines
    $result.Lines | Should -Be @(
      'roadmap.md: línea 20: fila saldada el 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte'
      'roadmap.md: línea 26: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte'
    )
    $result.Code | Should -Be 1
  }

  It 'admite una fila parcial de cualquier fecha' {
    $lines = Get-ValidLines
    $lines[25] = '| **[Feature 0019, 2026-09-01: parcial — [walkthrough](w.md); queda: el borrado]** La recurrencia | bajo | patch |'
    (Test-Lines $lines).Code | Should -Be 0
  }

  It 'sin releases cerradas no rechaza ninguna fila saldada ni ningún patch' {
    $lines = Get-ValidLines
    $lines[25] = '| **[Patch 0018, 2026-09-10: saldada — [patch](p.md)]** Bloqueo de SQLite | alto | patch |'
    $lines[32] = '| 2026-09-10 | 0018 | Bloqueo de SQLite — [patch](p.md) |'
    $lines.RemoveRange(36, 11)
    (Test-Lines $lines).Code | Should -Be 0
  }

  It 'rechaza un patch no posterior a la última release' {
    $lines = Get-ValidLines
    $lines.Insert(33, '| 2026-09-20 | 0020 | 🧪 validación diferida a la primera reserva nocturna — La franja de las 23:30 — [patch](specs/z/patch.md) |')
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 34: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte')
    $result.Code | Should -Be 1
  }

  It 'rechaza la fila de una feature ya publicada' {
    $lines = Get-ValidLines
    $lines[12] = '| 0021 | **Aviso por correo** | oficina de Vigo | `src/mail.js` | 🧪 validación diferida al primer correo real |'
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 13: la 0021 ya está en la v1.2.0: su fila sale de «Release 1.3»')
    $result.Code | Should -Be 1
  }

  It 'reconoce un id de gestor publicado' {
    $lines = Get-ValidLines
    $lines[12] = '| AB-4512 | **Aviso por correo** | oficina de Vigo | `src/mail.js` | ✅ |'
    $lines[38] = 'Aviso por correo al liberar una sala (AB-4512).'
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('roadmap.md: línea 13: la AB-4512 ya está en la v1.2.0: su fila sale de «Release 1.3»')
  }

  It 'no confunde un número corto de «Próximo» con un id publicado' {
    (Test-Lines (Get-ValidLines)).Lines | Should -Not -Match 'la 3 ya está'
  }
}

Describe 'Test-Roadmap.ps1: entradas' {
  It 'da el mismo resultado con CRLF' {
    $result = Invoke-Roadmap (New-Roadmap (Get-ValidLines) "`r`n")
    $result.Lines | Should -Be @('Roadmap válido')
  }

  It 'sin roadmap sale con 0' {
    $result = Invoke-Roadmap (New-SddFolder)
    $result.Lines | Should -Be @('Sin roadmap que validar')
    $result.Code | Should -Be 0
  }

  It 'la plantilla sin sus bloques de ayuda pasa' {
    $lines = Get-Content -LiteralPath $script:Template -Encoding utf8 | Where-Object { $_ -notmatch '^>' }
    $result = Test-Lines $lines
    $result.Lines | Should -Be @('Roadmap válido')
  }

  It 'la plantilla sin tocar solo falla por su ayuda' {
    $result = Test-Lines (Get-Content -LiteralPath $script:Template -Encoding utf8)
    $result.Code | Should -Be 1
    $result.Lines | Where-Object { $_ -notmatch 'prosa en' } | Should -BeNullOrEmpty
  }

  It 'fija la salida en UTF-8 desde un pwsh hijo' -Tag 'Slow' {
    $sdd = New-Roadmap (Get-ValidLines)
    $previous = [Console]::OutputEncoding
    try {
      [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
      $output = pwsh -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::Latin1; & '$script:Validator' -Path '$sdd'"
    }
    finally { [Console]::OutputEncoding = $previous }
    $output | Should -Contain 'Roadmap válido'
  }
}
