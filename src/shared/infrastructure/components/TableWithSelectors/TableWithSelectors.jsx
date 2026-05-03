import React from "react";
import { PageSelector } from "../PageSelector";
import { PageSizeSelector } from "../PageSizeSelector";
import { TableColumnHeader } from "../TableColumnHeader";

export const TableWithSelectors = (props) => {
  const onSelectAll = (newCheckedValue) => {
    const newData = [...props.rows].map((row) => {
      row[props.selectedColumnName] = newCheckedValue;
      return row;
    });

    props.changeSelected(newData);
  };

  const onChangeItemSelected = (newCheckedValue, index) => {
    const newData = [...props.rows];
    newData[index].selected = newCheckedValue;

    props.changeSelected(newData);
  };

  return (
    <div>
      <div className="table-container">
        <table className="table is-fullwidth is-striped is-hoverable">
          <thead>
            <tr>
              {props.columns.map((column) => (
                <TableColumnHeader
                  key={column.title}
                  column={column}
                  paginationInfo={props.paginationInfo}
                  changePagination={props.changePagination}
                />
              ))}
              <th className="has-text-centered" style={{width: '50px'}}>
                <input
                  type="checkbox"
                  data-testid="toggleSelectAll"
                  defaultChecked={false}
                  onChange={(e) => onSelectAll(e.target.checked)}
                ></input>
              </th>
            </tr>
          </thead>
          <tbody>
            {props.rows.length > 0 ? (
              props.rows.map((row, index) => (
                <tr key={index}>
                  {props.columns.map((column) => (
                    <td key={column.name}>{row[column.name]}</td>
                  ))}
                  <td className="has-text-centered">
                    <input
                      type="checkbox"
                      data-testid={`checkBoxItem${row[props.idColumnName]}`}
                      checked={row[props.selectedColumnName]}
                      onChange={(e) =>
                        onChangeItemSelected(e.target.checked, index)
                      }
                    ></input>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={props.columns.length + 1} className="has-text-centered py-6">
                  <span className="icon is-large has-text-grey-light">
                    <i className="fas fa-inbox fa-2x"></i>
                  </span>
                  <p className="mt-3 has-text-grey">No records found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="level is-mobile mt-4">
        <div className="level-left">
          <PageSelector
            paginationInfo={props.paginationInfo}
            changePagination={props.changePagination}
          />
        </div>
        <div className="level-right">
          <PageSizeSelector
            paginationInfo={props.paginationInfo}
            changePagination={props.changePagination}
          />
        </div>
      </div>
    </div>
  );
};
