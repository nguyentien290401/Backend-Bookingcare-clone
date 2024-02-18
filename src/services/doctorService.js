import db from "../models/index";
require('dotenv').config();
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorService = async (limit) => {
    try {
        let users = await db.User.findAll({
            limit: limit,
            where: { roleId: 'R2' },
            order: [['createdAt', 'DESC']],
            attributes: {
                exclude: ['password']
            },
            include: [
                { model: db.AllCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                { model: db.AllCode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }
            ],
            raw: true,
            nest: true
        });

        return {
            errCode: 0,
            data: users
        };
    } catch (e) {
        return console.log(e);
    }
};

let getAllDoctorsService = async (data) => {
    try {
        let doctors = await db.User.findAll({
            where: { roleId: 'R2' },
            attributes: {
                exclude: ['password', 'image']
            },
        })
        return {
            errCode: 0,
            data: doctors
        };
    } catch (e) {
        return console.log(e);
    }
}

let postDoctorDetailService = async (inputData) => {
    try {
        //  Check variable (include: action - status of variable Markdown)
        if (!inputData.doctorId
            || !inputData.contentHTML
            || !inputData.contentMarkdown || !inputData.action
            || !inputData.selectedPrice || !inputData.selectedPayment
            || !inputData.selectedProvince
            || !inputData.nameClinic || !inputData.addressClinic
            || !inputData.note) {
            return {
                errCode: 1,
                errMessage: 'Mising required parameters !'
            }
        } else {
            //  Upsert to Markdown
            if (inputData.action === 'ADD') {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId
                })
            } else if (inputData.action === 'EDIT') {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false      // set false to set sequelize object (not js object)
                })

                if (doctorMarkdown) {
                    doctorMarkdown.contentHTML = inputData.contentHTML;
                    doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                    doctorMarkdown.description = inputData.description;
                    doctorMarkdown.updateAt = new Date();

                    await doctorMarkdown.save();
                }

                // Upsert to Doctor_infor table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false
                })
                if (doctorInfor) {
                    // update
                    doctorInfor.doctorId = inputData.doctorId;
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.provinceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;

                    await doctorInfor.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note
                    })
                }
            }

            return {
                errCode: 0,
                errMessage: 'Saved infomation of user successfully!'
            }
        }
    } catch (e) {
        return console.log(e);
    }
}

let getDetailDoctorByIdService = async (inputId) => {
    try {
        if (!inputId) {
            return ({
                errCode: 1,
                errMessage: 'Missing required parameter !'
            })
        } else {
            let data = await db.User.findOne({
                where: { id: inputId },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Markdown,
                        attributes: ['description', 'contentHTML', 'contentMarkdown']
                    },
                    { model: db.AllCode, as: 'positionData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: false,  // true -> Sequelize object, false: javascript object   
                nest: true  // do action with database need at form sequelize object
            })

            //  Converting image to base64 if have data
            if (data && data.image) {
                data.image = new Buffer(data.image, 'base64').toString('binary');
            }

            //  Always return a null object data
            if (!data)
                data = {};

            return ({
                errCode: 0,
                data: data
            })
        }
    } catch (e) {
        return console.log(e);
    }
}

let bulkCreateScheduleService = async (data) => {
    try {

        if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
            return {
                errCode: 1,
                errMessage: 'Missing required parameter !'
            }
        } else {
            let schedule = data.arrSchedule;
            if (schedule && schedule.length > 0) {
                schedule = schedule.map(item => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;

                    return item;
                })
            }

            // Get all existing data
            let existing = await db.Schedule.findAll(
                {
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                });


            // Compare 2 object different or not
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && +a.date === +b.date;
            });
            console.log('Check different: ', toCreate);

            // Create data
            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate);
            }

            return {
                errCode: 0,
                data: 'OK'
            }
        }

    } catch (e) {
        return console.log(e);
    }
}

let getScheduleDoctorByDateService = async (doctorId, date) => {
    try {
        if (!doctorId || !date) {
            return ({
                errCode: 1,
                errMessage: 'Missing required parameters !'
            })
        } else {
            let dataSchedule = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    { model: db.AllCode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }
                ],
                raw: false,  // true -> Sequelize object, false: javascript object   
                nest: true  // do action with database need at form sequelize object
            })

            if (!dataSchedule) dataSchedule = [];

            return ({
                errCode: 0,
                data: dataSchedule
            })
        }
    } catch (e) {

    }
}

module.exports = {
    getTopDoctorService: getTopDoctorService, getAllDoctorsService: getAllDoctorsService,
    postDoctorDetailService: postDoctorDetailService, getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleDoctorByDateService: getScheduleDoctorByDateService
}