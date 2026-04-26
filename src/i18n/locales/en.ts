// Translations interface – all CLI UI strings for Zero CLI
export interface TranslationKeys {
  // Welcome / Branding
  welcomeToZeroCLI: string
  welcomeToClaudeCode: string

  // Onboarding – security step
  securityNotes: string
  claudeCanMakeMistakes: string
  reviewClaudeResponses: string
  promptInjectionRisk: string
  forMoreDetailsSee: string

  // Press Enter
  pressEnterToContinue: string
  pressEnterBold: string
  pressEnterSuffix: string

  // Interrupted
  interrupted: string
  whatShouldClaudoDoInstead: string

  // Exit / Goodbye
  goodbyeMessages: readonly string[]

  // Language picker
  enterPreferredLanguage: string
  leaveEmptyForDefault: string
  languagePlaceholder: string

  // Help
  claudeUnderstandsCodebase: string
  shortcuts: string

  // Cost threshold dialog
  spentOnProvider: (amount: string, provider: string) => string
  learnMoreCosts: string
  gotItThanks: string

  // Approve API key
  doYouWantToUseApiKey: string
  yes: string
  no: string

  // Doctor screen
  failedToFetchVersions: string
  stableVersion: string
  latestVersion: string

  // Command descriptions
  cmd_help: string
  cmd_config: string
  cmd_clear: string
  cmd_commit: string
  cmd_review: string
  cmd_init: string
  cmd_memory: string
  cmd_mcp: string
  cmd_resume: string
  cmd_model: string
  cmd_vim: string
  cmd_doctor: string
  cmd_cost: string
  cmd_compact: string
  cmd_export: string
  cmd_diff: string
  cmd_version: string
  cmd_exit: string
  cmd_stats: string
  cmd_tasks: string
  cmd_add_dir: string
  cmd_feedback: string
  cmd_voice: string
  cmd_ide: string
  cmd_provider: string
  cmd_plan: string
  cmd_rename: string
  cmd_release_notes: string
  cmd_upgrade: string
  cmd_auto_fix: string
  cmd_insights: string
  cmd_security_review: string
  cmd_keybindings: string
  cmd_agents: string
  cmd_session: string
  cmd_mobile: string
  cmd_usage: string
  cmd_tag: string
  cmd_buddy: string
  cmd_wiki: string
  cmd_bridge: string
  cmd_theme: string
  cmd_output_style: string
  cmd_extra_usage: string
  cmd_privacy: string
  cmd_permissions: string
  cmd_effort: string
  cmd_copy: string
  cmd_reload_plugins: string
  cmd_branch: string
  cmd_sandbox_toggle: string
  cmd_install: string
  cmd_context: string
  cmd_login: string
  cmd_logout: string
  cmd_advisor: string

  // Command descriptions – newly added (not yet wired in all index.ts files)
  cmd_skills: string
  cmd_rewind: string
  cmd_btw: string
  cmd_hooks: string
  cmd_status: string
  cmd_stickers: string
  cmd_terminal_setup: string
  cmd_terminal_setup_apple: string
  cmd_onboard_github: string
  cmd_cache_probe: string
  cmd_context_ni: string
  cmd_model_dynamic: (model: string) => string
  cmd_login_switch: string
  cmd_login_signin: string
  cmd_plugin: string
  cmd_chrome: string
  cmd_install_slack: string
  cmd_color: string
  cmd_thinkback: string
  cmd_thinkback_play: string
  cmd_files: string
  cmd_pr_comments: string
  cmd_remote_env: string
  cmd_rate_limit_options: string
  cmd_heapdump: string
  cmd_install_github_app: string
  cmd_desktop: string
  cmd_web_setup: string

  // UI strings
  tagline: string
  providerLabel: string
  modelLabel: string
  endpointLabel: string
  statusReady: string
  statusLocal: string
  statusCloud: string
  forShortcuts: string
  pressKeyToExit: (key: string) => string
  pastingText: string
  ideLineSingular: string
  ideLinePlural: string
  ideSelected: string
  ideInFile: string

