BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  # Windows corta en 260 caracteres la ruta absoluta. El clon del plugin en
  # ~/.claude/plugins/marketplaces/sdd-kit/ ya gasta unos 50 y un usuario o una carpeta de
  # clonado largos llegan a ~120: 140 relativos es lo que deja margen para esas bases.
  $script:MaxRelativeLength = 140

  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv

  # Sin UTF-8 la salida de git se decodifica con la página de códigos de la consola y cada
  # tilde cuenta doble; quotepath=off evita que git escape esos caracteres en octal.
  $script:PreviousEncoding = [Console]::OutputEncoding
  [Console]::OutputEncoding = [Text.Encoding]::UTF8
  # También los ficheros sin versionar no ignorados: antes de `git add` el test pasaba en falso (ticket 0063 §3).
  $script:TrackedPaths = @(git -C $script:KitRoot -c core.quotepath=off ls-files --cached --others --exclude-standard)
}

AfterAll {
  [Console]::OutputEncoding = $script:PreviousEncoding
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'Longitud de las rutas versionadas y por versionar' {
  It 'lista ficheros versionados' {
    $script:TrackedPaths.Count | Should -BeGreaterThan 0
  }

  It 'ninguna ruta relativa llega a 140 caracteres' {
    $tooLong = $script:TrackedPaths |
      Where-Object { $_.Length -ge $script:MaxRelativeLength } |
      ForEach-Object { "$($_.Length) $_" }
    $tooLong | Should -BeNullOrEmpty -Because 'rompen el clon del plugin en Windows (límite de 260 en la ruta absoluta)'
  }
}
