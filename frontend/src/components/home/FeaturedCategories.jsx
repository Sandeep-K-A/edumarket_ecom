import { BookOpen, PenTool } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../../components/category/CategoryCard";
import Section from "./Section";

const FeaturedCategories = () => {
    const navigate = useNavigate();

    const categories = [
        {
            icon: BookOpen,
            title: "Textbooks",
            description: "New and used course materials.",
            category: "Textbooks",
        },
        {
            icon: PenTool,
            title: "Stationery",
            description: "Premium notebooks and writing tools.",
            category: "Stationery",
        },
    ];

    return (
        <Section title="Featured Categories">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {categories.map((cat) => (
                    <CategoryCard
                        key={cat.category}
                        icon={cat.icon}
                        title={cat.title}
                        description={cat.description}
                        onClick={() =>
                            navigate(
                                `/products?category=${encodeURIComponent(
                                    cat.category
                                )}`
                            )
                        }
                    />
                ))}
            </div>
        </Section>
    );
};

export default FeaturedCategories;