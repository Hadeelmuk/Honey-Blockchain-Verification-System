'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ConnectWalletButton } from './connect-wallet-button'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function HeaderContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-amber-200 transition-colors flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-amber-600 text-lg">🍯</span>
            </div>
            Honey Blockchain
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-amber-200 transition-colors">
              Home
            </Link>
            <Link href="/add" className="hover:text-amber-200 transition-colors">
              Add Honey
            </Link>
            <Link href="/verify" className="hover:text-amber-200 transition-colors">
              Verify Honey
            </Link>
            <Link href="/about" className="hover:text-amber-200 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Wallet Button */}
          <div className="hidden md:flex items-center">
            <ConnectWalletButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-amber-500">
            <nav className="flex flex-col space-y-3 mt-4">
              <Link 
                href="/" 
                className="hover:text-amber-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/add" 
                className="hover:text-amber-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Honey
              </Link>
              <Link 
                href="/verify" 
                className="hover:text-amber-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Verify Honey
              </Link>
              <Link 
                href="/about" 
                className="hover:text-amber-200 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <div className="pt-2">
                <ConnectWalletButton />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
} 