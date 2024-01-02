import bcrypt from 'bcrypt';
import db from '../models/index';

const createNewUser = async (data) => {
    try {
        let hashPasswordFromBcrypt = await hashUserPassword(data.password);
        await db.User.create({
            email: data.email,
            password: hashPasswordFromBcrypt,
            firstName: data.firstName,
            lastName: data.lastName,
            address: data.address,
            phonenumber: data.phonenumber,
            gender: data.gender === '1' ? true : false,
            roleId: data.roleId
        })

        return ('Create a new user Successfully !');

    } catch (e) {
        throw e;
    }
}

const hashUserPassword = async (password) => {
    try {
        const salt = await bcrypt.genSaltSync(10);
        let hashPassword = await bcrypt.hashSync(password, salt);
        return hashPassword;
    } catch (e) {
        throw e;
    }
};

const getAllUser = async () => {
    try {
        let users = db.User.findAll({
            raw: true
        });
        return users;
    } catch (e) {
        throw e;
    }
}

const getUserInfoById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId },
            raw: true
        })
        if (user) {
            return user;

        }
        else {
            return [];
        }
    } catch (e) {
        throw e
    }
}

const updateUserData = async (data) => {
    try {
        let user = await db.User.findOne({
            where: { id: data.id }
        })
        if (user) {
            user.firstName = data.firstName;
            user.lastName = data.lastName;
            user.address = data.address;

            await user.save();
            return;
        }
        else {
            return;
        }
    } catch (e) {
        throw e
    }
}

const deleteUserById = async (userId) => {
    try {
        let user = await db.User.findOne({
            where: { id: userId }
        });
        if (user) {
            await user.destroy();
        }
        return;

    } catch (e) {
        throw e;
    }
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById
}