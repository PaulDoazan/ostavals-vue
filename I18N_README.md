# Internationalization (i18n) System

This project now includes a complete internationalization system that supports French (Fr) and Basque (Eus) languages.

## Features

- **Language Switching**: Click on language buttons in the language panel to switch between French and Basque
- **Persistent Storage**: Language preference is saved in localStorage and restored on page reload
- **Browser Detection**: Automatically detects browser language and sets appropriate default
- **Accessibility**: Updates document language attribute for screen readers
- **Type Safety**: Full TypeScript support with proper type declarations

## How to Use

### 1. Basic Translation

Use the `useI18n()` composable in your Vue components:

```vue
<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>{{ t('home.title') }}</div>
</template>
```

### 2. Language Switching

Use the `useLanguage()` composable to manage language state:

```vue
<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { currentLanguage, switchLanguage } = useLanguage()

const handleLanguageClick = (langCode: string) => {
  switchLanguage(langCode)
}
</script>
```

### 3. Adding New Translations

1. Add new keys to `src/i18n/locales/fr.json` (French)
2. Add corresponding translations to `src/i18n/locales/eus.json` (Basque)
3. Use the new keys in your components with `t('new.key')`

Example:
```json
// fr.json
{
  "newSection": {
    "title": "Nouveau titre"
  }
}

// eus.json
{
  "newSection": {
    "title": "Izenburu berria"
  }
}
```

## File Structure

```
src/
├── i18n/
│   ├── index.ts              # Main i18n configuration
│   └── locales/
│       ├── fr.json           # French translations
│       └── eus.json          # Basque translations
├── composables/
│   └── useLanguage.ts        # Language management composable
└── types/
    └── i18n.d.ts            # TypeScript declarations
```

## Language Codes

- `fr`: French (Français)
- `eus`: Basque (Euskara)

## Browser Language Detection

The system automatically detects the user's browser language and sets the appropriate default:
- If browser language is Basque (`eu`), defaults to Basque
- Otherwise, defaults to French

## Persistence

Language preference is automatically saved to localStorage and restored when the user returns to the site.

## Accessibility

The system automatically updates the `lang` attribute on the `<html>` element when switching languages, improving accessibility for screen readers and other assistive technologies.
