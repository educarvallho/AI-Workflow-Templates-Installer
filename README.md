# 🚀 AI Workflow Templates — Installer

Instalador CLI interativo que configura **workflows** e **templates** de desenvolvimento orientado por IA para as IDEs **Windsurf** e **Cursor**.

Os workflows implementam um fluxo completo de **Software Design Document (SDD)**: desde a criação do PRD, passando pela especificação técnica, até a geração e execução de tarefas — tudo via comandos `/slash` dentro da IDE.

---

## 📋 Pré-requisitos

- **Node.js** v14 ou superior
- **Windsurf** e/ou **Cursor** instalados

---

## ⚡ Instalação e Uso

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd <pasta-do-repositorio>

# 2. Instale as dependências
npm install

# 3. Execute o instalador
node install.js
```

O instalador irá:

1. **Detectar** seu sistema operacional (Windows, macOS ou Linux)
2. **Perguntar** o que deseja instalar/atualizar:
   - 📦 **Workflows + Templates + MCPs** — instalação completa
   - 📄 **Apenas Workflows + Templates** — sem configurar MCPs
   - 🔌 **Apenas MCPs** — atualizar/adicionar servidores MCP sem tocar nos workflows
3. **Perguntar** para qual IDE deseja instalar (Windsurf, Cursor ou ambos)
4. **Mostrar** os caminhos de destino e pedir confirmação (se instalar workflows/templates)
5. **Instalar workflows e templates** (se selecionado):
   - Copiar os templates para a pasta de templates global
   - Processar cada workflow — substituindo `{{TEMPLATES_DIR}}` pelos caminhos corretos
   - Instalar os workflows na pasta global da IDE escolhida
6. **Configurar MCPs** (se selecionado):
   - Permitir escolher quais MCPs instalar (Context7, Playwright)
   - Resolver API Keys (env var, browser, input manual)
   - Fazer merge inteligente no arquivo de config da IDE

---

## 📂 Caminhos por Sistema Operacional

### Windsurf

| SO      | Workflows (Global)                                        | Templates                                                     |
| ------- | --------------------------------------------------------- | ------------------------------------------------------------- |
| Windows | `C:\Users\<User>\.codeium\windsurf\global_workflows\`    | `C:\Users\<User>\.codeium\windsurf\TEMPLATES_WORKFLOWS\`     |
| macOS   | `~/.codeium/windsurf/global_workflows/`                   | `~/.codeium/windsurf/TEMPLATES_WORKFLOWS/`                    |
| Linux   | `~/.codeium/windsurf/global_workflows/`                   | `~/.codeium/windsurf/TEMPLATES_WORKFLOWS/`                    |

### Cursor

| SO      | Commands (Global)                      | Templates                                     |
| ------- | -------------------------------------- | --------------------------------------------- |
| Windows | `C:\Users\<User>\.cursor\commands\`    | `C:\Users\<User>\.cursor\TEMPLATES_WORKFLOWS\` |
| macOS   | `~/.cursor/commands/`                  | `~/.cursor/TEMPLATES_WORKFLOWS/`               |
| Linux   | `~/.cursor/commands/`                  | `~/.cursor/TEMPLATES_WORKFLOWS/`               |

> **Nota:** No Windsurf, os workflows globais ficam em `global_workflows`. No Cursor, os comandos globais ficam em `~/.cursor/commands/`.

---

## 📄 Workflows

Os workflows são invocados dentro da IDE digitando `/` seguido do nome do workflow.

### `/criar-codebase-techspec` — Documentar Codebase

Analisa um repositório existente e gera automaticamente um documento de **Especificação Técnica e Diretrizes de Arquitetura**. Ideal para onboarding e documentação de projetos legados ou novos.

**O que faz:**
- Reconhece a stack tecnológica (Java/Spring, NestJS, Next.js, Angular, Vue etc.)
- Identifica padrões arquiteturais (MVC, Clean Architecture, Hexagonal)
- Documenta convenções de código, nomenclatura e tratamento de erros
- Gera o arquivo `documentos/techspec-codebase.md`
- Cria uma regra Windsurf em `.windsurf/rules/techspec-codebase.md`

**Template utilizado:** `techspec-codebase-template.md`

---

### `/criar-prd` — Criar PRD (Product Requirements Document)

Guia interativo para criar um **Documento de Requisitos de Produto** completo e acionável.

**O que faz:**
- Faz perguntas de clarificação antes de gerar qualquer conteúdo
- Integra com Jira MCP para buscar contexto de negócio
- Gera o PRD seguindo o template padronizado
- Salva em `./tasks/prd-[nome-funcionalidade]/prd.md`

**Fluxo:** Esclarecer → Planejar → Redigir → Salvar → Reportar

**Template utilizado:** `prd-template.md`

---

### `/criar-tech-spec` — Criar Tech Spec (Especificação Técnica)

Transforma os requisitos de um PRD em **orientações técnicas e decisões arquiteturais** prontas para implementação.

**O que faz:**
- Analisa o PRD existente
- Realiza análise profunda do repositório (arquivos, módulos, dependências)
- Faz perguntas técnicas de clarificação
- Gera a Tech Spec com: arquitetura, componentes, interfaces, modelos, endpoints, testes
- Salva em `./tasks/prd-[nome-funcionalidade]/techspec.md`

**Pré-requisito:** PRD deve existir em `./tasks/prd-[nome-funcionalidade]/prd.md`

**Template utilizado:** `techspec-template.md`

---

### `/criar-tasks` — Criar Tasks (Lista de Tarefas)

Gera uma **lista detalhada de tarefas** de implementação baseada no PRD e na Tech Spec.

**O que faz:**
- Analisa PRD e Tech Spec existentes
- Mostra a lista de tasks high-level para aprovação antes de gerar
- Cria arquivo `tasks.md` com resumo e arquivos individuais `[num]_task.md`
- Cada tarefa inclui: subtarefas, critérios de sucesso, testes, complexidade (LOW/MEDIUM/HIGH)
- Segue sequenciamento lógico com dependências

**Pré-requisitos:**
- PRD em `./tasks/prd-[nome-funcionalidade]/prd.md`
- Tech Spec em `./tasks/prd-[nome-funcionalidade]/techspec.md`

**Templates utilizados:** `tasks.md` e `task.md`

---

### `/executar-task` — Executar Task

Identifica a próxima tarefa disponível e **implementa** o código seguindo o plano definido.

**O que faz:**
- Lê a definição da tarefa, PRD e Tech Spec
- Analisa objetivos, dependências e riscos
- Cria um plano de abordagem
- Implementa a solução seguindo padrões do projeto
- Executa e valida testes
- Marca a tarefa como completa em `tasks.md`

**Princípios:**
- Para tarefas de alta complexidade, segue **TDD (Red-Green-Refactor)**
- Utiliza Context7 MCP para consultar documentação de bibliotecas
- Nunca considera a tarefa completa sem todos os testes passando

---

## 📝 Templates

Os templates são arquivos Markdown usados como estrutura base pelos workflows. Eles são copiados para uma pasta global no sistema e referenciados pelos workflows durante a execução.

### `prd-template.md`

Template para Documentos de Requisitos de Produto. Contém seções para:
- Visão Geral
- Objetivos mensuráveis
- Histórias de Usuário
- Funcionalidades Principais (com requisitos funcionais numerados)
- Experiência do Usuário (UX/UI)
- Restrições Técnicas de Alto Nível
- Fora de Escopo
- Questões em Aberto

### `techspec-template.md`

Template para Especificações Técnicas. Contém seções para:
- Resumo Executivo
- Arquitetura do Sistema (componentes e responsabilidades)
- Design de Implementação (interfaces, modelos de dados, endpoints)
- Pontos de Integração
- Abordagem de Testes (unitários, integração, E2E)
- Sequenciamento de Desenvolvimento
- Monitoramento e Observabilidade
- Decisões Técnicas e Riscos

### `techspec-codebase-template.md`

Template para documentação técnica de codebases existentes. Contém seções para:
- Visão Geral do Projeto/Módulo
- Stack Tecnológico (linguagens, frameworks, banco de dados)
- Arquitetura e Padrões (por módulo/diretório)
- Engines e Abstrações Core
- Design de Código e Convenções (nomenclatura, tratamento de erros)
- Integrações Externas
- Pontos Críticos ("Gotchas")
- Mapa de Navegação

### `tasks.md`

Template para o resumo da lista de tarefas. Formato compacto com checkboxes e indicação de complexidade por tarefa.

### `task.md`

Template para tarefas individuais. Contém seções para:
- Visão Geral e nível de complexidade
- Requisitos obrigatórios
- Subtarefas (com checkboxes)
- Detalhes de Implementação (referência à Tech Spec)
- Critérios de Sucesso
- Testes (unitários e integração)
- Arquivos relevantes

---

## 🔄 Fluxo Completo de Uso (SDD)

O fluxo recomendado de uso dos workflows segue a metodologia **Software Design Document**:

```
1. /criar-prd              →  Define O QUÊ e POR QUÊ
2. /criar-tech-spec        →  Define COMO implementar
3. /criar-tasks            →  Quebra em tarefas incrementais
4. /executar-task           →  Implementa tarefa por tarefa
```

Para projetos existentes que precisam de documentação:

```
1. /criar-codebase-techspec  →  Documenta o codebase existente
```

---

## 🏗️ Estrutura do Projeto

```
.
├── install.js                              # Entry point (thin wrapper)
├── package.json                            # Dependências Node.js
├── README.md                               # Este arquivo
└── src/
    ├── cli.js                              # Interface interativa (banner, prompts)
    ├── config.js                           # Detecção de SO, caminhos, constantes
    ├── installer.js                        # Lógica de instalação (grava arquivos)
    ├── mcp-installer.js                    # Lógica de merge do config MCP
    ├── mcp-servers.js                      # Definições dos servidores MCP
    ├── processor.js                        # Substituição de paths e frontmatter
    ├── templates/                          # Conteúdo dos templates (embarcado no código)
    │   ├── index.js
    │   ├── prd-template.js
    │   ├── task.js
    │   ├── tasks.js
    │   ├── techspec-codebase-template.js
    │   └── techspec-template.js
    └── workflows/                          # Conteúdo dos workflows (embarcado no código)
        ├── index.js
        ├── criar-codebase-techspec.js
        ├── criar-prd.js
        ├── criar-tasks.js
        ├── criar-tech-spec.js
        └── executar-task.js
