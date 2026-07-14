package com.example.todolist.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.todolist.model.TodoCategory
import com.example.todolist.model.TodoItem
import com.example.todolist.model.TodoPriority
import com.example.todolist.ui.components.AddTaskBottomSheet
import com.example.todolist.ui.components.ProgressDashboard
import com.example.todolist.ui.components.TodoItemRow
import com.example.todolist.viewmodel.SortOption
import com.example.todolist.viewmodel.TodoViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TodoHomeScreen(
    viewModel: TodoViewModel,
    modifier: Modifier = Modifier
) {
    val todos by viewModel.todos.collectAsState()
    val statistics by viewModel.statistics.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()
    val selectedCategory by viewModel.filterCategory.collectAsState()
    val selectedPriority by viewModel.filterPriority.collectAsState()
    val selectedStatus by viewModel.filterStatus.collectAsState()
    val sortBy by viewModel.sortBy.collectAsState()

    var showBottomSheet by remember { mutableStateOf(false) }
    var todoToEdit by remember { mutableStateOf<TodoItem?>(null) }

    var showSortMenu by remember { mutableStateOf(false) }
    var showPriorityMenu by remember { mutableStateOf(false) }
    var showStatusMenu by remember { mutableStateOf(false) }

    Scaffold(
        modifier = modifier.fillMaxSize(),
        floatingActionButton = {
            FloatingActionButton(
                onClick = {
                    todoToEdit = null
                    showBottomSheet = true
                },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = MaterialTheme.colorScheme.onPrimary,
                shape = CircleShape,
                modifier = Modifier.padding(bottom = 8.dp, end = 8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = "Add Task",
                    modifier = Modifier.size(28.dp)
                )
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(horizontal = 16.dp)
        ) {
            Spacer(modifier = Modifier.height(16.dp))

            // 1. App Title Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = "My Tasks",
                        style = MaterialTheme.typography.headlineMedium.copy(
                            fontWeight = FontWeight.ExtraBold,
                            letterSpacing = (-0.5).sp
                        ),
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Row for buttons since we centered the text
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                if (statistics.first > 0) {
                    FilledTonalIconButton(
                        onClick = { viewModel.clearCompletedTodos() },
                        colors = IconButtonDefaults.filledTonalIconButtonColors(
                            containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.5f),
                            contentColor = MaterialTheme.colorScheme.error
                        ),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.DeleteSweep,
                            contentDescription = "Clear Completed",
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                IconButton(
                    onClick = { viewModel.toggleTheme() }
                ) {
                    val isDarkMode by viewModel.isDarkMode.collectAsState()
                    Icon(
                        imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                        contentDescription = "Toggle Theme",
                        tint = MaterialTheme.colorScheme.primary
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 2. Statistics Card
            ProgressDashboard(
                completedCount = statistics.first,
                totalCount = statistics.second
            )

            Spacer(modifier = Modifier.height(16.dp))

            // 3. Dynamic Search Input
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { viewModel.searchQuery.value = it },
                placeholder = { Text("Search your tasks", style = MaterialTheme.typography.bodyMedium) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Search",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(20.dp)
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.searchQuery.value = "" }) {
                            Icon(
                                imageVector = Icons.Default.Clear,
                                contentDescription = "Clear Search",
                                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = MaterialTheme.colorScheme.primary,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f),
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.2f)
                ),
                textStyle = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(12.dp))

            // 4. Horizontally Scrolling Category Filters
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth(),
                contentPadding = PaddingValues(vertical = 4.dp)
            ) {
                item {
                    val isAllSelected = selectedCategory == null
                    FilterChip(
                        selected = isAllSelected,
                        onClick = { viewModel.filterCategory.value = null },
                        label = { Text("All", style = MaterialTheme.typography.labelLarge) },
                        leadingIcon = { 
                            Icon(
                                Icons.AutoMirrored.Filled.List, 
                                contentDescription = null, 
                                modifier = Modifier.size(16.dp)
                            ) 
                        },
                        shape = RoundedCornerShape(12.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = isAllSelected,
                            borderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
                        )
                    )
                }
                items(TodoCategory.entries) { category ->
                    val isSelected = selectedCategory == category
                    FilterChip(
                        selected = isSelected,
                        onClick = { viewModel.filterCategory.value = category },
                        label = { Text(category.label, style = MaterialTheme.typography.labelLarge) },
                        leadingIcon = { 
                            Icon(
                                category.icon, 
                                contentDescription = null, 
                                modifier = Modifier.size(16.dp)
                            ) 
                        },
                        shape = RoundedCornerShape(12.dp),
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = MaterialTheme.colorScheme.primaryContainer,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimaryContainer
                        ),
                        border = FilterChipDefaults.filterChipBorder(
                            enabled = true,
                            selected = isSelected,
                            borderColor = MaterialTheme.colorScheme.outline.copy(alpha = 0.2f)
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(8.dp))

            // 5. Dropdown selectors for Status, Priority & Sorting
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Status Dropdown Filter
                Box(modifier = Modifier.weight(1f)) {
                    TextButton(
                        onClick = { showStatusMenu = true },
                        modifier = Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f), RoundedCornerShape(12.dp)),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = when (selectedStatus) {
                                    true -> "Completed"
                                    false -> "Pending"
                                    null -> "All Status"
                                },
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                        }
                    }
                    DropdownMenu(
                        expanded = showStatusMenu,
                        onDismissRequest = { showStatusMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("All Status") },
                            onClick = {
                                viewModel.filterStatus.value = null
                                showStatusMenu = false
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Pending") },
                            onClick = {
                                viewModel.filterStatus.value = false
                                showStatusMenu = false
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Completed") },
                            onClick = {
                                viewModel.filterStatus.value = true
                                showStatusMenu = false
                            }
                        )
                    }
                }

                // Priority Dropdown Filter
                Box(modifier = Modifier.weight(1f)) {
                    TextButton(
                        onClick = { showPriorityMenu = true },
                        modifier = Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f), RoundedCornerShape(12.dp)),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = selectedPriority?.label ?: "All Priorities",
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                        }
                    }
                    DropdownMenu(
                        expanded = showPriorityMenu,
                        onDismissRequest = { showPriorityMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("All Priorities") },
                            onClick = {
                                viewModel.filterPriority.value = null
                                showPriorityMenu = false
                            }
                        )
                        TodoPriority.entries.forEach { priority ->
                            DropdownMenuItem(
                                text = { Text(priority.label) },
                                onClick = {
                                    viewModel.filterPriority.value = priority
                                    showPriorityMenu = false
                                }
                            )
                        }
                    }
                }

                // Sort Dropdown Filter
                Box(modifier = Modifier.weight(1f)) {
                    TextButton(
                        onClick = { showSortMenu = true },
                        modifier = Modifier.fillMaxWidth().background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.3f), RoundedCornerShape(12.dp)),
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text(
                                text = when (sortBy) {
                                    SortOption.CREATED_AT -> "Sort: Created"
                                    SortOption.DUE_DATE -> "Sort: Due Date"
                                    SortOption.PRIORITY -> "Sort: Priority"
                                },
                                fontSize = 12.sp,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
                        }
                    }
                    DropdownMenu(
                        expanded = showSortMenu,
                        onDismissRequest = { showSortMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Date Created") },
                            onClick = {
                                viewModel.sortBy.value = SortOption.CREATED_AT
                                showSortMenu = false
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Due Date") },
                            onClick = {
                                viewModel.sortBy.value = SortOption.DUE_DATE
                                showSortMenu = false
                            }
                        )
                        DropdownMenuItem(
                            text = { Text("Priority") },
                            onClick = {
                                viewModel.sortBy.value = SortOption.PRIORITY
                                showSortMenu = false
                            }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // 6. Task List & Empty State Container
            if (todos.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.padding(32.dp)
                    ) {
                        // Compose-only clean checkmark empty graphic
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primaryContainer),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.List,
                                contentDescription = null,
                                tint = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.size(40.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No tasks found",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Clean list, clear mind! Create a new task by clicking the button below.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxWidth().weight(1f),
                    contentPadding = PaddingValues(bottom = 80.dp)
                ) {
                    items(todos, key = { it.id }) { todo ->
                        TodoItemRow(
                            todo = todo,
                            onToggleCompletion = { viewModel.toggleTodoCompletion(todo) },
                            onDelete = { viewModel.deleteTodo(todo) },
                            onClick = {
                                todoToEdit = todo
                                showBottomSheet = true
                            },
                            modifier = Modifier.animateItem()
                        )
                    }
                }
            }
        }
    }

    // 7. Add/Edit Task Bottom Sheet Modal
    if (showBottomSheet) {
        AddTaskBottomSheet(
            todoToEdit = todoToEdit,
            onDismiss = { showBottomSheet = false },
            onSubmit = { title, description, priority, category, dueDate ->
                if (todoToEdit != null) {
                    viewModel.updateTodo(
                        id = todoToEdit!!.id,
                        title = title,
                        description = description,
                        priority = priority,
                        category = category,
                        dueDate = dueDate,
                        isCompleted = todoToEdit!!.isCompleted
                    )
                } else {
                    viewModel.addTodo(
                        title = title,
                        description = description,
                        priority = priority,
                        category = category,
                        dueDate = dueDate
                    )
                }
                showBottomSheet = false
            }
        )
    }
}
