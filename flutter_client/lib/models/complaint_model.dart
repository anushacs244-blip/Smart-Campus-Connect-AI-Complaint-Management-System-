/**
 * CampusConnect AI - Complaint Model
 * Author: SPA
 */

class ComplaintModel {
  final String id;
  final String studentId;
  final String studentName;
  final String studentEmail;
  final String studentRoll;
  final String title;
  final String category;
  final String complaintLevel;
  final String incidentDate;
  final String incidentTime;
  final String location;
  final String description;
  final String status;
  final String? adminFeedback;
  final String? actionTaken;
  final String? evaluatedBy;
  final String? evaluatedAt;
  final String? createdAt;

  ComplaintModel({
    required this.id,
    required this.studentId,
    required this.studentName,
    required this.studentEmail,
    required this.studentRoll,
    required this.title,
    required this.category,
    required this.complaintLevel,
    required this.incidentDate,
    required this.incidentTime,
    required this.location,
    required this.description,
    required this.status,
    this.adminFeedback,
    this.actionTaken,
    this.evaluatedBy,
    this.evaluatedAt,
    this.createdAt,
  });

  factory ComplaintModel.fromJson(Map<String, dynamic> json) {
    return ComplaintModel(
      id: json['_id'] ?? json['id'] ?? '',
      studentId: json['studentId'] ?? '',
      studentName: json['studentName'] ?? '',
      studentEmail: json['studentEmail'] ?? '',
      studentRoll: json['studentRoll'] ?? '',
      title: json['title'] ?? '',
      category: json['category'] ?? 'Other',
      complaintLevel: json['complaintLevel'] ?? 'Level 1 - Low',
      incidentDate: json['incidentDate'] ?? '',
      incidentTime: json['incidentTime'] ?? '',
      location: json['location'] ?? '',
      description: json['description'] ?? '',
      status: json['status'] ?? 'Pending',
      adminFeedback: json['adminFeedback'],
      actionTaken: json['actionTaken'],
      evaluatedBy: json['evaluatedBy'],
      evaluatedAt: json['evaluatedAt'],
      createdAt: json['createdAt'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'studentId': studentId,
      'studentName': studentName,
      'studentEmail': studentEmail,
      'studentRoll': studentRoll,
      'title': title,
      'category': category,
      'complaintLevel': complaintLevel,
      'incidentDate': incidentDate,
      'incidentTime': incidentTime,
      'location': location,
      'description': description,
      'status': status,
      'adminFeedback': adminFeedback,
      'actionTaken': actionTaken,
      'evaluatedBy': evaluatedBy,
      'evaluatedAt': evaluatedAt,
      'createdAt': createdAt,
    };
  }
}
