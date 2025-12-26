'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { CheckSquare, Shield, Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (auth.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
      <div className="max-w-4xl w-full mx-4">
        <div className="text-center space-y-8">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 animate-pulse shadow-lg">
              <CheckSquare className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
              Evolution of Todo
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              AI-Native Task Management System
            </p>
            <p className="text-lg text-gray-500">
              Professional enterprise task management with secure authentication
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto min-w-[200px]"
              >
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[200px]"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Section */}
          <div className="pt-12 mt-12 border-t-2 border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Enterprise Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card variant="elevated" hover className="text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-lg">
                    <Shield className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900">
                    Secure Authentication
                  </h3>
                  <p className="text-gray-600">
                    JWT-based authentication with Better Auth framework for enterprise-grade security
                  </p>
                </div>
              </Card>

              <Card variant="elevated" hover className="text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-100 rounded-lg">
                    <CheckSquare className="w-6 h-6 text-teal-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900">
                    Task Management
                  </h3>
                  <p className="text-gray-600">
                    Create, update, search, and filter tasks with an intuitive professional interface
                  </p>
                </div>
              </Card>

              <Card variant="elevated" hover className="text-left">
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-cyan-100 rounded-lg">
                    <Lock className="w-6 h-6 text-cyan-600" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900">
                    User Isolation
                  </h3>
                  <p className="text-gray-600">
                    Complete data isolation ensures your tasks remain private and secure
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
