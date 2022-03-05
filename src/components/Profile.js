import nophoto from '../img/nophoto.png';
import { toFormattedDate } from '../models';

export function Profile(props) {
  const profile = props.profile;

  const createdAt = toFormattedDate(profile.createdAt);
  const lastLoginAt = toFormattedDate(profile.lastLoginAt);

  function close(e) {
    props.setProfile(null);
  }

  function editPhoto(e) {
    e.preventDefault();

    alert('Escolha uma nova photo.');
  }

  return (
    <div className="modal">
      <div className="profile dialog">
        <div className='profile-photo'>
          <span className='profile-edit-photo' onClick={e => editPhoto(e)}>Alterar</span>
          <img src={profile.photoURL || nophoto} alt=""/>
        </div>
        <h3>{profile.displayName}</h3>
        <p>{profile.email}</p>
        <p>Tel: {profile.phoneNumber || 'não informado'}</p>
        <p>Desde {createdAt}</p>
        <p>Ultimo login: {lastLoginAt}</p>
        <button className="btn" onClick={e => close(e)}>Fechar</button>
      </div>
    </div>
  );
}