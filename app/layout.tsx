import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ROTEX — Built to Stand Out',
  description: 'Premium headwear. Distinctive designs. Discover the ROTEX first drop.',
  applicationName: 'ROTEX',
  openGraph: {
    title: 'ROTEX — Built to Stand Out',
    description: 'Premium headwear. Distinctive designs. Discover the ROTEX first drop.',
    type: 'website',
    siteName: 'ROTEX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ROTEX — Built to Stand Out',
    description: 'Premium headwear. Distinctive designs. Discover the ROTEX first drop.',
  },
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f7f5f0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
