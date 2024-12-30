import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  if (totalPages === 0) return null;

  return (
    <div className="pagination">
      <button 
        onClick={handlePrevious} 
        disabled={currentPage === 1}
        className="pagination-button"
      >
        Previous
      </button>
      <div className="page-numbers">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`page-number ${number === currentPage ? 'active' : ''}`}
          >
            {number}
          </button>
        ))}
      </div>
      <button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
