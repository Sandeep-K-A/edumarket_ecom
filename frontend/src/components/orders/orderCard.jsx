import { Link } from "react-router-dom"

const STATUS_STYLES = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-indigo-100 text-indigo-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
}

const OrderCard = ({ order }) => {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-neutral">
                        Order #{order._id.slice(-8).toUpperCase()}
                    </p>

                    <p className="text-xs text-secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <span
                    className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[order.status] ||
                        "bg-slate-100 text-slate-700"
                        }`}
                >
                    {order.status}
                </span>
            </div>

            <div className="mt-3 space-y-1 border-t border-slate-200 pt-3">
                {order.items.map((item, index) => (
                    <p
                        key={`${order._id}-${index}`}
                        className="text-sm text-secondary"
                    >
                        {item.name} × {item.quantity}
                    </p>
                ))}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                <div className="text-sm font-semibold text-neutral">
                    <span>Total</span>
                    <span className="ml-2">
                        ${order.totalAmount.toFixed(2)}
                    </span>
                </div>

                <Link
                    to={`/orders/${order._id}`}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-neutral transition hover:border-primary hover:text-primary"
                >
                    View Details
                </Link>
            </div>
        </div>
    )
}

export default OrderCard