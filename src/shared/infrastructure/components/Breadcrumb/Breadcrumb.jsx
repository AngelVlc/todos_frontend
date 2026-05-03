import React from "react";
import { Link } from "react-router-dom";

export const Breadcrumb = (props) => {
  return (
    <nav className="breadcrumb has-arrow-separator mb-4" aria-label="breadcrumbs">
      <ul>
        <li>
          <Link to={`/`}>
            <span className="icon is-small">
              <i className="fas fa-home"></i>
            </span>
            <span>Home</span>
          </Link>
        </li>
        {props.items.map((item, index) => {
          const lastItem = index === props.items.length - 1;
          const classNames = lastItem ? { "className": "is-active" } : {};
          const aria = lastItem ? { "aria-current": "page" } : {};
          return (
            <li key={`item${index}`} {...classNames}>
              <Link {...aria} to={item.url}>
                {item.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
