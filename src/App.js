import './App.css';
import Header from './Header'
import Login from './Login'
import Cadastro from './Cadastro'
import { Post } from './Post';
import { FormUpload } from './FormUpload';
import { useState, useEffect } from 'react'
import { storage, db } from './firebase';

function App() {
  const [user, setUser] = useState('Douglas');
  const [novoPost, setNovoPost] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snap => {
        setPosts(snap.docs.map(p => {
          return {id: p.id, info: p.data()}
        }))
      })
  }, []);

  return (
    <div className="App">
      <Header user={user} setUser={setUser} setNovoPost={setNovoPost}></Header>
      {(!user) && <Login user={user} setUser={setUser} ></Login>}
      {(!user) && <Cadastro user={user} setUser={setUser} ></Cadastro>}
      <div className="conteudo" id="conteudo">
        <FormUpload user={user} novoPost={novoPost} setNovoPost={setNovoPost}></FormUpload>
        { posts.map(val => <Post key={val.id} post={val.info} id={val.id}></Post>) }
      </div>
    </div>
  );
}

export default App;
