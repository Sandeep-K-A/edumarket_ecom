import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom"
import { Search, ShoppingCart, User, LogOut, Menu, X } from "lucide-react"
import { useAuthStore } from "../../store/authStore"
import { useCartStore } from "../../store/cartStore"
import { logoutUser } from "../../services/authService"
import ConfirmDialog from "../ui/ConfirmDialog"

const Header = () => {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const clearAuth = useAuthStore((state) => state.logout)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get("search") || "")

    const totalItems = useCartStore((state) => state.totalItems())

    useEffect(() => {
        setSearchValue(searchParams.get("search") || "")
    }, [searchParams])

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchValue.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`)
        } else {
            navigate("/products")
        }
        setMenuOpen(false)
    }

    const handleLogout = async () => {
        setShowLogoutConfirm(false)
        try {
            await logoutUser()
        } catch (error) {
            console.error("Logout failed:", error)
        } finally {
            clearAuth()
            setMenuOpen(false)
        }
    }

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                <Link to="/" className="text-xl font-bold text-primary">
                    EduMarket
                </Link>

                <nav className="hidden items-center gap-6 text-sm font-medium text-neutral md:flex">
                    <NavLink to="/" end className={({ isActive }) => isActive ? "text-primary" : "hover:text-primary"}>
                        Home
                    </NavLink>
                    <NavLink to="/products" className={({ isActive }) => isActive ? "text-primary" : "hover:text-primary"}>
                        Products
                    </NavLink>
                </nav>

                <form
                    onSubmit={handleSearch}
                    className="hidden flex-1 max-w-xs items-center rounded-lg border border-slate-200 px-3 py-1.5 md:flex"
                >
                    <Search size={16} className="text-secondary" />
                    <input
                        type="text"
                        placeholder="Search resources..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-secondary"
                    />
                </form>

                <div className="flex items-center gap-4">
                    <Link to="/cart" className="relative text-neutral hover:text-primary">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-white">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/orders" className="flex items-center gap-2 text-sm font-medium text-neutral hover:text-primary">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                </Link>
                                <button onClick={() => setShowLogoutConfirm(true)} title="Logout" className="text-neutral hover:text-primary">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium text-neutral hover:text-primary">Login</Link>
                                <Link to="/register" className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        onClick={() => setMenuOpen((prev) => !prev)}
                        className="text-neutral md:hidden"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <div className="border-t border-slate-200 px-4 py-4 md:hidden">
                    <form onSubmit={handleSearch} className="mb-4 flex items-center rounded-lg border border-slate-200 px-3 py-1.5">
                        <Search size={16} className="text-secondary" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="ml-2 w-full bg-transparent text-sm outline-none placeholder:text-secondary"
                        />
                    </form>

                    <nav className="flex flex-col gap-3 text-sm font-medium text-neutral">
                        <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary" : ""}>
                            Home
                        </NavLink>
                        <NavLink to="/products" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? "text-primary" : ""}>
                            Products
                        </NavLink>
                    </nav>

                    <div className="mt-4 border-t border-slate-200 pt-4">
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <Link to="/orders" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-sm font-medium text-neutral">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{user?.name}</span>
                                </Link>
                                <button onClick={() => setShowLogoutConfirm(confirm)} className="text-sm text-red-500">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 rounded-lg border border-slate-200 py-2 text-center text-sm font-medium text-neutral">
                                    Login
                                </Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 rounded-lg bg-primary py-2 text-center text-sm font-medium text-white">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <ConfirmDialog
                open={showLogoutConfirm}
                title="Log out?"
                message="You'll need to log in again to access your cart and orders."
                confirmLabel="Log out"
                onConfirm={handleLogout}
                onCancel={() => setShowLogoutConfirm(false)}
            />
        </header>
    )
}

export default Header