import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
    if (products.length === 0) {
        return (
            <p className="py-12 text-center text-sm text-secondary">
                No products match your filters.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    {...product}
                />
            ))}
        </div>
    );
};

export default ProductGrid;