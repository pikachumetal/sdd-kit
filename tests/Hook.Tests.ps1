BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:HooksDir = Join-Path $script:KitRoot 'hooks'
}

Describe 'hooks/hooks.json' {
  BeforeAll {
    $script:Config = Get-Content (Join-Path $script:HooksDir 'hooks.json') -Raw | ConvertFrom-Json
    $script:Command = $script:Config.hooks.SessionStart[0].hooks[0].command
  }

  It 'declara un hook SessionStart que ejecuta la CLI en forma exec' {
    $hook = $script:Config.hooks.SessionStart[0].hooks[0]
    $hook.command | Should -Be 'node'
    $hook.args | Should -Be @('${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js', 'hook', 'session-start')
  }

  It 'no declara shell' {
    $script:Config.hooks.SessionStart[0].hooks[0].PSObject.Properties.Name | Should -Not -Contain 'shell'
  }
}

Describe '.githooks/pre-merge-commit' {
  BeforeAll {
    $script:MergeHook = Join-Path $script:KitRoot '.githooks/pre-merge-commit'
  }

  It 'existe, porque git no ejecuta pre-commit en un merge sin conflictos' {
    $script:MergeHook | Should -Exist
  }

  It 'es ejecutable en git' {
    if (-not (git -C $script:KitRoot rev-parse --git-dir 2>$null)) { Set-ItResult -Skipped -Because 'la raíz del kit no es un repositorio git'; return }
    $entry = git -C $script:KitRoot ls-files -s .githooks/pre-merge-commit 2>$null
    $entry | Should -Match '^100755 '
  }

  It 'delega en pre-commit en vez de duplicar la suite' {
    $content = Get-Content $script:MergeHook -Raw
    $content | Should -Match 'pre-commit'
    $content | Should -Not -Match 'Invoke-Pester'
  }
}