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


// controllers/exercisesController.js
const SearchHistory = require('../models/searchHistory');

exports.getInfo = async (req, res) => {
  try {
    // Получаем поисковый запрос из параметров запроса
    const searchTerm = req.query.q;

    // Сохраняем историю поиска в базу данных
    if (searchTerm) {
      const newSearch = new SearchHistory({
        searchTerm: searchTerm
      });
      await newSearch.save();
    }

    // Здесь ваш код для обработки запроса упражнений
    // Например:
    res.render('exercises', { searchTerm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


