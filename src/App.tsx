
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { AuthCallback } from '@/pages/auth/AuthCallback'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { BuilderPage } from '@/pages/builder/BuilderPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* OAuth Callback — must be outside ProtectedRoute and AuthLayout */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/builder/:resumeId" element={<BuilderPage />} />
        </Route>

        {/* Root Public Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          classNames: {
            toast: 'bg-surface border-border text-text-primary',
            success: 'text-success border-success/20 bg-success/10',
            error: 'text-destructive border-destructive/20 bg-destructive/10',
          }
        }}
      />
    </BrowserRouter>
  )
}
