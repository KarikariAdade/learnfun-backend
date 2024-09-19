import express, {Request, Response} from "express";
import commonRouter from "./common/routes/common.route";

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

app.use('/api', commonRouter)

export default app