import db from "../models/index";
import bcrypt from 'bcrypt';

const handleUserLogin = async (email, password) => {
    try {
        let userData = {};

        let isExist = await checkUserEmail(email);
        if (isExist) {
            let user = await db.User.findOne({
                where: { email: email },
                attributes: ['email', 'roleId', 'password'],
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

let checkUserEmail = async (userEmail) => {
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

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                })
            }
            if (userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin, checkUserEmail: checkUserEmail, getAllUsers: getAllUsers
}