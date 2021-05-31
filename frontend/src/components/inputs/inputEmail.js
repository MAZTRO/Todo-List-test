/*
  Props:
  - ClassName: To identify the element
  - Type: to assign the input type
  - ID: To identify the element
  - Placeholder: to place default text
  - WrongText: to set incorrect message
*/

import { useState } from "react"

let warning = false

let InputMail = (props) => {
  const { email: [mail, setMail] } = { email: useState(''), ...(props.state || {}) }

  let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!regex.test(mail) && mail.length > 0) {
    warning = true
  } else {
    warning = false
  }

  return (
    <div className={"inputContainer " + props.className}>
      <input className={props.className} required type={props.type} id={props.id} placeholder={props.placeholder || "Fill this field"} value={mail} onChange={e => {setMail(e.target.value)}}/>
      {
        warning &&
        <p className={`warning`}>{props.wrongText || "* Wrong text, most be: name@company.type"}</p>
      }
    </div>
  )
}

export default InputMail