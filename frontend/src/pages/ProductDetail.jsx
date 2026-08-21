import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

import QuantitySelector from "../components/product/QuantitySelector";
import ProductSpecs from "../components/product/ProductSpecs";
import ProductGrid from "../components/product/ProductGrid";
import { useCartStore } from "../store/cartStore";
import {
    getProductById,
    getProductRecommendations,
} from "../services/productService";

const ProductDetail = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addItem = useCartStore((state) => state.addItem);

    const [recommendations, setRecommendations] = useState([]);
    const [recommendationsLoading, setRecommendationsLoading] =
        useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);

            try {
                const productData = await getProductById(id);
                setProduct(productData);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load product."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    useEffect(() => {
        if (!id) return;

        const fetchRecommendations = async () => {
            try {
                setRecommendationsLoading(true);

                const data = await getProductRecommendations(id);

                setRecommendations(data);
            } catch (error) {
                console.error(
                    "Failed to fetch recommendations:",
                    error
                );

                setRecommendations([]);
            } finally {
                setRecommendationsLoading(false);
            }
        };

        fetchRecommendations();
    }, [id]);

    const handleAddToCart = () => {
        if (!product || product.stock === 0) return;

        addItem(
            {
                id: product._id,
                image: product.images?.[0],
                title: product.name,
                price: product.price,
            },
            quantity
        );

        toast.success(
            `${product.name} added to cart`
        );
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12">
                <p className="text-center text-sm text-secondary">
                    Loading product...
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12">
                <p className="text-center text-sm text-red-600">
                    {error || "Product not found."}
                </p>
            </div>
        );
    }

    const image = product.images?.[0];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

                {/* Product image */}
                <div className="aspect-square overflow-hidden rounded-lg bg-tertiary">
                    {image ? (
                        <img
                            src={image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-secondary">
                            No image available
                        </div>
                    )}
                </div>

                {/* Product information */}
                <div>
                    <p className="text-sm font-medium text-secondary">
                        {product.category}
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-neutral">
                        {product.name}
                    </h1>

                    <p className="mt-4 text-2xl font-semibold text-primary">
                        ${product.price.toFixed(2)}
                    </p>

                    <p className="mt-4 text-sm leading-6 text-secondary">
                        {product.description}
                    </p>

                    {/* Category-specific specifications */}
                    <ProductSpecs product={product} />

                    {/* Stock */}
                    <div className="mt-4 text-sm">
                        {product.stock > 0 ? (
                            <span className="text-green-600">
                                {product.stock} in stock
                            </span>
                        ) : (
                            <span className="text-red-600">
                                Out of stock
                            </span>
                        )}
                    </div>

                    {/* Quantity + cart */}
                    <div className="mt-6 flex items-center gap-4">
                        <QuantitySelector
                            value={quantity}
                            onChange={setQuantity}
                        />

                        <button
                            disabled={product.stock === 0}
                            onClick={handleAddToCart}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingCart size={18} />

                            {product.stock === 0
                                ? "Out of Stock"
                                : "Add to Cart"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Recommended products */}
            {!recommendationsLoading &&
                recommendations.length > 0 && (
                    <section className="mt-12">
                        <h2 className="text-xl font-semibold text-neutral">
                            You may also like
                        </h2>

                        <div className="mt-5">
                            <ProductGrid
                                products={recommendations}
                            />
                        </div>
                    </section>
                )}
        </div>
    );
};

export default ProductDetail;