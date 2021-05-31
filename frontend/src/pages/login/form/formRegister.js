import { useState } from 'react'
import InputEmail from '../../../components/inputs/inputEmail'
import { API } from '../../../config'

import './form.css'

let Form = (props) => {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [loanding, setLoanding] = useState(false)
  const [error, setError] = useState(false)
  const [msgError, setMsgError] = useState('')

  let handleSubmit = (evt) => {
    evt.preventDefault()

    setLoanding(true)

    let body = {
      password: password,
      email: email,
      username: name
    }

    let conf = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(body),
    };

    fetch(`${API}/api/auth/signup`, conf)
      .then(res => res.json())
      .then(res => {
        setLoanding(false)

        if (res.error) {
          setMsgError("This email already exists")
        } else if (res._id) {
          setMsgError("Great now you can log in")
        } else {
          setMsgError("Oops! Something went wrong, it will soon be fixed")
        }

        setError(true)
      })
  }

  return (
    <div className="formContainer">
      {
        !loanding
        ? !error
          ? <form className="form" onSubmit={e => {handleSubmit(e)}}>
              <input
                type="text"
                className="userName"
                placeholder="User Name"
                required
                value={name}
                onChange={e => {setName(e.target.value)}}
              />
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
              <button className="btnSubmit" type="submit">Register</button>
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
