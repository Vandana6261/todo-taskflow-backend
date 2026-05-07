const todoService = require("../services/todoService");
const seedDefaultCategories = require("../seed/seedCategories")

const createTodo = async (req, res) => {
  try {
    const todoData = {...req.body, user: req.userId};
    console.log(todoData)
    const todo = await todoService.createTodo(todoData);
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllTodo = async (req, res) => {
  try {
    console.log("getAllTodo called in controller")

    const response = await todoService.getAllTodo(req.userId);
    return res.json(response)
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCategory = async (req, res) => {
  console.log("getCategory in controller")
  try {
    // await seedDefaultCategories();
    const category = await todoService.getCategory(req.userId)
    console.log(category,"category")
    return res.json({
      categories: category
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const deleteTodo = async (req, res) => {
  console.log("deleteTodo called");
  console.log(req.params.id, req.userId)
  const todo = await todoService.deleteTodo(req.params.id, req.userId);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }
  res.json({ message: "Todo deleted successfully" });
};

const updateTodo = async (req, res) => {
  console.log("Update todo called");
  const todo = await todoService.updateTodo(req.params.id, req.userId, req.body);
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

const createUser = async (req, res) => {
  console.log("SignUp called")
  try {
    const user = await todoService.createUser(req.body);
    return res.status(200).json(user)
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
}

const getUserTodo = async (req, res) => {
  try {
    const userTodos = await todoService.getUserTodo(req.params.userId);
    return res.status(200).json(userTodos)
  } catch (error) {
    return res.json(400).json({message: error.message})
  }
}

module.exports = {
  createTodo,
  deleteTodo,
  updateTodo,
  getAllTodo,
  searchTodo,
  createCategory,
  getCategory,
  createUser,
  getUserTodo,
};
