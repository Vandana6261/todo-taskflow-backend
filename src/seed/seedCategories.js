
const Category = require('../models/category')

const defaultCategories = ['work', 'shopping', 'personal'];

const seedDefaultCategories = async (user) => {
    try {
        for(let cat of defaultCategories) {
            const exists = await Category.findOne({name: cat, isDefault: true});
            console.log(exists, "exists")
            if(!exists) {
                let c = await Category.create({
                    name: cat,
                    isDefault: true,
                    user: user
                })
            }
        }
        console.log("Default categories checked/added")
    } catch (error) {
        console.log("Error seeding categories: ", error)
    }
}

module.exports = seedDefaultCategories;