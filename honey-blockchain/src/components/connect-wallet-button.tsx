'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Wallet, AlertTriangle } from 'lucide-react'
import { useWallet } from '@/lib/wallet-context'

export function ConnectWalletButton() {
  const { account, isConnected, connectWallet, disconnectWallet, isConnecting, error } = useWallet()

  console.log('ConnectWalletButton render:', { account, isConnected, isConnecting, error })

  if (error) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle className="h-3 w-3" />
        {error}
      </Badge>
    )
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-600 text-white">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </Badge>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={disconnectWallet}
          className="text-white hover:text-amber-200"
        >
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-white text-amber-600 hover:bg-amber-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  )
} 