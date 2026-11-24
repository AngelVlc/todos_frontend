export const YesNoButtons = ({ onYes, onNo }) => {
  return (
     <div className="buttons">
     <button
       className="button is-danger"
       data-testid="yes"
       onClick={onYes}
     >
       YES
     </button>
     <button
       className="button"
       data-testid="no"
       onClick={onNo}
     >
       NO
     </button>
   </div>
  );
}