import express, { Application } from 'express'
import AuthRoutes from './routes/auth'
import morgan from 'morgan'


const app: Application = express()

// Settings

app.set('port', 6000)

// Middlewares

app.use(morgan('dev'))
app.use(express.json())

// Routes

app.use('/api/auth/', AuthRoutes)

export default app
