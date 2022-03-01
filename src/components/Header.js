import Logo from './Logo';
import { app, getAuth } from '../firebase';
import { useState } from 'react'
import { Profile } from './Profile';
import { ProfileModel } from '../modelos';

function Logado(props) {
  const [perfil, setPerfil] = useState(null);

  async function sair(e) {
    e.preventDefault();
    await getAuth(app).signOut();
    props.setUser(null);
    window.location.href = "/";
  }

  function abrirNovoPost(e) {
    e.preventDefault();

    props.setNovoPost(true);
  }

  function verPerfil(e) {
    e.preventDefault();
    setPerfil(ProfileModel.fromFbUser(getAuth(app).currentUser));
  }

  return (
    <span className='logado'>
      Bem vindo <span className='user-name' onClick={e => verPerfil(e)}>{props.user}!</span>
      <button className='logoff' onClick={e => sair(e)}> Sair </button>
      <button className='novo-post' onClick={e => abrirNovoPost(e)}>Publicar</button>
      {perfil && <Profile user={perfil} setPerfil={setPerfil} />}
    </span>
  )
}

function Header(props) {
    return (
      <div className="header">
        <Logo></Logo>
        {props.user && <Logado {...props}></Logado>}
      </div>
    )
}

export default Header;