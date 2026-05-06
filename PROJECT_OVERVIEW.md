# ZeroCLI - Documentação do Projeto

**Versão**: 0.9.1 (Maio 2026)  
**Status**: Em desenvolvimento ativo  
**Repositório**: [Duheso/ZeroCLI](https://github.com/Duheso/ZeroCLI)  
**Pacote npm**: `@duheso/zerocli`

---

## 📋 Índice

1. [Visão Geral do Projeto](#visão-geral-do-projeto)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Tecnologias Principais](#tecnologias-principais)
4. [Fluxo de Inicialização](#fluxo-de-inicialização)
5. [Funcionalidades Principais](#funcionalidades-principais)
6. [Sistema de Configuração](#sistema-de-configuração)
7. [Build e Testes](#build-e-testes)
8. [Estado Atual do Projeto](#estado-atual-do-projeto)
9. [Estatísticas Chave](#estatísticas-chave)

---

## 🎯 Visão Geral do Projeto

**ZeroCLI** é um agente de IA multi-provedor, dirigido por terminal, que funciona como interface unificada para múltiplos backends de LLM.

### O Que Faz

- **Suporte Multi-Provedor**: Conecta-se a múltiplos LLMs em uma única CLI:
  - Claude (Anthropic API nativa)
  - GPT (OpenAI)
  - Gemini (Google)
  - GitHub Models
  - Modelos locais (Ollama, LM Studio)
  - AWS Bedrock, Google Vertex AI, Azure
  - Provedores comunitários (DeepSeek, Groq, Mistral, etc.)

- **Fluxo de Trabalho Dirigido por Ferramentas**: Executa comandos bash, edita arquivos, busca código, cria sub-agentes

- **Interface de IA Agentic**: 
  - Conversas multi-turno com streaming de tokens
  - Execução de ferramentas com múltiplas chamadas
  - Sub-agentes especializados (Explore, Plan, Verification, etc.)
  - Modo Coordinator para orquestração multi-agentes
  - Modo Teammate para programação em par

- **Gerenciamento de Contexto**:
  - Sistema de memória durável
  - Persistência de sessão
  - Rastreamento de orçamento de tokens
  - Colapso inteligente de contexto

- **Integração MCP**: Protocolo Model Context Protocol completo com execução de recursos

---

## 📁 Estrutura de Diretórios

```
ZeroCLI/
├── bin/
│   └── zero                       # Launcher do Node.js (wrapper de configuração de heap)
│
├── src/                           # Código fonte TypeScript (core)
│   ├── main.tsx                   # Ponto de entrada principal (232KB)
│   ├── QueryEngine.ts             # Máquina de estado de conversa (47KB)
│   ├── query.ts                   # Orquestração de chamadas API (74KB)
│   ├── Tool.ts                    # Camada abstrata de ferramentas (30KB)
│   ├── commands.ts                # Registro de comandos slash (26KB)
│   ├── tools.ts                   # Registro de ferramentas (16KB)
│   │
│   ├── commands/                  # 100+ comandos slash
│   │   ├── provider/              # Gerenciamento de provedores
│   │   ├── mcp/                   # Gerenciamento de servidores MCP
│   │   ├── config/                # Configurações
│   │   ├── resume/                # Retomada de sessão
│   │   └── [90+ mais comandos]
│   │
│   ├── tools/                     # 56 implementações de ferramentas
│   │   ├── AgentTool/             # Criação e gerenciamento de sub-agentes
│   │   ├── BashTool/              # Execução de shell
│   │   ├── FileEditTool/          # Modificação de arquivos
│   │   ├── FileReadTool/          # Leitura de arquivos
│   │   ├── GrepTool/              # Busca em código
│   │   ├── GlobTool/              # Correspondência de padrões
│   │   ├── MCPTool/               # Execução de recursos MCP
│   │   ├── LSPTool/               # Integração com Language Server
│   │   └── [50+ ferramentas especializadas]
│   │
│   ├── services/                  # 28 módulos de serviço
│   │   ├── api/                   # Clientes API de provedores
│   │   ├── mcp/                   # Cliente e gerenciador de MCP
│   │   ├── analytics/             # Telemetria e feature flags
│   │   ├── plugins/               # Sistema de plugins
│   │   ├── voice.ts               # Integração de voz (STT)
│   │   ├── vcr.ts                 # Gravação/reprodução de sessão
│   │   └── [20+ mais serviços]
│   │
│   ├── components/                # 130+ componentes React/Ink
│   │   ├── App.tsx                # Componente raiz
│   │   ├── Messages.tsx            # Exibição de mensagens
│   │   ├── StatusLine.tsx          # Barra de status
│   │   ├── TextInput.tsx           # Input de prompt
│   │   ├── Spinner.tsx             # Indicador de progresso
│   │   └── [100+ componentes especializados]
│   │
│   ├── hooks/                     # Hooks customizados
│   │   ├── useCanUseTool.ts        # Sistema de permissões
│   │   └── [hooks de feature]
│   │
│   ├── tasks/                     # Camada abstrata de tarefas
│   │   ├── LocalMainSessionTask.ts
│   │   ├── LocalShellTask/
│   │   ├── LocalAgentTask/
│   │   └── [tarefas de fluxo]
│   │
│   ├── skills/                    # Sistema de habilidades (skills)
│   │   ├── bundled/               # Skills integradas
│   │   └── loadSkillsDir.ts        # Loader de skills
│   │
│   ├── utils/                     # 100+ módulos utilitários
│   │   ├── api.ts                  # Utilitários de API
│   │   ├── auth.ts                 # Autenticação e credenciais
│   │   ├── config.ts               # Gerenciamento de settings
│   │   ├── model/                  # Seleção e roteamento de modelos
│   │   ├── bash/                   # Utilitários de shell
│   │   ├── secureStorage/          # Armazenamento de credenciais
│   │   └── [60+ utilitários]
│   │
│   ├── types/                     # Definições de tipos TypeScript
│   │   ├── message.ts              # Tipos de mensagem
│   │   ├── permissions.ts          # Modelo de permissões
│   │   └── [tipos específicos de domínio]
│   │
│   ├── context/                   # Gerenciamento de contexto/estado
│   ├── state/                     # Estado da aplicação (AppState.tsx)
│   ├── entrypoints/               # Bootstrapping de entrada
│   │   ├── cli.tsx                 # Inicialização CLI
│   │   ├── init.ts                 # Sequência de startup
│   │   └── mcp.ts                  # Setup do cliente MCP
│   │
│   ├── proto/                     # Definições de protocolo gRPC
│   ├── grpc/                      # Implementação de servidor gRPC
│   ├── ink/                       # Engine de renderização de terminal
│   ├── migrations/                # Migrações de banco de dados
│   ├── plugins/                   # Sistema de plugins
│   ├── memdir/                    # Diretório de memória durável
│   └── __tests__/                 # Testes de integração
│
├── dist/                          # Bundle compilado
│   ├── cli.mjs                    # Bundle principal (~20MB)
│   ├── cli.mjs.map                # Mapa de fonte (~41MB)
│   └── vendor/ripgrep/            # Binário ripgrep integrado
│
├── vscode-extension/              # Extensão VS Code
│   └── zero-vscode/               # UI do centro de controle
│
├── chrome-extension/              # Extensão Chrome
│   ├── manifest.json
│   ├── background.js              # Service worker
│   └── popup.js/html              # UI do popup
│
├── scripts/                       # Scripts de build e dev
│   ├── build.ts                   # Configuração do bundler Bun
│   ├── provider-*.ts              # Scripts de setup de provedores
│   └── [10+ scripts build/dev]
│
├── docs/                          # Documentação do usuário
├── package.json                   # Metadata npm
├── tsconfig.json                  # Configuração TypeScript
└── PLAYBOOK.md                    # Guia do desenvolvedor

```

---

## 🛠️ Tecnologias Principais

### Runtime e Build

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Node.js** | 20.0.0+ | Runtime principal |
| **Bun** | Latest | Build tool e bundler |
| **TypeScript** | 5.9.3 | Linguagem de programação (strict mode) |
| **React** | 19.2 | Biblioteca de componentes |
| **React Compiler** | Latest | Otimização automática |

### Integrações de LLM

| Provedor | SDK/Biblioteca | Versão |
|----------|---------------|--------|
| **Anthropic Claude** | @anthropic-ai/sdk | 0.81 |
| **AWS Bedrock** | @anthropic-ai/bedrock-sdk | 0.26 |
| **Google Vertex** | @anthropic-ai/vertex-sdk | 0.14 |
| **OpenAI / OpenAI-compatible** | @openai/sdk + axios | 1.15 |
| **Google Gemini** | Custom client + google-auth | 9.15 |
| **Ollama** | OpenAI-compatible | N/A |

### Protocolo e Comunicação

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **Model Context Protocol** | @modelcontextprotocol/sdk | 1.29 |
| **gRPC** | @grpc/grpc-js | 1.14 |
| **WebSocket** | ws | 8.20 |

### Ferramentas e Busca

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **ripgrep** | (bundled) | Busca rápida em arquivos |
| **Fuse.js** | 7.1 | Matching fuzzy |
| **Commander.js** | 12.1 | Parsing de comandos CLI |
| **Chalk** | 5.6 | Cores de terminal |

### Dados e Armazenamento

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **zod** | 3.25 | Validação de schema em runtime |
| **jsonc-parser** | Latest | Parsing de JSON com comentários |
| **yaml** | 2.8 | Parsing de YAML |
| **lru-cache** | 11.2 | Cache em memória |

### Observabilidade

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| **OpenTelemetry** | Latest | Traces, metrics, logs |
| **GrowthBook** | Integration | Feature flags |

---

## 🚀 Fluxo de Inicialização

### 1. Launcher (Node.js) - `/bin/zero`

```bash
zero                              # Executa /bin/zero
  ↓
# Mapeia variáveis de ambiente COPILOT_* → OpenAI nativo
# Configura tamanho de heap V8 (8GB para CCR remoto, 6GB mínimo local)
# Spawn processo filho com dist/cli.mjs
# Trata código de saída especial 75 para auto-updater
```

### 2. Bootstrap - `src/entrypoints/cli.tsx`

1. Polyfill `globalThis.File` para compatibilidade Node 18
2. Desabilita experimentais por padrão
3. Fast-path para `--version` (carregamento zero de módulos)
4. Aplica flags de provedor cedo (`--provider`)
5. Ativa sistema de configuração (lê `~/.zerocli/settings.json`)
6. Valida configuração de provedor ou sai com erro útil

### 3. Main Application - `src/main.tsx`

```typescript
// 1. Inicialização paralela
profileCheckpoint('main_tsx_entry')
startMdmRawRead()                 // MDM config (macOS/Windows)
startKeychainPrefetch()           // Leitura segura em paralelo

// 2. Feature gates (bun:bundle)
feature('VOICE_MODE')             // false
feature('COORDINATOR_MODE')       // true
feature('BUILTIN_EXPLORE_AGENTS') // true
feature('MEMORY_EXTRACTION')      // true

// 3. Async main()
parseArgs()
initConfigs()
trustDialog()
prefetch(aws, gcp, ollama, mcp)
bootstrapApp(growthbook, telemetry)
createAppState()
launchReactRender()
```

### 4. React/Ink Render Loop

```
App (root)
├── FullscreenLayout
│   ├── Messages (componente virtual)
│   ├── StatusLine (barra de status)
│   └── TextInput (input do prompt)
```

### 5. Main Event Loop

```
QueryEngine.ts (máquina de estado)
    ↓
query.ts (orquestração)
    ↓
API Call (streaming)
    ↓
Tool Loop (execute ferramentas)
    ↓
Response → Output
```

---

## ✨ Funcionalidades Principais

### Conversas e Agentes

- ✅ **Conversas multi-turno** com streaming de tokens
- ✅ **Execução de ferramentas** com múltiplas chamadas
- ✅ **Sub-agentes** (AgentTool) com delegação
- ✅ **Modo Coordinator** - Orquestração multi-agente
- ✅ **Modo Teammate** - Programação em par com compartilhamento de contexto
- ✅ **Auto-aprovação** - Classificador treinado em transcript
- ✅ **Sistema de permissões** - Trust prompts para operações sensíveis

### Gerenciamento de Provedores

- ✅ **Seletor de provedor** (comando `/provider`) - Wizard guiado
- ✅ **Perfis salvos** - `.zerocli-profile.json` por projeto
- ✅ **Auto-detecção** - Ollama, LM Studio, servidores locais
- ✅ **Modo zero-config** - Mapeamento de variáveis de ambiente
- ✅ **Fluxos OAuth** - Codex, GitHub Models, Claude.ai
- ✅ **Armazenamento de credenciais** - Keychain (macOS), credential manager (Windows)
- ✅ **Roteamento de modelos** - Diferentes modelos por agente

### Gerenciamento de Contexto

- ✅ **Sistema de memória** (memdir/) - Memórias duráveis extraídas
- ✅ **Persistência de sessão** - Armazenamento e retomada de transcript
- ✅ **Colapso de contexto** - Compactação inteligente para orçamento de tokens
- ✅ **Rastreamento de orçamento** - Avisos quando aproximar-se do limite
- ✅ **Rastreamento de custo** - Cálculo por ferramenta e modelo

### Ferramentas e Integrações

- ✅ **56 ferramentas integradas**: Bash, FileRead/Edit/Write, Glob, Grep, Agentes, MCP, LSP, etc.
- ✅ **Cliente MCP** - Suporte completo ao Model Context Protocol
- ✅ **Sistema de Skills** - Skills carregáveis de diretórios
- ✅ **Plugins** - Comandos customizados de `~/.zerocli/plugins/`

### UI e Interação

- ✅ **Renderer Ink customizado** - React com reconciliador customizado
- ✅ **Browser de mensagens** - Virtual scrolling, busca, histórico
- ✅ **Visualização de diff** - Diffs estruturados para edições
- ✅ **Suporte a imagens** - URLs e inputs base64
- ✅ **Syntax highlighting** - Múltiplas linguagens
- ✅ **Keybindings** - Modos Vim/Emacs, customizáveis
- ✅ **Temas** - Light/dark, color picker
- ✅ **Seletor de esforço** - "fast", "medium", "thorough"
- ✅ **Seletor de idioma** - i18n (en, pt-BR)

### Recursos Avançados

- ✅ **Modo voz** (condicional) - Push-to-talk com STT
- ✅ **Auto-update** - npm-global e OS package manager
- ✅ **Exportação de sessão** - JSONL transcript export
- ✅ **Compartilhamento de sessão** - Upload para nuvem
- ✅ **Extensão Chrome** - Integração de navegador com MCP
- ✅ **Extensão VS Code** - Centro de controle + launch integration
- ✅ **Servidor gRPC** - Modo headless para integrações

---

## ⚙️ Sistema de Configuração

### Hierarquia de Configuração

(Precedência maior primeiro)

1. **Flags CLI** - `--provider`, `--model`, etc.
2. **Variáveis de ambiente**:
   - `CLAUDE_CODE_*` - Config interna
   - `COPILOT_*` - Mapeamento shim OpenAI
   - Provider-específicas: `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, etc.
3. **User settings** - `~/.zerocli/settings.json`
4. **Project settings** - `.zerocli-profile.json`
5. **Defaults** - Hardcoded no source

### Arquivo de User Settings

`~/.zerocli/settings.json`:

```json
{
  "agentModels": {
    "model-name": {
      "base_url": "https://...",
      "api_key": "..."
    }
  },
  "agentRouting": {
    "Explore": "model-name",
    "Plan": "model-name",
    "Verification": "model-name"
  },
  "uiLanguage": "pt-BR",
  "outputStyle": "full",
  "keyBindings": {
    "category.command": "key-sequence"
  },
  "theme": "dark",
  "autoUpdaterDisabled": false,
  "fastMode": false,
  "tokenBudgetMode": "normal",
  "hooks": {
    "before_query": [],
    "after_tool_use": []
  }
}
```

### Perfil de Projeto

`.zerocli-profile.json`:

```json
{
  "provider": "openai|gemini|anthropic|github|ollama",
  "model": "model-id",
  "baseUrl": "https://...",
  "apiKey": "sk-..."
}
```

### Exemplos de Variáveis de Ambiente

```bash
# OpenAI
export OPENAI_API_KEY=sk-...
export OPENAI_MODEL=gpt-4o
export OPENAI_BASE_URL=https://api.openai.com/v1

# Ollama (local)
export OPENAI_BASE_URL=http://localhost:11434/v1
export OPENAI_MODEL=llama3.2

# Gemini
export GEMINI_API_KEY=...

# Anthropic
export ANTHROPIC_API_KEY=sk-ant-...

# GitHub
export GITHUB_TOKEN=ghp_...
```

---

## 🔨 Build e Testes

### Sistema de Build - Bun Bundler

**Arquivo**: `scripts/build.ts`

**Processo**:

1. **Pré-processamento de feature flags** - Remove imports de `bun:bundle`, substitui `feature('FLAG')` por boolean
2. **Injeção de plugins** - Inline de metadata de build
3. **Bundle único** - `dist/cli.mjs` (~20MB)
4. **Source map** - `dist/cli.mjs.map` (~41MB)
5. **Vendor extraction** - Ripgrep binary para `dist/vendor/ripgrep/`

### Feature Flags

```typescript
// Desabilitadas (infraestrutura Anthropic)
VOICE_MODE: false,
PROACTIVE: false,
KAIROS: false,

// Habilitadas (open source)
COORDINATOR_MODE: true,
BUILTIN_EXPLORE_PLAN_AGENTS: true,
BUDDY: true,
MONITOR_TOOL: true,
EXTRACT_MEMORIES: true,
ULTRATHINK: true,
TOKEN_BUDGET: true,
```

### Comandos de Build

```bash
# Build completo
bun run build

# Build + run CLI
bun run dev

# Build + verificação de versão
bun run smoke

# Build + auditoria de privacidade
bun run build:verified
```

### Testes - Bun Test Runner

**Test files**: 151 arquivos de teste (`.test.ts`, `.test.tsx`)

```bash
# Suite completo de testes
bun test

# Coverage com LCOV + heatmap
bun test:coverage

# Testes apenas de provedor
bun test:provider

# Arquivo específico
bun test src/path/to/file.test.ts
```

### Scripts de Desenvolvimento

```bash
bun run dev:profile              # Seletor de provedor
bun run dev:profile:fast         # Modo local Ollama
bun run dev:openai               # Provedor OpenAI
bun run dev:gemini               # Provedor Gemini
bun run dev:ollama               # Ollama local
bun run dev:grpc                 # Servidor gRPC
bun run typecheck                # Check TypeScript strict
bun run doctor:runtime           # Diagnósticos de sistema
bun run verify:privacy           # Auditoria de privacidade
bun run hardening:strict         # Validação completa CI
```

---

## 📊 Estado Atual do Projeto

### Release Recente

**Versão**: 0.9.1 (1º de Maio de 2026)  
**Último commit**: `2c6b78b` (6 de Maio de 2026, 10:40:29 UTC-3)

### Commits Recentes

- **v0.9.1**: Corrigido tratamento de perfil de provedor em startup fresh
- **v0.8.8**: Múltiplas correções de provedor, UI e API
- **Refactor**: `.claude` → `.zerocli` migração de config
- **Feature**: Auto-restart da CLI após update bem-sucedido
- **Fix**: Problemas de conexão e service worker da extensão Chrome
- **Remove**: Branding Claude, gates de subscription de extensions
- **Wave**: 80+ correções TypeScript em services, tools, components

### Arquivos Não Commitados

```
M .zerocli/settings.local.json
M dist/cli.mjs
M src/hooks/notifs/useNpmDeprecationNotification.tsx
```

### Áreas de Desenvolvimento Ativo

1. **Ecossistema de provedores** - Suporte a 10+ provedores LLM
2. **Integração MCP** - Suporte completo ao Protocol com handling de recursos
3. **Sistema de agentes** - Sub-agentes, coordinator, teammates
4. **Memória e contexto** - Auto-extração, compressão, orçamento
5. **UI/UX** - Renderer customizado, accessibility, i18n
6. **Integrações** - Extensão Chrome, VS Code, servidores gRPC
7. **Performance** - Orçamento de tokens, colapso de contexto

### Saúde do Repositório

- ✅ Branch main limpo e atualizado com origin
- ✅ 12+ worktrees criadas para desenvolvimento paralelo
- ✅ Automação de release via release-please
- ✅ Comunidade ativa em GitHub Discussions

---

## 📈 Estatísticas Chave

| Métrica | Valor |
|--------|-------|
| **Arquivos TypeScript** | 576+ TSX, 1000+ TS |
| **Linhas de Código** | ~400K LOC (src/) |
| **Comandos CLI** | 100+ slash commands |
| **Ferramentas Integradas** | 56 tools |
| **Componentes UI** | 130+ React/Ink |
| **Módulos de Serviço** | 28 major domains |
| **Provedores LLM** | 10+ |
| **Arquivos de Teste** | 151 test files |
| **Tamanho do Bundle** | 20MB (cli.mjs), 41MB (source map) |
| **Dependências npm** | 100+ packages |
| **Linguagem Primária** | TypeScript/React |
| **Requerimento Node.js** | 20.0.0+ |
| **Build Tool** | Bun |
| **Licença** | MIT-compatible |

---

## 🎓 Para Começar

### Instalação Rápida

```bash
# npm global
npm install -g @duheso/zerocli

# ou via Bun
bun install -g @duheso/zerocli

# ou desenvolvimento local
git clone https://github.com/Duheso/ZeroCLI
cd ZeroCLI
bun install
bun run dev
```

### Primeiro Uso

```bash
# Seletor de provedor (wizard guiado)
zero /provider

# Ou com variável de ambiente
export OPENAI_API_KEY=sk-...
zero

# Listar comandos disponíveis
zero /help
```

### Próximos Passos

- 📖 Leia o [PLAYBOOK.md](PLAYBOOK.md) para desenvolvimento
- 🔍 Explore [docs/](docs/) para documentação do usuário
- 💬 Pergunte no [GitHub Discussions](https://github.com/Duheso/ZeroCLI/discussions)
- 🐛 Reporte bugs em [GitHub Issues](https://github.com/Duheso/ZeroCLI/issues)

---

**Última atualização**: 6 de Maio de 2026  
**Gerado por**: Zero CLI Agent Explorer
