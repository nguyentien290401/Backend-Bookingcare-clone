import express from "express";
import userController from "../controllers/userController"

let router = express.Router();

let initApiRoutes = (app) => {

    router.post('/api/login', userController.handleLogin)

    return app.use("/", router);
}

module.exports = initApiRoutes;