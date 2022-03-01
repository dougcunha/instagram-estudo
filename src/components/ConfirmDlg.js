import alerta from '../img/alerta.png';

export function DlgApagar(props) {
  return (
    <ConfirmDlg tipo='alerta' simTxt="Apagar" naoTxt="Cancelar" {...props}/>
  );
}

export function ConfirmDlg(props) {
  const question = props.msg;
  const sim = props.sim;
  const nao = props.nao;
  const simTxt = props.simTxt || "Sim";
  const naoTxt = props.naoTxt || "Não";
  const titulo = props.titulo || "Confirmação";
  const tipo = props.tipo;

  function getIcone() {
    return tipo === 'alerta' ? alerta : null;
  }

  return (
    <div className='modal' style={props.style || {display: 'none'}}>
      <div className="dialog confirm-dlg">
        <p className="dlg-titulo">{titulo}</p>
        <div className="dlg-msg">
          <img className='dlg-icone' src={getIcone()} alt="" />
          <p>{question}</p>
        </div>
        <div className="dlg-botoes">
          <button className="nao" onClick={e => nao(e)}>{naoTxt}</button>
          <button className="sim" onClick={e => sim(e)}>{simTxt}</button>
        </div>
      </div>
    </div>
  )
}

