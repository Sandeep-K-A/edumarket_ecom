const ConfirmDialog = ({
    open,
    title = "Are you sure?",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    onConfirm,
    onCancel,
    variant = "default", // "default" | "danger"
}) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-neutral/40"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-neutral">{title}</h2>
                {message && <p className="mt-2 text-sm text-secondary">{message}</p>}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-neutral hover:bg-tertiary"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${variant === "danger"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-primary hover:bg-primary-dark"
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog