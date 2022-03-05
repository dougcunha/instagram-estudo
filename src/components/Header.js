import Logo from './Logo';
import { app, getAuth } from '../firebase';
import { useState } from 'react'
import { Profile } from './Profile';
import { getUserProfile } from '../data/db';

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

  async function verPerfil(e) {
    e.preventDefault();
    const profile = await getUserProfile(getAuth(app).currentUser.uid);
    setPerfil(profile);
  }

  return (
    <span className='logged'><span className={getAuth(app).currentUser.uid}></span>
      {perfil && <Profile user={perfil} setPerfil={setPerfil} />}
      Bem vindo <span className='user-name' onClick={e => verPerfil(e)}>{props.user}</span>
      <button className='logoff' onClick={e => sair(e)}> Sair </button>
      <button className='btn-new-post' onClick={e => abrirNovoPost(e)}>Publicar</button>
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