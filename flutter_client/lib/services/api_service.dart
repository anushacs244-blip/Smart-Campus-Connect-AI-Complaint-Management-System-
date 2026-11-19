/**
 * CampusConnect AI - REST API Service (Dart)
 * Author: SPA
 * 
 * Connects the Flutter Client with the Node.js / Express MERN Backend.
 */

import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user_model.dart';
import '../models/complaint_model.dart';
import '../models/campus_models.dart';

class ApiService {
  // Base URL configuration
  // For Web / Desktop / iOS: http://localhost:5000/api
  // For Android Emulator: http://10.0.2.2:5000/api
  static String baseUrl = 'http://localhost:5000/api';

  // Global Session State
  static UserModel? currentUser;
  static String? token;

  static void setBaseUrl(String url) {
    baseUrl = url;
  }

  static Map<String, String> get _headers {
    final headers = {'Content-Type': 'application/json'};
    if (token != null && token!.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  // =========================================================================
  // 1. AI CHAT ASSISTANT
  // =========================================================================
  static Future<String> askAI(String message) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'message': message}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['reply'] ?? 'No reply received from campus assistant.';
      } else {
        return 'Server returned status ${response.statusCode}. Please try again.';
      }
    } catch (e) {
      return 'Could not connect to campus backend at $baseUrl. Ensure port 5000 is running.';
    }
  }

  // =========================================================================
  // 2. AUTHENTICATION (STUDENT & ADMIN)
  // =========================================================================
  static Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      token = data['token'];
      currentUser = UserModel.fromJson(data, token: token);
      return currentUser!;
    } else {
      throw Exception(data['message'] ?? 'Login failed');
    }
  }

  static Future<UserModel> registerStudent({
    required String name,
    required String email,
    required String password,
    required String rollNumber,
    required String department,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register/student'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'rollNumber': rollNumber,
        'department': department,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 || response.statusCode == 200) {
      token = data['token'];
      currentUser = UserModel.fromJson(data, token: token);
      return currentUser!;
    } else {
      throw Exception(data['message'] ?? 'Student registration failed');
    }
  }

  static Future<UserModel> registerAdmin({
    required String name,
    required String email,
    required String password,
    required String department,
    required String adminCode,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register/admin'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'department': department,
        'adminCode': adminCode,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 || response.statusCode == 200) {
      token = data['token'];
      currentUser = UserModel.fromJson(data, token: token);
      return currentUser!;
    } else {
      throw Exception(data['message'] ?? 'Admin registration failed');
    }
  }

  static void logout() {
    currentUser = null;
    token = null;
  }

  // =========================================================================
  // 3. COMPLAINTS & GRIEVANCE SYSTEM
  // =========================================================================
  static Future<List<ComplaintModel>> getMyComplaints() async {
    final response = await http.get(
      Uri.parse('$baseUrl/complaints/my'),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((c) => ComplaintModel.fromJson(c)).toList();
    } else {
      throw Exception('Failed to load my complaints');
    }
  }

  static Future<List<ComplaintModel>> getAllComplaints({String? status}) async {
    String url = '$baseUrl/complaints';
    if (status != null && status != 'All') {
      url += '?status=$status';
    }

    final response = await http.get(
      Uri.parse(url),
      headers: _headers,
    );

    if (response.statusCode == 200) {
      final List data = jsonDecode(response.body);
      return data.map((c) => ComplaintModel.fromJson(c)).toList();
    } else {
      throw Exception('Failed to load complaints');
    }
  }

  static Future<ComplaintModel> lodgeComplaint({
    required String title,
    required String category,
    required String complaintLevel,
    required String incidentDate,
    required String incidentTime,
    required String location,
    required String description,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/complaints'),
      headers: _headers,
      body: jsonEncode({
        'title': title,
        'category': category,
        'complaintLevel': complaintLevel,
        'incidentDate': incidentDate,
        'incidentTime': incidentTime,
        'location': location,
        'description': description,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 201 || response.statusCode == 200) {
      return ComplaintModel.fromJson(data);
    } else {
      throw Exception(data['message'] ?? 'Failed to lodge complaint');
    }
  }

  static Future<ComplaintModel> evaluateComplaint({
    required String id,
    required String status,
    required String adminFeedback,
    required String actionTaken,
  }) async {
    final response = await http.put(
      Uri.parse('$baseUrl/complaints/$id/evaluate'),
      headers: _headers,
      body: jsonEncode({
        'status': status,
        'adminFeedback': adminFeedback,
        'actionTaken': actionTaken,
      }),
    );

    final data = jsonDecode(response.body);
    if (response.statusCode == 200) {
      return ComplaintModel.fromJson(data);
    } else {
      throw Exception(data['message'] ?? 'Failed to update evaluation');
    }
  }

  // =========================================================================
  // 4. NOTICES, EVENTS, FACULTY & UNIVERSITY
  // =========================================================================
  static Future<List<NoticeModel>> getNotices() async {
    final res = await http.get(Uri.parse('$baseUrl/notices'));
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((n) => NoticeModel.fromJson(n)).toList();
    }
    return [];
  }

  static Future<NoticeModel> addNotice({
    required String title,
    required String details,
    required String issuedBy,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/notices'),
      headers: _headers,
      body: jsonEncode({'title': title, 'details': details, 'issuedBy': issuedBy}),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      return NoticeModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to add notice');
  }

  static Future<List<EventModel>> getEvents() async {
    final res = await http.get(Uri.parse('$baseUrl/events'));
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((e) => EventModel.fromJson(e)).toList();
    }
    return [];
  }

  static Future<EventModel> addEvent({
    required String title,
    required String venue,
    required String eventDate,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/events'),
      headers: _headers,
      body: jsonEncode({'title': title, 'venue': venue, 'eventDate': eventDate}),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      return EventModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to add event');
  }

  static Future<List<FacultyModel>> getFaculty() async {
    final res = await http.get(Uri.parse('$baseUrl/faculty'));
    if (res.statusCode == 200) {
      final List data = jsonDecode(res.body);
      return data.map((f) => FacultyModel.fromJson(f)).toList();
    }
    return [];
  }

  static Future<FacultyModel> addFaculty({
    required String name,
    required String department,
    required String designation,
    String? email,
  }) async {
    final res = await http.post(
      Uri.parse('$baseUrl/faculty'),
      headers: _headers,
      body: jsonEncode({
        'name': name,
        'department': department,
        'designation': designation,
        'email': email,
      }),
    );
    if (res.statusCode == 200 || res.statusCode == 201) {
      return FacultyModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to add faculty');
  }

  static Future<UniversityModel> getUniversity() async {
    final res = await http.get(Uri.parse('$baseUrl/university'));
    if (res.statusCode == 200) {
      return UniversityModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to load university profile');
  }
}
