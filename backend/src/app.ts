import express, { Application } from 'express'
import AuthRoutes from './routes/auth'
import morgan from 'morgan'
import  cors from 'cors'


const app: Application = express()

// Settings

app.set('port', 8000)

// Middlewares

app.use(morgan('dev'))
app.use(express.json())
app.use(cors());

// Routes

app.use('/api', AuthRoutes)

export default app
