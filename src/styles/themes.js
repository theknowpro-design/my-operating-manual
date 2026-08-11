import { lightColors, darkColors } from './colors.js'
import { fontFamilies, fontSizes, fontWeights, lineHeights } from './typography.js'
import { space, radii, shadows, transitions, layout } from './spacing.js'

export const THEME_STORAGE_KEY = 'mom-theme'

export function buildThemeVariables(mode = 'light') {
  const colors = mode === 'dark' ? darkColors : lightColors
  return {
    '--color-bg': colors.bg,
    '--color-bg-end': colors.bgEnd,
    '--color-surface': colors.surface,
    '--color-surface-raised': colors.surfaceRaised,
    '--color-border': colors.border,
    '--color-border-focus': colors.borderFocus,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    '--color-accent': colors.accent,
    '--color-accent-hover': colors.accentHover,
    '--color-accent-muted': colors.accentMuted,
    '--color-accent-subtle': colors.accentSubtle,
    '--color-on-accent': colors.onAccent,
    '--color-success': colors.success,
    '--color-success-subtle': colors.successSubtle,
    '--color-error': colors.error,
    '--color-error-subtle': colors.errorSubtle,
    '--color-warning': colors.warning,
    '--color-callout-bg': colors.calloutBg,
    '--color-callout-border': colors.calloutBorder,
    '--font-sans': fontFamilies.sans,
    '--font-mono': fontFamilies.mono,
    '--text-xs': fontSizes.xs,
    '--text-sm': fontSizes.sm,
    '--text-base': fontSizes.base,
    '--text-lg': fontSizes.lg,
    '--text-xl': fontSizes.xl,
    '--text-2xl': fontSizes['2xl'],
    '--text-3xl': fontSizes['3xl'],
    '--text-4xl': fontSizes['4xl'],
    '--font-light': String(fontWeights.light),
    '--font-normal': String(fontWeights.normal),
    '--font-medium': String(fontWeights.medium),
    '--font-semibold': String(fontWeights.semibold),
    '--font-bold': String(fontWeights.bold),
    '--leading-tight': String(lineHeights.tight),
    '--leading-relaxed': String(lineHeights.relaxed),
    '--space-1': space[1],
    '--space-2': space[2],
    '--space-3': space[3],
    '--space-4': space[4],
    '--space-5': space[5],
    '--space-6': space[6],
    '--space-8': space[8],
    '--space-10': space[10],
    '--space-12': space[12],
    '--radius-sm': radii.sm,
    '--radius-md': radii.md,
    '--radius-lg': radii.lg,
    '--radius-full': radii.full,
    '--shadow-sm': shadows.sm,
    '--shadow-md': shadows.md,
    '--shadow-lg': shadows.lg,
    '--transition-fast': transitions.fast,
    '--transition-base': transitions.base,
    '--transition-toggle': transitions.toggle,
    '--transition-progress': transitions.progress,
    '--max-width': layout.maxWidth,
    '--content-max': layout.contentMax,
    '--sidebar-width': layout.sidebarWidth,
    '--header-height': layout.headerHeight,
  }
}

export function applyThemeToDocument(mode = 'light') {
  const root = document.documentElement
  const vars = buildThemeVariables(mode)
  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  root.classList.toggle('dark', mode === 'dark')
  root.dataset.theme = mode
}
