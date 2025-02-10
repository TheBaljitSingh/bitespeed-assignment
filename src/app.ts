import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {config} from 'dotenv';

import identyRoute from "./routes/identifyRoute";


config();


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("/api/v1/", identyRoute);

app.use("/", (req, res)=>{
    res.send("Server is live now!!!");
})

export default app;
