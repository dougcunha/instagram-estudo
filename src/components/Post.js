import { useState, useEffect } from 'react'
import { app, getAuth } from '../firebase';

import {
  getRealTimeComments,
  addComment,
  deletePost,
  getUserProfile
} from '../data/dados';

import { DlgApagar } from './ConfirmDlg';
import { Comentario } from './Comentario';
import '../index';
import { Profile } from './Profile';

export function Post(props) {
  const post = props.post;
  const [comentarios, setComentarios] = useState([]);
  const [dlgApagar, setDlgApagar] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
   getRealTimeComments(post.id, setComentarios);
  },[post]);

  async function comentar(id, e) {
    e.preventDefault();
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
    await deletePost(id);
    setDlgApagar(null);
  }

  function fecharDlg(e) {
    e.preventDefault();
    setDlgApagar(null);
  }

  function confirmarApagarPost(e) {
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

  function mostrarComentario(e) {
    const form = document.getElementById(`comentario-form-${post.id}`);

    if (form.classList.contains('hidden'))
      form.classList.remove('hidden');
    else
      form.classList.add('hidden');
  }

  async function verPerfil(e, uid) {
    e.preventDefault();

    try {
      const profile = await getUserProfile(uid);
      setPerfil(profile);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  }

  const hidden = getAuth(app).currentUser.uid !== post.user.id
    ? 'hidden'
    : '';

  return (
    <div className="publicacao" id={post.id}>
      <img src={post.image.url} alt=""/>
      <p>Postado por: <span className='user-name' onClick={e => verPerfil(e, post.user.id)}>{post.user.name}</span> - {post.when()}
        <button className={`btn-excluir-post ${hidden}`} onClick={e => confirmarApagarPost(e)}>Excluir</button>
      </p>
      <p className='publicacao-descr'>{post.description}</p>
      <div className='comments'>
        <p className='liner'>Comentários</p>
        {
          comentarios.map(comment => <Comentario key={comment.id} comment={comment} postId={post.id}/>)
        }
      </div>
      <button className="comment-toggle material-icons light" onClick={e => mostrarComentario(e)}>insert_comment</button>
      <form className='form-comentario hidden' id={`comentario-form-${post.id}`} onSubmit={e => comentar(post.id, e)}>
        <textarea id={`comentario-post-${post.id}`} placeholder="Digite um comentário..." ></textarea>
        <input type="submit" value="Comentar" />
      </form>
      <DlgApagar {...dlgApagar} />
      {perfil && <Profile user={perfil} setPerfil={setPerfil} />}
    </div>
  )
}