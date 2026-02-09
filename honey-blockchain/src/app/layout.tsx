import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { HeaderContent } from '@/components/header-content'
import { WalletProvider } from '@/lib/wallet-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Honey Blockchain - Authentic Honey Traceability',
  description: 'Verify authentic honey through blockchain technology',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-amber-50 min-h-screen`}>
        <WalletProvider>
          <HeaderContent />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-amber-900 text-amber-100 py-12">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">🍯 Honey Blockchain</h3>
                  <p className="text-amber-200">
                    Ensuring honey authenticity through blockchain technology
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">For Beekeepers</h4>
                  <ul className="space-y-2 text-amber-200">
                    <li>Record honey batches</li>
                    <li>Generate QR codes</li>
                    <li>Build consumer trust</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">For Consumers</h4>
                  <ul className="space-y-2 text-amber-200">
                    <li>Verify honey authenticity</li>
                    <li>View origin details</li>
                    <li>Blockchain verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </footer>
        </WalletProvider>
      </body>
    </html>
  )
}
