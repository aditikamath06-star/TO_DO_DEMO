package com.example.todolist.model

import androidx.compose.ui.graphics.Color

enum class TodoPriority(val label: String, val color: Color) {
    HIGH("High", Color(0xFFEF5350)),     // Bright Coral Red
    MEDIUM("Medium", Color(0xFFFFB74D)), // Amber Orange
    LOW("Low", Color(0xFF66BB6A))       // Mint Green
}
