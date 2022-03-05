import validator from 'validator';
import { useState } from 'react';
import { validarEmail } from '../validacoes.js';
import { createUser } from '../data/db';
import logo from '../img/instagrado.png';

function Cadastro(props) {
  function fecharModalCriar(e) {
    const modal = document.getElementById('formCadastro');
    modal.style.display = 'none';
  }

  const [emailError, setEmailError] = useState('')
  const getEmail = () => document.getElementById('emailCadastro').value;
  const getDisplayName = () => document.getElementById('usernameCadastro').value;
  const getPassword = () => document.getElementById('senhaCadastro').value;

  async function criarConta(e) {
    e.preventDefault();

    try {
      await createUser(getEmail(), getPassword(), getDisplayName());
      alert('Conta criada com sucesso!');
      fecharModalCriar();
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }

  function ativarBotao(e) {
    const ok = validator.isEmail(getEmail())
      && validator.isLength(getDisplayName(), {min: 5, max: 30})
      && validator.isLength(getPassword(), {min: 5, max: 30});

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
        <div className='logo'><img src={logo} alt=""/></div>
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