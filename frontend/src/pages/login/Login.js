import { useState, useEffect } from 'react'
import FormRegister from './form/formRegister'
import FormLogin from './form/formLogin'
import './login.css'

let Login = (props) => {
  const [login, setLogin] = useState(false)

  useEffect(() => {
    document.title = "DrakeTech | Auth"

    return () => {}
  }, [])

  return (
    <div className="loginContainer">
      <div className="container">
        {
          login
          ? <FormLogin />
          : <FormRegister />
        }
        <div className="options">
          <h2>{login ? "I don't have an account" : "I already have an account"}</h2>
          <button className="change" onClick={e => {setLogin(!login)}}>{login ? "Register" : "Login"}</button>
        </div>
      </div>
    </div>
  )
}

export default Login
