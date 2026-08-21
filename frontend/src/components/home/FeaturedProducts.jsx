import { Link } from "react-router-dom"
import ProductCard from "../../components/product/ProductCard"
import Section from "./Section"
import useProducts from "../../hooks/useProducts"

const FeaturedProducts = () => {

    const { products, loading, error } = useProducts({ limit: 4, sortBy: "createdAt", order: "desc" })

    return (
        <Section
            title="Featured Products"
            action={<Link to="/products" className="text-sm text-primary hover:underline">View All</Link>}
        >
            {loading && (
                <div className="py-12 text-center text-sm text-secondary">
                    Loading products...
                </div>
            )}

            {error && (
                <div className="py-12 text-center text-sm text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && products.length === 0 && (
                <div className="py-12 text-center text-sm text-secondary">
                    No products available.
                </div>
            )}

            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            {...product}
                        />
                    ))}
                </div>
            )}
        </Section>
    )
}

export default FeaturedProducts