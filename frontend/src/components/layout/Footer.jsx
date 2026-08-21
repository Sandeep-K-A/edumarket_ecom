import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-secondary md:flex-row">
                <span>EduMarket</span>
                <nav className="flex gap-6">
                    <Link to="/about" className="hover:text-primary">About Us</Link>
                    <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
                    <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
                    <Link to="/contact" className="hover:text-primary">Contact</Link>
                </nav>
                <span>© 2026 EduMarket. Designed for scholarly commerce.</span>
            </div>
        </footer>
    );
}

export default Footer