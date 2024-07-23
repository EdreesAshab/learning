import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  todoList = [
    {
      id: 0,
      taskTitle: 'Learn Angular essential topics',
      isComplete: false,
    },
    {
      id: 1,
      taskTitle: 'Finish Warmup 0',
      isComplete: true,
    },
    {
      id: 2,
      taskTitle: 'Finish Warmup 1',
      isComplete: false,
    },
  ];

  constructor() {}

  addTodo(id: number, taskTitle: string, isComplete: boolean = false): void {
    this.todoList.push({
      id,
      taskTitle,
      isComplete,
    });
  }

  getTodos(): { id: number; taskTitle: string; isComplete: boolean }[] {
    return this.todoList;
  }

  deleteTodo(id: number): void {
    this.todoList = this.todoList.filter((todo) => todo.id !== id);
  }
}
