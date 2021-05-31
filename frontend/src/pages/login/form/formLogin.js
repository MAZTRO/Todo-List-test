import { useState } from 'react'
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom';
import InputEmail from '../../../components/inputs/inputEmail'
import { API } from '../../../config'

import './form.css'

let Form = (props) => {
  const cookies = new Cookies();
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loanding, setLoanding] = useState(false)
  const [error, setError] = useState(false)
  const [msgError, setMsgError] = useState('')
  const [todoView, setTodoView] = useState(false)

  let handleSubmit = (evt) => {
    evt.preventDefault()

    setLoanding(true)

    let body = {
      password: password,
      email: email,
    }

    let conf = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    fetch(`${API}/api/auth/signin`, conf)
      .then(res => res.json())
      .then(res => {

        if (res.error) {
          setLoanding(false)

          if (res.error === "Worng email") {
            setMsgError("This email doesn't exists")
          } else if (res.error === "Invalid password") {
            setMsgError("Invalid password")
          }

          setError(true)
        } else if (res.user._id) {
          cookies.set('jwt', JSON.stringify(res.jwt), { path: '/', sameSite: true, secure: true });
          cookies.set('userSession', JSON.stringify(res.user), { path: '/', sameSite: true, secure: true });
          setTodoView(true)
        } else {
          setLoanding(false)
          setMsgError("Oops! Something went wrong, it will soon be fixed")
          setError(true)
        }
      })
  }

  if (todoView) {
    return (
      <Redirect to="/todo-view"/>
    )
  }

  return (
    <div className="formContainer">
      {
        !loanding
        ? !error
          ? <form className="form" onSubmit={e => {handleSubmit(e)}}>
              <InputEmail
                className="userEmail"
                type="email"
                wrongText="Wrong text"
                placeholder="Mail"
                state={{ email: [email, setEmail] }}
              />
              <input
                type="password"
                className="userPass"
                placeholder="Password"
                required
                value={password}
                onChange={e => {setPassword(e.target.value)}}
              />
              <button className="btnSubmit" type="submit">Login</button>
            </form>
          : <div className="errorMsg">
              <h2>{msgError}</h2>
              <button className="back" onClick={e => {setError(false)}}>Back</button>
            </div>
        : <div className="loanding"></div>
      }
    </div>
  )
}

export default Form
