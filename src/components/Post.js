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

import { DlgApagar } from './ConfirmDlg';
import { Comentario } from './Comentario';
import '../index';
import { Profile } from './Profile';
import nophoto from '../img/nophoto.png';

export function Post(props) {
  const likedClass = 'fa fa-heart-o material-icons f25';
  const notlikedClass = 'fa fa-heart material-icons f25';
  const post = props.post;
  const user = getAuth(app).currentUser;
  const [comentarios, setComentarios] = useState([]);
  const [dlgApagar, setDlgApagar] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [profile, setProfile] = useState(null);
  const [like, setLike] = useState(null);
  const [likes, setLikes] = useState([]);

  useEffect(() => {
    subscribeToComments(post.id, setComentarios);
    subscribeToLike(post.id, setLike);
    subscribeToLikes(post.id, setLikes);
    getUserProfile(post.user.id).then(p => setProfile(p));
  },[post, user]);

  async function newComment(id, e) {
    e.preventDefault?.();
    const comentario = document.getElementById(`comentario-post-${id}`);

    if (!comentario.value)
    {
      alert('Não pode ser vazio');
      return;
    }

    try {
      await addComment(id, comentario.value);
      comentario.value = '';
    } catch (error) {
      alert(error.message)
    }
  }

  async function apagarPost(e, id) {
    e.preventDefault();

    console.log('Apagando post ' + id);
    try {
      await deletePost(id);
      setDlgApagar(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  function fecharDlg(e) {
    e.preventDefault();
    setDlgApagar(null);
  }

  function confirmDeletePost(e) {
    e.preventDefault();
    setDlgApagar(apagarPostDlg);
  }

  const apagarPostDlg = {
    msg: "Essa operação não pode ser desfeita, continuar?",
    titulo: "Apagar a postagem",
    sim: e => apagarPost(e, post.id),
    nao: e => fecharDlg(e),
    style: {display: 'block'}
  }

  async function showProfile(e, uid) {
    e.preventDefault();

    try {
      const profile = await getUserProfile(uid);
      setPerfil(profile);
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
    <div className="publicacao" id={post.id}>
      <div className='postHeader'>
        <img className='postPerfilPhoto' src={profile?.photoURL || nophoto} alt=""></img>
        <p><span className='user-name' onClick={e => showProfile(e, post.user.id)}> {post.user.name}</span> - {post.when()}</p>
        <button className={`btnExcluirPost ${hidden} material-icons light`} onClick={e => confirmDeletePost(e)}>delete</button>
      </div>
      <div className='photo'>
        <img src={post.image.url} alt="" onDoubleClick={e => toggleLike(e, post.id)}/>
        <span className={'material-icons photoLike ' + (like ? 'like-o' : '')} onDoubleClick={e => toggleLike(e, post.id)}>favorite</span>
      </div>
      <p className='postado-por'><span id={`heart${post.id}`} className='div-like'>
        <b onClick={e => toggleLike(e, post.id)} className={like ? likedClass : notlikedClass} >
          favorite
        </b><span className='postLikes'>{getLikes()}</span>
      </span>
      </p>
      <p className='publicacao-descr'>{post.description}</p>
      <div className='comments'>
        {
          comentarios.map(comment => <Comentario key={comment.id} comment={comment} postId={post.id}/>)
        }
      </div>
      <form className='form-comentario' id={`comentario-form-${post.id}`} onSubmit={e => newComment(post.id, e)}>
        <textarea id={`comentario-post-${post.id}`} placeholder="Adicione um comentário..." ></textarea>
        <input type="submit" value="Publicar" />
      </form>
      <DlgApagar {...dlgApagar} />
      {perfil && <Profile user={perfil} setPerfil={setPerfil} />}
    </div>
  )
}