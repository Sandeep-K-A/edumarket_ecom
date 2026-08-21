import Hero from "../components/home/Hero"
import FeaturedCategories from "../components/home/FeaturedCategories"
import FeaturedProducts from "../components/home/FeaturedProducts"
import Recommendations from "../components/home/Recommendations"

const Home = () => {
    return (
        <div>
            <Hero />
            <FeaturedCategories />
            <FeaturedProducts />
            {/* <Recommendations /> */}
        </div>
    )
}

export default Home