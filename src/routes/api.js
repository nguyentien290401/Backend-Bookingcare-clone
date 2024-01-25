import express from "express";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";

let router = express.Router();

let initApiRoutes = (app) => {

    router.post('/api/login', userController.handleLogin);
    router.get('/api/get-all-users', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/update-user', userController.handleUpdateAUser);
    router.delete('/api/delete-user', userController.handleDeleteAUser);

    router.get('/api/allcode', userController.getAllCode);


    router.get('/api/top-doctor', doctorController.getTopDoctor);
    router.get('/api/get-doctors', doctorController.getAllDoctors);
    router.post('/api/save-doctor-detail', doctorController.postDoctorDetail);
    router.get('/api/get-detail-doctor-by-id', doctorController.getDetailDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);


    return app.use("/", router);
}

module.exports = initApiRoutes;