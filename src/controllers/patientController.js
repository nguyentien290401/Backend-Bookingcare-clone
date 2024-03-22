import patientService from "../services/patientService";

let postBookingAppointment = async (req, res) => {
    try {
        let infor = await patientService.postBookingAppointmentService(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server ...'
        })
    }
}

module.exports = {
    postBookingAppointment: postBookingAppointment
}