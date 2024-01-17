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

module.exports = {
    getTopDoctor: getTopDoctor, getAllDoctors: getAllDoctors,
    postDoctorDetail: postDoctorDetail
}