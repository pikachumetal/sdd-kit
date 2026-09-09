BeforeDiscovery {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:SkillFolders = @(Get-ChildItem (Join-Path $script:KitRoot 'skills') -Directory | ForEach-Object { $_.Name })
}

BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:SkillsRoot = Join-Path $script:KitRoot 'skills'

  function Get-SkillFile([string]$Skill) { Join-Path $script:SkillsRoot "$Skill/SKILL.md" }

  function Get-Frontmatter([string]$Content) {
    $fields = @{}
    if ($Content -notmatch '(?s)\A---\r?\n(.*?)\r?\n---') { return $fields }
    foreach ($line in ($Matches[1] -split '\r?\n')) {
      if ($line -match '^([A-Za-z_-]+):\s*(.*)$') { $fields[$Matches[1]] = $Matches[2].Trim() }
    }
    return $fields
  }

  function Get-RelativeLinks([string]$Content) {
    return @([regex]::Matches($Content, '\]\(((?:references|templates|scripts)/[^)#]+)\)') | ForEach-Object { $_.Groups[1].Value })
  }

  function Get-SuperpowersSkillsCited([string]$Path) {
    $cited = Get-ChildItem $Path -Recurse -Filter '*.md' | ForEach-Object {
      [regex]::Matches((Get-Content $_.FullName -Raw), 'superpowers:([a-z-]+)') | ForEach-Object { $_.Groups[1].Value }
    }
    return @($cited | Sort-Object -Unique)
  }
}

Describe 'Carpeta skills/' {
  It 'contiene al menos una skill' {
    (Get-ChildItem $script:SkillsRoot -Directory).Count | Should -BeGreaterThan 0
  }
}

Describe 'Skill <_>' -ForEach $script:SkillFolders {
  BeforeAll {
    $script:Skill = $_
    $script:Content = Get-Content (Get-SkillFile $script:Skill) -Raw
    $script:Frontmatter = Get-Frontmatter $script:Content
  }

  It 'tiene frontmatter con name igual a la carpeta' {
    $script:Frontmatter['name'] | Should -Be $script:Skill
  }

  It 'tiene name en kebab-case' {
    $script:Skill | Should -Match '^[a-z0-9]+(-[a-z0-9]+)*$'
  }

  It 'tiene description que dice cuándo usarla (empieza por «Usar»)' {
    $script:Frontmatter['description'] | Should -Match '^Usar '
  }

  It 'tiene description de 1024 caracteres como máximo' {
    $script:Frontmatter['description'].Length | Should -BeLessOrEqual 1024
  }

  It 'tiene el H1 igual al nombre' {
    $script:Content | Should -Match "(?m)^# $([regex]::Escape($script:Skill))\s*$"
  }

  It 'tiene sección Overview' {
    $script:Content | Should -Match '(?m)^## Overview'
  }

  It 'no fuerza la carga de ficheros con @' {
    $script:Content | Should -Not -Match '@(references|templates|scripts|skills)/'
  }

  It 'enlaza solo a ficheros que existen' {
    $missing = Get-RelativeLinks $script:Content | Where-Object { -not (Test-Path (Join-Path $script:SkillsRoot "$script:Skill/$_")) }
    $missing | Should -BeNullOrEmpty
  }

  It 'enlaza todos sus references/ desde SKILL.md' {
    $referencesDir = Join-Path $script:SkillsRoot "$script:Skill/references"
    if (-not (Test-Path $referencesDir)) { Set-ItResult -Skipped -Because 'la skill no tiene references/' }
    $linked = Get-RelativeLinks $script:Content | ForEach-Object { $_ -replace '^references/', '' }
    $orphans = Get-ChildItem $referencesDir -Filter '*.md' | Where-Object { $_.Name -notin $linked } | ForEach-Object { $_.Name }
    $orphans | Should -BeNullOrEmpty
  }
}

Describe 'Índice de sdd-templates' {
  BeforeAll {
    $script:TemplatesDir = Join-Path $script:SkillsRoot 'sdd-templates/templates'
    $script:IndexContent = Get-Content (Get-SkillFile 'sdd-templates') -Raw
    $script:TemplateFiles = @(Get-ChildItem $script:TemplatesDir -Filter '*.md' | ForEach-Object { $_.Name })
    $script:IndexedTemplates = @([regex]::Matches($script:IndexContent, '\]\(templates/([^)]+)\)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
  }

  It 'lista cada plantilla de templates/ exactamente una vez' {
    $script:TemplateFiles.Count | Should -BeGreaterThan 0
    Compare-Object $script:TemplateFiles $script:IndexedTemplates | Should -BeNullOrEmpty
  }

  It 'coincide con el recuento de plantillas del README' {
    $readme = Get-Content (Join-Path $script:KitRoot 'README.md') -Raw
    $readme | Should -Match "Las (\d+) plantillas canónicas"
    [int]([regex]::Match($readme, 'Las (\d+) plantillas canónicas').Groups[1].Value) | Should -Be $script:TemplateFiles.Count
  }
}

Describe 'Skills de superpowers citadas' {
  BeforeAll {
    $readme = Get-Content (Join-Path $script:KitRoot 'README.md') -Raw
    $sentence = [regex]::Match($readme, 'invoca \*\*(\d+) skills de superpowers\*\*: (.*?)\. Lista verificable')
    $script:ReadmeCount = [int]$sentence.Groups[1].Value
    $script:ReadmeSkills = @([regex]::Matches($sentence.Groups[2].Value, '`([a-z-]+)`') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique)
    $script:CitedSkills = Get-SuperpowersSkillsCited $script:SkillsRoot
  }

  It 'el README declara la misma lista que citan las skills' {
    $script:CitedSkills.Count | Should -BeGreaterThan 0
    Compare-Object $script:ReadmeSkills $script:CitedSkills | Should -BeNullOrEmpty
  }

  It 'el README declara el número correcto' {
    $script:ReadmeCount | Should -Be $script:CitedSkills.Count
  }
}

Describe 'Manifests del plugin' {
  BeforeAll {
    $script:Plugin = Get-Content (Join-Path $script:KitRoot '.claude-plugin/plugin.json') -Raw | ConvertFrom-Json
    $script:Marketplace = Get-Content (Join-Path $script:KitRoot '.claude-plugin/marketplace.json') -Raw | ConvertFrom-Json
  }

  It 'plugin.json lleva versión SemVer' {
    $script:Plugin.version | Should -Match '^\d+\.\d+\.\d+$'
  }

  It 'plugin.json declara superpowers como dependencia' {
    @($script:Plugin.dependencies | Where-Object { $_.name -eq 'superpowers' }).Count | Should -Be 1
  }

  It 'marketplace.json publica el plugin desde la raíz del repo' {
    $entry = $script:Marketplace.plugins | Where-Object { $_.name -eq $script:Plugin.name }
    $entry.source | Should -Be '.'
  }

  It 'marketplace.json lleva description' {
    $script:Marketplace.description | Should -Not -BeNullOrEmpty
  }
}
