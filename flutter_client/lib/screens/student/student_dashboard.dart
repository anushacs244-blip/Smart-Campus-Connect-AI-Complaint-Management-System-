/**
 * CampusConnect AI - Student Dashboard (Dart)
 * Author: SPA
 * 
 * Student Grievance & Complaint Redressal Portal:
 * - View all lodged complaints with live status updates
 * - View official feedback and action returned by campus administrators
 * - Lodge new complaint with category and severity levels
 */

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/api_service.dart';
import '../../models/complaint_model.dart';
import '../../widgets/complaint_card.dart';
import 'lodge_complaint_screen.dart';
import '../home_screen.dart';

class StudentDashboard extends StatefulWidget {
  const StudentDashboard({super.key});

  @override
  State<StudentDashboard> createState() => _StudentDashboardState();
}

class _StudentDashboardState extends State<StudentDashboard> {
  List<ComplaintModel> _complaints = [];
  bool _isLoading = true;
  String _selectedStatus = 'All';

  final List<String> _statusFilters = ['All', 'Pending', 'Under Review', 'Resolved'];

  @override
  void initState() {
    super.initState();
    _loadComplaints();
  }

  Future<void> _loadComplaints() async {
    setState(() => _isLoading = true);
    try {
      final list = await ApiService.getMyComplaints();
      if (mounted) {
        setState(() {
          _complaints = list;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to load complaints: $e')),
        );
      }
    }
  }

  List<ComplaintModel> get _filteredComplaints {
    if (_selectedStatus == 'All') return _complaints;
    return _complaints.where((c) => c.status.toLowerCase() == _selectedStatus.toLowerCase()).toList();
  }

  @override
  Widget build(BuildContext context) {
    final user = ApiService.currentUser;

    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: AppColors.primaryLight, borderRadius: BorderRadius.circular(8)),
              child: const Icon(Icons.school_rounded, color: AppColors.primary, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Student Grievance Portal", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text("Smart Campus Connect • Developed by SPA", style: TextStyle(fontSize: 10, color: AppColors.primary)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const HomeScreen()),
                (route) => false,
              );
            },
            icon: const Icon(Icons.home_outlined),
            tooltip: "Home Interface",
          ),
          IconButton(
            onPressed: () {
              ApiService.logout();
              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(builder: (_) => const HomeScreen()),
                (route) => false,
              );
            },
            icon: const Icon(Icons.logout_rounded),
            tooltip: "Logout",
          ),
          const SizedBox(width: 8),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          final created = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const LodgeComplaintScreen()),
          );
          if (created == true) _loadComplaints();
        },
        backgroundColor: AppColors.primary,
        icon: const Icon(Icons.add_rounded, color: Colors.white),
        label: const Text("Lodge Grievance", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // 🔹 Student Info Banner
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Row(
                    children: [
                      CircleAvatar(
                        radius: 26,
                        backgroundColor: AppColors.primaryLight,
                        child: const Icon(Icons.person, color: AppColors.primary, size: 28),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              user?.name ?? "Rahul Verma",
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              "Roll: ${user?.rollNumber ?? 'CS-2024-042'} • Department: ${user?.department ?? 'Computer Engineering'}",
                              style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                            ),
                          ],
                        ),
                      ),
                      ElevatedButton.icon(
                        onPressed: () async {
                          final created = await Navigator.push(
                            context,
                            MaterialPageRoute(builder: (_) => const LodgeComplaintScreen()),
                          );
                          if (created == true) _loadComplaints();
                        },
                        icon: const Icon(Icons.add, size: 16),
                        label: const Text("New Complaint", style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // 🔹 Status Filter Bar
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "My Grievance History",
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                    ),
                    IconButton(
                      onPressed: _loadComplaints,
                      icon: const Icon(Icons.refresh_rounded, size: 20, color: AppColors.textSecondary),
                      tooltip: "Refresh List",
                    ),
                  ],
                ),
                const SizedBox(height: 10),

                // Filter Chips
                Wrap(
                  spacing: 8,
                  children: _statusFilters.map((st) {
                    final isSelected = _selectedStatus == st;
                    return ChoiceChip(
                      label: Text(st),
                      selected: isSelected,
                      selectedColor: AppColors.primaryLight,
                      labelStyle: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: isSelected ? AppColors.primary : AppColors.textSecondary,
                      ),
                      onSelected: (val) {
                        if (val) setState(() => _selectedStatus = st);
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),

                // 🔹 Complaints List
                if (_isLoading)
                  const Padding(
                    padding: EdgeInsets.all(40),
                    child: Center(child: CircularProgressIndicator(color: AppColors.primary)),
                  )
                else if (_filteredComplaints.isEmpty)
                  Container(
                    padding: const EdgeInsets.all(40),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: Column(
                      children: [
                        const Icon(Icons.inventory_2_outlined, size: 48, color: AppColors.textMuted),
                        const SizedBox(height: 12),
                        const Text(
                          "No complaints found",
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        const Text(
                          "You haven't lodged any grievances in this category.",
                          style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                        ),
                        const SizedBox(height: 16),
                        ElevatedButton.icon(
                          onPressed: () async {
                            final created = await Navigator.push(
                              context,
                              MaterialPageRoute(builder: (_) => const LodgeComplaintScreen()),
                            );
                            if (created == true) _loadComplaints();
                          },
                          icon: const Icon(Icons.add_rounded, size: 16),
                          label: const Text("Lodge Your First Complaint"),
                        ),
                      ],
                    ),
                  )
                else
                  ..._filteredComplaints.map((c) => ComplaintCard(complaint: c)),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
