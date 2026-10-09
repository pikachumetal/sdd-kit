BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Contrato del modo de ids en los documentos del kit' {
  It 'el marcador del propio kit declara su modo de ids' {
    $marker = Get-KitFile '.docs/sdd/sdd-kit.json' | ConvertFrom-Json
    $marker.ids.mode | Should -BeIn @('tracker', 'sequence')
  }

  It 'el Art. IV contempla los dos modos de numeración' {
    $constitution = Get-KitFile '.docs/sdd/constitution.md'
    $constitution | Should -Match 'sequence'
    $constitution | Should -Match 'tracker'
  }

  Context 'plantillas canónicas' {
    It 'spec-template declara parent para una task partida' {
      Get-KitFile 'skills/sdd-templates/templates/spec-template.md' | Should -Match '(?m)^parent:'
    }

    It 'patch-template declara parent para un patch partido' {
      Get-KitFile 'skills/sdd-templates/templates/patch-template.md' | Should -Match '(?m)^parent:'
    }
  }

  Context 'verbo de la secuencia' {
    It 'el verbo existe en la CLI' {
      Join-Path $script:RepoRoot 'cli/src/ids/verbs.ts' | Should -Exist
    }

    It 'el índice de sdd-templates lo nombra' {
      Get-KitFile 'skills/sdd-templates/SKILL.md' | Should -Match 'sdd id next'
    }
  }

  Context 'skills de carril' {
    It 'nombrado.md hace depender el id del modo declarado en sdd-kit.json' {
      $nombrado = Get-KitFile 'skills/sdd-start-feature/references/nombrado.md'
      $nombrado | Should -Match 'sdd-kit\.json'
      $nombrado | Should -Match 'sequence'
    }

    It 'sdd-propose dice de dónde sale el id en cada modo' {
      Get-KitFile 'skills/sdd-propose/SKILL.md' | Should -Match 'sequence'
    }

    It 'sdd-start-patch declara la secuencia compartida con las tasks' {
      Get-KitFile 'skills/sdd-start-patch/SKILL.md' | Should -Match 'sequence'
    }

    It 'sdd-roadmap reserva ids correlativos al planificar' {
      Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match 'sequence'
    }

    It 'los arranques sin fila reservan el id con --reserve, no lo calculan' -ForEach @(
      @{ File = 'skills/sdd-start-feature/references/nombrado.md' }
      @{ File = 'skills/sdd-start-patch/SKILL.md' }
      @{ File = 'skills/sdd-roadmap/SKILL.md' }
    ) {
      Get-KitFile $File | Should -Match '(sdd|sdd\.js") id next[^`]*--reserve'
    }

    It 'sdd-roadmap reserva los N ids en una sola llamada' {
      Get-KitFile 'skills/sdd-roadmap/SKILL.md' | Should -Match '--reserve --count'
    }

    It 'sdd-consult puede proponer un id pero no reservarlo' {
      Get-KitFile 'skills/sdd-consult/SKILL.md' | Should -Match 'sdd id next|sequence'
    }
  }

  Context 'inicialización y migración' {
    It 'greenfield pregunta cómo se numera el trabajo' {
      Get-KitFile 'skills/sdd-init-greenfield/SKILL.md' | Should -Match 'numera|secuencia propia'
    }

    It 'brownfield pregunta cómo se numera el trabajo' {
      Get-KitFile 'skills/sdd-init-brownfield/SKILL.md' | Should -Match 'numera|secuencia propia'
    }

    It 'la migración v2.0.0 existe con su verificación' {
      $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v2.0.0.md'
      $migration | Should -Match 'ids'
      $migration | Should -Match '(?m)^##\s+Verificación'
    }
  }
}
