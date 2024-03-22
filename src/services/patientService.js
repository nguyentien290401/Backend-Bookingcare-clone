import db from "../models/index";
require('dotenv').config();

let postBookingAppointmentService = async (data) => {
    try {
        if (!data.email || !data.doctorId || !data.timeType || !data.date) {
            return ({
                errCode: 1,
                errMessage: 'Missing required parameters !'
            })
        } else {
            // upsert patient
            let user = await db.User.findOrCreate({
                where: { email: data.email },
                defaults: {
                    email: data.email,
                    roleId: 'R3'
                }
            });

            // create a booking record
            if (user && user[0]) {
                await db.Booking.findOrCreate({
                    where: { patientId: user[0].id },
                    defaults: {
                        statusId: 'S1',
                        doctorId: data.doctorId,
                        patientId: user[0].id,
                        date: data.date,
                        timeType: data.timeType
                    }
                })
            }

            return ({
                errCode: 0,
                errMessage: 'Save infor doctor succeed !'
            })
        }

    } catch (e) {

    }
}

module.exports = {
    postBookingAppointmentService: postBookingAppointmentService
}