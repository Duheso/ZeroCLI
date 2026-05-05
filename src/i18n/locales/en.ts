// Translations interface – all CLI UI strings for Zero CLI
export interface TranslationKeys {
  // Welcome / Branding
  welcomeToZeroCLI: string
  welcomeToZeroCode: string

  // Onboarding – security step
  securityNotes: string
  claudeCanMakeMistakes: string
  reviewZeroResponses: string
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
  cmd_update: string
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

  // Expand / collapse hints (keyboard shortcut hints shown in terminal)
  hint_connector_to: string
  hint_to_expand: string
  hint_to_collapse: string
  hint_arrow_to_collapse: string
  hint_arrow_to_expand: string
  hint_shortcut_to_expand: (shortcut: string) => string
  hint_read_output_expand: (shortcut: string) => string
  hint_p_to_expand: string
  hint_line_singular: string
  hint_line_plural: string

  // Activity summary verbs – present (isActive) capitalized / lowercase
  summary_recalling_cap: string
  summary_recalling_lc: string
  summary_recalled_cap: string
  summary_recalled_lc: string
  summary_searching_mem_cap: string
  summary_searching_mem_lc: string
  summary_searched_mem_cap: string
  summary_searched_mem_lc: string
  summary_mem_target: string
  summary_writing_cap: string
  summary_writing_lc: string
  summary_wrote_cap: string
  summary_wrote_lc: string
  summary_searching_for_cap: string
  summary_searching_for_lc: string
  summary_searched_for_cap: string
  summary_searched_for_lc: string
  summary_reading_cap: string
  summary_reading_lc: string
  summary_read_cap: string
  summary_read_lc: string
  summary_listing_cap: string
  summary_listing_lc: string
  summary_listed_cap: string
  summary_listed_lc: string
  summary_repling: string
  summary_repld: string
  // Activity summary nouns (singular / plural)
  summary_memory_singular: string
  summary_memory_plural: string
  summary_pattern_singular: string
  summary_pattern_plural: string
  summary_file_singular: string
  summary_file_plural: string
  summary_directory_singular: string
  summary_directory_plural: string
  summary_time_singular: string
  summary_time_plural: string

  // FileReadTool UI strings
  fileread_error_reading_file: string
  fileread_reading_plan: string
  fileread_read_agent_output: string
  fileread_read: string
  fileread_reading_summary: (summary: string) => string
  fileread_reading_file: string

  // MCP query verbs
  summary_querying_cap: string
  summary_querying_lc: string
  summary_queried_cap: string
  summary_queried_lc: string

  // Bash run verbs
  summary_running_cap: string
  summary_running_lc: string
  summary_ran_cap: string
  summary_ran_lc: string
  summary_command_singular: string
  summary_command_plural: string
  summary_bash: string

  // Git operation verbs (for collapsed group)
  git_verb_committed: string
  git_verb_amended: string
  git_verb_cherry_picked: string
  git_verb_pushed_to: string
  git_verb_merged: string
  git_verb_rebased_onto: string

  // PR verbs (for collapsed group)
  pr_verb_created: string
  pr_verb_edited: string
  pr_verb_merged: string
  pr_verb_commented_on: string
  pr_verb_closed: string
  pr_verb_marked_ready: string

  // Hook run info (collapsed group)
  hook_pretooluse: string
  hook_singular: string
  hook_plural: string

  // Tool activity verbs (sessionRunner)
  tool_verb_editing: string
  tool_verb_running: string
  tool_verb_searching: string
  tool_verb_fetching: string
  tool_verb_running_task: string
  tool_verb_editing_notebook: string

  // Provider Manager UI strings
  pm_menu_title: string
  pm_menu_active_profile_desc: string
  pm_menu_no_profiles_yet: string
  pm_menu_checking_github_creds: string
  pm_menu_add_label: string
  pm_menu_add_desc: string
  pm_menu_activate_label: string
  pm_menu_activate_desc: string
  pm_menu_edit_label: string
  pm_menu_edit_desc: string
  pm_menu_delete_label: string
  pm_menu_delete_desc: string
  pm_menu_logout_codex_label: string
  pm_menu_logout_codex_desc: string
  pm_menu_done_label: string
  pm_menu_done_desc: string
  pm_loading_title: string
  pm_loading_desc: string
  pm_activating_title: string
  pm_activating_desc: string
  pm_set_up_provider: string
  pm_choose_preset: string
  pm_pick_preset_hint: string
  pm_create_form_title: string
  pm_edit_form_title: string
  pm_provider_type_label: string
  pm_provider_type_anthropic: string
  pm_provider_type_openai: string
  pm_step_of: (step: number, total: number, label: string) => string
  pm_press_enter_esc: string
  pm_back_label: string
  pm_back_to_provider_manager: string
  pm_back_to_presets: string
  pm_enter_manually_label: string
  pm_enter_manually_desc: string
  pm_back_preset_desc: string
  pm_checking_ollama_title: string
  pm_checking_ollama_msg: string
  pm_ollama_setup_title: string
  pm_choose_ollama_title: string
  pm_choose_ollama_desc: string
  pm_checking_atomic_title: string
  pm_checking_atomic_msg: string
  pm_atomic_setup_title: string
  pm_choose_atomic_title: string
  pm_choose_atomic_desc: string
  pm_select_active_title: string
  pm_select_edit_title: string
  pm_select_delete_title: string
  pm_no_providers_available: string
  pm_profile_active_suffix: string
  pm_profile_key_set: string
  pm_profile_no_key: string
  pm_profile_anthropic: string
  pm_profile_openai_compat: string
  pm_profile_token_stored: string
  pm_profile_token_via_env: string
  pm_profile_no_token: string
  pm_skip_for_now_label: string
  pm_skip_for_now_desc: string
  pm_field_name_label: string
  pm_field_name_placeholder: string
  pm_field_name_help: string
  pm_field_baseurl_label: string
  pm_field_baseurl_placeholder: string
  pm_field_baseurl_help: string
  pm_field_model_label: string
  pm_field_model_placeholder: string
  pm_field_model_help: string
  pm_field_apikey_label: string
  pm_field_apikey_placeholder: string
  pm_field_apikey_help: string
  pm_field_required: (label: string) => string
  pm_err_cannot_activate_github: (error: string) => string
  pm_err_cannot_change_provider: string
  pm_err_cannot_save_provider: string
  pm_err_cannot_finish_activating: (label: string, detail: string) => string
  pm_err_cannot_delete_provider: string
  pm_err_cannot_delete_github: (error: string) => string
  pm_err_codex_oauth_failed_title: string
  pm_err_codex_login_no_profile: string
  pm_err_codex_login_no_active: string
  pm_err_codex_credentials_cleared_no_profile: string
  pm_err_cannot_clear_codex: string
  pm_status_activating: string
  pm_status_active_provider: (name: string) => string
  pm_status_updated_provider: (name: string) => string
  pm_status_added_provider: (name: string) => string
  pm_status_provider_configured: (name: string) => string
  pm_status_provider_deleted: string
  pm_status_github_deleted: string
  pm_status_codex_logged_out: string
  pm_status_codex_configured: string
  pm_codex_title: string
  pm_codex_signin_desc: string
  pm_codex_starting: string
  pm_codex_browser_not_opened: string
  pm_codex_browser_opened: string
  pm_codex_opening_browser: string
  pm_codex_press_esc: string
  pm_codex_press_enter_esc: string
  pm_activation_saved_next_startup_warning: (prefix: string, warnings: string) => string
  pm_activation_switched_with_warnings: (prefix: string, warnings: string) => string
  pm_activation_switched: (prefix: string) => string
  pm_warning_override_suffix: (error: string) => string

