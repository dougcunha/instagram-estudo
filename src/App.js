import './App.css';
import { db } from './firebase.js';
import Header from './Header.js'
import { useEffect, useState } from 'react';

function App() {
  const [user, setUser] = useState();
  useEffect(() => {

  }, []);

  return (
    <Header setUser={setUser} user={user}></Header>
  );
}

export default App;
