BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:MigrationsDir = Join-Path $script:RepoRoot 'skills/sdd-init-brownfield/references/migrations'

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-LinkedMarkdown([System.IO.FileInfo]$File) {
    $links = [regex]::Matches((Get-Content $File.FullName -Raw), '\]\((?!https?:)([^)#]+\.md)')
    foreach ($link in $links) {
      $target = Join-Path $File.DirectoryName $link.Groups[1].Value
      if (Test-Path $target) { Get-Item $target }
    }
  }

  function Get-InitCorpus([string]$SkillName) {
    $skillDir = Join-Path $script:RepoRoot "skills/$SkillName"
    $own = @(Get-Item (Join-Path $skillDir 'SKILL.md')) +
      @(Get-ChildItem (Join-Path $skillDir 'references') -Filter *.md -File -ErrorAction SilentlyContinue)
    $files = $own + @($own | ForEach-Object { Get-LinkedMarkdown $_ })
    $readable = $files | Where-Object { $_.FullName -notmatch 'references[\\/]migrations[\\/]' } | Sort-Object FullName -Unique
    return ($readable | ForEach-Object { Get-Content $_.FullName -Raw }) -join "`n"
  }

  function Get-DeclaredTokens([string]$MigrationText) {
    $line = ($MigrationText -split "`r?`n") | Where-Object { $_ -match '^\*\*Escribe\*\*:' } | Select-Object -First 1
    if (-not $line) { return @() }
    return [regex]::Matches($line, '`([^`]+)`') | ForEach-Object { $_.Groups[1].Value }
  }

  $script:Migrations = Get-ChildItem $script:MigrationsDir -Filter 'v*.md' |
    Where-Object { (Get-Content $_.FullName -Raw) -match 'sdd-kit\.json' }
}

Describe 'Paridad migración–init' {
  It 'hay migraciones que escriben sdd-kit.json' {
    $script:Migrations.Count | Should -BeGreaterOrEqual 3
  }

  It '<_> declara lo que escribe en su línea **Escribe**' -ForEach @('v1.0.0.md', 'v1.1.0.md', 'v1.2.0.md') {
    Get-DeclaredTokens (Get-Content (Join-Path $script:MigrationsDir $_) -Raw) | Should -Not -BeNullOrEmpty
  }

  It 'cada token declarado por una migración aparece en <_>' -ForEach @('sdd-init-greenfield', 'sdd-init-brownfield') {
    $corpus = Get-InitCorpus $_
    $missing = foreach ($migration in $script:Migrations) {
      foreach ($token in Get-DeclaredTokens (Get-Content $migration.FullName -Raw)) {
        if (-not $corpus.Contains($token)) { "$($migration.Name): $token" }
      }
    }
    $missing | Should -BeNullOrEmpty
  }

  It 'el corpus de una init no incluye las migraciones' {
    (Get-InitCorpus 'sdd-init-brownfield').Contains('**Escribe**:') | Should -BeFalse
  }

  It 'una clave inventada no aparece en el corpus' {
    (Get-InitCorpus 'sdd-init-greenfield').Contains('control.inventedKey') | Should -BeFalse
  }

  It 'el README de migraciones fija la regla de la línea **Escribe**' {
    Get-KitFile 'skills/sdd-init-brownfield/references/migrations/README.md' | Should -Match '\*\*Escribe\*\*'
  }
}

