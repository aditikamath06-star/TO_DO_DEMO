package com.example.todolist.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.todolist.model.TodoCategory
import com.example.todolist.model.TodoItem
import com.example.todolist.model.TodoPriority
import com.example.todolist.repository.TodoRepository
import com.example.todolist.ui.theme.ThemeManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class SortOption {
    DUE_DATE,
    PRIORITY,
    CREATED_AT
}

class TodoViewModel(application: Application) : AndroidViewModel(application) {
    private val repository = TodoRepository(application)
    private val themeManager = ThemeManager(application)

    private val _rawTodos = MutableStateFlow<List<TodoItem>>(emptyList())
    
    val isDarkMode = MutableStateFlow(themeManager.isDarkMode(false))

    val searchQuery = MutableStateFlow("")
    val filterCategory = MutableStateFlow<TodoCategory?>(null)
    val filterPriority = MutableStateFlow<TodoPriority?>(null)
    val filterStatus = MutableStateFlow<Boolean?>(null) // null = All, false = Pending, true = Completed
    val sortBy = MutableStateFlow(SortOption.CREATED_AT)

    init {
        loadTodos()
    }


    fun loadTodos() {
        viewModelScope.launch {
            _rawTodos.value = repository.getAllTodos()
        }
    }

    val todos: StateFlow<List<TodoItem>> = combine(
        _rawTodos,
        searchQuery,
        filterCategory,
        filterPriority,
        filterStatus,
        sortBy
    ) { flowsArray ->
        @Suppress("UNCHECKED_CAST")
        val raw = flowsArray[0] as List<TodoItem>
        val query = flowsArray[1] as String
        val category = flowsArray[2] as TodoCategory?
        val priority = flowsArray[3] as TodoPriority?
        val status = flowsArray[4] as Boolean?
        val sort = flowsArray[5] as SortOption

        var list = raw

        // Apply search query
        if (query.isNotBlank()) {
            list = list.filter {
                it.title.contains(query, ignoreCase = true) ||
                        it.description.contains(query, ignoreCase = true)
            }
        }

        // Apply category filter
        if (category != null) {
            list = list.filter { it.category == category }
        }

        // Apply priority filter
        if (priority != null) {
            list = list.filter { it.priority == priority }
        }

        // Apply status filter
        if (status != null) {
            list = list.filter { it.isCompleted == status }
        }

        // Apply sorting
        list = when (sort) {
            SortOption.CREATED_AT -> list.sortedByDescending { it.createdAt }
            SortOption.DUE_DATE -> {
                val withDue = list.filter { it.dueDate != null }.sortedBy { it.dueDate }
                val withoutDue = list.filter { it.dueDate == null }.sortedByDescending { it.createdAt }
                withDue + withoutDue
            }
            SortOption.PRIORITY -> {
                list.sortedWith(compareByDescending<TodoItem> {
                    when (it.priority) {
                        TodoPriority.HIGH -> 3
                        TodoPriority.MEDIUM -> 2
                        TodoPriority.LOW -> 1
                    }
                }.thenByDescending { it.createdAt })
            }
        }

        list
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val statistics: StateFlow<Pair<Int, Int>> = _rawTodos.map { all ->
        val completed = all.count { it.isCompleted }
        Pair(completed, all.size)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), Pair(0, 0))

    fun addTodo(
        title: String,
        description: String,
        priority: TodoPriority,
        category: TodoCategory,
        dueDate: Long?
    ) {
        viewModelScope.launch {
            val newItem = TodoItem(
                title = title,
                description = description,
                priority = priority,
                category = category,
                dueDate = dueDate
            )
            repository.insert(newItem)
            loadTodos()
        }
    }

    fun toggleTodoCompletion(todo: TodoItem) {
        viewModelScope.launch {
            val updated = todo.copy(isCompleted = !todo.isCompleted)
            repository.update(updated)
            loadTodos()
        }
    }

    fun updateTodo(
        id: Long,
        title: String,
        description: String,
        priority: TodoPriority,
        category: TodoCategory,
        dueDate: Long?,
        isCompleted: Boolean
    ) {
        viewModelScope.launch {
            val updated = TodoItem(
                id = id,
                title = title,
                description = description,
                priority = priority,
                category = category,
                dueDate = dueDate,
                isCompleted = isCompleted
            )
            repository.update(updated)
            loadTodos()
        }
    }

    fun deleteTodo(todo: TodoItem) {
        viewModelScope.launch {
            repository.delete(todo)
            loadTodos()
        }
    }

    fun clearCompletedTodos() {
        viewModelScope.launch {
            repository.clearCompleted()
            loadTodos()
        }
    }

    fun toggleTheme() {
        val newValue = !isDarkMode.value
        isDarkMode.value = newValue
        themeManager.setDarkMode(newValue)
    }

    class Factory(private val application: Application) : ViewModelProvider.Factory {
        @Suppress("UNCHECKED_CAST")
        override fun <T : ViewModel> create(modelClass: Class<T>): T {
            if (modelClass.isAssignableFrom(TodoViewModel::class.java)) {
                return TodoViewModel(application) as T
            }
            throw IllegalArgumentException("Unknown ViewModel class")
        }
    }
}
