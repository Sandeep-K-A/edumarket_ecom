import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { Truck, CreditCard, Lock, ShieldCheck } from "lucide-react"
import { checkoutSchema } from "../schemas/checkoutSchema"
import { useCartStore } from "../store/cartStore"
import { createOrder } from "../services/orderService"
import FormInput from "../components/ui/FormInput"
import toast from "react-hot-toast"

const Checkout = () => {
    const navigate = useNavigate()

    const items = useCartStore((state) => state.items)
    const totalPrice = useCartStore((state) => state.totalPrice())
    const clearCart = useCartStore((state) => state.clearCart)

    const [isPlacingOrder, setIsPlacingOrder] = useState(false)
    const [orderError, setOrderError] = useState(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(checkoutSchema),
    })

    const onSubmit = async (shippingAddress) => {
        const orderData = {
            items: items.map((item) => ({
                product: item.id,
                quantity: item.quantity,
            })),
            shippingAddress,
        }

        setIsPlacingOrder(true)
        setOrderError(null)

        try {
            const response = await createOrder(orderData)

            clearCart()

            toast.success("Order placed successfully!", {
                style: {
                    background: "#2563eb",
                    color: "#fff",
                },
                iconTheme: {
                    primary: "#fff",
                    secondary: "#2563eb",
                },
            });

            navigate("/orders", {
                state: {
                    order: response.data.order,
                },
            })
        } catch (error) {
            console.log("ORDER ERROR:", error.response?.data)

            setOrderError(
                error.response?.data?.message ||
                "Failed to place your order. Please try again."
            )
        } finally {
            setIsPlacingOrder(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <p className="text-lg font-medium text-neutral">
                    Your cart is empty.
                </p>
                <p className="mt-1 text-sm text-secondary">
                    Add products before checking out.
                </p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-neutral">
                        Checkout
                    </h1>

                    <p className="mt-1 text-sm text-secondary">
                        Please review your order and provide shipping details.
                    </p>
                </div>

                <span className="hidden items-center gap-1.5 text-sm text-secondary sm:flex">
                    <Lock size={14} />
                    Secure Checkout
                </span>
            </div>

            {orderError && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {orderError}
                </div>
            )}

            <div className="mt-6 flex flex-col gap-6 lg:flex-row">
                <form
                    id="checkout-form"
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 space-y-6"
                >
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral">
                            <Truck size={18} className="text-primary" />
                            Shipping Information
                        </h2>

                        <div className="space-y-4">
                            <FormInput
                                label="Full name"
                                name="fullName"
                                placeholder="Full name"
                                register={register}
                                error={errors.fullName}
                            />

                            <FormInput
                                label="Phone"
                                name="phone"
                                placeholder="Phone number"
                                register={register}
                                error={errors.phone}
                            />

                            <FormInput
                                label="Address line 1"
                                name="line1"
                                placeholder="Street address"
                                register={register}
                                error={errors.line1}
                            />

                            <FormInput
                                label="Address line 2 (optional)"
                                name="line2"
                                placeholder="Apartment, suite, etc."
                                register={register}
                                error={errors.line2}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="City"
                                    name="city"
                                    placeholder="City"
                                    register={register}
                                    error={errors.city}
                                />

                                <FormInput
                                    label="State"
                                    name="state"
                                    placeholder="State"
                                    register={register}
                                    error={errors.state}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Postal code"
                                    name="postalCode"
                                    placeholder="Postal code"
                                    register={register}
                                    error={errors.postalCode}
                                />

                                <FormInput
                                    label="Country"
                                    name="country"
                                    placeholder="Country"
                                    register={register}
                                    error={errors.country}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral">
                            <CreditCard size={18} className="text-primary" />
                            Payment Details
                        </h2>

                        <div className="rounded-lg bg-tertiary p-6 text-center text-sm text-secondary">
                            Payment gateway integration will be added later.
                        </div>
                    </div>
                </form>

                <div className="lg:w-96 lg:shrink-0">
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                        <h2 className="text-sm font-semibold text-neutral">
                            Order Summary
                        </h2>

                        <div className="mt-4 space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="h-12 w-12 rounded-md object-cover"
                                    />

                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-neutral">
                                            {item.title}
                                        </p>

                                        <p className="text-xs text-secondary">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>

                                    <p className="text-sm font-medium text-neutral">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary">
                                    Subtotal
                                </span>

                                <span className="text-neutral">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-neutral">
                            <span>Total</span>
                            <span>${totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            disabled={isPlacingOrder}
                            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
                        >
                            {isPlacingOrder ? (
                                "Placing order..."
                            ) : (
                                <>
                                    <Lock size={14} />
                                    Place Order
                                </>
                            )}
                        </button>

                        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-secondary">
                            <ShieldCheck size={12} />
                            Your order information is secure.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout