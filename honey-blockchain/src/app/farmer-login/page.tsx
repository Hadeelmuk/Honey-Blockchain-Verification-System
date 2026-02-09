'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, User, Lock, AlertTriangle, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginData = z.infer<typeof loginSchema>

export default function FarmerLoginPage() {
  const router = useRouter()
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginData) => {
    setIsLoggingIn(true)
    setLoginError('')
    
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, accept any valid credentials
      if (data.username && data.password) {
        // Store farmer session
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('farmerLoggedIn', 'true')
          sessionStorage.setItem('farmerUsername', data.username)
        }
        
        router.push('/add')
      } else {
        setLoginError('Invalid credentials')
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          
          {/* Header Card */}
          <Card className="shadow-xl mb-8">
            <CardHeader className="text-center bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-t-lg">
              <div className="text-4xl mb-4">👨‍🌾</div>
              <CardTitle className="text-3xl">
                Farmer Login
              </CardTitle>
              <CardDescription className="text-amber-100 text-lg">
                Access your beekeeper dashboard to record honey batches
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Login Form */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-amber-700">
                Beekeeper Authentication
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the honey recording system
              </CardDescription>
            </CardHeader>
            <CardContent>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input 
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {loginError && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{loginError}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoggingIn}
                    className="w-full bg-amber-600 hover:bg-amber-700"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      <>
                        <User className="mr-2 h-4 w-4" />
                        Login as Farmer
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Demo Credentials: Use any username and password (min 6 chars)
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 