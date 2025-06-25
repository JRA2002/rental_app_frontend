"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface RegionStat {
  region: string
  count: number
  average_price: number
  // Agrega otros campos según tu API
}

export function RegionStats() {
  const [regionStats, setRegionStats] = useState<RegionStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRegionStats = async () => {
      try {
        const response = await fetchWithAuth("https://finalrental.pythonanywhere.com/api/properties/region-stats/")

        if (!response.ok) {
          throw new Error("No se pudieron cargar las estadísticas por región")
        }

        const data = await response.json()
        setRegionStats(data)
      } catch (err: any) {
        setError(err.message || "Error al cargar estadísticas por región")
      } finally {
        setLoading(false)
      }
    }

    fetchRegionStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas por Región</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
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
          <CardTitle>Estadísticas por Región</CardTitle>
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
        <CardTitle>Estadísticas por Región</CardTitle>
      </CardHeader>
      <CardContent>
        {regionStats.length === 0 ? (
          <p className="text-gray-500">No hay datos disponibles</p>
        ) : (
          <div className="space-y-4">
            {regionStats.map((region, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{region.region}</p>
                  <p className="text-sm text-gray-500">{region.count} propiedades</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${region.avg_price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">precio promedio</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