```

> **Nota:** Todo o conteúdo dos templates e workflows está embarcado diretamente no código-fonte (dentro de `src/`). Não há dependência de arquivos `.md` externos — o repositório é 100% auto-contido.

---

## 🔧 O que o instalador faz automaticamente

1. **Detecta o SO** — Usa os caminhos nativos do sistema (barras `\` no Windows, `/` no Unix)
2. **Adapta caminhos** — Substitui o placeholder `{{TEMPLATES_DIR}}` nos workflows pelo caminho real do sistema do usuário
3. **Adapta frontmatter** — Para o Cursor, remove o campo `auto_execution_mode` (específico do Windsurf) e garante que `description` exista em todos os workflows
4. **Cria diretórios** — Se as pastas de destino não existirem, cria automaticamente
5. **Gera templates** — Os arquivos `.md` de template são gerados a partir do conteúdo embarcado
6. **Gera workflows** — Cada workflow é processado e salvo no destino com os caminhos corretos
7. **Configura MCPs** (opcional) — Faz merge dos servidores MCP selecionados no arquivo de configuração da IDE, sem sobrescrever servidores já existentes

---

## 🛠️ Manutenção

Para editar um **template**, altere o arquivo correspondente em `src/templates/` (ex: `src/templates/prd-template.js`).

Para editar um **workflow**, altere o arquivo correspondente em `src/workflows/` (ex: `src/workflows/criar-prd.js`). Use o placeholder `{{TEMPLATES_DIR}}/nome-do-template.md` para referências a templates — ele será substituído pelo caminho real durante a instalação.

Para adicionar um novo workflow:
1. Crie `src/workflows/novo-workflow.js` exportando o conteúdo como string
2. Registre-o em `src/workflows/index.js`
3. Adicione os metadados em `WORKFLOW_META` dentro de `src/config.js`

Para adicionar um novo **servidor MCP**:
1. Adicione a definição em `src/mcp-servers.js` seguindo o formato existente
2. O instalador já oferecerá o novo MCP automaticamente no prompt

---

## 🔌 Configuração de MCPs

O instalador oferece a configuração automática de servidores MCP. Atualmente disponível:

| MCP | Descrição | Requer API Key |
| --- | --------- | -------------- |
| **Context7** | Busca documentação atualizada de qualquer biblioteca/framework em tempo real | Sim |
| **Playwright** | Automação de browser, testes E2E, screenshots e interação web | Não |

### Como funciona

Após instalar workflows e templates, o instalador pergunta se você deseja configurar MCPs. Se sim:

1. Selecione os MCPs desejados (checkbox)
2. Para MCPs que exigem API Key, o instalador tenta resolver a chave nesta ordem:
   - **Variável de ambiente** — se `CONTEXT7_API_KEY` estiver definida no sistema, é usada automaticamente
   - **Abertura do navegador** — oferece abrir o site do MCP para você gerar a chave
   - **Input manual** — solicita que você cole a API Key no terminal
3. O instalador faz **merge** no arquivo de configuração da IDE — servidores já existentes **não são sobrescritos**

### Context7 — Obtendo a API Key

1. Acesse **[https://context7.com/](https://context7.com/)**
2. Faça login (GitHub ou Google)
3. Vá em **Settings → API Keys**
4. Clique em **Generate API Key**
5. Copie a chave gerada

Você pode fornecer a chave de 3 formas:

#### Opção 1: Variável de ambiente (recomendado)

Defina `CONTEXT7_API_KEY` no seu sistema antes de rodar o instalador:

**Windows (PowerShell):**
```powershell
$env:CONTEXT7_API_KEY = "sua-api-key-aqui"
node install.js
```

**Windows (permanente via Sistema):**
```powershell
[System.Environment]::SetEnvironmentVariable("CONTEXT7_API_KEY", "sua-api-key-aqui", "User")
```

**macOS / Linux:**
```bash
export CONTEXT7_API_KEY="sua-api-key-aqui"
node install.js
```

Para tornar permanente, adicione o `export` ao seu `~/.bashrc`, `~/.zshrc` ou `~/.profile`.

#### Opção 2: Abrir no navegador durante instalação

O instalador oferece abrir `https://context7.com/` automaticamente no seu navegador para que você gere a chave e cole no terminal.

