BeforeDiscovery {
  $gitCall = '^(?!\s*#).*\bgit\s+-C\b'
  $script:GitTestFiles = @(Get-ChildItem -Path $PSScriptRoot -Filter '*.Tests.ps1' |
    Where-Object { $_.FullName -ne $PSCommandPath } |
    Where-Object { Select-String -LiteralPath $_.FullName -Pattern $gitCall -Quiet } |
    ForEach-Object { @{ Name = $_.Name; Path = $_.FullName } })
}

Describe 'Entorno de git en los tests' {
  It 'encuentra al menos los cuatro tests que hoy ejecutan git' -ForEach @(@{ Names = @($script:GitTestFiles | ForEach-Object { $_.Name }) }) {
    foreach ($known in 'Get-NextSddId.Tests.ps1', 'Invoke-SddMerge.Tests.ps1', 'Hook.Tests.ps1', 'PathLength.Tests.ps1') {
      $Names | Should -Contain $known
    }
  }

  It '<Name> dot-sourcea Clear-GitEnv.ps1' -ForEach $script:GitTestFiles {
    Select-String -LiteralPath $Path -Pattern '^\s*\.\s.*Clear-GitEnv\.ps1' -Quiet | Should -BeTrue -Because "$Name ejecuta git"
  }

  It '<Name> llama a Restore-GitEnv' -ForEach $script:GitTestFiles {
    Select-String -LiteralPath $Path -Pattern '^(?!\s*#).*\bRestore-GitEnv\b' -Quiet | Should -BeTrue -Because "$Name ejecuta git"
  }

  It '<Name> guarda Clear-GitEnv' -ForEach $script:GitTestFiles {
    Select-String -LiteralPath $Path -Pattern '^(?!\s*#).*=\s*Clear-GitEnv\b' -Quiet | Should -BeTrue -Because "$Name ejecuta git"
  }
}
