package com.example.todolist

import android.os.Bundle
import android.content.Context
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.todolist.ui.screens.LoginScreen
import com.example.todolist.ui.screens.TodoHomeScreen
import com.example.todolist.ui.screens.WelcomeScreen
import com.example.todolist.ui.theme.TodoListTheme
import com.example.todolist.viewmodel.TodoViewModel
import androidx.core.content.edit

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        
        val todoViewModel = ViewModelProvider(
            this,
            TodoViewModel.Factory(application)
        )[TodoViewModel::class.java]

        setContent {
            val isDarkMode by todoViewModel.isDarkMode.collectAsState()
            val navController = rememberNavController()
            val context = LocalContext.current
            val prefs = remember { context.getSharedPreferences("app_prefs", Context.MODE_PRIVATE) }
            val isLoggedIn = remember { mutableStateOf(prefs.getBoolean("is_logged_in", false)) }

            TodoListTheme(darkTheme = isDarkMode) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    NavHost(
                        navController = navController,
                        startDestination = if (isLoggedIn.value) "home" else "welcome",
                        enterTransition = {
                            slideInHorizontally(initialOffsetX = { 1000 }, animationSpec = tween(500)) + fadeIn(animationSpec = tween(500))
                        },
                        exitTransition = {
                            slideOutHorizontally(targetOffsetX = { -1000 }, animationSpec = tween(500)) + fadeOut(animationSpec = tween(500))
                        },
                        popEnterTransition = {
                            slideInHorizontally(initialOffsetX = { -1000 }, animationSpec = tween(500)) + fadeIn(animationSpec = tween(500))
                        },
                        popExitTransition = {
                            slideOutHorizontally(targetOffsetX = { 1000 }, animationSpec = tween(500)) + fadeOut(animationSpec = tween(500))
                        }
                    ) {
                        composable("welcome") {
                            WelcomeScreen {
                                navController.navigate("login")
                            }
                        }
                        composable("login") {
                            LoginScreen {
                                prefs.edit { putBoolean("is_logged_in", true) }
                                isLoggedIn.value = true
                                navController.navigate("home") {
                                    popUpTo("welcome") { inclusive = true }
                                }
                            }
                        }
                        composable("home") {
                            TodoHomeScreen(viewModel = todoViewModel)
                        }
                    }
                }
            }
        }
    }
}
