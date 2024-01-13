import db from "../models/index";
import bcrypt from 'bcrypt';

const hashUserPassword = async (password) => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    } catch (e) {
        throw e;
    }
};

const handleUserLogin = async (email, password) => {
    try {
        let userData = {};

        let isExist = await checkUserEmail(email);
        if (isExist) {
            let user = await db.User.findOne({
                where: { email: email },
                attributes: ['email', 'roleId', 'password', 'firstName', 'lastName'],
                raw: true
            });

            if (user) {
                let checkPassword = await bcrypt.compare(password, user.password);

                if (checkPassword) {
                    userData.errCode = 0;
                    userData.errMessage = 'Ok';

                    delete user.password;
                    userData.user = user;
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Password isn't correct. Try again!";
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = `User's not found!`;
            }
        } else {
            userData.errCode = 1;
            userData.errMessage = `Your's Email isn't exist in the system. Pls try other email!`;
        }

        return userData;
    } catch (e) {
        throw e;
    }
};

const checkUserEmail = async (userEmail) => {
    try {
        let user = await db.User.findOne({
            where: { email: userEmail }
        });

        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        throw e;
    }
}

const getAllUsers = async (userId) => {
    try {
        let users = '';

        if (userId === 'ALL') {
            users = await db.User.findAll({
                attributes: {
                    exclude: ['password']
                },
            });
        }

        if (userId && userId !== 'ALL') {
            users = await db.User.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ['password']
                }
            });
        }

        return users;
    } catch (e) {
        throw e;
    }
};

const createNewUser = async (data) => {
    try {
        let check = await checkUserEmail(data.email);
        if (check === true) {
            return ({
                errCode: 1,
                errMessage: 'Email already exist. Plz try another email.'
            });
        }
        else {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender,
                roleId: data.roleId,
                positionId: data.positionId,
                image: data.avatar
            })
        }

        return ({
            errCode: 0,
            errMessage: 'Ok'
        });

    } catch (e) {
        throw e;
    }
}

const deleteAUser = async (userId) => {

    let user = await db.User.findOne({
        where: { id: userId },
    })

    if (!user) {
        return ({
            errCode: 2,
            errMessage: `The user isn't exist`
        })
    }

    await db.User.destroy({
        where: { id: userId }
    });

    return ({
        errCode: 0,
        message: 'The user is deleted.'
    })
}

const updateAUser = async (data) => {
    try {
        if (!data.id || !data.roleId || !data.positionId || !data.gender) {
            return ({
                errCode: 2,
                errMessage: `Missing required parameters!`
            })
        }

        let user = await db.User.findOne({
            where: { id: data.id },
            raw: false
        })
        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;
            user.roleId = data.roleId;
            user.positionId = data.positionId;
            user.gender = data.gender;
            user.phonenumber = data.phonenumber;
            if (data.avatar) {
                user.image = data.avatar;
            }


            await user.save()
            return ({
                errCode: 0,
                message: 'Update user successfully!'
            });
        }
        else {
            return ({
                errCode: 1,
                errMessage: `User isn't found`
            })
        }
    }

    catch (e) {
        throw e;
    }
}

const getAllCodeService = async (typeInput) => {
    try {

        if (!typeInput) {
            return ({
                errCode: 1,
                errMessage: 'Mising required parameters!'
            })
        } else {
            let res = {};

            let allcode = await db.AllCode.findAll({
                where: { type: typeInput }
            });
            res.errCode = 0;
            res.data = allcode;

            return res;
        }

    } catch (e) {
        throw e;
    }
}

module.exports = {
    handleUserLogin: handleUserLogin, checkUserEmail: checkUserEmail, getAllUsers: getAllUsers,
    createNewUser: createNewUser, deleteAUser: deleteAUser, updateAUser: updateAUser,
    getAllCodeService: getAllCodeService
}