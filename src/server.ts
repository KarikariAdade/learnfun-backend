import express, {Request, Response} from "express";
import commonRouter from "./common/routes/common.route";
import morgan from "morgan";
import cors from "cors";
import adminRoutes from "./admin/routes/admin.routes";
import passport from "./common/services/passport.service";
import studentRoute from "./student/routes/student.routes";

const app = express();

app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

app.use(passport.initialize())
app.use(express.json())

app.use(express.urlencoded({extended: true}))



app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api', commonRouter)
app.use('/api/admin', adminRoutes)
app.use('/api/student', studentRoute)

export default app