export function DlgConfirmDelete(props) {
  return (
    <ConfirmDlg
      type='warning'
      confirmText="Apagar"
      cancelText="Cancelar"
      message={props.message}
      title={props.title}
      onConfirm={props.onConfirm}
      onCancel={props.onCancel}
    />
  );
}

export function ConfirmDlg(props) {
  const question = props.message;
  const confirm = props.onConfirm;
  const cancel = props.onCancel;
  const confirmText = props.confirmText || "Sim";
  const cancelText = props.cancelText || "Não";
  const title = props.title || "Confirmação";
  const type = props.type;

  return (
    <div className='modal'>
      <div className="dialog confirm-dlg">
        <p className="dlg-title">{title}</p>
        <div className="dlg-msg">
          <span className='dlg-icon material-icons-outlined'>{type}</span>
          <p>{question}</p>
        </div>
        <div className="dlg-form-buttons">
          <button className="btn-cancel" onClick={e => cancel(e)}>{cancelText}</button>
          <button className="btn-confirm" onClick={e => confirm(e)}>{confirmText}</button>
        </div>
      </div>
    </div>
  )
}

