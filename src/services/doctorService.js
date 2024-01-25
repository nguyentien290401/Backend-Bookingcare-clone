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
        if (!inputData.doctorId || !inputData.contentHTML
            || !inputData.contentMarkdown || !inputData.action) {
            return {
                errCode: 1,
                errMessage: 'Mising required parameters !'
            }
        } else {
            //  Check status of action
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

            // Format date the same as client side
            if (existing && existing.length > 0) {
                existing = existing.map(item => {
                    item.date = new Date(item.date).getTime();
                    return item;
                })
            }

            // Compare 2 object different or not
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && a.date === b.date;
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

module.exports = {
    getTopDoctorService: getTopDoctorService, getAllDoctorsService: getAllDoctorsService,
    postDoctorDetailService: postDoctorDetailService, getDetailDoctorByIdService: getDetailDoctorByIdService,
    bulkCreateScheduleService: bulkCreateScheduleService
}