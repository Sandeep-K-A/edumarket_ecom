import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { registerSchema } from "../../schemas/authSchema"
import { useAuthStore } from "../../store/authStore"
import FormInput from "../ui/FormInput"
import { registerUser } from "../../services/authService"

const RegisterForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { setUser, isLoading, error, setLoading, setError } = useAuthStore()
    const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) })
    const onSubmit = async (data) => {
        setLoading(true)
        setError(null)

        try {
            const { user } = await registerUser(data)
            setUser(user)
            const from = location.state?.from?.pathname || "/"
            navigate(from, { replace: true })
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed.Try again")
        } finally {
            setLoading(false)
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput label="Full name" name="name" placeholder="Full name" register={register} error={errors.name} />
            <FormInput label="Email" name="email" type="email" placeholder="Email" register={register} error={errors.email} />
            <FormInput label="Password" name="password" type="password" placeholder="Password" register={register} error={errors.password} />
            <FormInput label="Confirm password" name="confirmPassword" type="password" placeholder="Confirm password" register={register} error={errors.confirmPassword} />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-black py-2 text-white disabled:opacity-50"
            >
                {isLoading ? "Creating account..." : "Register"}
            </button>
        </form>
    )
}

export default RegisterForm