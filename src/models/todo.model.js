
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        priority: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'active',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        dueDate: {
            type: String,
            required: true,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
)

module.exports = mongoose.model('Todo', todoSchema)


// ye mera todo ka schema hai, isme mai ek categories name se ek array ka schema bhi banana chahti hu isme bydefault kuch category honi chahiye like work , shopping, personal. isme har category k sath kuch aur bhi chahiye jese ki cat name, user-id, isDefault = true, 
// ye categories backend se frontend me jaegi jab bhi application start hogi, user frontend se kuch aur cat add bhi kar sakta hai , abhi userId required nahi honi chahiye ise bad me implement karungi abhi bas cat name and isDefault true chahiye and jo bhi category user create karega usme false chahiye jo ki individual user k liye hogi .
// Mai mvc architecture ko follow kar rahi hu meri help karo is schema ko banane me 