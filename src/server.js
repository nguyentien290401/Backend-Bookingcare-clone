import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api"
import connectDB from "./config/connectDB";
import cors from 'cors';
require('dotenv').config();

let app = express();
app.use(cors({ credentials: true, origin: true }));

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



viewEngine(app);
initWebRoutes(app);
initApiRoutes(app);

connectDB();


let port = process.env.PORT || 1303;
let hostname = process.env.HOST_NAME;

app.listen(port, hostname, () => {
    // callback
    console.log("Backend NodeJS is running on the port: " + port);
});
