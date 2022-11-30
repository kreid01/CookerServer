import express from 'express'
import 'dotenv/config'
import { usersController} from './controllers/users'
import { authController } from './controllers/auth'
import  bodyParser from 'body-parser'
import cors from 'cors'
import cookieParser from 'cookie-parser'


const app = express()

app.use(cookieParser());
app.use(
    cors({
    origin: "http://localhost:3000",
    credentials: true,
    })
);
app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", usersController)
app.use("/auth", authController)

app.listen("4000", () => {
    console.log("server started")
})

