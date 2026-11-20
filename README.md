# Smart Campus Connect 🤖🏫

**Smart Campus Connect** is a full-stack campus intelligence platform combining an **AI-Assisted Conversation Tool on the Main Interface** and an interactive **Student Grievance & Complaint Redressal System**. 

The project is built as a hybrid **Dart / Flutter Client + MERN Stack Backend**:
* **Frontend UI Clients:**
  * **Flutter & Dart (`flutter_client/`):** Full cross-platform client app written in Dart (Web, Android, iOS, Windows Desktop) with identical UI styling, color palette, and interactive features.
  * **React & Vite (`client/`):** Web client written in React 19 and Tailwind CSS.
* **Backend (`server/`):** Node.js, Express.js, MongoDB (Mongoose), Natural NLP intent classification, and RESTful APIs consumed by the Dart/Flutter and React clients.

---

## 👩‍💻 Author

**Developed by SPA**  
*Project Lead & Lead Full-Stack Architect*

---

## 🌟 Core Architecture & User Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 MAIN INTERFACE (/)                              │
│  • 🤖 Interactive AI Campus Assistant (Live chatbot for all visitors & students)│
│  • Ask about University Details, VC, Chancellor, Departments, Faculty, Events   │
│  • Live Recency Feed: "What is recent?", latest notices, upcoming fests         │
└───────────────────────┬─────────────────────────────────┬───────────────────────┘
                        │                                 │
           [Student Portal Login]                 [Admin Portal Login]
                        │                                 │
                        ▼                                 ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│       STUDENT GRIEVANCE PORTAL       │  │      ADMIN EVALUATION CENTER         │
├──────────────────────────────────────┤  ├──────────────────────────────────────┤
│ • Lodge complaints with:             │  │ • Review all incoming grievances     │
│   - Category (Hostel, Academics,     │  │ • Filter by status & inspect         │
│     Infrastructure, Lab, etc.)       │  │   incident date, time, location,     │
│   - Incident Date & Time             │  │   and severity level                 │
│   - Severity Level (Level 1 to 4)    │  │ • Update Status (Pending ➔ In        │
│   - Specific Location / Room         │  │   Progress ➔ Resolved / Rejected)    │
│   - Detailed Description             │  │ • Return Official Admin Feedback     │
│ • View real-time status updates      │  │ • Log physical Action Taken          │
│ • Read official Admin Feedback card  │  │ • Manage University Knowledge Base   │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
```

---

## 🚀 How to Run the Project

### 1. Start the Node.js / Express Backend (Port 5000)
```bash
cd server
npm start
```

### 2. Run the Dart / Flutter Client (`flutter_client/`)
```bash
cd flutter_client
flutter pub get

# To run on Chrome (Flutter Web):
flutter run -d chrome

# To run on Android Emulator:
flutter run

# To run on Windows Desktop:
flutter run -d windows
```

### 3. Or Run the React Web Client (`client/`)
```bash
cd client
npm run dev
```

### 4. One-Click Launch (Windows)
Double-click **`start.bat`** in the root directory to automatically launch the backend server and web interface.

---

## 🔑 Login Credentials

| Role | Email | Password | Direct Portal |
|---|---|---|---|
| **Student** | `student@campus.edu` | `admin123` | Student Grievance & Complaints Portal |
| **Administrator** | `spa@campusconnect.com` | `admin123` | Admin Complaints Evaluation Center |

*(Admin registration passkey is `ADMIN2026`.)*

---

## 📄 License & Credits

Developed by **SPA** © 2026. All rights reserved.
