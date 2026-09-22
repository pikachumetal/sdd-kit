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
