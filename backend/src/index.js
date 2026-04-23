import express from "express"
import {env} from "./config/env.js"
import { connectToDB } from "./config/db.js";
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser";
// imports of the routes
import userRoutes from "./features/users/user.route.js";
import authRouter from "./features/auth/auth.route.js";
import {authenticate, authorize} from "./middlewares/auth.MIddleware.js";
const app = express()

app.use(express.json())

app.use(cookieParser());
// CORS 
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true
}))
//  morgan
app.use(morgan('dev'))
// database call
connectToDB()


// health route
app.get('/api/health', (req, res)=>{
    res.status(200).json({
        status: 'success',
        message: 'Server is health'
    })
})

// others routes 
app.use('/api/users',authenticate, authorize('Admin'), userRoutes)
// auth api
app.use('/api/auth', authRouter)
// 404 route
app.use((req, res) => {
  res.status(404).json({
    status: "failed",
    message: `Route not found: ${req.originalUrl}`
  });
});
const PORT = env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})