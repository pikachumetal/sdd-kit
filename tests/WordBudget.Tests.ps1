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
      'sdd-archive'         = @{ SkillMd = 3850; Total = 6300 }
      'sdd-config'          = @{ SkillMd = 1400; Total = 1400 }
      'sdd-explore'         = @{ SkillMd = 1100; Total = 1100 }
      'sdd-end-release'     = @{ SkillMd = 1900; Total = 2500 }
      'sdd-feedback'        = @{ SkillMd = 800; Total = 800 }
      'sdd-grilling'        = @{ SkillMd = 900; Total = 900 }
      'sdd-parallel-agents' = @{ SkillMd = 1150; Total = 1150 }
      'sdd-init'            = @{ SkillMd = 2400; Total = 3000 }
      'sdd-roadmap'         = @{ SkillMd = 3600; Total = 3600 }
      'sdd-rubber-duck'     = @{ SkillMd = 600; Total = 600 }
      'sdd-propose'         = @{ SkillMd = 5200; Total = 6700 }
      'sdd-implement'       = @{ SkillMd = 9483; Total = 13249 }
      'sdd-verify'          = @{ SkillMd = 2990; Total = 9020 }
      'sdd-tdd'             = @{ SkillMd = 1700; Total = 3100 }
      'sdd-upgrade'         = @{ SkillMd = 980; Total = 980 }
      'sdd-debugging'       = @{ SkillMd = 1600; Total = 3400 }
      'sdd-start-feature'   = @{ SkillMd = 2100; Total = 11464 }
      'sdd-start-patch'     = @{ SkillMd = 2300; Total = 2300 }
      'sdd-worktrees'       = @{ SkillMd = 1300; Total = 1300 }
      'sdd-templates'       = @{ SkillMd = 1700; Total = 15300 }
      # El hook la inyecta en cada sesión: su tope viene de antes y es más estricto que la centena.
      'using-sdd'           = @{ SkillMd = 570; Total = 570 }
    }
    Kit     = 87600
    Anchors = @{
      'constitution.md' = 2236
      'mission.md'      = 1700
      'architecture.md' = 1900
      'tech-stack.md'   = 19280
    }
  }

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
    $measured = Measure-Words (Join-Path $script:KitRoot "skills/$_/SKILL.md")
    $budget = [int]$script:Budgets.Skills[$_].SkillMd
    $measured | Should -BeLessOrEqual $budget -Because (Get-BudgetReason $measured $budget)
  }

  It '<_>: la skill completa cabe en su tope' -ForEach $script:SkillNames {
    $measured = Measure-SkillWords $_
    $budget = [int]$script:Budgets.Skills[$_].Total
    $measured | Should -BeLessOrEqual $budget -Because (Get-BudgetReason $measured $budget)
  }

  It 'el kit entero cabe en su presupuesto' {
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
