import { Link } from "react-router-dom"
import heroImage from "../../assets/hero-image.webp"

const Hero = () => {
    return (
        <section className="mx-auto flex max-w-7xl flex-col-reverse items-center gap-8 px-4 py-12 md:flex-row md:py-16">
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold leading-tight text-neutral md:text-4xl">
                    The Scholarly Commerce Platform for Students &amp; Educators
                </h1>
                <p className="mt-4 text-secondary">
                    Access textbooks, academic electronics, and curated stationery to elevate your academic journey. Built for efficiency and reliability.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                    <Link
                        to="/products"
                        className="rounded-lg bg-primary px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-primary-dark"
                    >
                        Browse Products
                    </Link>
                </div>
            </div>

            <div className="flex-1">
                <img
                    src={heroImage}
                    alt="Student workspace with laptop and books"
                    className="w-full rounded-xl object-cover"
                />
            </div>
        </section>
    )
}

export default Hero