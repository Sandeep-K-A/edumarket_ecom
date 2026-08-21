import { Link } from "react-router-dom"
import { Trash2, ShoppingCart } from "lucide-react"
import { useCartStore } from "../store/cartStore"
import QuantitySelector from "../components/product/QuantitySelector"

const Cart = () => {
    const items = useCartStore((state) => state.items)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const clearCart = useCartStore((state) => state.clearCart)
    const totalPrice = useCartStore((state) => state.totalPrice())

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <p className="text-lg font-medium text-neutral">Your cart is empty.</p>
                <Link
                    to="/products"
                    className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                >
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="text-2xl font-bold text-neutral">Your Cart</h1>

            <div className="mt-6 flex flex-col gap-8 lg:flex-row">
                <div className="flex-1 space-y-4">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="h-20 w-20 shrink-0 rounded-md object-cover"
                            />

                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-neutral">{item.title}</h3>
                                <p className="mt-1 text-sm font-semibold text-primary">${item.price.toFixed(2)}</p>
                            </div>

                            <QuantitySelector
                                value={item.quantity}
                                onChange={(qty) => updateQuantity(item.id, qty)}
                            />

                            <p className="w-20 text-right text-sm font-semibold text-neutral">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-secondary hover:text-red-600"
                                aria-label="Remove item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={clearCart}
                        className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-red-600"
                    >
                        <ShoppingCart size={16} />
                        Clear Cart
                    </button>
                </div>

                <div className="lg:w-80 lg:shrink-0">
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <h2 className="text-sm font-semibold text-neutral">Order Summary</h2>
                        <div className="mt-4 flex justify-between text-sm">
                            <span className="text-secondary">Subtotal</span>
                            <span className="font-medium text-neutral">${totalPrice.toFixed(2)}</span>
                        </div>
                        <p className="mt-1 text-xs text-secondary">Shipping calculated at checkout.</p>

                        <Link
                            to="/checkout"
                            className="mt-4 block rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cart