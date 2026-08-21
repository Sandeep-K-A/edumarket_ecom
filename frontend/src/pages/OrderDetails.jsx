
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
    ArrowLeft,
    CheckCircle,
    Clock,
    MapPin,
    Package,
    Truck,
} from "lucide-react"
import { getOrderById } from "../services/orderService"

const STATUS_STYLES = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
}

const PAYMENT_STYLES = {
    unpaid: "bg-amber-100 text-amber-700",
    paid: "bg-green-100 text-green-700",
    refunded: "bg-red-100 text-red-700",
}

const OrderDetails = () => {
    const { id } = useParams()

    const [order, setOrder] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setIsLoading(true)
                setError("")

                const response = await getOrderById(id)

                setOrder(response.data.order)
            } catch (error) {
                console.error("Failed to fetch order:", error)

                setError(
                    error.response?.data?.message ||
                    "Failed to load order details.",
                )
            } finally {
                setIsLoading(false)
            }
        }

        fetchOrder()
    }, [id])

    if (isLoading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-16 text-center">
                <p className="text-sm text-secondary">
                    Loading order details...
                </p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-16 text-center">
                <p className="text-sm text-red-600">
                    {error}
                </p>

                <Link
                    to="/orders"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to orders
                </Link>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-16 text-center">
                <p className="text-sm text-secondary">
                    Order not found.
                </p>

                <Link
                    to="/orders"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <ArrowLeft size={16} />
                    Back to orders
                </Link>
            </div>
        )
    }

    const orderNumber = order._id.slice(-8).toUpperCase()

    const totalItems = order.items.reduce(
        (total, item) => total + item.quantity,
        0,
    )

    return (
        <div className="mx-auto max-w-5xl px-4 py-8">
            {/* Back */}
            <Link
                to="/orders"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary"
            >
                <ArrowLeft size={16} />
                Back to orders
            </Link>

            {/* Header */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs text-secondary">
                            Order
                        </p>

                        <h1 className="mt-1 text-xl font-bold text-neutral">
                            #{orderNumber}
                        </h1>

                        <p className="mt-1 text-sm text-secondary">
                            Placed on{" "}
                            {new Date(
                                order.createdAt,
                            ).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`rounded px - 3 py - 1 text - xs font - medium capitalize ${STATUS_STYLES[order.status] ||
                                "bg-slate-100 text-slate-700"
                                } `}
                        >
                            {order.status}
                        </span>

                        <span
                            className={`rounded px - 3 py - 1 text - xs font - medium capitalize ${PAYMENT_STYLES[order.paymentStatus] ||
                                "bg-slate-100 text-slate-700"
                                } `}
                        >
                            Payment: {order.paymentStatus}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left */}
                <div className="lg:col-span-2">
                    {/* Items */}
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral">
                                <Package
                                    size={18}
                                    className="text-primary"
                                />
                                Order Items
                            </h2>

                            <span className="text-xs text-secondary">
                                {totalItems}{" "}
                                {totalItems === 1 ? "item" : "items"}
                            </span>
                        </div>

                        <div className="mt-4 divide-y divide-slate-200">
                            {order.items.map((item, index) => (
                                <div
                                    key={`${item.product} -${index} `}
                                    className="flex items-center justify-between gap-4 py-4"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-neutral">
                                            {item.name}
                                        </p>

                                        <p className="mt-1 text-xs text-secondary">
                                            ${item.price.toFixed(2)} ×{" "}
                                            {item.quantity}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-sm font-semibold text-neutral">
                                        $
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="flex items-center gap-2 text-sm font-semibold text-neutral">
                            <MapPin
                                size={18}
                                className="text-primary"
                            />
                            Shipping Address
                        </h2>

                        <div className="mt-4 text-sm text-secondary">
                            <p className="font-medium text-neutral">
                                {order.shippingAddress.fullName}
                            </p>

                            <p className="mt-1">
                                {order.shippingAddress.phone}
                            </p>

                            <p className="mt-3">
                                {order.shippingAddress.line1}
                            </p>

                            {order.shippingAddress.line2 && (
                                <p>
                                    {order.shippingAddress.line2}
                                </p>
                            )}

                            <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}
                            </p>

                            <p>
                                {order.shippingAddress.postalCode},{" "}
                                {order.shippingAddress.country}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right */}
                <div>
                    {/* Order Summary */}
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="text-sm font-semibold text-neutral">
                            Order Summary
                        </h2>

                        <div className="mt-4 space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">
                                    Items
                                </span>

                                <span className="text-neutral">
                                    {totalItems}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-secondary">
                                    Payment
                                </span>

                                <span className="capitalize text-neutral">
                                    {order.paymentStatus}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-neutral">
                            <span>Total</span>

                            <span>
                                ${order.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="text-sm font-semibold text-neutral">
                            Order Status
                        </h2>

                        <div className="mt-4 flex items-start gap-3">
                            {order.status === "delivered" ? (
                                <CheckCircle
                                    size={20}
                                    className="mt-0.5 text-green-600"
                                />
                            ) : order.status === "shipped" ? (
                                <Truck
                                    size={20}
                                    className="mt-0.5 text-indigo-600"
                                />
                            ) : (
                                <Clock
                                    size={20}
                                    className="mt-0.5 text-amber-600"
                                />
                            )}

                            <div>
                                <p className="text-sm font-medium capitalize text-neutral">
                                    {order.status}
                                </p>

                                <p className="mt-1 text-xs leading-5 text-secondary">
                                    {order.status === "pending" &&
                                        "Your order has been received and is waiting to be processed."}

                                    {order.status === "processing" &&
                                        "Your order is currently being prepared."}

                                    {order.status === "shipped" &&
                                        "Your order has been shipped and is on the way."}

                                    {order.status === "delivered" &&
                                        "Your order has been delivered."}

                                    {order.status === "cancelled" &&
                                        "This order has been cancelled."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDetails
