import { Request, Response } from 'express'
import User, { IUser } from '../models/User'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

export const signup = async (req: Request, res: Response) => {

  // Saving new user
  const user: IUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
  user.password = await user.encryptPassword(user.password)

  try {
    const savedUser = await user.save()
    res.json(savedUser)
  } catch(err) {
    if (err.code === 11000) {
      res.status(400).json({'error': "Duplicated email"})
    }
  }
}

export const signin = async (req: Request, res: Response) => {

  // Check user data
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return (
      res.status(404).json({'error': "Worng email"})
    )
  }

  const correctPassword: boolean = await user.validatePassword(req.body.password)
  if (!correctPassword) {
    return (
      res.status(403).json({'error': "Invalid password"})
    )
  }

  // Sending response
  const token: string = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET_KEY || 'tokenTest', {
    expiresIn: 60 * 60 * 24
  })

  res.json({user, jwt: token})
}

export const profile = async (req: Request, res: Response) => {
  const user = await User.findById(req.userID, { password: 0 })
  if (!user) {
    return (
      res.status(404).json({'error': 'User not found'})
    )
  }
  res.json(user)
}

export const updateOne = async (req: Request, res: Response) => {
  let filter = {"_id": req.userID}
  let data = req.body

  // If a password key exists, it is encrypted
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  data.updatedAt = new Date();
  const updated = await User.updateOne(filter, data, { new: true })
  const user = await User.findOne(filter, {password: 0})

  res.json({status: updated, user})
}

export const deleteOne = async (req: Request, res: Response) => {
  let filter = {"_id": req.userID}

  try {
    const deleted = await User.deleteOne(filter)
    return (
      res.json({status: deleted})
    )
  } catch (err) {
    console.log(err);
    return (
      res.status(400).json({'error': err})
    )
  }
}
