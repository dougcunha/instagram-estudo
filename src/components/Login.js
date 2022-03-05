import {
  app,
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from '../firebase';

import { useState } from 'react';
import { checkEmail } from '../validations';
import validator from 'validator';
import logo from '../img/instagrado.png';

function Login(props) {
  const [emailError, setEmailError] = useState('')
  function showModalNewUser(e) {
      e.preventDefault();
      const formNewUser = document.getElementById('form-new-user');
      formNewUser.style.display = 'block';
  }

  const getEmail = () => document.getElementById('email-login').value;
  const getPassword = () => document.getElementById('txt-password').value;

  async function signIn(e) {
      e.preventDefault();

      try {
        const auth = await signInWithEmailAndPassword(getAuth(app), getEmail(), getPassword());
        props.setUser(auth.user.displayName);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
  }

  function enableBtnLogin(e) {
    const ok = validator.isEmail(getEmail())
      && validator.isLength(getPassword(), {min: 5, max: 30});

    const btn = document.getElementById('btn-login');
    btn.disabled = !ok;
  }

  async function resetPassword(e) {
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
    <div className='form-login'>
      <div className='logo'><img src={logo} alt=""/></div>
      <form onSubmit={e => signIn(e)}>
        <span className='validation'>{emailError}</span>
        <input id="email-login" onChange={(e) => checkEmail(e, setEmailError)} type="email" placeholder='Email' />
        <input id="txt-password" onChange={e => enableBtnLogin(e)} type="password" placeholder='Senha' />
        <input id="btn-login" type="submit" name="btn-login" value="Entrar" disabled/>
        <button id="btn-new-account" className='btn-new-account btn-link' onClick={e => showModalNewUser(e) }>Criar conta</button>
        <button id="btn-reset-password" className='btn-forgot-password btn-link' onClick={e => resetPassword(e)}>Esqueci a senha</button>
      </form>
    </div>
  )
}

export default Login;