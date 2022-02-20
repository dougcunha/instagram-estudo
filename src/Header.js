import { useEffect, useState } from 'react';
import { auth } from './firebase.js';

function Header(props) {

    function abrirModalCriarConta(e) {
        e.preventDefault();
        const modal = document.querySelector('.modalCriarConta');
        modal.style.display = 'block';
    }

    function fecharModalCriar(e) {
        const modal = document.querySelector('.modalCriarConta');
        modal.style.display = 'none';
    }

    function criarConta(e) {
        e.preventDefault();
        const email = document.getElementById('emailCadastro').value;
        const userName = document.getElementById('usernameCadastro').value;
        const senha = document.getElementById('senhaCadastro').value;

        auth.createUserWithEmailAndPassword(email, senha)
            .then(authUser => {
                authUser.user.updateProfile({
                    displayName: userName
                })
            })
            .then(_ => {
                fecharModalCriar(null);
            })
            .catch(error => {
                alert(error.message)
            })
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
        <div className="App">
        <div className="header">
          <div className='modalCriarConta'>
             <div className='formCriarConta'>
                 <div onClick={e => fecharModalCriar(e)} className='closeModalCriar'>X</div>
                 <h2>Criar conta</h2>
                 <form onSubmit={(e) => criarConta(e)}>
                     <input id="emailCadastro" type="text" placeholder='Seu email...'></input>
                     <input id="usernameCadastro" type="text" placeholder='Seu username'></input>
                     <input id="senhaCadastro" type="password" placeholder='Sua senha'></input>
                     <input id="" type="submit" value="Nova conta" />
                 </form>
             </div> 
          </div>  
          <div className='center'>
            <div className="header__logo">
              <a href="#"> <img src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png' /> </a>
            </div>
            {
              (props.user) 
               ? <div className='header__logadoInfo'>
                  <span>Olá <strong>{props.user}!</strong></span>
                  <a href='#'>Postar</a>
               </div>
               : <div className='header__loginForm'>
                  <form onSubmit={e => logar(e)}>
                    <input id="emailLogin" type="text" placeholder='Login...' />
                    <input id="senhaLogin" type="password" placeholder='Senha' />
                    <input type="submit" name="acao" value="Entrar" />
                  </form>
                  <div className='btn__criarConta'>
                    <a onClick={e => abrirModalCriarConta(e) } href="#">Criar conta!</a>
                  </div>
                 </div>
            }
          </div>
        </div>
      </div>
    )
}

export default Header;