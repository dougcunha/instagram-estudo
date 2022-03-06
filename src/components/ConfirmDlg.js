import alert from '../img/alert.png';

export function DlgConfirmDelete(props) {
  return (
    <ConfirmDlg type='alert' confirmText="Apagar" cancelText="Cancelar" {...props}/>
  );
}

export function ConfirmDlg(props) {
  const question = props.msg;
  const confirm = props.confirm;
  const cancel = props.cancel;
  const confirmText = props.confirmText || "Sim";
  const cancelText = props.cancelText || "Não";
  const title = props.title || "Confirmação";
  const type = props.type;

  function getIcon() {
    return type === 'alert' ? alert : null;
  }

  return (
    <div className='modal' style={props.style || {display: 'none'}}>
      <div className="dialog confirm-dlg">
        <p className="dlg-title">{title}</p>
        <div className="dlg-msg">
          <img className='dlg-icon' src={getIcon()} alt="" />
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

