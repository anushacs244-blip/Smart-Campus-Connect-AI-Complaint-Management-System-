/**
 * CampusConnect AI - Dual-Tab Register Screen (Dart)
 * Author: SPA
 * 
 * Provides dedicated Student Registration & Admin Registration with passkey validation.
 */

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/api_service.dart';
import '../student/student_dashboard.dart';
import '../admin/admin_dashboard.dart';
import 'login_screen.dart';

class RegisterScreen extends StatefulWidget {
  final String initialTab;

  const RegisterScreen({super.key, this.initialTab = 'student'});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  late bool _isStudent;

  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _rollController = TextEditingController();
  final TextEditingController _deptController = TextEditingController(text: 'Computer Engineering');
  final TextEditingController _adminCodeController = TextEditingController(text: 'ADMIN2026');

  bool _isLoading = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _isStudent = widget.initialTab == 'student';
  }

  Future<void> _handleRegister() async {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();
    final dept = _deptController.text.trim();

    if (name.isEmpty || email.isEmpty || password.isEmpty) {
      setState(() => _errorMessage = 'Please complete all required fields.');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      if (_isStudent) {
        final roll = _rollController.text.trim();
        if (roll.isEmpty) throw Exception('Roll number is required for students.');

        await ApiService.registerStudent(
          name: name,
          email: email,
          password: password,
          rollNumber: roll,
          department: dept,
        );

        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const StudentDashboard()),
        );
      } else {
        final code = _adminCodeController.text.trim();
        if (code.isEmpty) throw Exception('Admin authorization passcode is required.');

        await ApiService.registerAdmin(
          name: name,
          email: email,
          password: password,
          department: dept,
          adminCode: code,
        );

        if (!mounted) return;
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const AdminDashboard()),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _errorMessage = e.toString().replaceAll('Exception: ', ''));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final primaryColor = _isStudent ? AppColors.primary : AppColors.purple;

    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: Text(
          _isStudent ? "Student Registration" : "Administrator Registration",
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 460),
            child: Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 16, offset: const Offset(0, 8)),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Dual-Tab Switcher
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Row(
                      children: [
                        Expanded(
                          child: InkWell(
                            onTap: () => setState(() => _isStudent = true),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: _isStudent ? Colors.white : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.school_rounded, size: 16, color: _isStudent ? AppColors.primary : AppColors.textMuted),
                                  const SizedBox(width: 6),
                                  Text("Student", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: _isStudent ? AppColors.primary : AppColors.textMuted)),
                                ],
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: InkWell(
                            onTap: () => setState(() => _isStudent = false),
                            child: Container(
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              decoration: BoxDecoration(
                                color: !_isStudent ? Colors.white : Colors.transparent,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(Icons.admin_panel_settings_rounded, size: 16, color: !_isStudent ? AppColors.purple : AppColors.textMuted),
                                  const SizedBox(width: 6),
                                  Text("Admin", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: !_isStudent ? AppColors.purple : AppColors.textMuted)),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Error Message
                  if (_errorMessage != null) ...[
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF2F2),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFFCA5A5)),
                      ),
                      child: Text(_errorMessage!, style: const TextStyle(fontSize: 12, color: Color(0xFFDC2626))),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Full Name
                  const Text("Full Name", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(controller: _nameController, decoration: const InputDecoration(hintText: "e.g. Rahul Verma")),
                  const SizedBox(height: 14),

                  // Email
                  const Text("Email Address", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(controller: _emailController, decoration: const InputDecoration(hintText: "e.g. rahul@campus.edu")),
                  const SizedBox(height: 14),

                  // Password
                  const Text("Password", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(hintText: "••••••••")),
                  const SizedBox(height: 14),

                  // Student-Specific: Roll Number
                  if (_isStudent) ...[
                    const Text("Student Roll Number", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    TextField(controller: _rollController, decoration: const InputDecoration(hintText: "e.g. CS-2024-042")),
                    const SizedBox(height: 14),
                  ],

                  // Department
                  const Text("Academic Department", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 6),
                  TextField(controller: _deptController, decoration: const InputDecoration(hintText: "e.g. Computer Engineering")),
                  const SizedBox(height: 14),

                  // Admin-Specific: Passcode
                  if (!_isStudent) ...[
                    const Text("Admin Authorization Passcode", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 6),
                    TextField(controller: _adminCodeController, decoration: const InputDecoration(hintText: "Default: ADMIN2026")),
                    const SizedBox(height: 14),
                  ],

                  const SizedBox(height: 8),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleRegister,
                    style: ElevatedButton.styleFrom(backgroundColor: primaryColor, padding: const EdgeInsets.symmetric(vertical: 14)),
                    child: _isLoading
                        ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                        : Text(_isStudent ? "Create Student Account" : "Register as Administrator", style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                  const SizedBox(height: 16),

                  Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text("Already have an account? ", style: TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                        InkWell(
                          onTap: () {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(builder: (_) => LoginScreen(initialTab: _isStudent ? 'student' : 'admin')),
                            );
                          },
                          child: Text("Sign In", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: primaryColor)),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
