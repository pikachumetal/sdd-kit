BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-SkillStep([string]$Skill, [int]$Step) {
    $text = Get-KitFile "skills/$Skill/SKILL.md"
    $pattern = "(?ms)^$Step\. \*\*.*?(?=^\d+\. \*\*|^## )"
    return [regex]::Match($text, $pattern).Value
  }
}

Describe 'Referencia commit-milestones' {
  BeforeAll { $script:Recipe = Get-KitFile 'skills/sdd-start-task/references/commit-milestones.md' }

  It 'tiene las cinco secciones que enlazan las skills' {
    foreach ($heading in 'Qué lleva cada hito', 'Receta', 'Guardas', 'El hash en los artefactos', 'Tests RED sin commitear') {
      $script:Recipe | Should -Match "(?m)^## $heading\r?$"
    }
  }

  It 'fija la forma: 2 + N en una task y fix + cierre en un patch' {
    $script:Recipe | Should -Match '2 \+ N'
    $script:Recipe | Should -Match 'Fix \(patch\)'
    $script:Recipe | Should -Match 'Cierre \(patch\)'
  }

  It 'junta con reset --soft y nunca reescribe a la fuerza' {
    $script:Recipe | Should -Match 'git reset --soft <base>'
    $script:Recipe | Should -Match 'rebase -i'
    $script:Recipe | Should -Match 'push --force'
    $script:Recipe | Should -Match '--no-verify'
  }

  It 'lleva las dos guardas literales' {
    $script:Recipe | Should -Match 'git rev-list --merges <base>\.\.HEAD'
    $script:Recipe | Should -Match 'git branch -r --contains'
  }

  It 'el hash de la task va en el commit del hito siguiente' {
    $script:Recipe | Should -Match 'hito siguiente'
  }
}

Describe 'Carril task' {
  It 'el paso 5 junta la apertura antes del primer despacho' {
    Get-SkillStep 'sdd-start-task' 5 | Should -Match 'junta la apertura[^\n]*commit-milestones\.md'
  }

  It 'el paso 6 deja los RED sin commitear y junta cada task' {
    $step = Get-SkillStep 'sdd-start-task' 6
    $step | Should -Not -Match 'y los commitea;'
    $step | Should -Match 'sin commitearlos'
    $step | Should -Match 'junta su rango en un commit[^\n]*commit-milestones\.md'
  }

  It 'el cierre junta su commit antes del merge' {
    Get-SkillStep 'sdd-end-task' 10 | Should -Match 'junta el cierre en un commit[^\n]*commit-milestones\.md'
  }

  It 'el override cubre los commits frecuentes de superpowers' {
    Get-KitFile 'skills/sdd-start-task/references/overrides-superpowers.md' | Should -Match 'Frequent commits[^\n]*commit-milestones\.md'
  }

  It 'el encargo del implementador commitea los RED con la implementación' {
    Get-KitFile 'skills/sdd-start-task/references/encargo-revision.md' | Should -Match 'sin commitear: commitéalos con tu implementación[^\n]*--no-verify'
  }

  It 'la plantilla del plan ya no commitea los RED antes de despachar' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Not -Match 'escritos y commiteados antes de despachar'
    $template | Should -Match '\*\*Tests RED\*\*:[^\n]*sin commitear'
    $template | Should -Match '\*\*Step 4: Commit de la task\*\*[^\n]*commit-milestones\.md'
  }

  It 'la plantilla de tasks apunta el hash juntado en el hito siguiente' {
    Get-KitFile 'skills/sdd-templates/templates/tasks-template.md' | Should -Match 'hito siguiente'
  }
}

Describe 'Carril patch' {
  It 'el paso 5 de sdd-start-patch hace un solo commit de fix con patch.md' {
    Get-SkillStep 'sdd-start-patch' 5 | Should -Match 'un solo commit con el código, los tests y `patch\.md`[^\n]*commit-milestones\.md'
  }

  It 'el paso 1 de sdd-end-patch apunta el hash del fix' {
    Get-SkillStep 'sdd-end-patch' 1 | Should -Match 'el del commit del fix'
  }

  It 'el paso 2 de sdd-end-patch es un solo commit de cierre' {
    $step = Get-SkillStep 'sdd-end-patch' 2
    $step | Should -Not -Match 'pueden ir en commits separados'
    $step | Should -Match 'Commit de cierre[^\n]*commit-milestones\.md'
  }

  It 'el paso 2 de sdd-end-patch junta un fix que llega en varios commits' {
    Get-SkillStep 'sdd-end-patch' 2 | Should -Match 'más de un commit[^\n]*júntalo'
  }

  It 'la plantilla del patch apunta el hash del fix' {
    Get-KitFile 'skills/sdd-templates/templates/patch-template.md' | Should -Match 'commit: <hash>\s+# hash del commit del fix'
  }
}

Describe 'Constitution' {
  It 'el Art. IV fija la forma de la historia' {
    $constitution = Get-KitFile '.docs/sdd/constitution.md'
    [regex]::Match($constitution, '(?ms)^## Art\. IV .*?(?=^## Art\. V )').Value | Should -Match 'commit-milestones\.md'
  }
}
