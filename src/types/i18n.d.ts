declare module 'vue-i18n' {
  import { ComponentCustomProperties } from 'vue'
  
  declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
      $t: (key: string, values?: Record<string, any>) => string
      $tc: (key: string, count?: number, values?: Record<string, any>) => string
      $te: (key: string) => boolean
      $d: (value: Date | number, format?: string, locale?: string) => string
      $n: (value: number, format?: string, locale?: string) => string
    }
  }
}

export {}
