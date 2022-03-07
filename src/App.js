import './App.css';
import Header from './components/Header'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Post from './components/Post';
import { FormUpload } from './components/FormUpload';
import { useState, useEffect } from 'react'
import { app, getAuth } from './firebase';
import { getUserProfile, subscribeToPosts } from './data/db';
import WithDialog from './components/WithDialog';

function App() {
  const [user, setUser] = useState();
  const [newPost, setNewPost] = useState();
  const [posts, setPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {

    const auth = getAuth(app);
    if (auth.currentUser)
       getUserProfile(auth.currentUser.uid, true)
          .then(p => setUserProfile(p));

    auth.onAuthStateChanged(val => {
      setUser(val?.displayName);
      if (val != null)
        getUserProfile(auth.currentUser.uid, true)
          .then(p => setUserProfile(p));
    });

    subscribeToPosts(posts => {
      setPosts(posts);
      setNewPost(posts.length === 0);
    });
  }, []);

  return (
    <div className="App">
      <WithDialog>
        <Header userProfile={userProfile} setUser={setUser} setNewPost={setNewPost}></Header>
        {(!user) && <Login user={user} setUser={setUser} />}
        {(!user) && <SignUp user={user} setUser={setUser} />}
        {user && newPost && <FormUpload user={user} novoPost={newPost} setNovoPost={setNewPost} />}
        <div className='content'>
          {user && posts.map(post => <Post key={post.id} post={post} id={post.id} ></Post>)}
        </div>
      </WithDialog>
    </div>
  );
}

export default App;
