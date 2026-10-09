BeforeDiscovery {
  $kitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  $script:SkillNames = @(Get-ChildItem -LiteralPath (Join-Path $kitRoot 'skills') -Directory | ForEach-Object Name)
  $script:AnchorNames = @('constitution.md', 'mission.md', 'architecture.md', 'tech-stack.md')
}

BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  $script:Budgets = @{
    Skills  = @{
      'add-to-changelog'    = @{ SkillMd = 500; Total = 500 }
      'sdd-config'          = @{ SkillMd = 1400; Total = 1400 }
      'sdd-consult'         = @{ SkillMd = 900; Total = 900 }
      'sdd-end-feature'     = @{ SkillMd = 3000; Total = 4500 }
      'sdd-end-patch'       = @{ SkillMd = 2460; Total = 2460 }
      'sdd-end-release'     = @{ SkillMd = 1900; Total = 2500 }
      'sdd-feedback'        = @{ SkillMd = 700; Total = 700 }
      'sdd-grilling'        = @{ SkillMd = 650; Total = 650 }
      'sdd-init-brownfield' = @{ SkillMd = 1100; Total = 1700 }
      'sdd-init-greenfield' = @{ SkillMd = 1800; Total = 2100 }
      'sdd-roadmap'         = @{ SkillMd = 2600; Total = 2600 }
      'sdd-rubber-duck'     = @{ SkillMd = 500; Total = 500 }
      'sdd-propose'         = @{ SkillMd = 4800; Total = 4800 }
      'sdd-start-feature'   = @{ SkillMd = 5400; Total = 17400 }
      'sdd-start-patch'     = @{ SkillMd = 2300; Total = 2300 }
      'sdd-templates'       = @{ SkillMd = 1500; Total = 11990 }
      # El hook la inyecta en cada sesión: su tope viene de antes y es más estricto que la centena.
      'using-sdd'           = @{ SkillMd = 570; Total = 570 }
    }
    Kit     = 54595
    Anchors = @{
      'constitution.md' = 2200
      'mission.md'      = 1700
      'architecture.md' = 1900
      'tech-stack.md'   = 18700
    }
  }

  $script:Suspended = @('sdd-templates')
  $script:SuspendedReason = 'suspendido mientras conviven las plantillas de documentos 2.x y 3.0.0'

  function Measure-Words([string]$Path) {
    @((Get-Content -LiteralPath $Path -Raw) -split '\s+' | Where-Object { $_ }).Count
  }

  function Measure-SkillWords([string]$SkillName) {
    $skillDir = Join-Path $script:KitRoot "skills/$SkillName"
    $files = Get-ChildItem -LiteralPath $skillDir -Recurse -File -Filter '*.md' |
      Where-Object { $_.FullName -notmatch '[\\/]references[\\/]migrations[\\/]' }
    ($files | ForEach-Object { Measure-Words $_.FullName } | Measure-Object -Sum).Sum
  }

  function Get-BudgetReason([int]$Measured, [int]$Budget) {
    "mide $Measured y el tope es ${Budget}: recorta, o sube el tope con la decisión del dev-lead escrita en la spec"
  }
}

Describe 'Topes de palabras' {
  It 'toda skill tiene tope: <_>' -ForEach $script:SkillNames {
    $script:Budgets.Skills.ContainsKey($_) | Should -BeTrue -Because "la skill $_ no tiene tope en WordBudget.Tests.ps1"
  }

  It '<_>: SKILL.md cabe en su tope' -ForEach $script:SkillNames {
    if ($script:Suspended -contains $_) { Set-ItResult -Skipped -Because $script:SuspendedReason; return }
    $measured = Measure-Words (Join-Path $script:KitRoot "skills/$_/SKILL.md")
    $budget = [int]$script:Budgets.Skills[$_].SkillMd
    $measured | Should -BeLessOrEqual $budget -Because (Get-BudgetReason $measured $budget)
  }

  It '<_>: la skill completa cabe en su tope' -ForEach $script:SkillNames {
    if ($script:Suspended -contains $_) { Set-ItResult -Skipped -Because $script:SuspendedReason; return }
    $measured = Measure-SkillWords $_
    $budget = [int]$script:Budgets.Skills[$_].Total
    $measured | Should -BeLessOrEqual $budget -Because (Get-BudgetReason $measured $budget)
  }

  It 'el kit entero cabe en su presupuesto' {
    Set-ItResult -Skipped -Because $script:SuspendedReason
    return
    $measured = (Get-ChildItem -LiteralPath (Join-Path $script:KitRoot 'skills') -Directory |
      ForEach-Object { Measure-SkillWords $_.Name } | Measure-Object -Sum).Sum
    $measured | Should -BeLessOrEqual $script:Budgets.Kit -Because (Get-BudgetReason $measured $script:Budgets.Kit)
  }

  It '<_> cabe en su tope' -ForEach $script:AnchorNames {
    $measured = Measure-Words (Join-Path $script:KitRoot ".docs/sdd/$_")
    $budget = [int]$script:Budgets.Anchors[$_]
    $measured | Should -BeLessOrEqual $budget -Because (Get-BudgetReason $measured $budget)
  }
}
