const SORT_OPTIONS = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "newest", label: "Newest" },
]

const ProductSort = ({ value, onChange }) => {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-secondary">Sort by:</span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="rounded-md border border-slate-200 px-2 py-1.5 text-neutral outline-none focus:border-primary"
            >
                {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    )
}

export default ProductSort