/**
 * CampusConnect AI - User & Auth Model
 * Author: SPA
 */

class UserModel {
  final String id;
  final String name;
  final String email;
  final String role; // 'user' (student) or 'admin'
  final String? rollNumber;
  final String? department;
  final String? token;

  UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    this.rollNumber,
    this.department,
    this.token,
  });

  bool get isAdmin => role == 'admin';
  bool get isStudent => role == 'user';

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] ?? 'user',
      rollNumber: json['rollNumber'],
      department: json['department'],
      token: token ?? json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'name': name,
      'email': email,
      'role': role,
      'rollNumber': rollNumber,
      'department': department,
      'token': token,
    };
  }
}
