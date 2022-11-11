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


app.get('/', (req, res)=>{
    res.send("APP IS RUNNING")
})

route(app)

db.connect()

app.listen(port, () => {console.log(`RESTFUL API server started on ${port}`);});