"use client"

import { useEffect, useState } from "react"
import { fetchWithAuth } from "@/lib/auth"
import { PropertyCard } from "@/components/property-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface Property {
  id: number
  region: string
  description: string
  price: number
  location: string
  bedrooms?: number
  bathrooms?: number
  area?: number
  is_available?: boolean
  // Agrega otros campos según tu API
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price_asc")

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetchWithAuth("https://finalrental.pythonanywhere.com/api/properties/")

        if (!response.ok) {
          throw new Error("No se pudieron cargar las propiedades")
        }

        const data = await response.json()
        setProperties(data)
      } catch (err: any) {
        setError(err.message || "Error al cargar propiedades")
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])
  console.log(properties)
  // Filtrar propiedades por término de búsqueda
  const filteredProperties = (properties?.results || []).filter(
    (property: Property) =>
      property.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  

  // Ordenar propiedades
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price_asc":
        return a.price - b.price
      case "price_desc":
        return b.price - a.price
      case "newest":
        // Aquí deberías ordenar por fecha si tu API la proporciona
        return 0
      default:
        return 0
    }
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Propiedades disponibles</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Buscar por título, descripción o ubicación"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
              <SelectItem value="newest">Más recientes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      ) : sortedProperties.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No se encontraron propiedades que coincidan con tu búsqueda.</p>
          {searchTerm && (
            <Button variant="outline" onClick={() => setSearchTerm("")}>
              Limpiar búsqueda
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
