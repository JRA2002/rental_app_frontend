"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { fetchWithAuth } from "@/lib/auth"
import { Skeleton } from "@/components/ui/skeleton"

interface UserData {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  // Agrega otros campos según tu API
}

export function UserProfile() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth("https://finalrental.pythonanywhere.com/api/auth/user/")

        if (!response.ok) {
          throw new Error("No se pudo obtener la información del usuario")
        }

        const data = await response.json()
        setUserData(data)
      } catch (err: any) {
        setError(err.message || "Error al cargar datos del usuario")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil de Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        {userData && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarFallback>{userData.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{userData.username}</p>
                <p className="text-sm text-gray-500">{userData.email}</p>
              </div>
            </div>

            {/* Puedes agregar más campos según la estructura de tu API */}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
