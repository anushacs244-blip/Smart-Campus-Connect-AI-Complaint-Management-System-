/**
 * CampusConnect AI - REST API Service (Dart)
 * Author: SPA
 * 
 * Pure Dart / Zero External Dependencies REST Client
 * Connects the Flutter Client with the Node.js / Express MERN Backend.
 * Uses native dart:io HttpClient - NO third-party packages required!
 */

import 'dart:convert';
import 'dart:io';
import '../models/user_model.dart';
import '../models/complaint_model.dart';
import '../models/campus_models.dart';

class _HttpResponse {
  final int statusCode;
  final String body;
  _HttpResponse(this.statusCode, this.body);
}

class _HttpClientHelper {
  static final HttpClient _client = HttpClient()
    ..connectionTimeout = const Duration(seconds: 6);

  static Future<_HttpResponse> get(Uri uri, {Map<String, String>? headers}) async {
    try {
      final request = await _client.getUrl(uri).timeout(const Duration(seconds: 6));
      headers?.forEach((k, v) => request.headers.set(k, v));
      final response = await request.close().timeout(const Duration(seconds: 6));
      final body = await response.transform(utf8.decoder).join();
      return _HttpResponse(response.statusCode, body);
    } catch (_) {
      return _HttpResponse(500, '');
    }
  }

  static Future<_HttpResponse> post(Uri uri, {Map<String, String>? headers, String? body}) async {
    try {
      final request = await _client.postUrl(uri).timeout(const Duration(seconds: 6));
      headers?.forEach((k, v) => request.headers.set(k, v));
      if (body != null) {
        request.headers.contentType = ContentType.json;
        final encoded = utf8.encode(body);
        request.headers.contentLength = encoded.length;
        request.add(encoded);
      }
      final response = await request.close().timeout(const Duration(seconds: 6));
      final respBody = await response.transform(utf8.decoder).join();
      return _HttpResponse(response.statusCode, respBody);
    } catch (_) {
      return _HttpResponse(500, '');
    }
  }

  static Future<_HttpResponse> put(Uri uri, {Map<String, String>? headers, String? body}) async {
    try {
      final request = await _client.putUrl(uri).timeout(const Duration(seconds: 6));
      headers?.forEach((k, v) => request.headers.set(k, v));
      if (body != null) {
        request.headers.contentType = ContentType.json;
        final encoded = utf8.encode(body);
        request.headers.contentLength = encoded.length;
        request.add(encoded);
      }
      final response = await request.close().timeout(const Duration(seconds: 6));
      final respBody = await response.transform(utf8.decoder).join();
      return _HttpResponse(response.statusCode, respBody);
    } catch (_) {
      return _HttpResponse(500, '');
    }
  }
}

class ApiService {
  // Auto-detects Android emulator (10.0.2.2) vs Web/Desktop/iOS (localhost)
  static String get _detectBaseUrl {
    try {
      if (Platform.isAndroid) {
        return 'http://10.0.2.2:5000/api';
      }
    } catch (_) {}
    return 'http://localhost:5000/api';
  }

  static String baseUrl = _detectBaseUrl;

  // Zero-dependency initialization
  static Future<void> init() async {
    // Uses auto-detected platform URL (10.0.2.2 for Android Studio Emulator)
  }

  // Global Session State
  static UserModel? currentUser;
  static String? token;

  static Future<void> saveBaseUrl(String url) async {
    baseUrl = url.trim();
  }

  static Future<bool> testConnection() async {
    try {
      final res = await _HttpClientHelper.get(Uri.parse('$baseUrl/health'));
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
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
      final response = await _HttpClientHelper.post(
        Uri.parse('$baseUrl/chat'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'message': message}),
      );

      if (response.statusCode == 200 && response.body.isNotEmpty) {
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
    final response = await _HttpClientHelper.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200 && response.body.isNotEmpty) {
      final data = jsonDecode(response.body);
      token = data['token'];
      currentUser = UserModel.fromJson(data, token: token);
      return currentUser!;
    } else {
      String msg = 'Login failed';
      try {
        final data = jsonDecode(response.body);
        msg = data['message'] ?? msg;
      } catch (_) {}
      throw Exception(msg);
    }
  }

