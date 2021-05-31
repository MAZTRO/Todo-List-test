import { Router } from 'express'
const router: Router = Router()

import { ValidateToken } from '../libs/validateToken'

import { getAll, addOne, updateTodo, deleteTodo } from '../components/todo-list/controllers/todo.controller'
import { signup, signin, profile, updateOne, deleteOne } from '../components/auth/controllers/auth.controller'

router.post('/auth/signin', signin)
router.post('/auth/signup', signup)
router.get('/auth/user', ValidateToken,  profile)
router.patch('/auth/user', ValidateToken,  updateOne)
router.delete('/auth/user', ValidateToken,  deleteOne)

router.get('/todo/todo-list', ValidateToken, getAll)
router.post('/todo/new-todo', ValidateToken, addOne)
router.patch('/todo/modify-todo', ValidateToken,  updateTodo)
router.delete('/todo/del-todo', ValidateToken,  deleteTodo)

export default router
