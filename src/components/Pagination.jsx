export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pagination" aria-label="Paginazione">
      <button
        className="pagination-btn"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Pagina precedente"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          className={`pagination-btn ${n === page ? "active" : ""}`}
          onClick={() => onPageChange(n)}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </button>
      ))}

      <button
        className="pagination-btn"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Pagina successiva"
      >
        ›
      </button>
    </nav>
  );
}
