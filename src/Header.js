import Logo from './Logo';
import { auth } from './firebase';

function Logado(props) {
  function sair(e) {
    e.preventDefault();
    auth.signOut().then(e => props.setUser(null));
    window.location.href = "/";
  }

  function abrirNovoPost(e) {
    e.preventDefault();

    props.setNovoPost(true);
  }

  return (
    <span className='logado'>
      Bem vindo <strong>{props.user}!</strong>
      <button className='logoff' onClick={e => sair(e)}> Sair </button>
      <button className='novo-post' onClick={e => abrirNovoPost(e)}>Publicar</button>
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