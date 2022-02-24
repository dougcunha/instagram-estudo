import Logo from './Logo';

function Logado(props) {
  function sair(e) {
    e.preventDefault();
    props.setUser(null);
    alert('Logoff efetuado.');
  }

  function abrirNovoPost(e) {
    e.preventDefault();

    props.setConteudo(true);
  }

  return (
    <span className='logado'>
      Bem vindo <strong>{props.user}!</strong>
      <span className='logoff' onClick={e => sair(e)}> Sair? </span>
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