  // Agents menu
  agents_title: string
  agents_builtin_source: string
  agents_plugin_source: string
  agents_create_new: string
  agents_no_agents_subtitle: string
  agents_no_agents_desc1: string
  agents_no_agents_desc2: string
  agents_no_agents_desc3: string
  agents_builtin_always_available_title: string
  agents_builtin_label: string
  agents_builtin_always_avail_parens: string
  agents_builtin_note: string
  agents_memory_suffix: string
  agents_shadowed_by: string
  agents_count: (n: number) => string
  agents_nav_default: string
  agents_nav_enter_esc: string
  agents_nav_navigate_cancel: string
  agents_menu_view: string
  agents_menu_edit: string
  agents_menu_delete: string
  agents_menu_back: string
  agents_confirm_delete_title: string
  agents_confirm_delete_prefix: string
  agents_detail_source: (source: string) => string
  agents_confirm_yes: string
  agents_confirm_no: string
  agents_edit_title: (name: string) => string
  agents_deleted_msg: (name: string) => string
  agents_editor_open: string
  agents_editor_tools: string
  agents_editor_model: string
  agents_editor_color: string
  agents_editor_opened_msg: (name: string) => string
  agents_editor_updated_msg: (name: string) => string
  agents_editor_save_error: string
  agents_cli_none_found: string

  // Command response messages (runtime output when commands execute)
  cmd_agents_dismissed: string
  cmd_branch_no_conversation: string
  cmd_branch_no_messages: string
  cmd_branch_failed: (msg: string) => string
  cmd_btw_usage: string
  cmd_buddy_usage: string
  cmd_buddy_no_buddy: string
  cmd_buddy_muted: string
  cmd_buddy_unmuted: string
  cmd_cache_probe_failed: (status: number, error: string) => string
  cmd_cache_probe_title: (model: string, api: string, mode: string) => string
  cmd_cache_probe_call: (n: number, elapsed: number, input: number, cached: number) => string
  cmd_cache_probe_verdict_hit: (cached: number, rate: string | number) => string
  cmd_cache_probe_verdict_inconclusive: string
  cmd_cache_probe_verdict_possible_silent: (pct: number) => string
  cmd_cache_probe_verdict_no_cache: string
  cmd_cache_probe_what_main: (shimLabel: string) => string
  cmd_cache_probe_full_details: string
  cmd_cache_probe_responses_api: string
  cmd_cache_probe_chat_completions: string
  cmd_slash_usage: string
  cmd_color_teammate: string
  cmd_color_usage: (colors: string) => string
  cmd_compact_spinner: string
  cmd_compact_in_progress: string
  cmd_compact_compacted: string
  cmd_compact_full_summary: (shortcut: string) => string
  cmd_compact_notification: (shortcut: string) => string
  cmd_compact_boundary: (shortcut: string) => string
  cmd_copy_no_message: string
  cmd_cost_total: (cost: string) => string
  cmd_cost_duration_api: (dur: string) => string
  cmd_cost_duration_wall: (dur: string) => string
  cmd_cost_changes: (added: number, addedLabel: string, removed: number, removedLabel: string) => string
  cmd_cost_line: string
  cmd_cost_lines: string
  const_no_content: string

  // Add directory dialog
  add_dir_title: string
  add_dir_enter_path: string
  add_dir_placeholder: string

  // Branch success messages
  cmd_branch_success: (titleInfo: string, resumeHint: string) => string
  cmd_branch_success_fallback: (titleInfo: string, sessionId: string) => string
  cmd_branch_resume_hint: (sessionId: string) => string

  // Compact summary labels
  compact_summary_label: string
  compact_summary_summarized_conv: string
  compact_summary_messages_up_to: (n: number) => string
  compact_summary_messages_from: (n: number) => string
  compact_summary_context_label: string
  compact_summary_expand_hint: string

