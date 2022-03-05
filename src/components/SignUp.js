import validator from 'validator';
import { useState } from 'react';
import { checkEmail } from '../validations';
import { createUser } from '../data/db';
import logo from '../img/instagrado.png';

function SignUp(props) {
  function closeModal(e) {
    const modal = document.getElementById('form-new-user');
    modal.style.display = 'none';
  }

  const [emailError, setEmailError] = useState('')
  const getEmail = () => document.getElementById('user-email').value;
  const getDisplayName = () => document.getElementById('user-display-name').value;
  const getPassword = () => document.getElementById('user-password').value;

  async function createAccount(e) {
    e.preventDefault();

    try {
      await createUser(getEmail(), getPassword(), getDisplayName());
      alert('Conta criada com sucesso!');
      closeModal();
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }

  function enableButton(e) {
    const ok = validator.isEmail(getEmail())
      && validator.isLength(getDisplayName(), {min: 5, max: 30})
      && validator.isLength(getPassword(), {min: 5, max: 30});

    const btn = document.getElementById('submit');
    btn.disabled = !ok;
  }

  function showModalLogin(e) {
    e.preventDefault();
    const formNewUser = document.getElementById('form-new-user');
    formNewUser.style.display = 'none';
  }

  return (
    <div className='form-new-user' id='form-new-user'>
        <div className='logo'><img src={logo} alt=""/></div>
        <h2>Cadastre-se para ver fotos e vídeos dos seus amigos.</h2>
        <form onSubmit={(e) => createAccount(e)}>
           <span className='validation'>{emailError}</span>
           <input id="user-email" onChange={(e) => checkEmail(e, setEmailError)} type="email" placeholder='Email'></input>
           <input id="user-display-name" onChange={e => enableButton(e)} type="text" placeholder='Nome de usuário'></input>
           <input id="user-password" onChange={e => enableButton(e)} type="password" placeholder='Senha'></input>
           <input id="submit" type="submit" value="Cadastre-se" disabled/>
           <div className='btnLogin'>
           <button className='btn-link' onClick={e => showModalLogin(e) } >Fazer login</button>
          </div>
           <div className='rules-new-user'>Ao se cadastrar, você concorda com nossos Termos, Política de Dados e Política de Cookies.</div>
        </form>
    </div>
  )
}


export default SignUp;