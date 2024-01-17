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
        if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown) {
            return {
                errCode: 1,
                errMessage: 'Mising required parameters !'
            }
        } else {
            await db.Markdown.create({
                contentHTML: inputData.contentHTML,
                contentMarkdown: inputData.contentMarkdown,
                description: inputData.description,
                doctorId: inputData.doctorId
            })

            return {
                errCode: 0,
                errMessage: 'Saved infomation of user successfully!'
            }
        }
    } catch (e) {
        return console.log(e);
    }
}

module.exports = {
    getTopDoctorService: getTopDoctorService, getAllDoctorsService: getAllDoctorsService,
    postDoctorDetailService: postDoctorDetailService
}