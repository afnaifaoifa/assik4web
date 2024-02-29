const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const token = await authService.login(username, password);
        console.log(token)
        if (token) {
            req.session.token = token;
        }
        if(username === 'Shakhzod' && password === '1234'  ){
            res.redirect('/admin')
        }
        else{
            res.redirect('/main');
        }
    }
    catch (error) {
        res.render('login', { error: error.message });
    }
}

const register = async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        await authService.register(username, password);
        res.redirect('/login');
    }
    catch (error) {
        res.render('signup', { error: error.message });
    }
}

module.exports = {
    login,
    register
}