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


// controllers/activityController.js
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

    // Здесь ваш код для обработки запроса активити
    // Например:
    res.render('activity', { searchTerm });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
