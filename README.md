# 🎓 AI-Powered Doubt Resolution System (LMS)

This project is an AI-powered Learning Management System (LMS) that allows students to post doubts and get instant resolutions using Generative AI. The platform includes both frontend and backend components.

---

##  Project Structure
├── lms-frontend/ # React-based frontend for student and admin dashboards
├── lms-backend/ # Express.js backend with REST APIs
└── README.md


##  Features

-  Ask a Doubt: Students can submit doubts via text
-  AI Resolution: Uses Hugging Face models (like GPT-2) locally for instant doubt solving
-  Dashboard: Admin view to manage doubts and study material
-  Role-based Access (Student/Admin)

---

## 🧰 Tech Stack

- **Frontend:** React, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **AI Server:** Python Flask with Hugging Face Transformers (e.g., GPT-2)
- **Database:** mysql

---


Frontend Setup (React)
cd lms-frontend
npm install
npm start

Backend Setup (Node.js)
cd ../lms-backend
npm install
node server.js

AI Model Server (Flask with Hugging Face)
cd ../ai-server
# Create a virtual environment and activate it
pip install -r requirements.txt
python app.py

 Clone the Repository

```bash
git clone https://github.com/Abdulajam6692/AI_LMS.git
