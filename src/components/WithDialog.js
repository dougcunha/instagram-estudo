import { useState, createContext, useContext } from 'react';
import { DlgConfirmDelete } from './ConfirmDlg';
import { AlertDlg, ErrorDlg, InfoDlg } from "./MessageDlg";

const ComponentBaseContext = createContext();

export function useComponentBaseContext() {
  const context = useContext(ComponentBaseContext);

  if (!context)
    throw new Error("Child components of Card cannot be rendered outside the WithDialog component!");

  return context;
}

function WithDialog({children}) {
    const [alertMessage, setAlertMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [infoMessage, setInfoMessage] = useState(null);
    const [dlgDelete, setDlgDelete] = useState(null);

    return (
      <ComponentBaseContext.Provider value={{
        setAlertMessage,
        setErrorMessage,
        setInfoMessage,
        setDlgDelete
      }}>
        {children}
        {dlgDelete && <DlgConfirmDelete {...dlgDelete} />}
        {errorMessage && <ErrorDlg message={errorMessage} ok={_ => setErrorMessage(null)}/>}
        {alertMessage && <AlertDlg message={alertMessage} ok={_ => setAlertMessage(null)}/>}
        {infoMessage && <InfoDlg message={infoMessage} ok={_ => setInfoMessage(null)}/>}
      </ComponentBaseContext.Provider>
    );
}

export default WithDialog;