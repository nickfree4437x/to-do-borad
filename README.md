# 🏗️ Task Board Application  

A modern **Kanban-style task management app** built with **React, Tailwind CSS, Node.js, Express, MongoDB**, and **Socket.IO** for **real-time collaboration**.  

✅ Features  
- 📌 **Create, Edit, Delete tasks**  
- 🏷️ **Priority levels (Low, Medium, High)**  
- 🏗️ **Drag & Drop tasks** between Todo, In Progress & Done  
- 🔄 **Realtime updates** using Socket.IO  
- ⚡ **Conflict Detection** – Shows modal if two users edit the same task simultaneously  
- 👥 **Smart Assignment** of tasks  
- 📝 **Activity Logs** to track recent actions  
- 📱 **Responsive UI** for mobile & desktop  
- 🔒 **JWT Authentication**  

---

## 🚀 Tech Stack  

### Frontend  
- React (Vite)
- Tailwind CSS
- Framer Motion (Smooth animations)
- Hello-Pangea DnD (Drag & Drop)
- React-Toastify (Notifications)  

### Backend  
- Node.js + Express  
- MongoDB + Mongoose  
- JWT Authentication  
- Socket.IO for realtime updates  

---

## 📂 Project Structure  

📦 task-board/
┣ 📂 client/ # React frontend
┃ ┣ 📂 src/
┃ ┃ ┣ Components/
┃ ┃ ┣ pages/
┃ ┃ ┗ sockets/
┃ ┣ vite.config.js
┃ ┗ package.json
┣ 📂 server/ # Node.js backend
┃ ┣ 📂 routes/
┃ ┣ 📂 models/
┃ ┣ index.js
┃ ┗ package.json
┣ .gitignore
┣ README.md
┗ package.json (workspace)


---

## ⚙️ Installation  

Clone repo & install dependencies:  

```bash
git clone https://github.com/nickfree4437x/to-do-board.git
cd <repo-name>

# Install frontend deps
cd client
npm install

# Install backend deps
cd ../server
npm install

▶️ Running the Project
✅ Start Backend
bash
Copy
Edit
cd server
npm run dev
It will run on http://localhost:5000

✅ Start Frontend
bash
Copy
Edit
cd client
npm run dev
It will run on http://localhost:5173

🔑 Environment Variables
Backend requires a .env file:

ini
Copy
Edit
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskboard
JWT_SECRET=your-secret-key
CLIENT_URL=http://localhost:5173
Frontend requires a .env file:

ini
Copy
Edit
VITE_API_URL=http://localhost:5000
🔄 Realtime Updates
Uses Socket.IO → When a task is created/updated/deleted, all connected clients get updates instantly.
If two users edit the same task → Backend sends 409 Conflict → Frontend shows Conflict Modal to resolve differences.


✅ Future Improvements
✅ User roles (Admin/Member)
✅ File attachments in tasks
✅ Task due dates & reminders


🤝 Contributing
Pull requests are welcome!

📝 License
Vishal Saini

Made with ❤️ using React + Node.js

