import db from '../models/index';
import { createNewUser, getAllUser } from '../services/CRUDservice';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        // console.log('-------------------');
        // console.log(data);
        // console.log('-------------------');
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
        let msg = await createNewUser(req.body);
        console.log(msg);
        return res.send('Hello from post action');
    } catch (e) {
        console.log(e);
    }
}

let displayCRUD = async (req, res) => {
    let data = await getAllUser();
    console.log(data);
    return res.render('displayCRUD.ejs', { data: data });
}

module.exports = {
    getHomePage, getAboutPage, getCRUD, postCRUD, displayCRUD
};