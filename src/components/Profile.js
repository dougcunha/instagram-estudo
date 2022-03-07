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

  async function saveChanges(e) {
    e.preventDefault();

    if (resizer)
      resizer.result('blob').then(blob =>  {
        sendFile(
          blob,
          null,
          (url, _) => {
            setFile(null);
            profile.photoURL = url;
            updProfile(getAuth(app).currentUser, profile)
              .then(_ => close())
              .catch(error => {
                alert(error.message);
                console.error(error);
              });
          },
          error => {
            alert(error.message);
            console.error(error);
          },
          'profiles',
          profile.uid
        )
      });
    else
    try {
      await updProfile(getAuth(app).currentUser, profile);
      close();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
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
        <div className='profile-info'>
          <Item setValue={v => profile.email = v} id='txt-email' profile={profile} value={profile.email} label='Email:' type='email' readOnly={true}/>
          <Item setValue={v => profile.displayName = v} id='txt-username' profile={profile} value={profile.displayName} label='User:'/>
          <Item setValue={v => profile.phoneNumber = v} id='txt-phone' profile={profile} value={profile.phoneNumber} label='Tel:' type='tel'/>
          <b className='txt-profile-sep'></b>
          <p>Desde {createdAt}</p>
          <p>Ultimo login: {lastLoginAt}</p>
        </div>
        <button className="btn" onClick={e => close(e)}>Fechar</button>
        {(file || canEdit) && <button className="btn" onClick={e => saveChanges(e)}>Salvar</button>}
      </div>
    </div>
  );
}

function Item(props) {
  const setValue = props.setValue;
  const profile = props.profile;
  const id = props.id;
  const value = props.value;
  const type = props.type ?? 'text';
  const label = props.label;
  const uid = getAuth(app).currentUser.uid;
  const readOnly = props.readOnly || uid !== profile.uid;
  const [canEdit, setCanEdit] = useState(props.canEdit && !props.readOnly);

  function changed(e) {
    setValue(e.target.value);
  }

  function edit(e) {
    setCanEdit(true);
  }

  return (
    <div className='profile-item'>
      <label htmlFor={id}>{label}</label>
      {!canEdit && <span id={`txt-${id}`}>{value}</span>}
      {canEdit && <input type={type} id={id} name={id} placeholder={value} onChange={e => changed(e)}/>}
      {!readOnly && !canEdit && <i className='btn-edit material-icons-outlined' onClick={e => edit(e)}>edit</i>}
    </div>
  );
}