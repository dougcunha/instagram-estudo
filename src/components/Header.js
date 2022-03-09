import Logo from './Logo';
import { app, getAuth } from '../firebase';
import { useState } from 'react'
import { Profile } from './Profile';
import nophoto from '../img/nophoto.png';

function LoggedIn(props) {
  const userProfile = props.userProfile;
  const [profile, setProfile] = useState(null);

  async function logoff(e) {
    e.preventDefault();
    await getAuth(app).signOut();
    props.setUser(null);
    window.location.href = "/";
  }

  function openNewPost(e) {
    e.preventDefault();

    props.setNewPost(true);
  }

  function showProfile(e) {
    e.preventDefault();
    const profile = userProfile;
    setProfile(profile);
  }

  return (
    <span className='logged'>
      <Profile userProfile={userProfile} show={profile ? true : false} setProfile={setProfile} />
      <span className='btn-new-post material-icons-outlined' onClick={e => openNewPost(e)}>add_box</span>
      <span className='btn-logout material-icons-outlined' onClick={e => logoff(e)}>logout</span>
      <img className='profile-photo-small right' onClick={e => showProfile(e)} src={userProfile?.photoURL || nophoto} alt=""></img>
    </span>
  )
}

function Header(props) {
    return (
      <div className="header">
        <Logo></Logo>
        {props.userProfile && <LoggedIn profile={props.userProfile} {...props}></LoggedIn>}
      </div>
    )
}

export default Header;