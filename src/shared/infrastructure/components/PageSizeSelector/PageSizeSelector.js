import React from "react";

export const PageSizeSelector = (props) => {
  const onChange = (event) => {
    props.changePagination({
      ...props.paginationInfo,
      pageSize: parseInt(event.target.value),
    });
  };

  return (
    <div className="ml-3 level-item">
      <span>Per page: </span>
      <select
        onChange={(e) => onChange(e)}
        value={props.paginationInfo.pageSize}
        data-testid='pagesize-select'
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
      </select>
    </div>
  );
};
