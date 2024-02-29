const carService = require('../services/activityService');

const getInfo = async (req, res) => {
    try {
        const activity = req.query.activity || 'skiing';
        const response = await carService.getInfo(activity);
        res.render('main', { response });
    }
    catch (error) {
        res.render('main', { error: error.message });
    }
}


module.exports = {
    getInfo
}