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

import { DlgConfirmDelete } from './ConfirmDlg';
import { Comment } from './Comment';
import '../index';
import { Profile } from './Profile';
import nophoto from '../img/nophoto.png';

export function Post(props) {
  const likedClass = 'fa fa-heart-o material-icons f25';
  const notLikedClass = 'fa fa-heart material-icons f25';
  const post = props.post;
  const user = getAuth(app).currentUser;
  const [comments, setComments] = useState([]);
  const [dlgDelete, setDlgDelete] = useState(null);
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
      alert('Não pode ser vazio');
      return;
    }

    try {
      await addComment(id, comment.value);
      comment.value = '';
    } catch (error) {
      alert(error.message)
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
      alert(error.message);
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
    msg: "Essa operação não pode ser desfeita, continuar?",
    title: "Apagar a postagem",
    confirm: e => removePost(e, post.id),
    cancel: e => closeDialog(e),
    style: {display: 'block'}
  }

  async function showProfile(e, uid) {
    e.preventDefault();

    try {
      const profile = await getUserProfile(uid);
      setProfile(profile);
      setShowingProfile(true);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  }

  const hidden = user.uid !== post.user.id
    ? 'hidden'
    : '';

  async function toggleLike(e, postId) {
    e.preventDefault();

    try {
      if (!like)
        await addLike(postId, user);
      else
        await deleteLike(like);
    } catch (error) {
      console.error(error);
      alert(error.message);
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

  return (
    <div className="post" id={post.id}>
      <div className='header-post'>
        <img className='profile-photo-small' src={profile?.photoURL || nophoto} alt=""></img>
        <p><span className='user-name' onClick={e => showProfile(e, post.user.id)}> {post.user.name}</span> - {post.when()}</p>
        {!hidden && <button className={`btn-delete-post material-icons light`} onClick={e => confirmDeletePost(e)}>delete</button>}
      </div>
      <div className='photo'>
        <img src={post.image.url} alt="" onDoubleClick={e => toggleLike(e, post.id)}/>
        <span className={'material-icons like-heart-post ' + (like ? 'like-o' : '')} onDoubleClick={e => toggleLike(e, post.id)}>favorite</span>
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
        <textarea id={`comment-${post.id}`} placeholder="Adicione um comentário..." ></textarea>
        <input type="submit" value="Publicar" />
      </form>
      <DlgConfirmDelete {...dlgDelete} />
      {showingProfile && <Profile profile={profile} setProfile={setProfile} />}
    </div>
  )
}