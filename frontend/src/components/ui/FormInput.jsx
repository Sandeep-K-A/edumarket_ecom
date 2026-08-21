const FormInput = ({ label, type = "text", register, error, name, ...rest }) => {
    return (
        <div>
            {label && <label className="mb-1 block text-sm font-medium  text-gray-700 ">{label}</label>}
            <input type={type}
                {...register(name)}
                className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                {...rest} />
            {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
        </div>
    )
}

export default FormInput 