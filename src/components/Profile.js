import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { sendFile, updProfile } from '../data/db';
import { app } from '../firebase';
import nophoto from '../img/nophoto.png';
import { toFormattedDate } from '../models';
import Croppie from 'croppie'
import 'croppie/croppie.css';

export function Profile(props) {
  const profile = props.userProfile;
  const canEdit = profile.uid === getAuth(app).currentUser.uid;
  const createdAt = toFormattedDate(profile.createdAt);
  const lastLoginAt = toFormattedDate(profile.lastLoginAt);
  const [resizer, setResizer] = useState(null);
  const [file, setFile] = useState(null);

  function close(e) {
    e?.preventDefault();

    props.setProfile(null);
  }

  function editPhoto(e) {
    e.preventDefault();
    e.target.style.display = 'none';
    const file = document.getElementById('file');
    file.click();
  }

  function showFile(e)	{
    const file = e.target.files[0];
    setFile(file);
    readURL(file);
	}

  function readURL(file) {
    if (!file)
      return;

    var reader = new FileReader();

    reader.onload = function (e) {
      configureImg(e.target.result);
    }

    reader.readAsDataURL(file);
  }

  function saveChanges(e) {
    e.preventDefault();

    resizer?.result('blob').then(blob =>  {
      sendFile(
        blob,
        null,
        (url, _) => {
          setFile(null);
          profile.photoURL = url;
          updProfile(getAuth(app).currentUser, profile)
          close();
        },
        error => alert(error.message),
        'profiles',
        profile.uid
      )
    });
  }

  function configureImg(url) {
    const el = document.getElementById('profile-img');
    el.src = url;
    const resize = new Croppie(el, {
        enableExif: true,
        viewport: { width: 300, height: 300, type: 'circle' },
        boundary: { width: 300, height: 300 },
        enableResize: true,
        enforceBoundary: false,
        minZoom: 0
    });
    resize.bind({
        url: url,
    });
    setResizer(resize);
  }

  return (
    <div className="modal">
      <div className="profile dialog">
        <input type="file" accept="image/*" onChange={e => showFile(e)} className="upload-box-file" id="file" />
        <div className='profile-photo' id='profile-photo'>
          {canEdit && <span className='profile-edit-photo' onClick={e => editPhoto(e)}>Alterar</span>}
          <img id='profile-img' src={profile.photoURL || nophoto} alt=""/>
        </div>
        <h3>{profile.displayName}</h3>
        <p>{profile.email}</p>
        <p>Tel: {profile.phoneNumber || 'não informado'}</p>
        <p>Desde {createdAt}</p>
        <p>Ultimo login: {lastLoginAt}</p>
        <button className="btn" onClick={e => close(e)}>Fechar</button>
        {file && <button className="btn" onClick={e => saveChanges(e)}>Salvar</button>}
      </div>
    </div>
  );
}