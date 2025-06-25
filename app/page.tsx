"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getToken } from "@/lib/auth"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Verificar si el usuario ya está autenticado
    const token = getToken()

    if (token) {
      // Si hay un token, redirigir al dashboard
      router.push("/dashboard")
    } else {
      // Si no hay token, redirigir al login
      router.push("/login")
    }
  }, [router])

  // No renderizamos nada aquí porque vamos a redirigir de todas formas
  return null
}

