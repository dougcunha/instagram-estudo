import { useState } from "react";

export function FormUpload(props) {
  const [progress, setProgress] = useState(0);
  function novoPost(e) {
    e.preventDefault();

  }

  function fechar(e) {
    e.preventDefault();
    props.setConteudo(false);
  }

  return props.conteudo
    ? (
      <div className="modalUpload">
        <div className="formUpload">
          <span className="fechar" onClick={e => fechar(e)}>X</span>
          <h2>Nova postagem</h2>
          <form onSubmit={e => novoPost(e)}>
              <progress value={progress}></progress>
              <input id="descricao-post" type="text" placeholder="Descrição" />
              <input id="arquivo" type="file" name="arquivo" />
              <input type="submit" value="Publicar" />
          </form>
        </div>
      </div>
    )
    : null
}