import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState, useEffect } from 'react'
import { ConfirmDlg } from './ConfirmDlg';
import { storage, db } from './firebase';

export function Post(props) {
  const id = props.id;
  const post = props.post;
  const data = formatDistanceToNow(post.timestamp?.toDate() || Date.now(), { locale: ptBR, addSuffix: true, includeSeconds: true });
  const [apagando, setApagando] = useState(false);
  function comentar(id, e) {
    e.preventDefault();

  }

  function apagarArquivo(id) {
    console.log('Apagando o arquivo ' + id);
    return storage.ref('images').child(id).delete()
      .then(console.log(`Arquivo ${id} apagado.`))
  }

  function apagarPost(e, id) {
    e.preventDefault();
    const doc = db.collection("posts").doc(id);
    console.log(JSON.stringify(doc.get()));
    let imgId;

    doc.get()
      .then(snap => {
        const doc = snap.data();
        console.log(JSON.stringify(doc));
        imgId = doc.image.id;
      })
      .then(_ => {
        console.log('Apagando o post ' + id);
        doc.delete()
          .then(_ => apagarArquivo(imgId));
      })

    setApagando(false);
  }

  function fecharDlg(e) {
    e.preventDefault();
    setApagando(false);
  }

  function confirmar(e) {
    e.preventDefault();
    setApagando(true);
  }

  return (
    <div className="publicacao" id={id}>
      <img src={post.image.url} alt=""/>
      <p>Postado por: <strong>{post.userName}</strong> - {data}<button className='btn-excluir-post' onClick={e => confirmar(e)}>Excluir</button></p>
      <p>{post.descricao}</p>
      <form onSubmit={e => comentar(id, e)}>
        <textarea id={`comentario-post-${id}`} placeholder="Digite um comentário..." ></textarea>
        <input type="submit" value="Comentar" />
      </form>
      <ConfirmDlg style={{display: apagando ? 'block' : 'none'}} msg="Apagar a postagem?" sim={e => apagarPost(e, id)} nao={e => fecharDlg(e)} />
    </div>
  )
}