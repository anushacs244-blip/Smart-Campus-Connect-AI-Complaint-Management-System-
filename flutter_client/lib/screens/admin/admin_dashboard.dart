/**
 * CampusConnect AI - Admin Dashboard & Evaluation Center (Dart)
 * Author: SPA
 * 
 * Administration Center:
 * - Evaluate student grievances, update status, and return official feedback
 * - Manage notices, events, and faculty (instantly reflected in AI storage)
 * - View university profile
 */

import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/api_service.dart';
import '../../models/complaint_model.dart';
import '../../models/campus_models.dart';
import '../../widgets/complaint_card.dart';
import '../../widgets/evaluate_dialog.dart';
import '../home_screen.dart';

class AdminDashboard extends StatefulWidget {
  const AdminDashboard({super.key});

  @override
  State<AdminDashboard> createState() => _AdminDashboardState();
}

class _AdminDashboardState extends State<AdminDashboard> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  // Complaints State
  List<ComplaintModel> _complaints = [];
  bool _isLoadingComplaints = true;
  String _complaintFilter = 'All';

  // Notices State
  List<NoticeModel> _notices = [];
  bool _isLoadingNotices = true;

  // Events State
  List<EventModel> _events = [];
  bool _isLoadingEvents = true;

  // Faculty State
  List<FacultyModel> _faculty = [];
  bool _isLoadingFaculty = true;

  // University State
  UniversityModel? _university;
  bool _isLoadingUniv = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 5, vsync: this);
    _loadComplaints();
    _loadNotices();
    _loadEvents();
    _loadFaculty();
    _loadUniversity();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadComplaints() async {
    setState(() => _isLoadingComplaints = true);
    try {
      final list = await ApiService.getAllComplaints(status: _complaintFilter);
      if (mounted) setState(() => _complaints = list);
    } catch (_) {}
    if (mounted) setState(() => _isLoadingComplaints = false);
  }

  Future<void> _loadNotices() async {
    setState(() => _isLoadingNotices = true);
    try {
      final list = await ApiService.getNotices();
      if (mounted) setState(() => _notices = list);
    } catch (_) {}
    if (mounted) setState(() => _isLoadingNotices = false);
  }

  Future<void> _loadEvents() async {
    setState(() => _isLoadingEvents = true);
    try {
      final list = await ApiService.getEvents();
      if (mounted) setState(() => _events = list);
    } catch (_) {}
    if (mounted) setState(() => _isLoadingEvents = false);
  }

  Future<void> _loadFaculty() async {
    setState(() => _isLoadingFaculty = true);
    try {
      final list = await ApiService.getFaculty();
      if (mounted) setState(() => _faculty = list);
    } catch (_) {}
    if (mounted) setState(() => _isLoadingFaculty = false);
  }

  Future<void> _loadUniversity() async {
    setState(() => _isLoadingUniv = true);
    try {
      final u = await ApiService.getUniversity();
      if (mounted) setState(() => _university = u);
    } catch (_) {}
    if (mounted) setState(() => _isLoadingUniv = false);
  }

  // 🔹 Add Notice Dialog
  void _showAddNoticeDialog() {
    final titleCtrl = TextEditingController();
    final detailsCtrl = TextEditingController();
    final issuedByCtrl = TextEditingController(text: "Campus Administration");

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Post Campus Notice", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleCtrl, decoration: const InputDecoration(hintText: "Notice Title")),
            const SizedBox(height: 10),
            TextField(controller: detailsCtrl, maxLines: 3, decoration: const InputDecoration(hintText: "Notice Details")),
            const SizedBox(height: 10),
            TextField(controller: issuedByCtrl, decoration: const InputDecoration(hintText: "Issued By")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (titleCtrl.text.isNotEmpty && detailsCtrl.text.isNotEmpty) {
                await ApiService.addNotice(
                  title: titleCtrl.text.trim(),
                  details: detailsCtrl.text.trim(),
                  issuedBy: issuedByCtrl.text.trim(),
                );
                Navigator.pop(context);
                _loadNotices();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Notice posted! Immediately queryable by the AI.")),
                );
              }
            },
            child: const Text("Publish"),
          ),
        ],
      ),
    );
  }

  // 🔹 Add Event Dialog
  void _showAddEventDialog() {
    final titleCtrl = TextEditingController();
    final venueCtrl = TextEditingController();
    final dateCtrl = TextEditingController(text: "2026-12-20");

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Schedule Campus Event", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: titleCtrl, decoration: const InputDecoration(hintText: "Event Title")),
            const SizedBox(height: 10),
            TextField(controller: venueCtrl, decoration: const InputDecoration(hintText: "Venue / Hall")),
            const SizedBox(height: 10),
            TextField(controller: dateCtrl, decoration: const InputDecoration(hintText: "Date (YYYY-MM-DD)")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (titleCtrl.text.isNotEmpty && venueCtrl.text.isNotEmpty) {
                await ApiService.addEvent(
                  title: titleCtrl.text.trim(),
                  venue: venueCtrl.text.trim(),
                  eventDate: dateCtrl.text.trim(),
                );
                Navigator.pop(context);
                _loadEvents();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Event scheduled! Immediately queryable by the AI.")),
                );
              }
            },
            child: const Text("Add Event"),
          ),
        ],
      ),
    );
  }

  // 🔹 Add Faculty Dialog
  void _showAddFacultyDialog() {
    final nameCtrl = TextEditingController();
    final deptCtrl = TextEditingController(text: "Computer Engineering");
    final desigCtrl = TextEditingController(text: "Assistant Professor");
    final emailCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("Add Faculty Member", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: nameCtrl, decoration: const InputDecoration(hintText: "Full Name (e.g. Dr. Kavita)")),
            const SizedBox(height: 10),
            TextField(controller: deptCtrl, decoration: const InputDecoration(hintText: "Department")),
            const SizedBox(height: 10),
            TextField(controller: desigCtrl, decoration: const InputDecoration(hintText: "Designation")),
            const SizedBox(height: 10),
            TextField(controller: emailCtrl, decoration: const InputDecoration(hintText: "Official Email")),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text("Cancel")),
          ElevatedButton(
            onPressed: () async {
              if (nameCtrl.text.isNotEmpty) {
                await ApiService.addFaculty(
                  name: nameCtrl.text.trim(),
                  department: deptCtrl.text.trim(),
                  designation: desigCtrl.text.trim(),
                  email: emailCtrl.text.trim(),
                );
                Navigator.pop(context);
                _loadFaculty();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text("Faculty profile added! Immediately queryable by the AI.")),
                );
              }
            },
            child: const Text("Add Member"),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bg,
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(color: AppColors.purpleLight, borderRadius: BorderRadius.circular(8)),
              child: const Icon(Icons.shield_rounded, color: AppColors.purple, size: 20),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Admin Evaluation Center", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15)),
                Text("Smart Campus Connect • Developed by SPA", style: TextStyle(fontSize: 10, color: AppColors.purple)),
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
            tooltip: "Main Interface",
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
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          labelColor: AppColors.purple,
          unselectedLabelColor: AppColors.textMuted,
          indicatorColor: AppColors.purple,
          indicatorWeight: 3,
          tabs: const [
            Tab(icon: Icon(Icons.rate_review_outlined, size: 18), text: "Complaints"),
            Tab(icon: Icon(Icons.campaign_outlined, size: 18), text: "Notices"),
            Tab(icon: Icon(Icons.event_outlined, size: 18), text: "Events"),
            Tab(icon: Icon(Icons.group_outlined, size: 18), text: "Faculty"),
            Tab(icon: Icon(Icons.account_balance_outlined, size: 18), text: "University"),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          // 🔹 TAB 1: COMPLAINTS EVALUATION
          _buildComplaintsTab(),

          // 🔹 TAB 2: NOTICES
          _buildNoticesTab(),

          // 🔹 TAB 3: EVENTS
          _buildEventsTab(),

          // 🔹 TAB 4: FACULTY
          _buildFacultyTab(),

          // 🔹 TAB 5: UNIVERSITY
          _buildUniversityTab(),
        ],
      ),
    );
  }

  // 1. Complaints Tab
  Widget _buildComplaintsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 850),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Filter Chips
              Wrap(
                spacing: 8,
                children: ['All', 'Pending', 'Under Review', 'Resolved'].map((st) {
                  final isSelected = _complaintFilter == st;
                  return ChoiceChip(
                    label: Text(st),
                    selected: isSelected,
                    selectedColor: AppColors.purpleLight,
                    labelStyle: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? AppColors.purple : AppColors.textSecondary,
                    ),
                    onSelected: (val) {
                      if (val) {
                        setState(() => _complaintFilter = st);
                        _loadComplaints();
                      }
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 16),

              if (_isLoadingComplaints)
                const Padding(
                  padding: EdgeInsets.all(40),
                  child: Center(child: CircularProgressIndicator(color: AppColors.purple)),
                )
              else if (_complaints.isEmpty)
                Container(
                  padding: const EdgeInsets.all(40),
                  decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
                  child: const Center(child: Text("No student complaints matching this filter.")),
                )
              else
                ..._complaints.map((c) => ComplaintCard(
                      complaint: c,
                      isAdminView: true,
                      onEvaluate: () {
                        showDialog(
                          context: context,
                          builder: (_) => EvaluateDialog(
                            complaint: c,
                            onSaved: _loadComplaints,
                          ),
                        );
                      },
                    )),
            ],
          ),
        ),
      ),
    );
  }

  // 2. Notices Tab
  Widget _buildNoticesTab() {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddNoticeDialog,
        backgroundColor: AppColors.purple,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Add Notice", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: _isLoadingNotices
          ? const Center(child: CircularProgressIndicator(color: AppColors.purple))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _notices.length,
              itemBuilder: (context, idx) {
                final n = _notices[idx];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundColor: AppColors.primaryLight,
                      child: const Icon(Icons.campaign, color: AppColors.primary),
                    ),
                    title: Text(n.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4),
                        Text(n.details),
                        const SizedBox(height: 6),
                        Text("Issued by: ${n.issuedBy} • Date: ${n.date}", style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }

  // 3. Events Tab
  Widget _buildEventsTab() {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddEventDialog,
        backgroundColor: AppColors.purple,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Add Event", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: _isLoadingEvents
          ? const Center(child: CircularProgressIndicator(color: AppColors.purple))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _events.length,
              itemBuilder: (context, idx) {
                final e = _events[idx];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundColor: AppColors.purpleLight,
                      child: const Icon(Icons.event, color: AppColors.purple),
                    ),
                    title: Text(e.title, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text("Date: ${e.eventDate} • Venue: ${e.venue}"),
                  ),
                );
              },
            ),
    );
  }

  // 4. Faculty Tab
  Widget _buildFacultyTab() {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showAddFacultyDialog,
        backgroundColor: AppColors.purple,
        icon: const Icon(Icons.add, color: Colors.white),
        label: const Text("Add Faculty", style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
      ),
      body: _isLoadingFaculty
          ? const Center(child: CircularProgressIndicator(color: AppColors.purple))
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _faculty.length,
              itemBuilder: (context, idx) {
                final f = _faculty[idx];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(16),
                    leading: CircleAvatar(
                      backgroundColor: AppColors.skyLight,
                      child: const Icon(Icons.person, color: AppColors.sky),
                    ),
                    title: Text(f.name, style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text("${f.designation} • ${f.department}\nEmail: ${f.email ?? 'N/A'}"),
                  ),
                );
              },
            ),
    );
  }

  // 5. University Tab
  Widget _buildUniversityTab() {
    if (_isLoadingUniv) {
      return const Center(child: CircularProgressIndicator(color: AppColors.purple));
    }
    final u = _university;
    if (u == null) return const Center(child: Text("Unable to load university profile"));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 700),
          child: Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: AppColors.border)),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(u.name, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                const SizedBox(height: 4),
                Text("Institution Code: ${u.code} • Established: ${u.establishedYear}", style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 12),
                _buildUnivRow("Chancellor", u.chancellor),
                _buildUnivRow("Vice Chancellor", u.viceChancellor),
                _buildUnivRow("Location", u.location),
                _buildUnivRow("Accreditation", u.accreditation),
                _buildUnivRow("Contact Email", u.contactEmail),
                _buildUnivRow("Contact Phone", u.contactPhone),
                _buildUnivRow("Website", u.website),
                const SizedBox(height: 12),
                const Divider(),
                const SizedBox(height: 12),
                const Text("Vision", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                Text(u.vision, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
                const SizedBox(height: 12),
                const Text("Mission", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 4),
                Text(u.mission, style: const TextStyle(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildUnivRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 140, child: Text(label, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13))),
          Expanded(child: Text(value, style: const TextStyle(fontSize: 13, color: AppColors.textSecondary))),
        ],
      ),
    );
  }
}
