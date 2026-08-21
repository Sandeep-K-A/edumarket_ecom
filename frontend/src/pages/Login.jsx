import { Link } from "react-router-dom"
import LoginForm from "../components/auth/LoginForm"
const Login = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 p-8 shadow-sm">
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <LoginForm />
                <p className="text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="underline">Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login
