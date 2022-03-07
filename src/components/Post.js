import { useState, useEffect } from 'react'
import { app, getAuth } from '../firebase';

import {
  subscribeToComments,
  addComment,
  deletePost,
  getUserProfile,
  addLike,
  deleteLike,
  subscribeToLike,
  subscribeToLikes
} from '../data/db';

import { Comment } from './Comment';
import '../index';
import { Profile } from './Profile';
import nophoto from '../img/nophoto.png';
import { useComponentBaseContext } from './WithDialog';

function Post(props) {
  const {
    setAlertMessage,
    setErrorMessage,
    setInfoMessage,
    setDlgDelete
  } = useComponentBaseContext();

  const likedClass = 'fa fa-heart-o material-icons-outlined f25';
  const notLikedClass = 'fa fa-heart material-icons-outlined f25';
  const post = props.post;
  const user = getAuth(app).currentUser;
  const [comments, setComments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [showingProfile, setShowingProfile] = useState(false);
  const [like, setLike] = useState(null);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    subscribeToComments(post.id, setComments);
    subscribeToLike(post.id, setLike);
    subscribeToLikes(post.id, setLikes);
    getUserProfile(post.user.id).then(p => setProfile(p));
  },[post, user]);

  async function newComment(id, e) {
    e.preventDefault?.();
    const comment = document.getElementById(`comment-${id}`);

    if (!comment.value)
    {
      setAlertMessage('Digite uma mensagem antes de enviar.');
      return;
    }

    try {
      await addComment(id, comment.value);
      comment.value = '';
    } catch (error) {
      setErrorMessage('Digite uma mensagem antes de enviar.');
    }
  }

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

  async function showProfile(e) {
    e.preventDefault();

    try {
      setShowingProfile(true);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  }

  const hidden = user.uid !== post.user.id;

  async function toggleLike(e, postId) {
    e.preventDefault();

    try {
      if (!like)
        await addLike(postId, user);
      else
        await deleteLike(like);
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }

  function getLikes() {
    if (likes.length === 0)
      return 'Seja o primeiro a curtir!';

    if (likes.length === 1)
      return <span><b>{likes[0].user.name}</b> curtiu</span>;

    let i = 0;
    let str = [];
    while (i < 5 && i < likes.length) {
      str.push(likes[i].user.name);
      i++;
    }

    return <span>{likes.length} pessoas curtiram, incluindo <b>{str.join(', ')}</b></span>
  }

  function showEmojis(e) {
    e.preventDefault();

    setInfoMessage(`
      Ainda estamos implementando os Emojis.
      No windows você pode chamar o diálogo padrão de emojis usando a tecla Win + .
    `);
  }

  return (
    <div className="post" id={post.id}>
      <div className='header-post'>
        <img className='profile-photo-small left' onClick={e => showProfile(e)} src={profile?.photoURL || nophoto} alt=""></img>
        <p><span className='user-name' onClick={e => showProfile(e, profile)}> {post.user.name}</span> - {post.when()}</p>
        {!hidden && <button className='btn-delete-post' onClick={e => confirmDeletePost(e)}>Apagar</button>}
      </div>
      <div className='photo'>
        <img src={post.image.url} alt="" onDoubleClick={e => toggleLike(e, post.id)}/>
        <span className={'material-icons-outlined like-heart-post ' + (like ? 'like-o' : '')} onDoubleClick={e => toggleLike(e, post.id)}>favorite</span>
      </div>
      <p className='posted-by'><span id={`heart${post.id}`} className='div-like'>
        <b onClick={e => toggleLike(e, post.id)} className={like ? likedClass : notLikedClass} >
          favorite
        </b><span className='post-likes'>{getLikes()}</span>
      </span>
      </p>
      <p className='post-description'>{post.description}</p>
      <div className='comments'>
        {
          comments.map(comment => <Comment key={comment.id} comment={comment} postId={post.id}/>)
        }
      </div>
      <form className='form-add-comment' id={`form-add-comment-${post.id}`} onSubmit={e => newComment(post.id, e)}>
        <button className='btn-emoji-list material-icons-outlined' onClick={e => showEmojis(e)}>emoji_emotions</button>
        <textarea id={`comment-${post.id}`} placeholder="Adicione um comentário..." ></textarea>
        <input type="submit" value="Publicar" />
      </form>
      {showingProfile && <Profile userProfile={profile} setProfile={setShowingProfile} />}
    </div>
  )
}

export default Post;