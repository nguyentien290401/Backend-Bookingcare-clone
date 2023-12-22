import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
require('dotenv').config();

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


viewEngine(app);
initWebRoutes(app);


let port = process.env.PORT || 1303;
let hostname = process.env.HOST_NAME;

app.listen(port, hostname, () => {
    // callback
    console.log("Backend NodeJS is running on the port: " + port);
});
