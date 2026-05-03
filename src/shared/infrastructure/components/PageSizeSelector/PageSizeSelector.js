import React from "react";

export const PageSizeSelector = (props) => {
  const onChange = (event) => {
    props.changePagination({
      ...props.paginationInfo,
      pageSize: parseInt(event.target.value),
    });
  };

  return (
    <div className="page-size-selector">
      <span className="mr-2">Items per page:</span>
      <div className="select is-small">
        <select
          onChange={(e) => onChange(e)}
          value={props.paginationInfo.pageSize}
          data-testid='pagesize-select'
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
};
