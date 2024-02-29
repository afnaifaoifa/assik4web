const exerciseService = require('../services/exerciseService');


const getInfo = async (req, res) => {
    const muscle  = req.query.muscle || 'biceps';
    try {
        const exercises = await exerciseService.getInfo(muscle);
        res.render('exercises', { exercises, error: null });
    }
    catch (error) {
        res.render('exercises', { exercises: [], error: error.message });
    }
}

module.exports = {
    getInfo
}

