# 🗳️ Bano Qabil — CR Voting System

![Project Poster](poster.jpg)

A secure, real-time, and transparent digital voting application developed for the **Bano Qabil AI Essentials** Class Representative (CR) elections. Built with modern web technologies, this platform ensures electoral integrity through hard-coded vote limits and strict 1-student-1-vote authentication.

🌐 **Live Demo:** [https://bano-qabil-cr-voting-system.vercel.app](https://bano-qabil-cr-voting-system.vercel.app)

---

## ✨ Features

* 🔐 **Secure Google Authentication:** Powered by Firebase Auth with custom domain verification.
* ⚡ **Real-Time Vote Tallying:** Live synchronized vote counts across all active sessions via Firebase Firestore.
* 🛡️ **Electoral Integrity Controls:**
  * **1-Student-1-Vote Policy:** Restricts duplicate votes based on student identity.
  * **ID Format Validation:** Enforces valid 7-digit Student IDs (e.g., `1387927`).
  * **Vote Cap Enforcement:** Hard cap at 100 maximum votes with automated winner/tie declaration.
* 📱 **Responsive UI/UX:** Mobile and desktop optimized interface built using React, TypeScript, and Vite.

---

## 🛠️ Tech Stack

* **Frontend:** React, TypeScript, Vite, Tailwind CSS
* **Backend & Auth:** Firebase Authentication, Firestore Database
* **Hosting & Deployment:** Vercel

---

## 👥 Developer Team

* **Muhammad Muneeb** (Student ID: `1387927`) — Infrastructure & Google Auth Integration
* **Tayyab Rajput** — Frontend Development & UX Design
* **Moiz Rajput** — Backend Logic & Rules Configuration

---

## 🚀 Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/muneebims/bano-qabil-cr-voting-system.git](https://github.com/muneebims/bano-qabil-cr-voting-system.git)
   cd bano-qabil-cr-voting-system
