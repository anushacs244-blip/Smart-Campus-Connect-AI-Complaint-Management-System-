/**
 * CampusConnect AI - Admin Evaluate Dialog (Dart)
 * Author: SPA
 * 
 * Allows Administrators to evaluate grievances, update status, and return feedback to students.
 */

import 'package:flutter/material.dart';
import '../models/complaint_model.dart';
import '../services/api_service.dart';
import '../theme/app_theme.dart';

class EvaluateDialog extends StatefulWidget {
  final ComplaintModel complaint;
  final VoidCallback onSaved;

  const EvaluateDialog({
    super.key,
    required this.complaint,
    required this.onSaved,
  });

  @override
  State<EvaluateDialog> createState() => _EvaluateDialogState();
}

class _EvaluateDialogState extends State<EvaluateDialog> {
  late String _status;
  late TextEditingController _feedbackController;
  late TextEditingController _actionController;
  bool _isLoading = false;

  final List<String> _statusOptions = ['Pending', 'Under Review', 'Resolved'];

  @override
  void initState() {
    super.initState();
    _status = widget.complaint.status;
    _feedbackController = TextEditingController(text: widget.complaint.adminFeedback ?? '');
    _actionController = TextEditingController(text: widget.complaint.actionTaken ?? '');
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    _actionController.dispose();
    super.dispose();
  }

  Future<void> _submitEvaluation() async {
    final feedback = _feedbackController.text.trim();
    final action = _actionController.text.trim();

    if (feedback.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter return feedback for the student.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      await ApiService.evaluateComplaint(
        id: widget.complaint.id,
        status: _status,
        adminFeedback: feedback,
        actionTaken: action.isNotEmpty ? action : 'Reviewed by Campus Administration',
      );

      if (mounted) {
        Navigator.of(context).pop();
        widget.onSaved();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Evaluation and feedback returned successfully!')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      backgroundColor: Colors.white,
      child: Container(
        padding: const EdgeInsets.all(22),
        constraints: const BoxConstraints(maxWidth: 500),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: AppColors.purpleLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.rate_review_rounded, color: AppColors.purple, size: 22),
                  ),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          "Evaluate Student Grievance",
                          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                        ),
                        Text(
                          "Update status and write official feedback to student",
                          style: TextStyle(fontSize: 11, color: AppColors.textMuted),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(Icons.close, size: 20, color: AppColors.textMuted),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              const Divider(color: AppColors.border),
              const SizedBox(height: 12),

              // Complaint Summary
              Text(
                widget.complaint.title,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 4),
              Text(
                "By ${widget.complaint.studentName} (${widget.complaint.studentRoll}) • Category: ${widget.complaint.category} • ${widget.complaint.complaintLevel}",
                style: const TextStyle(fontSize: 11.5, color: AppColors.textSecondary),
              ),
              const SizedBox(height: 16),

              // Status Dropdown
              const Text("Resolution Status", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              DropdownButtonFormField<String>(
                value: _status,
                items: _statusOptions.map((s) {
                  return DropdownMenuItem(value: s, child: Text(s, style: const TextStyle(fontSize: 13)));
                }).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _status = val);
                },
                decoration: const InputDecoration(contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10)),
              ),
              const SizedBox(height: 14),

              // Action Taken
              const Text("Action Taken / Work Order", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: _actionController,
                style: const TextStyle(fontSize: 13),
                decoration: const InputDecoration(
                  hintText: "e.g. Work Order #NET-409 issued, Hardware replaced, etc.",
                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                ),
              ),
              const SizedBox(height: 14),

              // Administrative Feedback
              const Text("Official Return Feedback (Visible to Student)", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: _feedbackController,
                maxLines: 4,
                style: const TextStyle(fontSize: 13),
                decoration: const InputDecoration(
                  hintText: "Write clear feedback informing the student of actions taken or investigation findings...",
                  contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
              ),
              const SizedBox(height: 20),

              // Actions
              Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  TextButton(
                    onPressed: () => Navigator.of(context).pop(),
                    child: const Text("Cancel", style: TextStyle(color: AppColors.textSecondary)),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _submitEvaluation,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.purple,
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    ),
                    child: _isLoading
                      ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                      : const Text("Return Feedback", style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