  static Future<UserModel> registerStudent({
    required String name,
    required String email,
    required String password,
    required String rollNumber,
    required String department,
  }) async {
    final response = await _HttpClientHelper.post(
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

    if ((response.statusCode == 201 || response.statusCode == 200) && response.body.isNotEmpty) {
      final data = jsonDecode(response.body);
      token = data['token'];
      currentUser = UserModel.fromJson(data, token: token);
      return currentUser!;
    } else {
      String msg = 'Student registration failed';
      try {
        final data = jsonDecode(response.body);
        msg = data['message'] ?? msg;
      } catch (_) {}
      throw Exception(msg);
    }
  }

  static Future<UserModel> registerAdmin({
    required String name,
    required String email,
    required String password,
    required String department,
    required String adminCode,
  }) async {
    final response = await _HttpClientHelper.post(
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

    if ((response.statusCode == 201 || response.statusCode == 200) && response.body.isNotEmpty) {
      final data = jsonDecode(response.body);
      token = data['token'];
      currentUser = UserModel.fromJson(data, token: token);
      return currentUser!;
    } else {
      String msg = 'Admin registration failed';
      try {
        final data = jsonDecode(response.body);
        msg = data['message'] ?? msg;
      } catch (_) {}
      throw Exception(msg);
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
    final response = await _HttpClientHelper.get(
      Uri.parse('$baseUrl/complaints/my'),
      headers: _headers,
    );

    if (response.statusCode == 200 && response.body.isNotEmpty) {
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

    final response = await _HttpClientHelper.get(
      Uri.parse(url),
      headers: _headers,
    );

    if (response.statusCode == 200 && response.body.isNotEmpty) {
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
    final response = await _HttpClientHelper.post(
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

    if ((response.statusCode == 201 || response.statusCode == 200) && response.body.isNotEmpty) {
      final data = jsonDecode(response.body);
      return ComplaintModel.fromJson(data);
    } else {
      String msg = 'Failed to lodge complaint';
      try {
        final data = jsonDecode(response.body);
        msg = data['message'] ?? msg;
      } catch (_) {}
      throw Exception(msg);
    }
  }

  static Future<ComplaintModel> evaluateComplaint({
    required String id,
    required String status,
    required String adminFeedback,
    required String actionTaken,
  }) async {
    final response = await _HttpClientHelper.put(
      Uri.parse('$baseUrl/complaints/$id/evaluate'),
      headers: _headers,
      body: jsonEncode({
        'status': status,
        'adminFeedback': adminFeedback,
        'actionTaken': actionTaken,
      }),
    );

    if (response.statusCode == 200 && response.body.isNotEmpty) {
      final data = jsonDecode(response.body);
      return ComplaintModel.fromJson(data);
    } else {
      String msg = 'Failed to update evaluation';
      try {
        final data = jsonDecode(response.body);
        msg = data['message'] ?? msg;
      } catch (_) {}
      throw Exception(msg);
    }
  }

  // =========================================================================
  // 4. NOTICES, EVENTS, FACULTY & UNIVERSITY
  // =========================================================================
  static Future<List<NoticeModel>> getNotices() async {
    final res = await _HttpClientHelper.get(Uri.parse('$baseUrl/notices'));
    if (res.statusCode == 200 && res.body.isNotEmpty) {
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
    final res = await _HttpClientHelper.post(
      Uri.parse('$baseUrl/notices'),
      headers: _headers,
      body: jsonEncode({'title': title, 'details': details, 'issuedBy': issuedBy}),
    );
    if ((res.statusCode == 200 || res.statusCode == 201) && res.body.isNotEmpty) {
      return NoticeModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to add notice');
  }

  static Future<List<EventModel>> getEvents() async {
    final res = await _HttpClientHelper.get(Uri.parse('$baseUrl/events'));
    if (res.statusCode == 200 && res.body.isNotEmpty) {
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
    final res = await _HttpClientHelper.post(
      Uri.parse('$baseUrl/events'),
      headers: _headers,
      body: jsonEncode({'title': title, 'venue': venue, 'eventDate': eventDate}),
    );
    if ((res.statusCode == 200 || res.statusCode == 201) && res.body.isNotEmpty) {
      return EventModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to add event');
  }

  static Future<List<FacultyModel>> getFaculty() async {
    final res = await _HttpClientHelper.get(Uri.parse('$baseUrl/faculty'));
    if (res.statusCode == 200 && res.body.isNotEmpty) {
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
    final res = await _HttpClientHelper.post(
      Uri.parse('$baseUrl/faculty'),
      headers: _headers,
      body: jsonEncode({
        'name': name,
        'department': department,
        'designation': designation,
        'email': email,
      }),
    );
    if ((res.statusCode == 200 || res.statusCode == 201) && res.body.isNotEmpty) {
      return FacultyModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to add faculty');
  }

  static Future<UniversityModel> getUniversity() async {
    final res = await _HttpClientHelper.get(Uri.parse('$baseUrl/university'));
    if (res.statusCode == 200 && res.body.isNotEmpty) {
      return UniversityModel.fromJson(jsonDecode(res.body));
    }
    throw Exception('Failed to load university profile');
  }
}
