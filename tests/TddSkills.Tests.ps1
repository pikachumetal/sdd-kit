BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:RepoRoot $RelativePath)
  }

  function Find-InSkills([string]$Text) {
    return Get-ChildItem (Join-Path $script:RepoRoot 'skills') -Recurse -File | Select-String -SimpleMatch $Text
  }
}

Describe 'sdd-tdd' {
  It 'existe con su referencia y su NOTICE' {
    foreach ($path in 'skills/sdd-tdd/SKILL.md', 'skills/sdd-tdd/references/writing-good-tests.md', 'skills/sdd-tdd/NOTICE') {
      Join-Path $script:RepoRoot $path | Should -Exist
    }
  }

  It 'ninguna skill invoca superpowers:test-driven-development' {
    Find-InSkills 'superpowers:test-driven-development' | Should -BeNullOrEmpty
  }

  It 'sdd-implement carga sdd-tdd antes de la Task 1' {
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match '(?m)^5\. \*\*TDD\*\*: load `sdd-tdd`'
  }

  It 'el encargo del implementador ejecuta el RED antes de tocar el código' {
    $job = [regex]::Match((Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'), '(?s)## Your Job.+?## ').Value
    $job | Should -Match '1\. Before touching code, run `<comando de los RED>`; keep its failing output and why it was expected'
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-tdd/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}

Describe 'sdd-debugging' {
  It 'existe con sus tres referencias y su NOTICE' {
    foreach ($name in 'SKILL.md', 'NOTICE', 'references/root-cause-tracing.md', 'references/defense-in-depth.md', 'references/condition-based-waiting.md') {
      Join-Path $script:RepoRoot "skills/sdd-debugging/$name" | Should -Exist
    }
  }

  It 'ninguna skill invoca superpowers:systematic-debugging' {
    Find-InSkills 'superpowers:systematic-debugging' | Should -BeNullOrEmpty
  }

  It 'sdd-explore deja los fallos a sdd-propose y su arreglo al roadmap' {
    $explore = Get-KitFile 'skills/sdd-explore/SKILL.md'
    $explore | Should -Match 'A failure to fix is a patch: the first bullet\.'
  }

  It 'NOTICE nombra superpowers 7.0.0 y la licencia MIT' {
    $notice = Get-KitFile 'skills/sdd-debugging/NOTICE'
    $notice | Should -Match 'obra/superpowers, version 7\.0\.0'
    $notice | Should -Match 'MIT License'
  }
}

Describe 'revisión final de la 0165' {
  It 'el encargo para ante un RED recibido que ya pasa' {
    $job = [regex]::Match((Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'), '(?s)## Your Job.+?## ').Value
    $job | Should -Match 'If it already passes, stop: report DONE_WITH_CONCERNS with the green output; don''t implement'
  }

  It 'el encargo carga sdd-tdd para un test propio del implementador' {
    $job = [regex]::Match((Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md'), '(?s)## Your Job.+?## ').Value
    $job | Should -Match 'load `sdd-tdd` before adding your own test'
  }

  It 'el RED por compilación del símbolo que crea la task es el fallo correcto' {
    Get-KitFile 'skills/sdd-tdd/SKILL.md' | Should -Match 'a compile or import error on the symbol the task creates is the right failure'
  }

  It 'sdd-explore deja entender un fallo y manda su arreglo a sdd-propose' {
    Get-KitFile 'skills/sdd-explore/SKILL.md' | Should -Match 'or fixing a failure \(sdd-propose\)\.'
  }

  It 'la variante del ajuste visual de sdd-start-patch no invoca sdd-debugging' {
    $variant = [regex]::Match((Get-KitFile 'skills/sdd-start-patch/SKILL.md'), '\*\*Variante del ajuste visual\*\*[^\n]+').Value
    $variant | Should -Match 'sin `sdd-debugging`'
  }

  It 'la nota del decálogo cita solo la ruta de su evidencia' {
    Get-KitFile 'skills/sdd-implement/references/implementer-prompt.md' | Should -Not -Match 'spec 0147'
  }
}
