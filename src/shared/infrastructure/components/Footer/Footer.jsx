import React from "react";

export const Footer = () => {
  const parsedSha = () => {
    return process.env.REACT_APP_COMMIT_SHA?.substring(0, 7);
  }

  return (
    <footer className="footer has-background-white py-3">
      <div className="content has-text-centered">
        <div className="columns is-vcentered">
          <div className="column">
            <p className="is-size-7 has-text-grey">
              <span className="icon mr-1">
                <i className="fas fa-code-branch"></i>
              </span>
              <span className="has-text-weight-semibold">Commit:</span> {parsedSha() || 'N/A'}
              {process.env.REACT_APP_BUILD_DATE && (
                <>
                  <span className="mx-2">|</span>
                  <span className="icon mr-1">
                    <i className="fas fa-calendar"></i>
                  </span>
                  <span className="has-text-weight-semibold">Build:</span> {process.env.REACT_APP_BUILD_DATE}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
