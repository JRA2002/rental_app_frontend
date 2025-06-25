"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/login-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { getToken } from "@/lib/auth"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = getToken()

    if (token) {
      // Si hay un token, redirigir al dashboard
      router.push("/dashboard")
    } else {
      // Si no hay token, mostrar el formulario de login
      setChecking(false)
    }
  }, [router])

  // Mientras verifica la autenticación, mostrar un estado de carga o nada
  if (checking) {
    return null // O puedes mostrar un indicador de carga si prefieres
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Logo de Final Rental"
            width={200}
            height={50}
            className="mx-auto mb-4"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Iniciar sesión</h2>
          <p className="mt-2 text-sm text-gray-600">
            Ingresa tus credenciales para acceder o{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              regístrate
            </Link>
          </p>
        </div>

        {registered && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              ¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.
            </AlertDescription>
          </Alert>
        )}

        <LoginForm />
      </div>
    </div>
  )
}

