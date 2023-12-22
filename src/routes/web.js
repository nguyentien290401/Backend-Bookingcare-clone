import express from "express";
import { getHomePage, getAboutPage } from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send("Hello world with first Comment using EJS");
    });

    router.get('/keqing', (req, res) => {
        return res.send("Hello world with Keqing Infomation");
    });

    router.get('/get-home', getHomePage);
    router.get('/about', getAboutPage);

    return app.use("/", router);
}

module.exports = initWebRoutes;
