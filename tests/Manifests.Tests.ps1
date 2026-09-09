BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:ClaudeCli = Get-Command claude -ErrorAction SilentlyContinue

  function Invoke-PluginValidate([string]$Target, [switch]$Strict) {
    $arguments = @('plugin', 'validate', (Join-Path $script:KitRoot $Target), '--json')
    if ($Strict) { $arguments += '--strict' }
    $output = & $script:ClaudeCli.Source @arguments 2>&1 | Out-String
    return ($output | ConvertFrom-Json)
  }
}

Describe 'claude plugin validate' {
  BeforeAll {
    if (-not $script:ClaudeCli) { Set-ItResult -Skipped -Because 'claude no está en PATH' }
  }

  It 'acepta la carpeta skills/ en modo strict' {
    (Invoke-PluginValidate 'skills' -Strict).success | Should -BeTrue
  }

  It 'acepta marketplace.json en modo strict' {
    (Invoke-PluginValidate '.claude-plugin/marketplace.json' -Strict).success | Should -BeTrue
  }

  It 'acepta plugin.json (sin strict: el aviso por CLAUDE.md en la raíz es inherente al repo)' {
    (Invoke-PluginValidate '.claude-plugin/plugin.json').success | Should -BeTrue
  }
}
