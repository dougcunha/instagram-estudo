export function ConfirmDlg(props) {
  const question = props.msg;
  const sim = props.sim;
  const nao = props.nao;
  return (
    <div className='modal' style={props.style}>
      <div className="dialog confirm-dlg">
        <p>{question}</p>
        <div className="dlg-botoes">
          <button className="nao" onClick={e => nao(e)}>Não</button>
          <button className="sim" onClick={e => sim(e)}>Sim</button>
        </div>
      </div>
    </div>
  )
}