  // Progress messages
  progress_analyzing_codebase: string
  progress_creating_commit: string
  progress_reviewing_pr: string
  progress_analyzing_sessions: string
  progress_analyzing_security: string
  progress_configuring_autofix: string

  // Turn completion verbs
  turnCompletionVerbs: readonly string[]

  // Shortcut help menu – static labels
  shortcut_bash_mode: string
  shortcut_commands: string
  shortcut_file_paths: string
  shortcut_background: string
  shortcut_btw: string
  shortcut_clear_input: string
  shortcut_suspend: string
  shortcut_keybindings: string

  // Shortcut help menu – dynamic (shortcut key prefix)
  shortcut_auto_accept: (shortcut: string) => string
  shortcut_verbose_output: (shortcut: string) => string
  shortcut_toggle_tasks: (shortcut: string) => string
  shortcut_terminal: (shortcut: string) => string
  shortcut_undo: (shortcut: string) => string
  shortcut_paste_images: (shortcut: string) => string
  shortcut_switch_model: (shortcut: string) => string
  shortcut_fast_mode: (shortcut: string) => string
  shortcut_stash_prompt: (shortcut: string) => string
  shortcut_editor: (shortcut: string) => string

  // Newline instructions
  shortcut_newline_shift: string
  shortcut_newline_backslash: string
  shortcut_newline_full: string

  // Source suffix (help menu)
  sourceSuffixBundled: string

  // Additional command descriptions
  cmd_init_new: string
  cmd_statusline: string
  cmd_debug_bundled: string
  cmd_batch: string
  cmd_loop: string
  cmd_simplify: string
  cmd_update_config: string

  // Spinner tips (static, localizable)
  spinnerTips: Record<string, string>
}

