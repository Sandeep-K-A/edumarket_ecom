import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { toast } from "react-hot-toast"

const ProductCard = ({
    _id,
    name,
    images,
    category,
    description,
    price,
}) => {
    const addItem = useCartStore((state) => state.addItem);

    const image = images?.[0];

    const handleAddToCart = () => {
        addItem({
            id: _id,
            title: name,
            image,
            price,
        });
        toast.success(`${name} added to cart`);
    };

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 transition hover:shadow-md">
            {/* Product image + information */}
            <Link to={`/product/${_id}`} className="group block">
                <div className="relative mb-3 aspect-square overflow-hidden rounded-md bg-tertiary">
                    {image ? (
                        <img
                            src={image}
                            alt={name}
                            className="h-full w-full object-cover transition group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-secondary">
                            No image
                        </div>
                    )}
                </div>

                <p className="text-xs font-medium text-secondary">
                    {category}
                </p>

                <h3 className="mt-1 line-clamp-2 text-sm font-medium text-neutral">
                    {name}
                </h3>

                {description && (
                    <p className="mt-1 line-clamp-2 text-xs text-secondary">
                        {description}
                    </p>
                )}
            </Link>

            {/* Price */}
            <div className="mt-2">
                <span className="text-sm font-semibold text-neutral">
                    ${Number(price).toFixed(2)}
                </span>
            </div>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
                <Link
                    to={`/product/${_id}`}
                    className="flex-1 rounded-lg border border-slate-200 py-1.5 text-center text-sm font-medium text-neutral hover:border-primary hover:text-primary"
                >
                    Details
                </Link>

                <button
                    type="button"
                    onClick={handleAddToCart}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
                >
                    <ShoppingCart size={14} />
                    Add
                </button>
            </div>
        </div>
    );
};

export default ProductCard;