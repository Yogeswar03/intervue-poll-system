# 🎓 Live Polling System

A real-time interactive polling system built with **React (frontend)** and **Express.js + Socket.io (backend)**.  
It allows a **Teacher** to create and manage polls while **Students** can participate, answer questions, and see live results instantly.

---

## 🚀 Features

### 👩‍🏫 Teacher Features
- Create a new poll.
- View **live polling results** in real-time.
- Ask a new question **only if**:
  - No question has been asked yet, OR
  - All students have answered the previous question.

### 👨‍🎓 Student Features
- Enter name on first visit (**unique per tab/session**).
- Submit answers once a question is asked.
- View **live polling results** immediately after submission.
- **60-second timer** to answer a question → results shown automatically after time runs out.

---

## 🛠️ Technology Stack
- **Frontend** → React + Redux (state management)
- **Backend** → Express.js + Socket.io (real-time communication)
- **Hosting** →  
  - Frontend → Netlify / Vercel  
  - Backend → Render / Railway / Heroku  

---

## ✅ Must-Have Requirements (All Implemented)
- Functional system with all core features working.
- Hosting for both frontend and backend.
- Teacher can create polls and students can answer them.
- Both teacher and student can view poll results.
- **UI matches the shared Figma design** (no deviations).

---

## ✨ Extra Features
- Configurable poll time limit by teacher (✅).
- Option for teacher to remove a student (✅).
- Well-designed, user-friendly interface (✅).
- Chat popup for interaction between students and teachers (✅).
- Teacher can view **past poll results** (transient, not stored permanently) (✅).

## ⚡ How It Works
1. Teacher creates a poll → question broadcasted to all students.
2. Students see the question with a **countdown timer** (max 60s).
3. Students submit their answers → instantly updated in teacher's dashboard.
4. Teacher can see live poll results.
5. Teacher can only move to the **next question** once all students have answered or time runs out.

---

## 🚀 Deployment
### Frontend (React)
- Deployed via **Vercel**. 
- Build command: `npm run build`
- Publish directory: `frontend/build`

### Backend (Express.js + Socket.io)
- Deploy on **Render** / **Railway**.
- Start command: `node server.js`


## 👨‍💻 Contributors
- **Yogeswar** – Developer
