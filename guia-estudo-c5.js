const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak
} = require("docx");

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
}
function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360 }, children: [new TextRun(text)] });
}
function h3(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240 }, children: [new TextRun(text)] });
}
function subtitle(text) {
  return new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text, size: 22, color: "666666", font: "Arial" })] });
}
function p(text) {
  return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, size: 24, font: "Arial" })] });
}
function slideRef(text) {
  return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text, size: 20, color: "2E75B6", italics: true, font: "Arial" })] });
}
function quote(text) {
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    border: { left: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 8 } },
    children: [new TextRun({ text, size: 22, color: "555555", italics: true, font: "Arial" })]
  });
}
function apply(text) {
  return new Paragraph({
    spacing: { after: 160 },
    shading: { fill: "E8F4E8", type: ShadingType.CLEAR },
    indent: { left: 120, right: 120 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}
function bullet(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}
function checkbox(text, ref) {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text: "☐ " + text, size: 22, font: "Arial" })]
  });
}
function separator() {
  return new Paragraph({
    spacing: { before: 200, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 8 } },
    children: []
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1A1A1A" },
        paragraph: { spacing: { before: 240, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 30, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 300, after: 160 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "333333" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets2", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets3", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets4", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "bullets5", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "checks", levels: [{ level: 0, format: LevelFormat.BULLET, text: "☐", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      h1("Guia de estudo — Cenário C5: Banner “Sem conexão” observável"),
      subtitle("Defesa A2 · Luisa Felix · Grupo 3 · Operação/incidente · ~4-5h"),
      separator(),

      // TEMPO 1
      h2("TEMPO 1 — Impacto: “O que sua mudança toca?”"),

      h3("1.1 Casos de uso e fluxos de exceção (Slides 22-23)"),
      slideRef("📖 Handout Aula 19, páginas 22-23"),
      quote("UC completo = principal + alternativos + exceções. Fluxo principal — o caminho feliz, quando tudo dá certo. Exceções — o que acontece quando algo falha (sensor mudo, dado inválido, rede caída). Os cenários da A2 são, quase todos, exceções que viraram realidade."),
      quote("“O caminho feliz é o fácil; a exceção é onde está a engenharia.”"),
      apply("→ NO MEU CENÁRIO: O UC-03 (Visualizar Status dos Canteiros) tem o fluxo de exceção E2: queda de conexão durante o polling. O código já trata isso (setConnectionLost = true, banner amarelo aparece), mas a observabilidade desse ramo está cega — nenhum log, nenhuma métrica. Minha mudança fecha essa lacuna."),

      h3("1.2 Matriz de rastreabilidade (Slides 24-25)"),
      slideRef("📖 Handout Aula 19, páginas 24-25"),
      quote("Forward (requisito → teste): todo requisito tem um teste que o cobre? Backward (código → requisito): todo código aponta para um requisito que o justifica? Detecta requisito órfão (sem teste) e gold plating (código sem requisito)."),
      quote("A pergunta de abertura de toda defesa: “qual artefato sua mudança toca?”"),
      p("→ NO MEU CENÁRIO: Minha mudança toca:"),
      bullet("UC-03/E2 (fluxo de exceção — queda de conexão durante polling)", "bullets"),
      bullet("useDashboardData.ts linhas 49-50 (ramo connectionLost = true)", "bullets"),
      bullet("observability.ts (novos eventos connection.lost / connection.restored)", "bullets"),
      bullet("docs/ops/observability-dashboard.md (novo Sintoma 4 no runbook)", "bullets"),
      bullet("Observability.test.tsx (teste novo que prova os dois lados)", "bullets"),

      h3("1.3 Gold plating e escopo (Slides 25-26)"),
      slideRef("📖 Handout Aula 19, páginas 25-26"),
      quote("“Mínima e correta” é critério de engenharia, não preguiça. Cada linha a mais é superfície de bug a mais e manutenção para sempre. Na A2: mudança mínima e correta. Tudo que você tocar além do cenário, você terá que defender. “Aproveitei e refatorei” é a armadilha clássica do fork."),
      apply("→ NO MEU CENÁRIO: Não refatorar o hook inteiro. A mudança é cirúrgica: 2-3 linhas no catch (logWarn + métrica) + 2-3 linhas no sucesso (logInfo de restored) + Sintoma 4 no runbook + 1 teste novo. Nada além disso."),

      separator(),

      // TEMPO 2
      h2("TEMPO 2 — Nó real: “Qual foi a parte mais difícil?”"),

      h3("2.1 Observabilidade: o que o sistema mostra quando quebra (Slide 46)"),
      slideRef("📖 Handout Aula 19, página 46"),
      quote("Logs estruturados + 4 estados de erro renderizados: loading, empty, error, partial. Quando o usuário reclama, o log responde “o que aconteceu?” sem você ter que reproduzir o bug. request-id no erro conecta o que o usuário viu com o que ficou no log do back."),
      p("→ O NÓ REAL: O hook useDashboardData tem dois ramos de erro completamente diferentes:"),
      bullet("1ª carga falha (temDados = false) → seta status='error' → o MockDashboardClient já emite logError('fetch.error') → fetchErrors sobe → o runbook cobre (Sintoma 1)", "bullets2"),
      bullet("Polling falha com dados em tela (temDados = true) → seta connectionLost=true → MAS: nenhum log emitido, fetchErrors não sobe, sem evento connection.lost", "bullets2"),
      apply("A dificuldade real é entender essa bifurcação e instrumentar SÓ o segundo ramo sem poluir o primeiro. Se eu usasse logError, inflaria fetchErrors junto com erros de primeira carga, poluindo a métrica existente."),

      h3("2.2 Requisito sem teste é alucinação (Slides 20-21)"),
      slideRef("📖 Handout Aula 19, páginas 20-21"),
      quote("FR — o que o sistema faz (uma função observável). NFR mensurável — quão bem ele faz (com número). Constraint — o que limita a solução. “Como eu provaria que isso foi atendido? Se você não consegue descrever o teste, o requisito ainda não existe.”"),
      apply("→ NO MEU CENÁRIO: O “requisito implícito” é: toda transição de estado de conexão (perdida/restaurada) DEVE ser observável via log estruturado e métrica. Meu teste prova isso: monta o hook com mock que sucede na 1ª carga e falha no polling, depois verifica que getObservabilitySnapshot() contém o evento connection.lost. Depois restaura e verifica connection.restored."),

      separator(),

      // TEMPO 3
      h2("TEMPO 3 — Solução + evidência: “Como prova que funciona?”"),

      h3("3.1 V&V: verificar ≠ validar (Slide 39)"),
      slideRef("📖 Handout Aula 19, página 39"),
      quote("Verificar = fazer certo (contra a especificação). A mudança faz o que o cenário pediu? Validar = fazer o que serve (contra a necessidade). Teste verifica; só gente valida. “Passou no teste” não é o mesmo que “resolveu”."),
      p("→ NO MEU CENÁRIO:"),
      bullet("VERIFICAÇÃO: O teste novo afirma que connection.lost aparece no snapshot quando o polling falha, e connection.restored quando volta. Isso verifica que o código faz o que o cenário pediu.", "bullets3"),
      bullet("VALIDAÇÃO: O Sintoma 4 no runbook prova que a mudança resolve o problema real — o operador agora consegue diagnosticar “quando caiu e por quanto tempo ficou degradado” sem reproduzir o incidente.", "bullets3"),

      h3("3.2 Estratégia de testes: 4 níveis (Slides 41-42)"),
      slideRef("📖 Handout Aula 19, páginas 41-42"),
      quote("4 níveis: unidade, integração, sistema, aceitação. Cada um prova uma coisa diferente. A Horta é IoT: integração e sistema dominam, porque o risco mora nas bordas entre peças. “Por que você escreveu o teste no nível que escreveu?”"),
      apply("→ NO MEU CENÁRIO: O teste é de INTEGRAÇÃO, não unitário. Ele testa o hook (useDashboardData) integrado com o módulo de observabilidade (observability.ts) via getObservabilitySnapshot(). Justificativa: o risco está na FRONTEIRA entre o hook e a observabilidade — um teste unitário do hook sozinho não pegaria a ausência de log."),

      h3("3.3 Regressão (Slide 43)"),
      slideRef("📖 Handout Aula 19, página 43"),
      quote("Toda mudança pode quebrar o que estava bom. Evidência de regressão = rodar o que já existia e provar que continua passando. “Achei que não quebrou” não é evidência. Rodar e mostrar verde é."),
      apply("→ NO MEU CENÁRIO: Rodo npm test depois da mudança. As 12 anteriores precisam continuar passando (9 arquivos, 12 testes). O output do Vitest salvo em docs/ops/evidencias/ é a prova de não-regressão. Na defesa: “rodei a suíte existente, 12 testes passaram + 1 novo, aqui está o output”."),

      h3("3.4 Inspeção: Fagan (Slide 40)"),
      slideRef("📖 Handout Aula 19, página 40"),
      quote("Inspeção formal acha 60-90% dos defeitos antes do teste. Checklist + revisão de PR já são inspeção contínua. Antes de congelar o fork, leia o seu próprio diff linha por linha com a checklist na frente."),
      apply("→ NO MEU CENÁRIO: Antes de congelar, leio meu diff com a checklist do PR template: descrição explica o porquê? Referencia o cenário C5? Evidência anexada? CI verde? Cada linha que adicionei tem justificativa? Auto-inspeção honesta antes da defesa."),

      separator(),

      // TEMPO 4
      h2("TEMPO 4 — Perturbação: “E se a restrição virasse X?”"),

      h3("4.1 ADR: anatomia da decisão (Slides 30-31)"),
      slideRef("📖 Handout Aula 19, páginas 30-31"),
      quote("Contexto → decisão → alternativas rejeitadas → consequências → quando não usar. “O código te diz COMO. O ADR te diz POR QUÊ — e quais opções falharam.” Decisão sem alternativa rejeitada é opinião, não engenharia."),
      p("→ MINHA DECISÃO (mini-ADR para a defesa):"),
      bullet("CONTEXTO: O ramo de polling com dados em tela não emite log nem incrementa métrica.", "bullets4"),
      bullet("DECISÃO: Usar logWarn('connection.lost') (não logError).", "bullets4"),
      bullet("ALTERNATIVA REJEITADA: Usar logError — inflaria fetchErrors junto com erros de primeira carga, poluindo a métrica que o Sintoma 1 do runbook já usa.", "bullets4"),
      bullet("CONSEQUÊNCIA: fetchErrors continua representando só erros fatais. Para o operador distinguir, o evento connection.lost aparece nos logs filtráveis.", "bullets4"),
      bullet("QUANDO NÃO USAR: Se no futuro quiser uma métrica separada (connectionLostCount), aí sim faz sentido um counter dedicado em vez de warn.", "bullets4"),

      h3("4.2 Perturbações prováveis que eu posso ensaiar"),
      slideRef("📖 Handout Aula 19, páginas 10-11 (defesa em 4 tempos)"),
      quote("“E se a restrição virasse X?” — A perturbação é o filtro de autoria. Quem entende adapta; quem só colou trava."),

      p("1. “E se o polling falhasse 5 vezes seguidas — você logaria 5 connection.lost?”"),
      apply("→ Resposta: Devo logar só a TRANSIÇÃO (false→true), não cada falha repetida. Verifico o estado anterior antes de logar."),

      p("2. “E se quisessem saber há quanto tempo está degradado?”"),
      apply("→ Resposta: O timestamp no log (campo ts) já dá isso. Diferença entre connection.lost.ts e connection.restored.ts = duração."),

      p("3. “E se logError fosse melhor que logWarn?”"),
      apply("→ Resposta: Depende do contrato da métrica fetchErrors. Se quiser separar, crio um counter dedicado (connectionLostCount). Hoje, inflar fetchErrors confunde o Sintoma 1 do runbook."),

      p("4. “E se a conexão ficasse intermitente (cai e volta a cada 30s)?”"),
      apply("→ Resposta: Cada transição gera um par lost/restored. O log mostra o padrão de intermitência. Se quiser debounce, é decisão nova com ADR próprio."),

      p("5. “E se o banner não sumisse quando a conexão voltasse?”"),
      apply("→ Resposta: O código já faz setConnectionLost(false) no sucesso (linha 42). Meu log connection.restored confirma isso. Se não sumisse, o log mostraria lost sem restored — diagnóstico direto."),

      separator(),

      // CHECKLIST
      h2("CHECKLIST FINAL — Antes de congelar o fork"),
      slideRef("📖 Handout Aula 19, página 38 (checklist de versionamento)"),

      checkbox("Branch nomeada com sentido: feat/cenario-c5-connection-observability", "checks"),
      checkbox("Commits atômicos: um por mudança lógica (instrumentação, runbook, teste)", "checks"),
      checkbox("Mensagens explicam o porquê, não só o quê", "checks"),
      checkbox("PR referencia o cenário C5 e descreve o que mudou + como provar", "checks"),
      checkbox("CI verde: 12 testes anteriores + 1 novo passando", "checks"),
      checkbox("Evidência salva em docs/ops/evidencias/", "checks"),
      checkbox("Sintoma 4 adicionado ao runbook", "checks"),
      checkbox("Auto-inspeção: li meu diff linha por linha", "checks"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  const out = "C:\\Users\\luisa.souza\\Documents\\guia-estudo-c5.docx";
  fs.writeFileSync(out, buffer);
  console.log("Arquivo criado: " + out);
});
