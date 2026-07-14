package com.example.todolist.model

data class TodoItem(
    val id: Long = 0L,
    val title: String,
    val description: String = "",
    val isCompleted: Boolean = false,
    val priority: TodoPriority = TodoPriority.MEDIUM,
    val category: TodoCategory = TodoCategory.OTHER,
    val dueDate: Long? = null,
    val createdAt: Long = System.currentTimeMillis()
)
