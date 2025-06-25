"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface PropertyStats {
  total_properties: number
  available_properties: number
  average_price: number
  min_price: number
  max_price: number
  // Agrega otros campos según tu API
}

export function PropertyStats() {
  const [stats, setStats] = useState<PropertyStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetchWithAuth("https://finalrental.pythonanywhere.com/api/properties/stats")

        if (!response.ok) {
          throw new Error("No se pudieron cargar las estadísticas")
        }

        const data = await response.json()
        setStats(data)
      } catch (err: any) {
        setError(err.message || "Error al cargar estadísticas")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Propiedades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Propiedades</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Propiedades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total de propiedades</p>
            <p className="text-2xl font-bold">{stats.total_properties}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Propiedades disponibles</p>
            <p className="text-2xl font-bold">{stats.total_rooms}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Precio promedio</p>
            <p className="text-2xl font-bold">${stats.occupied_rooms.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rango de precios</p>
            <p className="text-sm">
              ${stats.occupancy_rate.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
