import logo from '../img/instagrado.png';

function Logo(props) {
  return (
    <div className="header-logo">
      <div className="header-logo-img" onClick={() => window.location.href = '/'}>
        <img src={logo} alt=""/>
      </div>
    </div>
  )
}

export default Logo;