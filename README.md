# CTF Competition Website

A modern Capture The Flag (CTF) competition platform built with React frontend and Node.js backend.

## 🏗️ Architecture

- **Frontend**: React.js (deployed on Vercel)
- **Backend**: Node.js + Express + MongoDB (deployed on Render)  
- **Challenge Services**: Docker containers (Azure Container Instances)
- **Database**: MongoDB Atlas

## 🚀 Quick Start

**For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🎮 Features

- User authentication and team management
- Interactive challenge map
- Real-time scoring and leaderboard
- File downloads for challenges
- Web-based terminal (via Docker)
- Responsive design for all devices

## 🏆 Challenge Categories

- Web Exploitation
- Cryptography  
- Reverse Engineering
- Digital Forensics
- Network Security

## 🛠️ Local Development

### Prerequisites
- Node.js 18+
- MongoDB (or MongoDB Atlas)
- Docker (for challenge services)

### Setup
1. Clone the repository
2. Install frontend dependencies: `cd client && npm install`
3. Install backend dependencies: `cd server && npm install`
4. Copy `.env.example` to `.env` and configure
5. Start development servers:
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`

## 📄 License

This project is licensed under the MIT License.