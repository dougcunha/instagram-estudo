import { useState } from 'react'
import { addPost } from '../data/db';
import { BtnEmoji } from './BtnEmoji';
import { BtnPublish } from './Controls';

export function FormUpload(props) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState(null);

  function sendPost(e) {
    e.preventDefault();
    const btn = e.target.querySelector('input[type=submit]');
    btn.disabled = true;
    const description = document.getElementById('post-description').value;

    addPost(
      file,
      description,
      setProgress,
      () => {
        setProgress(0);
        setFile(null);
        closeDlg();
      },
      error => alert(error.message)
    );
  }

  function closeDlg(e) {
    e?.preventDefault();
    props.setNovoPost(false);
  }

  return  (
      (props.novoPost) && <div className="modal-upload">
        <div className="form-upload">
          {progress > 0 && <progress id="progress-upload" value={progress} max="100"/>}
          <span className="close" onClick={e => closeDlg(e)}>X</span>
          <h2>Criar nova publicação</h2>
          <form id="form-upload" onSubmit={e => sendPost(e)}>
              <UploadBox {...props} setFile={setFile}></UploadBox>
              <div className='textarea-upload-description'>
                <BtnEmoji textareaId='post-description' />
                <textarea id="post-description" type="text" placeholder="Descrição"/>
                <BtnPublish disabled={file && !progress ? false : true}/>
              </div>
          </form>
        </div>
      </div>
  )
}

function UploadBox(props) {
  const setFile = props.setFile;

  function onFileChanged(e)	{
    const file = e.target.files[0];
    const inputBox = e.target.parentElement;
    showFile(file, inputBox);
	}

  function showFile(file, inputBox) {
    setFile(file);
    const uploadBox = inputBox.parentElement;
    readURL(file);
    inputBox.classList.add('hidden');
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

  function selectFile(e) {
    const file = document.getElementById('file');
    file.click();
  }

  function onDragOver(event) {
    event.preventDefault();
    event.target.parentElement.classList.add("active");
    document.querySelector('.upload-text').textContent  = "ou solte o arquivo para iniciar";
  };

  function onDragLeave(event) {
    event.target.parentElement.classList.remove("active");
    document.querySelector('.upload-text').textContent = "ou arraste uma foto aqui";
  };

  function onDrop(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    showFile(file, event.target);
  }

  return (
    <div className="upload-box" id="upload-box">
      <div className="upload-box-preview">
        <img id="upload-box-preview-img" src="#" alt="" onClick={e => selectFile(e)} />
      </div>
      <div className="upload-box-input" onDragOver={e => onDragOver(e)} onDragLeave={e => onDragLeave(e)} onDrop={e => onDrop(e)}>
        <svg className="upload-box-icon" xmlns="http://www.w3.org/2000/svg" width="50" height="43" viewBox="0 0 50 43">
          <path d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z" />
        </svg>
        <input type="file" accept="image/*" onChange={e => onFileChanged(e)} className="upload-box-file" id="file" />
        <label htmlFor="file"><strong>Clique para selecionar</strong></label>
        <p className="upload-text">ou arraste uma foto aqui</p>
      </div>
      <div className="upload-box-uploading">Enviando...</div>
      <div className="upload-box-success">Pronto!</div>
      <div className="upload-box-error">Erro!</div>
    </div>
  )
}