import express from "express";
import userController from "../controllers/userController"

let router = express.Router();

let initApiRoutes = (app) => {

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);

    return app.use("/", router);
}

module.exports = initApiRoutes;