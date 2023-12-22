let getHomePage = (req, res) => {
    return res.render('homepage.ejs');
}

let getAboutPage = (req, res) => {
    return res.render('test/aboutpage.ejs');
}

module.exports = {
    getHomePage, getAboutPage
};