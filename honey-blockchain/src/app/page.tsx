
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { CheckCircle, Scan, Upload, Shield, Sparkles, Globe, Users, Zap, User } from 'lucide-react'
import { HoneyProducts } from '@/components/honey-products'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative text-white py-32 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 170, 0, 0.7), rgba(255, 170, 0, 0.7)), url('/images/honeycomb.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="h-8 w-8 text-amber-200 mr-3" />
            <Badge className="bg-white/20 text-white border-white/30">
              Blockchain Powered
            </Badge>
            <Sparkles className="h-8 w-8 text-amber-200 ml-3" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent drop-shadow-lg">
            Verify Authentic Honey
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-white leading-relaxed drop-shadow-lg">
            Experience complete transparency in honey production through blockchain technology. 
            From hive to home, every drop verified with immutable records.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/farmer-login">
              <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <User className="mr-3 h-6 w-6" />
                Farmer Login
              </Button>
            </Link>
            <Link href="/verify">
              <Button size="lg" variant="outline" className="bg-amber-700/90 border-white text-white hover:bg-white hover:text-amber-700 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-solid">
                <Scan className="mr-3 h-6 w-6" />
                Verify Honey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
              <span className="mx-4 text-amber-600 font-semibold">OUR MISSION</span>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Revolutionizing Honey Trust
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              To restore trust in the honey industry by providing transparent, 
              immutable records of honey's journey from hive to home through cutting-edge blockchain technology.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Authenticity Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Every honey batch is recorded on the blockchain, 
                  ensuring immutable proof of authenticity and origin that cannot be tampered with.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Complete Transparency</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Track your honey from the exact hive location, harvest date, 
                  flower type, to the beekeeper's details with full traceability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scan className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl">Easy Verification</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  Simply scan the QR code on your honey jar to instantly 
                  access all verified information about your honey's journey.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-amber-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
              <span className="mx-4 text-amber-600 font-semibold">HOW IT WORKS</span>
              <div className="w-16 h-1 bg-amber-500 rounded-full"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Simple 4-Step Process
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From hive to home, ensuring complete transparency and authenticity
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  1
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Farmer Authentication</h3>
              <p className="text-gray-600 leading-relaxed">
                Beekeepers login to the system and authenticate their identity 
                before recording honey batch details.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  2
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Honey Details Entry</h3>
              <p className="text-gray-600 leading-relaxed">
                Authenticated farmers enter honey batch details including harvest date, 
                location, flower type, and beekeeper information.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  3
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Blockchain Storage</h3>
              <p className="text-gray-600 leading-relaxed">
                Information is permanently recorded on the Ethereum blockchain, 
                creating an immutable and tamper-proof record.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  4
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Consumer Verification</h3>
              <p className="text-gray-600 leading-relaxed">
                Consumers scan QR codes or enter batch IDs to instantly verify 
                the honey's authenticity and complete origin story.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Honey Products Section */}
      <HoneyProducts />

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                10,000+
              </div>
              <div className="text-amber-100">Honey Batches Recorded</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                500+
              </div>
              <div className="text-amber-100">Beekeepers Registered</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                50+
              </div>
              <div className="text-amber-100">Countries Supported</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                99.9%
              </div>
              <div className="text-amber-100">Verification Accuracy</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
