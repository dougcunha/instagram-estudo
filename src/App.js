import './App.css';
import Header from './Header'
import Login from './Login'
import Cadastro from './Cadastro'
import { useState } from 'react'

function App() {
  const [user, setUser] = useState();

  return (
    <div className="App">
      <Header></Header>
      {(!user) && <Login user={user} setUser={setUser} ></Login>}
      {(!user) && <Cadastro user={user} setUser={setUser} ></Cadastro>}
    </div>
  );
}

export default App;
