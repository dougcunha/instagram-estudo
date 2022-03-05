import { app, getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from '../firebase';
import { useState } from 'react';
import { validarEmail } from '../validacoes';
import validator from 'validator';
import logo from '../img/instagrado.png';

function Login(props) {
  const [emailError, setEmailError] = useState('')
  function mostrarCadastro(e) {
      e.preventDefault();
      const cadastro = document.getElementById('formCadastro');
      cadastro.style.display = 'block';
  }

  async function signIn(e) {
      e.preventDefault();
      const email = document.getElementById('emailLogin').value;
      const senha = document.getElementById('senhaLogin').value;

      try {
        const auth = await signInWithEmailAndPassword(getAuth(app), email, senha);
        props.setUser(auth.user.displayName);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
  }

  const getEmail = () => document.getElementById('emailLogin').value;
  const getSenha = () => document.getElementById('senhaLogin').value;

  function ativarBotaoEntrar(e) {
    const ok = validator.isEmail(getEmail())
      && validator.isLength(getSenha(), {min: 5, max: 30});

    const botao = document.getElementById('btn-entrar');
    botao.disabled = !ok;
  }

  async function resetarSenha(e) {
    e.preventDefault();
    const email = getEmail();
    if (!validator.isEmail(email)) {
      alert('Informe um email válido.');

      return;
    }

    try {
      await sendPasswordResetEmail(getAuth(app), getEmail());
      alert('O link para resetar a senha enviado para o email.');
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div className='formLogin'>
      <div className='logo'><img src={logo} alt=""/></div>
      <form onSubmit={e => signIn(e)}>
        <span className='validacao'>{emailError}</span>
        <input id="emailLogin" onChange={(e) => validarEmail(e, setEmailError)} type="email" placeholder='Email' />
        <input id="senhaLogin" onChange={e => ativarBotaoEntrar(e)} type="password" placeholder='Senha' />
        <input id="btn-entrar" type="submit" name="acao" value="Entrar" disabled/>
        <button id="btnCriarConta" className='btnCriarConta btn-link' onClick={e => mostrarCadastro(e) }>Criar conta</button>
        <button id="btnResetarSenha" className='btnEsqueciSenha btn-link' onClick={e => resetarSenha(e)}>Esqueci a senha</button>
      </form>
    </div>
  )
}

export default Login;