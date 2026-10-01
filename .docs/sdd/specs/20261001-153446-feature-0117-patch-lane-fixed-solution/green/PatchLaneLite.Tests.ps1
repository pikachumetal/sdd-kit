BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  function Get-KitFile([string]$RelativePath) {
    Get-Content -LiteralPath (Join-Path $script:KitRoot $RelativePath) -Raw
  }

  function Get-Section([string]$Text, [string]$From, [string]$To) {
    $start = $Text.IndexOf($From)
    if ($start -lt 0) { return '' }
    $end = $Text.IndexOf($To, $start + 1)
    if ($end -lt 0) { $end = $Text.Length }
    $Text.Substring($start, $end - $start)
  }
}

Describe 'lite con migración de datos y deuda parcial' {
  It 'lite solo se descarta por un cambio de schema' {
    $lite = Get-KitFile 'skills/sdd-start-feature/references/modo-lite.md'
    $lite | Should -Match 'No cambia el schema de datos'
    $lite | Should -Not -Match 'ni exige migración'
  }

  It 'una migración solo de datos, idempotente y reversible, no descarta lite y se nombra' {
    $lite = Get-KitFile 'skills/sdd-start-feature/references/modo-lite.md'
    $lite | Should -Match 'solo de datos, idempotente y reversible'
    $lite | Should -Match 'la spec la nombra'
  }

  It 'el paso 4 de sdd-end-patch nombra el formato parcial' {
    $step = Get-Section (Get-KitFile 'skills/sdd-end-patch/SKILL.md') '4. **`roadmap.md`**' '5. **estimation-log**'
    $step | Should -Match 'parcial —'
    $step | Should -Match 'queda:'
  }
}
