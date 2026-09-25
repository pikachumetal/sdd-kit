BeforeAll {
  $script:KitRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

  function Get-KitFile([string]$RelativePath) {
    $path = Join-Path $script:KitRoot $RelativePath
    if (-not (Test-Path $path)) { return '' }
    return Get-Content $path -Raw
  }

  function Get-Template([string]$Name) {
    return Get-KitFile "skills/sdd-templates/templates/$Name-template.md"
  }
}

Describe 'Renombrado task → feature' {
  Context 'plantillas' {
    It '<_>-template.md escribe feature en el frontmatter' -ForEach @('spec', 'plan', 'walkthrough') {
      $template = Get-Template $_
      $template | Should -Match '(?m)^feature: <id>'
      $template | Should -Match '(?m)^id: <yyyyMMdd-HHmmss>-feature-<id>-<slug>'
      $template | Should -Not -Match '(?m)^task:'
    }

    It 'patch-template.md conserva el campo task' {
      Get-Template 'patch' | Should -Match '(?m)^task: <id>'
    }

    It 'kit-feedback-template.md nombra el carril feature y conserva el campo task' {
      $template = Get-Template 'kit-feedback'
      $template | Should -Match ([regex]::Escape('<yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>'))
      $template | Should -Match '(?m)^lane: <feature\|patch>'
      $template | Should -Match '(?m)^task: <id>'
    }

    It 'tasks-template.md conserva la cabecera de las tasks del plan' {
      Get-Template 'tasks' | Should -Match ([regex]::Escape('| # | Task | Status | Commit | Notas |'))
    }

    It 'roadmap-template.md titula Feature la columna de la release' {
      Get-Template 'roadmap' | Should -Match ([regex]::Escape('| id | Feature | Origen | Ficheros que toca | Estado |'))
    }

    It 'nombrado.md escribe feature y lee task como legado' {
      $naming = (Get-KitFile 'skills/sdd-start-task/references/nombrado.md') + (Get-KitFile 'skills/sdd-start-feature/references/nombrado.md')
      $naming | Should -Match ([regex]::Escape('<yyyyMMdd-HHmmss>-(feature|patch|proposal)-<id>-<slug>'))
      $naming | Should -Match '(?s)-task-.{0,80}legado'
    }
  }

  Context 'skills' {
    It '<_> existe y su name es el de la carpeta' -ForEach @('sdd-start-feature', 'sdd-end-feature') {
      Get-KitFile "skills/$_/SKILL.md" | Should -Match "(?m)^name: $_\s*$"
    }

    It 'la carpeta <_> ya no existe' -ForEach @('sdd-start-task', 'sdd-end-task') {
      Test-Path (Join-Path $script:KitRoot "skills/$_") | Should -BeFalse
    }

    It 'la description de sdd-end-feature conserva «cierra la tarea»' {
      Get-KitFile 'skills/sdd-end-feature/SKILL.md' | Should -Match '(?m)^description:.*cierra la tarea'
    }

    It 'la description de sdd-start-feature conserva «tarea» y nombra la feature' {
      $description = [regex]::Match((Get-KitFile 'skills/sdd-start-feature/SKILL.md'), '(?m)^description:.*$').Value
      $description | Should -Match 'tarea'
      $description | Should -Match 'feature'
    }

    It 'el router entra por sdd-start-feature' {
      $router = Get-KitFile 'hooks/router.md'
      $router | Should -Match ([regex]::Escape('sdd-kit:sdd-start-feature'))
      $router | Should -Not -Match 'sdd-(start|end)-task'
    }

    It 'ninguna skill ni referencia fuera de migrations/ nombra las skills viejas' {
      $files = Get-ChildItem (Join-Path $script:KitRoot 'skills') -Recurse -Filter '*.md' | Where-Object { $_.FullName -notmatch '[\\/]migrations[\\/]' }
      $hits = $files | Where-Object { Select-String -LiteralPath $_.FullName -Pattern 'sdd-(start|end)-task' -Quiet } | ForEach-Object { $_.FullName }
      $hits | Should -BeNullOrEmpty
    }
  }
}
