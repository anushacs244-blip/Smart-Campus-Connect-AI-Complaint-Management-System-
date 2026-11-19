# Smart Campus Connect - Dart / Flutter UI Client 📱✨
**Author / Developed by:** SPA  
**Architecture:** Dart & Flutter Client + Node.js / Express MERN REST Backend  

---

## 📖 Overview
This is the complete **Dart / Flutter** implementation of the **Smart Campus Connect** user interface. It replicates the exact same layout, colors, cards, and interactive features of the web client, communicating directly with the Express/Node.js/MongoDB backend via RESTful APIs.

### 🌟 Core Modules Implemented in Dart:
1. **Main Screen (`HomeScreen`)**:
   - Navigation bar with branding (*Developed by SPA*) and quick portal access buttons
   - Gradient hero banner (*Indigo to Sky Blue*)
   - **Interactive AI Conversation Tool** (`AiChatWidget`) embedded directly on the main interface with real-time live queries to the backend ML knowledge engine (`POST /api/chat`)
   - Quick-ask chips: *"What is recent?"*, *"Show latest notices"*, *"List upcoming events"*, *"Who is Dr. Kavita?"*, *"Who is the Vice Chancellor?"*, etc.
   - Distinct feature cards for the Student Portal and Admin Center

2. **Dual-Portal Authentication (`LoginScreen` & `RegisterScreen`)**:
   - Interactive dual-tab toggle between **Student** (Indigo theme) and **Admin** (Purple theme)
   - Pre-filled demo credentials for one-tap sign-in
   - Secure student registration (with Roll Number & Department) and Admin registration (with Passcode `ADMIN2026`)

3. **Student Grievance & Complaint Redressal Portal (`StudentDashboard`)**:
   - Student profile banner
   - **Lodge Grievance Form** (`LodgeComplaintScreen`):
     - Categories: *Hostel, Academics, Infrastructure, Lab, Canteen, Examination, Library, Sports, Transportation, Other*
     - Severity Level: *Level 1 - Low* to *Level 4 - Urgent / Emergency*
     - Incident Date picker, Time picker, Location, and Description
   - Grievance list with real-time status chips (*Pending, Under Review, Resolved*)
   - **Official Administrative Feedback Card**: displays the exact feedback, action taken (e.g. work orders), and evaluation timestamp returned by the administrator

4. **Admin Complaints Evaluation Center (`AdminDashboard`)**:
   - View all grievances across campus with status filtering
   - **Evaluation Modal** (`EvaluateDialog`):
     - Update workflow status: *Pending ➔ Under Review ➔ Resolved*
     - Record Action Taken / Work Order info
     - Write Official Return Feedback visible directly to the student
   - Campus management tabs for **Notices**, **Events**, **Faculty**, and **University Details** (all updates immediately reflect in the AI knowledge engine in real time)

---

## 🎨 Theme & Color Palette (Identical to Web)
- **Primary / Student Theme:** Indigo (`#4F46E5`, `#4338CA`, `#EEF2FF`)
- **Admin Theme:** Purple (`#9333EA`, `#7E22CE`, `#FAF5FF`)
- **Accent:** Sky Blue (`#0284C7`)
- **Background:** Slate (`#F8FAFC`)
- **Status Colors:**
  - Pending: Amber (`#D97706`)
  - Under Review: Blue (`#2563EB`)
  - Resolved: Emerald (`#059669`)
  - Action Taken: Violet (`#7C3AED`)

---

## 🚀 How to Run the Flutter App

### Prerequisites
1. Ensure the Node.js backend is running on port 5000:
   ```bash
   cd server
   npm start
   ```
2. Install the Flutter SDK (version 3.0 or higher) from [flutter.dev](https://flutter.dev).

### Running on Chrome (Flutter Web)
```bash
cd flutter_client
flutter pub get
flutter run -d chrome
```

### Running on Android Emulator
```bash
cd flutter_client
flutter pub get
flutter run
```
> **Note for Android:** In `lib/services/api_service.dart`, set `baseUrl = 'http://10.0.2.2:5000/api';` so the Android emulator can access the local host machine.

### Running on Windows Desktop
```bash
cd flutter_client
flutter pub get
flutter run -d windows
```

---

## 📁 Directory Structure
```
flutter_client/
├── pubspec.yaml
├── README.md
└── lib/
    ├── main.dart
    ├── theme/
    │   └── app_theme.dart
    ├── models/
    │   ├── user_model.dart
    │   ├── complaint_model.dart
    │   └── campus_models.dart (Notice, Event, Faculty, University)
    ├── services/
    │   └── api_service.dart
    ├── screens/
    │   ├── home_screen.dart
    │   ├── auth/
    │   │   ├── login_screen.dart
    │   │   └── register_screen.dart
    │   ├── student/
    │   │   ├── student_dashboard.dart
    │   │   └── lodge_complaint_screen.dart
    │   └── admin/
    │       └── admin_dashboard.dart
    └── widgets/
        ├── ai_chat_widget.dart
        ├── complaint_card.dart
        └── evaluate_dialog.dart
```
