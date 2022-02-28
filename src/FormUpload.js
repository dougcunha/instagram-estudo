import { useState, useEffect } from 'react'
import { storage, db, auth } from './firebase';
import { UserModel, ImageModel, PostModel } from './modelos'

export function FormUpload(props) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {

  }, []);

  function atualizarProgresso(snap) {
    const progress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
    console.log(`progresso: ${progress}`)
    setProgress(progress);
  }

  function uuidv4() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      // eslint-disable-next-line
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  function enviarArquivo(file, onsuccess) {
    const tipo = file.name.split('.').pop();
    const id = `${uuidv4()}.${tipo}`;
    return storage
      .ref(`images/${id}`)
      .put(file)
      .on("stage_changed",
        snap => atualizarProgresso(snap),
        err => alert(err.message),
        _ => onsuccess(id)
      );
  }

  function salvarPost(imgId) {
    const descricao = document.getElementById('descricao-post').value;
    storage
      .ref('images')
      .child(imgId)
      .getDownloadURL()
      .then(url => {
        db.collection('posts')
          .add(new PostModel(
            null,
            descricao,
            new ImageModel(imgId, url),
            UserModel.fromAuth()
          ).toSave())
      });

    setProgress(0);
    setFile(null);
    fecharDlg();
  }

  function enviarPost(e) {
    e.preventDefault();

    enviarArquivo(file, salvarPost);
  }

  function fecharDlg(e) {
    e?.preventDefault();
    props.setNovoPost(false);
  }

  return  (
      <div className="modalUpload" style={{display: props.novoPost ? 'block' : 'none'}}>
        <div className="formUpload">
          <progress className={progress ? '' : 'oculto'} id="progress-upload" value={progress} max="100"/>
          <span className="fechar" onClick={e => fecharDlg(e)}>X</span>
          <h2>Criar nova publicação</h2>
          <form id="form-upload" onSubmit={e => enviarPost(e)}>
              <UploadBox {...props} setFile={setFile}></UploadBox>
              <textarea id="descricao-post" type="text" placeholder="Descrição"/>
              <input type="submit" value="Publicar" disabled={file ? false : true}/>
          </form>
        </div>
      </div>
  )
}

function UploadBox(props) {
  const setFile = props.setFile;

  function showFiles(e)	{
    const file = e.target.files[0];
    setFile(file);
    const inputBox = e.target.parentElement;
    const uploadBox = inputBox.parentElement;
    readURL(file);
    inputBox.classList.add('oculto');
    uploadBox.classList.add('preview');
	}

  function readURL(file) {
    if (!file)
      return;

    var reader = new FileReader();

    reader.onload = function (e) {
      const img = document.getElementById('upload-box-preview-img');
      img.src = e.target.result;
    }

    reader.readAsDataURL(file);
  }

  function selecionarArquivo(e) {
    const file = document.getElementById('file');
    file.click();
  }

  return (
    <div className="upload-box" id="upload-box">
      <div className="upload-box-preview">
        <img id="upload-box-preview-img" src="#" alt="" onClick={e => selecionarArquivo(e)} />
      </div>
      <div className="upload-box-input">
        <svg className="upload-box-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
          <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" />
        </svg>
        <input type="file" onChange={e => showFiles(e)} className="upload-box-file" id="file" />
        <label htmlFor="file"><strong>Escolha uma imagem</strong> ou arraste aqui.</label>
      </div>
      <div className="upload-box-uploading">Enviando...</div>
      <div className="upload-box-success">Pronto!</div>
      <div className="upload-box-error">Erro!</div>
    </div>
  )
}