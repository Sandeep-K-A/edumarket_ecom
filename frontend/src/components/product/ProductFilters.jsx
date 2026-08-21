import { useEffect, useState } from "react";
import { Search } from "lucide-react";

const CATEGORIES = [
    "Textbooks",
    "Stationery",
];

const ProductFilters = ({
    onApply,
    onClear,
    initialValues = {},
}) => {
    const [keyword, setKeyword] = useState(
        initialValues.keyword || ""
    );

    const [selectedCategory, setSelectedCategory] = useState(
        initialValues.category || ""
    );

    const [minPrice, setMinPrice] = useState(
        initialValues.minPrice || ""
    );

    const [maxPrice, setMaxPrice] = useState(
        initialValues.maxPrice || ""
    );

    // Keep filter inputs synchronized with URL parameters
    useEffect(() => {
        setKeyword(initialValues.keyword || "");
        setSelectedCategory(initialValues.category || "");
        setMinPrice(initialValues.minPrice || "");
        setMaxPrice(initialValues.maxPrice || "");
    }, [
        initialValues.keyword,
        initialValues.category,
        initialValues.minPrice,
        initialValues.maxPrice,
    ]);

    const hasActiveFilters =
        keyword ||
        selectedCategory ||
        minPrice ||
        maxPrice;

    const handleApply = () => {
        onApply({
            keyword,
            category: selectedCategory,
            minPrice,
            maxPrice,
        });
    };

    const handleClear = () => {
        setKeyword("");
        setSelectedCategory("");
        setMinPrice("");
        setMaxPrice("");

        onClear();
    };

    return (
        <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-4">

            {/* Search */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral">
                    Search Products
                </h3>

                <div className="flex items-center rounded-lg border border-slate-200 px-3 py-1.5">
                    <Search
                        size={16}
                        className="text-secondary"
                    />

                    <input
                        type="text"
                        placeholder="Keywords..."
                        value={keyword}
                        onChange={(e) =>
                            setKeyword(e.target.value)
                        }
                        className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-secondary"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral">
                    Category
                </h3>

                <div className="space-y-2">
                    {CATEGORIES.map((category) => (
                        <label
                            key={category}
                            className="flex items-center gap-2 text-sm text-neutral"
                        >
                            <input
                                type="radio"
                                name="category"
                                checked={
                                    selectedCategory === category
                                }
                                onChange={() =>
                                    setSelectedCategory(category)
                                }
                                className="border-slate-300 text-primary focus:ring-primary"
                            />

                            {category}
                        </label>
                    ))}

                    {/* All categories */}
                    <label className="flex items-center gap-2 text-sm text-neutral">
                        <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === ""}
                            onChange={() =>
                                setSelectedCategory("")
                            }
                            className="border-slate-300 text-primary focus:ring-primary"
                        />

                        All
                    </label>
                </div>
            </div>

            {/* Price */}
            <div>
                <h3 className="mb-2 text-sm font-semibold text-neutral">
                    Price Range
                </h3>

                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) =>
                            setMinPrice(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />

                    <span className="text-secondary">
                        -
                    </span>

                    <input
                        type="number"
                        min="0"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) =>
                            setMaxPrice(e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-primary"
                    />
                </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={handleApply}
                    className="w-full rounded-lg bg-primary/10 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-white"
                >
                    Apply Filters
                </button>

                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="w-full rounded-lg bg-red-400 py-2 text-sm font-semibold text-white hover:bg-red-400/50 hover:text-black"
                    >
                        Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductFilters;