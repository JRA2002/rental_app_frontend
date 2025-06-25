"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { fetchWithAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, MapPin, Bed, Bath, Square } from "lucide-react"

interface Property {
  id: number
  title: string
  description: string
  price: number
  location: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  is_available?: boolean
  // Agrega otros campos según tu API
}

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetchWithAuth(`http://127.0.0.1:8000/api/properties/${params.id}/`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Propiedad no encontrada")
          }
          throw new Error("No se pudo cargar la propiedad")
        }

        const data = await response.json()
        setProperty(data)
      } catch (err: any) {
        setError(err.message || "Error al cargar la propiedad")
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.push("/properties")}>Volver a propiedades</Button>
      </div>
    )
  }

  if (!property) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push("/properties")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a propiedades
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="aspect-video w-full bg-gray-200 relative mb-6">
            {/* Placeholder para imagen, reemplazar con la imagen real si está disponible */}
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">Imagen de propiedad</div>
          </div>

          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{property.title}</h1>
              {property.is_available !== undefined && (
                <Badge variant={property.is_available ? "default" : "secondary"} className="ml-2">
                  {property.is_available ? "Disponible" : "No disponible"}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-gray-500 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {property.bedrooms !== undefined && (
              <div className="flex items-center">
                <Bed className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="font-medium">{property.bedrooms}</p>
                  <p className="text-sm text-gray-500">Habitaciones</p>
                </div>
              </div>
            )}
            {property.bathrooms !== undefined && (
              <div className="flex items-center">
                <Bath className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="font-medium">{property.bathrooms}</p>
                  <p className="text-sm text-gray-500">Baños</p>
                </div>
              </div>
            )}
            {property.area !== undefined && (
              <div className="flex items-center">
                <Square className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="font-medium">{property.area} m²</p>
                  <p className="text-sm text-gray-500">Área</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Descripción</h2>
            <p className="whitespace-pre-line">{property.description}</p>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold mb-4">${property.price.toLocaleString()}</div>

              <div className="space-y-4">
                <Button className="w-full">Contactar al vendedor</Button>
                <Button variant="outline" className="w-full">
                  Agendar visita
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Información de contacto</h3>
                <p className="text-sm">Para más información sobre esta propiedad, contáctanos al:</p>
                <p className="text-sm font-medium mt-1">+1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
