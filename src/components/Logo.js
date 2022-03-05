import logo from '../img/instagrado.png';

function Logo(props) {
  return (
    <div className="headerLogo">
      <div className="headerLogoImg" onClick={() => window.location.href = '/'}>
        <img src={logo} alt=""/>
      </div>
    </div>
  )
}

export default Logo;