import { useEffect, useState } from 'react'
import InputEmail from '../../../components/inputs/inputEmail'
import { API } from '../../../config'
import Cookies from 'universal-cookie';

import './form.css'

let Form = (props) => {
  const cookies = new Cookies();
  const [nameU, setNameU] = useState('')
  const [passwordU, setPasswordU] = useState('')
  const [emailU, setEmailU] = useState('')
  const [loanding, setLoanding] = useState(false)
  const [error, setError] = useState(false)
  const [msgError, setMsgError] = useState('')

  let token = cookies.get('jwt')

  useEffect(() => {

    let conf = {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'auth-token': token
      },
    };

    fetch(`${API}/api/auth/user`, conf)
      .then(res => res.json())
      .then(res => {

        if (res.error) {
          setNameU('')
          setEmailU('')
          setPasswordU('')
        } else {
          setNameU(res.username)
          setEmailU(res.email)
        }
      })

    return () => {}
  }, [])

  let handleSubmit = (evt) => {
    evt.preventDefault()

    setLoanding(true)

    let body = {
      password: passwordU,
      email: emailU,
      username: nameU
    }

    let conf = {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify(body),
    };

    fetch(`${API}/api/auth/user`, conf)
      .then(res => res.json())
      .then(res => {

        setLoanding(false)

        if (res.status.nModified === 0) {
          setMsgError("Oops! Something went wrong, it will soon be fixed")
        } else {
          setMsgError("All updated")
        }

        setError(true)
      })
  }

  return (
    <div className="formContainerUpdate">
      <h2>Update your profile</h2>
      {
        !loanding
        ? !error
          ? <form className="form" onSubmit={e => {handleSubmit(e)}}>
              <input
                type="text"
                className="userName"
                placeholder="User Name"
                required
                value={nameU}
                onChange={e => {setNameU(e.target.value)}}
              />
              <InputEmail
                className="userEmail"
                type="email"
                wrongText="Wrong text"
                placeholder="Mail"
                state={{ email: [emailU, setEmailU] }}
              />
              <input
                type="password"
                className="userPass"
                placeholder="Password"
                required
                value={passwordU}
                onChange={e => {setPasswordU(e.target.value)}}
              />
              <button className="btnSubmit" type="submit">Update</button>
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
