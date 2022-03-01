function Logo(props) {
  return (
    <div className="headerLogo">
      <div className="headerLogoImg" onClick={() => window.location.href = '/'}></div>
    </div>
  )
}

export default Logo;