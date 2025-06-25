"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getToken, removeToken, fetchWithAuth } from "@/lib/auth"
import { UserProfile } from "@/components/user-profile"
import { PropertyStats } from "@/components/property-stats"
import { RegionStats } from "@/components/region-stats"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()

    if (!token) {
      router.push("/login")
      return
    }

    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    try {
      // Llamar al endpoint de logout
      await fetchWithAuth("https://finalrental.pythonanywhere.com/api/auth/logout/", {
        method: "POST",
      })

      // Eliminar tokens localmente
      removeToken()
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      // Si falla la petición, eliminamos los tokens de todas formas
      removeToken()
      router.push("/login")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleLogout}>Cerrar sesión</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-1">
          <UserProfile />
        </div>
        <div className="md:col-span-2">
          <PropertyStats />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="md:col-span-1">
          <RegionStats />
        </div>
        <div className="md:col-span-1 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Acciones rápidas</CardTitle>
              <CardDescription>Accede rápidamente a las funciones principales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/properties">
                  <Button variant="outline" className="w-full justify-start">
                    Ver todas las propiedades
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start">
                    Editar perfil
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start">
                  Mis favoritos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Mis mensajes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
