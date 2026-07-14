package com.example.todolist.model

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.ui.graphics.vector.ImageVector

enum class TodoCategory(val label: String, val icon: ImageVector) {
    WORK("Work", Icons.Default.Build),
    PERSONAL("Personal", Icons.Default.Person),
    SHOPPING("Shopping", Icons.Default.ShoppingCart),
    EDUCATION("Education", Icons.AutoMirrored.Filled.List),
    OTHER("Other", Icons.Default.Info)
}
