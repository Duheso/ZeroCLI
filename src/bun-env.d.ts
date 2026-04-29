/// <reference types="bun-types" />

/** Type declarations for modules without bundled types. */
declare module 'qrcode' {
  export function toString(
    text: string,
    options?: Record<string, unknown>,
  ): Promise<string>
  export function toDataURL(
    text: string,
    options?: Record<string, unknown>,
  ): Promise<string>
}

/**
 * Build-time constants injected by Bun.define in scripts/build.ts.
 * Replaced with string literals at bundle time; declared here for TypeScript.
 */
declare module 'image-processor-napi' {
  export function getNativeModule(): {
    hasClipboardImage?: () => boolean
    readClipboardImage?: (
      maxWidth: number,
      maxHeight: number,
    ) => {
      png: Buffer
      originalWidth: number
      originalHeight: number
      width: number
      height: number
    } | null
  } | null
  export const __stub: boolean | undefined 
  export const sharp: unknown
  export default sharp
}

declare const MACRO: {
  /** Internal compat version (always "0.7.3" in open build). */
  VERSION: string
  /** Human-readable display version (e.g. "0.7.3"). */
  DISPLAY_VERSION?: string
  /** ISO timestamp of the build. */
  BUILD_TIME: string
  /** Issue reporting instruction string. */
  ISSUES_EXPLAINER: string
  /** Published npm package name. */
  PACKAGE_URL: string
  /** Native package URL, if any. */
  NATIVE_PACKAGE_URL?: string
  /** Bundled version changelog string (newlines-separated commits). */
  VERSION_CHANGELOG?: string
}
