const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authController = require('./controllers/authController');
const activityController = require('./controllers/activityController');
const exercisesController = require('./controllers/exercisesController');
const userController = require('./controllers/userController');
const User = require('./models/user');
const mongoose = require('mongoose');
const Item = require('./models/item');
const app = express();



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