#### Opção 3: Input manual no terminal

Se você já possui a chave, basta colá-la quando solicitado pelo instalador.

### Arquivos de configuração MCP por IDE

| IDE | Arquivo | Caminho (Windows) | Caminho (macOS/Linux) |
| --- | ------- | ------------------ | --------------------- |
| **Windsurf** | `mcp_config.json` | `C:\Users\<User>\.codeium\windsurf\mcp_config.json` | `~/.codeium/windsurf/mcp_config.json` |
| **Cursor** | `mcp.json` | `C:\Users\<User>\.cursor\mcp.json` | `~/.cursor/mcp.json` |

### Formato do arquivo gerado

Com API Key:

```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "sua-api-key-aqui"
      }
    }
  }
}
```

Sem API Key (funcionalidade limitada):

```json
{
  "mcpServers": {
    "context7": {
      "serverUrl": "https://mcp.context7.com/mcp"
    }
  }
}
```

### Merge inteligente

Se o arquivo de configuração MCP já existir com outros servidores, o instalador **preserva todos os servidores existentes** e apenas adiciona os novos. Servidores que já estiverem configurados **não são sobrescritos**.

---

## ❓ FAQ

**Posso instalar para ambas as IDEs?**
Sim. Selecione a opção "Ambos" durante a instalação. Os templates e workflows serão instalados nos caminhos de ambas as IDEs.

**Posso executar o instalador mais de uma vez?**
Sim. Os workflows e templates serão sobrescritos com a versão mais recente. Servidores MCP já configurados **não são sobrescritos** — apenas novos são adicionados.

**Os workflows funcionam em qualquer linguagem/framework?**
Sim. Os workflows foram projetados para serem agnósticos de linguagem. Eles se adaptam ao stack encontrado no repositório.

**Preciso do Jira MCP configurado?**
Alguns workflows (`/criar-prd`, `/criar-tech-spec`) mencionam o Jira MCP para buscar regras de negócio. Se não configurado, os workflows ainda funcionam, mas sem a integração com Jira.

**Preciso do Context7 MCP configurado?**
Os workflows `/executar-task` e `/criar-tech-spec` utilizam o Context7 MCP para consultar documentação de bibliotecas. Se não configurado, a IA usará seu conhecimento interno. Para melhor resultado, configure com API Key.

**E se eu já tenho um arquivo MCP config com outros servidores?**
O instalador faz merge — seus servidores existentes permanecem intactos. Apenas os novos MCPs selecionados são adicionados.

---

## 📄 Licença

MIT
