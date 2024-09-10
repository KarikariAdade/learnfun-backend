import * as dotenv from 'dotenv'
import app from "./server";

dotenv.config()

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})