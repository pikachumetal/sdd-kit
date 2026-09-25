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
  Context 'el cierre de un patch fusiona su delta de capacidad' {
    It 'sdd-end-patch lo manda en el paso 1, con la salida corta' {
      $step = Get-NumberedStep (Read-SkillFile 'sdd-end-patch/SKILL.md') 1
      $step | Should -Match '\.docs/sdd/capabilities/'
      $step | Should -Match 'ya decía, no hay delta'
      $step | Should -Match 'aprendizajes-skills\.md'
    }

    It 'sdd-end-patch mete la capacidad en el commit de cierre' {
      Get-NumberedStep (Read-SkillFile 'sdd-end-patch/SKILL.md') 2 | Should -Match 'capacidades'
    }

    It 'patch-template lleva la sección opcional de delta' {
      Read-SkillFile 'sdd-templates/templates/patch-template.md' | Should -Match '(?m)^## 6\. Delta de capacidad'
    }

    It 'capability-template nombra el cierre de patch en la fusión' {
      $content = Read-SkillFile 'sdd-templates/templates/capability-template.md'
      ($content -split "`n" | Where-Object { $_ -match '^> 3\. ' }) | Should -Match 'sdd-end-patch'
    }
  }

  Context 'una capacidad no guarda historial' {
    It 'capability-template no tiene sección de historial y dice dónde se lee' {
      $content = Read-SkillFile 'sdd-templates/templates/capability-template.md'
      $content | Should -Not -Match '(?m)^## Historial'
      $content | Should -Not -Match '<carpeta de la task o del patch>'
      $content | Should -Match 'no guarda historial'
    }

    It 'sdd-end-patch no pide línea de historial al fusionar' {
      Get-NumberedStep (Read-SkillFile 'sdd-end-patch/SKILL.md') 1 | Should -Not -Match 'historial'
    }

    It 'la regla de fusión de sdd-end-feature dice que la capacidad no guarda historial' {
      Get-NumberedStep (Read-SkillFile 'sdd-end-feature/references/aprendizajes-skills.md') 4 | Should -Match 'no guarda historial'
    }
  }

  Context 'el bloque «Capacidades» abre la spec y el patch' {
    It 'spec-template lo lleva antes de las decisiones, con sus tres formas' {
      $content = Read-SkillFile 'sdd-templates/templates/spec-template.md'
      $content.IndexOf("`n## Capacidades") | Should -BeGreaterThan 0
      $content.IndexOf("`n## Capacidades") | Should -BeLessThan $content.IndexOf('## Decisiones que he tomado yo')
      $block = [regex]::Match($content, '(?s)\n## Capacidades.*?\n## ').Value
      $block.Contains('- Nuevas: `<nombre>`') | Should -BeTrue
      $block.Contains('- Modificadas: `<nombre>`') | Should -BeTrue
      $block.Contains('Ninguna, porque') | Should -BeTrue
      $block | Should -Match 'Get-CapabilityIndex\.ps1'
      $block | Should -Match 'nombre exacto'
    }

    It 'patch-template lo lleva antes del síntoma, sin «Nuevas»' {
      $content = Read-SkillFile 'sdd-templates/templates/patch-template.md'
      $content.IndexOf("`n## Capacidades") | Should -BeGreaterThan 0
      $content.IndexOf("`n## Capacidades") | Should -BeLessThan $content.IndexOf('## 1. Síntoma')
      $block = [regex]::Match($content, '(?s)\n## Capacidades.*?\n## ').Value
      $block.Contains('- Modificadas: `<nombre>`') | Should -BeTrue
      $block.Contains('- Nuevas:') | Should -BeFalse
      $block.Contains('Ninguna, porque el fix devuelve') | Should -BeTrue
    }

    It 'la ayuda de la sección de delta del patch manda la salida corta al bloque' {
      $section = [regex]::Match((Read-SkillFile 'sdd-templates/templates/patch-template.md'), '(?s)## 6\. Delta de capacidad.*').Value
      $section | Should -Match 'Ninguna, porque'
    }

    It 'sdd-end-feature ejecuta el validador con la spec en el paso 4' {
      $step = Get-NumberedStep (Read-SkillFile 'sdd-end-feature/SKILL.md') 4
      $step | Should -Match 'Test-Capabilities\.ps1'
      $step | Should -Match '-Artifact'
    }

    It 'sdd-end-patch ejecuta el validador con el patch y escribe el bloque en el paso 1' {
      $step = Get-NumberedStep (Read-SkillFile 'sdd-end-patch/SKILL.md') 1
      $step | Should -Match 'Test-Capabilities\.ps1'
      $step | Should -Match '-Artifact'
      $step | Should -Match 'Ninguna, porque el fix devuelve'
    }

    It 'en los dos cierres, un fallo en una capacidad que el delta no toca se informa y no bloquea' {
      foreach ($step in @((Get-NumberedStep (Read-SkillFile 'sdd-end-feature/SKILL.md') 4), (Get-NumberedStep (Read-SkillFile 'sdd-end-patch/SKILL.md') 1))) {
        $step | Should -Match 'que el delta no toca'
        $step | Should -Match 'no bloquea'
      }
    }

    It 'la regla de fusión nombra el validador' {
      Get-NumberedStep (Read-SkillFile 'sdd-end-feature/references/aprendizajes-skills.md') 4 | Should -Match 'Test-Capabilities\.ps1'
    }
  }

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

    It 'sdd-start-feature lo dice en el paso 4' {
      $step = Get-NumberedStep (Read-SkillFile 'sdd-start-feature/SKILL.md') 4
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
      Read-SkillFile 'sdd-end-feature/references/aprendizajes-skills.md' | Should -Match 'enlaza'
    }

    It 'sdd-end-feature tiene una red flag sobre valores copiados a tech-stack' {
      $redFlags = [regex]::Match((Read-SkillFile 'sdd-end-feature/SKILL.md'), '(?s)## Red flags.*?\|').Value
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
      Read-SkillFile 'sdd-end-feature/references/aprendizajes-skills.md' | Should -Match 'MODIFIED sustituye entero'
    }

    It 'capability-template describe la misma fusión en la regla 3' {
      $content = Read-SkillFile 'sdd-templates/templates/capability-template.md'
      $rule = [regex]::Match($content, '(?s)> 3\. .*?(?=> 4\. )').Value
      $rule | Should -Match 'sustituye entero'
    }
  }
}

Describe 'Las skills eligen capacidades con el índice generado' {
  It '<Skill> ejecuta Get-CapabilityIndex.ps1 en su paso de contexto, antes de abrir capacidades' -ForEach @(
    @{ Skill = 'sdd-start-feature'; Step = 'Contexto' }
    @{ Skill = 'sdd-roadmap'; Step = 'Estado real' }
    @{ Skill = 'sdd-consult'; Step = 'Primar contexto' }
  ) {
    $step = [regex]::Match((Read-SkillFile "$Skill/SKILL.md"), "(?ms)^1\. \*\*$Step.*?(?=^\d+\. |^## |\z)").Value
    $step | Should -Match 'pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Get-CapabilityIndex\.ps1" -Path'
    $step | Should -Match 'propósito'
  }

  It 'la plantilla de capacidad dice que el índice se genera, sin index.md' {
    $content = Read-SkillFile 'sdd-templates/templates/capability-template.md'
    $content | Should -Match 'Índice: lo genera `Get-CapabilityIndex\.ps1` al vuelo; no hay `index\.md`\.'
    $content | Should -Not -Match 'el listado de ficheros de `capabilities/` es el índice'
  }
}