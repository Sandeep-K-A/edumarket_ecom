import RegisterForm from "../components/auth/RegisterForm"
import { Link } from "react-router-dom"

const Register = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md space-y-4 rounded-xl border border-gray-200 p-8 shadow-sm">
                <h1 className="text-2xl font-semibold">Create an account</h1>
                <RegisterForm />
                <p className="text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="underline">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register