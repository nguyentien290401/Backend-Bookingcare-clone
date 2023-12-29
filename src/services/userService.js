import db from "../models/index";
import bcrypt from 'bcrypt';

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            let isExist = await checkUserEmail(email);
            if (isExist) {
                // User email already exist

                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'roleId', 'password'],
                    raw: true
                });
                if (user) {
                    // Compare password
                    let checkPassword = await bcrypt.compareSync(password, user.password); // true or false
                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.errMessage = 'Ok';

                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Password isn't correct. Try again!"
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found!`;
                }

            }
            else {
                // Return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email isn't exist in the system. Pls try other email!`;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true);

            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin, checkUserEmail: checkUserEmail
}