  // Transcript bar
  transcript_bar_showing: string
  transcript_bar_to_toggle: (shortcut: string) => string
  transcript_bar_to_collapse: string
  transcript_bar_to_show_all: string

  // Copy command success
  cmd_copy_success: (chars: number, lines: number) => string
  cmd_copy_also_written: (path: string) => string
  cmd_copy_success_with_file: (chars: number, lines: number, path: string) => string

  // Cost: model usage
  cmd_cost_usage_by_model: string
  cmd_cost_input: string
  cmd_cost_output: string
  cmd_cost_cache_read: string
  cmd_cost_cache_write: string
  cmd_cost_web_search: string
  cmd_cost_inaccurate: string

  // Diff UI
  diff_truncated: string
  diff_nav_select: string
  diff_nav_enter_view: string
  diff_nav_esc_close: (key: string) => string
  diff_nav_back: string
  diff_nav_source: string

  // Effort picker
  effort_set_level_title: string
  effort_not_supported: string
  effort_auto_description: string
  effort_low_description: string
  effort_medium_description: string
  effort_high_description: string
  effort_max_description: string
  effort_xhigh_description: string
  effort_level_auto: string
  effort_usage_msg: string
  effort_set_msg: (level: string, suffix: string, description: string) => string
  effort_auto_set_msg: string
  effort_current_msg: (level: string, description: string) => string
  effort_status_auto: (level: string) => string
  effort_cancelled: string
  effort_default_description: string

  // IDE command screen
  ide_dialog_title: string
  ide_dialog_subtitle: string
  ide_no_available_jetbrains: string
  ide_no_available_general: string
  ide_multiple_vscode_warning: string
  ide_auto_connect_tip: string
  ide_unavailable_count: (count: number) => string
  ide_open_dialog_title: string
  ide_install_dialog_title: string
  ide_connecting: (name: string) => string
  ide_connected: (name: string) => string
  ide_failed_connect: (name: string) => string
  ide_timed_out: (name: string) => string
  ide_error_connecting: string
  ide_disconnected: (name: string) => string
  ide_no_selected: string
  ide_selection_cancelled: string
  ide_no_extensions_detected: string
  ide_exited_without_opening: string
  ide_opened_in: (typeLabel: string, boldName: string) => string
  ide_failed_open_manual: (name: string, path: string) => string
  ide_please_open_manually: (typeLabel: string, boldName: string, path: string) => string
  ide_worktree_label: string
  ide_project_label: string
  ide_installed_plugin: (boldName: string) => string
  ide_installed_extension: (boldName: string) => string

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
  no_image_ssh: string
  no_image_linux: string
  no_image_generic: (shortcut: string) => string

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
  cmd_dream: string
  cmd_bridge_kick: string
  cmd_commit_push_pr: string
  cmd_brief: string
  cmd_version_debug: string
  cmd_init_verifiers: string
  cmd_ultrareview: string

  // Spinner tips (static, localizable)
  spinnerTips: Record<string, string>

  // Away summary (while-you-you-were-away recap)
  awaySummaryMemoryBlock: (memory: string) => string
  awaySummaryPrompt: string

  // MCP List Panel
  mcp_scope_project: string
  mcp_scope_user: string
  mcp_scope_local: string
  mcp_scope_enterprise: string
  mcp_scope_dynamic: string
  mcp_alwaysAvailable: string
  mcp_status_disabled: string
  mcp_status_connected: string
  mcp_status_reconnecting: (count: number) => string
  mcp_status_connecting: string
  mcp_status_needsAuth: string
  mcp_status_failed: string
  mcp_mayNeedAuth: string
  mcp_agentOnly: string
  mcp_dismissed: string
  mcp_manageTitle: string
  mcp_debugInline: string
  mcp_debugRunFlag: string
  mcp_hintNavigate: string
  mcp_hintConfirm: string
  mcp_hintCancel: string
  mcp_agentHeading: string
  mcp_forHelp: string
}

