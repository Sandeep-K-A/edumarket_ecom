import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store/authStore"

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isLoading = useAuthStore((state) => state.isLoading)
    const location = useLocation()

    if (isLoading) return <div>Loading...</div>
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Outlet />
}

export default ProtectedRoute