const CategoryCard = ({ icon: Icon, title, description, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-primary hover:shadow-sm"
        >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={20} />
            </div>
            <div>
                <h3 className="text-sm font-semibold text-neutral">{title}</h3>
                <p className="text-xs text-secondary">{description}</p>
            </div>
        </button>
    )
}

export default CategoryCard