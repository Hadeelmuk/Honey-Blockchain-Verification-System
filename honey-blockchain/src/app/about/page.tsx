import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Globe, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="shadow-xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
              <div className="text-4xl mb-4">🍯</div>
              <CardTitle className="text-3xl">About Honey Blockchain</CardTitle>
              <CardDescription className="text-amber-100 text-lg">
                Revolutionizing honey traceability through blockchain technology
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Mission Statement */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700">
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed">
                Honey Blockchain is dedicated to restoring trust in the honey
                industry by providing transparent, immutable records of honey`s
                journey from hive to home. We believe that every consumer
                deserves to know the authentic origin and quality of their
                honey, and every beekeeper deserves recognition for their hard
                work and dedication.
              </p>
            </CardContent>
          </Card>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-amber-600" />
                  <CardTitle>Blockchain Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  All honey batch information is permanently recorded on the
                  Ethereum blockchain, ensuring data integrity and preventing
                  tampering or fraud.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-amber-600" />
                  <CardTitle>Community Driven</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built for beekeepers and consumers alike, fostering a
                  transparent ecosystem where quality and authenticity are
                  rewarded.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Globe className="h-8 w-8 text-amber-600" />
                  <CardTitle>Global Access</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Available worldwide, supporting honey producers from Yemen to
                  New Zealand, connecting local beekeepers with global
                  consumers.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-amber-600" />
                  <CardTitle>Instant Verification</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  QR code technology enables instant verification of honey
                  authenticity with just a scan of your smartphone.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Team */}
          <Card className="shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700">
                Our Team
              </CardTitle>
              <CardDescription>
                Dedicated to building a better future for honey producers and
                consumers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    H
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Hadil Mokhtar</h3>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    K
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Keerthika A/P Ramakrishnan
                  </h3>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    A
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ahmed Mohammed</h3>
                </div>
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    N
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Nastaran Esmaeil Zadeh
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700">
                Get in Touch
              </CardTitle>
              <CardDescription>
                Have questions or want to collaborate? We`d love to hear from
                you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>📧 Email: info@honeyblockchain.com</p>
                    <p>🌐 Website: www.honeyblockchain.com</p>
                    <p>📱 Phone: +1 (555) 123-4567</p>
                    <p>📍 Address: Sana`a, Yemen</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Follow Us</h4>
                  <div className="space-y-2 text-gray-600">
                    <p>🐦 Twitter: @HoneyBlockchain</p>
                    <p>📘 Facebook: Honey Blockchain</p>
                    <p>📷 Instagram: @honeyblockchain</p>
                    <p>💼 LinkedIn: Honey Blockchain</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
