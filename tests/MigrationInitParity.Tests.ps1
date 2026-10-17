BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }
  $script:MigrationsDir = Join-Path $script:RepoRoot 'skills/sdd-init/references/migrations'

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
    $cli = @(Get-ChildItem (Join-Path $script:RepoRoot 'cli/src/init') -Filter *.ts -File -ErrorAction SilentlyContinue)
    $files = $own + @($own | ForEach-Object { Get-LinkedMarkdown $_ }) + $cli
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

  It '<_> declara lo que escribe en su línea **Escribe**' -ForEach @('v1.0.0.md', 'v1.1.0.md', 'v2.0.0.md') {
    Get-DeclaredTokens (Get-Content (Join-Path $script:MigrationsDir $_) -Raw) | Should -Not -BeNullOrEmpty
  }

  It 'cada token declarado por una migración aparece en <_>' -ForEach @('sdd-init') {
    $corpus = Get-InitCorpus $_
    $missing = foreach ($migration in $script:Migrations) {
      foreach ($token in Get-DeclaredTokens (Get-Content $migration.FullName -Raw)) {
        if (-not $corpus.Contains($token)) { "$($migration.Name): $token" }
      }
    }
    $missing | Should -BeNullOrEmpty
  }

  It 'el corpus de una init no incluye las migraciones' {
    (Get-InitCorpus 'sdd-init').Contains('**Escribe**:') | Should -BeFalse
  }

  It 'una clave inventada no aparece en el corpus' {
    (Get-InitCorpus 'sdd-init').Contains('control.inventedKey') | Should -BeFalse
  }

  It 'el README de migraciones fija la regla de la línea **Escribe**' {
    Get-KitFile 'skills/sdd-init/references/migrations/README.md' | Should -Match '\*\*Escribe\*\*'
  }
}

