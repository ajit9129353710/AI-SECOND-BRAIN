🧠 AI Second Brain – Chat with PDF

🚀 Your Personal AI-Powered Knowledge Assistant

AI Second Brain is an AI-powered document assistant that helps users interact with their PDF documents using Artificial Intelligence.

Upload your documents, ask questions, understand complex topics, and get intelligent answers from your own study materials.

Instead of reading hundreds of pages manually, let AI help you find the information you need!

---

✨ Project Overview

AI Second Brain is a Full Stack AI application designed to make learning, document management, and information retrieval smarter and faster.

The goal is to create a personal knowledge assistant where users can upload PDFs and interact with their documents through an AI-powered chat interface.

🔥 Key Features

- 📄 PDF Upload: Upload PDF documents for AI-powered analysis.
- 🤖 AI Chat: Ask questions about your uploaded documents.
- 🧠 Smart Answers: Get relevant answers based on document content.
- 📝 AI Summarization: Generate summaries of lengthy documents.
- 📚 Study Assistant: Make learning and understanding documents easier.
- 🔐 User Authentication: Login and signup functionality.
- 💬 Chat History: Keep track of previous conversations.
- 🎨 Modern UI: Clean and responsive user interface.

Note: Features are being developed progressively.

---

🛠️ Tech Stack

Frontend

- React.js
- Vite
- JavaScript
- CSS
- Lucide React

Backend

- Node.js
- Express.js
- REST API

Database

- MongoDB
- Mongoose

AI Integration

- Google Gemini API

Authentication & Security

- JWT Authentication
- Environment Variables
- Password Validation

Deployment

- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

📂 Project Structure

AI-Second-Brain/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md

---

⚙️ Installation & Setup

1. Clone Repository

git clone https://github.com/YOUR-USERNAME/AI-Second-Brain.git

2. Navigate to Project

cd AI-Second-Brain

3. Setup Backend

cd backend
npm install

Create a ".env" file inside the backend folder.

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GEMINI_API_KEY=your_gemini_api_key

Start Backend:

npm run dev

4. Setup Frontend

Open another terminal:

cd frontend
npm install

Create a ".env" file inside the frontend folder.

VITE_API_URL=http://localhost:5000

Start Frontend:

npm run dev

---

🔒 Security

- API keys are stored in environment variables.
- Sensitive credentials are not committed to GitHub.
- JWT is used for authentication.
- Backend APIs handle protected requests.

Never share your API keys or database credentials publicly.

---

🎯 Project Goals

The main goal of AI Second Brain is to build a smart personal knowledge management system using Full Stack Development and Artificial Intelligence.

This project demonstrates practical learning in:

- Full Stack Web Development
- REST API Development
- Database Management
- AI API Integration
- Authentication & Authorization
- Cloud Deployment

---

👨‍💻 Developer

Ajit Prajapati

Aspiring Full Stack Developer | AI Enthusiast | Computer Science & Data Science Student

📌 Interested in building real-world applications using modern web technologies and Artificial Intelligence.

---

⭐ Support

If you find this project interesting, don't forget to give this repository a ⭐ on GitHub!

🚀 Building the Future with AI, One Project at a Time.
