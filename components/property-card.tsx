import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PropertyCardProps {
  property: {
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
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video w-full bg-gray-200 relative">
        {/* Placeholder para imagen, reemplazar con la imagen real si está disponible */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">Imagen de propiedad</div>
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{property.region}</CardTitle>
          {property.is_available !== undefined && (
            <Badge variant={property.is_available ? "default" : "secondary"}>
              {property.is_available ? "Disponible" : "No disponible"}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-500">{property.region}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm line-clamp-2">{property.description}</p>

        <div className="mt-4 flex space-x-4 text-sm">
          {property.bedrooms !== undefined && (
            <div>
              <span className="font-medium">{property.bedrooms}</span> Hab.
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div>
              <span className="font-medium">{property.bathrooms}</span> Baños
            </div>
          )}
          {property.area !== undefined && (
            <div>
              <span className="font-medium">{property.area}</span> m²
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-lg font-bold">${property.price.toLocaleString()}</div>
        <Link href={`/properties/${property.id}`} className="text-sm font-medium text-blue-600 hover:underline">
          Ver detalles
        </Link>
      </CardFooter>
    </Card>
  )
}
