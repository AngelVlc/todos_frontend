import React from "react";

export const TableColumnHeader = (props) => {
  const onColumnHeaderClicked = (columnName) => {
    const newPaginationInfo = { ...props.paginationInfo };
    if (columnName === props.paginationInfo.sortColumn) {
      if (props.paginationInfo.sortOrder === "asc") {
        newPaginationInfo.sortOrder = "desc";
      } else {
        newPaginationInfo.sortOrder = "asc";
      }
    } else {
      newPaginationInfo.sortOrder = "asc";
      newPaginationInfo.sortColumn = columnName;
    }

    props.changePagination(newPaginationInfo);
  };

  return (
    <td onClick={() => onColumnHeaderClicked(props.column.name)} data-testid={`header-${props.column.name}`}>
      {props.paginationInfo.sortColumn !== props.column.name && (
        <span className="icon is-inline">{props.column.title}</span>
      )}
      {props.paginationInfo.sortColumn === props.column.name &&
        props.paginationInfo.sortOrder === "asc" && (
          <span className="icon is-inline">
            {props.column.title}
            <i className="ml-1 fas fa-thin fa-sort-up" />
          </span>
        )}
      {props.paginationInfo.sortColumn === props.column.name &&
        props.paginationInfo.sortOrder === "desc" && (
          <span className="icon is-inline">
            {props.column.title}
            <i className="ml-1 fas fa-thin fa-sort-down" />
          </span>
        )}
    </td>
  );
};
