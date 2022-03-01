import nophoto from '../img/nophoto.png';
import { format } from 'date-fns'

export function Profile(props) {
  const user = props.user;

  function fechar(e) {
    props.setPerfil(null);
  }

  return (
    <div className="modal">
      <div className="profile dialog">
        <img src={user.photoUrl || nophoto} alt=""/>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <p>Tel: {user.phone || 'não informado'}</p>
        {/*<p>Desde {format(user.createdAt, 'dd/MM/yyyy HH:mm')}</p>
        <p>Ultimo login: {format(user.lastLoginAt, 'dd/MM/yyyy HH:mm:ss')}</p>*/}
        <button className="botao" onClick={e => fechar(e)}>Fechar</button>
      </div>
    </div>
  );
}