import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import contactRoutes from "./routes/contactRoutes";
import {config} from 'dotenv';


config();


const app = express();
app.use(cors());
app.use(bodyParser.json());


app.use("/api/v1/", contactRoutes);

app.use("/", (req, res)=>{
    res.send("Server is live now!!!");
})

export default app;
