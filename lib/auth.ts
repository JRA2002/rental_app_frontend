// Funciones para manejar la autenticación con JWT

// Guardar tokens en localStorage
export const setToken = (accessToken: string, refreshToken?: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", accessToken)
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken)
    }
  }
}

// Obtener el token de acceso
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken")
  }
  return null
}

// Obtener el token de refresco
export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken")
  }
  return null
}

// Eliminar tokens (logout)
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
  }
}

// Función para hacer peticiones autenticadas
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken()

  if (!token) {
    throw new Error("No hay token de autenticación")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Si recibimos un 401 (Unauthorized), podríamos intentar refrescar el token
  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken()

      // Reintentar la petición con el nuevo token
      const newHeaders = {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
        "Content-Type": "application/json",
      }

      return fetch(url, {
        ...options,
        headers: newHeaders,
      })
    } catch (error) {
      // Si no podemos refrescar el token, redirigimos al login
      removeToken()
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("Sesión expirada")
    }
  }

  return response
}

// Función para refrescar el token
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken()

  if (!refreshToken) {
    throw new Error("No hay token de refresco")
  }

  try {
    const response = await fetch("https://finalrental.pythonanywhere.com/api/auth/login/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || "Error al refrescar el token")
    }

    if (data.access) {
      setToken(data.access)
      return data.access
    }

    throw new Error("No se recibió un token válido")
  } catch (error) {
    // Si hay un error al refrescar, limpiamos los tokens
    removeToken()
    throw error
  }
}

  