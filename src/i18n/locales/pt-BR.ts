// Português Brasileiro (pt-BR) locale strings for Zero CLI UI
import type { TranslationKeys } from './en.js'

export const ptBR: TranslationKeys = {
  welcomeToZeroCLI: 'Bem-vindo ao Zero CLI',
  welcomeToClaudeCode: 'Bem-vindo ao Claude Code',

  // Onboarding – security step
  securityNotes: 'Notas de segurança:',
  claudeCanMakeMistakes: 'O Claude pode cometer erros',
  reviewClaudeResponses:
    'Você deve sempre revisar as respostas do Claude, especialmente ao\nexecutar código.',
  promptInjectionRisk:
    'Devido a riscos de injeção de prompt, use apenas com código de sua confiança',
  forMoreDetailsSee: 'Para mais detalhes, consulte:',

  // Press Enter
  pressEnterToContinue: 'Pressione',
  pressEnterBold: 'Enter',
  pressEnterSuffix: 'para continuar\u2026',

  // Interrupted
  interrupted: 'Interrompido',
  whatShouldClaudoDoInstead: 'O que o Claude deve fazer em vez disso?',

  // Exit / Goodbye
  goodbyeMessages: ['Tchau!', 'Até logo!', 'Falou!', 'Até mais!'],

  // Language picker
  enterPreferredLanguage: 'Digite seu idioma preferido para respostas e voz:',
  leaveEmptyForDefault: 'Deixe vazio para o padrão (Inglês)',
  languagePlaceholder: 'ex.: Japanese, \u65e5\u672c\u8a9e, Espa\u00f1ol',

  // Help
  claudeUnderstandsCodebase:
    'O Claude entende seu código-fonte, faz edições com sua permissão e executa comandos \u2014 direto do seu terminal.',
  shortcuts: 'Atalhos',

  // Cost threshold dialog
  spentOnProvider: (amount: string, provider: string) =>
    `Você gastou ${amount} na ${provider} nesta sessão.`,
  learnMoreCosts: 'Saiba mais sobre como monitorar seus gastos:',
  gotItThanks: 'Entendido, obrigado!',

  // Approve API key
  doYouWantToUseApiKey: 'Deseja usar esta chave de API?',
  yes: 'Sim',
  no: 'Não',

  // Doctor screen
  failedToFetchVersions: 'Falha ao buscar versões',
  stableVersion: 'Versão estável:',
  latestVersion: 'Versão mais recente:',

  // Command descriptions
  cmd_help: 'Mostrar ajuda e comandos disponíveis',
  cmd_config: 'Abrir painel de configurações',
  cmd_clear: 'Limpar histórico da conversa e liberar contexto',
  cmd_commit: 'Criar um commit git',
  cmd_review: 'Revisar um pull request',
  cmd_init: 'Inicializar arquivo de instruções do projeto com documentação da base de código',
  cmd_memory: 'Editar arquivos de memória do Claude',
  cmd_mcp: 'Gerenciar servidores MCP',
  cmd_resume: 'Retomar uma conversa anterior',
  cmd_model: 'Trocar o modelo de IA',
  cmd_vim: 'Alternar entre os modos de edição Vim e Normal',
  cmd_doctor: 'Verificar saúde do sistema e configuração',
  cmd_cost: 'Mostrar o custo total e duração da sessão atual',
  cmd_compact: 'Compactar conversa para liberar contexto. Opcional: /compact [instruções para resumo]',
  cmd_export: 'Exportar a conversa atual para arquivo ou área de transferência',
  cmd_diff: 'Ver alterações não confirmadas e diffs por turno',
  cmd_version: 'Mostrar informações de versão',
  cmd_exit: 'Sair do programa',
  cmd_stats: 'Mostrar estatísticas e atividade de uso do Claude Code',
  cmd_tasks: 'Listar e gerenciar tarefas em segundo plano',
  cmd_add_dir: 'Adicionar um novo diretório de trabalho',
  cmd_feedback: 'Enviar feedback sobre o Claude Code',
  cmd_voice: 'Ativar/desativar modo de voz',
  cmd_ide: 'Gerenciar integrações com IDE e mostrar status',
  cmd_provider: 'Gerenciar perfis de provedores de API',
  cmd_plan: 'Ativar modo de planejamento ou ver o plano da sessão atual',
  cmd_rename: 'Renomear a conversa atual',
  cmd_release_notes: 'Ver notas de lançamento',
  cmd_upgrade: 'Fazer upgrade para o Max com limites maiores e mais Opus',
  cmd_auto_fix: 'Configurar correção automática: executar lint/testes após edições',
  cmd_insights: 'Gerar um relatório analisando suas sessões do Claude Code',
  cmd_security_review: 'Concluir uma revisão de segurança das alterações pendentes',
  cmd_keybindings: 'Abrir ou criar seu arquivo de configuração de atalhos',
  cmd_agents: 'Gerenciar configurações de agentes',
  cmd_session: 'Mostrar URL da sessão remota e QR code',
  cmd_mobile: 'Mostrar QR code para baixar o aplicativo Claude para celular',
  cmd_usage: 'Mostrar limites de uso do plano',
  cmd_tag: 'Alternar uma etiqueta pesquisável na sessão atual',
  cmd_buddy: 'Criar, interagir e gerenciar seu companheiro Open Claude',
  cmd_wiki: 'Inicializar e inspecionar o wiki do projeto Zero CLI',
  cmd_bridge: 'Conectar este terminal para sessões de controle remoto',
  cmd_theme: 'Mudar o tema',
  cmd_output_style: 'Obsoleto: use /config para mudar o estilo de saída',
  cmd_extra_usage: 'Configurar uso extra para continuar trabalhando ao atingir limites',
  cmd_privacy: 'Ver e atualizar suas configurações de privacidade',
  cmd_permissions: 'Gerenciar regras de permissão de ferramentas (permitir e bloquear)',
  cmd_effort: 'Definir nível de esforço para uso do modelo',
  cmd_copy: 'Copiar a última resposta para a área de transferência (ou /copy N para a N-ésima resposta)',
  cmd_reload_plugins: 'Ativar alterações de plugins pendentes na sessão atual',
  cmd_branch: 'Criar um branch da conversa atual neste ponto',
  cmd_sandbox_toggle: 'Ativar/desativar modo sandbox',
  cmd_install: 'Instalar o Claude Code globalmente',
  cmd_context: 'Visualizar uso de contexto atual como grade colorida',
  cmd_login: 'Entrar na Anthropic',
  cmd_logout: 'Sair da conta Anthropic',
  cmd_advisor: 'Configurar o modelo advisor',

  // Command descriptions – novos
  cmd_skills: 'Listar as skills disponíveis',
  cmd_rewind: 'Restaurar o código e/ou a conversa a um ponto anterior',
  cmd_btw: 'Fazer uma pergunta rápida sem interromper a conversa principal',
  cmd_hooks: 'Ver configurações de hooks para eventos de ferramentas',
  cmd_status: 'Mostrar status do Claude Code: versão, modelo, conta, conectividade de API e ferramentas',
  cmd_stickers: 'Pedir adesivos do Claude Code',
  cmd_terminal_setup: 'Instalar atalho Shift+Enter para novas linhas',
  cmd_terminal_setup_apple: 'Ativar atalho Option+Enter para novas linhas e sino visual',
  cmd_onboard_github: 'Configuração interativa do GitHub Copilot: login OAuth armazenado com segurança',
  cmd_cache_probe: 'Enviar requisições idênticas para testar cache de prompt (resultados no log de depuração)',
  cmd_context_ni: 'Mostrar uso atual de contexto',
  cmd_model_dynamic: (model: string) => `Definir o modelo de IA para o Claude Code (atualmente ${model})`,
  cmd_login_switch: 'Trocar conta Anthropic',
  cmd_login_signin: 'Entrar com sua conta Anthropic',
  cmd_plugin: 'Gerenciar plugins do Claude Code',
  cmd_chrome: 'Configurações do Claude no Chrome (Beta)',
  cmd_install_slack: 'Instalar o aplicativo Claude para Slack',
  cmd_color: 'Definir a cor da barra de prompt para esta sessão',
  cmd_thinkback: 'Seu resumo do Claude Code de 2025',
  cmd_thinkback_play: 'Reproduzir a animação do thinkback',
  cmd_files: 'Listar todos os arquivos no contexto atual',
  cmd_pr_comments: 'Obter comentários de um pull request do GitHub',
  cmd_remote_env: 'Configurar o ambiente remoto padrão para sessões de teleporte',
  cmd_rate_limit_options: 'Exibir opções quando o limite de taxa é atingido',
  cmd_heapdump: 'Exportar o heap JS para ~/Desktop',
  cmd_install_github_app: 'Configurar o GitHub Actions do Claude para um repositório',
  cmd_desktop: 'Continuar a sessão atual no Claude Desktop',
  cmd_web_setup: 'Configurar o Claude Code na web (requer conexão com conta do GitHub)',

  // Strings de UI – tela inicial, rodapé, indicador IDE
  tagline: 'Qualquer modelo. Toda ferramenta. Zero limites.',
  providerLabel: 'Provedor',
  modelLabel: 'Modelo',
  endpointLabel: 'Endpoint',
  statusReady: 'Pronto — digite /help para começar',
  statusLocal: 'local',
  statusCloud: 'nuvem',
  forShortcuts: '? para atalhos',
  pressKeyToExit: (key: string) => `Pressione ${key} novamente para sair`,
  pastingText: 'Colando texto\u2026',
  ideLineSingular: 'linha',
  ideLinePlural: 'linhas',
  ideSelected: 'selecionada(s)',
  ideInFile: 'Em',

  // Progress messages
  progress_analyzing_codebase: 'analisando seu código-fonte',
  progress_creating_commit: 'criando commit',
  progress_reviewing_pr: 'revisando pull request',
  progress_analyzing_sessions: 'analisando suas sessões',
  progress_analyzing_security: 'analisando alterações de código por riscos de segurança',
  progress_configuring_autofix: 'Configurando correção automática...',

  // Turn completion verbs
  turnCompletionVerbs: [
    'Processou',
    'Elaborou',
    'Computou',
    'Analisou',
    'Concluiu',
    'Resolveu',
    'Executou',
    'Trabalhou',
  ],

  // Shortcut help menu – estático
  shortcut_bash_mode: '! para modo bash',
  shortcut_commands: '/ para comandos',
  shortcut_file_paths: '@ para caminhos de arquivo',
  shortcut_background: '& para segundo plano',
  shortcut_btw: '/btw para pergunta paralela',
  shortcut_clear_input: 'esc duplo para limpar entrada',
  shortcut_suspend: 'ctrl + z para suspender',
  shortcut_keybindings: '/keybindings para personalizar',

  // Shortcut help menu – dinâmico
  shortcut_auto_accept: (shortcut: string) => `${shortcut} para aceitar edições`,
  shortcut_verbose_output: (shortcut: string) => `${shortcut} para saída detalhada`,
  shortcut_toggle_tasks: (shortcut: string) => `${shortcut} para alternar tarefas`,
  shortcut_terminal: (shortcut: string) => `${shortcut} para terminal`,
  shortcut_undo: (shortcut: string) => `${shortcut} para desfazer`,
  shortcut_paste_images: (shortcut: string) => `${shortcut} para colar imagens`,
  shortcut_switch_model: (shortcut: string) => `${shortcut} para trocar modelo`,
  shortcut_fast_mode: (shortcut: string) => `${shortcut} para alternar modo rápido`,
  shortcut_stash_prompt: (shortcut: string) => `${shortcut} para guardar prompt`,
  shortcut_editor: (shortcut: string) => `${shortcut} para editar no $EDITOR`,

  // Instruções de nova linha
  shortcut_newline_shift: 'shift + ⏎ para nova linha',
  shortcut_newline_backslash: '\\⏎ para nova linha',
  shortcut_newline_full: 'barra invertida (\\) + enter (⏎) para nova linha',

  // Sufixo de fonte
  sourceSuffixBundled: '(integrado)',

  // Descrições de comandos adicionais
  cmd_init_new: 'Inicializar arquivo(s) de instruções do projeto e skills/hooks opcionais com documentação da base de código',
  cmd_statusline: 'Configurar a interface de linha de status do Claude Code',
  cmd_debug_bundled: 'Ativar registro de depuração para esta sessão e ajudar a diagnosticar problemas',
  cmd_batch: 'Pesquisar e planejar uma mudança em grande escala, depois executá-la em paralelo em 5 a 30 agentes isolados em worktrees, cada um abrindo um PR.',
  cmd_loop: 'Executar um prompt em intervalos fixos ou reagendar dinamicamente, incluindo loops de manutenção.',
  cmd_simplify: 'Revisar código alterado quanto a reutilização, qualidade e eficiência, corrigindo os problemas encontrados.',
  cmd_update_config: 'Use esta skill para configurar o harness do Claude Code via settings.json. Comportamentos automatizados ("a partir de agora quando X", "cada vez que X", "sempre que X", "antes/depois de X") requerem hooks configurados em settings.json — o harness os executa, não o Claude. Use também para: permissões ("permitir X"), variáveis de ambiente ("definir X=Y"), solução de problemas de hooks ou alterações em settings.json/settings.local.json. Para configurações simples como tema/modelo, use a ferramenta Config.',
}
