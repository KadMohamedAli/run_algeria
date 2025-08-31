import Navbar from '../components/Navbar'
import './globals.css'

export const metadata = {
  title: 'Courses à pied Algérie',
  description: 'Recensement complet et à jour des courses à pied en Algérie, calendriers, résultats et informations pratiques.',
  keywords: ['courses à pied', 'Algérie', 'marathons', 'semi-marathons', 'trail', 'course locale'],
  authors: [{ name: 'Mohamed Ali Kaddour' }],
  creator: 'Mohamed Ali Kaddour',
  publisher: 'Courses à pied Algérie',
  openGraph: {
    title: 'Courses à pied Algérie',
    description: 'Recensement complet et à jour des courses à pied en Algérie.',
    url: 'https://coursesapied.dz', // replace with your domain
    siteName: 'Courses à pied Algérie',
    type: 'website',
    images: [
      {
        url: 'https://coursesapied.dz/og-image.jpg', // replace with your OG image
        width: 1200,
        height: 630,
        alt: 'Courses à pied Algérie'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Courses à pied Algérie',
    description: 'Recensement complet et à jour des courses à pied en Algérie.',
    site: '@YourTwitterHandle', // optional
    creator: '@YourTwitterHandle',
    images: ['https://coursesapied.dz/og-image.jpg']
  },
  viewport: 'width=device-width, initial-scale=1.0',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
        <Navbar />
        <main className="container mx-auto">{children}</main>
      </body>
    </html>
  )
}
