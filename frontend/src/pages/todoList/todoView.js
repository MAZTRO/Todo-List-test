import { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';
import FormUpdate from './form/formUpdate'
import { API } from '../../config'

import './todo.css'

let TodoView = (props) => {
  const cookies = new Cookies();
  const [titleTodo, setTitleTodo] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [userInfo, setUserInfo] = useState(false)
  const [msgError, setMsgError] = useState('')
  const [todoList, setTodoList] = useState([])
  const [edit, setEdit] = useState('') // id of each TODO

  let user = cookies.get('userSession')
  let token = cookies.get('jwt')

  useEffect(() => {
    if (user !== undefined) {
      document.title = "DrakeTech | todo-view"

      let conf = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-type': 'application/json',
          'auth-token': token
        },
      };

      fetch(`${API}/api/todo/todo-list`, conf)
        .then(res => res.json())
        .then(res => {

          if (res.error) {
            console.log("error");
          } else {
            setTodoList(res.list)
          }
        })
    }

    return () => {}
  }, [])

  if (user === undefined) {
    return (
      <Redirect to="/"/>
    )
  }

  let handleSubmit = (evt) => {
    evt.preventDefault()

    let conf = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ title: titleTodo }),
    };

    fetch(`${API}/api/todo/new-todo`, conf)
      .then(res => res.json())
      .then(res => {
        console.log(res);

        if (res.error) {
          console.log(res.error);
        } else {
          setTodoList([...todoList, res])
          setTitleTodo('')
        }
      })
  }

  let handleSubmitUpdate = (evt, idx) => {
    evt.preventDefault()

    let body = {
      title: editedTitle,
      done: todoList[idx].done,
      todoID: edit
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

    fetch(`${API}/api/todo/modify-todo`, conf)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setEdit('')
      })
  }
  let handleDeleteTodo = (idx, ID) => {
    const newTodos = [...todoList];

    newTodos.splice(idx, 1)

    let conf = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({todoID: ID}),
    };

    fetch(`${API}/api/todo/del-todo`, conf)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        setTodoList(newTodos)
      })
  }

  let handleDeleteAccount = (evt) => {
    evt.preventDefault()

    let conf = {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json',
        'auth-token': token
      },
    };

    fetch(`${API}/api/auth/user`, conf)
      .then(res => res.json())
      .then(res => {
        console.log(res);

        if (res.status.deletedCount === 0) {
          setMsgError("Oops! Something went wrong, it will soon be fixed")
        } else {
          setMsgError(":(")
        }
      })
  }

  let updateStatus = (evt, idx) => {
    const newTodos = [...todoList];

    if (evt.target.value === "false") {
      newTodos[idx].done = true
    } else {
      newTodos[idx].done = false
    }

    setTodoList(newTodos)

    if (edit === "") {

      let body = {
        done: newTodos[idx].done,
        todoID: evt.target.id
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

      fetch(`${API}/api/todo/modify-todo`, conf)
        .then(res => res.json())
        .then(res => {
          console.log(res);
        })
    }
  }

  let logOut = (evt) => {
    cookies.remove('userSession')
    cookies.remove('jwt')
    setUserInfo(!userInfo)
  }

  if (msgError === ':(') {
    return (
      <Redirect to="/"/>
    )
  }

  return (
    <div className="todoContainer">
      {
        userInfo &&
        <div className="userInfoCont">
          <div className="close" onClick={e => {setUserInfo(!userInfo)}}>X</div>
          <button className="logOut" onClick={e => {logOut(e)}}>Log out</button>
          <FormUpdate />
          <button className="delete" onClick={e => {handleDeleteAccount(e)}}>Delete account</button>
          {
            <h3>{msgError}</h3>
          }
        </div>
      }
      <div className="container">
        <header>
          <h1>TODO LIST</h1>
          <button className="userInfoBtn" onClick={e => {setUserInfo(!userInfo)}}></button>
        </header>

        <div className="body">
          <form className="form" onSubmit={e => {handleSubmit(e)}}>
            <input
              type="text"
              className="userName"
              placeholder="Enter new To-Do"
              required
              value={titleTodo}
              onChange={e => {setTitleTodo(e.target.value)}}
            />
            <button type="submit"></button>
          </form>
          <div className="listCont">
            {
              todoList.map((ele, idx) => {
                return (
                  <div className="todoCont" key={idx} id={ele._id}>
                    {
                      edit === ele._id
                      ? <form className="form" onSubmit={e => {handleSubmitUpdate(e, idx)}}>
                          <input
                            type="text"
                            className="userName"
                            placeholder={ele.title}
                            required
                            value={editedTitle}
                            onChange={e => {setEditedTitle(e.target.value)}}
                          />
                          <button type="submit"></button>
                        </form>
                      : <h2>{ele.title}</h2>
                    }
                    <input type="checkbox" id={ele._id} value={ele.done} onClick={e => {updateStatus(e, idx)}}/>
                    {
                      edit === ele._id
                      ? <div className="edit" onClick={e => {setEdit('')}}>	&#10007;</div>
                      : <div className="edit" onClick={e => {setEdit(ele._id)}}>&#9998;</div>
                    }
                    <div className="delete" onClick={e => {handleDeleteTodo(idx, ele._id)}}>Delete</div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodoView
