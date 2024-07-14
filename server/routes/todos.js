const express = require("express");
const router = express.Router();
const Todo = require("../models/Todo");
const { verifyToken } = require("./auth");

// GET all todos
router.get("/", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.userId });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).send("Internal Server Error");
  }
});

// POST a new todo
router.post("/", verifyToken, async (req, res) => {
  const { text, checked, category, tags, dueDate, priority } = req.body;
  try {
    const newTodo = new Todo({
      text,
      checked,
      category,
      tags,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      priority,
      userId: req.user.userId,
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error("Error saving todo:", error);
    res.status(500).send("Internal Server Error");
  }
});

// PUT update a todo
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { text, checked, category, tags, dueDate, priority } = req.body;
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      {
        text,
        checked,
        category,
        tags,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        priority,
      },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).send("Internal Server Error");
  }
});

// DELETE a todo
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await Todo.findByIdAndDelete(id);
    res.send("Todo deleted");
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
