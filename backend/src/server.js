import express from "express";
import path from "path";
import * as dotenv from 'dotenv';
import { DateTime } from "luxon";

dotenv.config({path: './.env'})

const __dirname = path.resolve();
const app = express();
const port = process.env.PORT || 3000;

import route from "./routes/index.js";
import db from "./config/db/index.js";

app.use(express.static(path.join(__dirname, 'build')))

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

route(app)

db.connect()

app.listen(port, () => {console.log(`RESTFUL API server started on ${port}`);});