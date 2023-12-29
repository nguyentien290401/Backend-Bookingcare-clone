import db from '../models/index';
import CRUDservice from '../services/CRUDservice';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', { data: JSON.stringify(data) });
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/aboutpage.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let postCRUD = async (req, res) => {
    try {
        let msg = await CRUDservice.createNewUser(req.body);
        console.log(msg);
        return res.send('Hello from post action');
    } catch (e) {
        console.log(e);
    }
}

let displayCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUser();
    return res.render('displayCRUD.ejs', { data: data });
}

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDservice.getUserInfoById(userId);
        if (userData) {
            return res.render('editCRUD.ejs', { userData: userData });
        }
        return res.send(`Get the userId ${userId} `);
    }
    else {
        return res.send('User not found');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDservice.updateUserData(data);

    return res.redirect("/get-crud");
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDservice.deleteUserById(id);
        return res.redirect('/get-crud');
    }
    else {
        return res.send('User not found');
    }
}

module.exports = {
    getHomePage: getHomePage, getAboutPage: getAboutPage, getCRUD: getCRUD, postCRUD: postCRUD,
    displayCRUD: displayCRUD, getEditCRUD: getEditCRUD, putCRUD: putCRUD, deleteCRUD: deleteCRUD
};