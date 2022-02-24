import './App.css';
import Header from './Header'
import Login from './Login'
import Cadastro from './Cadastro'
import { FormUpload } from './FormUpload';
import { useState } from 'react'

function App() {
  const [user, setUser] = useState();
  const [conteudo, setConteudo] = useState();

  return (
    <div className="App">
      <Header user={user} setUser={setUser} setConteudo={setConteudo}></Header>
      {(!user) && <Login user={user} setUser={setUser} ></Login>}
      {(!user) && <Cadastro user={user} setUser={setUser} ></Cadastro>}
      <div className="conteudo" id="conteudo">
        <FormUpload conteudo={conteudo} setConteudo={setConteudo}></FormUpload>
      </div>
    </div>
  );
}

export default App;
