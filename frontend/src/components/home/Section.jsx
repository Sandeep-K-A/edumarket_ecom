const Section = ({ title, action, children, noBorder = false }) => {
    return (
        <section className={`mx-auto max-w-7xl px-4 py-8 ${noBorder ? "" : "border-t border-slate-200"}`}>
            {title && (
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-neutral">{title}</h2>
                    {action}
                </div>
            )}
            {children}
        </section>
    )
}

export default Section