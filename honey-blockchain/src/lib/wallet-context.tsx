'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface WalletContextType {
  account: string
  isConnected: boolean
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isConnecting: boolean
  error: string
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

declare global {
  interface Window {
    ethereum?: any
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string>('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string>('')

  const checkIfWalletIsConnected = async () => {
    console.log('Checking if wallet is connected...')
    try {
      if (window.ethereum) {
        console.log('MetaMask detected')
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        })
        console.log('Current accounts:', accounts)
        if (accounts.length > 0) {
          setAccount(accounts[0])
          console.log('Wallet connected:', accounts[0])
        } else {
          console.log('No accounts found')
        }
      } else {
        console.log('MetaMask not detected')
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    console.log('Attempting to connect wallet...')
    if (!window.ethereum) {
      console.log('MetaMask not installed')
      setError('MetaMask not installed. Please install MetaMask extension.')
      return
    }

    setIsConnecting(true)
    setError('')

    try {
      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      console.log('Current chain ID:', chainId)
      
      // Hardhat local network chain ID (31337 in hex is 0x7a69)
      if (chainId !== '0x7a69') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x7a69' }],
          })
        } catch (switchError: any) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x7a69',
                chainName: 'Hardhat Local',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18
                }
              }]
            })
          } else {
            throw switchError
          }
        }
      }

      console.log('Requesting accounts...')
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      console.log('Accounts received:', accounts)
      if (accounts.length > 0) {
        setAccount(accounts[0])
        console.log('Wallet connected successfully:', accounts[0])
      } else {
        console.log('No accounts returned')
        setError('No accounts found')
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      if (error.code === 4001) {
        setError('Connection rejected by user')
      } else if (error.code === -32002) {
        setError('MetaMask is already processing a request')
      } else {
        setError(error.message || 'Failed to connect wallet')
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...')
    setAccount('')
    setError('')
  }

  useEffect(() => {
    console.log('WalletProvider mounted')
    checkIfWalletIsConnected()

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        console.log('Accounts changed:', accounts)
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          setAccount('')
        }
      })
    }
  }, [])

  const value = {
    account,
    isConnected: !!account,
    connectWallet,
    disconnectWallet,
    isConnecting,
    error
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 