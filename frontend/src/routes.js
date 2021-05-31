import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/login/Login'
import TodoView from './pages/todoList/todoView'

let Routes = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route exact path="/todo-view" component={TodoView}/>
      </Switch>
    </BrowserRouter>
  )
}

export default Routes