// English (default) locale
export const en: TranslationKeys = {
  // Welcome / Branding
  welcomeToZeroCLI: 'Welcome to Zero CLI',
  welcomeToClaudeCode: 'Welcome to Zero CLI',

  // Onboarding – security step
  securityNotes: 'Security notes:',
  claudeCanMakeMistakes: 'Zero CLI can make mistakes',
  reviewClaudeResponses:
    "You should always review Claude's responses, especially when\nrunning code.",
  promptInjectionRisk: 'Due to prompt injection risks, only use it with code you trust',
  forMoreDetailsSee: 'For more details see:',

  // Press Enter
  pressEnterToContinue: 'Press',
  pressEnterBold: 'Enter',
  pressEnterSuffix: 'to continue\u2026',

  // Interrupted
  interrupted: 'Interrupted',
  whatShouldClaudoDoInstead: 'What should Claude do instead?',

  // Exit / Goodbye
  goodbyeMessages: ['Goodbye!', 'See ya!', 'Bye!', 'Catch you later!'],

  // Language picker
  enterPreferredLanguage: 'Enter your preferred response and voice language:',
  leaveEmptyForDefault: 'Leave empty for default (English)',
  languagePlaceholder: 'ex.: Japanese, \u65e5\u672c\u8a9e, Espa\u00f1ol, pt-BR, etc.,',

  // Help
  claudeUnderstandsCodebase:
    'Zero CLI understands your codebase, makes edits with your permission, and executes commands \u2014 right from your terminal.',
  shortcuts: 'Shortcuts',

  // Cost threshold dialog
  spentOnProvider: (amount: string, provider: string) =>
    `You've spent ${amount} on the ${provider} this session.`,
  learnMoreCosts: 'Learn more about how to monitor your spending:',
  gotItThanks: 'Got it, thanks!',

  // Approve API key
  doYouWantToUseApiKey: 'Do you want to use this API key?',
  yes: 'Yes',
  no: 'No',

  // Doctor screen
  failedToFetchVersions: 'Failed to fetch versions',
  stableVersion: 'Stable version:',
  latestVersion: 'Latest version:',

  // Command descriptions
  cmd_help: 'Show help and available commands',
  cmd_config: 'Open config panel',
  cmd_clear: 'Clear conversation history and free up context',
  cmd_commit: 'Create a git commit',
  cmd_review: 'Review a pull request',
  cmd_memory: 'Edit Claude memory files',
  cmd_mcp: 'Manage MCP servers',
  cmd_resume: 'Resume a previous conversation',
  cmd_model: 'Change the AI model',
  cmd_vim: 'Toggle between Vim and Normal editing modes',
  cmd_doctor: 'Check system health and configuration',
  cmd_cost: 'Show the total cost and duration of the current session',
  cmd_compact: 'Clear conversation history but keep a summary in context. Optional: /compact [instructions for summarization]',
  cmd_export: 'Export the current conversation to a file or clipboard',
  cmd_diff: 'View uncommitted changes and per-turn diffs',
  cmd_version: 'Show version information',
  cmd_exit: 'Exit the REPL',
  cmd_stats: 'Show your ZeroCLI usage statistics and activity',
  cmd_tasks: 'List and manage background tasks',
  cmd_add_dir: 'Add a new working directory',
  cmd_feedback: 'Submit feedback about ZeroCLI',
  cmd_voice: 'Toggle voice mode',
  cmd_ide: 'Manage IDE integrations and show status',
  cmd_provider: 'Manage API provider profiles',
  cmd_plan: 'Enable plan mode or view the current session plan',
  cmd_rename: 'Rename the current conversation',
  cmd_release_notes: 'View release notes',
  cmd_upgrade: 'Upgrade to Max for higher rate limits and more Opus',
  cmd_auto_fix: 'Configure auto-fix: run lint/test after AI edits',
  cmd_insights: 'Generate a report analyzing your ZeroCLI sessions',
  cmd_security_review: 'Complete a security review of pending changes',
  cmd_keybindings: 'Open or create your keybindings configuration file',
  cmd_agents: 'Manage agent configurations',
  cmd_session: 'Show remote session URL and QR code',
  cmd_mobile: 'Show QR code to download the Claude mobile app',
  cmd_usage: 'Show plan usage limits',
  cmd_tag: 'Toggle a searchable tag on the current session',
  cmd_buddy: 'Hatch, pet, and manage your ZeroCLI companion',
  cmd_wiki: 'Initialize and inspect the Zero CLI project wiki',
  cmd_bridge: 'Connect this terminal for remote-control sessions',
  cmd_theme: 'Change the theme',
  cmd_output_style: 'Deprecated: use /config to change output style',
  cmd_extra_usage: 'Configure extra usage to keep working when limits are hit',
  cmd_privacy: 'View and update your privacy settings',
  cmd_permissions: 'Manage allow & deny tool permission rules',
  cmd_effort: 'Set effort level for model usage',
  cmd_copy: "Copy Claude's last response to clipboard (or /copy N for the Nth-latest)",
  cmd_reload_plugins: 'Activate pending plugin changes in the current session',
  cmd_branch: 'Create a branch of the current conversation at this point',
  cmd_sandbox_toggle: 'Toggle sandbox mode',
  cmd_install: 'Install ZeroCLI globally',
  cmd_context: 'Visualize current context usage as a colored grid',
  cmd_login: 'Log in to Anthropic',
  cmd_logout: 'Sign out from your Anthropic account',
  cmd_advisor: 'Configure the advisor model',

  // Command descriptions – newly added
  cmd_skills: 'List available skills',
  cmd_rewind: 'Restore the code and/or conversation to a previous point',
  cmd_btw: 'Ask a quick side question without interrupting the main conversation',
  cmd_hooks: 'View hook configurations for tool events',
  cmd_status: 'Show ZeroCLI status including version, model, account, API connectivity, and tool statuses',
  cmd_stickers: 'Order ZeroCLI stickers',
  cmd_terminal_setup: 'Install Shift+Enter key binding for newlines',
  cmd_terminal_setup_apple: 'Enable Option+Enter key binding for newlines and visual bell',
  cmd_onboard_github: 'Interactive setup for GitHub Copilot: OAuth device login stored in secure storage',
  cmd_cache_probe: 'Send identical requests to test prompt caching (results in debug log)',
  cmd_context_ni: 'Show current context usage',
  cmd_model_dynamic: (model: string) => `Set the AI model for ZeroCLI (currently ${model})`,
  cmd_login_switch: 'Switch Anthropic accounts',
  cmd_login_signin: 'Sign in with your Anthropic account',
  cmd_plugin: 'Manage ZeroCLI plugins',
  cmd_chrome: 'Claude in Chrome (Beta) settings',
  cmd_install_slack: 'Install the Claude Slack app',
  cmd_color: 'Set the prompt bar color for this session',
  cmd_thinkback: 'Your 2025 ZeroCLI Year in Review',
  cmd_thinkback_play: 'Play the thinkback animation',
  cmd_files: 'List all files currently in context',
  cmd_pr_comments: 'Get comments from a GitHub pull request',
  cmd_remote_env: 'Configure the default remote environment for teleport sessions',
  cmd_rate_limit_options: 'Show options when rate limit is reached',
  cmd_heapdump: 'Dump the JS heap to ~/Desktop',
  cmd_install_github_app: 'Set up Claude GitHub Actions for a repository',
  cmd_desktop: 'Continue the current session in Claude Desktop',
  cmd_web_setup: 'Setup ZeroCLI on the web (requires connecting your GitHub account)',

  // UI strings – startup screen, footer, IDE indicator
  tagline: 'Any model. Every tool. Zero limits.',
  providerLabel: 'Provider',
  modelLabel: 'Model',
  endpointLabel: 'Endpoint',
  statusReady: 'Ready — type /help to begin',
  statusLocal: 'local',
  statusCloud: 'cloud',
  forShortcuts: '? for shortcuts',
  pressKeyToExit: (key: string) => `Press ${key} again to exit`,
  pastingText: 'Pasting text\u2026',
  ideLineSingular: 'line',
  ideLinePlural: 'lines',
  ideSelected: 'selected',
  ideInFile: 'In',

  // Progress messages
  progress_analyzing_codebase: 'analyzing your codebase',
  progress_creating_commit: 'creating commit',
  progress_reviewing_pr: 'reviewing pull request',
  progress_analyzing_sessions: 'analyzing your sessions',
  progress_analyzing_security: 'analyzing code changes for security risks',
  progress_configuring_autofix: 'Configuring auto-fix...',

  // Turn completion verbs
  turnCompletionVerbs: ['Baked', 'Brewed', 'Churned', 'Cogitated', 'Cooked', 'Crunched', 'Sautéed', 'Worked'],

  // Shortcut help menu – static labels
  shortcut_bash_mode: '! for bash mode',
  shortcut_commands: '/ for commands',
  shortcut_file_paths: '@ for file paths',
  shortcut_background: '& for background',
  shortcut_btw: '/btw for side question',
  shortcut_clear_input: 'double tap esc to clear input',
  shortcut_suspend: 'ctrl + z to suspend',
  shortcut_keybindings: '/keybindings to customize',

  // Shortcut help menu – dynamic
  shortcut_auto_accept: (shortcut: string) => `${shortcut} to auto-accept edits`,
  shortcut_verbose_output: (shortcut: string) => `${shortcut} for verbose output`,
  shortcut_toggle_tasks: (shortcut: string) => `${shortcut} to toggle tasks`,
  shortcut_terminal: (shortcut: string) => `${shortcut} for terminal`,
  shortcut_undo: (shortcut: string) => `${shortcut} to undo`,
  shortcut_paste_images: (shortcut: string) => `${shortcut} to paste images`,
  shortcut_switch_model: (shortcut: string) => `${shortcut} to switch model`,
  shortcut_fast_mode: (shortcut: string) => `${shortcut} to toggle fast mode`,
  shortcut_stash_prompt: (shortcut: string) => `${shortcut} to stash prompt`,
  shortcut_editor: (shortcut: string) => `${shortcut} to edit in $EDITOR`,

  // Newline instructions
  shortcut_newline_shift: 'shift + ⏎ for newline',
  shortcut_newline_backslash: '\\⏎ for newline',
  shortcut_newline_full: 'backslash (\\) + return (⏎) for newline',

  // Source suffix
  sourceSuffixBundled: '(bundled)',

  // Additional command descriptions
  cmd_init: 'Initialize a new project instruction file with codebase documentation',
  cmd_init_new: 'Initialize new project instruction file(s) and optional skills/hooks with codebase documentation',
  cmd_statusline: "Set up Zero CLI's status line UI",
  cmd_debug_bundled: 'Enable debug logging for this session and help diagnose issues',
  cmd_batch: 'Research and plan a large-scale change, then execute it in parallel across 5–30 isolated worktree agents that each open a PR.',
  cmd_loop: 'Run a prompt on a fixed interval or dynamically reschedule it, including bare maintenance-mode loops.',
  cmd_simplify: 'Review changed code for reuse, quality, and efficiency, then fix any issues found.',
  cmd_update_config: 'Use this skill to configure the Zero CLI harness via settings.json. Automated behaviors ("from now on when X", "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these, not Claude, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json files. For simple settings like theme/model, use Config tool.',

  // Spinner tips (static, localizable)
  spinnerTips: {
    'new-user-warmup': 'Start with small features or bug fixes, tell ZeroCLI to propose a plan, and verify its suggested edits',
    'default-permission-mode-config': 'Use /config to change your default permission mode (including Plan Mode)',
    'git-worktrees': 'Use git worktrees to run multiple ZeroCLI sessions in parallel.',
    'color-when-multi-clauding': 'Running multiple ZeroCLI sessions? Use /color and /rename to tell them apart at a glance.',
    'memory-command': 'Use /memory to view and manage ZeroCLI memory',
    'theme-command': 'Use /theme to change the color theme',
    'colorterm-truecolor': 'Try setting environment variable COLORTERM=truecolor for richer colors',
    'powershell-tool-env': 'Set CLAUDE_CODE_USE_POWERSHELL_TOOL=1 to enable the PowerShell tool (preview)',
    'status-line': 'Use /statusline to set up a custom status line that will display beneath the input box',
    'prompt-queue': 'Hit Enter to queue up additional messages while ZeroCLI is working.',
    'enter-to-steer-in-relatime': 'Send messages to ZeroCLI while it works to steer in real-time',
    'todo-list': 'Ask ZeroCLI to create a todo list when working on complex tasks to track progress and remain on track',
    'ide-upsell-external-terminal': 'Connect ZeroCLI to your IDE \u00b7 /ide',
    'install-github-app': 'Run /install-github-app to tag @claude right from your Github issues and PRs',
    'install-slack-app': 'Run /install-slack-app to use ZeroCLI in Slack',
    'permissions': 'Use /permissions to pre-approve and pre-deny bash, edit, and MCP tools',
    'drag-and-drop-images': 'Did you know you can drag and drop image files into your terminal?',
    'paste-images-mac': 'Paste images into ZeroCLI using control+v (not cmd+v!)',
    'double-esc': 'Double-tap esc to rewind the conversation to a previous point in time',
    'double-esc-code-restore': 'Double-tap esc to rewind the code and/or conversation to a previous point in time',
    'continue': 'Run zero --continue or zero --resume to resume a conversation',
    'rename-conversation': 'Name your conversations with /rename to find them easily in /resume later',
    'custom-commands': 'Create skills by adding .md files to .claude/skills/ in your project or ~/.claude/skills/ for skills that work in any project',
    'custom-agents': 'Use /agents to optimize specific tasks. Eg. Software Architect, Code Writer, Code Reviewer',
    'agent-flag': 'Use --agent <agent_name> to directly start a conversation with a subagent',
    'desktop-app': 'Run ZeroCLI locally or remotely using the Claude desktop app: clau.de/desktop',
    'web-app': 'Run tasks in the cloud while you keep coding locally \u00b7 clau.de/web',
    'mobile-app': '/mobile to use ZeroCLI from the Claude app on your phone',
    'feedback-command': 'Use /feedback to help us improve!',
    'clear': 'Use /clear to start fresh when switching topics and free up context',
    'btw': "Use /btw to ask a quick side question without interrupting Claude's current work",
  },
}
