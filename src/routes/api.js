import express from "express";
import userController from "../controllers/userController"

let router = express.Router();

let initApiRoutes = (app) => {

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/update-user', userController.handleUpdateAUser);
    router.delete('/api/delete-user', userController.handleDeleteAUser);

    return app.use("/", router);
}

module.exports = initApiRoutes;