
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
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
