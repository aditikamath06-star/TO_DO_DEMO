package com.example.todolist.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun ProgressDashboard(
    completedCount: Int,
    totalCount: Int,
    modifier: Modifier = Modifier
) {
    val progress = if (totalCount > 0) completedCount.toFloat() / totalCount else 0.0f
    
    val animatedProgress by animateFloatAsState(
        targetValue = progress,
        label = "progressAnimation"
    )

    val gradientBrush = Brush.linearGradient(
        colors = listOf(
            Color(0xFF7C4DFF), // Deep Purple
            Color(0xFF00B0FF)  // Light Blue
        )
    )

    val motivationMessage = when {
        totalCount == 0 -> "Start your journey today! 🌟"
        completedCount == totalCount -> "Victory! You're on fire! 🔥🏆"
        progress >= 0.75f -> "Home stretch! You've got this! 🎯"
        progress >= 0.50f -> "Halfway mark passed! Keep going! 🚀"
        progress > 0.00f -> "Great momentum! Keep it up! 💪"
        else -> "Let's turn those goals into tasks! ✨"
    }

    Card(
        modifier = modifier
            .fillMaxWidth(),
        shape = RoundedCornerShape(28.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(gradientBrush)
                .padding(24.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = "Weekly Progress",
                        color = Color.White.copy(alpha = 0.8f),
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Medium
                    )
                    
                    Spacer(modifier = Modifier.height(4.dp))
                    
                    Text(
                        text = "$completedCount of $totalCount Tasks",
                        color = Color.White,
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.Bold
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = motivationMessage,
                        color = Color.White.copy(alpha = 0.9f),
                        style = MaterialTheme.typography.bodyMedium,
                        lineHeight = 20.sp
                    )
                }

                Spacer(modifier = Modifier.width(16.dp))

                Box(
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        progress = { 1.0f },
                        modifier = Modifier.size(80.dp),
                        color = Color.White.copy(alpha = 0.2f),
                        strokeWidth = 8.dp,
                    )
                    CircularProgressIndicator(
                        progress = { animatedProgress },
                        modifier = Modifier.size(80.dp),
                        color = Color.White,
                        strokeWidth = 8.dp,
                    )
                    Text(
                        text = "${(progress * 100).toInt()}%",
                        color = Color.White,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
