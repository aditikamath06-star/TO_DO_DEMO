package com.example.todolist.repository

import android.content.Context
import com.example.todolist.api.TodoApi
import com.example.todolist.model.TodoItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class TodoRepository(context: Context) {
    suspend fun getAllTodos(): List<TodoItem> = withContext(Dispatchers.IO) {
        try {
            TodoApi.service.getTasks()
        } catch (e: Exception) {
            emptyList()
        }
    }

    suspend fun insert(todo: TodoItem): Long = withContext(Dispatchers.IO) {
        try {
            TodoApi.service.createTask(todo)
            todo.id
        } catch (e: Exception) {
            -1L
        }
    }

    suspend fun update(todo: TodoItem): Int = withContext(Dispatchers.IO) {
        try {
            TodoApi.service.updateTask(todo.id, todo)
            1
        } catch (e: Exception) {
            0
        }
    }

    suspend fun delete(todo: TodoItem): Int = withContext(Dispatchers.IO) {
        try {
            TodoApi.service.deleteTask(todo.id)
            1
        } catch (e: Exception) {
            0
        }
    }

    suspend fun clearCompleted(): Int = withContext(Dispatchers.IO) {
        try {
            val tasks = TodoApi.service.getTasks()
            tasks.filter { it.isCompleted }.forEach {
                TodoApi.service.deleteTask(it.id)
            }
            1
        } catch (e: Exception) {
            0
        }
    }
}
