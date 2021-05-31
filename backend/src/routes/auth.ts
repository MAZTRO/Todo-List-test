import { Router } from 'express'
const router: Router = Router()

import { ValidateToken } from '../libs/validateToken'

import { signup, signin, profile, updateOne, deleteOne, logOut } from '../components/auth/controllers/auth.controller'

router.post('/signin', signin)
router.post('/signup', signup)
router.get('/logout', logOut)
router.get('/user', ValidateToken,  profile)
router.patch('/user', ValidateToken,  updateOne)
router.delete('/user', ValidateToken,  deleteOne)

export default router
