import { useState, useEffect, createContext, useContext } from 'react'
import { app, getAuth } from '../firebase';

import {
  subscribeToComments,
  deletePost,
  getUserProfile,
  addLike,
  deleteLike,
  subscribeToLike,
  subscribeToLikes,
} from '../data/db';

import { Comment } from './Comment';
import '../index';
import { Profile } from './Profile';
import nophoto from '../img/nophoto.png';
import { useComponentBaseContext } from './WithDialog';
import { FormComment } from './Controls';

const PostContext = createContext();

export function usePostContext() {
  const context = useContext(PostContext);

  if (!context)
    throw new Error("Child components of Post cannot be rendered outside the Post component!");

  return context;
}


function Post(props) {
  const {
    setInfoMessage,
    setErrorMessage,
    setDlgDelete
  } = useComponentBaseContext();

  const post = props.post;
  const user = getAuth(app).currentUser;
  const [profile, setProfile] = useState(null);
  const [showingProfile, setShowingProfile] = useState(false);

  useEffect(() => {
    getUserProfile(post.user.id)
      .then(p => setProfile(p));
  },[post]);

  return (
    <PostContext.Provider value={
      {
        user,
        post,
        profile,
        showingProfile,
        setShowingProfile,
        setInfoMessage,
        setErrorMessage,
        setDlgDelete,
      }
     }>
      <div className="post" id={post.id} key={post.id}>
        <PostHeader />
        <Photo />
        <p className='post-description'>{post.description}</p>
        <CommentList />
        <FormComment />
        <Profile userProfile={profile} show={showingProfile} setProfile={setShowingProfile} />
      </div>
    </PostContext.Provider>
  )
}

function PostHeader() {
  const {
    user,
    post,
    profile,
    setErrorMessage,
    setShowingProfile
  } = usePostContext();

  async function showProfile(e) {
    e.preventDefault();

    try {
      setShowingProfile(true);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  }

  return (
    <div className='header-post'>
        <img className='profile-photo-small left' onClick={e => showProfile(e)} src={profile?.photoURL || nophoto} alt=""></img>
        <p><span className='user-name' onClick={e => showProfile(e, profile)}> {post.user.name}</span> - {post.when()}</p>
        <BtnDelete hidden={user.uid !== post.user.id} />
    </div>
  );
}

function BtnDelete({hidden}) {
  const {
    post,
    setDlgDelete,
    setErrorMessage,
  } = usePostContext();

  async function removePost(e, id) {
    e.preventDefault();

    console.log('Apagando post ' + id);
    try {
      await deletePost(id);
      setDlgDelete(null);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  function closeDialog(e) {
    e.preventDefault();
    setDlgDelete(null);
  }

  function confirmDeletePost(e) {
    e.preventDefault();
    setDlgDelete(deletePostDlg);
  }

  const deletePostDlg = {
    message: "Essa operação não pode ser desfeita, continuar?",
    title: "Apagar a publicação?",
    onConfirm: e => removePost(e, post.id),
    onCancel: e => closeDialog(e)
  }

  return (
    !hidden && <button className='btn-delete-post' onClick={e => confirmDeletePost(e)}>Apagar</button>
  )
}

function CommentList() {
  const { post } = usePostContext();
  const [comments, setComments] = useState([]);

  useEffect(() => {
    subscribeToComments(post.id, setComments);
  },[post]);

  return (
      <div className='comments'>
      {
        comments.map(comment => <Comment key={comment.id} comment={comment} postId={post.id}/>)
      }
    </div>
  );
}

const LikeContext = createContext();

export function useLikeContext() {
  const context = useContext(LikeContext);

  if (!context)
    throw new Error("Child components of Post cannot be rendered outside the WithLikeContext component!");

  return context;
}

function Photo() {
  const {
    post,
    user,
    setErrorMessage
  } = usePostContext();

  useEffect(() => {
    subscribeToLike(post.id, setLike);
    subscribeToLikes(post.id, setLikes);
  }, [post]);

  const [like, setLike] = useState(null);
  const [likes, setLikes] = useState([]);

  const getLiked = () => {
    return like != null && like !== undefined
  };

  async function toggleLiked(e) {
    e.preventDefault();

    try {
      if (!getLiked())
        await addLike(post.id, user);
      else
        await deleteLike(like);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  return (
    <LikeContext.Provider value={{
      post,
      like,
      setLike,
      likes,
      setLikes,
      toggleLiked
    }}>
      <div className='photo'>
        <img
          src={post.image.url}
          alt=""
          onDoubleClick={e => toggleLiked(e)}
        />
        <span
          className={'material-icons-outlined like-heart-post ' + (like ? 'like-o' : '')}
          onDoubleClick={e => toggleLiked(e)}
        >
          favorite
        </span>
      </div>
      <Likes/>
    </LikeContext.Provider>
  );
}

function Likes() {
  const likedClass = 'fa fa-heart-o material-icons-outlined f25';
  const notLikedClass = 'fa fa-heart material-icons-outlined f25';
  const {
    post,
    likes,
    like,
    toggleLiked
  } = useLikeContext();

  function getLikes() {
    let content = '';
    if (likes.length === 0)
       content = 'Seja o primeiro a curtir!';
    else if (likes.length === 1)
      content = <span><b>{likes[0].user.name}</b> curtiu</span>;
    else {
      let i = 0;
      let str = [];
      while (i < 5 && i < likes.length) {
        str.push(likes[i].user.name);
        i++;
      }

      content = <span>{likes.length} pessoas curtiram, incluindo <b>{str.join(', ')}</b></span>
    }

    function Wrap({children}) {
      return <span id={`heart${post.id}`} className='div-like'>
        <b onClick={e => toggleLiked(e, post.id)} className={like ? likedClass : notLikedClass} >
          favorite
        </b>
        {children}
      </span>
    }

    return (
      <Wrap>{content}</Wrap>
    )
  }

  return (
    <span className='post-likes'>{getLikes()}</span>
  );
}

export default Post;