/**
 * CampusConnect AI - Campus Data Models
 * Author: SPA
 */

class NoticeModel {
  final String id;
  final String title;
  final String details;
  final String issuedBy;
  final String date;

  NoticeModel({
    required this.id,
    required this.title,
    required this.details,
    required this.issuedBy,
    required this.date,
  });

  factory NoticeModel.fromJson(Map<String, dynamic> json) {
    return NoticeModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      details: json['details'] ?? '',
      issuedBy: json['issuedBy'] ?? 'Administration',
      date: json['date'] ?? '',
    );
  }
}

class EventModel {
  final String id;
  final String title;
  final String venue;
  final String eventDate;

  EventModel({
    required this.id,
    required this.title,
    required this.venue,
    required this.eventDate,
  });

  factory EventModel.fromJson(Map<String, dynamic> json) {
    return EventModel(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      venue: json['venue'] ?? '',
      eventDate: json['eventDate'] ?? '',
    );
  }
}

class FacultyModel {
  final String id;
  final String name;
  final String department;
  final String designation;
  final String? email;

  FacultyModel({
    required this.id,
    required this.name,
    required this.department,
    required this.designation,
    this.email,
  });

  factory FacultyModel.fromJson(Map<String, dynamic> json) {
    return FacultyModel(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      department: json['department'] ?? '',
      designation: json['designation'] ?? '',
      email: json['email'],
    );
  }
}

class UniversityModel {
  final String name;
  final String code;
  final String chancellor;
  final String viceChancellor;
  final String location;
  final String establishedYear;
  final String accreditation;
  final String website;
  final String contactEmail;
  final String contactPhone;
  final String about;
  final String vision;
  final String mission;

  UniversityModel({
    required this.name,
    required this.code,
    required this.chancellor,
    required this.viceChancellor,
    required this.location,
    required this.establishedYear,
    required this.accreditation,
    required this.website,
    required this.contactEmail,
    required this.contactPhone,
    required this.about,
    required this.vision,
    required this.mission,
  });

  factory UniversityModel.fromJson(Map<String, dynamic> json) {
    return UniversityModel(
      name: json['name'] ?? 'Smart Campus University',
      code: json['code'] ?? 'SCU-2026',
      chancellor: json['chancellor'] ?? 'Dr. S. P. Acharya',
      viceChancellor: json['viceChancellor'] ?? 'Prof. A. R. Sharma',
      location: json['location'] ?? 'Tech Campus Central',
      establishedYear: json['establishedYear'] ?? '2008',
      accreditation: json['accreditation'] ?? 'NAAC A++',
      website: json['website'] ?? 'https://smartcampus.edu',
      contactEmail: json['contactEmail'] ?? 'info@smartcampus.edu',
      contactPhone: json['contactPhone'] ?? '+91 98765 43210',
      about: json['about'] ?? '',
      vision: json['vision'] ?? '',
      mission: json['mission'] ?? '',
    );
  }
}
