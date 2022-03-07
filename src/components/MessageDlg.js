export function ErrorDlg(props) {
  return (
    <MessageDlg type='error' btnText="OK" title='Ocorreu uma falha' {...props}/>
  );
}

export function AlertDlg(props) {
  const style = {
    color: 'black',
    backgroundColor: '#ffff0060',
  };

  return (
    <MessageDlg type='info' btnText="OK" title='Alerta' style={style} {...props}/>
  );
}

export function InfoDlg(props) {
  const style = {
    color: 'black',
    backgroundColor: '#0095f635',
  };
  return (
    <MessageDlg type='info' btnText="OK" title='Informação' style={style} {...props}/>
  );
}

export function MessageDlg(props) {
  const message = props.message;
  const ok = props.ok;
  const btnText = props.btnText || "OK";
  const title = props.title || "Informação";
  const type = props.type;
  const style = props.style;

  return (
    <div className='modal'>
      <div className="dialog message-dlg">
        <p className="dlg-title">{title}</p>
        <div className="dlg-msg" style={style}>
          <span className='dlg-icon material-icons-outlined'>{type}</span>
          <p>{message}</p>
        </div>
        <div className="dlg-form-buttons">
          <button className="btn-ok" onClick={e => ok(e)}>{btnText}</button>
        </div>
      </div>
    </div>
  )
}

