import type { Config } from 'payload'

/**
 * The 10 locales trainzilla.in ships. English is the only one populated in
 * Stage 3; the other nine are configured now so no schema migration is needed
 * when the re-translation pass happens.
 */
export const localization: Config['localization'] = {
  locales: [
    { label: 'English', code: 'en' },
    { label: 'हिन्दी (Hindi)', code: 'hi' },
    { label: 'Español', code: 'es' },
    { label: 'Français', code: 'fr' },
    { label: 'Deutsch', code: 'de' },
    { label: 'Português', code: 'pt' },
    { label: '中文 (Chinese)', code: 'zh' },
    { label: 'العربية (Arabic)', code: 'ar', rtl: true },
    { label: '日本語 (Japanese)', code: 'ja' },
    { label: '한국어 (Korean)', code: 'ko' },
  ],
  defaultLocale: 'en',
  fallback: true,
}
