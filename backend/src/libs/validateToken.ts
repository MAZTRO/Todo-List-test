import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface IPayload {
  _id: string;
  iat: string;
  exp: string;
}

export const ValidateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('auth-token')
  if (!token) {
    return (
      res.status(403).json({'error': 'Access denied'})
    )
  }

  const payload = jwt.verify(token, process.env.TOKEN_SECRET_KEY || 'tokenTest') as IPayload
  req.userID = payload._id

  next()
}

