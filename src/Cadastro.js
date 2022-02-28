import { auth } from './firebase.js';
import validator from 'validator';
import { useState } from 'react';
import { validarEmail } from './validacoes.js';

function Cadastro(props) {
  function fecharModalCriar(e) {
    const modal = document.getElementById('modalCriarConta');
    modal.style.display = 'none';
  }
  const [emailError, setEmailError] = useState('')
  const getEmail = () => document.getElementById('emailCadastro').value;
  const getUserName = () => document.getElementById('usernameCadastro').value;
  const getSenha = () => document.getElementById('senhaCadastro').value;

  function criarConta(e) {
    e.preventDefault();
    const email = getEmail();
    const userName = getUserName();
    const senha = getSenha();

    auth.createUserWithEmailAndPassword(email, senha)
        .then(authUser => {
            authUser.user.updateProfile({
                displayName: userName
            })
        })
        .then(_ => {
            fecharModalCriar();
        })
        .catch(error => {
            alert(error.message)
        })
  }

  function ativarBotao(e) {
    const ok = validator.isEmail(getEmail())
      && validator.isLength(getUserName(), {min: 5, max: 30})
      && validator.isLength(getSenha(), {min: 5, max: 30});

    const botao = document.getElementById('submit');
    botao.disabled = !ok;
  }

  function mostrarLogin(e) {
    e.preventDefault();
    const cadastro = document.getElementById('formCadastro');
    cadastro.style.display = 'none';
  }

  return (
    <div className='formCadastro' id='formCadastro'>
        <div className='logo'></div>
        <h2>Cadastre-se para ver fotos e vídeos dos seus amigos.</h2>
        <form onSubmit={(e) => criarConta(e)}>
           <span className='validacao'>{emailError}</span>
           <input id="emailCadastro" onChange={(e) => validarEmail(e, setEmailError)} type="email" placeholder='Email'></input>
           <input id="usernameCadastro" onChange={e => ativarBotao(e)} type="text" placeholder='Nome de usuário'></input>
           <input id="senhaCadastro" onChange={e => ativarBotao(e)} type="password" placeholder='Senha'></input>
           <input id="submit" type="submit" value="Cadastre-se" disabled/>
           <div className='btnLogin'>
           <button className='btn-link' onClick={e => mostrarLogin(e) } >Fazer login</button>
          </div>
           <div className='regrasCadastro'>Ao se cadastrar, você concorda com nossos Termos, Política de Dados e Política de Cookies.</div>
        </form>
    </div>
  )
}


export default Cadastro;