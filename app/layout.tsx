import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { AppShell } from '@/components/app-shell'
import { LocaleProvider } from '@/components/locale-provider'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'NEXA HR — People, Payroll & Workforce',
  description:
    'Platform internal HR dan penggajian global: Core HR, payroll multi-negara, waktu & cuti, onboarding, rekrutmen, performa, dan analitik tenaga kerja.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0f120e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f120e" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="NEXA HR" />
        <LocaleProvider defaultLocale="id">
          <AppShell>{children}</AppShell>
        </LocaleProvider>
        <script
          id="sw-register"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js').then(
                  (registration) => {
                    console.log('SW registered: ', registration.scope)
                  },
                  (error) => {
                    console.log('SW registration failed: ', error)
                  }
                )
              }
            `,
          }}
        />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
