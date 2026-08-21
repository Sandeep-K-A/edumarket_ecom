import { Sparkles } from "lucide-react"
import ProductCard from "../../components/product/ProductCard"
import Section from "./Section"

const Recommendations = () => {
    // TODO: replace with real fetch once the recommendation API exists
    const isLoading = true
    const recommendations = []

    return (
        <Section title="Recommended for You">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-12 text-center">
                    <Sparkles size={24} className="mb-3 text-primary" />
                    <p className="text-sm font-medium text-neutral">
                        Personalized recommendations are currently loading.
                    </p>
                    <p className="mt-1 text-xs text-secondary">
                        Our algorithm is analyzing your coursework to suggest the best materials.
                    </p>
                </div>
            ) : recommendations.length === 0 ? (
                <p className="text-sm text-secondary">No recommendations yet — browse a few products to get started.</p>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {recommendations.map((product) => (
                        <ProductCard key={product.id} {...product} onAddToCart={() => console.log("added:", product.id)} />
                    ))}
                </div>
            )}
        </Section>
    )
}

export default Recommendations