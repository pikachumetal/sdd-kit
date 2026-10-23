BeforeAll {
  $script:RepoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw -Encoding utf8
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    foreach ($literal in $Literals) { $Text.Contains($literal) | Should -BeTrue -Because "falta «$literal»" }
  }
}

Describe 'Plantillas' {
  It 'el plan orienta a tasks que se prueban en la aplicación' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/plan-template.md'), '(?s)## 2\. Tasks.*?### Task 1').Value
    Assert-Literal $section @('Tasks verticales', 'orientación, no regla', 'no una capa', 'Sin tamaño fijo en horas', 'Las capas de una sola funcionalidad no son base común')
  }

  It 'cada task del plan dice si se prueba en la aplicación o por qué no' {
    $task = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/plan-template.md'), '(?s)### Task 1 —.*?- \[ \] \*\*Step 1').Value
    Assert-Literal $task @('**Se prueba en la aplicación**', 'no, porque <base común | migración | refactor>')
  }

  It 'los escenarios de una regla de negocio llevan datos' {
    $delta = [regex]::Match((Get-KitFile 'skills/sdd-templates/templates/spec-template.md'), '(?s)## Delta de comportamiento.*?### Capacidad').Value
    Assert-Literal $delta @('datos concretos', 'bolsa FR, IT, PT', 'no cubre')
  }

  It 'una regla que cambia se escribe con su valor completo' {
    $rules = (Get-KitFile 'skills/sdd-templates/templates/spec-template.md') -split "`r?`n" | Where-Object { $_.StartsWith('**Reglas de la capacidad**') }
    Assert-Literal $rules @('valor completo', 'sustituye entera', 'A, B y C')
  }
}

Describe 'sdd-start-feature' {
  BeforeAll {
    function Get-SkillStep([int]$Step) {
      $text = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
      return [regex]::Match($text, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
    }
  }

  It 'la validación trae un guion de pruebas en pasos numerados' {
    Assert-Literal (Get-SkillStep 7) @('**guion de pruebas**', 'El guion, el entorno y el panel siguen [dev-validation.md]')
    Assert-Literal (Get-KitFile 'skills/sdd-archive/references/dev-validation.md') @('**The report''s steps first**', 'expected result', 'The script goes apart from your smoke')
    (Get-SkillStep 7).Contains('cómo probarlo') | Should -BeFalse
  }

  It 'en pair, cada task cerrada para con su guion' {
    Assert-Literal (Get-KitFile 'skills/sdd-implement/SKILL.md') @('**In `pair`**, with the task''s commit done', 'present that task''s test script', 'Se prueba en la aplicación', '`delegate` and `unattended` don''t stop here')
  }
}
Describe 'sdd-archive' {
  It 'la validación presenta el guion de pruebas' {
    $step = [regex]::Match((Get-KitFile 'skills/sdd-archive/SKILL.md'), '(?ms)^1\. .*?(?=^\d+\. |^## )').Value
    Assert-Literal $step @('the **test script**, composed, rehearsed and offered as [dev-validation.md](references/dev-validation.md) says')
    Assert-Literal (Get-KitFile 'skills/sdd-archive/references/dev-validation.md') @('Each step is a numbered action in the app with the scenarios'' data and its expected result with the literal that comes out')
    $step.Contains('cómo probarlo') | Should -BeFalse
  }
}
