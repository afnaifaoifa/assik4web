const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authController = require('./controllers/authController');
const activityController = require('./controllers/activityController');
const exercisesController = require('./controllers/exercisesController');
const userController = require('./controllers/userController');
const mongoose = require('mongoose');
const User = require('./models/user');
const Quiz = require('./models/quiz');
const Item = require('./models/item');
const app = express();
const SearchHistory = require('./models/searchHistory');

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://exclusiveshahzod:zh0YsqKsMMMJ2HCM@cluster0.p7nhdnz.mongodb.net/mydatabase')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up express-session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', {error: null});
});

app.get('/signup', (req, res) => {
    res.render('signup', {error: null});
});

app.get('/main',authMiddleware, activityController.getInfo);

app.get('/activity',authMiddleware, activityController.getInfo);


app.post('/activity', async (req, res) => {
    try {
        // Extract the search query from the request body
        const { activity } = req.body;

        // Create a new instance of SearchHistory model
        const searchHistory = new SearchHistory({ activity });

        // Save the search history to the database
        await searchHistory.save();

        // Redirect to the main page after submission
        res.redirect('/main');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/quiz', (req, res) => {
    res.render('quiz'); 
});


app.post('/login', authController.login);

app.post('/signup', authController.register);

app.get('/exercises',authMiddleware,exercisesController.getInfo);

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/admin',authMiddleware, async (req, res) => {
    try {
        const username = req.query.username;
        let users = await User.find();
        if(username){
            users = await User.find({username: username});
        }
        res.render('admin', {users});
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/users/create',authMiddleware, userController.createUser);
app.delete('/users/:userId',authMiddleware, userController.deleteUser);
app.put('/users/:userId', authMiddleware,userController.updateUser);

// POST route for adding a new item
app.post('/add-item', async (req, res) => {
    const { pictures, name1, name2, description1, description2 } = req.body;

    const newItem = new Item({
        pictures: pictures.split(',').map(url => url.trim()),
        names: [{ lang: 'en', name: name1 }, { lang: 'es', name: name2 }],
        descriptions: [{ lang: 'en', description: description1 }, { lang: 'es', description: description2 }]
    });

    try {
        await newItem.save();
        res.redirect('/admin'); // Redirect to admin page after adding the item
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding item');
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('itemsList', { items });
    } catch (error) {
        console.error(error);
    }
});

app.get('/items-add-page', (req, res) => {
    res.render('ItemAdd');  
})
app.get('/items-for-admin', async (req, res) => {
    try {
        const items = await Item.find();
        res.render('itemsListAdmin', { items });
    } catch (error) {
        console.error(error);
    }
});
// Route to handle item deletion
app.post('/delete-item/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.redirect('/items-for-admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting item');
    }
});

// POST route for updating an item
app.post('/update-item/:id', async (req, res) => {
    const { id } = req.params;
    const { itemName, itemDescription, itemImage } = req.body;
    try {
        const updatedItem = await Item.findByIdAndUpdate(id, {
            $set: {
                'names.0.name': itemName,
                'descriptions.0.description': itemDescription,
                'pictures.0': itemImage
            }
        }, { new: true });
        // Redirect to a different page after successful update
        res.redirect('/items-for-admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating item');
    }
});

// Endpoint to add a new quiz question
app.post('/api/questions', async (req, res) => {
    const { question, answer } = req.body;
    try {
        const newQuestion = new Quiz({
            question: question,
            answer: answer
        });
        await newQuestion.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Endpoint to update a quiz question
app.put('/api/questions/:id', async (req, res) => {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
        const updatedQuestion = await Quiz.findByIdAndUpdate(id, {
            question: question,
            answer: answer
        }, { new: true });
        res.json(updatedQuestion);
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: err.message });
    }
});

// Endpoint to delete a quiz question
app.delete('/api/questions/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Quiz.findByIdAndDelete(id);
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete question' });
    }
});
// Обработчик POST запроса для отправки ответа квиза в базу данных
app.post('/submit_quiz_answer', async (req, res) => {
    try {
      // Получаем данные из тела запроса
      const { question, answer } = req.body;
  
      // Создаем новую запись квиза в базе данных
      const newQuiz = new Quiz({
        question,
        answer
      });
  
      // Сохраняем запись квиза в базу данных
      await newQuiz.save();
  
      // После успешного сохранения ответа, перенаправляем на ту же страницу (например, страницу квиза)
      res.redirect('/quiz');
    } catch (error) {
      // Если произошла ошибка, возвращаем статус 500 и сообщение об ошибке
      console.error(error);
      res.status(500).send('Произошла ошибка при сохранении ответа на квиз.');
    }
});

function authMiddleware(req, res, next) {
    // Check if the token exists in the session
    if (req.session && req.session.token) {
        // Token exists, so user is authenticated
        next(); // Continue to the next middleware or route handler
    } else {
        // Token doesn't exist, so user is not authenticated
        res.redirect('/login')// Respond with 401 Unauthorized
    }
}

app.listen(3000, () => console.log('Server started on port 3000'));