Describe 'Configuración y log que deja la init' {
  It '<_> deja autoMemoryEnabled a false, los temporales ignorados y el log del script' -ForEach @('sdd-init-greenfield', 'sdd-init-brownfield') {
    $corpus = Get-InitCorpus $_
    foreach ($literal in '"autoMemoryEnabled": false', '.claude/settings.json', '.playwright-mcp/', '.superpowers/', 'Build-EstimationLog.ps1') {
      $corpus.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It '<_> pregunta antes de cambiar autoMemoryEnabled a true' -ForEach @('sdd-init-greenfield', 'sdd-init-brownfield') {
    (Get-InitCorpus $_).Contains('"autoMemoryEnabled": true') | Should -BeTrue
  }

  It 'la red flag de greenfield habla de filas, no de contenido' {
    $skill = Get-KitFile 'skills/sdd-init-greenfield/SKILL.md'
    $skill | Should -Not -Match 'El estimation-log nace con contenido'
    $skill | Should -Match 'estimation-log nace con filas'
  }

  It 'la migración a v1.2.0 ordena ids, control, configuración, memoria, la retirada de sdd-start-release y marcador' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    $steps = [regex]::Matches($migration, '(?m)^\d\. \*\*([^*]+)\*\*') | ForEach-Object { $_.Groups[1].Value.TrimEnd('.') }
    $steps | Should -Be @('Modo de numeración', 'Claves de control', 'Configuración del proyecto', 'Memoria automática', '`sdd-start-release` retirada', 'Marcador')
  }

  It 'el paso de memoria nombra la carpeta, el índice y el gate de borrado' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    foreach ($literal in '~/.claude/projects/<project>/memory/', 'autoMemoryDirectory', 'MEMORY.md', 'pendiente explícito', 'la tabla va igual en el informe') {
      $migration.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It 'el README cita autoMemoryEnabled' {
    Get-KitFile 'README.md' | Should -Match 'autoMemoryEnabled'
  }
}

Describe 'Proyecto de referencia' {
  It 'la constitution lo lleva en Convenciones' {
    Get-KitFile 'skills/sdd-templates/templates/constitution-template.md' |
      Should -Match '(?s)## Convenciones.*\*\*Proyecto de referencia\*\*.*## Reglas de producto'
  }

  It 'greenfield lo pregunta como pregunta 18' {
    Get-KitFile 'skills/sdd-init-greenfield/SKILL.md' | Should -Match '(?m)^\s*\| 18 \|.*proyecto de referencia'
  }

  It 'brownfield lo pregunta como pregunta 4' {
    Get-KitFile 'skills/sdd-init-brownfield/SKILL.md' | Should -Match '(?m)^\s*\| 4 \|.*proyecto de referencia'
  }
}

Describe 'Tabla de release con Ficheros que toca' {
  It 'la plantilla del roadmap fija la cabecera de la tabla de release' {
    Get-KitFile 'skills/sdd-templates/templates/roadmap-template.md' |
      Should -Match ([regex]::Escape('| id | Feature | Origen | Ficheros que toca | Estado |'))
  }

  It 'sdd-roadmap escribe la sección con esa tabla' {
    Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match 'Ficheros que toca'
  }

  It 'sdd-roadmap no deja la celda de ficheros por definir' {
    Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match 'nunca «por definir»'
  }
}

Describe 'Migración a v2.0.0 — nombres de las skills de feature' {
  BeforeAll { $script:V2 = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v2.0.0.md' }

  It 'tiene un paso que sustituye los nombres viejos por sdd-start-feature y sdd-end-feature' {
    $script:V2 | Should -Match '(?s)sdd-start-task.{0,200}sdd-start-feature'
    $script:V2 | Should -Match '(?s)sdd-end-task.{0,200}sdd-end-feature'
  }

  It 'el paso nombra CLAUDE.md, AGENTS.md y capabilities/ y excluye el histórico' {
    foreach ($literal in @('CLAUDE.md', 'AGENTS.md', 'capabilities/', 'specs/', 'changelog.md', 'client-changelog.md', 'roadmap.md')) {
      $script:V2 | Should -Match ([regex]::Escape($literal))
    }
    $script:V2 | Should -Match 'no se renombra'
  }

  It 'la verificación lleva el Select-String con AGENTS.md y el histórico excluido' {
    $script:V2 | Should -Match ([regex]::Escape("Select-String -Path CLAUDE.md, AGENTS.md, .docs/sdd/*.md, .docs/sdd/capabilities/*.md -Exclude changelog.md, client-changelog.md, roadmap.md -Pattern 'sdd-(start|end)-task'"))
  }
}