
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
            type: String,
            default: 'work',
            required: true,
        },
        dueDate: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }
)

module.exports = mongoose.model('Todo', todoSchema)