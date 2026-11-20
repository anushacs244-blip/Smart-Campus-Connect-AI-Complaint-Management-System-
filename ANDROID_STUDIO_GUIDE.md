# 📱 Running Campus Connect in Android Studio Emulator

This guide explains all the ways to run the **Campus Connect** app in the Android Studio Emulator.

---

## ⚡ Method 1: Instant Drag & Drop (Fastest - 10 Seconds)

You do **not** need to wait for Gradle to compile or configure SDKs:
1. Open **Android Studio**.
2. Launch your Android Virtual Device (AVD) from **Device Manager** (or Tools ➔ Device Manager).
3. Once the phone emulator screen is booted and visible on your desktop:
4. Locate the pre-compiled APK file in this folder:  
   👉 `CampusConnect-App.apk`
5. **Drag and drop** `CampusConnect-App.apk` directly into the emulator window.
6. The app installs instantly! Click the **Campus Connect** app icon on the emulator home screen to launch.

> **Note:** Make sure your backend server is running so the app can communicate (`server/` at port 5000). You can start it using `run_in_android_emulator.bat` or by running `cd server && npm start`.

---

## 🚀 Method 2: One-Click Launcher (`run_in_android_emulator.bat`)

A dedicated launcher script has been configured for you:
1. Double-click **`run_in_android_emulator.bat`** in the project root.
2. It will:
   - Ensure the Node.js backend server is running on port 5000.
   - Detect or start your Android Studio emulator.
   - Install `CampusConnect-App.apk` and launch it on the emulator automatically.

---

## 🛠️ Method 3: Open in Android Studio as a Flutter Project (For Code Editing & Live Reload)

If you have the **Flutter** plugin installed in Android Studio:
1. Open **Android Studio**.
2. Click **File ➔ Open...** (or Open on the Welcome screen).
3. Browse to and select the **`flutter_client`** folder:
   ```
   C:\Users\spandana ashwath\OneDrive\Desktop\Campus Connect\flutter_client
   ```
4. Click **OK**.
5. Wait a few seconds for Android Studio to index the project.
6. At the top toolbar, look at the **Device Dropdown** (it will show your running Android Emulator, e.g. `sdk gphone64 x86_64`).
7. Click the **Green Play button (▶ Run)** or press `Shift + F10`.
8. The app will build and run on your emulator with full **Stateful Hot Reload** (`r` key).

---

## ☕ Method 4: Open in Android Studio as Native Android Project

If you prefer Android Studio's native Gradle view:
1. Open **Android Studio**.
2. Click **File ➔ Open...**.
3. Select the **`flutter_client\android`** folder:
   ```
   C:\Users\spandana ashwath\OneDrive\Desktop\Campus Connect\flutter_client\android
   ```
4. Click **OK** (Open as Project).
5. Android Studio will automatically sync the Gradle files (`build.gradle.kts`, `settings.gradle.kts`, `local.properties`).
6. Select your emulator in the top toolbar and click **Run**.

---

## 🌐 Backend Network Connection Note

When running inside the Android Studio Emulator:
- The emulator uses the special virtual loopback IP **`10.0.2.2`** to access your computer's `localhost`.
- The Flutter client's `ApiService` is already configured with automatic Android detection:
  ```dart
  if (Platform.isAndroid) {
    return 'http://10.0.2.2:5000/api';
  }
  ```
- Android network security configuration (`network_security_config.xml`) and `android:usesCleartextTraffic="true"` have been fully configured in `AndroidManifest.xml` to permit seamless HTTP communication.

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@campus.edu` | `admin123` |
| **Administrator** | `spa@campusconnect.com` | `admin123` |
