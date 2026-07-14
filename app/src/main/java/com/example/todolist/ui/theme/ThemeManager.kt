package com.example.todolist.ui.theme

import android.content.Context
import android.content.SharedPreferences

class ThemeManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("theme_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val KEY_IS_DARK_MODE = "is_dark_mode"
    }

    fun isDarkMode(systemInDarkTheme: Boolean): Boolean {
        // If no preference is saved, follow system theme
        return prefs.getBoolean(KEY_IS_DARK_MODE, systemInDarkTheme)
    }

    fun setDarkMode(isDark: Boolean) {
        prefs.edit().putBoolean(KEY_IS_DARK_MODE, isDark).apply()
    }
}