// English (default) locale
export const en: TranslationKeys = {
  // Welcome / Branding
  welcomeToZeroCLI: 'Welcome to Zero CLI',
  welcomeToZeroCode: 'Welcome to Zero CLI',

  // Onboarding – security step
  securityNotes: 'Security notes:',
  claudeCanMakeMistakes: 'Zero CLI can make mistakes',
  reviewZeroResponses:
    "You should always review Zero's responses, especially when\nrunning code.",
  promptInjectionRisk: 'Due to prompt injection risks, only use it with code you trust',
  forMoreDetailsSee: 'For more details see:',

  // Press Enter
  pressEnterToContinue: 'Press',
  pressEnterBold: 'Enter',
  pressEnterSuffix: 'to continue\u2026',

  // Interrupted
  interrupted: 'Interrupted',
  whatShouldClaudoDoInstead: 'What should Zero do instead?',

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
  cmd_memory: 'Edit Zero memory files',
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
  cmd_update: 'Check for updates and install the latest version',
  cmd_auto_fix: 'Configure auto-fix: run lint/test after AI edits',
  cmd_insights: 'Generate a report analyzing your ZeroCLI sessions',
  cmd_security_review: 'Complete a security review of pending changes',
  cmd_keybindings: 'Open or create your keybindings configuration file',
  cmd_agents: 'Manage agent configurations',
  cmd_session: 'Show remote session URL and QR code',
  cmd_mobile: 'Show QR code to download the Zero mobile app',
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
  cmd_copy: "Copy Zero's last response to clipboard (or /copy N for the Nth-latest)",
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
  cmd_chrome: 'Zero in Chrome (Beta) settings',
  cmd_install_slack: 'Install the Zero Slack app',
  cmd_color: 'Set the prompt bar color for this session',
  cmd_thinkback: 'Your 2025 ZeroCLI Year in Review',
  cmd_thinkback_play: 'Play the thinkback animation',
  cmd_files: 'List all files currently in context',
  cmd_pr_comments: 'Get comments from a GitHub pull request',
  cmd_remote_env: 'Configure the default remote environment for teleport sessions',
  cmd_rate_limit_options: 'Show options when rate limit is reached',
  cmd_heapdump: 'Dump the JS heap to ~/Desktop',
  cmd_install_github_app: 'Set up Zero GitHub Actions for a repository',
  cmd_desktop: 'Continue the current session in Zero Desktop',
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
  // Expand / collapse hints
  hint_connector_to: 'to',
  hint_to_expand: 'expand',
  hint_to_collapse: 'collapse',
  hint_arrow_to_collapse: '\u2190 to collapse',
  hint_arrow_to_expand: '\u2192 to expand',
  hint_shortcut_to_expand: (shortcut: string) => `(${shortcut} to expand)`,
  hint_read_output_expand: (shortcut: string) => `Read output (${shortcut} to expand)`,
  hint_p_to_expand: 'p to expand',
  hint_line_singular: 'line',
  hint_line_plural: 'lines',

  // Activity summary verbs
  summary_recalling_cap: 'Recalling',
  summary_recalling_lc: 'recalling',
  summary_recalled_cap: 'Recalled',
  summary_recalled_lc: 'recalled',
  summary_searching_mem_cap: 'Searching',
  summary_searching_mem_lc: 'searching',
  summary_searched_mem_cap: 'Searched',
  summary_searched_mem_lc: 'searched',
  summary_mem_target: 'memories',
  summary_writing_cap: 'Writing',
  summary_writing_lc: 'writing',
  summary_wrote_cap: 'Wrote',
  summary_wrote_lc: 'wrote',
  summary_searching_for_cap: 'Searching for',
  summary_searching_for_lc: 'searching for',
  summary_searched_for_cap: 'Searched for',
  summary_searched_for_lc: 'searched for',
  summary_reading_cap: 'Reading',
  summary_reading_lc: 'reading',
  summary_read_cap: 'Read',
  summary_read_lc: 'read',
  summary_listing_cap: 'Listing',
  summary_listing_lc: 'listing',
  summary_listed_cap: 'Listed',
  summary_listed_lc: 'listed',
  summary_repling: "REPL'ing",
  summary_repld: "REPL'd",
  // Activity summary nouns
  summary_memory_singular: 'memory',
  summary_memory_plural: 'memories',
  summary_pattern_singular: 'pattern',
  summary_pattern_plural: 'patterns',
  summary_file_singular: 'file',
  summary_file_plural: 'files',
  summary_directory_singular: 'directory',
  summary_directory_plural: 'directories',
  summary_time_singular: 'time',
  summary_time_plural: 'times',

  // FileReadTool UI strings
  fileread_error_reading_file: 'Error reading file',
  fileread_reading_plan: 'Reading Plan',
  fileread_read_agent_output: 'Read agent output',
  fileread_read: 'Read',
  fileread_reading_summary: (summary: string) => `Reading ${summary}`,
  fileread_reading_file: 'Reading file',

  // MCP query verbs
  summary_querying_cap: 'Querying',
  summary_querying_lc: 'querying',
  summary_queried_cap: 'Queried',
  summary_queried_lc: 'queried',

  // Bash run verbs
  summary_running_cap: 'Running',
  summary_running_lc: 'running',
  summary_ran_cap: 'Ran',
  summary_ran_lc: 'ran',
  summary_command_singular: 'command',
  summary_command_plural: 'commands',
  summary_bash: 'bash',

  // Git operation verbs (for collapsed group)
  git_verb_committed: 'committed',
  git_verb_amended: 'amended commit',
  git_verb_cherry_picked: 'cherry-picked',
  git_verb_pushed_to: 'pushed to',
  git_verb_merged: 'merged',
  git_verb_rebased_onto: 'rebased onto',

  // PR verbs (for collapsed group)
  pr_verb_created: 'created',
  pr_verb_edited: 'edited',
  pr_verb_merged: 'merged',
  pr_verb_commented_on: 'commented on',
  pr_verb_closed: 'closed',
  pr_verb_marked_ready: 'marked ready',

  // Hook run info (collapsed group)
  hook_pretooluse: 'PreToolUse',
  hook_singular: 'hook',
  hook_plural: 'hooks',

  // Tool activity verbs (sessionRunner)
  tool_verb_editing: 'Editing',
  tool_verb_running: 'Running',
  tool_verb_searching: 'Searching',
  tool_verb_fetching: 'Fetching',
  tool_verb_running_task: 'Running task',
  tool_verb_editing_notebook: 'Editing notebook',

  // Provider Manager UI strings
  pm_menu_title: 'Provider manager',
  pm_menu_active_profile_desc: 'Active profile controls base URL, model, and API key used by this session.',
  pm_menu_no_profiles_yet: 'No provider profiles configured yet.',
  pm_menu_checking_github_creds: 'Checking GitHub Models credentials...',
  pm_menu_add_label: 'Add provider',
  pm_menu_add_desc: 'Create a new provider profile',
  pm_menu_activate_label: 'Set active provider',
  pm_menu_activate_desc: 'Switch the active provider profile',
  pm_menu_edit_label: 'Edit provider',
  pm_menu_edit_desc: 'Update URL, model, or key',
  pm_menu_delete_label: 'Delete provider',
  pm_menu_delete_desc: 'Remove a provider profile',
  pm_menu_logout_codex_label: 'Log out Codex OAuth',
  pm_menu_logout_codex_desc: 'Clear securely stored Codex OAuth credentials',
  pm_menu_done_label: 'Done',
  pm_menu_done_desc: 'Return to chat',
  pm_loading_title: 'Loading providers...',
  pm_loading_desc: 'Reading provider profiles from disk.',
  pm_activating_title: 'Activating provider...',
  pm_activating_desc: 'Please wait while the provider is being configured.',
  pm_set_up_provider: 'Set up provider',
  pm_choose_preset: 'Choose provider preset',
  pm_pick_preset_hint: 'Pick a preset, then confirm base URL, model, and API key.',
  pm_create_form_title: 'Create provider profile',
  pm_edit_form_title: 'Edit provider profile',
  pm_provider_type_label: 'Provider type:',
  pm_provider_type_anthropic: 'Anthropic native API',
  pm_provider_type_openai: 'OpenAI-compatible API',
  pm_step_of: (step: number, total: number, label: string) => `Step ${step} of ${total}: ${label}`,
  pm_press_enter_esc: 'Press Enter to continue. Press Esc to go back.',
  pm_back_label: 'Back',
  pm_back_to_provider_manager: 'Return to provider manager',
  pm_back_to_presets: 'Return to provider presets',
  pm_enter_manually_label: 'Enter manually',
  pm_enter_manually_desc: 'Fill in the base URL and model yourself',
  pm_back_preset_desc: 'Choose another provider preset',
  pm_checking_ollama_title: 'Checking Ollama',
  pm_checking_ollama_msg: 'Looking for installed Ollama models...',
  pm_ollama_setup_title: 'Ollama setup',
  pm_choose_ollama_title: 'Choose an Ollama model',
  pm_choose_ollama_desc: 'Pick one of the installed Ollama models to save into a local provider profile.',
  pm_checking_atomic_title: 'Checking Atomic Chat',
  pm_checking_atomic_msg: 'Looking for loaded Atomic Chat models...',
  pm_atomic_setup_title: 'Atomic Chat setup',
  pm_choose_atomic_title: 'Choose an Atomic Chat model',
  pm_choose_atomic_desc: 'Pick one of the models loaded in Atomic Chat to save into a local provider profile.',
  pm_select_active_title: 'Set active provider',
  pm_select_edit_title: 'Edit provider',
  pm_select_delete_title: 'Delete provider',
  pm_no_providers_available: 'No providers available. Add one first.',
  pm_profile_active_suffix: '(active)',
  pm_profile_key_set: 'key set',
  pm_profile_no_key: 'no key',
  pm_profile_anthropic: 'anthropic',
  pm_profile_openai_compat: 'openai-compatible',
  pm_profile_token_stored: 'token stored',
  pm_profile_token_via_env: 'token via env',
  pm_profile_no_token: 'no token found',
  pm_skip_for_now_label: 'Skip for now',
  pm_skip_for_now_desc: 'Continue with current defaults',
  pm_field_name_label: 'Provider name',
  pm_field_name_placeholder: 'e.g. Ollama Home, OpenAI Work',
  pm_field_name_help: 'A short label shown in /provider and startup setup.',
  pm_field_baseurl_label: 'Base URL',
  pm_field_baseurl_placeholder: 'e.g. http://localhost:11434/v1',
  pm_field_baseurl_help: 'API base URL used for this provider profile.',
  pm_field_model_label: 'Default model',
  pm_field_model_placeholder: 'e.g. llama3.1:8b or glm-4.7, glm-4.7-flash',
  pm_field_model_help: 'Model name(s) to use. Separate multiple with commas; first is default.',
  pm_field_apikey_label: 'API key',
  pm_field_apikey_placeholder: 'Leave empty if your provider does not require one',
  pm_field_apikey_help: 'Optional. Press Enter with empty value to skip.',
  pm_field_required: (label: string) => `${label} is required.`,
  pm_err_cannot_activate_github: (error: string) => `Could not activate GitHub provider: ${error}`,
  pm_err_cannot_change_provider: 'Could not change active provider.',
  pm_err_cannot_save_provider: 'Could not save provider. Fill all required fields.',
  pm_err_cannot_finish_activating: (label: string, detail: string) => `Could not finish activating ${label}: ${detail}`,
  pm_err_cannot_delete_provider: 'Could not delete provider.',
  pm_err_cannot_delete_github: (error: string) => `Could not delete GitHub provider: ${error}`,
  pm_err_codex_oauth_failed_title: 'Codex OAuth failed',
  pm_err_codex_login_no_profile: 'Codex OAuth login finished, but the provider profile could not be saved.',
  pm_err_codex_login_no_active: 'Codex OAuth login finished, but the provider could not be set as the startup provider.',
  pm_err_codex_credentials_cleared_no_profile: 'Provider deleted, but Codex OAuth credentials could not be cleared.',
  pm_err_cannot_clear_codex: 'Could not clear Codex OAuth credentials.',
  pm_status_activating: 'Activating provider...',
  pm_status_active_provider: (name: string) => `Active provider: ${name}`,
  pm_status_updated_provider: (name: string) => `Updated provider: ${name}`,
  pm_status_added_provider: (name: string) => `Added provider: ${name} (now active)`,
  pm_status_provider_configured: (name: string) => `Provider configured: ${name}`,
  pm_status_provider_deleted: 'Provider deleted',
  pm_status_github_deleted: 'GitHub provider deleted',
  pm_status_codex_logged_out: 'Codex OAuth logged out.',
  pm_status_codex_configured: 'Codex OAuth configured',
  pm_codex_title: 'Codex OAuth',
  pm_codex_signin_desc: 'Sign in with your ChatGPT account in the browser. Zero CLI will store the resulting Codex credentials securely and switch this session to the new Codex login when setup completes.',
  pm_codex_starting: 'Starting local callback and preparing your browser...',
  pm_codex_browser_not_opened: 'Browser did not open automatically. Visit this URL to continue:',
  pm_codex_browser_opened: 'Browser opened. Finish the ChatGPT sign-in there and this setup will complete automatically.',
  pm_codex_opening_browser: 'Opening your browser...',
  pm_codex_press_esc: 'Press Esc to cancel and go back.',
  pm_codex_press_enter_esc: 'Press Enter or Esc to go back.',
  pm_activation_saved_next_startup_warning: (prefix: string, warnings: string) => `${prefix}. Saved for next startup. Warning: ${warnings}.`,
  pm_activation_switched_with_warnings: (prefix: string, warnings: string) => `${prefix}. Zero CLI switched to it for this session with warnings: ${warnings}.`,
  pm_activation_switched: (prefix: string) => `${prefix}. Zero CLI switched to it for this session.`,
  pm_warning_override_suffix: (error: string) => `. Warning: could not clear startup provider override (${error}).`,

  // Agents menu
  agents_title: 'Agents',
  agents_builtin_source: 'Built-in agents',
  agents_plugin_source: 'Plugin agents',
  agents_create_new: 'Create new agent',
  agents_no_agents_subtitle: 'No agents found',
  agents_no_agents_desc1: 'No agents found. Create specialized subagents that Zero can delegate to.',
  agents_no_agents_desc2: 'Each subagent has its own context window, custom system prompt, and specific tools.',
  agents_no_agents_desc3: 'Try creating: Code Reviewer, Code Simplifier, Security Reviewer, Tech Lead, or UX Reviewer.',
  agents_builtin_always_available_title: 'Built-in (always available):',
  agents_builtin_label: 'Built-in agents',
  agents_builtin_always_avail_parens: ' (always available)',
  agents_builtin_note: 'Built-in agents are provided by default and cannot be modified.',
  agents_memory_suffix: ' memory',
  agents_shadowed_by: ' shadowed by ',
  agents_count: (n: number) => `${n} agents`,
  agents_nav_default: 'Press \u2191\u2193 to navigate \xB7 Enter to select \xB7 Esc to go back',
  agents_nav_enter_esc: 'Press Enter or Esc to go back',
  agents_nav_navigate_cancel: 'Press \u2191\u2193 to navigate, Enter to select, Esc to cancel',
  agents_menu_view: 'View agent',
  agents_menu_edit: 'Edit agent',
  agents_menu_delete: 'Delete agent',
  agents_menu_back: 'Back',
  agents_confirm_delete_title: 'Delete agent',
  agents_confirm_delete_prefix: 'Are you sure you want to delete the agent',
  agents_detail_source: (source: string) => `Source: ${source}`,
  agents_confirm_yes: 'Yes, delete',
  agents_confirm_no: 'No, cancel',
  agents_edit_title: (name: string) => `Edit agent: ${name}`,
  agents_deleted_msg: (name: string) => `Deleted agent: ${name}`,
  agents_editor_open: 'Open in editor',
  agents_editor_tools: 'Edit tools',
  agents_editor_model: 'Edit model',
  agents_editor_color: 'Edit color',
  agents_editor_opened_msg: (name: string) => `Opened ${name} in editor. If you made edits, restart to load the latest version.`,
  agents_editor_updated_msg: (name: string) => `Updated agent: ${name}`,
  agents_editor_save_error: 'Failed to save agent',
  agents_cli_none_found: 'No agents found.',

  // Command response messages
  cmd_agents_dismissed: 'Agents dialog dismissed',
  cmd_branch_no_conversation: 'No conversation to branch',
  cmd_branch_no_messages: 'No messages to branch',
  cmd_branch_failed: (msg: string) => `Failed to branch conversation: ${msg}`,
  cmd_btw_usage: 'Usage: /btw <your question>',
  cmd_buddy_usage: 'Usage: /buddy [status|mute|unmute]\n\nRun /buddy with no args to hatch your companion the first time, then pet it on later runs.\n\n- mute: hides your buddy from the screen\n- unmute: brings your buddy back',
  cmd_buddy_no_buddy: 'No buddy hatched yet. Run /buddy to hatch one.',
  cmd_buddy_muted: 'Buddy muted.',
  cmd_buddy_unmuted: 'Buddy unmuted.',
  cmd_cache_probe_failed: (status: number, error: string) => `Cache probe failed on first call: HTTP ${status}\n${error}\n\nFull details in debug log.`,
  cmd_cache_probe_title: (model: string, api: string, mode: string) => `Cache Probe — ${model} via ${api}${mode}`,
  cmd_cache_probe_call: (n: number, elapsed: number, input: number, cached: number) => `Call ${n}: ${elapsed}ms, input=${input}, cached=${cached}`,
  cmd_cache_probe_verdict_hit: (cached: number, rate: string | number) => `CACHE HIT: ${cached} cached tokens (${rate}% of input)`,
  cmd_cache_probe_verdict_inconclusive: 'INCONCLUSIVE: Server returns 0 input_tokens — cannot measure',
  cmd_cache_probe_verdict_possible_silent: (pct: number) => `POSSIBLE SILENT CACHING: Call 2 was ${pct}% faster but no cached_tokens reported`,
  cmd_cache_probe_verdict_no_cache: 'NO CACHE DETECTED',
  cmd_cache_probe_what_main: (shimLabel: string) => `What main's ${shimLabel} reports:`,
  cmd_cache_probe_full_details: 'Full details written to debug log.',
  cmd_cache_probe_responses_api: 'Responses API',
  cmd_cache_probe_chat_completions: 'Chat Completions',
  cmd_slash_usage: 'Commands are in the form `/command [args]`',
  cmd_color_teammate: 'Cannot set color: This session is a swarm teammate. Teammate colors are assigned by the team leader.',
  cmd_color_usage: (colors: string) => `Please provide a color. Available colors: ${colors}, default`,
  cmd_compact_spinner: 'Compacting conversation',
  cmd_compact_in_progress: 'Compacting conversation\u2026',
  cmd_compact_compacted: 'Compacted',
  cmd_compact_full_summary: (shortcut: string) => `(${shortcut} to see full summary)`,
  cmd_compact_notification: (shortcut: string) => `Conversation summarized (${shortcut} for history)`,
  cmd_compact_boundary: (shortcut: string) => `\u273b Conversation compacted (${shortcut} for history)`,
  cmd_copy_no_message: 'No assistant message to copy',
  cmd_cost_total: (cost: string) => `Total cost:            ${cost}`,
  cmd_cost_duration_api: (dur: string) => `Total duration (API):  ${dur}`,
  cmd_cost_duration_wall: (dur: string) => `Total duration (wall): ${dur}`,
  cmd_cost_changes: (added: number, addedLabel: string, removed: number, removedLabel: string) => `Total code changes:    ${added} ${addedLabel} added, ${removed} ${removedLabel} removed`,
  cmd_cost_line: 'line',
  cmd_cost_lines: 'lines',
  const_no_content: '(no content)',

  // Add directory dialog
  add_dir_title: 'Add directory to workspace',
  add_dir_enter_path: 'Enter the path to the directory:',
  add_dir_placeholder: 'Directory path…',

  // Branch success messages
  cmd_branch_success: (titleInfo: string, resumeHint: string) => `Branched conversation${titleInfo}. You are now in the branch.${resumeHint}`,
  cmd_branch_success_fallback: (titleInfo: string, sessionId: string) => `Branched conversation${titleInfo}. Resume with: /resume ${sessionId}`,
  cmd_branch_resume_hint: (sessionId: string) => `\nTo resume the original: claude -r ${sessionId}`,

  // Compact summary labels
  compact_summary_label: 'Compact summary',
  compact_summary_summarized_conv: 'Summarized conversation',
  compact_summary_messages_up_to: (n: number) => `Summarized ${n} messages up to this point`,
  compact_summary_messages_from: (n: number) => `Summarized ${n} messages from this point`,
  compact_summary_context_label: 'Context:',
  compact_summary_expand_hint: 'expand history',

  // Transcript bar
  transcript_bar_showing: 'Showing detailed transcript',
  transcript_bar_to_toggle: (shortcut: string) => `${shortcut} to toggle`,
  transcript_bar_to_collapse: 'collapse',
  transcript_bar_to_show_all: 'show all',

  // Copy command success
  cmd_copy_success: (chars: number, lines: number) => `Copied to clipboard (${chars} characters, ${lines} lines)`,
  cmd_copy_also_written: (path: string) => `Also written to ${path}`,
  cmd_copy_success_with_file: (chars: number, lines: number, path: string) => `Copied to clipboard (${chars} characters, ${lines} lines)\nAlso written to ${path}`,

  // Cost: model usage
  cmd_cost_usage_by_model: 'Usage by model:',
  cmd_cost_input: 'input',
  cmd_cost_output: 'output',
  cmd_cost_cache_read: 'cache read',
  cmd_cost_cache_write: 'cache write',
  cmd_cost_web_search: 'web search',
  cmd_cost_inaccurate: ' (costs may be inaccurate due to usage of unknown models)',

  // Diff UI
  diff_truncated: '\u2026 diff truncated (exceeded 400 line limit)',
  diff_nav_select: '\u2191/\u2193 select',
  diff_nav_enter_view: 'Enter view',
  diff_nav_esc_close: (key: string) => `${key} close`,
  diff_nav_back: '\u2190 back',
  diff_nav_source: '\u2190/\u2192 source',

  // Effort picker
  effort_set_level_title: 'Set effort level',
  effort_not_supported: 'Effort not supported for this model',
  effort_auto_description: 'Use the default effort level for your model',
  effort_low_description: 'Quick, straightforward implementation with minimal overhead',
  effort_medium_description: 'Balanced approach with standard implementation and testing',
  effort_high_description: 'Comprehensive implementation with extensive testing and documentation',
  effort_max_description: 'Maximum capability with deepest reasoning (Opus 4.6 only)',
  effort_xhigh_description: 'Extra high reasoning effort for complex tasks (OpenAI/Codex)',
  effort_level_auto: 'Auto',
  effort_usage_msg: 'Usage: /effort [low|medium|high|max|auto]\n\nEffort levels:\n- low: Quick, straightforward implementation\n- medium: Balanced approach with standard testing\n- high: Comprehensive implementation with extensive testing\n- max: Maximum capability with deepest reasoning (Opus 4.6 only)\n- auto: Use the default effort level for your model',
  effort_set_msg: (level: string, suffix: string, description: string) => `Set effort level to ${level}${suffix}: ${description}`,
  effort_auto_set_msg: 'Effort level set to auto',
  effort_current_msg: (level: string, description: string) => `Current effort level: ${level} (${description})`,
  effort_status_auto: (level: string) => `Effort level: auto (currently ${level})`,
  effort_cancelled: 'Cancelled',
  effort_default_description: 'Use default effort level for your model',

  ideLineSingular: 'line',
  ideLinePlural: 'lines',
  ideSelected: 'selected',
  ideInFile: 'In',

  // IDE command screen
  ide_dialog_title: 'Select IDE',
  ide_dialog_subtitle: 'Connect to an IDE for integrated development features.',
  ide_no_available_jetbrains: 'No available IDEs detected. Please install the plugin and restart your IDE:\nhttps://docs.claude.com/s/claude-code-jetbrains',
  ide_no_available_general: 'No available IDEs detected. Make sure your IDE has the ZeroCLI extension or plugin installed and is running.',
  ide_multiple_vscode_warning: 'Note: Only one ZeroCLI instance can be connected to VS Code at a time.',
  ide_auto_connect_tip: 'Tip: You can enable auto-connect to IDE in /config or with the --ide flag',
  ide_unavailable_count: (count: number) => `Found ${count} other running IDE(s). However, their workspace/project directories do not match the current cwd.`,
  ide_open_dialog_title: 'Select an IDE to open the project',
  ide_install_dialog_title: 'Select IDE to install extension',
  ide_connecting: (name: string) => `Connecting to ${name}\u2026`,
  ide_connected: (name: string) => `Connected to ${name}.`,
  ide_failed_connect: (name: string) => `Failed to connect to ${name}.`,
  ide_timed_out: (name: string) => `Connection to ${name} timed out.`,
  ide_error_connecting: 'Error connecting to IDE.',
  ide_disconnected: (name: string) => `Disconnected from ${name}.`,
  ide_no_selected: 'No IDE selected.',
  ide_selection_cancelled: 'IDE selection cancelled',
  ide_no_extensions_detected: 'No IDEs with ZeroCLI extension detected.',
  ide_exited_without_opening: 'Exited without opening IDE',
  ide_opened_in: (typeLabel: string, boldName: string) => `Opened ${typeLabel} in ${boldName}`,
  ide_failed_open_manual: (name: string, path: string) => `Failed to open in ${name}. Try opening manually: ${path}`,
  ide_please_open_manually: (typeLabel: string, boldName: string, path: string) => `Please open the ${typeLabel} manually in ${boldName}: ${path}`,
  ide_worktree_label: 'worktree',
  ide_project_label: 'project',
  ide_installed_plugin: (boldName: string) => `Installed plugin to ${boldName}\nPlease restart your IDE completely for it to take effect`,
  ide_installed_extension: (boldName: string) => `Installed extension to ${boldName}`,

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
  no_image_ssh: 'Image paste unavailable over SSH. Drag an image file into the terminal.',
  no_image_linux: 'No image in clipboard. Install xclip: sudo apt install xclip',
  no_image_generic: (shortcut: string) => `No image in clipboard. Use ${shortcut} to paste.`,

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
  cmd_update_config: 'Use this skill to configure the Zero CLI harness via settings.json. Automated behaviors ("from now on when X", "each time X", "whenever X", "before/after X") require hooks configured in settings.json - the harness executes these, not Zero, so memory/preferences cannot fulfill them. Also use for: permissions ("allow X", "add permission", "move permission to"), env vars ("set X=Y"), hook troubleshooting, or any changes to settings.json/settings.local.json files. For simple settings like theme/model, use Config tool.',
  cmd_dream: 'Run memory consolidation — synthesize recent sessions into durable memories',
  cmd_bridge_kick: 'Inject bridge failure states for manual recovery testing',
  cmd_commit_push_pr: 'Commit, push, and open a PR',
  cmd_brief: 'Toggle brief-only mode',
  cmd_version_debug: 'Print the version this session is running (not what autoupdate downloaded)',
  cmd_init_verifiers: 'Create verifier skill(s) for automated verification of code changes',
  cmd_ultrareview: '~10–20 min · Finds and verifies bugs in your branch. Runs in ZeroCLI on the web. See https://code.claude.com/docs/en/claude-code-on-the-web',

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
    'desktop-app': 'Run ZeroCLI locally or remotely using the Zero desktop app: clau.de/desktop',
    'web-app': 'Run tasks in the cloud while you keep coding locally \u00b7 clau.de/web',
    'mobile-app': '/mobile to use ZeroCLI from the Zero app on your phone',
    'feedback-command': 'Use /feedback to help us improve!',
    'clear': 'Use /clear to start fresh when switching topics and free up context',
    'btw': "Use /btw to ask a quick side question without interrupting Zero's current work",
  },

  // Away summary (while-you-were-away recap)
  awaySummaryMemoryBlock: (memory: string) =>
    `Session memory (broader context):\n${memory}\n\n`,
  awaySummaryPrompt:
    'The user stepped away and is coming back. Write exactly 1-3 short sentences. Start by stating the high-level task — what they are building or debugging, not implementation details. Next: the concrete next step. Skip status reports and commit recaps.',

  // MCP List Panel
  mcp_scope_project: 'Project MCPs',
  mcp_scope_user: 'User MCPs',
  mcp_scope_local: 'Local MCPs',
  mcp_scope_enterprise: 'Enterprise MCPs',
  mcp_scope_dynamic: 'Built-in MCPs',
  mcp_alwaysAvailable: 'always available',
  mcp_status_disabled: 'disabled',
  mcp_status_connected: 'connected',
  mcp_status_reconnecting: (count: number) => `reconnecting (${count})`,
  mcp_status_connecting: 'connecting\u2026',
  mcp_status_needsAuth: 'needs authentication',
  mcp_status_failed: 'failed',
  mcp_mayNeedAuth: 'may need auth',
  mcp_agentOnly: 'agent-only',
  mcp_dismissed: 'MCP dialog dismissed',
  mcp_manageTitle: 'Manage MCP servers',
  mcp_debugInline: '\u27E1 Error logs shown inline with --debug',
  mcp_debugRunFlag: '\u27E1 Run claude --debug to see error logs',
  mcp_hintNavigate: 'navigate',
  mcp_hintConfirm: 'confirm',
  mcp_hintCancel: 'cancel',
  mcp_agentHeading: 'Agent MCPs',
  mcp_forHelp: 'for help',
}
