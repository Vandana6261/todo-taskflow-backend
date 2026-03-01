const todoService = require("../services/todo.service");
const seedDefaultCategories = require("../seed/seedCategories")

const createTodo = async (req, res) => {
  try {
    console.log(req.body);
    const todo = await todoService.createTodo(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllTodo = async (req, res) => {
  try {
    console.log("getAllTodo called in controller")
    const todos = await todoService.getAllTodo();
    const categories = await todoService.getCategory();
    return res.json({todos, categories});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getInitialCategory = async (req, res) => {
  try {
    await seedDefaultCategories();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const deleteTodo = async (req, res) => {
  console.log("deleteTodo called");
  const todo = await todoService.deleteTodo(req.params.id, req.body);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({ message: "Todo deleted successfully" });
};

const updateTodo = async (req, res) => {
  console.log("Update todo called");
  const todo = await todoService.updateTodo(req.params.id, req.body);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({ message: "Todo updated successfully" });
};

const searchTodo = async (req, res) => {
  console.log("Search todo called");
  const todo = await todoService.searchTodo(req.params.keyword);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  console.log(todo);
  res.json(todo);
};

const createCategory = async (req, res) => {
  try {
    console.log("Create Category is called");
    const category = await todoService.createCategory(req.body);
    return res.status(200).json(category)
  } catch (error) {
    return res.status(404).json({message: error.message})
  }
};

// I haven't use this partial update
const updateTodoPartial = async (req, res) => {
  const todo = await todoService.updateTodoPartial(req.params.id, req.body);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({ message: "Todo updated successfully" });
};

module.exports = {
  createTodo,
  deleteTodo,
  updateTodo,
  getAllTodo,
  searchTodo,
  createCategory,
  getInitialCategory,
  updateTodoPartial,
};
