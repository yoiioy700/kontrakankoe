import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  title: 'KontrakanKoe — Autopilot Tagihan Anak Kos',
  description: 'Autopilot tagihan anak kos. Tanpa sungkan, tanpa drama bukti transfer.',
  other: {
    'talentapp:project_verification': '902644012c29ab2385061338b24e5af6faf2dc9093d1a45d3d419687e7c5ddb97fe75d6e191b82e6273074ef74732386ff8e7cc49beded90ae551716e52fe0bf'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
