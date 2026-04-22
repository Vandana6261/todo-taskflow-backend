
const Category = require('../models/category')

const defaultCategories = ['work', 'shopping', 'personal'];

const seedDefaultCategories = async (userId) => {
    try {
        for(let cat of defaultCategories) {
            const exists = await Category.findOne({_id: userId, name: cat, isDefault: true});
            if(!exists) {
                console.log(userId, "13 seed category");
                let c = await Category.create({
                    name: cat,
                    isDefault: true,
                    user: userId
                })
            }
        }
        console.log("Default categories checked/added")
    } catch (error) {
        console.log("Error seeding categories: ", error)
    }
}

module.exports = seedDefaultCategories;