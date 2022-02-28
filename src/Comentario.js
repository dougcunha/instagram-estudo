import { DlgApagar } from './ConfirmDlg';
import { db, auth } from './firebase';
import { useState } from 'react'

export function Comentario(props) {
  const comment = props.comment;
  const [dlgApagar, setDlgApagar] = useState(null);

  function confirmarApagarComentario(e, id) {
    e.preventDefault();
    console.log('Vai apagar o comentário ' + id);
    setDlgApagar(apagarComentarioDlg);
  }

  function apagarComentario(e) {
    e.preventDefault();
    console.log('Apagando o comentário ' + comment.id);

    const doc = db
       .collection('posts')
       .doc(comment.postId)
       .collection('comentarios')
       .doc(comment.id);

    doc.delete()
      .then(_ => {
        console.log('Comentário apagado ' + comment.id);
      })
      .catch(err => alert(err.message));

    setDlgApagar(null);
  }

  function fecharDlg(e) {
    e.preventDefault();
    setDlgApagar(null);
  }

  const apagarComentarioDlg = {
    msg: "Essa operação não pode ser desfeita, continuar?",
    titulo: "Apagar o comentário?",
    sim: e => apagarComentario(e),
    nao: e => fecharDlg(e),
    style: {display: 'block'}
  }

  const hidden = auth.currentUser.uid !== comment.user.id
    ? 'hidden'
    : '';

  return (
    <div className='comment' id={comment.id}>
      <span className='comment-user'>{comment.user.name}</span>
      <span className='comment-msg'>disse: {comment.message}</span>
      <span className='comment-data'> - {comment.when()}</span>
      <button className={`comment-apagar ${hidden}`} onClick={e => confirmarApagarComentario(e, comment.id)}>Apagar</button>
      <DlgApagar {...dlgApagar} />
    </div>
  )
}