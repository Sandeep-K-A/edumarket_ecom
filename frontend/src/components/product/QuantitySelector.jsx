import { Minus, Plus } from "lucide-react"

const QuantitySelector = ({ value, onChange, min = 1, max = 99 }) => {
    return (
        <div className="flex items-center rounded-lg border border-slate-200">
            <button
                onClick={() => onChange(Math.max(min, value - 1))}
                disabled={value <= min}
                className="p-2 text-neutral hover:bg-tertiary disabled:opacity-40"
                aria-label="Decrease quantity"
            >
                <Minus size={16} />
            </button>
            <span className="w-10 text-center text-sm font-medium text-neutral">{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + 1))}
                disabled={value >= max}
                className="p-2 text-neutral hover:bg-tertiary disabled:opacity-40"
                aria-label="Increase quantity"
            >
                <Plus size={16} />
            </button>
        </div>
    )
}

export default QuantitySelector