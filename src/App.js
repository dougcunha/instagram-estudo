import './App.css';
import Header from './Header'
import Login from './Login'
import Cadastro from './Cadastro'
import { Post } from './Post';
import { FormUpload } from './FormUpload';
import { useState, useEffect } from 'react'
import { db, auth } from './firebase';
import { PostModel } from './modelos';

function App() {
  const [user, setUser] = useState();
  const [novoPost, setNovoPost] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    auth.onAuthStateChanged(val => {
      console.log(val);
      setUser(val?.displayName);
    });

    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snap => {
        const docs = snap.docs;
        setPosts(docs.map(item => PostModel.fromPost(item.id, item.data())));
        setNovoPost(docs.length === 0);
      })
  }, []);

  return (
    <div className="App">
      <Header user={user} setUser={setUser} setNovoPost={setNovoPost}></Header>
      {(!user) && <Login user={user} setUser={setUser} />}
      {(!user) && <Cadastro user={user} setUser={setUser} />}
      {user && novoPost && <FormUpload user={user} novoPost={novoPost} setNovoPost={setNovoPost} />}
      {user && posts.map(post => <Post key={post.id} post={post} id={post.id} ></Post>) }
    </div>
  );
}

export default App;
