/**
 * CampusConnect AI - App Theme & Colors
 * Author: SPA
 * 
 * Replicates the exact Tailwind CSS color palette and styling of the web interface.
 */

import 'package:flutter/material.dart';

class AppColors {
  // Primary (Indigo) - Main Theme & Student Portal
  static const Color primary = Color(0xFF4F46E5);
  static const Color primaryDark = Color(0xFF4338CA);
  static const Color primaryLight = Color(0xFFEEF2FF);
  static const Color primaryBorder = Color(0xFFC7D2FE);

  // Secondary (Purple) - Admin Portal
  static const Color purple = Color(0xFF9333EA);
  static const Color purpleDark = Color(0xFF7E22CE);
  static const Color purpleLight = Color(0xFFFAF5FF);
  static const Color purpleBorder = Color(0xFFE9D5FF);

  // Accent (Sky Blue)
  static const Color sky = Color(0xFF0284C7);
  static const Color skyLight = Color(0xFFE0F2FE);

  // Neutrals (Slate)
  static const Color bg = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderLight = Color(0xFFF1F5F9);

  // Typography
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color textMuted = Color(0xFF94A3B8);

  // Status Colors
  static const Color success = Color(0xFF059669);
  static const Color danger = Color(0xFFDC2626);

  static const Color pendingBg = Color(0xFFFEF3C7);
  static const Color pendingText = Color(0xFFD97706);

  static const Color reviewBg = Color(0xFFDBEAFE);
  static const Color reviewText = Color(0xFF2563EB);

  static const Color resolvedBg = Color(0xFFD1FAE5);
  static const Color resolvedText = Color(0xFF059669);

  static const Color actionBg = Color(0xFFEDE9FE);
  static const Color actionText = Color(0xFF7C3AED);

  // Severity Colors
  static const Color level1 = Color(0xFF059669); // Low - Green
  static const Color level2 = Color(0xFFD97706); // Moderate - Amber
  static const Color level3 = Color(0xFFEA580C); // High - Orange
  static const Color level4 = Color(0xFFDC2626); // Urgent - Red
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primary,
        surface: AppColors.surface,
        primary: AppColors.primary,
        secondary: AppColors.purple,
      ),
      scaffoldBackgroundColor: AppColors.bg,
      fontFamily: 'Inter',
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: AppColors.textPrimary,
        elevation: 0,
        centerTitle: false,
        surfaceTintColor: Colors.transparent,
      ),
      cardTheme: CardThemeData(
        color: AppColors.cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.border),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFFF8FAFC),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.border),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        hintStyle: const TextStyle(color: AppColors.textMuted, fontSize: 14),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
      ),
    );
  }
}
