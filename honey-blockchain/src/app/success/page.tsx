'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, Download, Share2, Copy } from 'lucide-react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'

interface HoneyBatchData {
  beekeeperName: string
  region: string
  flowerType: string
  harvestDate: string
  description?: string
  batchId: number
  displayId: string
  walletAddress: string
  timestamp: string
  blockchainTxHash: string
}

export default function SuccessPage() {
  const [batchData, setBatchData] = useState<HoneyBatchData | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('honeyBatch')
      if (stored) {
        setBatchData(JSON.parse(stored))
      }
    }
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code') as SVGElement
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg)
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      canvas.width = 200
      canvas.height = 200
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        const link = document.createElement('a')
        link.download = `honey-batch-${batchData?.displayId}.png`
        link.href = canvas.toDataURL()
        link.click()
      }
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
    }
  }

  if (!batchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-700">
                  No Batch Data Found
                </CardTitle>
                <CardDescription>
                  Please record a honey batch first to view the success page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/add">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Record Honey Batch
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Success Header */}
          <Card className="shadow-xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <div className="text-6xl mb-4">✅</div>
              <CardTitle className="text-3xl">
                Honey Batch Recorded Successfully!
              </CardTitle>
              <CardDescription className="text-green-100 text-lg">
                Your honey batch has been permanently recorded on the blockchain
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Verification Instructions */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700 flex items-center gap-2">
                🔍 How Customers Can Verify Your Honey
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    1
                  </div>
                  <h3 className="font-semibold mb-2">Scan QR Code</h3>
                  <p className="text-gray-600 text-sm">
                    Customers can scan the QR code on your honey jar to verify authenticity
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    2
                  </div>
                  <h3 className="font-semibold mb-2">Enter Batch ID</h3>
                  <p className="text-gray-600 text-sm">
                    They can manually enter the batch ID on the verification page
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    3
                  </div>
                  <h3 className="font-semibold mb-2">View Results</h3>
                  <p className="text-gray-600 text-sm">
                    They'll see detailed verification results and security analysis
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">💡 Your Batch ID: <span className="font-mono bg-green-100 px-2 py-1 rounded">{batchData?.displayId}</span></h4>
                <p className="text-green-700 text-sm">
                  Share this batch ID with your customers or print the QR code to attach to your honey jars. 
                  This allows customers to verify that your honey is authentic and was registered by a verified farmer.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Batch Information */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-700">
                  Batch Information
                </CardTitle>
                <CardDescription>
                  Details of your recorded honey batch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Batch ID:</span>
                  <Badge className="bg-amber-600 text-white">
                    {batchData.displayId}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold text-gray-700">Beekeeper:</span>
                    <p className="text-gray-600">{batchData.beekeeperName}</p>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-700">Region:</span>
                    <p className="text-gray-600">{batchData.region}</p>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-700">Flower Type:</span>
                    <p className="text-gray-600">{batchData.flowerType}</p>
                  </div>
                  
                  <div>
                    <span className="font-semibold text-gray-700">Harvest Date:</span>
                    <p className="text-gray-600">{new Date(batchData.harvestDate).toLocaleDateString()}</p>
                  </div>
                  
                  {batchData.description && (
                    <div>
                      <span className="font-semibold text-gray-700">Additional Details:</span>
                      <p className="text-gray-600">{batchData.description}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Blockchain Transaction:</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(batchData.blockchainTxHash)}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 font-mono break-all">
                    {batchData.blockchainTxHash}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-700">
                  QR Code
                </CardTitle>
                <CardDescription>
                  Scan this QR code to verify the honey batch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    <QRCodeSVG 
                      id="qr-code"
                      value={`${window.location.origin}/verify?id=${batchData.displayId}`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 justify-center">
                  <Button 
                    onClick={downloadQRCode}
                    variant="outline"
                    className="bg-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download QR
                  </Button>
                  <Button 
                    onClick={() => copyToClipboard(`${window.location.origin}/verify?id=${batchData.displayId}`)}
                    variant="outline"
                    className="bg-white"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Copy Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/add">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Record Another Batch
              </Button>
            </Link>
            <Link href="/verify">
              <Button variant="outline">
                Verify Honey Batches
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 