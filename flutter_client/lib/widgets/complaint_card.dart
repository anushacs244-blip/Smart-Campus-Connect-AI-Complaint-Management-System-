/**
 * CampusConnect AI - Complaint Card Widget (Dart)
 * Author: SPA
 * 
 * Displays student grievances with real-time status and Admin Return Feedback.
 */

import 'package:flutter/material.dart';
import '../models/complaint_model.dart';
import '../theme/app_theme.dart';

class ComplaintCard extends StatelessWidget {
  final ComplaintModel complaint;
  final VoidCallback? onEvaluate;
  final bool isAdminView;

  const ComplaintCard({
    super.key,
    required this.complaint,
    this.onEvaluate,
    this.isAdminView = false,
  });

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'resolved':
        return AppColors.resolvedText;
      case 'under review':
        return AppColors.reviewText;
      case 'action taken':
        return AppColors.actionText;
      default:
        return AppColors.pendingText;
    }
  }

  Color _getStatusBg(String status) {
    switch (status.toLowerCase()) {
      case 'resolved':
        return AppColors.resolvedBg;
      case 'under review':
        return AppColors.reviewBg;
      case 'action taken':
        return AppColors.actionBg;
      default:
        return AppColors.pendingBg;
    }
  }

  Color _getLevelColor(String level) {
    if (level.contains('4')) return AppColors.level4;
    if (level.contains('3')) return AppColors.level3;
    if (level.contains('2')) return AppColors.level2;
    return AppColors.level1;
  }

  @override
  Widget build(BuildContext context) {
    final statusColor = _getStatusColor(complaint.status);
    final statusBg = _getStatusBg(complaint.status);
    final levelColor = _getLevelColor(complaint.complaintLevel);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Row: Badges
            Row(
              children: [
                // Category
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppColors.primaryBorder),
                  ),
                  child: Text(
                    complaint.category,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ),
                const SizedBox(width: 8),

                // Severity Level
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: levelColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: levelColor.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    complaint.complaintLevel,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: levelColor,
                    ),
                  ),
                ),
                const Spacer(),

                // Status Pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                  decoration: BoxDecoration(
                    color: statusBg,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    complaint.status,
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: statusColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // Title
            Text(
              complaint.title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            const SizedBox(height: 6),

            // Description
            Text(
              complaint.description,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 12),

            // Incident Details: Date, Time, Location
            Wrap(
              spacing: 16,
              runSpacing: 6,
              children: [
                if (complaint.incidentDate.isNotEmpty)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 13, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        "${complaint.incidentDate} at ${complaint.incidentTime}",
                        style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                if (complaint.location.isNotEmpty)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.location_on_outlined, size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        complaint.location,
                        style: const TextStyle(fontSize: 11, color: AppColors.textSecondary),
                      ),
                    ],
                  ),
                if (isAdminView && complaint.studentName.isNotEmpty)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.person_outline, size: 14, color: AppColors.textMuted),
                      const SizedBox(width: 4),
                      Text(
                        "${complaint.studentName} (${complaint.studentRoll})",
                        style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.primary),
                      ),
                    ],
                  ),
              ],
            ),

            // 🔹 Admin Return Feedback Box
            if (complaint.adminFeedback != null && complaint.adminFeedback!.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4), // light emerald
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFBBF7D0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.verified_user_rounded, size: 16, color: Color(0xFF059669)),
                        const SizedBox(width: 6),
                        const Text(
                          "Official Administrative Feedback",
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF047857),
                          ),
                        ),
                        const Spacer(),
                        if (complaint.evaluatedBy != null)
                          Text(
                            "By ${complaint.evaluatedBy} • ${complaint.evaluatedAt ?? ''}",
                            style: const TextStyle(fontSize: 10, color: Color(0xFF059669)),
                          ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      complaint.adminFeedback!,
                      style: const TextStyle(fontSize: 12.5, color: Color(0xFF065F46), height: 1.4),
                    ),
                    if (complaint.actionTaken != null && complaint.actionTaken!.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        "Action Taken: ${complaint.actionTaken!}",
                        style: const TextStyle(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF047857),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],

            // 🔹 Admin Action Button
            if (isAdminView && onEvaluate != null) ...[
              const SizedBox(height: 14),
              Align(
                alignment: Alignment.centerRight,
                child: ElevatedButton.icon(
                  onPressed: onEvaluate,
                  icon: const Icon(Icons.rate_review_outlined, size: 16),
                  label: const Text("Evaluate Grievance"),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.purple,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
