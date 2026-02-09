'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Search, CheckCircle, XCircle, AlertTriangle, Copy, ExternalLink, Shield, Clock, User, MapPin, QrCode } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { blockchainService, HoneyBatchData } from '@/lib/blockchain'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const [batchId, setBatchId] = useState('')
  const [batchData, setBatchData] = useState<HoneyBatchData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [verificationDetails, setVerificationDetails] = useState<{
    isAuthentic: boolean
    isRegisteredFarmer: boolean
    blockchainVerified: boolean
    timestampValid: boolean
    detailsValid: boolean
    riskLevel: 'low' | 'medium' | 'high'
    warnings: string[]
  } | null>(null)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      setBatchId(id)
      verifyBatch(id)
    }
  }, [searchParams])

  const verifyBatch = async (id: string) => {
    setIsLoading(true)
    setError('')
    setBatchData(null)
    setNotFound(false)
    setVerificationDetails(null)

    try {
      console.log('Verifying batch:', id)
      
      // First try to get data from database
      let data = null
      try {
        const dbResponse = await fetch(`/api/honey?batchId=${id}`)
        if (dbResponse.ok) {
          const dbData = await dbResponse.json()
          data = {
            displayId: dbData.data.batch_id,
            beekeeperName: dbData.data.beekeeper_name,
            region: dbData.data.region,
            flowerType: dbData.data.flower_type,
            harvestDate: dbData.data.harvest_date,
            description: dbData.data.description,
            exists: true,
            farmer: '0x0000000000000000000000000000000000000000', // Placeholder for database records
            timestamp: dbData.data.created_at,
            blockchainTxHash: null,
          }
        }
      } catch (dbError) {
        console.log('Database query failed, trying blockchain:', dbError)
      }
      
      // If not in database, try blockchain
      if (!data) {
        data = await blockchainService.getHoneyBatch(id)
      }
      
      if (data) {
        setBatchData(data)
        
        // Perform comprehensive verification
        const verification = await performComprehensiveVerification(data)
        setVerificationDetails(verification)
        
        console.log('Batch verified successfully:', data)
        console.log('Verification details:', verification)
      } else {
        setNotFound(true)
        console.log('Batch not found:', id)
      }
    } catch (error) {
      console.error('Verification failed:', error)
      setError('Failed to verify batch. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const performComprehensiveVerification = async (data: HoneyBatchData) => {
    const warnings: string[] = []
    let riskLevel: 'low' | 'medium' | 'high' = 'low'

    // Check if data exists on blockchain or database
    const blockchainVerified = data.exists && data.farmer && data.farmer !== '0x0000000000000000000000000000000000000000'
    
    // Check if farmer address is valid (for blockchain records)
    const isRegisteredFarmer = blockchainVerified && data.farmer.length === 42 && data.farmer.startsWith('0x')
    
    // For database records, we consider them valid if they exist
    const isDatabaseRecord = data.farmer === '0x0000000000000000000000000000000000000000'
    
    // Check timestamp validity
    const timestampValid = data.timestamp && new Date(data.timestamp).getTime() > 0
    
    // Check if harvest date is reasonable (not in the future, not too old)
    const harvestDate = new Date(data.harvestDate)
    const now = new Date()
    const harvestDateValid = harvestDate <= now && harvestDate >= new Date(2020, 0, 1)
    
    // Check if all required fields are present
    const detailsValid = data.beekeeperName && data.region && data.flowerType && data.harvestDate
    
    // Determine risk level and warnings
    if (!blockchainVerified && !isDatabaseRecord) {
      warnings.push('❌ This batch ID is not found on the blockchain or database')
      riskLevel = 'high'
    }
    
    if (!isRegisteredFarmer && !isDatabaseRecord) {
      warnings.push('⚠️ Invalid farmer registration detected')
      riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    }
    
    if (!timestampValid) {
      warnings.push('⚠️ Invalid timestamp detected')
      riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    }
    
    if (!harvestDateValid) {
      warnings.push('⚠️ Harvest date appears to be invalid')
      riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    }
    
    if (!detailsValid) {
      warnings.push('⚠️ Missing required batch information')
      riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    }
    
    // Check for suspicious patterns
    if (data.beekeeperName && data.beekeeperName.length < 2) {
      warnings.push('⚠️ Beekeeper name appears to be too short')
      riskLevel = riskLevel === 'low' ? 'medium' : 'high'
    }
    
    if (data.description && data.description.length > 1000) {
      warnings.push('⚠️ Description is unusually long')
    }

    const isAuthentic = Boolean(((blockchainVerified && isRegisteredFarmer) || isDatabaseRecord) && timestampValid && harvestDateValid && detailsValid)

    return {
      isAuthentic,
      isRegisteredFarmer: Boolean(isRegisteredFarmer),
      blockchainVerified: Boolean(blockchainVerified),
      timestampValid: Boolean(timestampValid),
      detailsValid: Boolean(detailsValid),
      riskLevel,
      warnings
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (batchId.trim()) {
      verifyBatch(batchId.trim())
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getFlowerTypeLabel = (flowerType: string) => {
    const flowerTypes: { [key: string]: string } = {
      'sidr': 'Sidr',
      'acacia': 'Acacia',
      'wildflower': 'Wildflower',
      'orange-blossom': 'Orange Blossom',
      'mountain-herbs': 'Mountain Herbs',
      'manuka': 'Manuka',
      'lavender': 'Lavender',
      'clover': 'Clover',
      'other': 'Other'
    }
    return flowerTypes[flowerType] || flowerType
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'bg-green-600'
      case 'medium': return 'bg-yellow-600'
      case 'high': return 'bg-red-600'
      default: return 'bg-gray-600'
    }
  }

  const getRiskLevelText = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'Low Risk'
      case 'medium': return 'Medium Risk'
      case 'high': return 'High Risk'
      default: return 'Unknown Risk'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <Card className="shadow-xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="text-4xl mb-4">🔍</div>
              <CardTitle className="text-3xl">
                Verify Honey Authenticity
              </CardTitle>
              <CardDescription className="text-blue-100 text-lg">
                Check if your honey was registered by an authentic farmer on the blockchain
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Search Form */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700">
                Enter Batch ID or Scan QR Code
              </CardTitle>
              <CardDescription>
                Enter the batch ID from your honey jar or scan the QR code to verify authenticity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Batch ID Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch ID
                  </label>
                  <form onSubmit={handleSubmit} className="flex gap-4">
                    <Input
                      placeholder="Enter Batch ID (e.g., HNY2025-001)"
                      value={batchId}
                      onChange={(e) => setBatchId(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={isLoading || !batchId.trim()}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Verify
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* QR Code Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    QR Code URL (Optional)
                  </label>
                  <div className="flex gap-4">
                    <Input
                      placeholder="Paste QR code URL or verification link"
                      onChange={(e) => {
                        const url = e.target.value
                        // Extract batch ID from URL if it's a verification link
                        const match = url.match(/[?&]id=([^&]+)/)
                        if (match) {
                          setBatchId(match[1])
                        }
                      }}
                      className="flex-1"
                    />
                    <Button 
                      onClick={() => {
                        if (batchId.trim()) {
                          verifyBatch(batchId.trim())
                        }
                      }}
                      disabled={isLoading || !batchId.trim()}
                      variant="outline"
                      className="border-amber-600 text-amber-600 hover:bg-amber-50"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      Extract & Verify
                    </Button>
                  </div>
                </div>

                {/* Quick Examples */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Example Batch IDs:</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setBatchId('HNY2025-001')}
                      className="text-xs"
                    >
                      HNY2025-001
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setBatchId('HNY2025-123')}
                      className="text-xs"
                    >
                      HNY2025-123
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setBatchId('HNY2025-456')}
                      className="text-xs"
                    >
                      HNY2025-456
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive" className="mb-8">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Not Found Message */}
          {notFound && (
            <Alert className="mb-8 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong>🚨 FAKE HONEY DETECTED!</strong>
                <br />
                Batch ID "{batchId}" was <strong>NOT FOUND</strong> on the blockchain. 
                This means no authentic farmer has registered this honey batch.
                <br />
                <strong>Recommendation:</strong> Do not purchase this honey as it may be counterfeit.
              </AlertDescription>
            </Alert>
          )}

          {/* Verification Results */}
          {batchData && verificationDetails && (
            <div className="space-y-8">
              
              {/* Authenticity Status */}
              <Card className={`shadow-lg ${verificationDetails.isAuthentic ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {verificationDetails.isAuthentic ? (
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <CardTitle className={`text-2xl ${verificationDetails.isAuthentic ? 'text-green-800' : 'text-red-800'}`}>
                        {verificationDetails.isAuthentic ? '✅ Authentic Honey Verified' : '❌ FAKE HONEY DETECTED'}
                      </CardTitle>
                      <CardDescription className={verificationDetails.isAuthentic ? 'text-green-700' : 'text-red-700'}>
                        {verificationDetails.isAuthentic 
                          ? 'This honey batch has been verified on the blockchain by an authentic farmer'
                          : 'This honey batch has verification issues and may be counterfeit'
                        }
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Security Analysis */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-700 flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Security Analysis
                  </CardTitle>
                  <CardDescription>
                    Detailed verification results and risk assessment
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Risk Level */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-semibold">Risk Level:</span>
                    <Badge className={`${getRiskLevelColor(verificationDetails.riskLevel)} text-white`}>
                      {getRiskLevelText(verificationDetails.riskLevel)}
                    </Badge>
                  </div>

                  {/* Verification Checks */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {verificationDetails.blockchainVerified ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <span className="font-semibold">Blockchain Verified</span>
                        <p className="text-sm text-gray-600">
                          {verificationDetails.blockchainVerified ? 'Found on blockchain' : 'Not found on blockchain'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {verificationDetails.isRegisteredFarmer ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <span className="font-semibold">Farmer Registration</span>
                        <p className="text-sm text-gray-600">
                          {verificationDetails.isRegisteredFarmer ? 'Valid farmer address' : 'Database record (no blockchain verification)'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {verificationDetails.timestampValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <span className="font-semibold">Timestamp Valid</span>
                        <p className="text-sm text-gray-600">
                          {verificationDetails.timestampValid ? 'Valid timestamp' : 'Invalid timestamp'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {verificationDetails.detailsValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <div>
                        <span className="font-semibold">Details Complete</span>
                        <p className="text-sm text-gray-600">
                          {verificationDetails.detailsValid ? 'All required fields present' : 'Missing required fields'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {verificationDetails.warnings.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Security Warnings</h4>
                      <ul className="space-y-1">
                        {verificationDetails.warnings.map((warning, index) => (
                          <li key={index} className="text-yellow-700 text-sm">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendation */}
                  <div className={`p-4 rounded-lg ${verificationDetails.isAuthentic ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <h4 className={`font-semibold mb-2 ${verificationDetails.isAuthentic ? 'text-green-800' : 'text-red-800'}`}>
                      💡 Recommendation
                    </h4>
                    <p className={verificationDetails.isAuthentic ? 'text-green-700' : 'text-red-700'}>
                      {verificationDetails.isAuthentic 
                        ? 'This honey appears to be authentic and was registered by a verified farmer. You can trust this product.'
                        : 'This honey has verification issues and may be counterfeit. We recommend not purchasing this product and reporting it to authorities.'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Batch Details */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl text-amber-700">
                    Batch Information
                  </CardTitle>
                  <CardDescription>
                    Complete details of the verified honey batch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Batch ID:</span>
                    <Badge className="bg-amber-600 text-white">
                      {batchData.displayId}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="font-semibold text-gray-700">Beekeeper:</span>
                          <p className="text-gray-600">{batchData.beekeeperName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="font-semibold text-gray-700">Region:</span>
                          <p className="text-gray-600">{batchData.region}</p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-700">Flower Type:</span>
                        <p className="text-gray-600">{getFlowerTypeLabel(batchData.flowerType)}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <div>
                          <span className="font-semibold text-gray-700">Harvest Date:</span>
                          <p className="text-gray-600">{new Date(batchData.harvestDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="font-semibold text-gray-700">Recorded On:</span>
                        <p className="text-gray-600">{new Date(batchData.timestamp).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-700">Farmer Address:</span>
                        <p className="text-xs font-mono text-gray-600 break-all">
                          {batchData.farmer}
                        </p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-700">Blockchain Network:</span>
                        <p className="text-gray-600">Ethereum (Local Development)</p>
                      </div>
                      
                      <div>
                        <span className="font-semibold text-gray-700">Verification Status:</span>
                        <Badge className={`${verificationDetails.isAuthentic ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                          {verificationDetails.isAuthentic ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Failed
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {batchData.description && (
                    <div className="pt-4 border-t">
                      <span className="font-semibold text-gray-700">Additional Details:</span>
                      <p className="text-gray-600 mt-2">{batchData.description}</p>
                    </div>
                  )}

                  {batchData.blockchainTxHash && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-700">Blockchain Transaction:</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => copyToClipboard(batchData.blockchainTxHash || '')}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Copy Hash
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${batchData.blockchainTxHash || ''}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            View on Etherscan
                          </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 font-mono break-all mt-2">
                        {batchData.blockchainTxHash}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/verify">
                  <Button variant="outline">
                    Verify Another Batch
                  </Button>
                </Link>
                <Link href="/add">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Record New Batch
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="ghost">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Instructions */}
          {!batchData && !isLoading && !notFound && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-amber-700">
                  How to Verify Your Honey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      1
                    </div>
                    <h3 className="font-semibold mb-2">Find Your Batch ID</h3>
                    <p className="text-gray-600 text-sm">
                      Look for the batch ID on your honey jar label or scan the QR code
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      2
                    </div>
                    <h3 className="font-semibold mb-2">Enter the ID</h3>
                    <p className="text-gray-600 text-sm">
                      Enter the batch ID in the search field above
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      3
                    </div>
                    <h3 className="font-semibold mb-2">Verify Authenticity</h3>
                    <p className="text-gray-600 text-sm">
                      View the complete blockchain record and verify authenticity
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Testing the System</h4>
                  <p className="text-blue-700 text-sm">
                    To test the verification system, first create a honey batch using the "Record New Batch" button above. 
                    After creating a batch, you'll get a batch ID that you can use here to verify the honey's authenticity.
                  </p>
                </div>

                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">🛡️ Security Features</h4>
                  <p className="text-green-700 text-sm">
                    Our verification system checks multiple security factors including blockchain registration, 
                    farmer authentication, timestamp validation, and data integrity to ensure you're getting authentic honey.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}