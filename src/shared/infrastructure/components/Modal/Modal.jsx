import React, { useRef, forwardRef, useImperativeHandle } from "react";
import "./Modal.css";

export const Modal = forwardRef((props, ref) => {
  const modalRef = useRef();

  useImperativeHandle(ref, () => ({
    showModal() {
      toggleIsActive();
    },
    closeModal() {
      toggleIsActive();
    },
  }));

  const onCancel = () => {
    toggleIsActive();
  };

  const onOk = () => {
    props.closeHandler();
  };

  const toggleIsActive = () => {
    modalRef.current.classList.toggle("is-active");
  };

  return (
    <div ref={modalRef} className="modal" data-testid="modal">
      <div className="modal-background" onClick={() => onCancel()}></div>
      <div className="modal-content">
        <div className="box">
          <button
            className="modal-close is-large"
            aria-label="close"
            data-testid="modalClose"
            onClick={() => onCancel()}
          ></button>
          <div className="content">{props.children}</div>
          <div className="field is-grouped is-justify-content-center">
            {props.showOk && (
              <div className="control">
                <button
                  className="button is-primary"
                  onClick={() => onOk()}
                  data-testid="modalOk"
                >
                  <span className="icon">
                    <i className="fas fa-check"></i>
                  </span>
                  <span>OK</span>
                </button>
              </div>
            )}
            <div className="control">
              <button
                className="button is-light"
                onClick={() => onCancel()}
                data-testid="modalCancel"
              >
                <span className="icon">
                  <i className="fas fa-times"></i>
                </span>
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
