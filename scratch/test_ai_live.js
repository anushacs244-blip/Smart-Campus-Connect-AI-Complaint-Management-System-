import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

async function runTests() {
  console.log("=== STARTING COMPREHENSIVE AI & LIVE RECENT TEST ===");

  // Helper for chat
  const askAI = async (question) => {
    const res = await axios.post(`${BASE_URL}/api/chat`, { message: question });
    console.log(`\n❓ QUESTION: "${question}"`);
    console.log(`🤖 AI REPLY:\n${res.data.reply}`);
    return res.data.reply;
  };

  // Test 1: Recent Query
  const r1 = await askAI("What is recent?");
  if (!r1.includes("Recently Added")) throw new Error("Test 1 Failed: Expected recent dashboard");

  // Test 2: Specific Faculty Lookup (Dr. Kavita)
  const r2 = await askAI("Who is Dr Kavita?");
  if (!r2.includes("Kavita") || r2.includes("Chancellor: Dr. S. P. Acharya")) {
    throw new Error("Test 2 Failed: Did not match Dr Kavita or gave generic university card");
  }

  // Test 3: Specific Faculty Lookup (Rajesh)
  const r3 = await askAI("Who is Rajesh?");
  if (!r3.includes("Rajesh Kumar")) throw new Error("Test 3 Failed: Did not match Rajesh");

  // Test 4: Vice Chancellor
  const r4 = await askAI("Who is the Vice Chancellor?");
  if (!r4.includes("Prof. A. R. Sharma")) throw new Error("Test 4 Failed: VC query");

  // Login as admin
  const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
    email: "spa@campusconnect.com",
    password: "admin123"
  });
  const adminToken = loginRes.data.token;
  const authHeaders = { headers: { Authorization: `Bearer ${adminToken}` } };
  console.log("\n🔑 Admin logged in successfully");

  // Test 5: Add a brand new notice
  const newNoticeRes = await axios.post(`${BASE_URL}/api/notices`, {
    title: "Blood Donation Camp on Campus",
    details: "Red Cross & NSS unit organizing Blood Donation Camp at Main Auditorium on Friday.",
    issuedBy: "NSS Cell",
    date: "2026-11-19"
  }, authHeaders);
  console.log("📢 Admin added new notice:", newNoticeRes.data.title);

  // Test 6: Verify AI immediately shows new notice as #1 in "What is recent?"
  const r6 = await askAI("What is recent?");
  if (!r6.includes("Blood Donation Camp on Campus")) {
    throw new Error("Test 6 Failed: Newly added notice did not appear in recent updates!");
  }

  // Test 7: Query about the new notice topic
  const r7 = await askAI("Is there any blood donation in campus?");
  if (!r7.includes("Blood Donation Camp on Campus")) {
    throw new Error("Test 7 Failed: AI did not match newly added blood donation topic!");
  }

  // Test 8: Add a brand new event
  const newEventRes = await axios.post(`${BASE_URL}/api/events`, {
    title: "National Robotics Championship 2026",
    venue: "Indoor Sports Complex",
    eventDate: "2026-12-22"
  }, authHeaders);
  console.log("📅 Admin added new event:", newEventRes.data.title);

  // Test 9: Query about the new event topic
  const r9 = await askAI("Tell me about robotics event");
  if (!r9.includes("Robotics Championship")) {
    throw new Error("Test 9 Failed: AI did not match newly added robotics event!");
  }

  // Test 10: Add a brand new faculty member
  const newFacRes = await axios.post(`${BASE_URL}/api/faculty`, {
    name: "Prof. Vikram Aditya",
    department: "Computer Engineering",
    designation: "Assistant Professor (Cybersecurity)",
    email: "vikram.aditya@campus.edu"
  }, authHeaders);
  console.log("👨‍🏫 Admin added new faculty:", newFacRes.data.name);

  // Test 11: Query about the new faculty
  const r11 = await askAI("Who is Vikram?");
  if (!r11.includes("Vikram Aditya")) {
    throw new Error("Test 11 Failed: AI did not match newly added faculty member!");
  }

  // Test 12: Student complaint guide
  const r12 = await askAI("How to raise a student complaint?");
  if (!r12.includes("Student Grievance")) {
    throw new Error("Test 12 Failed: Complaint guide failed");
  }

  console.log("\n🎉 ALL 12 INTEGRATION TESTS PASSED PERFECTLY!");
}

runTests().catch(err => {
  console.error("❌ TEST FAILED:", err.message);
  process.exit(1);
});
