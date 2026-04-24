// Português Brasileiro (pt-BR) locale strings for Zero CLI UI
import type { TranslationKeys } from './en.js'

export const ptBR: TranslationKeys = {
  welcomeToOpenClaude: 'Bem-vindo ao Open Claude',
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
  cmd_init: 'Inicializar um novo projeto',
  cmd_memory: 'Editar arquivos de memória do Claude',
  cmd_mcp: 'Gerenciar servidores MCP',
  cmd_resume: 'Retomar uma conversa anterior',
  cmd_model: 'Trocar o modelo de IA',
  cmd_vim: 'Alternar entre os modos de edição Vim e Normal',
  cmd_doctor: 'Verificar saúde do sistema e configuração',
  cmd_cost: 'Mostrar o custo total e duração da sessão atual',
  cmd_compact: 'Compactar conversa para liberar contexto',
  cmd_export: 'Exportar a conversa atual para arquivo ou área de transferência',
  cmd_diff: 'Ver alterações não confirmadas e diffs por turno',
  cmd_version: 'Mostrar informações de versão',
  cmd_exit: 'Sair do Claude Code',
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
  cmd_wiki: 'Inicializar e inspecionar o wiki do projeto OpenClaude',
  cmd_bridge: 'Conectar este terminal para sessões de controle remoto',
  cmd_theme: 'Mudar o tema de cores',
  cmd_output_style: 'Obsoleto: use /config para mudar o estilo de saída',
  cmd_extra_usage: 'Configurar uso extra para continuar trabalhando ao atingir limites',
  cmd_privacy: 'Ver e atualizar suas configurações de privacidade',
  cmd_permissions: 'Gerenciar permissões de ferramentas',
  cmd_effort: 'Definir nível de esforço para uso do modelo',
  cmd_copy: 'Copiar a última resposta para a área de transferência',
  cmd_reload_plugins: 'Ativar alterações de plugins pendentes na sessão atual',
  cmd_branch: 'Gerenciar branches do git',
  cmd_sandbox_toggle: 'Ativar/desativar modo sandbox',
  cmd_install: 'Instalar o Claude Code globalmente',
  cmd_context: 'Gerenciar arquivos de contexto',
  cmd_login: 'Entrar na Anthropic',
  cmd_logout: 'Sair da Anthropic',
  cmd_advisor: 'Configurar o modelo advisor',

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
}
