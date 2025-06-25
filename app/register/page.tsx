"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { RegisterForm } from "@/components/register-form"
import { getToken } from "@/lib/auth"

export default function RegisterPage() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = getToken()

    if (token) {
      // Si hay un token, redirigir al dashboard
      router.push("/dashboard")
    } else {
      // Si no hay token, mostrar el formulario de registro
      setChecking(false)
    }
  }, [router])

  // Mientras verifica la autenticación, mostrar un estado de carga o nada
  if (checking) {
    return null // O puedes mostrar un indicador de carga si prefieres
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Crear una cuenta</h2>
          <p className="mt-2 text-sm text-gray-600">Regístrate para acceder a la plataforma</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
