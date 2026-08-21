import { useSearchParams } from "react-router-dom";
import ProductFilters from "../components/product/ProductFilters";
import ProductSort from "../components/product/ProductSort";
import ProductGrid from "../components/product/ProductGrid";
import Pagination from "../components/product/Pagination";
import useProducts from "../hooks/useProducts";

const PAGE_SIZE = 6;

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const keyword = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sort = searchParams.get("sort") || "relevance";
    const currentPage = Number(searchParams.get("page")) || 1;

    // Convert frontend sort values into backend sort parameters
    const getSortParams = () => {
        switch (sort) {
            case "price_asc":
                return {
                    sortBy: "price",
                    order: "asc",
                };

            case "price_desc":
                return {
                    sortBy: "price",
                    order: "desc",
                };

            case "newest":
                return {
                    sortBy: "createdAt",
                    order: "desc",
                };

            case "relevance":
            default:
                return {};
        }
    };

    const sortParams = getSortParams();

    const {
        products,
        pagination,
        loading,
        error,
    } = useProducts({
        ...(keyword && { search: keyword }),
        ...(category && { category }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        page: currentPage,
        limit: PAGE_SIZE,
        ...sortParams,
    });

    const totalPages = pagination?.pages || 1;
    const totalProducts = pagination?.total || 0;

    const handleApplyFilters = ({
        keyword,
        category,
        minPrice,
        maxPrice,
    }) => {
        const params = new URLSearchParams();

        if (keyword.trim()) {
            params.set("search", keyword.trim());
        }

        if (category) {
            params.set("category", category);
        }

        if (minPrice) {
            params.set("minPrice", minPrice);
        }

        if (maxPrice) {
            params.set("maxPrice", maxPrice);
        }

        if (sort !== "relevance") {
            params.set("sort", sort);
        }

        // Always start from page 1 after changing filters
        params.set("page", "1");

        setSearchParams(params);
    };

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams);

        if (newSort === "relevance") {
            params.delete("sort");
        } else {
            params.set("sort", newSort);
        }

        params.set("page", "1");

        setSearchParams(params);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);

        params.set("page", String(page));

        setSearchParams(params);
    };

    const handleClearFilters = () => {
        setSearchParams({});
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="text-2xl font-bold text-neutral">
                Academic Resources
            </h1>

            <p className="mt-1 text-sm text-secondary">
                Browse tools, texts, and technology curated for scholarly success.
            </p>

            <div className="mt-6 flex flex-col gap-6 md:flex-row">

                {/* Filters */}
                <aside className="md:w-64 md:shrink-0">
                    <ProductFilters
                        onApply={handleApplyFilters}
                        onClear={handleClearFilters}
                        initialValues={{
                            keyword,
                            category,
                            minPrice,
                            maxPrice,
                        }}
                    />
                </aside>

                {/* Products */}
                <div className="flex-1">

                    {/* Results + Sort */}
                    <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm text-secondary">
                            {loading
                                ? "Loading products..."
                                : `Showing ${totalProducts === 0
                                    ? 0
                                    : (currentPage - 1) * PAGE_SIZE + 1
                                }-${Math.min(
                                    currentPage * PAGE_SIZE,
                                    totalProducts
                                )
                                } of ${totalProducts} results`}
                        </p>

                        <ProductSort
                            value={sort}
                            onChange={handleSortChange}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="py-12 text-center text-sm text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Loading */}
                    {loading && !error && (
                        <p className="py-12 text-center text-sm text-secondary">
                            Loading products...
                        </p>
                    )}

                    {/* Products */}
                    {!loading && !error && (
                        <ProductGrid products={products} />
                    )}

                    {/* Pagination */}
                    {!loading && !error && totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Products;