import express, {Request, Response} from "express";
import commonRouter from "./common/routes/common.route";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";

const app = express();

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(passport.initialize())

app.use(express.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api', commonRouter)

export default app