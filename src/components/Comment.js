import { DlgConfirmDelete } from './ConfirmDlg';
import { useState } from 'react'
import { deleteComment, getUserProfile } from '../data/db';
import { app, getAuth } from '../firebase';
import { Profile } from './Profile';

export function Comment(props) {
  const comment = props.comment;
  const [dlgDelete, setDlgDelete] = useState(null);
  const [profile, setProfile] = useState(null);

  function confirmDeleteComment(e, id) {
    e.preventDefault();
    console.log('Vai apagar o comentário ' + id);
    setDlgDelete(deleteCommentDlg);
  }

  async function removeComment(e) {
    e.preventDefault();
    console.log('Apagando o comentário ' + comment.id);

    try {
      await deleteComment(comment.postId, comment.id);
      console.log('Comentário apagado ' + comment.id);
    } catch (error) {
      alert(error.message)
    }

    setDlgDelete(null);
  }

  function closeDialog(e) {
    e.preventDefault();
    setDlgDelete(null);
  }

  const deleteCommentDlg = {
    msg: "Essa operação não pode ser desfeita, continuar?",
    title: "Apagar o comentário?",
    confirm: e => removeComment(e),
    cancel: e => closeDialog(e),
    style: {display: 'block'}
  }

  async function showProfile(e, uid) {
    e.preventDefault();

    try {
      const profile = await getUserProfile(uid);
      setProfile(profile);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  }

  const hidden = getAuth(app).currentUser.uid !== comment.user.id;

  return (
    <div className='comment' id={comment.id}>
      <span className='comment-user-name user-name' onClick={e => showProfile(e, comment.user.id)}>{comment.user.name}</span>
      <span className='comment-message'>disse: {comment.message}</span>
      <span className='comment-when'> - {comment.when()}</span>
      {!hidden && <button className='btn-delete-comment' onClick={e => confirmDeleteComment(e, comment.id)}>Apagar</button>}
      <DlgConfirmDelete {...dlgDelete} />
      {profile && <Profile userProfile={profile} setProfile={setProfile} />}
    </div>
  )
}