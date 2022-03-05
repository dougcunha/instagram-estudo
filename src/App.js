import './App.css';
import Header from './components/Header'
import Login from './components/Login'
import SignUp from './components/SignUp'
import { Post } from './components/Post';
import { FormUpload } from './components/FormUpload';
import { useState, useEffect } from 'react'
import { app, getAuth } from './firebase';
import { subscribeToPosts } from './data/db';

function App() {
  const [user, setUser] = useState();
  const [novoPost, setNovoPost] = useState();
  const [posts, setPosts] = useState([]);

  useEffect(() => {

    getAuth(app).onAuthStateChanged(val => {
      setUser(val?.displayName);
    });

    subscribeToPosts(posts => {
      setPosts(posts);
      setNovoPost(posts.length === 0);
    });
  }, []);

  return (
    <div className="App">
      <Header user={user} setUser={setUser} setNovoPost={setNovoPost}></Header>
      {(!user) && <Login user={user} setUser={setUser} />}
      {(!user) && <SignUp user={user} setUser={setUser} />}
      {user && novoPost && <FormUpload user={user} novoPost={novoPost} setNovoPost={setNovoPost} />}
      {user && posts.map(post => <Post key={post.id} post={post} id={post.id} ></Post>) }
    </div>
  );
}

export default App;
