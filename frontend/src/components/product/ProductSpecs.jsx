const ProductSpecs = ({ product }) => {
    if (!product.details) {
        return null;
    }

    let specs = [];

    if (product.category === "Textbooks") {
        specs = [
            {
                label: "Author",
                value: product.details.author,
            },
            {
                label: "Publisher",
                value: product.details.publisher,
            },
            {
                label: "Format",
                value: product.details.format,
            },
            {
                label: "ISBN",
                value: product.details.isbn,
            },
        ];
    }

    if (product.category === "Stationery") {
        specs = [
            {
                label: "Brand",
                value: product.details.brand,
            },
            {
                label: "Color",
                value: product.details.color,
            },
            {
                label: "Material",
                value: product.details.material,
            },
            {
                label: "Type",
                value: product.details.type,
            },
        ];
    }

    const validSpecs = specs.filter(
        (spec) => spec.value !== undefined && spec.value !== null && spec.value !== ""
    );

    if (validSpecs.length === 0) {
        return null;
    }

    return (
        <div className="mt-6 rounded-lg border border-slate-200">
            <div className="border-b border-slate-200 px-4 py-3">
                <h2 className="text-sm font-semibold text-neutral">
                    Product Details
                </h2>
            </div>

            <dl>
                {validSpecs.map((spec) => (
                    <div
                        key={spec.label}
                        className="grid grid-cols-2 border-b border-slate-100 px-4 py-3 text-sm last:border-b-0"
                    >
                        <dt className="text-secondary">
                            {spec.label}
                        </dt>

                        <dd className="font-medium text-neutral">
                            {spec.value}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default ProductSpecs;