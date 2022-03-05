import nophoto from '../img/nophoto.png';
import { toFormatedDate } from '../modelos';

export function Profile(props) {
  const user = props.user;

  const createdAt = toFormatedDate(user.createdAt);
  const lastLoginAt = toFormatedDate(user.lastLoginAt);

  function fechar(e) {
    props.setPerfil(null);
  }

  function editPhoto(e) {
    e.preventDefault();

    alert('Escolha uma nova photo.');
  }

  return (
    <div className="modal">
      <div className="profile dialog">
        <div className='profilePhoto'>
          <span className='profileEditPhoto' onClick={e => editPhoto(e)}>Alterar</span>
          <img src={user.photoURL || nophoto} alt=""/>
        </div>
        <h3>{user.displayName}</h3>
        <p>{user.email}</p>
        <p>Tel: {user.phoneNumber || 'não informado'}</p>
        <p>Desde {createdAt}</p>
        <p>Ultimo login: {lastLoginAt}</p>
        <button className="botao" onClick={e => fechar(e)}>Fechar</button>
      </div>
    </div>
  );
}