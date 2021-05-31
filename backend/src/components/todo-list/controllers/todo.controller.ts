import { Request, Response } from 'express'
import Todo, { ITodo } from '../models/Todo'

export const getAll = async (req: Request, res: Response) => {
  const todoList = await Todo.find({})

  res.json({"list": todoList})
}

export const addOne = async (req: Request, res: Response) => {
  const todo: ITodo = new Todo({
    title: req.body.title
  })

  try {
    const savedTodo = await todo.save()
    res.json(savedTodo)
  } catch(err) {
    res.json({"error": err})
  }
}

export const updateTodo = async (req: Request, res: Response) => {
  let filter = {"_id": req.body.todoID}
  let data = req.body

  data.updatedAt = new Date();
  const updated = await Todo.updateOne(filter, data, { new: true })
  const todo = await Todo.findOne(filter)
  res.json({status: updated, todo})
}

export const deleteTodo = async (req: Request, res: Response) => {
  console.log(req.body);

  let filter = {"_id": req.body.todoID}

  try {
    const deleted = await Todo.deleteOne(filter)
    return (
      res.json({status: deleted})
    )
  } catch (err) {
    console.log(err);
    return (
      res.status(400).json({'error': err})
    )
  }
}
