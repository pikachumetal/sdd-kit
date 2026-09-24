BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  function Get-SkillStep([string]$Skill, [int]$Step) {
    $text = Get-KitFile "skills/$Skill/SKILL.md"
    return [regex]::Match($text, "(?ms)^$Step\. .*?(?=^\d+\. |^## )").Value
  }

  function Get-SkillSection([string]$Skill, [string]$Heading) {
    $text = Get-KitFile "skills/$Skill/SKILL.md"
    return [regex]::Match($text, "(?ms)^## $([regex]::Escape($Heading)).*?(?=^## |\z)").Value
  }

  function Get-GateRow([string]$Point) {
    $text = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    return [regex]::Match($text, "(?m)^\| $([regex]::Escape($Point)) \|.*$").Value
  }

  function Assert-Literal([string]$Text, [string[]]$Literals) {
    $Text | Should -Not -BeNullOrEmpty
    foreach ($literal in $Literals) { $Text | Should -Match ([regex]::Escape($literal)) }
  }
}

Describe 'Task 1 — carril de task' {
  It 'el checklist abre con el aviso de fase antes del primer paso' {
    $header = [regex]::Match((Get-KitFile 'skills/sdd-start-task/SKILL.md'), '(?ms)^## Checklist por tarea.*?(?=^1\. )').Value
    Assert-Literal $header @('**Aviso de fase**', 'Ahora:', 'Queda:', '~<minutos>', '~<dólares>', '«van 7 de 15»')
  }

  It 'la primera pregunta ofrece aprobar la spec por delegación' {
    Assert-Literal (Get-SkillStep 'sdd-start-task' 2) @('`pair` y `delegate`', '«apruebo la spec por delegación, nos vemos en la validación»')
  }

  It 'el gate de la spec no para con la spec delegada y conserva la validación' {
    Assert-Literal (Get-SkillStep 'sdd-start-task' 4) @('aprueba la spec por delegación', 'Decisiones tomadas con el dev-lead', 'la validación del paso 7 no se quita nunca')
  }

  It 'el paso 7 pregunta sola la decisión del usuario antes de la validación' {
    Assert-Literal (Get-SkillStep 'sdd-start-task' 7) @('**sola, en su propio turno**', 'presenta la validación en el turno siguiente')
  }

  It 'el paso 7 toma el «sí» sin detalle como validación' {
    Assert-Literal (Get-SkillStep 'sdd-start-task' 7) @('Un «sí» sin detalle', '**es validación**', 'no detalló qué probó')
  }

  It 'la tabla de gates recoge la spec delegada en la review y en la spec' {
    Assert-Literal (Get-GateRow 'Review de spec recomendada') @('con la spec delegada, decide y registra')
    Assert-Literal (Get-GateRow 'Spec') @('salvo la spec delegada en la primera pregunta')
  }

  It 'sdd-end-task acepta el «sí» sin detalle y fija su línea en el walkthrough' {
    Assert-Literal (Get-SkillStep 'sdd-end-task' 0) @('«sí» sin detalle')
    Assert-Literal (Get-SkillStep 'sdd-end-task' 1) @('`Validado: <fecha> · «<frase literal>» · no detalló qué probó`')
  }
}

Describe 'Task 2 — carril de patch' {
  It 'el paso 1 para sin abrir el patch si el fallo no se reproduce' {
    Assert-Literal (Get-SkillStep 'sdd-start-patch' 1) @('**no reproduce el fallo**', 'ni rama, ni carpeta, ni `patch.md`, ni fix, ni id reservado', 'déjala re-medida')
  }

  It 'el paso 1 sigue con el fallo medido si es distinto del predicho' {
    Assert-Literal (Get-SkillStep 'sdd-start-patch' 1) @('un fallo **distinto**', 'el patch sigue con el fallo medido')
  }

  It 'el paso 3 recoge el síntoma medido junto al reportado' {
    Assert-Literal (Get-SkillStep 'sdd-start-patch' 3) @('también el medido y en qué difiere del reportado')
  }

  It 'la red flag y la racionalización cierran el patch sin fallo' {
    Assert-Literal (Get-SkillSection 'sdd-start-patch' 'Red flags — STOP') @('cuyo fallo no has reproducido', '"No se reproduce, pero dejo el patch como cobertura y rastro documental"')
  }

  It 'el cierre reescribe la fila que su re-medición contradice' {
    Assert-Literal (Get-SkillStep 'sdd-end-patch' 4) @('que el patch no salda', 'reescribe esas celdas')
  }
}
