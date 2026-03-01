
const Category = require('../models/category.model')

const defaultCategories = ['work', 'shopping', 'personal'];

const seedDefaultCategories = async () => {
    try {
        for(let cat of defaultCategories) {
            const exists = await Category.findOne({name: cat, isDefault: true});
            console.log(exists, "exists")
            if(!exists) {
                let c = await Category.create({
                    name: cat,
                    isDefault: true,
                })
                console.log(c)
            }
        }
        console.log("Default categories checked/added")
    } catch (error) {
        console.log("Error seeding categories: ", error)
    }
}

module.exports = seedDefaultCategories;