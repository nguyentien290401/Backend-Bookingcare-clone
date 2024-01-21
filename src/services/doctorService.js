import db from "../models/index"

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

module.exports = {
    getTopDoctorService: getTopDoctorService, getAllDoctorsService: getAllDoctorsService,
    postDoctorDetailService: postDoctorDetailService, getDetailDoctorByIdService: getDetailDoctorByIdService
}