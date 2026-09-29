BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw -Encoding utf8
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    foreach ($literal in $Literals) { $Text.Contains($literal) | Should -BeTrue -Because "falta «$literal»" }
  }
}

Describe 'Plantilla del plan' {
  BeforeAll {
    $script:Plan = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $script:Focus = [regex]::Match($script:Plan, '(?s)\n## Review Focus\r?\n.*?(?=\n## )').Value
  }

  It 'plan-template has Review Focus between global constraints and Phase -1' {
    $focusAt = $script:Plan.IndexOf("`n## Review Focus")
    $focusAt | Should -BeGreaterThan $script:Plan.IndexOf('## Restricciones globales')
    $focusAt | Should -BeLessThan $script:Plan.IndexOf('## Phase -1')
  }

  It 'plan-template help cites writing-plans and names the owning task' {
    Assert-Literal $script:Focus @('superpowers:writing-plans', 'Task <n>', 'ninguna: comprobado')
  }

  It 'plan-template keeps an empty Review Focus instead of deleting it' {
    Assert-Literal $script:Focus @('no se borra')
  }

  It 'plan-template names the verification when a line has no test' {
    Assert-Literal $script:Focus @('«Verificación visual»')
  }

  It 'plan-template decisions summarize the Review Focus' {
    $decisions = [regex]::Match($script:Plan, '(?s)## Decisiones que he tomado yo.*?\*\*Goal\*\*').Value
    Assert-Literal $decisions @('Review Focus: <n> entradas')
  }

  It 'plan-template self-review lists each Review Focus line' {
    $selfReview = [regex]::Match($script:Plan, '(?s)## 4\. Self-review.*').Value
    Assert-Literal $selfReview @('<línea del Review Focus> → Task <n>, test <nombre>. ✓')
  }
}

Describe 'Encargo del revisor final' {
  It 'final reviewer brief carries the Review Focus verbatim' {
    $finalReviewer = [regex]::Match((Get-KitFile 'skills/sdd-start-feature/references/encargo-revision.md'), '(?s)## Revisor final.*?(?=\n## Encargo del implementador)').Value
    Assert-Literal $finalReviewer @('## Review Focus', 'copia literal de la sección `## Review Focus` del plan', 'no basta con remitir al plan')
  }
}
