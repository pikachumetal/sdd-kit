BeforeAll {
  $script:Skills = Join-Path $PSScriptRoot '../skills'

  function Read-SkillFile([string]$RelativePath) {
    return Get-Content -Raw -Encoding utf8 (Join-Path $script:Skills $RelativePath)
  }

  function Get-NumberedStep([string]$Content, [int]$Number) {
    $match = [regex]::Match($Content, "(?ms)^$Number\. .*?(?=^\d+\. |^## |\z)")
    return $match.Value
  }
}

Describe 'Reglas de capacidades en sus puntos de uso' {
  Context 'el slug de una capacidad nueva va en inglés' {
    It 'spec-template lo dice en la ayuda del delta' {
      $content = Read-SkillFile 'sdd-templates/templates/spec-template.md'
      $delta = [regex]::Match($content, '(?s)## Delta de comportamiento.*?### Capacidad').Value
      $delta | Should -Match 'inglés'
    }

    It 'capability-template lo dice en la regla 1' {
      $content = Read-SkillFile 'sdd-templates/templates/capability-template.md'
      ($content -split "`n" | Where-Object { $_ -match '^> 1\. ' }) | Should -Match 'inglés'
    }

    It 'sdd-start-task lo dice en el paso 4' {
      $step = Get-NumberedStep (Read-SkillFile 'sdd-start-task/SKILL.md') 4
      $step | Should -Match 'inglés kebab-case'
    }
  }

  Context 'el comportamiento observable vive solo en capabilities/' {
    It 'spec-template lleva la regla de reparto' {
      Read-SkillFile 'sdd-templates/templates/spec-template.md' | Should -Match 'solo en `capabilities/`'
    }

    It 'plan-template lleva la regla de reparto' {
      Read-SkillFile 'sdd-templates/templates/plan-template.md' | Should -Match 'solo en `capabilities/`'
    }

    It 'el paso de aprendizajes dice que los anclajes enlazan el valor' {
      Read-SkillFile 'sdd-end-task/references/aprendizajes-skills.md' | Should -Match 'enlaza'
    }

    It 'sdd-end-task tiene una red flag sobre valores copiados a tech-stack' {
      $redFlags = [regex]::Match((Read-SkillFile 'sdd-end-task/SKILL.md'), '(?s)## Red flags.*?\|').Value
      $redFlags | Should -Match 'tech-stack'
    }
  }

  Context 'MODIFIED copia el bloque entero' {
    It 'spec-template lo dice junto al marcador MODIFIED' {
      $content = Read-SkillFile 'sdd-templates/templates/spec-template.md'
      $marker = [regex]::Match($content, '(?s)\*\*MODIFIED — .*?\*\*REMOVED').Value
      $marker | Should -Match 'bloque entero'
    }

    It 'la fusión sustituye entero el requisito' {
      Read-SkillFile 'sdd-end-task/references/aprendizajes-skills.md' | Should -Match 'MODIFIED sustituye entero'
    }
  }
}
