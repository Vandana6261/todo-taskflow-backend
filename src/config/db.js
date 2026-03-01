const mongoose = require('mongoose');
const seedDefaultCategories = require('../seed/seedCategories')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
        await seedDefaultCategories();
    } catch (error) {
        console.log('MongoDB connection failed', error);
        process.exit(1);
    }
}

module.exports = connectDB;