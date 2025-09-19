require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');


const Campground = require('./models/campground');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
}));

// View engine setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Basic route
app.get('/', (req, res) => {
    res.render('index', { title: 'Yelp Campgrounds' });
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.post('/campgrounds', async (req, res) => {
    const { title, location, price, description } = req.body;
    const campground = new Campground({ title, location, price, description });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return res.status(404).send('Campground not found');
    }
    res.render('campgrounds/show', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const { title, location, price, description } = req.body;
    const campground = await Campground.findByIdAndUpdate(id, { title, location, price, description }, { new: true });
    if (!campground) {
        return res.status(404).send('Campground not found');
    }
    res.redirect(`/campgrounds/${campground._id}`);
});


app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        return res.status(404).send('Campground not found');
    }
    res.redirect('/campgrounds');
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        return res.status(404).send('Campground not found');
    }
    res.render('campgrounds/edit', { campground });

});

// Error handling
app.use((req, res, next) => {
    res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
