BeforeDiscovery {
  $script:HasClaudeCli = [bool](Get-Command claude -ErrorAction SilentlyContinue)
}

BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  function Invoke-PluginValidate([string]$Target, [switch]$Strict) {
    $arguments = @('plugin', 'validate', (Join-Path $script:KitRoot $Target), '--json')
    if ($Strict) { $arguments += '--strict' }
    $stdout = & (Get-Command claude).Source @arguments 2>$null | Out-String
    try { return ($stdout | ConvertFrom-Json) }
    catch { throw "claude plugin validate no devolvió JSON para '$Target':`n$stdout" }
  }
}

Describe 'claude plugin validate' -Skip:(-not $script:HasClaudeCli) {
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
