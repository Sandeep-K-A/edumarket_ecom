import { ChevronLeft, ChevronRight } from "lucide-react"

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex items-center justify-center gap-2 pt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md p-1.5 text-neutral hover:bg-tertiary disabled:opacity-40"
                aria-label="Previous page"
            >
                <ChevronLeft size={18} />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`h-8 w-8 rounded-md text-sm font-medium ${page === currentPage
                            ? "bg-primary text-white"
                            : "text-neutral hover:bg-tertiary"
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-md p-1.5 text-neutral hover:bg-tertiary disabled:opacity-40"
                aria-label="Next page"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    )
}

export default Pagination