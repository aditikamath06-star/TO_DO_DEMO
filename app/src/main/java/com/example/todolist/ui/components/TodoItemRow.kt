package com.example.todolist.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.todolist.model.TodoCategory
import com.example.todolist.model.TodoItem
import com.example.todolist.model.TodoPriority
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun TodoItemRow(
    todo: TodoItem,
    onToggleCompletion: () -> Unit,
    onDelete: () -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dateFormat = SimpleDateFormat("dd MMM, yyyy", Locale.getDefault())
    val isOverdue = todo.dueDate != null && todo.dueDate < System.currentTimeMillis() && !todo.isCompleted

    val cardAlpha by animateFloatAsState(
        targetValue = if (todo.isCompleted) 0.7f else 1.0f,
        label = "cardAlpha"
    )

    Card(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp)
            .alpha(cardAlpha)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface,
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(IntrinsicSize.Min),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .width(8.dp)
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                todo.priority.color,
                                todo.priority.color.copy(alpha = 0.6f)
                            )
                        )
                    )
            )

            Row(
                modifier = Modifier
                    .weight(1f)
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                CustomAnimatedCheckbox(
                    checked = todo.isCompleted,
                    onCheckedChange = onToggleCompletion,
                    priorityColor = todo.priority.color
                )

                Spacer(modifier = Modifier.width(16.dp))

                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = todo.title,
                        style = MaterialTheme.typography.titleMedium.copy(
                            fontWeight = FontWeight.SemiBold,
                            textDecoration = if (todo.isCompleted) TextDecoration.LineThrough else null
                        ),
                        color = if (todo.isCompleted) {
                            MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                        } else {
                            MaterialTheme.colorScheme.onSurface
                        },
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    if (todo.description.isNotEmpty()) {
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = todo.description,
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(
                                alpha = if (todo.isCompleted) 0.5f else 0.8f
                            ),
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.wrapContentSize()
                    ) {
                        val (catBg, catText) = getCategoryColors(todo.category)
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(catBg)
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Icon(
                                imageVector = todo.category.icon,
                                contentDescription = todo.category.label,
                                tint = catText,
                                modifier = Modifier.size(12.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = todo.category.label,
                                color = catText,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }

                        if (todo.dueDate != null) {
                            val (dateBg, dateText) = if (isOverdue) {
                                Pair(Color(0xFFFFEBEE), Color(0xFFC62828))
                            } else {
                                Pair(MaterialTheme.colorScheme.surfaceVariant, MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(dateBg)
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.DateRange,
                                    contentDescription = "Due Date",
                                    tint = dateText,
                                    modifier = Modifier.size(12.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = dateFormat.format(Date(todo.dueDate)),
                                    color = dateText,
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.width(8.dp))

                IconButton(onClick = onDelete) {
                    Icon(
                        imageVector = Icons.Default.Delete,
                        contentDescription = "Delete Todo",
                        tint = MaterialTheme.colorScheme.error.copy(alpha = 0.8f)
                    )
                }
            }
        }
    }
}

@Composable
fun CustomAnimatedCheckbox(
    checked: Boolean,
    onCheckedChange: () -> Unit,
    priorityColor: Color
) {
    val checkboxColor by animateColorAsState(
        targetValue = if (checked) priorityColor else Color.Transparent,
        label = "checkboxBg"
    )
    val borderColor by animateColorAsState(
        targetValue = if (checked) priorityColor else MaterialTheme.colorScheme.outline,
        label = "checkboxBorder"
    )

    Box(
        modifier = Modifier
            .size(24.dp)
            .clip(CircleShape)
            .background(checkboxColor)
            .border(2.dp, borderColor, CircleShape)
            .clickable { onCheckedChange() },
        contentAlignment = Alignment.Center
    ) {
        if (checked) {
            Icon(
                imageVector = Icons.Default.Check,
                contentDescription = "Checked",
                tint = Color.White,
                modifier = Modifier.size(16.dp)
            )
        }
    }
}

@Composable
fun getCategoryColors(category: TodoCategory): Pair<Color, Color> {
    return when (category) {
        TodoCategory.WORK -> Pair(Color(0xFFE8EAF6), Color(0xFF3F51B5))
        TodoCategory.PERSONAL -> Pair(Color(0xFFE1F5FE), Color(0xFF0288D1))
        TodoCategory.SHOPPING -> Pair(Color(0xFFEDE7F6), Color(0xFF673AB7))
        TodoCategory.EDUCATION -> Pair(Color(0xFFE8F5E9), Color(0xFF2E7D32))
        TodoCategory.OTHER -> Pair(Color(0xFFF5F5F5), Color(0xFF616161))
    }
}
