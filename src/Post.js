import { useState, useEffect } from 'react'
import { storage, db, auth } from './firebase';
import { DlgApagar } from './ConfirmDlg';
import { Comentario } from './Comentario';
import { CommentModel, UserModel } from './modelos';
import './index';

export function Post(props) {
  const post = props.post;
  const [comentarios, setComentarios] = useState([]);
  const [dlgApagar, setDlgApagar] = useState(null);

  useEffect(() => {
    db.collection('posts')
      .doc(post.id)
      .collection('comentarios')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snap => {
        const docs = snap.docs;
        setComentarios(docs.map(doc => CommentModel.fromComment(doc.id, post.id, doc.data())))
      })

  },[post]);

  function comentar(id, e) {
    e.preventDefault();
    const comentario = document.getElementById(`comentario-post-${id}`);

    if (!comentario.value)
    {
      alert('Não pode ser vazio');
      return;
    }

    db.collection('posts')
      .doc(id)
      .collection('comentarios')
      .add(new CommentModel(null, UserModel.fromAuth(), comentario.value).toSave())
      .then(_ => { comentario.value = ''; })
      .catch(err => alert(err.message));
  }

  function apagarArquivo(id) {
    console.log('Apagando o arquivo ' + id);
    return storage.ref('images').child(id).delete()
      .then(console.log(`Arquivo ${id} apagado.`))
  }

  function apagarPost(e, id) {
    e.preventDefault();
    const doc = db.collection("posts").doc(id);
    console.log('Apagando post ' + id);
    let imgId;

    doc.get()
      .then(snap => {
        const doc = snap.data();
        imgId = doc.image.id;
      })
      .then(_ => {
        console.log('Apagando o post ' + id);
        doc.delete()
          .then(_ => apagarArquivo(imgId))
          .catch(err => alert(err.message))
      })

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

  const hidden = auth.currentUser.uid !== post.user.id
    ? 'hidden'
    : '';

  return (
    <div className="publicacao" id={post.id}>
      <img src={post.image.url} alt=""/>
      <p>Postado por: <strong>{post.user.name}</strong> - {post.when()}
        <button className={`btn-excluir-post ${hidden}`} onClick={e => confirmarApagarPost(e)}>Excluir</button>
      </p>
      <p className='publicacao-descr'>{post.description}</p>
      <div className='comments'>
        <p className='liner'>Comentários</p>
        {
          comentarios.map(comment => <Comentario key={comment.id} comment={comment} postId={post.id}/>)
        }
      </div>
      <button class="comment-toggle material-icons light" onClick={e => mostrarComentario(e)}>insert_comment</button>
      <form className='form-comentario hidden' id={`comentario-form-${post.id}`} onSubmit={e => comentar(post.id, e)}>
        <textarea id={`comentario-post-${post.id}`} placeholder="Digite um comentário..." ></textarea>
        <input type="submit" value="Comentar" />
      </form>
      <DlgApagar {...dlgApagar} />
    </div>
  )
}