/**
 * Shared types for the keybinding system.
 */

/**
 * Valid context names for keybindings.
 */
export type KeybindingContextName =
  | 'Global'
  | 'Chat'
  | 'Autocomplete'
  | 'Confirmation'
  | 'Help'
  | 'Transcript'
  | 'HistorySearch'
  | 'Task'
  | 'ThemePicker'
  | 'Settings'
  | 'Tabs'
  | 'Attachments'
  | 'Footer'
  | 'MessageSelector'
  | 'Scroll'
  | 'MessageActions'
  | 'DiffDialog'
  | 'ModelPicker'
  | 'Select'
  | 'Plugin'

/**
 * A single parsed keystroke (e.g. "ctrl+shift+k").
 */
export type ParsedKeystroke = {
  key: string
  ctrl: boolean
  alt: boolean
  shift: boolean
  meta: boolean
  super: boolean
}

/**
 * A chord is an ordered sequence of keystrokes (e.g. "ctrl+k ctrl+s").
 */
export type Chord = ParsedKeystroke[]

/**
 * A fully parsed keybinding: keystroke(s) + action + context.
 */
export type ParsedBinding = {
  chord: Chord
  action: string | null
  context: KeybindingContextName
}

/**
 * A keybinding block from the JSON config file.
 */
export type KeybindingBlock = {
  context: KeybindingContextName
  bindings: Record<string, string | null>
}
