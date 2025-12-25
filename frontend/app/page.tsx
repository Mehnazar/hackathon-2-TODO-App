'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (auth.isAuthenticated()) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl w-full mx-4">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl font-bold text-gray-900">
              Evolution of Todo
            </h1>
            <p className="text-xl text-gray-600">
              AI-Native Task Management System
            </p>
            <p className="text-lg text-gray-500">
              Phase II - Full-Stack Web Application
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors border-2 border-gray-200 w-full sm:w-auto"
            >
              Sign In
            </Link>
          </div>

          <div className="pt-8 border-t border-gray-200 mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Secure Authentication
                </h3>
                <p className="text-gray-600">
                  JWT-based authentication with Better Auth
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  Task Management
                </h3>
                <p className="text-gray-600">
                  Create, update, and track your tasks
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  User Isolation
                </h3>
                <p className="text-gray-600">
                  Your tasks are private and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