Describe 'Configuración y log que deja la init' {
  It '<_> deja autoMemoryEnabled a false, los temporales ignorados y el log del script' -ForEach @('sdd-init') {
    $corpus = Get-InitCorpus $_
    foreach ($literal in 'autoMemoryEnabled: false', '.claude/settings.json', '.playwright-mcp/', '.superpowers/', 'sdd estimation log') {
      $corpus.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It '<_> pregunta antes de cambiar autoMemoryEnabled a true' -ForEach @('sdd-init') {
    (Get-InitCorpus $_).Contains('autoMemoryEnabled: se deja true; pregunta al usuario si lo cambia') | Should -BeTrue
  }

  It 'la red flag de sdd-init habla de filas, no de contenido' {
    Get-KitFile 'skills/sdd-init/SKILL.md' | Should -Match 'estimation log is born with rows'
  }

  It 'la migración a v2.0.0 ordena ids, control, configuración, memoria, la retirada de sdd-start-release, capacidades, nombres de feature, marketplace y marcador' {
    $migration = Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md'
    $steps = [regex]::Matches($migration, '(?m)^\d+\. \*\*([^*]+)\*\*') | ForEach-Object { $_.Groups[1].Value.TrimEnd('.') }
    $steps | Should -Be @('Modo de numeración', 'Claves de control', 'Configuración del proyecto', 'Memoria automática', '`sdd-start-release` retirada', 'Historial de las capacidades', 'Propósito de las capacidades', 'Nombres de las skills de feature', 'Marketplace de superpowers', 'Marcador')
  }

  It 'el paso de memoria nombra la carpeta, el índice y el gate de borrado' {
    $migration = Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md'
    foreach ($literal in '~/.claude/projects/<project>/memory/', 'autoMemoryDirectory', 'MEMORY.md', 'pendiente explícito', 'la tabla va igual en el informe') {
      $migration.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It 'el README cita autoMemoryEnabled' {
    Get-KitFile 'README.md' | Should -Match 'autoMemoryEnabled'
  }

  It '<_> declara el marketplace de superpowers en el proyecto y lo añade si falta' -ForEach @('sdd-init') {
    $corpus = Get-InitCorpus $_
    foreach ($literal in 'extraKnownMarketplaces.superpowers-marketplace', 'claude plugin marketplace add obra/superpowers-marketplace') {
      $corpus.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It 'el README añade el marketplace de superpowers antes de instalar el kit' {
    Get-KitFile 'README.md' | Should -Match '(?s)/plugin marketplace add obra/superpowers-marketplace\s*\r?\n/plugin marketplace add pikachumetal/sdd-kit'
  }

  It 'el README instala superpowers a mano desde superpowers-marketplace' {
    $readme = Get-KitFile 'README.md'
    $readme | Should -Match ([regex]::Escape('claude plugin install superpowers@superpowers-marketplace'))
    $readme | Should -Not -Match 'plugin install superpowers@claude-plugins-official'
  }
}

Describe 'Proyecto de referencia' {
  It 'la constitution lo lleva en Convenciones' {
    Get-KitFile 'skills/sdd-templates/templates/constitution-template.md' |
      Should -Match '(?s)## Convenciones.*\*\*Proyecto de referencia\*\*.*## Reglas de producto'
  }

  It 'sdd-init lo pregunta y lo lleva a Convenciones' {
    Get-KitFile 'skills/sdd-init/SKILL.md' | Should -Match "(?m)^\s*\| Does it replicate another project's patterns\?.*«Convenciones» \|\r?$"
  }
}

Describe 'Entrevista: PRODUCT.md completo' {
  It 'pregunta lo que queda fuera de alcance y los términos del dominio, y van a PRODUCT.md' {
    Get-KitFile 'skills/sdd-init/SKILL.md' |
      Should -Match '(?m)^\s*\| Problem it solves; users and roles; modules; what is out of scope; domain terms to fix \|.*\| `PRODUCT\.md`'
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
    Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match 'never «por definir»'
  }
}

Describe 'Migración a v2.0.0 — nombres de las skills de feature' {
  BeforeAll { $script:V2 = Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md' }

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

  It 'tiene un paso que declara el marketplace de superpowers y lo añade si falta' {
    $script:V2 | Should -Match '(?m)^\d\. \*\*Marketplace de superpowers\.\*\*'
    foreach ($literal in 'extraKnownMarketplaces.superpowers-marketplace', 'claude plugin marketplace list', 'claude plugin marketplace add obra/superpowers-marketplace') {
      $script:V2 | Should -Match ([regex]::Escape($literal))
    }
  }

  It 'la verificación lleva el Select-String con AGENTS.md y el histórico excluido' {
    $script:V2 | Should -Match ([regex]::Escape("Select-String -Path CLAUDE.md, AGENTS.md, .docs/sdd/*.md, .docs/sdd/capabilities/*.md -Exclude changelog.md, client-changelog.md, roadmap.md -Pattern 'sdd-(start|end)-task'"))
  }
}

Describe 'Cada versión del kit tiene su migración' {
  It 'la versión de plugin.json tiene su fichero en migrations/' {
    $version = (Get-KitFile '.claude-plugin/plugin.json' | ConvertFrom-Json).version
    Join-Path $script:MigrationsDir "v$version.md" | Should -Exist
  }
}

Describe 'Migración a v2.3.0 — roadmap' {
  BeforeAll { $script:V23 = Get-KitFile 'skills/sdd-init/references/migrations/v2.3.0.md' }

  It 'declara roadmap.md en su línea **Escribe**' {
    Get-DeclaredTokens $script:V23 | Should -Contain 'roadmap.md'
  }

  It 'el paso del roadmap nombra el validador, el gate, el sha y el pendiente' {
    foreach ($literal in 'sdd roadmap check', '**gate**', 'git show', 'pendiente explícito', 'Roadmap válido') {
      $script:V23.Contains($literal) | Should -BeTrue -Because "falta $literal"
    }
  }

  It 'ordena el roadmap y quién valida antes del marcador' {
    $steps = [regex]::Matches($script:V23, '(?m)^\d+\. \*\*([^*]+)\*\*') | ForEach-Object { $_.Groups[1].Value.TrimEnd('.') }
    $steps | Should -Be @('Roadmap en la forma de la plantilla', 'Quién valida', 'Marcador')
  }
}
