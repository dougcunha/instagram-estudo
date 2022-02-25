import { auth } from './firebase';
import { useState } from 'react';
import { validarEmail } from './validacoes';

function Login(props) {
  const [emailError, setEmailError] = useState('')
  function mostrarCadastro(e) {
      e.preventDefault();
      const cadastro = document.getElementById('formCadastro');
      cadastro.style.display = 'block';
  }

  function logar(e) {
      e.preventDefault();
      const email = document.getElementById('emailLogin').value;
      const senha = document.getElementById('senhaLogin').value;

      auth.signInWithEmailAndPassword(email, senha)
          .then(auth => {
              props.setUser(auth.user.displayName);
              alert('Logado com sucesso!');
          })
          .catch(error => alert(error.message));
  }

  return (
    <div className='formLogin'>
      <div className='logo'></div>
      <form onSubmit={e => logar(e)}>
        <span className='validacao'>{emailError}</span>
        <input id="emailLogin" onChange={(e) => validarEmail(e, setEmailError)} type="email" placeholder='Email' />
        <input id="senhaLogin" type="password" placeholder='Senha' />
        <input type="submit" name="acao" value="Entrar" />
        <button className='btnCriarConta' onClick={e => mostrarCadastro(e) } href="#">Criar conta</button>
      </form>
    </div>
  )
}

export default Login;