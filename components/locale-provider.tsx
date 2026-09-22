'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Locale } from '@/lib/i18n'

type Messages = Record<string, any>

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
  t: (key: string, params?: Record<string, string | number>) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({
  children,
  defaultLocale = 'id' as Locale,
}: {
  children: React.ReactNode
  defaultLocale?: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [messages, setMessages] = useState<Messages>({})

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('nexa-locale', newLocale)
    import(`@/messages/${newLocale}.json`).then((mod) => setMessages(mod.default))
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('nexa-locale') as Locale | null
    const initial = saved || defaultLocale
    setLocaleState(initial)
    import(`@/messages/${initial}.json`).then((mod) => setMessages(mod.default))
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const keys = key.split('.')
      let value: any = messages
      for (const k of keys) {
        value = value?.[k]
        if (value === undefined) return key
      }
      if (typeof value !== 'string') return key
      if (params) {
        return value.replace(/\{\{(\w+)\}}/g, (match, paramKey) => {
          return String(params[paramKey] ?? match)
        })
      }
      return value
    },
    [messages]
  )

  return (
    <LocaleContext.Provider value={{ locale, setLocale, messages, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) throw new Error('useLocale must be used within LocaleProvider')
  return context
}
