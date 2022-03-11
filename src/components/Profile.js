import { getAuth } from 'firebase/auth';
import { useRef, useState } from 'react';
import { sendFile, updProfile } from '../data/db';
import { app } from '../firebase';
import nophoto from '../img/nophoto.png';
import { toFormattedDate } from '../models';
import CircularProgress from './CircularProgress';
import { CropImage } from './CropImage';

export function Profile(props) {
  const [url, setUrl] = useState(null);
  const [sending, setSending] = useState(false);
  const [changed, setChanged] = useState(false);
  const profile = props.userProfile;
  const show = props.show;

  if (!profile || !show)
    return null;

  const canEdit = profile.uid === getAuth(app).currentUser.uid;
  const createdAt = toFormattedDate(profile.createdAt);
  const lastLoginAt = toFormattedDate(profile.lastLoginAt);

  function close(e) {
    e?.preventDefault();
    setUrl(null);
    setSending(false);
    setChanged(false);
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
    readURL(file);
	}

  function readURL(file) {
    if (!file)
      return;

    var reader = new FileReader();

    reader.onload = function (e) {
      setUrl(e.target.result);
    }

    reader.readAsDataURL(file);
  }

  async function saveProfile(blob) {
    setSending(true);
    if (blob) {
      sendFile(
        blob,
        null,
        (photoURL, _) => {
          profile.photoURL = photoURL;
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
    }
    else
      try {
        await updProfile(getAuth(app).currentUser, profile);
        close();
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
  }
  const btnSaveId = 'btn-save';

  return (
    show && <div className="modal">
      <div className="profile dialog">
        {sending && <CircularProgress indeterminate={true} colour={'red'} />}
        <input type="file" accept="image/*" onChange={e => showFile(e)} className="upload-box-file" id="file" />
        {!sending && <div className='profile-photo' id='profile-photo'>
          {canEdit && <span className='profile-edit-photo' onClick={e => editPhoto(e)}>Alterar</span>}
          {!url && <img id='profile-img' src={profile.photoURL || nophoto} alt=""/>}
          <CropImage
            src={url}
            setResult={saveProfile}
            resultType='blob'
            type='circle'
            btnResultId={btnSaveId}
          />
        </div>}
        <div className='profile-info'>
          <Item
            id='txt-email'
            profile={profile}
            changed={setChanged}
            value={profile.email}
            label='Email:'
            type='email'
            readOnly={true}
          />
          <Item
            id='txt-username'
            profile={profile}
            changed={setChanged}
            value={profile.displayName}
            setValue={v => profile.displayName = v}
            label='User:'
            readOnly={!canEdit}
          />
          <Item
            id='txt-phone'
            profile={profile}
            changed={setChanged}
            value={profile.phoneNumber}
            setValue={v => profile.phoneNumber = v}
            label='Tel:'
            type='tel'
            readOnly={!canEdit}
          />
          <b className='txt-profile-sep'></b>
          <p>Desde {createdAt}</p>
          <p>Ultimo login: {lastLoginAt}</p>
        </div>
        <div className='btns-profile'>
          <button className="btn btn-close" onClick={e => close(e)}>Fechar</button>
          {(url || changed) &&
            <button className="btn btn-save" onClick={_ => saveProfile(null)} id={btnSaveId}>Salvar</button>}
        </div>
      </div>
    </div>
  );
}

function Item({id, type='text', changed, value, setValue, label, readOnly}) {
  const [canEdit, setCanEdit] = useState(false);
  const [vl, setVl] = useState(value);
  const inputRef = useRef();

  function edit(e) {
    setCanEdit(true);
    inputRef.current.focus();
  }

  function onChange(e) {
    setVl(e.target.value);
    setValue(e.target.value);
    changed(true);
  }

  return (
    <div className='profile-item'>
      <label htmlFor={id}>{label}</label>
      <input type={type} id={id} name={id} ref={inputRef} value={vl} onChange={onChange} readOnly={!canEdit} />
      {!readOnly && !canEdit && <i className='btn-edit material-icons-outlined' onClick={e => edit(e)}>edit</i>}
    </div>
  );
}