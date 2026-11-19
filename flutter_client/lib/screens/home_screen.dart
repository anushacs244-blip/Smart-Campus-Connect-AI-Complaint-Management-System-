/**
 * CampusConnect AI - Main Interface (Home Screen) in Dart
 * Author: SPA
 * 
 * Replicates the web Main Interface:
 * - Top navigation with Student & Admin Portal triggers
 * - Gradient hero banner
 * - Interactive AI Conversation Tool embedded on the main interface
 * - Dedicated Student Grievance & Admin Evaluation feature cards
 * - Author branding: Developed by SPA
 */

import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/ai_chat_widget.dart';
import 'auth/login_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: AppColors.primary,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.smart_toy_rounded, color: Colors.white, size: 20),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: const [
                Text(
                  "Smart Campus Connect",
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                ),
                Text(
                  "Developed by SPA",
                  style: TextStyle(fontSize: 10.5, fontWeight: FontWeight.w600, color: AppColors.primary),
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Student Portal Button
          TextButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen(initialTab: 'student')),
              );
            },
            icon: const Icon(Icons.school_outlined, size: 16, color: AppColors.primary),
            label: const Text(
              "Complaint System",
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.primary),
            ),
            style: TextButton.styleFrom(
              backgroundColor: AppColors.primaryLight,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
                side: const BorderSide(color: AppColors.primaryBorder),
              ),
            ),
          ),
          const SizedBox(width: 8),

          // Admin Portal Button
          ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const LoginScreen(initialTab: 'admin')),
              );
            },
            icon: const Icon(Icons.admin_panel_settings_outlined, size: 16, color: Colors.white),
            label: const Text(
              "Admin Portal",
              style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.purple,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
          ),
          const SizedBox(width: 12),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // 🔹 Hero Header
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF4338CA), Color(0xFF4F46E5), Color(0xFF0284C7)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 800),
                  child: Column(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: const Text(
                          "✨ AI Campus Intelligence • Student Complaint Management System • Admin Evaluation Center",
                          style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Colors.white),
                        ),
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        "Smart Campus Assistant & Complaint Management System",
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          height: 1.25,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        "Ask any question to the live AI Assistant below, lodge and track campus grievances in the Student Complaint Management System, or evaluate complaints in the Admin Center.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.9), height: 1.4),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            // 🔹 Interactive AI Chat Widget Section
            Transform.translate(
              offset: const Offset(0, -20),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 900),
                    child: const AiChatWidget(),
                  ),
                ),
              ),
            ),

            // 🔹 Two Module Cards
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 900),
                  child: LayoutBuilder(
                    builder: (context, constraints) {
                      final isWide = constraints.maxWidth > 650;
                      return isWide
                          ? Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Expanded(child: _buildStudentCard(context)),
                                const SizedBox(width: 20),
                                Expanded(child: _buildAdminCard(context)),
                              ],
                            )
                          : Column(
                              children: [
                                _buildStudentCard(context),
                                const SizedBox(height: 16),
                                _buildAdminCard(context),
                              ],
                            );
                    },
                  ),
                ),
              ),
            ),

            // 🔹 Footer
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 24),
              color: Colors.white,
              child: Center(
                child: Column(
                  children: const [
                    Text(
                      "Smart Campus Connect © 2026 • Developed by SPA",
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textSecondary),
                    ),
                    SizedBox(height: 4),
                    Text(
                      "Dart / Flutter Frontend Architecture & Node.js MERN REST APIs",
                      style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.primaryBorder),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.school_rounded, color: AppColors.primary, size: 24),
          ),
          const SizedBox(height: 14),
          const Text(
            "1. Student Complaint Management System",
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 8),
          const Text(
            "Students can lodge campus complaints by selecting category, incident date, time, location, and severity level (Level 1 to 4). Monitor real-time status and read official administrative action feedback.",
            style: TextStyle(fontSize: 12.5, color: AppColors.textSecondary, height: 1.45),
          ),
          const SizedBox(height: 18),
          const Divider(color: AppColors.border),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Demo: student@campus.edu", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
              TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen(initialTab: 'student')),
                  );
                },
                icon: const Text("Enter Portal", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                label: const Icon(Icons.arrow_forward_rounded, size: 14),
                style: TextButton.styleFrom(foregroundColor: AppColors.primary),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildAdminCard(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.purpleBorder),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 8, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(color: AppColors.purpleLight, borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.shield_outlined, color: AppColors.purple, size: 24),
          ),
          const SizedBox(height: 14),
          const Text(
            "2. Admin Complaints Evaluation Center",
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
          const SizedBox(height: 8),
          const Text(
            "Campus administrators review grievances, verify incident time/level, update resolution workflow (Pending ➔ Under Review ➔ Resolved), log work orders, and return official feedback to students.",
            style: TextStyle(fontSize: 12.5, color: AppColors.textSecondary, height: 1.45),
          ),
          const SizedBox(height: 18),
          const Divider(color: AppColors.border),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Demo: spa@campusconnect.com", style: TextStyle(fontSize: 11, color: AppColors.textMuted)),
              TextButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const LoginScreen(initialTab: 'admin')),
                  );
                },
                icon: const Text("Enter Center", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                label: const Icon(Icons.arrow_forward_rounded, size: 14),
                style: TextButton.styleFrom(foregroundColor: AppColors.purple),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
