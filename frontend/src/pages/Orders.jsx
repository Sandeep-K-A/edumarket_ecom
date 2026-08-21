import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"
import { useAuthStore } from "../store/authStore"
import OrderCard from "../components/orders/OrderCard"
import { getMyOrders } from "../services/orderService"
import { logoutUser } from "../services/authService"
import { useNavigate } from "react-router-dom"
import ConfirmDialog from "../components/ui/ConfirmDialog"

const Orders = () => {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
    const clearAuth = useAuthStore((state) => state.logout)
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const response = await getMyOrders()

                setOrders(response.data)
            } catch (error) {
                console.error("Failed to fetch orders:", error)

                setError(
                    error.response?.data?.message ||
                    "Failed to load your orders.",
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrders()
    }, [])
    const handleLogout = async () => {
        setShowLogoutConfirm(false)
        try {
            await logoutUser()
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            clearAuth()
        }
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8">
            {/* User Information */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold text-neutral">
                            {user?.name}
                        </h1>

                        <p className="text-sm text-secondary">
                            {user?.email}
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-neutral hover:border-red-300 hover:text-red-600"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

            {/* Order History */}
            <div className="mt-8">
                <h2 className="mb-4 text-lg font-semibold text-neutral">
                    Order History
                </h2>

                {/* Loading */}
                {isLoading && (
                    <div className="rounded-lg border border-slate-200 bg-white py-12 text-center">
                        <p className="text-sm text-secondary">
                            Loading your orders...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!isLoading && error && (
                    <div className="rounded-lg border border-red-200 bg-white py-12 text-center">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                {/* Empty */}
                {!isLoading && !error && orders.length === 0 && (
                    <p className="rounded-lg border border-dashed border-slate-200 bg-white py-12 text-center text-sm text-secondary">
                        You haven't placed any orders yet.
                    </p>
                )}

                {/* Orders */}
                {!isLoading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderCard
                                key={order._id}
                                order={order}
                            />
                        ))}
                    </div>
                )}
            </div>
            <ConfirmDialog
                open={showLogoutConfirm}
                title="Log out?"
                message="You'll need to log in again to access your cart and orders."
                confirmLabel="Log out"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </div>

    )
}

export default Orders