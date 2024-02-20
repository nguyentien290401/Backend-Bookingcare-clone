import doctorService from "../services/doctorService"

let getTopDoctor = async (req, res) => {
    let limit = req.query.limit;
    if (!limit)
        limit = 10;
    try {
        let doctors = await doctorService.getTopDoctorService(+limit);
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctorsService();
        return res.status(200).json(doctors);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}

let postDoctorDetail = async (req, res) => {
    try {
        let response = await doctorService.postDoctorDetailService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}

let getDetailDoctorById = async (req, res) => {
    try {
        let doctor = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json(doctor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let schedule = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(schedule);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let schedule = await doctorService.getScheduleDoctorByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(schedule);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server...'
        })
    }
}

let getExtraInforDoctorById = async (req, res) => {
    try {
        let infor = await doctorService.getExtraInforDoctorByIdService(req.query.doctorId);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status.json({
            errCode: -1,
            errMessage: 'Error from the server ...'
        })
    }
}

module.exports = {
    getTopDoctor: getTopDoctor, getAllDoctors: getAllDoctors,
    postDoctorDetail: postDoctorDetail, getDetailDoctorById: getDetailDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleDoctorByDate: getScheduleDoctorByDate,
    getExtraInforDoctorById: getExtraInforDoctorById
}