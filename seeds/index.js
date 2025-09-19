// A script to populate the database with data from "cities.js".

const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function populateDB(numCamps = 50) {
    await Campground.deleteMany({});
    console.log("Existing data cleared");
    const camps = [];
    for (let i = 0; i < numCamps; i++) {
        const randomCity = Math.floor(Math.random() * cities.length);
        const randomDescriptor = Math.floor(Math.random() * descriptors.length);
        const randomPlace = Math.floor(Math.random() * places.length);

        const title = `${descriptors[randomDescriptor]} ${places[randomPlace]}`;
        const location = `${cities[randomCity].city}, ${cities[randomCity].state}`;
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title,
            location,
            price
        });
        camps.push(camp);
    }
    try {
        await Campground.insertMany(camps);
        console.log("Database populated with campgrounds data");
    } catch (err) {
        console.error("Error inserting data:", err);
    }
}

populateDB(100); then(() => {
    mongoose.connection.close();
    console.log("Database connection closed");
}).catch(err => {
    console.error("Error during population:", err);
});
