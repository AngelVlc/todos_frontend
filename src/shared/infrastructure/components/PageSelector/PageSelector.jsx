import React from "react";
import "./PageSelector.css";

export const PageSelector = (props) => {
  const pageNumberChanged = (event) => {
    props.changePagination({
      ...props.paginationInfo,
      pageNumber: parseInt(event.target.value),
    });
  };

  const previousPageClicked = () => {
    props.changePagination({
      ...props.paginationInfo,
      pageNumber: props.paginationInfo.pageNumber - 1,
    });
  };

  const nextPageClicked = () => {
    props.changePagination({
      ...props.paginationInfo,
      pageNumber: props.paginationInfo.pageNumber + 1,
    });
  };

  return (
    <div className="pagination-container">
      <nav className="pagination" role="navigation" aria-label="pagination">
        <button 
          className="pagination-previous" 
          onClick={() => previousPageClicked()}
          disabled={props.paginationInfo.pageNumber <= 1}
        >
          Previous
        </button>
        <button 
          className="pagination-next" 
          onClick={() => nextPageClicked()}
          disabled={props.paginationInfo.pageNumber >= props.paginationInfo.totalPages}
        >
          Next
        </button>
        <ul className="pagination-list">
          <li>
            <input
              type="number"
              min="1"
              max={props.paginationInfo.totalPages || 999}
              value={props.paginationInfo.pageNumber}
              className="input"
              onChange={(e) => pageNumberChanged(e)}
              data-testid='pagenumber-input'
              style={{width: '60px', textAlign: 'center'}}
            ></input>
          </li>
        </ul>
      </nav>
    </div>
  );
};
